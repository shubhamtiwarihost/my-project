<div class="d-flex justify-content-between align-items-center mb-3 gap-2 flex-wrap">
  <div class="row g-3 flex-grow-1">
    <?php foreach ([['Total', $stats['total']], ['Today', $stats['today']], ['This Month', $stats['month']]] as [$l,$v]): ?>
      <div class="col-md-4"><div class="stat-card"><div class="stat-label"><?= e($l) ?></div><div class="stat-value"><?= (int)$v ?></div></div></div>
    <?php endforeach; ?>
  </div>
  <a class="btn btn-outline-success" href="<?= e(url('analytics/downloads/export')) ?>">Export CSV</a>
</div>

<form class="mb-3" method="get" action="<?= e(url('analytics/downloads')) ?>">
  <div class="input-group" style="max-width:420px">
    <input type="search" class="form-control" name="q" value="<?= e($q) ?>" placeholder="Search IP, browser, country, city">
    <button class="btn btn-outline-secondary" type="submit">Search</button>
  </div>
</form>

<div class="card-soft p-3">
  <div class="table-responsive">
    <table class="table table-sm align-middle">
      <thead>
        <tr>
          <th>Downloaded</th><th>Media</th><th>IP</th><th>Device</th><th>OS</th><th>Browser</th><th>Location</th>
        </tr>
      </thead>
      <tbody>
      <?php if (empty($rows)): ?>
        <tr><td colspan="7" class="text-muted">No downloads yet.</td></tr>
      <?php else: foreach ($rows as $r): ?>
        <tr>
          <td class="small"><?= e($r['downloaded_at']) ?></td>
          <td><?= e((string)($r['media_id'] ?? '-')) ?></td>
          <td><code><?= e($r['ip_address']) ?></code></td>
          <td><?= e($r['device'] ?? '-') ?></td>
          <td><?= e($r['operating_system'] ?? '-') ?></td>
          <td><?= e($r['browser'] ?? '-') ?></td>
          <td class="small"><?= e(trim(($r['city'] ?? '') . ', ' . ($r['country'] ?? ''), ' ,') ?: '-') ?></td>
        </tr>
      <?php endforeach; endif; ?>
      </tbody>
    </table>
  </div>
</div>
