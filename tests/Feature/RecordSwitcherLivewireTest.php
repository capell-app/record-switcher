<?php

declare(strict_types=1);

use Capell\Admin\Filament\Resources\Pages\PageResource;
use Capell\Admin\Filament\Resources\Pages\Pages\EditPage;
use Capell\Core\Models\Blueprint;
use Capell\Core\Models\Page;
use Capell\Core\Models\PageUrl;
use Capell\Core\Models\Site;
use Capell\RecordSwitcher\Livewire\RecordSwitcher;
use Capell\RecordSwitcher\Tests\Fixtures\RecordSwitcherDisabledEditPage;
use Capell\RecordSwitcher\Tests\Fixtures\RecordSwitcherDisabledResource;
use Capell\RecordSwitcher\Tests\Fixtures\RecordSwitcherFixtures;
use Capell\RecordSwitcher\Tests\Fixtures\RecordSwitcherScopedPageResource;
use Capell\RecordSwitcher\Tests\Fixtures\RecordSwitcherScopedResource;
use Capell\RecordSwitcher\Tests\Fixtures\RecordSwitcherTestRecord;
use Capell\RecordSwitcher\Tests\Fixtures\RecordSwitcherTestRecordResource;
use Capell\RecordSwitcher\Tests\Fixtures\RecordSwitcherUnavailableResource;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Schema;
use Livewire\Livewire;

beforeEach(function (): void {
    $this->actingAs(RecordSwitcherFixtures::admin());
});

it('opens Page navigation and searches ranked names ancestors and public paths through Livewire', function (): void {
    $type = Blueprint::factory()->page()->default()->create();
    $site = Site::factory()->withTranslations(siteDomainData: ['domain' => 'navigator.test', 'scheme' => 'https', 'path' => null])->create(['name' => 'Main']);
    $otherSite = Site::factory()->withTranslations()->create(['name' => 'Secondary']);
    $parent = Page::factory()->site($site)->type($type)->create(['name' => 'Support']);
    $current = Page::factory()->site($site)->type($type)->parent($parent)->create(['name' => 'Current']);
    $sibling = Page::factory()->site($site)->type($type)->parent($parent)->create(['name' => 'Contact']);
    Page::factory()->site($otherSite)->type($type)->create(['name' => 'Aardvark']);
    Page::factory()->site($site)->type($type)->create(['name' => 'Zulu']);
    PageUrl::factory()->page($sibling)->site($site)->create(['url' => '/help/get-in-touch']);
    Page::query()->fixTree();

    $component = Livewire::test(RecordSwitcher::class, [
        'resourceClass' => PageResource::class,
        'pageClass' => EditPage::class,
        'recordKey' => (string) $current->getRouteKey(),
        'label' => 'Current',
    ])->assertSee('Current')->assertSee('Switch record')->call('getOptions');

    $options = [];
    $component->assertReturned(function (array $returned) use (&$options): bool {
        $options = $returned;

        return array_column($returned, 'label') === ['Contact', 'Support', 'Zulu', 'Aardvark'];
    });
    expect(array_column($options, 'label'))->toBe(['Contact', 'Support', 'Zulu', 'Aardvark'])
        ->and(array_column($options, 'group'))->toBe(['Related', 'This site', 'This site', 'Other sites'])
        ->and($options[0]['site'])->toBe('Main')
        ->and($options[0]['ancestors'])->toBe(['Support'])
        ->and($options[0]['path'])->toBe('https://navigator.test/help/get-in-touch');

    foreach (['CONTACT', 'support contact', '/help/get-in-touch'] as $search) {
        $component->call('getOptions', $search)->assertReturned([$options[0]]);
    }

    $component->call('getOptions', 'missing')->assertReturned([])
        ->call('getEditUrl', (string) $sibling->getRouteKey())->assertReturned($options[0]['value']);
});

it('opens non-Page navigation and applies permissions before the component limit', function (): void {
    RecordSwitcherFixtures::createRecordsTable();
    $current = RecordSwitcherTestRecord::query()->create(['name' => 'Current', 'code' => 'current']);
    $outside = RecordSwitcherTestRecord::query()->create(['name' => 'Outside', 'code' => 'outside-tenant']);
    $denied = RecordSwitcherTestRecord::query()->create(['name' => 'Denied', 'code' => 'denied']);
    $allowed = RecordSwitcherTestRecord::query()->create(['name' => 'Launch plan', 'code' => 'editorial', 'updated_at' => now()->subMinute()]);
    RecordSwitcherTestRecord::query()->create(['name' => 'Archive', 'code' => 'archive', 'updated_at' => now()->subDay()]);

    $component = Livewire::test(RecordSwitcher::class, [
        'resourceClass' => RecordSwitcherScopedResource::class,
        'pageClass' => RecordSwitcherDisabledEditPage::class,
        'recordKey' => RecordSwitcherFixtures::routeKey($current),
        'label' => 'Current',
        'limitResults' => 1,
    ])->assertSee('Switch record')->call('getOptions');

    $options = [];
    $component->assertReturned(function (array $returned) use (&$options): bool {
        $options = $returned;

        return array_column($returned, 'label') === ['Launch plan'];
    });
    expect(array_column($options, 'label'))->toBe(['Launch plan']);
    $component->call('getOptions', 'editorial')->assertReturned($options)
        ->call('getOptions', 'outside')->assertReturned([])
        ->call('getOptions', 'denied')->assertReturned([])
        ->call('getEditUrl', RecordSwitcherFixtures::routeKey($outside))->assertReturned(null)
        ->call('getEditUrl', RecordSwitcherFixtures::routeKey($denied))->assertReturned(null)
        ->call('getEditUrl', RecordSwitcherFixtures::routeKey($allowed))->assertReturned($options[0]['value']);

    $allowed->update(['code' => 'denied']);
    $component->call('getEditUrl', RecordSwitcherFixtures::routeKey($allowed))->assertReturned(null);
    $allowed->delete();
    $component->call('getEditUrl', RecordSwitcherFixtures::routeKey($allowed))->assertReturned(null)
        ->call('getEditUrl', 'javascript:alert(1)')->assertReturned(null)
        ->call('getEditUrl', 'https://foreign.test/edit')->assertReturned(null);
});

