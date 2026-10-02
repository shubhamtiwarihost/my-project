<?php

declare(strict_types=1);

use App\Core\Autoloader;
use App\Core\Router;

require dirname(__DIR__) . '/app/Core/Autoloader.php';
Autoloader::register();
require dirname(__DIR__) . '/app/Helpers/functions.php';

// Download tracking helpers shared with the public API
require dirname(__DIR__, 2) . '/api/lib/Geo.php';
require dirname(__DIR__, 2) . '/api/lib/Tracker.php';

$cfg = config();
date_default_timezone_set($cfg['timezone'] ?? 'UTC');

session_name($cfg['session']['name'] ?? 'portfolio_cms_session');
session_start([
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax',
    'use_strict_mode' => true,
]);

$basePath = app_base();
$requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$path = $requestUri;

if ($basePath !== '' && str_starts_with($path, $basePath)) {
    $path = substr($path, strlen($basePath)) ?: '/';
}

$path = '/' . trim($path, '/');
if ($path !== '/') {
    $path = rtrim($path, '/');
}

$routes = require dirname(__DIR__) . '/config/routes.php';
$router = new Router($routes);
try {
    $router->dispatch($_SERVER['REQUEST_METHOD'] ?? 'GET', $path);
} catch (PDOException $e) {
    // 42S02 = table missing: the database has not been set up yet
    if ($e->getCode() === '42S02') {
        header('Location: ' . url('install.php'));
        exit;
    }
    http_response_code(500);
    exit(($cfg['debug'] ?? false) ? 'Database error: ' . e($e->getMessage()) : 'Something went wrong. Please try again.');
}
