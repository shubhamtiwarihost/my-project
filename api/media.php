<?php

declare(strict_types=1);

/**
 * Secure media file streaming from admin/storage/uploads.
 * Tracks resume downloads when ?download=1 is present.
 */

require __DIR__ . '/lib/Database.php';
require __DIR__ . '/lib/Tracker.php';

// Reuse config loader without forcing JSON content-type for file responses
function api_config(): array
{
    static $cfg;
    if ($cfg === null) {
        $cfg = require dirname(__DIR__) . '/admin/config/config.php';
    }
    return $cfg;
}

$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
if ($id <= 0) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['ok' => false, 'error' => 'Missing media id']);
    exit;
}

try {
    $stmt = Database::pdo()->prepare(
        'SELECT * FROM media WHERE id = :id AND deleted_at IS NULL AND is_active = 1 LIMIT 1'
    );
    $stmt->execute(['id' => $id]);
    $media = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$media) {
        http_response_code(404);
        exit('Not found');
    }

    $path = dirname(__DIR__) . '/admin/storage/uploads/' . ltrim((string) $media['path'], '/');
    if (!is_file($path)) {
        http_response_code(404);
        exit('File missing');
    }

    $download = isset($_GET['download']) && (string) $_GET['download'] === '1';
    if ($download || str_contains((string) $media['mime_type'], 'pdf')) {
        // count resume / PDF downloads when download flag set
        if ($download) {
            Tracker::trackDownload($id);
        }
    }

    $mime = (string) $media['mime_type'];
    header('Content-Type: ' . $mime);
    header('Content-Length: ' . (string) filesize($path));
    header('X-Content-Type-Options: nosniff');
    if ($download) {
        $name = $media['original_name'] ?: $media['filename'];
        header('Content-Disposition: attachment; filename="' . str_replace('"', '', $name) . '"');
    } else {
        header('Content-Disposition: inline; filename="' . str_replace('"', '', (string) $media['filename']) . '"');
        header('Cache-Control: public, max-age=86400');
    }

    readfile($path);
    exit;
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    $debug = (bool) (api_config()['debug'] ?? false);
    echo json_encode(['ok' => false, 'error' => $debug ? $e->getMessage() : 'Server error']);
    exit;
}
