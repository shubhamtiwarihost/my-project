<?php

declare(strict_types=1);

/**
 * Tracked CV download.
 * The "Download CV" buttons link here: the PDF is sent first, then the download
 * is recorded (date, time, location, device, source) for the admin panel.
 *
 *   /api/cv.php?src=hero&from=linkedin.com
 */

require __DIR__ . '/lib/Database.php';
require __DIR__ . '/lib/Geo.php';
require __DIR__ . '/lib/Tracker.php';

function api_config(): array
{
    static $cfg;
    if ($cfg === null) {
        $cfg = require dirname(__DIR__) . '/admin/config/config.php';
        date_default_timezone_set($cfg['timezone'] ?? 'Asia/Kolkata');
    }
    return $cfg;
}

api_config();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'GET' && $method !== 'HEAD') {
    http_response_code(405);
    exit('Method not allowed');
}

$root = dirname(__DIR__);
$path = null;
$name = 'Shubham_Tiwari_CV.pdf';
$mediaId = null;

// 1) Resume published from the admin panel
try {
    $pdo = Database::pdo();
    $stmt = $pdo->prepare(
        'SELECT m.id, m.path, m.original_name, m.filename
         FROM site_settings s
         INNER JOIN media m ON m.id = s.media_id
         WHERE s.setting_key = :key AND s.deleted_at IS NULL
           AND m.deleted_at IS NULL AND m.is_active = 1
         LIMIT 1'
    );
    $stmt->execute(['key' => 'resume_media_id']);
    $media = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($media) {
        $candidate = $root . '/admin/storage/uploads/' . ltrim((string) $media['path'], '/');
        if (is_file($candidate)) {
            $path = $candidate;
            $name = (string) ($media['original_name'] ?: $media['filename']);
            $mediaId = (int) $media['id'];
        }
    }
} catch (Throwable) {
    // database down — fall through to the bundled PDF
}

// 2) PDF shipped with the site build
if ($path === null) {
    foreach ([$root . '/Shubham_Tiwari_CV.pdf', $root . '/public/Shubham_Tiwari_CV.pdf'] as $candidate) {
        if (is_file($candidate)) {
            $path = $candidate;
            break;
        }
    }
}

if ($path === null) {
    http_response_code(404);
    exit('Resume not available');
}

header('Content-Type: application/pdf');
header('Content-Length: ' . (string) filesize($path));
header('Content-Disposition: attachment; filename="' . str_replace(['"', "\r", "\n"], '', $name) . '"');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, max-age=0');
header('X-Robots-Tag: noindex');

if ($method === 'HEAD') {
    exit;
}

readfile($path);

// Hand the file to the visitor before the (slower) location lookup
ignore_user_abort(true);
if (function_exists('fastcgi_finish_request')) {
    fastcgi_finish_request();
} elseif (function_exists('litespeed_finish_request')) {
    litespeed_finish_request();
} else {
    flush();
}

$from = trim((string) ($_GET['from'] ?? ''));
Tracker::trackDownload($mediaId, [
    'source'   => (string) ($_GET['src'] ?? ''),
    'referrer' => $from,
]);
