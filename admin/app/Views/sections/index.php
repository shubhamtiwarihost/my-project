<div class="d-flex justify-content-between align-items-center mb-3">
  <div>
    <h1 class="h4 mb-1">Website Sections</h1>
    <p class="text-muted small mb-0">Each page mirrors a frontend section. Forms are generated from <code>field_definitions</code>.</p>
  </div>
</div>

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
        <a class="btn btn-sm btn-success" href="<?= e(url('sections/' . $section['slug'])) ?>">Manage</a>
      </div>
    </div>
  <?php endforeach; ?>
</div>
