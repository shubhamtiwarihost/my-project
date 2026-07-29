<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Controller;
use App\Core\Csrf;
use App\Core\Database;
use App\Models\AuditLog;
use App\Models\Section;

final class SectionController extends Controller
{
    public function index(): void
    {
        $this->requireAuth();
        $this->render('sections.index', [
            'title'    => 'Sections',
            'sections' => Section::allActive(),
            'unread'   => \App\Models\Dashboard::unreadMessages(),
        ]);
    }

    public function edit(string $slug): void
    {
        $this->requireAuth();
        $section = Section::findBySlug($slug);
        if (!$section) {
            http_response_code(404);
            view('partials.404', ['title' => 'Section not found']);
            return;
        }

        $defs = Section::fieldDefinitions((int) $section['id']);
        $itemTypes = array_values(array_unique(array_map(
            static fn ($d) => $d['item_type'],
            $defs
        )));

        $singleton = null;
        $singletonValues = [];
        if (in_array('default', $itemTypes, true) || $section['section_type'] !== 'collection') {
            $singleton = Section::ensureSingletonItem((int) $section['id'], 'default');
            $singletonValues = Section::valuesForItem((int) $singleton['id']);
        }

        $collectionTypes = array_values(array_filter($itemTypes, static fn ($t) => $t !== 'default'));
        $collections = [];
        foreach ($collectionTypes as $type) {
            $collections[$type] = [
                'definitions' => array_values(array_filter($defs, static fn ($d) => $d['item_type'] === $type)),
                'items' => array_map(static function ($item) {
                    $item['values'] = Section::valuesForItem((int) $item['id']);
                    return $item;
                }, Section::items((int) $section['id'], $type)),
            ];
        }

        $this->render('sections.edit', [
            'title'            => $section['name'],
            'section'          => $section,
            'definitions'      => $defs,
            'singleton'        => $singleton,
            'singletonValues'  => $singletonValues,
            'collections'      => $collections,
            'success'          => flash('success'),
            'error'            => flash('error'),
            'unread'           => \App\Models\Dashboard::unreadMessages(),
        ]);
    }

    public function save(string $slug): void
    {
        $this->requireAuth();
        Csrf::requireValid();

        $section = Section::findBySlug($slug);
        if (!$section) {
            flash('error', 'Section not found.');
            redirect('/sections');
        }

        $item = Section::ensureSingletonItem((int) $section['id'], 'default');
        $defs = array_filter(
            Section::fieldDefinitions((int) $section['id']),
            static fn ($d) => $d['item_type'] === 'default'
        );

        $posted = $_POST['fields'] ?? [];
        if (!is_array($posted)) {
            $posted = [];
        }

        foreach ($defs as $def) {
            $key = $def['field_key'];
            $raw = $posted[$key] ?? null;
            $mediaId = null;
            $text = null;

            if (in_array($def['field_type'], ['image', 'file', 'pdf'], true)) {
                $mediaId = ($raw !== null && $raw !== '') ? (int) $raw : null;
                $text = $mediaId !== null ? (string) $mediaId : null;
            } else {
                $text = is_array($raw) ? json_encode($raw) : (string) ($raw ?? '');
            }

            Section::upsertValue((int) $item['id'], (int) $def['id'], $text, $mediaId);
        }

        AuditLog::write(Auth::id(), 'update', 'section_items', (int) $item['id'], null, $posted);
        flash('success', 'Section saved successfully.');
        redirect('/sections/' . $slug);
    }

    public function saveItem(string $slug): void
    {
        $this->requireAuth();
        Csrf::requireValid();

        $section = Section::findBySlug($slug);
        if (!$section) {
            flash('error', 'Section not found.');
            redirect('/sections');
        }

        $itemType = trim((string) ($_POST['item_type'] ?? ''));
        $itemId   = (int) ($_POST['item_id'] ?? 0);
        $label    = trim((string) ($_POST['label'] ?? 'Item'));
        $posted   = $_POST['fields'] ?? [];
        if (!is_array($posted)) {
            $posted = [];
        }

        if ($itemType === '') {
            flash('error', 'Item type is required.');
            redirect('/sections/' . $slug);
        }

        if ($itemId > 0) {
            $item = Section::findItem($itemId);
            if (!$item || (int) $item['section_id'] !== (int) $section['id']) {
                flash('error', 'Invalid item.');
                redirect('/sections/' . $slug);
            }
        } else {
            $itemId = Section::createItem((int) $section['id'], $itemType, $label !== '' ? $label : ucfirst($itemType));
            $item = Section::findItem($itemId);
        }

        $defs = array_filter(
            Section::fieldDefinitions((int) $section['id']),
            static fn ($d) => $d['item_type'] === $itemType
        );

        foreach ($defs as $def) {
            $key = $def['field_key'];
            $raw = $posted[$key] ?? null;
            $mediaId = null;
            $text = null;
            if (in_array($def['field_type'], ['image', 'file', 'pdf'], true)) {
                $mediaId = ($raw !== null && $raw !== '') ? (int) $raw : null;
                $text = $mediaId !== null ? (string) $mediaId : null;
            } else {
                $text = is_array($raw) ? json_encode($raw) : (string) ($raw ?? '');
            }
            Section::upsertValue((int) $itemId, (int) $def['id'], $text, $mediaId);
        }

        // refresh label from first text-like field if present
        if (!empty($posted['title']) || !empty($posted['role']) || !empty($posted['label'])) {
            $newLabel = (string) ($posted['title'] ?? $posted['role'] ?? $posted['label'] ?? $label);
            $pdo = \App\Core\Database::connection();
            $stmt = $pdo->prepare('UPDATE section_items SET label = :label WHERE id = :id');
            $stmt->execute(['label' => $newLabel, 'id' => $itemId]);
        }

        AuditLog::write(Auth::id(), $itemId ? 'update' : 'create', 'section_items', $itemId, null, $posted);
        flash('success', 'Item saved.');
        redirect('/sections/' . $slug);
    }

    public function deleteItem(string $id): void
    {
        $this->requireAuth();
        Csrf::requireValid();
        $itemId = (int) $id;
        $item = Section::findItem($itemId);
        if ($item) {
            Section::softDeleteItem($itemId);
            AuditLog::write(Auth::id(), 'soft_delete', 'section_items', $itemId, $item, null);
            $stmt = Database::connection()->prepare('SELECT slug FROM sections WHERE id = :id');
            $stmt->execute(['id' => $item['section_id']]);
            $slug = (string) ($stmt->fetchColumn() ?: '');
            flash('success', 'Item deleted.');
            redirect('/sections/' . $slug);
        }
        redirect('/sections');
    }
}
