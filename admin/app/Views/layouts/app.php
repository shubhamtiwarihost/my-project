<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= e($title ?? 'Admin') ?> · <?= e((string) config('app_name')) ?></title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="<?= e(url('assets/css/admin.css')) ?>" rel="stylesheet">
</head>
<body class="cms-body">
  <div class="d-lg-flex">
    <aside class="cms-sidebar">
      <div class="brand">
        <strong><?= e((string) config('app_name')) ?></strong>
        <div class="small text-white-50">Content Manager</div>
      </div>
      <nav class="nav flex-column py-2">
        <div class="nav-section">Overview</div>
        <a class="nav-link <?= active_nav('') ?>" href="<?= e(url('/')) ?>">Dashboard</a>

        <div class="nav-section">Content</div>
        <a class="nav-link <?= active_nav('sections') ?>" href="<?= e(url('sections')) ?>">Sections</a>
        <a class="nav-link <?= active_nav('resume') ?>" href="<?= e(url('resume')) ?>">Resume PDF</a>
        <a class="nav-link <?= active_nav('media') ?>" href="<?= e(url('media')) ?>">Media Manager</a>
        <a class="nav-link <?= active_nav('navigation') ?>" href="<?= e(url('navigation')) ?>">Navigation</a>
        <a class="nav-link <?= active_nav('social') ?>" href="<?= e(url('social')) ?>">Social Links</a>

        <div class="nav-section">Site</div>
        <a class="nav-link <?= active_nav('seo') ?>" href="<?= e(url('seo')) ?>">SEO Settings</a>
        <a class="nav-link <?= active_nav('settings') ?>" href="<?= e(url('settings')) ?>">Website Settings</a>

        <div class="nav-section">Inbox & Analytics</div>
        <a class="nav-link <?= active_nav('messages') ?>" href="<?= e(url('messages')) ?>">
          Messages
          <?php if (!empty($unread)): ?>
            <span class="badge badge-unread rounded-pill ms-1"><?= (int) $unread ?></span>
          <?php endif; ?>
        </a>
        <a class="nav-link <?= active_nav('analytics/visitors') ?>" href="<?= e(url('analytics/visitors')) ?>">Visitors</a>
        <a class="nav-link <?= active_nav('analytics/downloads') ?>" href="<?= e(url('analytics/downloads')) ?>">Resume Downloads</a>

        <div class="nav-section">System</div>
        <a class="nav-link <?= active_nav('tools') ?>" href="<?= e(url('tools')) ?>">Tools / Seed</a>
        <a class="nav-link <?= active_nav('backups') ?>" href="<?= e(url('backups')) ?>">Backups</a>
        <a class="nav-link <?= active_nav('account/password') ?>" href="<?= e(url('account/password')) ?>">Change Password</a>
      </nav>
    </aside>

    <div class="cms-main">
      <div class="cms-topbar d-flex justify-content-between align-items-center gap-3">
        <div>
          <div class="fw-semibold"><?= e($title ?? 'Dashboard') ?></div>
          <div class="small text-muted">Logged in as <?= e($authUser['name'] ?? 'Admin') ?> · <?= e($authUser['role_name'] ?? '') ?></div>
        </div>
        <form method="post" action="<?= e(url('logout')) ?>">
          <?= csrf_field() ?>
          <button class="btn btn-outline-secondary btn-sm" type="submit">Logout</button>
        </form>
      </div>
      <main class="p-3 p-lg-4">
        <?= $content ?? '' ?>
      </main>
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
