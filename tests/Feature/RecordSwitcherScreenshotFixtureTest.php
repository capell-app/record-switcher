<?php

declare(strict_types=1);

use Capell\Admin\Filament\Resources\Pages\PageResource;
use Capell\Core\Models\Blueprint;
use Capell\Core\Models\Page;
use Capell\Core\Models\Site;
use Capell\RecordSwitcher\Actions\BuildRecordSwitcherOptionsAction;
use Capell\RecordSwitcher\Actions\Fixtures\PrepareRecordSwitcherScreenshotAction;
use Capell\RecordSwitcher\Tests\Fixtures\RecordSwitcherFixtures;
use Capell\Tests\Fixtures\Models\User;
use Capell\Tests\Support\ScreenshotManifest;
use Symfony\Component\HttpKernel\Exception\HttpException;

beforeEach(function (): void {
    $this->actingAs(RecordSwitcherFixtures::admin());
    $email = getenv('CAPELL_SCREENSHOT_ADMIN_EMAIL');
    $captureEmail = data_get(auth()->user(), 'email');
    throw_unless(is_string($captureEmail), RuntimeException::class, 'Expected the capture actor email.');
    putenv('CAPELL_SCREENSHOT_ADMIN_EMAIL=' . $captureEmail);
    $fixture = getenv('CAPELL_SCREENSHOT_FIXTURE');
    $path = getenv('CAPELL_SCREENSHOT_APP_PATH');
    putenv('CAPELL_SCREENSHOT_FIXTURE=record-state');
    putenv('CAPELL_SCREENSHOT_APP_PATH=' . base_path());
    $this->beforeApplicationDestroyed(static function () use ($fixture, $path, $email): void {
        putenv($email === false ? 'CAPELL_SCREENSHOT_ADMIN_EMAIL' : 'CAPELL_SCREENSHOT_ADMIN_EMAIL=' . $email);
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

it('refuses an authenticated actor other than the selected capture identity before writes', function (): void {
    $previous = [];
    foreach (['CAPELL_SCREENSHOT_FIXTURE', 'CAPELL_SCREENSHOT_APP_PATH', 'CAPELL_SCREENSHOT_ADMIN_EMAIL'] as $key) {
        $previous[$key] = getenv($key);
    }

    putenv('CAPELL_SCREENSHOT_FIXTURE=record-state');
    putenv('CAPELL_SCREENSHOT_APP_PATH=' . base_path());
    putenv('CAPELL_SCREENSHOT_ADMIN_EMAIL=selected-capture@example.test');
    $actor = new Illuminate\Foundation\Auth\User;
    $actor->forceFill(['id' => 987654, 'email' => 'another-actor@example.test']);
    $this->actingAs($actor);
    $before = Page::query()->count();

    try {
        expect(fn (): Page => (new PrepareRecordSwitcherScreenshotAction)->seedForCapture())->toThrow(RuntimeException::class, 'selected capture actor');
        expect(Page::query()->count())->toBe($before);
    } finally {
        foreach ($previous as $key => $value) {
            putenv($value === false ? $key : $key . '=' . $value);
        }
    }
});

it('refuses a foreign site occupying the screenshot identity before creating editor records', function (): void {
    $site = Site::factory()->withTranslations(siteDomainData: ['domain' => 'record-switcher-main.test', 'scheme' => 'https'])->create(['name' => 'Editorial studio']);
    $before = $site->fresh()?->getRawOriginal();
    $blueprintCount = Blueprint::query()->count();
    $siteCount = Site::query()->count();
    expect(fn (): Page => (new PrepareRecordSwitcherScreenshotAction)->seedForCapture())
        ->toThrow(RuntimeException::class, 'site identity belongs to another record');
    expect($site->fresh()?->getRawOriginal())->toBe($before)
        ->and(Page::query()->count())->toBe(0)
        ->and(Blueprint::query()->count())->toBe($blueprintCount)
        ->and(Site::query()->count())->toBe($siteCount);
});

it('refuses an occupied screenshot page ID and rolls back the whole graph', function (): void {
    $foreign = Page::factory()->create(['id' => 900001, 'name' => 'Unrelated page']);
    $counts = [Page::query()->count(), Site::query()->count(), Blueprint::query()->count()];
    expect(fn (): Page => (new PrepareRecordSwitcherScreenshotAction)->seedForCapture())
        ->toThrow(RuntimeException::class, 'page ID is already in use');
    expect($foreign->fresh()?->name)->toBe('Unrelated page')
        ->and([Page::query()->count(), Site::query()->count(), Blueprint::query()->count()])->toBe($counts);
});

it('rejects a different physical checkout and production even when fixture mode is selected', function (): void {
    $previous = [getenv('CAPELL_SCREENSHOT_FIXTURE'), getenv('CAPELL_SCREENSHOT_APP_PATH')];
    $environment = config('app.env');
    $runtimeEnvironment = app()->environment();
    $actor = new Illuminate\Foundation\Auth\User;
    $before = Page::query()->count();
    putenv('CAPELL_SCREENSHOT_FIXTURE=record-state');
    try {
        foreach (['foreign-checkout', 'production'] as $state) {
            putenv('CAPELL_SCREENSHOT_APP_PATH=' . ($state === 'foreign-checkout' ? __DIR__ : base_path()));
            config()->set('app.env', $state === 'production' ? 'production' : 'testing');
            app()->instance('env', $state === 'production' ? 'production' : 'testing');
            expect(fn (): Page => (new PrepareRecordSwitcherScreenshotAction)->seedForCapture())->toThrow(HttpException::class);
            expect(Page::query()->count())->toBe($before);
        }
    } finally {
        config()->set('app.env', $environment);
        app()->instance('env', $runtimeEnvironment);
        foreach (['CAPELL_SCREENSHOT_FIXTURE', 'CAPELL_SCREENSHOT_APP_PATH'] as $index => $key) {
            putenv($previous[$index] === false ? $key : $key . '=' . $previous[$index]);
        }
    }
});

it('requires the selected configured global actor for command seeding without an authenticated user', function (): void {
    auth()->logout();
    $email = getenv('CAPELL_SCREENSHOT_ADMIN_EMAIL');
    putenv('CAPELL_SCREENSHOT_ADMIN_EMAIL=missing-capture@example.test');
    try {
        expect(fn (): Page => (new PrepareRecordSwitcherScreenshotAction)->seedForCapture())->toThrow(RuntimeException::class, 'selected capture actor');
        expect(Page::query()->count())->toBe(0);
    } finally {
        putenv($email === false ? 'CAPELL_SCREENSHOT_ADMIN_EMAIL' : 'CAPELL_SCREENSHOT_ADMIN_EMAIL=' . $email);
    }
});

it('refuses unresolved physical paths before any fixture work', function (): void {
    $base = base_path();
    $path = getenv('CAPELL_SCREENSHOT_APP_PATH');
    $fixture = getenv('CAPELL_SCREENSHOT_FIXTURE');
    $missing = $base . '/missing-screenshot-checkout';
    putenv('CAPELL_SCREENSHOT_FIXTURE=record-state');
    putenv('CAPELL_SCREENSHOT_APP_PATH=' . $missing);
    app()->setBasePath($missing);
    try {
        expect(fn (): Page => (new PrepareRecordSwitcherScreenshotAction)->seedForCapture())->toThrow(HttpException::class);
    } finally {
        app()->setBasePath($base);
        putenv($path === false ? 'CAPELL_SCREENSHOT_APP_PATH' : 'CAPELL_SCREENSHOT_APP_PATH=' . $path);
        putenv($fixture === false ? 'CAPELL_SCREENSHOT_FIXTURE' : 'CAPELL_SCREENSHOT_FIXTURE=' . $fixture);
    }
});
