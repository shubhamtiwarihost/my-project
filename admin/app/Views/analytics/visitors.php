<div class="row g-3 mb-3">
  <?php foreach ([['Total', $stats['total']], ['Today', $stats['today']], ['This Month', $stats['month']]] as [$l,$v]): ?>
    <div class="col-md-4"><div class="stat-card"><div class="stat-label"><?= e($l) ?></div><div class="stat-value"><?= (int)$v ?></div></div></div>
  <?php endforeach; ?>
</div>

<form class="mb-3" method="get" action="<?= e(url('analytics/visitors')) ?>">
  <div class="input-group" style="max-width:420px">
    <input type="search" class="form-control" name="q" value="<?= e($q) ?>" placeholder="Search IP, page, browser, country">
    <button class="btn btn-outline-secondary" type="submit">Search</button>
  </div>
</form>

<div class="row g-3">
  <div class="col-lg-8">
    <div class="card-soft p-3">
      <div class="table-responsive">
        <table class="table table-sm align-middle">
          <thead>
            <tr>
              <th>Visited</th><th>IP</th><th>Device</th><th>OS</th><th>Browser</th><th>Page</th><th>Location</th>
            </tr>
          </thead>
          <tbody>
          <?php if (empty($rows)): ?>
            <tr><td colspan="7" class="text-muted">No visitors yet.</td></tr>
          <?php else: foreach ($rows as $r): ?>
            <tr>
              <td class="small"><?= e($r['visited_at']) ?></td>
              <td><code><?= e($r['ip_address']) ?></code></td>
              <td><?= e($r['device'] ?? '-') ?></td>
              <td><?= e($r['operating_system'] ?? '-') ?></td>
              <td><?= e($r['browser'] ?? '-') ?></td>
              <td class="small"><?= e($r['landing_page']) ?></td>
              <td class="small"><?= e(trim(($r['city'] ?? '') . ', ' . ($r['country'] ?? ''), ' ,') ?: '-') ?></td>
            </tr>
          <?php endforeach; endif; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="col-lg-4">
    <div class="card-soft p-3">
      <h2 class="h6 mb-3">Most Visited Pages</h2>
      <?php foreach ($topPages as $p): ?>
        <div class="d-flex justify-content-between border-bottom py-2 small">
          <span><?= e($p['landing_page']) ?></span>
          <strong><?= (int)$p['hits'] ?></strong>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</div>
