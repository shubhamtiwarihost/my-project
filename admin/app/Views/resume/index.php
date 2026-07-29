<?php if (!empty($success)): ?><div class="alert alert-success py-2"><?= e($success) ?></div><?php endif; ?>
<?php if (!empty($error)): ?><div class="alert alert-danger py-2"><?= e($error) ?></div><?php endif; ?>

<div class="row g-3">
  <div class="col-lg-5">
    <div class="card-soft p-3">
      <h1 class="h5 mb-2">Upload Resume PDF</h1>
      <p class="text-muted small">Upload a PDF here. It becomes the file visitors download from the website (Download Resume / Download PDF).</p>
      <form method="post" action="<?= e(url('resume/upload')) ?>" enctype="multipart/form-data">
        <?= csrf_field() ?>
        <div class="mb-3">
          <label class="form-label">PDF file</label>
          <input type="file" class="form-control" name="file" accept="application/pdf,.pdf" required>
        </div>
        <button class="btn btn-success" type="submit">Upload &amp; Publish</button>
      </form>
    </div>

    <div class="card-soft p-3 mt-3">
      <h2 class="h6">Currently published</h2>
      <?php if (!$active): ?>
        <p class="text-muted small mb-0">No resume published yet. Upload a PDF above.</p>
      <?php else: ?>
        <p class="mb-1"><strong><?= e($active['original_name']) ?></strong></p>
        <p class="small text-muted mb-2">Media ID #<?= (int)$active['id'] ?> · <?= e(format_bytes((int)$active['size'])) ?> · <?= e($active['uploaded_at'] ?? $active['created_at']) ?></p>
        <span class="badge text-bg-success">Live on frontend</span>
      <?php endif; ?>
    </div>
  </div>

  <div class="col-lg-7">
    <div class="card-soft p-3">
      <h2 class="h5 mb-3">Choose from uploaded PDFs</h2>
      <?php if (empty($pdfs)): ?>
        <p class="text-muted small mb-0">No PDFs in Media Library yet.</p>
      <?php else: ?>
        <div class="table-responsive">
          <table class="table table-sm align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>File</th>
                <th>Size</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            <?php foreach ($pdfs as $pdf): ?>
              <tr class="<?= $active && (int)$active['id'] === (int)$pdf['id'] ? 'table-success' : '' ?>">
                <td><code><?= (int)$pdf['id'] ?></code></td>
                <td>
                  <div class="fw-semibold"><?= e($pdf['original_name']) ?></div>
                  <div class="small text-muted"><?= e($pdf['uploaded_at'] ?? $pdf['created_at']) ?></div>
                </td>
                <td><?= e(format_bytes((int)$pdf['size'])) ?></td>
                <td>
                  <?php if ($active && (int)$active['id'] === (int)$pdf['id']): ?>
                    <span class="badge text-bg-success">Active</span>
                  <?php else: ?>
                    <form method="post" action="<?= e(url('resume/set-active')) ?>">
                      <?= csrf_field() ?>
                      <input type="hidden" name="media_id" value="<?= (int)$pdf['id'] ?>">
                      <button class="btn btn-sm btn-outline-success" type="submit">Set as resume</button>
                    </form>
                  <?php endif; ?>
                </td>
              </tr>
            <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      <?php endif; ?>
    </div>
  </div>
</div>
