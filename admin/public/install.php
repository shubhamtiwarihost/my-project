<?php
/**
 * One-page installer — for the site owner only.
 *
 * Proves ownership with the database password, creates the CMS tables,
 * loads the portfolio content, and creates (or resets) the admin login.
 *
 *   /admin/public/install.php
 */

declare(strict_types=1);

require dirname(__DIR__) . '/app/Core/Autoloader.php';
App\Core\Autoloader::register();
require dirname(__DIR__) . '/app/Helpers/functions.php';

use App\Core\Database;
use App\Services\ContentSeeder;
use App\Services\Installer;

$cfg = config();
date_default_timezone_set($cfg['timezone'] ?? 'Asia/Kolkata');

$error = null;
$log = [];
$done = false;
$email = trim((string) ($_POST['email'] ?? ''));

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    sleep(1); // slow down guessing
    $dbPass = (string) ($cfg['db']['pass'] ?? '');
    $password = (string) ($_POST['password'] ?? '');

    if ($dbPass === '' || !hash_equals($dbPass, (string) ($_POST['db_password'] ?? ''))) {
        http_response_code(403);
        $error = 'Database password is incorrect.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Enter a valid admin email.';
    } elseif (strlen($password) < 10) {
        $error = 'Admin password must be at least 10 characters.';
    } else {
        try {
            $pdo = Database::connection();
            $log = Installer::run($pdo);
            $log[] = Installer::saveAdmin($pdo, $email, 'Shubham Tiwari', $password);

            if (!Installer::hasContent($pdo)) {
                $seed = ContentSeeder::run();
                $log[] = ($seed['ok'] ?? false)
                    ? 'Loaded portfolio content'
                    : 'Content load failed: ' . ($seed['error'] ?? 'unknown error');
            }
            $done = true;
        } catch (Throwable $e) {
            $error = 'Install failed: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Install · Portfolio CMS</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="<?= e(url('assets/css/admin.css')) ?>?v=2" rel="stylesheet">
</head>
<body class="cms-login">
  <div class="login-wrap">
    <div class="login-card">
      <h1 class="h4 mb-1">Set up the admin panel</h1>
      <p class="text-muted small">Creates the database tables and your admin login. Safe to run again.</p>

      <?php if ($error !== null): ?>
        <div class="alert alert-danger py-2"><?= e($error) ?></div>
      <?php endif; ?>

      <?php if ($done): ?>
        <div class="alert alert-success py-2">Setup complete.</div>
        <ul class="small text-muted">
          <?php foreach ($log as $line): ?><li><?= e($line) ?></li><?php endforeach; ?>
        </ul>
        <a class="btn btn-success w-100" href="<?= e(url('login')) ?>">Go to login</a>
      <?php else: ?>
        <form method="post" autocomplete="off">
          <div class="mb-3">
            <label class="form-label" for="db_password">Database password</label>
            <input type="password" class="form-control" id="db_password" name="db_password" required>
            <div class="form-text">The MySQL password from your hosting panel.</div>
          </div>
          <div class="mb-3">
            <label class="form-label" for="email">Admin email</label>
            <input type="email" class="form-control" id="email" name="email" value="<?= e($email) ?>" required>
          </div>
          <div class="mb-3">
            <label class="form-label" for="password">Admin password (10+ characters)</label>
            <input type="password" class="form-control" id="password" name="password" minlength="10" required>
          </div>
          <button type="submit" class="btn btn-success w-100">Install</button>
        </form>
      <?php endif; ?>
    </div>
  </div>
</body>
</html>
