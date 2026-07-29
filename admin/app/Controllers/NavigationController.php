<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Controller;
use App\Core\Csrf;
use App\Core\Database;
use App\Models\AuditLog;
use App\Models\Dashboard;

final class NavigationController extends Controller
{
    public function index(): void
    {
        $this->requireAuth();
        $stmt = Database::connection()->query(
            'SELECT * FROM navigation_items WHERE deleted_at IS NULL ORDER BY sort_order ASC, id ASC'
        );
        $this->render('navigation.index', [
            'title'  => 'Navigation',
            'items'  => $stmt->fetchAll(),
            'success'=> flash('success'),
            'unread' => Dashboard::unreadMessages(),
        ]);
    }

    public function save(): void
    {
        $this->requireAuth();
        Csrf::requireValid();
        $pdo = Database::connection();
        $id = (int) ($_POST['id'] ?? 0);
        $data = [
            'title'      => trim((string) ($_POST['title'] ?? '')),
            'url'        => trim((string) ($_POST['url'] ?? '')),
            'icon'       => trim((string) ($_POST['icon'] ?? '')),
            'target'     => ($_POST['target'] ?? '_self') === '_blank' ? '_blank' : '_self',
            'location'   => in_array($_POST['location'] ?? '', ['header', 'footer', 'both'], true) ? $_POST['location'] : 'header',
            'is_active'  => isset($_POST['is_active']) ? 1 : 0,
            'sort_order' => (int) ($_POST['sort_order'] ?? 0),
        ];

        if ($data['title'] === '' || $data['url'] === '') {
            flash('error', 'Title and URL are required.');
            redirect('/navigation');
        }

        if ($id > 0) {
            $stmt = $pdo->prepare(
                'UPDATE navigation_items SET title=:title, url=:url, icon=:icon, target=:target,
                 location=:location, is_active=:is_active, sort_order=:sort_order WHERE id=:id AND deleted_at IS NULL'
            );
            $data['id'] = $id;
            $stmt->execute($data);
            AuditLog::write(Auth::id(), 'update', 'navigation_items', $id, null, $data);
        } else {
            $stmt = $pdo->prepare(
                'INSERT INTO navigation_items (title, url, icon, target, location, is_active, sort_order)
                 VALUES (:title, :url, :icon, :target, :location, :is_active, :sort_order)'
            );
            $stmt->execute($data);
            AuditLog::write(Auth::id(), 'create', 'navigation_items', (int) $pdo->lastInsertId(), null, $data);
        }
        flash('success', 'Navigation saved.');
        redirect('/navigation');
    }

    public function delete(string $id): void
    {
        $this->requireAuth();
        Csrf::requireValid();
        $nid = (int) $id;
        $stmt = Database::connection()->prepare(
            'UPDATE navigation_items SET deleted_at = NOW(), is_active = 0 WHERE id = :id'
        );
        $stmt->execute(['id' => $nid]);
        AuditLog::write(Auth::id(), 'soft_delete', 'navigation_items', $nid, null, null);
        flash('success', 'Navigation item deleted.');
        redirect('/navigation');
    }
}
