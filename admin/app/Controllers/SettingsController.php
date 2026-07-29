<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Controller;
use App\Core\Csrf;
use App\Core\Database;
use App\Models\AuditLog;
use App\Models\Dashboard;
use App\Services\ResumeService;

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
        $fetch = $pdo->prepare(
            'SELECT id, setting_key, value_type FROM site_settings WHERE id = :id AND deleted_at IS NULL LIMIT 1'
        );
        $update = $pdo->prepare(
            'UPDATE site_settings SET setting_value = :val, media_id = :mid, updated_at = NOW() WHERE id = :id AND deleted_at IS NULL'
        );

        $resumeMediaId = null;

        foreach ($settings as $id => $value) {
            $id = (int) $id;
            $fetch->execute(['id' => $id]);
            $row = $fetch->fetch();
            if (!$row) {
                continue;
            }

            $val = is_array($value) ? json_encode($value) : (string) $value;
            $mid = null;

            if ($row['value_type'] === 'media') {
                if ($val !== '' && ctype_digit($val)) {
                    $mid = (int) $val;
                    $val = (string) $mid;
                } else {
                    $mid = null;
                    $val = '';
                }
                if ($row['setting_key'] === 'resume_media_id' && $mid) {
                    $resumeMediaId = $mid;
                }
            }

            $update->execute(['val' => $val, 'mid' => $mid, 'id' => $id]);
        }

        if ($resumeMediaId) {
            try {
                ResumeService::setActive($resumeMediaId);
            } catch (\Throwable) {
                // setting row already saved; profile sync is best-effort
            }
        }

        AuditLog::write(Auth::id(), 'update', 'site_settings', null, null, $settings);
        flash('success', 'Settings saved.');
        redirect('/settings');
    }
}
