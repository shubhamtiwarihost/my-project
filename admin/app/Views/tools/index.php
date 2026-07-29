<?php if (!empty($success)): ?><div class="alert alert-success py-2"><?= e($success) ?></div><?php endif; ?>
<?php if (!empty($error)): ?><div class="alert alert-danger py-2"><?= e($error) ?></div><?php endif; ?>

<div class="card-soft p-3 mb-3" style="max-width:720px">
  <h1 class="h5 mb-2">Seed website content</h1>
  <p class="text-muted small">
    Loads Profile, Hero CTAs, About, Skills, Experience, Education, Projects, Contact, and Footer
    from your current portfolio content into MySQL. Existing items in those sections are soft-deleted
    and replaced. Navigation / Social / SEO / Settings are left untouched.
  </p>
  <form method="post" action="<?= e(url('tools/seed')) ?>" onsubmit="return confirm('Re-seed all section content from the portfolio defaults?')">
    <?= csrf_field() ?>
    <button class="btn btn-success" type="submit">Run full content seed</button>
  </form>
</div>

<div class="card-soft p-3" style="max-width:720px">
  <h2 class="h6">CRUD checklist (Step 5)</h2>
  <ol class="small mb-0">
    <li>Run content seed</li>
    <li>Review each section under <strong>Sections</strong></li>
    <li>Upload resume PDF under <strong>Resume PDF</strong> (Publish) — same file is what visitors download on the site</li>
    <li>Upload hero image in <strong>Media</strong>, then link it in Hero</li>
    <li>Adjust Navigation, Social, SEO, Settings</li>
    <li>Open the public site — API content should replace fallbacks</li>
  </ol>
</div>
