<?php if (!empty($success)): ?><div class="alert alert-success py-2"><?= e($success) ?></div><?php endif; ?>

<div class="row g-3">
  <?php foreach ($pages as $page): ?>
  <div class="col-lg-6">
    <div class="card-soft p-3">
      <h2 class="h6 mb-3"><?= e($page['page_name']) ?> <span class="text-muted">(<?= e($page['page_key']) ?>)</span></h2>
      <form method="post" action="<?= e(url('seo')) ?>">
        <?= csrf_field() ?>
        <input type="hidden" name="id" value="<?= (int)$page['id'] ?>">
        <input type="hidden" name="page_key" value="<?= e($page['page_key']) ?>">
        <input type="hidden" name="page_name" value="<?= e($page['page_name']) ?>">
        <div class="mb-2"><label class="form-label">Meta Title</label><input class="form-control" name="meta_title" value="<?= e($page['meta_title'] ?? '') ?>"></div>
        <div class="mb-2"><label class="form-label">Meta Description</label><textarea class="form-control" name="meta_description" rows="3"><?= e($page['meta_description'] ?? '') ?></textarea></div>
        <div class="mb-2"><label class="form-label">Keywords</label><input class="form-control" name="meta_keywords" value="<?= e($page['meta_keywords'] ?? '') ?>"></div>
        <div class="mb-2"><label class="form-label">OG Title</label><input class="form-control" name="og_title" value="<?= e($page['og_title'] ?? '') ?>"></div>
        <div class="mb-2"><label class="form-label">OG Description</label><textarea class="form-control" name="og_description" rows="2"><?= e($page['og_description'] ?? '') ?></textarea></div>
        <div class="mb-2"><label class="form-label">Canonical URL</label><input class="form-control" name="canonical_url" value="<?= e($page['canonical_url'] ?? '') ?>"></div>
        <div class="mb-2"><label class="form-label">Robots</label><input class="form-control" name="robots" value="<?= e($page['robots'] ?? 'index,follow') ?>"></div>
        <div class="mb-2"><label class="form-label">Order</label><input type="number" class="form-control" name="sort_order" value="<?= (int)$page['sort_order'] ?>"></div>
        <div class="form-check mb-3">
          <input class="form-check-input" type="checkbox" name="is_active" id="seo_<?= (int)$page['id'] ?>" <?= (int)$page['is_active'] ? 'checked' : '' ?>>
          <label class="form-check-label" for="seo_<?= (int)$page['id'] ?>">Active</label>
        </div>
        <button class="btn btn-success" type="submit">Save SEO</button>
      </form>
    </div>
  </div>
  <?php endforeach; ?>
</div>
