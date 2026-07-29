<?php if (!empty($success)): ?><div class="alert alert-success py-2"><?= e($success) ?></div><?php endif; ?>

<div class="d-flex flex-wrap gap-2 mb-3">
  <a class="btn btn-sm <?= $filter === '' ? 'btn-success' : 'btn-outline-secondary' ?>" href="<?= e(url('messages')) ?>">All</a>
  <?php foreach (['Unread','Read','Replied'] as $s): ?>
    <a class="btn btn-sm <?= $filter === $s ? 'btn-success' : 'btn-outline-secondary' ?>" href="<?= e(url('messages') . '?status=' . urlencode($s)) ?>"><?= e($s) ?></a>
  <?php endforeach; ?>
</div>

<div class="card-soft p-3">
  <div class="table-responsive">
    <table class="table align-middle">
      <thead>
        <tr>
          <th>Status</th>
          <th>From</th>
          <th>Subject</th>
          <th>Message</th>
          <th>Date</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      <?php if (empty($messages)): ?>
        <tr><td colspan="6" class="text-muted">No messages.</td></tr>
      <?php else: foreach ($messages as $m): ?>
        <tr>
          <td><span class="badge text-bg-<?= $m['status'] === 'Unread' ? 'danger' : ($m['status'] === 'Replied' ? 'success' : 'secondary') ?>"><?= e($m['status']) ?></span></td>
          <td>
            <div class="fw-semibold"><?= e($m['name']) ?></div>
            <div class="small text-muted"><?= e($m['email']) ?><?= $m['phone'] ? ' · ' . e($m['phone']) : '' ?></div>
          </td>
          <td><?= e($m['subject']) ?></td>
          <td class="small" style="max-width:280px"><?= e(mb_strimwidth($m['message'], 0, 120, '…')) ?></td>
          <td class="small"><?= e($m['created_at']) ?></td>
          <td class="text-nowrap">
            <form class="d-inline" method="post" action="<?= e(url('messages/' . $m['id'] . '/status')) ?>">
              <?= csrf_field() ?>
              <select class="form-select form-select-sm d-inline-block w-auto" name="status" onchange="this.form.submit()">
                <?php foreach (['Unread','Read','Replied'] as $s): ?>
                  <option value="<?= $s ?>" <?= $m['status'] === $s ? 'selected' : '' ?>><?= $s ?></option>
                <?php endforeach; ?>
              </select>
            </form>
            <form class="d-inline" method="post" action="<?= e(url('messages/' . $m['id'] . '/delete')) ?>" onsubmit="return confirm('Delete message?')">
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
