<?php
$query = array_filter($filters, static fn ($v) => $v !== '');
$qs = static fn (array $extra = []) => ($s = http_build_query(array_merge($query, $extra))) !== '' ? '?' . $s : '';
$peak = max(1, ...array_column($chart, 'count'));
$sum = static fn (array $list) => max(1, array_sum(array_map('intval', $list)));
[$lastDate, $lastTime] = split_datetime($stats['last']);
?>
<?php if (!empty($success)): ?><div class="alert alert-success py-2"><?= e($success) ?></div><?php endif; ?>

<div class="row g-3 mb-3">
  <?php foreach ([
    ['Total downloads', $stats['total'], 'All time'],
    ['Today', $stats['today'], date('d M Y')],
    ['Last 7 days', $stats['week'], 'Including today'],
    ['This month', $stats['month'], date('F Y')],
    ['Unique visitors', $stats['unique'], 'Distinct IP addresses'],
  ] as [$label, $value, $hint]): ?>
    <div class="col-6 col-lg">
      <div class="stat-card">
        <div class="stat-label"><?= e($label) ?></div>
        <div class="stat-value"><?= (int) $value ?></div>
        <div class="stat-hint"><?= e($hint) ?></div>
      </div>
    </div>
  <?php endforeach; ?>
</div>

<div class="row g-3 mb-3">
  <div class="col-lg-8">
    <div class="card-soft p-3 h-100">
      <div class="d-flex justify-content-between align-items-baseline mb-3 gap-2 flex-wrap">
        <h2 class="h6 mb-0">Downloads per day · last 30 days</h2>
        <span class="small text-muted">
          Last download: <?= $stats['last'] ? e($lastDate . ', ' . $lastTime) : 'none yet' ?>
        </span>
      </div>
      <div class="day-chart" role="img" aria-label="Downloads per day for the last 30 days">
        <?php foreach ($chart as $bar): ?>
          <div class="day-chart__col" title="<?= e(date('d M', strtotime($bar['day'])) . ': ' . $bar['count']) ?>">
            <span class="day-chart__num"><?= $bar['count'] ?: '' ?></span>
            <span class="day-chart__bar<?= $bar['count'] ? '' : ' is-empty' ?>" style="height: <?= $bar['count'] ? max(6, round($bar['count'] / $peak * 100)) : 2 ?>%"></span>
          </div>
        <?php endforeach; ?>
      </div>
      <div class="d-flex justify-content-between small text-muted mt-2">
        <span><?= e(date('d M', strtotime($chart[0]['day']))) ?></span>
        <span><?= e(date('d M', strtotime($chart[14]['day']))) ?></span>
        <span>Today</span>
      </div>
    </div>
  </div>

  <div class="col-lg-4">
    <div class="card-soft p-3 h-100">
      <h2 class="h6 mb-3">Devices</h2>
      <?php if (empty($devices)): ?>
        <p class="text-muted small mb-0">No downloads yet.</p>
      <?php else: $total = $sum(array_column($devices, 'c')); foreach ($devices as $d): ?>
        <div class="meter">
          <div class="d-flex justify-content-between small"><span><?= e($d['device'] ?: 'Unknown') ?></span><strong><?= (int) $d['c'] ?></strong></div>
          <div class="meter__track"><span style="width: <?= round((int) $d['c'] / $total * 100) ?>%"></span></div>
        </div>
      <?php endforeach; endif; ?>
    </div>
  </div>
</div>

<div class="row g-3 mb-3">
  <div class="col-lg-6">
    <div class="card-soft p-3 h-100">
      <h2 class="h6 mb-3">Where downloads came from · location</h2>
      <?php if (empty($locations)): ?>
        <p class="text-muted small mb-0">No downloads yet.</p>
      <?php else: $total = $sum(array_column($locations, 'c')); foreach ($locations as $loc): ?>
        <div class="meter">
          <div class="d-flex justify-content-between small"><span><?= e(format_location($loc)) ?></span><strong><?= (int) $loc['c'] ?></strong></div>
          <div class="meter__track"><span style="width: <?= round((int) $loc['c'] / $total * 100) ?>%"></span></div>
        </div>
      <?php endforeach; endif; ?>
    </div>
  </div>
  <div class="col-lg-6">
    <div class="card-soft p-3 h-100">
      <h2 class="h6 mb-3">How visitors reached the site</h2>
      <?php if (empty($sources)): ?>
        <p class="text-muted small mb-0">No downloads yet.</p>
      <?php else: $total = $sum($sources); foreach ($sources as $label => $c): ?>
        <div class="meter">
          <div class="d-flex justify-content-between small"><span><?= e((string) $label) ?></span><strong><?= (int) $c ?></strong></div>
          <div class="meter__track"><span style="width: <?= round($c / $total * 100) ?>%"></span></div>
        </div>
      <?php endforeach; endif; ?>
    </div>
  </div>
