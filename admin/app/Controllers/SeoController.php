<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Controller;
use App\Core\Csrf;
use App\Core\Database;
use App\Models\AuditLog;
use App\Models\Dashboard;

final class SeoController extends Controller
{
    public function index(): void
    {
        $this->requireAuth();
        $stmt = Database::connection()->query(
            'SELECT * FROM seo_pages WHERE deleted_at IS NULL ORDER BY sort_order ASC'
        );
        $this->render('seo.index', [
            'title'  => 'SEO Settings',
            'pages'  => $stmt->fetchAll(),
            'success'=> flash('success'),
            'unread' => Dashboard::unreadMessages(),
        ]);
    }

    public function save(): void
    {
        $this->requireAuth();
        Csrf::requireValid();
        $id = (int) ($_POST['id'] ?? 0);
        $data = [
            'page_key'         => trim((string) ($_POST['page_key'] ?? '')),
            'page_name'        => trim((string) ($_POST['page_name'] ?? '')),
            'meta_title'       => trim((string) ($_POST['meta_title'] ?? '')),
            'meta_description' => trim((string) ($_POST['meta_description'] ?? '')),
            'meta_keywords'    => trim((string) ($_POST['meta_keywords'] ?? '')),
            'og_title'         => trim((string) ($_POST['og_title'] ?? '')),
            'og_description'   => trim((string) ($_POST['og_description'] ?? '')),
            'canonical_url'    => trim((string) ($_POST['canonical_url'] ?? '')),
            'robots'           => trim((string) ($_POST['robots'] ?? 'index,follow')),
            'is_active'        => isset($_POST['is_active']) ? 1 : 0,
            'sort_order'       => (int) ($_POST['sort_order'] ?? 0),
        ];
        $pdo = Database::connection();
        if ($id > 0) {
            $stmt = $pdo->prepare(
                'UPDATE seo_pages SET page_key=:page_key, page_name=:page_name, meta_title=:meta_title,
                 meta_description=:meta_description, meta_keywords=:meta_keywords, og_title=:og_title,
                 og_description=:og_description, canonical_url=:canonical_url, robots=:robots,
                 is_active=:is_active, sort_order=:sort_order WHERE id=:id'
            );
            $data['id'] = $id;
            $stmt->execute($data);
        } else {
            $stmt = $pdo->prepare(
                'INSERT INTO seo_pages
                 (page_key, page_name, meta_title, meta_description, meta_keywords, og_title, og_description, canonical_url, robots, is_active, sort_order)
                 VALUES
                 (:page_key, :page_name, :meta_title, :meta_description, :meta_keywords, :og_title, :og_description, :canonical_url, :robots, :is_active, :sort_order)'
            );
            $stmt->execute($data);
            $id = (int) $pdo->lastInsertId();
        }
        AuditLog::write(Auth::id(), 'update', 'seo_pages', $id, null, $data);
        flash('success', 'SEO page saved.');
        redirect('/seo');
    }
}
