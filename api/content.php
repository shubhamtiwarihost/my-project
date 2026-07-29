<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

try {
    $payload = ContentBuilder::build(api_base_url());
    api_json($payload);
} catch (Throwable $e) {
    $debug = (bool) (api_config()['debug'] ?? false);
    api_error($debug ? $e->getMessage() : 'Failed to load content', 500);
}
