<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title><?= e($title ?? 'Login') ?> · <?= e((string) config('app_name')) ?></title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <link href="<?= e(url('assets/css/admin.css')) ?>?v=2" rel="stylesheet">
</head>
<body class="cms-login">
  <div class="login-wrap">
    <div class="login-card">
      <div class="mb-4">
        <div class="text-uppercase small text-muted fw-semibold mb-1">Portfolio CMS</div>
        <h1 class="h4 mb-1">Admin Login</h1>
        <p class="text-muted small mb-0">Sign in to manage content and see CV download analytics.</p>
      </div>

      <?php if (!empty($error)): ?>
        <div class="alert alert-danger py-2"><?= e($error) ?></div>
      <?php endif; ?>

      <form method="post" action="<?= e(url('login')) ?>" autocomplete="off">
        <?= csrf_field() ?>
        <div class="mb-3">
          <label class="form-label" for="email">Email</label>
          <input type="email" class="form-control" id="email" name="email" required autofocus>
        </div>
        <div class="mb-3">
          <label class="form-label" for="password">Password</label>
          <input type="password" class="form-control" id="password" name="password" required>
        </div>
        <button type="submit" class="btn btn-success w-100">Sign In</button>
      </form>
    </div>
  </div>
</body>
</html>
