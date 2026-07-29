<?php if (!empty($success)): ?><div class="alert alert-success py-2"><?= e($success) ?></div><?php endif; ?>

<form method="post" action="<?= e(url('settings')) ?>">
  <?= csrf_field() ?>
  <?php foreach ($grouped as $group => $rows): ?>
    <div class="card-soft p-3 mb-3">
      <h2 class="h6 text-uppercase text-muted mb-3"><?= e($group) ?></h2>
      <div class="row g-3">
        <?php foreach ($rows as $row): ?>
          <div class="col-md-6">
            <label class="form-label"><?= e($row['label'] ?: $row['setting_key']) ?></label>
            <?php
              $name = 'settings[' . (int)$row['id'] . ']';
              $val = (string) ($row['setting_value'] ?? '');
              $type = $row['value_type'];
            ?>
            <?php if ($type === 'boolean'): ?>
              <select class="form-select" name="<?= e($name) ?>">
                <option value="0" <?= $val === '0' ? 'selected' : '' ?>>Off</option>
                <option value="1" <?= $val === '1' ? 'selected' : '' ?>>On</option>
              </select>
            <?php elseif ($type === 'color'): ?>
              <input type="color" class="form-control form-control-color" name="<?= e($name) ?>" value="<?= e($val ?: '#0b6e4f') ?>">
            <?php elseif ($type === 'text'): ?>
              <textarea class="form-control" name="<?= e($name) ?>" rows="3"><?= e($val) ?></textarea>
            <?php elseif ($type === 'media'): ?>
              <input type="number" class="form-control" name="<?= e($name) ?>" value="<?= e($val) ?>" placeholder="Media ID">
              <div class="form-text">Upload file in Media Manager, then paste Media ID.</div>
            <?php else: ?>
              <input type="text" class="form-control" name="<?= e($name) ?>" value="<?= e($val) ?>">
            <?php endif; ?>
            <?php if (!empty($row['help_text'])): ?>
              <div class="form-text"><?= e($row['help_text']) ?></div>
            <?php endif; ?>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  <?php endforeach; ?>
  <button class="btn btn-success" type="submit">Save Settings</button>
</form>
