<?php

declare(strict_types=1);

use App\Core\Autoloader;
use App\Core\Router;

require dirname(__DIR__) . '/app/Core/Autoloader.php';
Autoloader::register();
require dirname(__DIR__) . '/app/Helpers/functions.php';

$cfg = config();
date_default_timezone_set($cfg['timezone'] ?? 'UTC');

session_name($cfg['session']['name'] ?? 'portfolio_cms_session');
session_start([
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax',
    'use_strict_mode' => true,
]);

$scriptName = $_SERVER['SCRIPT_NAME'] ?? '/index.php';
$basePath = rtrim(str_replace('\\', '/', dirname($scriptName)), '/');
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
$router->dispatch($_SERVER['REQUEST_METHOD'] ?? 'GET', $path);
