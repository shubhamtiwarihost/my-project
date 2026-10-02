<?php
/**
 * Admin CMS configuration.
 * Update DB credentials for Hostinger before deploying.
 */

declare(strict_types=1);

$config = [
    'app_name' => 'Portfolio CMS',
    'app_url'  => '', // e.g. https://gyaando.com/admin/public — leave blank to auto-detect
    'timezone' => 'Asia/Kolkata',
    'debug'    => false, // true shows raw DB errors to every visitor — only for local debugging

    'db' => [
        'host'    => 'localhost',
        'port'    => '3306',
        'name'    => 'u932835494_myportfolio',
        'user'    => 'u932835494_myportfolio',
        'pass'    => '__DB_PASSWORD__', // injected by GitHub Actions from secrets.DB_PASSWORD
        'charset' => 'utf8mb4',
    ],

    'session' => [
        'name' => 'portfolio_cms_session',
    ],

    'upload' => [
        'max_bytes' => 10 * 1024 * 1024, // 10 MB
        'allowed_images' => ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
        'allowed_docs'   => ['application/pdf'],
    ],
];

// Optional untracked overrides for local development (e.g. a different DSN)
if (is_file(__DIR__ . '/config.local.php')) {
    $config = array_replace_recursive($config, require __DIR__ . '/config.local.php');
}

return $config;
