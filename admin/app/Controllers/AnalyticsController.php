<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Database;
use App\Models\Dashboard;

final class AnalyticsController extends Controller
{
    public function visitors(): void
    {
        $this->requireAuth();
        $q = trim((string) ($_GET['q'] ?? ''));
        $sql = 'SELECT * FROM visitors WHERE deleted_at IS NULL';
        $params = [];
        if ($q !== '') {
            $sql .= ' AND (ip_address LIKE :q OR landing_page LIKE :q OR browser LIKE :q OR country LIKE :q)';
            $params['q'] = '%' . $q . '%';
        }
        $sql .= ' ORDER BY visited_at DESC LIMIT 200';
        $stmt = Database::connection()->prepare($sql);
        $stmt->execute($params);

        $this->render('analytics.visitors', [
            'title'    => 'Visitor Analytics',
            'rows'     => $stmt->fetchAll(),
            'q'        => $q,
            'stats'    => [
                'total'   => Dashboard::count('visitors'),
                'today'   => Dashboard::visitorsToday(),
                'month'   => Dashboard::visitorsMonth(),
            ],
            'topPages' => Dashboard::topPages(10),
            'unread'   => Dashboard::unreadMessages(),
        ]);
    }

    public function downloads(): void
    {
        $this->requireAuth();
        $q = trim((string) ($_GET['q'] ?? ''));
        $sql = 'SELECT * FROM resume_downloads WHERE deleted_at IS NULL';
        $params = [];
        if ($q !== '') {
            $sql .= ' AND (ip_address LIKE :q OR browser LIKE :q OR country LIKE :q OR city LIKE :q)';
            $params['q'] = '%' . $q . '%';
        }
        $sql .= ' ORDER BY downloaded_at DESC LIMIT 200';
        $stmt = Database::connection()->prepare($sql);
        $stmt->execute($params);

        $this->render('analytics.downloads', [
            'title'  => 'Resume Downloads',
            'rows'   => $stmt->fetchAll(),
            'q'      => $q,
            'stats'  => [
                'total' => Dashboard::count('resume_downloads'),
                'today' => Dashboard::downloadsToday(),
                'month' => Dashboard::downloadsMonth(),
            ],
            'unread' => Dashboard::unreadMessages(),
        ]);
    }

    public function exportDownloads(): void
    {
        $this->requireAuth();
        $stmt = Database::connection()->query(
            'SELECT id, media_id, ip_address, browser, device, operating_system, country, city, downloaded_at
             FROM resume_downloads WHERE deleted_at IS NULL ORDER BY downloaded_at DESC'
        );
        $rows = $stmt->fetchAll();

        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=resume_downloads.csv');
        $out = fopen('php://output', 'w');
        if ($out === false) {
            exit;
        }
        fputcsv($out, ['id', 'media_id', 'ip_address', 'browser', 'device', 'operating_system', 'country', 'city', 'downloaded_at']);
        foreach ($rows as $row) {
            fputcsv($out, $row);
        }
        fclose($out);
        exit;
    }
}
