<?php

declare(strict_types=1);

namespace Capell\RecordSwitcher\Actions\Fixtures;

use Capell\Admin\Support\SiteScope;
use Capell\Core\Models\Blueprint;
use Capell\Core\Models\Page;
use Capell\Core\Models\Site;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use RuntimeException;

final class PrepareRecordSwitcherScreenshotAction
{
    public const int ScreenshotPageId = 900001;

    private const string Ownership = 'record-switcher-screenshot';

    public function handle(): Page
    {
        $actor = auth()->user();
        abort_unless($actor !== null && SiteScope::isGlobalActor($actor), 403);
        $this->assertDisposableScreenshotEnvironment();

        return $this->seedForCapture();
    }

    public function seedForCapture(): Page
    {
        $this->assertDisposableScreenshotEnvironment();
        $actor = auth()->user();
        if ($actor === null) {
            $model = config('auth.providers.users.model');
            throw_unless(is_string($model) && is_subclass_of($model, Model::class), RuntimeException::class, 'Screenshot fixtures require the selected capture actor.');
            $email = getenv('CAPELL_SCREENSHOT_ADMIN_EMAIL') ?: (getenv('CAPELL_ADMIN_EMAIL') ?: 'admin@example.com');
            $actor = $model::query()->where('email', $email)->first();
        }

        throw_unless($actor instanceof Authenticatable, RuntimeException::class, 'Screenshot fixtures require the selected capture actor.');
        abort_unless(SiteScope::isGlobalActor($actor), 403);

        return (new Page)->getConnection()->transaction(function (): Page {
            $type = Blueprint::withTrashed()->where('key', 'screenshot-record-switcher-page')->lockForUpdate()->first();
            throw_if($type !== null && ($type->trashed() || data_get($type->meta, 'screenshot_fixture') !== self::Ownership), RuntimeException::class, 'The Record Switcher screenshot blueprint belongs to another record.');
            $type ??= Blueprint::factory()->page()->create(['key' => 'screenshot-record-switcher-page', 'meta' => ['screenshot_fixture' => self::Ownership]]);
            $main = $this->site('record-switcher-main.test', 'Editorial studio');
            $partner = $this->site('record-switcher-partner.test', 'Partner studio');
            $current = $this->page($main, $type, 'Editorial guide', self::ScreenshotPageId);
            $this->page($main, $type, 'Publishing guide');
            $this->page($partner, $type, 'Partner guide');

            return $current;
        });
    }

    private function assertDisposableScreenshotEnvironment(): void
    {
        $application = getenv('CAPELL_SCREENSHOT_APP_PATH');
        $appPath = is_string($application) ? realpath($application) : false;
        $basePath = realpath(base_path());
        abort_unless(app()->environment(['local', 'testing'])
            && getenv('CAPELL_SCREENSHOT_FIXTURE') === 'record-state'
            && is_string($appPath)
            && is_string($basePath)
            && $appPath === $basePath, 403);

        $captureEmail = getenv('CAPELL_SCREENSHOT_ADMIN_EMAIL') ?: (getenv('CAPELL_ADMIN_EMAIL') ?: 'admin@example.com');
        $authenticated = auth()->user();
        throw_if(
            $authenticated !== null && data_get($authenticated, 'email') !== $captureEmail,
            RuntimeException::class,
            'Screenshot fixtures require the selected capture actor.',
        );
    }

    private function site(string $domain, string $name): Site
    {
        $matches = Site::withTrashed()->where(static function (Builder $query) use ($domain, $name): void {
            $query->where('name', $name)->orWhereHas('siteDomains', static fn (Builder $query): Builder => $query->where('domain', $domain));
        })->lockForUpdate()->get();
        throw_if($matches->count() > 1, RuntimeException::class, 'The Record Switcher screenshot site identity has multiple owners.');
        $site = $matches->first();
        throw_if($site !== null && ($site->trashed() || $site->name !== $name || data_get($site->meta, 'screenshot_fixture') !== self::Ownership || ! $site->siteDomains()->where('domain', $domain)->exists()), RuntimeException::class, 'The Record Switcher screenshot site identity belongs to another record.');

        return $site ?? Site::factory()->withTranslations(siteDomainData: ['domain' => $domain, 'scheme' => 'https'])
            ->create(['name' => $name, 'meta' => ['screenshot_fixture' => self::Ownership]]);
    }

    private function page(Site $site, Blueprint $type, string $name, ?int $fixedId = null): Page
    {
        if ($fixedId !== null) {
            $existing = Page::withTrashed()->lockForUpdate()->find($fixedId);
            if ($existing instanceof Page) {
                throw_unless(! $existing->trashed() && data_get($existing->meta, 'screenshot_fixture') === self::Ownership && $existing->site_id === $site->id
                    && $existing->blueprint_id === $type->id
                    && $existing->name === $name, RuntimeException::class, 'The Record Switcher screenshot page ID is already in use.');

                return $existing;
            }

            return Page::factory()->site($site)->type($type)->withTranslations(data: ['title' => $name])
                ->create(['id' => $fixedId, 'name' => $name, 'meta' => ['screenshot_fixture' => self::Ownership]]);
        }

        $page = Page::withTrashed()->where('site_id', $site->id)->where('name', $name)->lockForUpdate()->first();
        throw_if($page !== null && ($page->trashed() || $page->blueprint_id !== $type->id || $page->workspace_id !== 0 || data_get($page->meta, 'screenshot_fixture') !== self::Ownership), RuntimeException::class, 'A Record Switcher screenshot page belongs to another record.');

        return $page ?? Page::factory()->site($site)->type($type)->withTranslations(data: ['title' => $name])
            ->create(['name' => $name, 'meta' => ['screenshot_fixture' => self::Ownership]]);
    }
}
