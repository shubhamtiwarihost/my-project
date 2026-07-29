<?php

declare(strict_types=1);

use App\Controllers\AuthController;
use App\Controllers\DashboardController;
use App\Controllers\SectionController;
use App\Controllers\MediaController;
use App\Controllers\NavigationController;
use App\Controllers\SeoController;
use App\Controllers\SettingsController;
use App\Controllers\MessageController;
use App\Controllers\AnalyticsController;
use App\Controllers\AccountController;
use App\Controllers\BackupController;
use App\Controllers\SocialController;
use App\Controllers\ToolsController;
use App\Controllers\ResumeController;

return [
    'GET|/'              => [DashboardController::class, 'index'],
    'GET|/login'         => [AuthController::class, 'showLogin'],
    'POST|/login'        => [AuthController::class, 'login'],
    'POST|/logout'       => [AuthController::class, 'logout'],

    'GET|/sections'              => [SectionController::class, 'index'],
    'GET|/sections/{slug}'       => [SectionController::class, 'edit'],
    'POST|/sections/{slug}'      => [SectionController::class, 'save'],
    'POST|/sections/{slug}/item' => [SectionController::class, 'saveItem'],
    'POST|/sections/{slug}/toggle' => [SectionController::class, 'toggleSection'],
    'POST|/sections/item/{id}/delete' => [SectionController::class, 'deleteItem'],
    'POST|/sections/item/{id}/toggle' => [SectionController::class, 'toggleItem'],

    'GET|/media'         => [MediaController::class, 'index'],
    'POST|/media/upload' => [MediaController::class, 'upload'],
    'POST|/media/{id}/delete' => [MediaController::class, 'delete'],

    'GET|/resume'            => [ResumeController::class, 'index'],
    'POST|/resume/upload'    => [ResumeController::class, 'upload'],
    'POST|/resume/set-active'=> [ResumeController::class, 'setActive'],

    'GET|/navigation'    => [NavigationController::class, 'index'],
    'POST|/navigation'   => [NavigationController::class, 'save'],
    'POST|/navigation/{id}/delete' => [NavigationController::class, 'delete'],

    'GET|/social'        => [SocialController::class, 'index'],
    'POST|/social'       => [SocialController::class, 'save'],
    'POST|/social/{id}/delete' => [SocialController::class, 'delete'],

    'GET|/seo'           => [SeoController::class, 'index'],
    'POST|/seo'          => [SeoController::class, 'save'],

    'GET|/settings'      => [SettingsController::class, 'index'],
    'POST|/settings'     => [SettingsController::class, 'save'],

    'GET|/messages'      => [MessageController::class, 'index'],
    'POST|/messages/{id}/status' => [MessageController::class, 'updateStatus'],
    'POST|/messages/{id}/delete' => [MessageController::class, 'delete'],

    'GET|/analytics/visitors'  => [AnalyticsController::class, 'visitors'],
    'GET|/analytics/downloads' => [AnalyticsController::class, 'downloads'],
    'GET|/analytics/downloads/export' => [AnalyticsController::class, 'exportDownloads'],

    'GET|/account/password'  => [AccountController::class, 'password'],
    'POST|/account/password' => [AccountController::class, 'updatePassword'],

    'GET|/backups'       => [BackupController::class, 'index'],

    'GET|/tools'         => [ToolsController::class, 'index'],
    'POST|/tools/seed'   => [ToolsController::class, 'seedContent'],
];
