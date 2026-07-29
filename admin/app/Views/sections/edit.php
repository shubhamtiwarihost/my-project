<?php use App\Services\FormRenderer; ?>

<div class="mb-3 d-flex flex-wrap justify-content-between gap-2 align-items-start">
  <div>
    <a href="<?= e(url('sections')) ?>" class="small text-decoration-none">&larr; All sections</a>
    <h1 class="h4 mt-2 mb-1"><?= e($section['name']) ?></h1>
    <p class="text-muted small mb-0"><?= e($section['description'] ?? '') ?></p>
  </div>
  <form method="post" action="<?= e(url('sections/' . $section['slug'] . '/toggle')) ?>">
    <?= csrf_field() ?>
    <button class="btn btn-sm <?= (int)$section['is_active'] ? 'btn-outline-warning' : 'btn-outline-success' ?>" type="submit">
      <?= (int)$section['is_active'] ? 'Deactivate section' : 'Activate section' ?>
    </button>
  </form>
</div>

<?php if (!empty($success)): ?><div class="alert alert-success py-2"><?= e($success) ?></div><?php endif; ?>
<?php if (!empty($error)): ?><div class="alert alert-danger py-2"><?= e($error) ?></div><?php endif; ?>

<?php if ($singleton): ?>
<div class="card-soft p-3 mb-4">
  <h2 class="h6 mb-3">Section Content <span class="text-muted fw-normal">(singleton / default fields)</span></h2>
  <form method="post" action="<?= e(url('sections/' . $section['slug'])) ?>">
    <?= csrf_field() ?>
    <?= FormRenderer::renderGroup($definitions, $singletonValues, 'default') ?>
    <button type="submit" class="btn btn-success">Save Section</button>
  </form>
</div>
<?php endif; ?>

<?php foreach ($collections as $type => $pack): ?>
  <div class="card-soft p-3 mb-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="h6 mb-0"><?= e(ucwords(str_replace('_', ' ', $type))) ?> Items</h2>
      <span class="badge text-bg-light border"><?= count($pack['items']) ?> items</span>
    </div>

    <?php if (empty($pack['items'])): ?>
      <p class="text-muted small">No items yet. Add the first one below.</p>
    <?php else: foreach ($pack['items'] as $item): ?>
      <div class="border rounded p-3 mb-3 <?= (int)$item['is_active'] ? '' : 'opacity-50' ?>">
        <div class="d-flex flex-wrap justify-content-between gap-2 mb-2">
          <div>
            <strong><?= e($item['label'] ?: ('Item #' . $item['id'])) ?></strong>
            <span class="badge text-bg-<?= (int)$item['is_active'] ? 'success' : 'secondary' ?> ms-1">
              <?= (int)$item['is_active'] ? 'Active' : 'Inactive' ?>
            </span>
            <span class="small text-muted ms-1">Order: <?= (int)$item['sort_order'] ?></span>
          </div>
          <div class="d-flex gap-2">
            <form method="post" action="<?= e(url('sections/item/' . $item['id'] . '/toggle')) ?>">
              <?= csrf_field() ?>
              <button class="btn btn-sm btn-outline-secondary" type="submit">
                <?= (int)$item['is_active'] ? 'Deactivate' : 'Activate' ?>
              </button>
            </form>
            <form method="post" action="<?= e(url('sections/item/' . $item['id'] . '/delete')) ?>" onsubmit="return confirm('Soft-delete this item?')">
              <?= csrf_field() ?>
              <button class="btn btn-sm btn-outline-danger" type="submit">Delete</button>
            </form>
          </div>
        </div>
        <form method="post" action="<?= e(url('sections/' . $section['slug'] . '/item')) ?>">
          <?= csrf_field() ?>
          <input type="hidden" name="item_id" value="<?= (int) $item['id'] ?>">
          <input type="hidden" name="item_type" value="<?= e($type) ?>">
          <div class="row g-2 mb-3">
            <div class="col-md-6">
              <label class="form-label">Admin label</label>
              <input type="text" class="form-control" name="label" value="<?= e($item['label'] ?? '') ?>">
            </div>
            <div class="col-md-3">
              <label class="form-label">Display order</label>
              <input type="number" class="form-control" name="sort_order" value="<?= (int)$item['sort_order'] ?>">
            </div>
            <div class="col-md-3 d-flex align-items-end">
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" name="is_active" id="active_<?= (int)$item['id'] ?>" <?= (int)$item['is_active'] ? 'checked' : '' ?>>
                <label class="form-check-label" for="active_<?= (int)$item['id'] ?>">Active</label>
              </div>
            </div>
          </div>
          <?= FormRenderer::renderGroup($pack['definitions'], $item['values'], $type) ?>
          <button class="btn btn-sm btn-success" type="submit">Update Item</button>
        </form>
      </div>
    <?php endforeach; endif; ?>

    <details class="mt-2">
      <summary class="fw-semibold">Add new <?= e($type) ?></summary>
      <form class="mt-3" method="post" action="<?= e(url('sections/' . $section['slug'] . '/item')) ?>">
        <?= csrf_field() ?>
        <input type="hidden" name="item_id" value="0">
        <input type="hidden" name="item_type" value="<?= e($type) ?>">
        <input type="hidden" name="is_active" value="1">
        <div class="row g-2 mb-3">
          <div class="col-md-8">
            <label class="form-label">Admin Label</label>
            <input type="text" class="form-control" name="label" placeholder="Optional list label">
          </div>
          <div class="col-md-4">
            <label class="form-label">Display order</label>
            <input type="number" class="form-control" name="sort_order" value="<?= count($pack['items']) + 1 ?>">
          </div>
        </div>
        <?= FormRenderer::renderGroup($pack['definitions'], [], $type) ?>
        <button class="btn btn-success" type="submit">Create Item</button>
      </form>
    </details>
  </div>
<?php endforeach; ?>
