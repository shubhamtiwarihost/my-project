<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Controller;
use App\Core\Csrf;
use App\Core\Database;
use App\Models\AuditLog;
use App\Models\Dashboard;

final class SocialController extends Controller
{
    public function index(): void
    {
        $this->requireAuth();
        $stmt = Database::connection()->query(
            'SELECT * FROM social_links WHERE deleted_at IS NULL ORDER BY sort_order ASC'
        );
        $this->render('social.index', [
            'title'  => 'Social Links',
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
            'platform'   => trim((string) ($_POST['platform'] ?? '')),
            'label'      => trim((string) ($_POST['label'] ?? '')),
            'url'        => trim((string) ($_POST['url'] ?? '')),
            'icon_key'   => trim((string) ($_POST['icon_key'] ?? '')),
            'is_active'  => isset($_POST['is_active']) ? 1 : 0,
            'sort_order' => (int) ($_POST['sort_order'] ?? 0),
        ];
        if ($data['platform'] === '' || $data['url'] === '') {
            flash('error', 'Platform and URL required.');
            redirect('/social');
        }
        if ($id > 0) {
            $stmt = $pdo->prepare(
                'UPDATE social_links SET platform=:platform, label=:label, url=:url, icon_key=:icon_key,
                 is_active=:is_active, sort_order=:sort_order WHERE id=:id'
            );
            $data['id'] = $id;
            $stmt->execute($data);
        } else {
            $stmt = $pdo->prepare(
                'INSERT INTO social_links (platform, label, url, icon_key, is_active, sort_order)
                 VALUES (:platform, :label, :url, :icon_key, :is_active, :sort_order)'
            );
            $stmt->execute($data);
            $id = (int) $pdo->lastInsertId();
        }
        AuditLog::write(Auth::id(), 'update', 'social_links', $id, null, $data);
        flash('success', 'Social link saved.');
        redirect('/social');
    }

    public function delete(string $id): void
    {
        $this->requireAuth();
        Csrf::requireValid();
        $sid = (int) $id;
        Database::connection()->prepare(
            'UPDATE social_links SET deleted_at = NOW(), is_active = 0 WHERE id = :id'
        )->execute(['id' => $sid]);
        AuditLog::write(Auth::id(), 'soft_delete', 'social_links', $sid, null, null);
        flash('success', 'Deleted.');
        redirect('/social');
    }
}
