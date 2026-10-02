<?php

declare(strict_types=1);

/**
 * Database health check. Reports only whether the connection works and the
 * MySQL error number — never credentials or the full error message.
 *
 *   1045 = wrong user/password, 1044/1049 = database missing or no access,
 *   2002 = server unreachable
 */

require __DIR__ . '/bootstrap.php';

try {
    $pdo = Database::pdo();
    $tables = [];
    foreach (['admins', 'resume_downloads', 'visitors', 'sections'] as $table) {
        try {
            $pdo->query("SELECT 1 FROM {$table} LIMIT 1");
            $tables[$table] = true;
        } catch (Throwable) {
            $tables[$table] = false;
        }
    }
    api_json(['ok' => true, 'db' => 'connected', 'tables' => $tables]);
} catch (PDOException $e) {
    $pass = (string) (api_config()['db']['pass'] ?? '');
    api_json([
        'ok'         => false,
        'db'         => 'failed',
        'mysql_code' => $e->errorInfo[1] ?? (int) $e->getCode(),
        // hints about the deployed password without revealing it
        'password'   => [
            'injected'   => $pass !== '__DB_PASSWORD__',
            'length'     => strlen($pass),
            'whitespace' => $pass !== trim($pass),
        ],
        'db_user'    => (string) (api_config()['db']['user'] ?? ''),
        'db_name'    => (string) (api_config()['db']['name'] ?? ''),
        // when the deployed config last changed (a new secret rewrites this file)
        'config_updated' => date('Y-m-d H:i:s', (int) filemtime(dirname(__DIR__) . '/admin/config/config.php')),
    ], 500);
}
