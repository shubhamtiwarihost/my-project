<?php if (!empty($success)): ?><div class="alert alert-success py-2"><?= e($success) ?></div><?php endif; ?>

<div class="row g-3">
  <div class="col-lg-4">
    <div class="card-soft p-3">
      <h1 class="h5 mb-3">Add / Edit Link</h1>
      <form method="post" action="<?= e(url('navigation')) ?>">
        <?= csrf_field() ?>
        <input type="hidden" name="id" value="0">
        <div class="mb-2"><label class="form-label">Title</label><input class="form-control" name="title" required></div>
        <div class="mb-2"><label class="form-label">URL</label><input class="form-control" name="url" required placeholder="#about"></div>
        <div class="mb-2"><label class="form-label">Icon</label><input class="form-control" name="icon" placeholder="home"></div>
        <div class="mb-2">
          <label class="form-label">Target</label>
          <select class="form-select" name="target"><option value="_self">Same tab</option><option value="_blank">New tab</option></select>
        </div>
        <div class="mb-2">
          <label class="form-label">Location</label>
          <select class="form-select" name="location"><option value="header">Header</option><option value="footer">Footer</option><option value="both">Both</option></select>
        </div>
        <div class="mb-2"><label class="form-label">Order</label><input type="number" class="form-control" name="sort_order" value="0"></div>
        <div class="form-check mb-3"><input class="form-check-input" type="checkbox" name="is_active" id="nav_active" checked><label class="form-check-label" for="nav_active">Active</label></div>
        <button class="btn btn-success" type="submit">Save</button>
      </form>
    </div>
  </div>
  <div class="col-lg-8">
    <div class="card-soft p-3">
      <h2 class="h5 mb-3">Menu Items</h2>
      <div class="table-responsive">
        <table class="table table-sm align-middle">
          <thead><tr><th>Order</th><th>Title</th><th>URL</th><th>Location</th><th>Active</th><th></th></tr></thead>
          <tbody>
          <?php foreach ($items as $item): ?>
            <tr>
              <td><?= (int) $item['sort_order'] ?></td>
              <td><?= e($item['title']) ?></td>
              <td><code><?= e($item['url']) ?></code></td>
              <td><?= e($item['location']) ?></td>
              <td><?= (int)$item['is_active'] ? 'Yes' : 'No' ?></td>
              <td class="text-nowrap">
                <form class="d-inline" method="post" action="<?= e(url('navigation')) ?>">
                  <?= csrf_field() ?>
                  <input type="hidden" name="id" value="<?= (int)$item['id'] ?>">
                  <input type="hidden" name="title" value="<?= e($item['title']) ?>">
                  <input type="hidden" name="url" value="<?= e($item['url']) ?>">
                  <input type="hidden" name="icon" value="<?= e($item['icon'] ?? '') ?>">
                  <input type="hidden" name="target" value="<?= e($item['target']) ?>">
                  <input type="hidden" name="location" value="<?= e($item['location']) ?>">
                  <input type="hidden" name="sort_order" value="<?= (int)$item['sort_order'] ?>">
                  <?php if ((int)$item['is_active']): ?><input type="hidden" name="is_active" value="1"><?php endif; ?>
                  <button class="btn btn-sm btn-outline-secondary" type="submit">Re-save</button>
                </form>
                <form class="d-inline" method="post" action="<?= e(url('navigation/' . $item['id'] . '/delete')) ?>" onsubmit="return confirm('Delete?')">
                  <?= csrf_field() ?>
                  <button class="btn btn-sm btn-outline-danger" type="submit">Delete</button>
                </form>
              </td>
            </tr>
          <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