it('never returns inaccessible Page or ancestor context over the component endpoint', function (): void {
    $type = Blueprint::factory()->page()->default()->create();
    $site = Site::factory()->withTranslations()->create(['name' => 'Main']);
    $hiddenSite = Site::factory()->withTranslations()->create(['name' => 'Hidden site']);
    $current = Page::factory()->site($site)->type($type)->create(['name' => 'Current']);
    $secret = Page::factory()->site($site)->type($type)->create(['name' => 'Secret']);
    Page::factory()->site($site)->type($type)->parent($secret)->create(['name' => 'Visible child']);
    $hidden = Page::factory()->site($hiddenSite)->type($type)->create(['name' => 'Hidden page']);
    Page::query()->fixTree();

    $component = Livewire::test(RecordSwitcher::class, [
        'resourceClass' => RecordSwitcherScopedPageResource::class,
        'pageClass' => EditPage::class,
        'recordKey' => (string) $current->getRouteKey(),
        'label' => 'Current',
    ])->call('getOptions');

    $options = [];
    $component->assertReturned(function (array $returned) use (&$options): bool {
        $options = $returned;

        return array_column($returned, 'label') === ['Visible child'];
    });
    expect(array_column($options, 'label'))->toBe(['Visible child'])
        ->and($options[0]['ancestors'])->toBe([]);
    $component->call('getOptions', 'Secret')->assertReturned([])
        ->call('getOptions', 'Hidden')->assertReturned([])
        ->call('getEditUrl', (string) $secret->getRouteKey())->assertReturned(null)
        ->call('getEditUrl', (string) $hidden->getRouteKey())->assertReturned(null);
});

it('hides unavailable and opted-out resources even when their endpoints are called directly', function (string $resource): void {
    RecordSwitcherFixtures::createRecordsTable();
    $current = RecordSwitcherTestRecord::query()->create(['name' => 'Current', 'code' => 'current']);
    $other = RecordSwitcherTestRecord::query()->create(['name' => 'Other', 'code' => 'other']);

    Livewire::test(RecordSwitcher::class, [
        'resourceClass' => $resource,
        'pageClass' => RecordSwitcherDisabledEditPage::class,
        'recordKey' => RecordSwitcherFixtures::routeKey($current),
        'label' => 'Current',
    ])->assertSee('Current')->assertDontSee('Switch record')
        ->call('getOptions')->assertReturned([])
        ->call('getEditUrl', RecordSwitcherFixtures::routeKey($other))->assertReturned(null);
})->with([RecordSwitcherUnavailableResource::class, RecordSwitcherDisabledResource::class]);

it('handles no alternatives empty searches and wires loading and failure feedback to Livewire requests', function (): void {
    RecordSwitcherFixtures::createRecordsTable();
    $current = RecordSwitcherTestRecord::query()->create(['name' => 'Current', 'code' => 'current']);
    $component = Livewire::test(RecordSwitcher::class, [
        'resourceClass' => RecordSwitcherTestRecordResource::class,
        'pageClass' => RecordSwitcherDisabledEditPage::class,
        'recordKey' => RecordSwitcherFixtures::routeKey($current),
        'label' => 'Current',
    ])->assertDontSee('Switch record')->call('getOptions')->assertReturned([]);

    RecordSwitcherTestRecord::query()->create(['name' => 'Alternative', 'code' => 'other']);
    $component->call('$refresh')->assertSee('Switch record')
        ->assertSee('loadingMessage:', escape: false)
        ->assertSee('noSearchResultsMessage:', escape: false)
        ->assertSee('errorMessage:', escape: false)
        ->assertSee('$wire.getOptions(search)', escape: false)
        ->assertSee('$wire.getEditUrl(key)', escape: false)
        ->call('getOptions', 'missing')->assertReturned([])
        ->dispatch('record-switcher:refresh', label: '<b>Updated</b>')->assertSet('label', 'Updated');

    // Loading timers and rejected-promise presentation are exercised by the JS suite.
    // The component must propagate an unexpected failure, rather than report no results.
    Schema::drop('record_switcher_test_records');
    expect(fn () => $component->call('getOptions'))->toThrow(QueryException::class);
});
