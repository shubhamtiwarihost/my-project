<?php
/**
 * Admin password reset — for the site owner only.
 *
 * Proves ownership with the database password (known only to whoever controls
 * the hosting account), then sets a new admin password of your choice.
 *
 *   CLI:      php reset_admin_password.php admin@example.com 'NewPassword'
 *   Browser:  /admin/public/reset_admin_password.php
 */

declare(strict_types=1);

require dirname(__DIR__) . '/app/Core/Autoloader.php';
App\Core\Autoloader::register();
require dirname(__DIR__) . '/app/Helpers/functions.php';

$cfg = config();
$cli = PHP_SAPI === 'cli';
$message = null;
$ok = false;

$reset = static function (string $email, string $password): string {
    if (strlen($password) < 10) {
        return 'New password must be at least 10 characters.';
    }
    $stmt = App\Core\Database::connection()->prepare(
        'UPDATE admins SET password_hash = :hash WHERE email = :email AND deleted_at IS NULL'
    );
    $stmt->execute(['hash' => password_hash($password, PASSWORD_DEFAULT), 'email' => $email]);
    return $stmt->rowCount() > 0 ? '' : 'No admin account found for that email.';
};

if ($cli) {
    [$email, $password] = [$argv[1] ?? '', $argv[2] ?? ''];
    if ($email === '' || $password === '') {
        exit("Usage: php reset_admin_password.php <admin-email> <new-password>\n");
    }
    $error = $reset($email, $password);
    exit($error === '' ? "Password updated for {$email}\n" : $error . "\n");
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    sleep(1); // slow down guessing
    $dbPass = (string) ($cfg['db']['pass'] ?? '');
    if ($dbPass === '' || !hash_equals($dbPass, (string) ($_POST['db_password'] ?? ''))) {
        http_response_code(403);
        $message = 'Database password is incorrect.';
    } else {
        $message = $reset(trim((string) ($_POST['email'] ?? '')), (string) ($_POST['password'] ?? ''));
        $ok = $message === '';
        if ($ok) {
            $message = 'Password updated. You can sign in now.';
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
  <title>Reset admin password</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="<?= e(url('assets/css/admin.css')) ?>?v=2" rel="stylesheet">
</head>
<body class="cms-login">
  <div class="login-wrap">
    <div class="login-card">
      <h1 class="h4 mb-1">Reset admin password</h1>
      <p class="text-muted small">Enter the database password from your hosting panel to prove you own this site.</p>
      <?php if ($message !== null): ?>
        <div class="alert alert-<?= $ok ? 'success' : 'danger' ?> py-2"><?= e($message) ?></div>
      <?php endif; ?>
      <form method="post" autocomplete="off">
        <div class="mb-3">
          <label class="form-label" for="db_password">Database password</label>
          <input type="password" class="form-control" id="db_password" name="db_password" required>
        </div>
        <div class="mb-3">
          <label class="form-label" for="email">Admin email</label>
          <input type="email" class="form-control" id="email" name="email" required>
        </div>
        <div class="mb-3">
          <label class="form-label" for="password">New password (10+ characters)</label>
          <input type="password" class="form-control" id="password" name="password" minlength="10" required>
        </div>
        <button type="submit" class="btn btn-success w-100">Set new password</button>
      </form>
      <p class="small mt-3 mb-0"><a href="<?= e(url('login')) ?>">Back to login</a></p>
    </div>
  </div>
</body>
</html>
