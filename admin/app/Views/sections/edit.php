<?php use App\Services\FormRenderer; ?>

<div class="mb-3">
  <a href="<?= e(url('sections')) ?>" class="small text-decoration-none">&larr; All sections</a>
  <h1 class="h4 mt-2 mb-1"><?= e($section['name']) ?></h1>
  <p class="text-muted small mb-0"><?= e($section['description'] ?? '') ?></p>
</div>

<?php if (!empty($success)): ?><div class="alert alert-success py-2"><?= e($success) ?></div><?php endif; ?>
<?php if (!empty($error)): ?><div class="alert alert-danger py-2"><?= e($error) ?></div><?php endif; ?>

<?php if ($singleton): ?>
<div class="card-soft p-3 mb-4">
  <h2 class="h6 mb-3">Section Content</h2>
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
    </div>

    <?php if (empty($pack['items'])): ?>
      <p class="text-muted small">No items yet.</p>
    <?php else: foreach ($pack['items'] as $item): ?>
      <div class="border rounded p-3 mb-3">
        <div class="d-flex justify-content-between mb-2">
          <strong><?= e($item['label'] ?: ('Item #' . $item['id'])) ?></strong>
          <form method="post" action="<?= e(url('sections/item/' . $item['id'] . '/delete')) ?>" onsubmit="return confirm('Delete this item?')">
            <?= csrf_field() ?>
            <button class="btn btn-sm btn-outline-danger" type="submit">Delete</button>
          </form>
        </div>
        <form method="post" action="<?= e(url('sections/' . $section['slug'] . '/item')) ?>">
          <?= csrf_field() ?>
          <input type="hidden" name="item_id" value="<?= (int) $item['id'] ?>">
          <input type="hidden" name="item_type" value="<?= e($type) ?>">
          <input type="hidden" name="label" value="<?= e($item['label'] ?? '') ?>">
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
        <div class="mb-3">
          <label class="form-label">Admin Label</label>
          <input type="text" class="form-control" name="label" placeholder="Optional list label">
        </div>
        <?= FormRenderer::renderGroup($pack['definitions'], [], $type) ?>
        <button class="btn btn-success" type="submit">Create Item</button>
      </form>
    </details>
  </div>
<?php endforeach; ?>
