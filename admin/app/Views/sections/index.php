<div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
  <div>
    <h1 class="h4 mb-1">Website Sections</h1>
    <p class="text-muted small mb-0">CRUD for every frontend section. Forms auto-render from <code>field_definitions</code>.</p>
  </div>
  <a class="btn btn-outline-success btn-sm" href="<?= e(url('tools')) ?>">Seed / Tools</a>
</div>

<?php if (!empty($success)): ?><div class="alert alert-success py-2"><?= e($success) ?></div><?php endif; ?>

<div class="row g-3">
  <?php foreach ($sections as $section): ?>
    <div class="col-md-6 col-xl-4">
      <div class="card-soft p-3 h-100 d-flex flex-column">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div>
            <div class="fw-semibold"><?= e($section['name']) ?></div>
            <div class="small text-muted"><?= e($section['slug']) ?> · <?= e($section['section_type']) ?></div>
          </div>
          <span class="badge text-bg-<?= (int)$section['is_active'] ? 'success' : 'secondary' ?>">
            <?= (int)$section['is_active'] ? 'Active' : 'Inactive' ?>
          </span>
        </div>
        <p class="small text-muted flex-grow-1"><?= e($section['description'] ?? '') ?></p>
        <div class="d-flex gap-2">
          <a class="btn btn-sm btn-success" href="<?= e(url('sections/' . $section['slug'])) ?>">Manage</a>
          <form method="post" action="<?= e(url('sections/' . $section['slug'] . '/toggle')) ?>">
            <?= csrf_field() ?>
            <button class="btn btn-sm btn-outline-secondary" type="submit">
              <?= (int)$section['is_active'] ? 'Off' : 'On' ?>
            </button>
          </form>
        </div>
      </div>
    </div>
  <?php endforeach; ?>
</div>
