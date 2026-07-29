<div class="card-soft p-3">
  <h1 class="h5 mb-3">Backup History</h1>
  <p class="text-muted small">Backup jobs will be listed here. Creating automated backups can be enabled in a later step.</p>
  <div class="table-responsive">
    <table class="table table-sm align-middle">
      <thead><tr><th>Label</th><th>Type</th><th>Status</th><th>Size</th><th>Created</th></tr></thead>
      <tbody>
      <?php if (empty($backups)): ?>
        <tr><td colspan="5" class="text-muted">No backups recorded yet.</td></tr>
      <?php else: foreach ($backups as $b): ?>
        <tr>
          <td><?= e($b['label']) ?></td>
          <td><?= e($b['backup_type']) ?></td>
          <td><?= e($b['status']) ?></td>
          <td><?= e(format_bytes((int)$b['file_size'])) ?></td>
          <td class="small"><?= e($b['created_at']) ?></td>
        </tr>
      <?php endforeach; endif; ?>
      </tbody>
    </table>
  </div>
</div>
