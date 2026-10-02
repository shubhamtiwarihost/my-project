<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Controller;
use App\Core\Csrf;
use App\Core\Database;
use App\Models\AuditLog;
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

    /** WHERE clause + params for the download filters (date range, search). */
    private function downloadFilters(): array
    {
        $q = trim((string) ($_GET['q'] ?? ''));
        $from = (string) ($_GET['from'] ?? '');
        $to = (string) ($_GET['to'] ?? '');
        $isDate = static fn (string $d): bool => preg_match('/^\d{4}-\d{2}-\d{2}$/', $d) === 1;
        $from = $isDate($from) ? $from : '';
        $to = $isDate($to) ? $to : '';

        $where = 'deleted_at IS NULL';
        $params = [];
        if ($from !== '') {
            $where .= ' AND downloaded_at >= :from';
            $params['from'] = $from . ' 00:00:00';
        }
        if ($to !== '') {
            $where .= ' AND downloaded_at <= :to';
            $params['to'] = $to . ' 23:59:59';
        }
        if ($q !== '') {
            $like = '%' . $q . '%';
            $where .= ' AND (ip_address LIKE :q1 OR browser LIKE :q2 OR country LIKE :q3 OR city LIKE :q4
                        OR region LIKE :q5 OR referrer LIKE :q6 OR isp LIKE :q7)';
            foreach (range(1, 7) as $i) {
                $params['q' . $i] = $like;
            }
        }

        return [$where, $params, compact('q', 'from', 'to')];
    }

    public function downloads(): void
    {
        $this->requireAuth();
        $pdo = Database::connection();

        try {
            \Tracker::ensureDownloadSchema($pdo);
            \Tracker::flushQueue($pdo);
            \Tracker::backfillGeo($pdo);
        } catch (\Throwable) {
            // analytics still render; location is retried on the next load
        }

        [$where, $params, $filters] = $this->downloadFilters();

        $perPage = 50;
        $page = max(1, (int) ($_GET['page'] ?? 1));

        $count = $pdo->prepare("SELECT COUNT(*) FROM resume_downloads WHERE {$where}");
        $count->execute($params);
        $matching = (int) $count->fetchColumn();
        $pages = max(1, (int) ceil($matching / $perPage));
        $page = min($page, $pages);

        $stmt = $pdo->prepare(
            "SELECT * FROM resume_downloads WHERE {$where}
             ORDER BY downloaded_at DESC, id DESC
             LIMIT {$perPage} OFFSET " . (($page - 1) * $perPage)
        );
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        $unique = $pdo->prepare("SELECT COUNT(DISTINCT ip_address) FROM resume_downloads WHERE {$where}");
        $unique->execute($params);

        // Downloads per day, last 30 days (independent of the filters)
        $since = date('Y-m-d', strtotime('-29 days'));
        $daily = $pdo->prepare(
            'SELECT DATE(downloaded_at) AS day, COUNT(*) AS c FROM resume_downloads
             WHERE deleted_at IS NULL AND downloaded_at >= :since
             GROUP BY DATE(downloaded_at)'
        );
        $daily->execute(['since' => $since . ' 00:00:00']);
        $perDay = [];
        foreach ($daily->fetchAll() as $d) {
            $perDay[(string) $d['day']] = (int) $d['c'];
        }
        $chart = [];
        for ($i = 29; $i >= 0; $i--) {
            $day = date('Y-m-d', strtotime("-{$i} days"));
            $chart[] = ['day' => $day, 'count' => $perDay[$day] ?? 0];
        }

        $locations = $pdo->prepare(
            "SELECT city, region, country, COUNT(*) AS c FROM resume_downloads WHERE {$where}
             GROUP BY city, region, country ORDER BY c DESC LIMIT 8"
        );
        $locations->execute($params);

        $devices = $pdo->prepare(
            "SELECT device, COUNT(*) AS c FROM resume_downloads WHERE {$where} GROUP BY device ORDER BY c DESC"
        );
        $devices->execute($params);

        $refs = $pdo->prepare(
            "SELECT referrer, COUNT(*) AS c FROM resume_downloads WHERE {$where} GROUP BY referrer"
        );
        $refs->execute($params);
        $sources = [];
        foreach ($refs->fetchAll() as $r) {
            $label = format_referrer($r['referrer']);
            $sources[$label] = ($sources[$label] ?? 0) + (int) $r['c'];
        }
        arsort($sources);

        $last = $pdo->query(
            'SELECT downloaded_at FROM resume_downloads WHERE deleted_at IS NULL ORDER BY downloaded_at DESC LIMIT 1'
        )->fetchColumn();

        $this->render('analytics.downloads', [
            'title'     => 'CV Downloads',
            'rows'      => $rows,
            'filters'   => $filters,
            'matching'  => $matching,
            'page'      => $page,
            'pages'     => $pages,
            'perPage'   => $perPage,
            'stats'     => [
                'total'  => Dashboard::count('resume_downloads'),
                'today'  => Dashboard::downloadsToday(),
                'week'   => Dashboard::downloadsWeek(),
                'month'  => Dashboard::downloadsMonth(),
                'unique' => (int) $unique->fetchColumn(),
                'last'   => $last ?: null,
            ],
            'chart'     => $chart,
            'locations' => $locations->fetchAll(),
            'devices'   => $devices->fetchAll(),
            'sources'   => array_slice($sources, 0, 8, true),
            'success'   => flash('success'),
            'unread'    => Dashboard::unreadMessages(),
        ]);
    }

    public function exportDownloads(): void
    {
        $this->requireAuth();
        [$where, $params] = $this->downloadFilters();
        $stmt = Database::connection()->prepare(
            "SELECT * FROM resume_downloads WHERE {$where} ORDER BY downloaded_at DESC, id DESC"
        );
        $stmt->execute($params);

        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=cv_downloads_' . date('Y-m-d') . '.csv');
        $out = fopen('php://output', 'w');
        if ($out === false) {
            exit;
        }
        fputcsv($out, ['id', 'date', 'time', 'day', 'city', 'region', 'country', 'ip_address', 'isp', 'device', 'operating_system', 'browser', 'came_from', 'button', 'media_id'], ',', '"', '');
        foreach ($stmt->fetchAll() as $row) {
            [$date, $time, $day] = split_datetime($row['downloaded_at']);
            fputcsv($out, [
                $row['id'], $date, $time, $day,
                $row['city'] ?? '', $row['region'] ?? '', $row['country'] ?? '',
                $row['ip_address'], $row['isp'] ?? '',
                $row['device'] ?? '', $row['operating_system'] ?? '', $row['browser'] ?? '',
                format_referrer($row['referrer'] ?? ''), $row['source'] ?? '', $row['media_id'] ?? '',
            ], ',', '"', '');
        }
        fclose($out);
        exit;
    }

    public function deleteDownload(string $id): void
    {
        $this->requireAuth();
        Csrf::requireValid();
        $did = (int) $id;
        Database::connection()->prepare(
            'UPDATE resume_downloads SET deleted_at = :at WHERE id = :id'
        )->execute(['at' => date('Y-m-d H:i:s'), 'id' => $did]);
        AuditLog::write(Auth::id(), 'soft_delete', 'resume_downloads', $did, null, null);
        flash('success', 'Download entry removed.');
        redirect('/analytics/downloads');
    }
}
