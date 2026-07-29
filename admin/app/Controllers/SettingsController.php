<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Controller;
use App\Core\Csrf;
use App\Core\Database;
use App\Models\AuditLog;
use App\Models\Dashboard;

final class SettingsController extends Controller
{
    public function index(): void
    {
        $this->requireAuth();
        $stmt = Database::connection()->query(
            'SELECT * FROM site_settings WHERE deleted_at IS NULL ORDER BY setting_group ASC, sort_order ASC'
        );
        $rows = $stmt->fetchAll();
        $grouped = [];
        foreach ($rows as $row) {
            $grouped[$row['setting_group']][] = $row;
        }
        $this->render('settings.index', [
            'title'   => 'Website Settings',
            'grouped' => $grouped,
            'success' => flash('success'),
            'unread'  => Dashboard::unreadMessages(),
        ]);
    }

    public function save(): void
    {
        $this->requireAuth();
        Csrf::requireValid();
        $settings = $_POST['settings'] ?? [];
        if (!is_array($settings)) {
            redirect('/settings');
        }
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'UPDATE site_settings SET setting_value = :val, media_id = :mid WHERE id = :id AND deleted_at IS NULL'
        );
        foreach ($settings as $id => $value) {
            $id = (int) $id;
            $mid = null;
            $val = is_array($value) ? json_encode($value) : (string) $value;
            // media-type settings may store media id in value
            if (ctype_digit($val) && $val !== '') {
                // keep as value; media_id updated only when explicitly media type handled later
            }
            $stmt->execute(['val' => $val, 'mid' => $mid, 'id' => $id]);
        }
        AuditLog::write(Auth::id(), 'update', 'site_settings', null, null, $settings);
        flash('success', 'Settings saved.');
        redirect('/settings');
    }
}
