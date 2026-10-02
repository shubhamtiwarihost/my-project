<?php

declare(strict_types=1);

final class Tracker
{
    public static function parseUa(?string $ua): array
    {
        $ua = (string) $ua;
        $browser = 'Unknown';
        foreach (['Edg' => 'Edge', 'OPR' => 'Opera', 'Chrome' => 'Chrome', 'Firefox' => 'Firefox', 'Safari' => 'Safari'] as $n => $label) {
            if (stripos($ua, $n) !== false) {
                $browser = $label;
                break;
            }
        }

        $os = 'Unknown';
        // iOS user agents say "like Mac OS X", so check phones before desktop systems
        if (stripos($ua, 'iPhone') !== false || stripos($ua, 'iPad') !== false) {
            $os = 'iOS';
        } elseif (stripos($ua, 'Android') !== false) {
            $os = 'Android';
        } elseif (stripos($ua, 'Windows') !== false) {
            $os = 'Windows';
        } elseif (stripos($ua, 'Mac OS') !== false || stripos($ua, 'Macintosh') !== false) {
            $os = 'macOS';
        } elseif (stripos($ua, 'Linux') !== false) {
            $os = 'Linux';
        }

        $device = 'Desktop';
        if (stripos($ua, 'Mobile') !== false || stripos($ua, 'Android') !== false || stripos($ua, 'iPhone') !== false) {
            $device = 'Mobile';
        } elseif (stripos($ua, 'iPad') !== false || stripos($ua, 'Tablet') !== false) {
            $device = 'Tablet';
        }

        return compact('browser', 'os', 'device');
    }

    public static function trackVisit(array $input): void
    {
        $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $parsed = self::parseUa($ua);
        $stmt = Database::pdo()->prepare(
            'INSERT INTO visitors
             (ip_address, browser, device, operating_system, landing_page, referrer, country, city, session_id, user_agent, visited_at)
             VALUES
             (:ip, :browser, :device, :os, :landing, :referrer, :country, :city, :session_id, :ua, :at)'
        );
        $stmt->execute([
            'at'         => self::now(),
            'ip'         => Geo::clientIp(),
            'browser'    => $parsed['browser'],
            'device'     => $parsed['device'],
            'os'         => $parsed['os'],
            'landing'    => substr((string) ($input['landing_page'] ?? '/'), 0, 500),
            'referrer'   => substr((string) ($input['referrer'] ?? ($_SERVER['HTTP_REFERER'] ?? '')), 0, 500) ?: null,
            'country'    => isset($input['country']) ? substr((string) $input['country'], 0, 100) : null,
            'city'       => isset($input['city']) ? substr((string) $input['city'], 0, 120) : null,
            'session_id' => isset($input['session_id']) ? substr((string) $input['session_id'], 0, 64) : null,
            'ua'         => substr((string) $ua, 0, 500),
        ]);
    }

    /** Current time in the configured timezone (Asia/Kolkata), so admin dates match IST. */
    public static function now(): string
    {
        return date('Y-m-d H:i:s');
    }

    public static function isBot(string $ua): bool
    {
        return $ua === ''
            || preg_match('/bot|crawl|spider|slurp|preview|facebookexternalhit|headless|curl|wget|python|scrapy|monitor/i', $ua) === 1;
    }

    /**
     * Record one CV download: when, from where (IP → city/region/country), device and source.
     * Never throws — a tracking failure must not break the download.
     *
     * @param array{source?:string,referrer?:string} $meta
     */
    public static function trackDownload(?int $mediaId, array $meta = []): void
    {
        $ua = (string) ($_SERVER['HTTP_USER_AGENT'] ?? '');
        if (self::isBot($ua)) {
            return;
        }

        $parsed = self::parseUa($ua);
        $ip = Geo::clientIp();
        $source = preg_replace('/[^a-z0-9_-]/', '', strtolower((string) ($meta['source'] ?? ''))) ?: null;
        $referrer = trim((string) ($meta['referrer'] ?? '')) ?: (string) ($_SERVER['HTTP_REFERER'] ?? '');

        $row = [
            'media_id'      => $mediaId,
            'ip'            => $ip,
            'browser'       => $parsed['browser'],
            'device'        => $parsed['device'],
            'os'            => $parsed['os'],
            'country'       => null,
            'region'        => null,
            'city'          => null,
            'isp'           => null,
            'source'        => $source !== null ? substr($source, 0, 60) : null,
            'ua'            => substr($ua, 0, 500),
            'referrer'      => substr($referrer, 0, 500) ?: null,
            'downloaded_at' => self::now(),
        ];

        try {
            $pdo = Database::pdo();

            // Same visitor re-requesting within a few seconds (double click, download manager) = one download
            $dupe = $pdo->prepare(
                'SELECT COUNT(*) FROM resume_downloads
                 WHERE ip_address = :ip AND user_agent = :ua AND downloaded_at >= :since AND deleted_at IS NULL'
            );
            $dupe->execute(['ip' => $ip, 'ua' => $row['ua'], 'since' => date('Y-m-d H:i:s', time() - 15)]);
            if ((int) $dupe->fetchColumn() > 0) {
                return;
            }
        } catch (Throwable) {
            $pdo = null;
        }

        $geo = Geo::lookup($ip);
        if ($geo !== null) {
            $row = array_merge($row, $geo);
        }

        try {
            if ($pdo === null) {
                throw new RuntimeException('Database unavailable');
            }
            try {
                self::insertDownload($pdo, $row);
            } catch (Throwable) {
                self::ensureDownloadSchema($pdo);
                self::insertDownload($pdo, $row);
            }
            self::flushQueue($pdo);
        } catch (Throwable) {
            self::queue($row);
        }
    }

