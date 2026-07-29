<div class="row g-3 mb-4">
  <?php
  $cards = [
    ['Total Visitors', $stats['total_visitors'] ?? 0],
    ["Today's Visitors", $stats['today_visitors'] ?? 0],
    ['Monthly Visitors', $stats['monthly_visitors'] ?? 0],
    ['Resume Downloads', $stats['total_downloads'] ?? 0],
    ["Today's Downloads", $stats['today_downloads'] ?? 0],
    ['Unread Messages', $stats['unread_messages'] ?? 0],
  ];
  foreach ($cards as [$label, $value]):
  ?>
  <div class="col-6 col-md-4 col-xl-2">
    <div class="stat-card">
      <div class="stat-label"><?= e($label) ?></div>
      <div class="stat-value"><?= e((string) $value) ?></div>
    </div>
  </div>
  <?php endforeach; ?>
</div>

<div class="row g-3">
  <div class="col-lg-7">
    <div class="card-soft p-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h6 mb-0">Most Visited Pages</h2>
        <a href="<?= e(url('analytics/visitors')) ?>" class="small">View all</a>
      </div>
      <div class="table-responsive">
        <table class="table table-sm align-middle mb-0">
          <thead><tr><th>Page</th><th class="text-end">Hits</th></tr></thead>
          <tbody>
          <?php if (empty($topPages)): ?>
            <tr><td colspan="2" class="text-muted">No visitor data yet.</td></tr>
          <?php else: foreach ($topPages as $row): ?>
            <tr>
              <td><?= e($row['landing_page']) ?></td>
              <td class="text-end"><?= (int) $row['hits'] ?></td>
            </tr>
          <?php endforeach; endif; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="col-lg-5">
    <div class="card-soft p-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h6 mb-0">Recent Messages</h2>
        <a href="<?= e(url('messages')) ?>" class="small">Inbox</a>
      </div>
      <?php if (empty($recentMessages)): ?>
        <p class="text-muted small mb-0">No messages yet.</p>
      <?php else: foreach ($recentMessages as $msg): ?>
        <div class="border-bottom py-2">
          <div class="d-flex justify-content-between gap-2">
            <strong class="small"><?= e($msg['name']) ?></strong>
            <span class="badge text-bg-<?= $msg['status'] === 'Unread' ? 'danger' : 'secondary' ?>"><?= e($msg['status']) ?></span>
          </div>
          <div class="small text-muted"><?= e($msg['subject']) ?></div>
        </div>
      <?php endforeach; endif; ?>
    </div>

    <div class="card-soft p-3 mt-3">
      <h2 class="h6 mb-2">Quick actions</h2>
      <a class="btn btn-sm btn-success me-2" href="<?= e(url('resume')) ?>">Upload / Publish Resume</a>
      <a class="btn btn-sm btn-outline-secondary" href="<?= e(url('analytics/downloads')) ?>">Download stats</a>
    </div>

    <div class="card-soft p-3 mt-3">
      <h2 class="h6 mb-2">Active Widgets</h2>
      <div class="d-flex flex-wrap gap-2">
        <?php foreach ($widgets as $w): ?>
          <span class="badge text-bg-light border"><?= e($w['title']) ?></span>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
</div>
