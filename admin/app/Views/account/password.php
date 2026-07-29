<?php if (!empty($success)): ?><div class="alert alert-success py-2"><?= e($success) ?></div><?php endif; ?>
<?php if (!empty($error)): ?><div class="alert alert-danger py-2"><?= e($error) ?></div><?php endif; ?>

<div class="card-soft p-3" style="max-width:520px">
  <h1 class="h5 mb-3">Change Password</h1>
  <form method="post" action="<?= e(url('account/password')) ?>">
    <?= csrf_field() ?>
    <div class="mb-3">
      <label class="form-label">Current password</label>
      <input type="password" class="form-control" name="current_password" required>
    </div>
    <div class="mb-3">
      <label class="form-label">New password</label>
      <input type="password" class="form-control" name="new_password" required minlength="8">
    </div>
    <div class="mb-3">
      <label class="form-label">Confirm new password</label>
      <input type="password" class="form-control" name="confirm_password" required minlength="8">
    </div>
    <button class="btn btn-success" type="submit">Update Password</button>
  </form>
</div>
