<?php
/**
 * One-time password reset helper.
 * Usage (SSH or browser once, then DELETE this file):
 *   php reset_admin_password.php
 * Or visit: /admin/public/reset_admin_password.php?key=setup-once
 *
 * Remove this file after use.
 */

declare(strict_types=1);

require dirname(__DIR__) . '/app/Core/Autoloader.php';
App\Core\Autoloader::register();
require dirname(__DIR__) . '/app/Helpers/functions.php';

$cfg = config();
$newPassword = 'Admin@123';

// Simple guard for web access
if (PHP_SAPI !== 'cli') {
    $key = $_GET['key'] ?? '';
    if ($key !== 'setup-once') {
        http_response_code(403);
        exit('Forbidden');
    }
}

$hash = password_hash($newPassword, PASSWORD_DEFAULT);
$pdo = App\Core\Database::connection();
$stmt = $pdo->prepare('UPDATE admins SET password_hash = :hash WHERE email = :email AND deleted_at IS NULL');
$stmt->execute([
    'hash'  => $hash,
    'email' => 'admin@example.com',
]);

echo "Password updated for admin@example.com\n";
echo "New password: {$newPassword}\n";
echo "DELETE this file now.\n";
