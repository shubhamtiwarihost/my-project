<?php

declare(strict_types=1);

/**
 * IP → location lookup (country / region / city / ISP) via ipwho.is.
 * Shared by the public API and the admin panel.
 */
final class Geo
{
    public static function isPublicIp(string $ip): bool
    {
        return filter_var(
            $ip,
            FILTER_VALIDATE_IP,
            FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
        ) !== false;
    }

    /** Real visitor IP — the site sits behind Hostinger's CDN, so REMOTE_ADDR is the edge node. */
    public static function clientIp(): string
    {
        $candidates = [
            $_SERVER['HTTP_CF_CONNECTING_IP'] ?? '',
            $_SERVER['HTTP_X_REAL_IP'] ?? '',
        ];
        foreach (explode(',', (string) ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? '')) as $part) {
            $candidates[] = $part;
        }
        foreach ($candidates as $ip) {
            $ip = trim((string) $ip);
            if ($ip !== '' && self::isPublicIp($ip)) {
                return $ip;
            }
        }
        return (string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
    }

    /**
     * @return array{country:?string,region:?string,city:?string,isp:?string}|null null when unknown
     */
    public static function lookup(string $ip, float $timeout = 2.0): ?array
    {
        if (!self::isPublicIp($ip)) {
            return null;
        }

        $url = 'https://ipwho.is/' . rawurlencode($ip) . '?fields=success,country,region,city,connection';
        $raw = self::get($url, $timeout);
        if ($raw === null) {
            return null;
        }
        $data = json_decode($raw, true);
        if (!is_array($data) || empty($data['success'])) {
            return null;
        }

        $clean = static fn ($v, int $max): ?string => is_string($v) && trim($v) !== ''
            ? substr(trim($v), 0, $max)
            : null;

        return [
            'country' => $clean($data['country'] ?? null, 100),
            'region'  => $clean($data['region'] ?? null, 120),
            'city'    => $clean($data['city'] ?? null, 120),
            'isp'     => $clean($data['connection']['isp'] ?? ($data['connection']['org'] ?? null), 190),
        ];
    }

    private static function get(string $url, float $timeout): ?string
    {
        if (function_exists('curl_init')) {
            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CONNECTTIMEOUT_MS => (int) ($timeout * 1000),
                CURLOPT_TIMEOUT_MS     => (int) ($timeout * 1000),
                CURLOPT_USERAGENT      => 'portfolio-cms/1.0',
            ]);
            $body = curl_exec($ch);
            return is_string($body) && $body !== '' ? $body : null;
        }

        $ctx = stream_context_create(['http' => [
            'timeout'       => $timeout,
            'ignore_errors' => true,
            'user_agent'    => 'portfolio-cms/1.0',
        ]]);
        $body = @file_get_contents($url, false, $ctx);
        return is_string($body) && $body !== '' ? $body : null;
    }
}