</div>

<div class="card-soft p-3">
  <form class="row g-2 align-items-end mb-3" method="get" action="<?= e(url('analytics/downloads')) ?>">
    <div class="col-6 col-md-auto">
      <label class="form-label small mb-1" for="from">From</label>
      <input type="date" class="form-control form-control-sm" id="from" name="from" value="<?= e($filters['from']) ?>">
    </div>
    <div class="col-6 col-md-auto">
      <label class="form-label small mb-1" for="to">To</label>
      <input type="date" class="form-control form-control-sm" id="to" name="to" value="<?= e($filters['to']) ?>">
    </div>
    <div class="col-12 col-md">
      <label class="form-label small mb-1" for="q">Search</label>
      <input type="search" class="form-control form-control-sm" id="q" name="q" value="<?= e($filters['q']) ?>" placeholder="City, country, IP, browser, source">
    </div>
    <div class="col-12 col-md-auto d-flex gap-2">
      <button class="btn btn-sm btn-accent" type="submit">Apply</button>
      <?php if ($query): ?><a class="btn btn-sm btn-outline-secondary" href="<?= e(url('analytics/downloads')) ?>">Reset</a><?php endif; ?>
      <a class="btn btn-sm btn-outline-secondary" href="<?= e(url('analytics/downloads/export') . $qs()) ?>">Export CSV</a>
    </div>
  </form>

  <div class="small text-muted mb-2">
    <?= (int) $matching ?> download<?= $matching === 1 ? '' : 's' ?><?= $query ? ' matching the filters' : '' ?> · times shown in IST
  </div>

  <div class="table-responsive">
    <table class="table table-sm align-middle mb-0">
      <thead>
        <tr>
          <th>#</th><th>Date</th><th>Time</th><th>Location</th><th>IP address</th><th>Device</th><th>Came from</th><th>Button</th><th></th>
        </tr>
      </thead>
      <tbody>
      <?php if (empty($rows)): ?>
        <tr><td colspan="9" class="text-muted py-4 text-center">No CV downloads recorded<?= $query ? ' for these filters' : ' yet' ?>.</td></tr>
      <?php else: foreach ($rows as $i => $r): [$date, $time, $day] = split_datetime($r['downloaded_at']); ?>
        <tr>
          <td class="text-muted small"><?= $matching - (($page - 1) * $perPage) - $i ?></td>
          <td class="text-nowrap"><strong><?= e($date) ?></strong><div class="small text-muted"><?= e($day) ?></div></td>
          <td class="text-nowrap"><?= e($time) ?></td>
          <td><?= e(format_location($r)) ?></td>
          <td>
            <code><?= e($r['ip_address']) ?></code>
            <?php if (!empty($r['isp'])): ?><div class="small text-muted"><?= e($r['isp']) ?></div><?php endif; ?>
          </td>
          <td class="small"><?= e(implode(' · ', array_filter([$r['device'] ?? '', $r['operating_system'] ?? '', $r['browser'] ?? '']))) ?></td>
          <td class="small"><?= e(format_referrer($r['referrer'] ?? '')) ?></td>
          <td class="small text-muted"><?= e(($r['source'] ?? '') ?: '-') ?></td>
          <td class="text-end">
            <form method="post" action="<?= e(url('analytics/downloads/' . (int) $r['id'] . '/delete')) ?>" onsubmit="return confirm('Remove this download entry?')">
              <?= csrf_field() ?>
              <button class="btn btn-sm btn-link text-danger p-0" type="submit" title="Remove entry">Remove</button>
            </form>
          </td>
        </tr>
      <?php endforeach; endif; ?>
      </tbody>
    </table>
  </div>

  <?php if ($pages > 1): ?>
    <nav class="d-flex justify-content-between align-items-center mt-3 small">
      <span class="text-muted">Page <?= (int) $page ?> of <?= (int) $pages ?></span>
      <span class="d-flex gap-2">
        <?php if ($page > 1): ?><a class="btn btn-sm btn-outline-secondary" href="<?= e(url('analytics/downloads') . $qs(['page' => $page - 1])) ?>">Newer</a><?php endif; ?>
        <?php if ($page < $pages): ?><a class="btn btn-sm btn-outline-secondary" href="<?= e(url('analytics/downloads') . $qs(['page' => $page + 1])) ?>">Older</a><?php endif; ?>
      </span>
    </nav>
  <?php endif; ?>
</div>
