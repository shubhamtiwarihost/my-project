<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    api_error('Method not allowed', 405);
}

try {
    $body = api_body();
    Tracker::trackVisit($body);
    api_json(['ok' => true]);
} catch (Throwable $e) {
    $debug = (bool) (api_config()['debug'] ?? false);
    api_error($debug ? $e->getMessage() : 'Tracking failed', 500);
}
