<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    api_error('Method not allowed', 405);
}

try {
    $body = api_body();
    $mediaId = isset($body['media_id']) && $body['media_id'] !== '' ? (int) $body['media_id'] : null;
    Tracker::trackDownload($mediaId);
    api_json(['ok' => true]);
} catch (Throwable $e) {
    $debug = (bool) (api_config()['debug'] ?? false);
    api_error($debug ? $e->getMessage() : 'Tracking failed', 500);
}
