<?php

declare(strict_types=1);

/**
 * Shared API bootstrap — CORS, JSON helpers, PDO.
 */

header('Content-Type: application/json; charset=utf-8');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allow = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
];
$host = parse_url($origin, PHP_URL_HOST) ?: '';
$allowedHost = $host !== '' && (
    str_ends_with($host, 'gyaando.com')
    || str_ends_with($host, 'shubhamprofile.info')
);
if ($origin !== '' && (in_array($origin, $allow, true) || $allowedHost)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
} else {
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/lib/Database.php';
require __DIR__ . '/lib/ContentBuilder.php';
require __DIR__ . '/lib/Tracker.php';

function api_config(): array
{
    static $cfg;
    if ($cfg === null) {
        $cfg = require dirname(__DIR__) . '/admin/config/config.php';
    }
    return $cfg;
}

function api_json(mixed $data, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function api_error(string $message, int $status = 400): never
{
    api_json(['ok' => false, 'error' => $message], $status);
}

function api_body(): array
{
    $raw = file_get_contents('php://input') ?: '';
    $json = json_decode($raw, true);
    if (is_array($json)) {
        return $json;
    }
    return $_POST;
}

function api_base_url(): string
{
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['SERVER_PORT'] ?? null) === '443');
    $scheme = $https ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $script = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/api'));
    return rtrim($scheme . '://' . $host . $script, '/');
}
