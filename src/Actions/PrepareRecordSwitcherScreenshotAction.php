<?php

declare(strict_types=1);

namespace Capell\RecordSwitcher\Actions;

use Capell\Admin\Support\SiteScope;
use Capell\Core\Models\Blueprint;
use Capell\Core\Models\Page;
use Capell\Core\Models\Site;
use Illuminate\Database\Eloquent\Builder;

final class PrepareRecordSwitcherScreenshotAction
{
    public function handle(): Page
    {
        $application = getenv('CAPELL_SCREENSHOT_APP_PATH');
        $actor = auth()->user();
        abort_unless(app()->environment(['local', 'testing'])
            && getenv('CAPELL_SCREENSHOT_FIXTURE') === 'record-state'
            && is_string($application)
            && realpath($application) === realpath(base_path())
            && $actor !== null && SiteScope::isGlobalActor($actor), 403);

        return (new Page)->getConnection()->transaction(function (): Page {
            $type = Blueprint::query()->where('key', 'screenshot-record-switcher-page')->first();
            $type ??= Blueprint::factory()->page()->create(['key' => 'screenshot-record-switcher-page']);
            $main = $this->site('record-switcher-main.test', 'Editorial studio');
            $partner = $this->site('record-switcher-partner.test', 'Partner studio');
            $current = $this->page($main, $type, 'Editorial guide');
            $this->page($main, $type, 'Publishing guide');
            $this->page($partner, $type, 'Partner guide');

            return $current;
        });
    }

    private function site(string $domain, string $name): Site
    {
        return Site::query()->where('name', $name)
            ->whereHas('siteDomains', fn (Builder $query): Builder => $query->where('domain', $domain))->first()
            ?? Site::factory()->withTranslations(siteDomainData: ['domain' => $domain, 'scheme' => 'https'])
                ->create(['name' => $name]);
    }

    private function page(Site $site, Blueprint $type, string $name): Page
    {
        return Page::query()->where('site_id', $site->id)->where('blueprint_id', $type->id)
            ->where('name', $name)->where('workspace_id', 0)->first()
            ?? Page::factory()->site($site)->type($type)->withTranslations(data: ['title' => $name])
                ->create(['name' => $name]);
    }
}
