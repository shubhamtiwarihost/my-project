<?php

declare(strict_types=1);

use App\Core\Csrf;

function e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function config(?string $key = null, mixed $default = null): mixed
{
    static $cfg;
    if ($cfg === null) {
        $cfg = require dirname(__DIR__, 2) . '/config/config.php';
    }
    if ($key === null) {
        return $cfg;
    }
    $parts = explode('.', $key);
    $val = $cfg;
    foreach ($parts as $p) {
        if (!is_array($val) || !array_key_exists($p, $val)) {
            return $default;
        }
        $val = $val[$p];
    }
    return $val;
}

function base_path(string $path = ''): string
{
    $root = dirname(__DIR__, 2);
    return $path === '' ? $root : $root . '/' . ltrim($path, '/');
}

/**
 * URL prefix the admin is being served under.
 * Works for both /admin/public/... (direct) and /admin/... (rewritten by admin/.htaccess).
 */
function app_base(): string
{
    $base = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/index.php')), '/');
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    if (str_ends_with($base, '/public') && !str_starts_with($uri . '/', $base . '/')) {
        $short = substr($base, 0, -strlen('/public'));
        if ($short === '' || str_starts_with($uri . '/', $short . '/')) {
            return $short;
        }
    }
    return $base;
}

function url(string $path = ''): string
{
    $configured = rtrim((string) config('app_url', ''), '/');
    if ($configured !== '') {
        return $configured . '/' . ltrim($path, '/');
    }

    $base = app_base();
    $path = ltrim($path, '/');
    return $base . ($path === '' ? ($base === '' ? '/' : '') : '/' . $path);
}

function redirect(string $path): never
{
    header('Location: ' . url(ltrim($path, '/')));
    exit;
}

function view(string $name, array $data = []): void
{
    extract($data, EXTR_SKIP);
    $file = base_path('app/Views/' . str_replace('.', '/', $name) . '.php');
    if (!is_file($file)) {
        http_response_code(500);
        echo 'View not found: ' . e($name);
        exit;
    }
    require $file;
}

function flash(string $key, ?string $message = null): ?string
{
    if ($message !== null) {
        $_SESSION['_flash'][$key] = $message;
        return null;
    }
    $val = $_SESSION['_flash'][$key] ?? null;
    unset($_SESSION['_flash'][$key]);
    return is_string($val) ? $val : null;
}

function csrf_field(): string
{
    return Csrf::field();
}

function method_field(string $method): string
{
    return '<input type="hidden" name="_method" value="' . e($method) . '">';
}

function active_nav(string $needle): string
{
    $uri = trim(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/', '/');
    $base = trim(app_base(), '/');
    if ($base !== '' && str_starts_with($uri, $base)) {
        $uri = trim(substr($uri, strlen($base)), '/');
    }
    if ($needle === '' || $needle === '/') {
        return $uri === '' ? 'active' : '';
    }
    $needle = trim($needle, '/');
    return $uri === $needle || str_starts_with($uri, $needle . '/') ? 'active' : '';
}

function format_bytes(int $bytes): string
{
    $units = ['B', 'KB', 'MB', 'GB'];
    $i = 0;
    $n = (float) $bytes;
    while ($n >= 1024 && $i < count($units) - 1) {
        $n /= 1024;
        $i++;
    }
    return round($n, 1) . ' ' . $units[$i];
}

/** "2026-10-02 15:04:05" → ['02 Oct 2026', '03:04:05 PM', 'Friday'] */
function split_datetime(?string $value): array
{
    $ts = $value ? strtotime($value) : false;
    if ($ts === false) {
        return ['-', '-', ''];
    }
    return [date('d M Y', $ts), date('h:i:s A', $ts), date('l', $ts)];
}

/** City, Region, Country — skipping parts that are missing. */
function format_location(array $row): string
{
    $parts = array_filter([
        $row['city'] ?? null,
        $row['region'] ?? null,
        $row['country'] ?? null,
    ], static fn ($v) => is_string($v) && $v !== '');
    $parts = array_values(array_unique($parts));
    return $parts ? implode(', ', $parts) : 'Unknown';
}

/** Where the visitor arrived from: "linkedin.com", "Direct", … */
function format_referrer(?string $referrer): string
{
    $referrer = trim((string) $referrer);
    if ($referrer === '' || $referrer === 'direct') {
        return 'Direct';
    }
    $host = parse_url(str_contains($referrer, '://') ? $referrer : 'https://' . $referrer, PHP_URL_HOST);
    $host = preg_replace('/^www\./', '', (string) $host);
    return $host !== '' ? $host : 'Direct';
}
