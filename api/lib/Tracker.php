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
        if (stripos($ua, 'Windows') !== false) {
            $os = 'Windows';
        } elseif (stripos($ua, 'Mac OS') !== false || stripos($ua, 'Macintosh') !== false) {
            $os = 'macOS';
        } elseif (stripos($ua, 'Android') !== false) {
            $os = 'Android';
        } elseif (stripos($ua, 'iPhone') !== false || stripos($ua, 'iPad') !== false) {
            $os = 'iOS';
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
             (:ip, :browser, :device, :os, :landing, :referrer, :country, :city, :session_id, :ua, NOW())'
        );
        $stmt->execute([
            'ip'         => $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0',
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

    public static function trackDownload(?int $mediaId): void
    {
        $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $parsed = self::parseUa($ua);
        $stmt = Database::pdo()->prepare(
            'INSERT INTO resume_downloads
             (media_id, ip_address, browser, device, operating_system, country, city, user_agent, referrer, downloaded_at)
             VALUES
             (:media_id, :ip, :browser, :device, :os, NULL, NULL, :ua, :referrer, NOW())'
        );
        $stmt->execute([
            'media_id' => $mediaId,
            'ip'       => $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0',
            'browser'  => $parsed['browser'],
            'device'   => $parsed['device'],
            'os'       => $parsed['os'],
            'ua'       => substr((string) $ua, 0, 500),
            'referrer' => substr((string) ($_SERVER['HTTP_REFERER'] ?? ''), 0, 500) ?: null,
        ]);
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
            'ip'      => $_SERVER['REMOTE_ADDR'] ?? null,
            'ua'      => substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 500),
        ]);
        return (int) Database::pdo()->lastInsertId();
    }
}