    public static function insertDownload(PDO $pdo, array $row): void
    {
        $stmt = $pdo->prepare(
            'INSERT INTO resume_downloads
             (media_id, ip_address, browser, device, operating_system, country, region, city, isp, source, user_agent, referrer, downloaded_at)
             VALUES
             (:media_id, :ip, :browser, :device, :os, :country, :region, :city, :isp, :source, :ua, :referrer, :downloaded_at)'
        );
        $stmt->execute([
            'media_id'      => $row['media_id'] ?? null,
            'ip'            => $row['ip'] ?? '0.0.0.0',
            'browser'       => $row['browser'] ?? null,
            'device'        => $row['device'] ?? null,
            'os'            => $row['os'] ?? null,
            'country'       => $row['country'] ?? null,
            'region'        => $row['region'] ?? null,
            'city'          => $row['city'] ?? null,
            'isp'           => $row['isp'] ?? null,
            'source'        => $row['source'] ?? null,
            'ua'            => $row['ua'] ?? null,
            'referrer'      => $row['referrer'] ?? null,
            'downloaded_at' => $row['downloaded_at'] ?? self::now(),
        ]);
    }

    /** Creates the table if missing and adds the columns newer than the original schema. */
    public static function ensureDownloadSchema(PDO $pdo): void
    {
        try {
            $pdo->exec(
                'CREATE TABLE IF NOT EXISTS resume_downloads (
                    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    media_id BIGINT UNSIGNED NULL,
                    ip_address VARCHAR(45) NOT NULL,
                    browser VARCHAR(100) NULL,
                    device VARCHAR(50) NULL,
                    operating_system VARCHAR(100) NULL,
                    country VARCHAR(100) NULL,
                    city VARCHAR(120) NULL,
                    user_agent VARCHAR(500) NULL,
                    referrer VARCHAR(500) NULL,
                    downloaded_at DATETIME NOT NULL,
                    deleted_at DATETIME NULL,
                    KEY idx_resume_downloads_downloaded_at (downloaded_at)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
            );
        } catch (Throwable) {
            // table already exists (or a non-MySQL driver in local dev)
        }

        foreach (['region' => 'VARCHAR(120)', 'isp' => 'VARCHAR(190)', 'source' => 'VARCHAR(60)'] as $column => $type) {
            try {
                $pdo->query("SELECT {$column} FROM resume_downloads LIMIT 1");
            } catch (Throwable) {
                $pdo->exec("ALTER TABLE resume_downloads ADD COLUMN {$column} {$type} NULL");
            }
        }
    }

    /** Fills in location for rows saved without one (lookup timed out or was rate limited). */
    public static function backfillGeo(PDO $pdo, int $limit = 5): void
    {
        $stmt = $pdo->prepare(
            'SELECT id, ip_address FROM resume_downloads
             WHERE country IS NULL AND deleted_at IS NULL
             ORDER BY id DESC LIMIT ' . max(1, $limit)
        );
        $stmt->execute();
        $update = $pdo->prepare(
            'UPDATE resume_downloads SET country = :country, region = :region, city = :city, isp = :isp WHERE id = :id'
        );
        foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $ip = (string) $row['ip_address'];
            $geo = Geo::isPublicIp($ip)
                ? Geo::lookup($ip, 1.5)
                : ['country' => 'Local network', 'region' => null, 'city' => null, 'isp' => null];
            if ($geo === null) {
                return; // service unreachable — try again on the next page load
            }
            $update->execute($geo + ['id' => $row['id']]);
        }
    }

    private static function queuePath(): string
    {
        return dirname(__DIR__, 2) . '/admin/storage/queue/cv-download-queue.jsonl';
    }

    /** Database down: keep the download on disk so it is not lost. */
    private static function queue(array $row): void
    {
        $path = self::queuePath();
        if (!is_dir(dirname($path))) {
            @mkdir(dirname($path), 0755, true);
        }
        @file_put_contents($path, json_encode($row, JSON_UNESCAPED_SLASHES) . "\n", FILE_APPEND | LOCK_EX);
    }

    /** Moves downloads queued while the database was down into the table. */
    public static function flushQueue(PDO $pdo): void
    {
        $path = self::queuePath();
        if (!is_file($path)) {
            return;
        }
        $work = $path . '.' . bin2hex(random_bytes(4));
        if (!@rename($path, $work)) {
            return;
        }
        foreach (file($work, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
            $row = json_decode($line, true);
            if (!is_array($row)) {
                continue;
            }
            try {
                self::insertDownload($pdo, $row);
            } catch (Throwable) {
                self::queue($row);
            }
        }
        @unlink($work);
    }

    public static function saveContact(array $input): int
    {
        $stmt = Database::pdo()->prepare(
            'INSERT INTO contact_messages (name, email, subject, phone, message, status, ip_address, user_agent)
             VALUES (:name, :email, :subject, :phone, :message, \'Unread\', :ip, :ua)'
        );
        $stmt->execute([
            'name'    => substr(trim((string) ($input['name'] ?? '')), 0, 150),
            'email'   => substr(trim((string) ($input['email'] ?? '')), 0, 190),
            'subject' => substr(trim((string) ($input['subject'] ?? '')), 0, 255),
            'phone'   => substr(trim((string) ($input['phone'] ?? '')), 0, 50) ?: null,
            'message' => trim((string) ($input['message'] ?? '')),
            'ip'      => Geo::clientIp(),
            'ua'      => substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 500),
        ]);
        return (int) Database::pdo()->lastInsertId();
    }
}
