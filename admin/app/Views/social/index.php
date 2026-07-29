<?php if (!empty($success)): ?><div class="alert alert-success py-2"><?= e($success) ?></div><?php endif; ?>

<div class="row g-3">
  <div class="col-lg-4">
    <div class="card-soft p-3">
      <h1 class="h5 mb-3">Add Social Link</h1>
      <form method="post" action="<?= e(url('social')) ?>">
        <?= csrf_field() ?>
        <input type="hidden" name="id" value="0">
        <div class="mb-2"><label class="form-label">Platform</label><input class="form-control" name="platform" required placeholder="linkedin"></div>
        <div class="mb-2"><label class="form-label">Label</label><input class="form-control" name="label" required></div>
        <div class="mb-2"><label class="form-label">URL</label><input class="form-control" name="url" required></div>
        <div class="mb-2"><label class="form-label">Icon key</label><input class="form-control" name="icon_key"></div>
        <div class="mb-2"><label class="form-label">Order</label><input type="number" class="form-control" name="sort_order" value="0"></div>
        <div class="form-check mb-3"><input class="form-check-input" type="checkbox" name="is_active" checked id="soc_active"><label for="soc_active" class="form-check-label">Active</label></div>
        <button class="btn btn-success" type="submit">Save</button>
      </form>
    </div>
  </div>
  <div class="col-lg-8">
    <div class="card-soft p-3">
      <h2 class="h5 mb-3">Links</h2>
      <table class="table table-sm align-middle">
        <thead><tr><th>Platform</th><th>Label</th><th>URL</th><th>Active</th><th></th></tr></thead>
        <tbody>
        <?php foreach ($items as $item): ?>
          <tr>
            <td><?= e($item['platform']) ?></td>
            <td><?= e($item['label']) ?></td>
            <td class="small"><a href="<?= e($item['url']) ?>" target="_blank" rel="noopener"><?= e($item['url']) ?></a></td>
            <td><?= (int)$item['is_active'] ? 'Yes' : 'No' ?></td>
            <td>
              <form method="post" action="<?= e(url('social/' . $item['id'] . '/delete')) ?>" onsubmit="return confirm('Delete?')">
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
