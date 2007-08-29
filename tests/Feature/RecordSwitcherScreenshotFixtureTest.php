<?php

declare(strict_types=1);

use Capell\Admin\Filament\Resources\Pages\PageResource;
use Capell\Core\Models\Page;
use Capell\RecordSwitcher\Actions\BuildRecordSwitcherOptionsAction;
use Capell\RecordSwitcher\Tests\Fixtures\RecordSwitcherFixtures;
use Capell\Tests\Fixtures\Models\User;
use Capell\Tests\Support\ScreenshotManifest;

beforeEach(function (): void {
    $this->actingAs(RecordSwitcherFixtures::admin());
    $fixture = getenv('CAPELL_SCREENSHOT_FIXTURE');
    $path = getenv('CAPELL_SCREENSHOT_APP_PATH');
    putenv('CAPELL_SCREENSHOT_FIXTURE=record-state');
    putenv('CAPELL_SCREENSHOT_APP_PATH=' . base_path());
    $this->beforeApplicationDestroyed(static function () use ($fixture, $path): void {
        putenv($fixture === false ? 'CAPELL_SCREENSHOT_FIXTURE' : 'CAPELL_SCREENSHOT_FIXTURE=' . $fixture);
        putenv($path === false ? 'CAPELL_SCREENSHOT_APP_PATH' : 'CAPELL_SCREENSHOT_APP_PATH=' . $path);
    });
    $routes = __DIR__ . '/../../workbench/routes/screenshot-fixtures.php';
    if (is_file($routes)) {
        require $routes;
    }
});

it('prepares stable accessible pages on two sites and reaches both real search states', function (): void {
    $url = ScreenshotManifest::captureUrl(__DIR__ . '/../../docs/screenshots.json', 'admin-heading-switcher-cross-site-pages');
    $this->get($url)->assertRedirect();
    $pages = Page::query()->whereIn('name', ['Editorial guide', 'Publishing guide', 'Partner guide'])->get();
    expect($pages)->toHaveCount(3)->and($pages->pluck('site_id')->unique())->toHaveCount(2);
    $page = $pages->firstWhere('name', 'Editorial guide');
    throw_unless($page instanceof Page, RuntimeException::class);
    $key = $page->getRouteKey();
    throw_unless(is_int($key) || is_string($key), RuntimeException::class);
    $options = BuildRecordSwitcherOptionsAction::run(PageResource::class, (string) $key, search: 'Partner guide');
    expect(array_column($options, 'label'))->toBe(['Partner guide'])
        ->and(array_column($options, 'group'))->toBe(['Other sites'])
        ->and(BuildRecordSwitcherOptionsAction::run(PageResource::class, (string) $key, search: 'zz-screenshot-no-matching-record'))->toBe([]);
    $this->get(ScreenshotManifest::captureUrl(__DIR__ . '/../../docs/screenshots.json', 'admin-heading-switcher-empty-search'))->assertRedirect();
    expect(Page::query()->whereIn('name', ['Editorial guide', 'Publishing guide', 'Partner guide'])->pluck('id')->all())
        ->toBe($pages->pluck('id')->all());
});

it('refuses cross-site fixture preparation for an actor without global access', function (): void {
    $this->actingAs(User::factory()->create());
    $this->get('/screenshot-fixtures/record-switcher/pages')->assertForbidden();
    expect(Page::query()->count())->toBe(0);
});

it('does not claim an unavailable control while waiting for that hidden control', function (): void {
    expect(array_column(ScreenshotManifest::entries(__DIR__ . '/../../docs/screenshots.json'), 'id'))
        ->not->toContain('admin-heading-switcher-unavailable-resource');
});
