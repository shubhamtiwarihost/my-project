<?php if (!empty($success)): ?><div class="alert alert-success py-2"><?= e($success) ?></div><?php endif; ?>
<?php if (!empty($error)): ?><div class="alert alert-danger py-2"><?= e($error) ?></div><?php endif; ?>

<div class="row g-3">
  <div class="col-lg-4">
    <div class="card-soft p-3">
      <h1 class="h5 mb-3">Upload Media</h1>
      <form method="post" action="<?= e(url('media/upload')) ?>" enctype="multipart/form-data">
        <?= csrf_field() ?>
        <div class="mb-3">
          <label class="form-label">File (image or PDF)</label>
          <input type="file" class="form-control" name="file" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Alt text</label>
          <input type="text" class="form-control" name="alt_text">
        </div>
        <button class="btn btn-success" type="submit">Upload</button>
      </form>
    </div>
  </div>
  <div class="col-lg-8">
    <div class="card-soft p-3">
      <h2 class="h5 mb-3">Library</h2>
      <div class="table-responsive">
        <table class="table table-sm align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>File</th>
              <th>Type</th>
              <th>Size</th>
              <th>Uploaded</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          <?php if (empty($items)): ?>
            <tr><td colspan="6" class="text-muted">No media yet.</td></tr>
          <?php else: foreach ($items as $m): ?>
            <tr>
              <td><code><?= (int) $m['id'] ?></code></td>
              <td>
                <div class="fw-semibold"><?= e($m['original_name']) ?></div>
                <div class="small text-muted"><?= e($m['path']) ?></div>
              </td>
              <td><?= e($m['mime_type']) ?></td>
              <td><?= e(format_bytes((int) $m['size'])) ?></td>
              <td class="small"><?= e($m['uploaded_at'] ?? $m['created_at']) ?></td>
              <td>
                <form method="post" action="<?= e(url('media/' . $m['id'] . '/delete')) ?>" onsubmit="return confirm('Delete media?')">
                  <?= csrf_field() ?>
                  <button class="btn btn-sm btn-outline-danger" type="submit">Delete</button>
                </form>
              </td>
            </tr>
          <?php endforeach; endif; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
