<?php

declare(strict_types=1);

use Capell\Admin\Filament\Resources\Pages\PageResource;
use Capell\Core\Models\Blueprint;
use Capell\Core\Models\Page;
use Capell\Core\Models\PageUrl;
use Capell\Core\Models\Site;
use Capell\RecordSwitcher\Actions\BuildRecordSwitcherOptionsAction;
use Capell\RecordSwitcher\Data\RecordSwitcherOptionData;
use Capell\RecordSwitcher\Filament\RecordSwitcherHeadingExtender;
use Capell\RecordSwitcher\Livewire\RecordSwitcher;
use Capell\RecordSwitcher\Tests\Fixtures\RecordSwitcherDisabledEditPage;
use Capell\RecordSwitcher\Tests\Fixtures\RecordSwitcherDisabledResource;
use Capell\RecordSwitcher\Tests\Fixtures\RecordSwitcherEmptySearchResource;
use Capell\RecordSwitcher\Tests\Fixtures\RecordSwitcherFixtures;
use Capell\RecordSwitcher\Tests\Fixtures\RecordSwitcherScopedPageResource;
use Capell\RecordSwitcher\Tests\Fixtures\RecordSwitcherScopedResource;
use Capell\RecordSwitcher\Tests\Fixtures\RecordSwitcherTestRecord;
use Capell\RecordSwitcher\Tests\Fixtures\RecordSwitcherTestRecordResource;
use Capell\RecordSwitcher\Tests\Fixtures\RecordSwitcherUnavailableResource;
use Illuminate\Support\Facades\DB;
use Livewire\Features\SupportLockedProperties\CannotUpdateLockedPropertyException;
use Livewire\Livewire;

beforeEach(function (): void {
    $this->actingAs(RecordSwitcherFixtures::admin());
});

it('returns page names separately from typed option context', function (): void {
    $pageType = Blueprint::factory()->page()->default()->create();
    $currentPage = Page::factory()->type($pageType)->create(['name' => 'Home']);
    Page::factory()->type($pageType)->create(['name' => 'Pricing']);

    $options = BuildRecordSwitcherOptionsAction::run(
        resourceClass: PageResource::class,
        recordKey: (string) $currentPage->getRouteKey(),
    );

    expect($options)->toHaveCount(1)
        ->and($options[0]['label'])->toBe('Pricing');
});

it('searches generic resource options with declared searchable attributes', function (): void {
    RecordSwitcherFixtures::createRecordsTable();

    $currentRecord = RecordSwitcherTestRecord::query()->create(['name' => 'Current', 'code' => 'current']);
    RecordSwitcherTestRecord::query()->create(['name' => 'Launch Plan', 'code' => 'editorial']);
    RecordSwitcherTestRecord::query()->create(['name' => 'Archive', 'code' => 'old']);

    $options = BuildRecordSwitcherOptionsAction::run(
        resourceClass: RecordSwitcherTestRecordResource::class,
        recordKey: RecordSwitcherFixtures::routeKey($currentRecord),
        search: 'launch',
    );

    expect($options)->toHaveCount(1)
        ->and($options[0]['label'])->toBe('Launch Plan')
        ->and($options[0]['value'])->toBe('/record-switcher-test-records/2/edit');
});

it('keeps empty searchable attributes from breaking generic option loading', function (): void {
    RecordSwitcherFixtures::createRecordsTable();

    $currentRecord = RecordSwitcherTestRecord::query()->create(['name' => 'Current', 'code' => 'current']);
    RecordSwitcherTestRecord::query()->create(['name' => 'Beta', 'code' => 'beta']);
    RecordSwitcherTestRecord::query()->create(['name' => 'Alpha', 'code' => 'alpha']);

    $options = BuildRecordSwitcherOptionsAction::run(
        resourceClass: RecordSwitcherEmptySearchResource::class,
        recordKey: RecordSwitcherFixtures::routeKey($currentRecord),
        limitResults: 1,
        search: 'anything',
    );

    expect($options)->toHaveCount(1)
        ->and($options[0]['label'])->toBe('Beta');
});

it('prioritizes recently updated generic records before older records', function (): void {
    RecordSwitcherFixtures::createRecordsTable();

    $currentRecord = RecordSwitcherTestRecord::query()->create(['name' => 'Current', 'code' => 'current']);
    RecordSwitcherTestRecord::query()->create([
        'name' => 'Older',
        'code' => 'older',
        'updated_at' => now()->subDays(2),
    ]);
    RecordSwitcherTestRecord::query()->create([
        'name' => 'Recent',
        'code' => 'recent',
        'updated_at' => now()->subMinute(),
    ]);

    $options = BuildRecordSwitcherOptionsAction::run(
        resourceClass: RecordSwitcherTestRecordResource::class,
        recordKey: RecordSwitcherFixtures::routeKey($currentRecord),
    );

    expect($options)->toHaveCount(2)
        ->and($options[0]['label'])->toBe('Recent')
        ->and($options[1]['label'])->toBe('Older');
});

it('prioritizes page siblings before same-site and other-site pages', function (): void {
    $pageType = Blueprint::factory()->page()->default()->create();
    $primarySite = Site::factory()->withTranslations(siteDomainData: [
        'domain' => 'primary-switcher.example.test',
        'scheme' => 'https',
        'path' => null,
    ])->create(['name' => 'Primary site']);
    $secondarySite = Site::factory()->withTranslations(siteDomainData: [
        'domain' => 'secondary-switcher.example.test',
        'scheme' => 'https',
        'path' => null,
    ])->create(['name' => 'Secondary site']);
    $parentPage = Page::factory()->site($primarySite)->type($pageType)->create(['name' => 'Section']);
    $currentPage = Page::factory()->site($primarySite)->type($pageType)->parent($parentPage)->create(['name' => 'Current']);
    Page::factory()->site($secondarySite)->type($pageType)->create(['name' => 'Aardvark other site']);
    Page::factory()->site($primarySite)->type($pageType)->parent($parentPage)->create(['name' => 'Beta sibling']);
    Page::factory()->site($primarySite)->type($pageType)->create(['name' => 'Zulu same site']);
    Page::query()->fixTree();

    $options = BuildRecordSwitcherOptionsAction::run(
        resourceClass: PageResource::class,
        recordKey: (string) $currentPage->getRouteKey(),
    );

    expect($options)->toHaveCount(4)
        ->and($options[0]['label'])->toContain('Beta sibling')
        ->and($options[1]['label'])->toContain('Section')
        ->and($options[2]['label'])->toContain('Zulu same site')
        ->and($options[3]['label'])->toContain('Aardvark other site');
});

it('keeps page option rendering inside the manifest admin query budget', function (): void {
    $pageType = Blueprint::factory()->page()->default()->create();
    $site = Site::factory()->withTranslations(siteDomainData: [
        'domain' => 'example.test',
        'scheme' => 'https',
        'path' => '',
    ])->create(['name' => 'Primary site']);
    $currentPage = Page::factory()->site($site)->type($pageType)->create(['name' => 'Current']);
    $parentPage = Page::factory()->site($site)->type($pageType)->create(['name' => 'Section']);
    Page::factory()->site($site)->type($pageType)->parent($parentPage)->create(['name' => 'Pricing']);
    Page::query()->fixTree();

    DB::flushQueryLog();
    DB::enableQueryLog();

    $options = BuildRecordSwitcherOptionsAction::run(
        resourceClass: PageResource::class,
        recordKey: (string) $currentPage->getRouteKey(),
        search: 'pricing',
    );
    $queryCount = count(DB::getQueryLog());

    DB::disableQueryLog();

    expect($options)->toHaveCount(1)
        ->and($options[0]['ancestors'])->toContain('Section')
        ->and($queryCount)->toBeLessThanOrEqual(RecordSwitcherFixtures::adminQueryBudget());
});

it('lets resources opt out of heading replacement', function (): void {
    expect((new RecordSwitcherHeadingExtender)->supports(new RecordSwitcherDisabledEditPage))->toBeFalse();
});

it('keeps other-site root pages behind every current-site page', function (): void {
    $type = Blueprint::factory()->page()->default()->create();
    $site = Site::factory()->withTranslations()->create();
    $otherSite = Site::factory()->withTranslations()->create();
    $current = Page::factory()->site($site)->type($type)->create(['name' => 'Current']);
    $parent = Page::factory()->site($site)->type($type)->create(['name' => 'Section']);
    Page::factory()->site($site)->type($type)->parent($parent)->create(['name' => 'Child']);
    Page::factory()->site($otherSite)->type($type)->create(['name' => 'Aardvark']);

    $options = BuildRecordSwitcherOptionsAction::run(PageResource::class, (string) $current->getRouteKey());

    expect(array_column($options, 'label'))->toBe(['Section', 'Child', 'Aardvark'])
        ->and(array_column($options, 'group'))->toBe(['Related', 'This site', 'Other sites']);
});

it('matches ancestor names while keeping context out of the label', function (): void {
    $type = Blueprint::factory()->page()->default()->create();
    $current = Page::factory()->type($type)->create(['name' => 'Current']);
    $parent = Page::factory()->type($type)->create(['name' => 'Support']);
    Page::factory()->type($type)->parent($parent)->create(['name' => 'Contact']);
    Page::query()->fixTree();

    $options = BuildRecordSwitcherOptionsAction::run(PageResource::class, (string) $current->getRouteKey(), search: 'support contact');

    expect($options)->toHaveCount(1)
        ->and($options[0]['label'])->toBe('Contact')
        ->and($options[0]['ancestors'])->toBe(['Support']);
});

it('matches literal public paths and words across typed context', function (): void {
    $option = new RecordSwitcherOptionData(
        value: '/admin/pages/2/edit',
        label: 'Contact',
        site: 'Primary',
        ancestors: ['Support'],
        path: 'https://example.test/help/contact-us',
    );

    expect($option->matches('SUPPORT /help/'))->toBeTrue()
        ->and($option->matches('%'))->toBeFalse()
        ->and($option->matches('<script>'))->toBeFalse()
        ->and($option->matches('missing'))->toBeFalse()
        ->and($option->toArray()['ancestors'])->toBe(['Support']);
});

it('returns nothing for guests or missing current pages', function (): void {
    $type = Blueprint::factory()->page()->default()->create();
    $current = Page::factory()->type($type)->create();
    Page::factory()->type($type)->create();
    auth()->logout();

    expect(BuildRecordSwitcherOptionsAction::run(PageResource::class, (string) $current->getRouteKey()))->toBe([]);
    $this->actingAs(RecordSwitcherFixtures::admin());
    expect(BuildRecordSwitcherOptionsAction::run(PageResource::class, 'missing'))->toBe([]);
});

it('hides the control when there are no alternatives and honours resource opt-out on requests', function (): void {
    RecordSwitcherFixtures::createRecordsTable();
    $current = RecordSwitcherTestRecord::query()->create(['name' => 'Current', 'code' => 'current']);
    $component = Livewire::test(RecordSwitcher::class, [
        'resourceClass' => RecordSwitcherTestRecordResource::class,
        'pageClass' => RecordSwitcherDisabledEditPage::class,
        'recordKey' => RecordSwitcherFixtures::routeKey($current),
        'label' => 'Current',
    ]);
    $component->assertSee('Current')->assertDontSee('Switch record')
        ->dispatch('record-switcher:refresh', label: '<b>Updated title</b>')
        ->assertSee('Updated title')->assertDontSee('<b>Updated title</b>', escape: false);
    RecordSwitcherTestRecord::query()->create(['name' => 'Alternative', 'code' => 'other']);
    $component->call('$refresh')->assertSee('Switch record');

    expect(BuildRecordSwitcherOptionsAction::run(RecordSwitcherDisabledResource::class, RecordSwitcherFixtures::routeKey($current)))->toBe([]);
});

it('rejects deleted destinations when selection is revalidated', function (): void {
    RecordSwitcherFixtures::createRecordsTable();
    $current = RecordSwitcherTestRecord::query()->create(['name' => 'Current', 'code' => 'current']);
    $other = RecordSwitcherTestRecord::query()->create(['name' => 'Other', 'code' => 'other']);
    $component = new RecordSwitcher;
    $component->resourceClass = RecordSwitcherTestRecordResource::class;
    $component->recordKey = RecordSwitcherFixtures::routeKey($current);

    expect($component->getEditUrl(RecordSwitcherFixtures::routeKey($other)))->toBe('/record-switcher-test-records/2/edit');
    $other->delete();
    expect($component->getEditUrl(RecordSwitcherFixtures::routeKey($other)))->toBeNull();
});

it('applies resource scoping and policies before limiting results and revalidating URLs', function (): void {
    RecordSwitcherFixtures::createRecordsTable();
    $current = RecordSwitcherTestRecord::query()->create(['name' => 'Current', 'code' => 'current']);
    RecordSwitcherTestRecord::query()->create(['name' => 'Outside', 'code' => 'outside-tenant']);
    $denied = RecordSwitcherTestRecord::query()->create(['name' => 'Denied', 'code' => 'denied']);
    $allowed = RecordSwitcherTestRecord::query()->create(['name' => 'Allowed', 'code' => 'allowed']);
    $resource = RecordSwitcherScopedResource::class;
    $options = BuildRecordSwitcherOptionsAction::run($resource, RecordSwitcherFixtures::routeKey($current), limitResults: 1);

    expect(array_column($options, 'label'))->toBe(['Allowed'])
        ->and(BuildRecordSwitcherOptionsAction::run($resource, RecordSwitcherFixtures::routeKey($current), search: 'outside'))->toBe([])
        ->and(BuildRecordSwitcherOptionsAction::run($resource, RecordSwitcherFixtures::routeKey($current), targetKey: RecordSwitcherFixtures::routeKey($denied)))->toBe([]);
    $allowed->update(['code' => 'denied']);
    expect(BuildRecordSwitcherOptionsAction::run($resource, RecordSwitcherFixtures::routeKey($current), targetKey: RecordSwitcherFixtures::routeKey($allowed)))->toBe([]);
});

it('fails closed for resources without edit routes', function (): void {
    RecordSwitcherFixtures::createRecordsTable();
    $current = RecordSwitcherTestRecord::query()->create(['name' => 'Current', 'code' => 'current']);
    RecordSwitcherTestRecord::query()->create(['name' => 'Other', 'code' => 'other']);
    expect(BuildRecordSwitcherOptionsAction::run(RecordSwitcherUnavailableResource::class, RecordSwitcherFixtures::routeKey($current)))->toBe([]);
});

it('caps the result limit and locks resource context against browser changes', function (): void {
    RecordSwitcherFixtures::createRecordsTable();
    $current = RecordSwitcherTestRecord::query()->create(['name' => 'Current', 'code' => 'current']);
    foreach (range(1, 55) as $index) {
        RecordSwitcherTestRecord::query()->create(['name' => 'Record ' . $index, 'code' => 'record']);
    }

    expect(BuildRecordSwitcherOptionsAction::run(RecordSwitcherTestRecordResource::class, RecordSwitcherFixtures::routeKey($current), limitResults: 10000))->toHaveCount(50);
    Livewire::test(RecordSwitcher::class, [
        'resourceClass' => RecordSwitcherTestRecordResource::class,
        'pageClass' => RecordSwitcherDisabledEditPage::class,
        'recordKey' => RecordSwitcherFixtures::routeKey($current),
        'label' => 'Current',
    ])->set('resourceClass', RecordSwitcherDisabledResource::class);
})->throws(CannotUpdateLockedPropertyException::class);

it('does not expose or search inaccessible Page or ancestor context', function (): void {
    $type = Blueprint::factory()->page()->default()->create();
    $site = Site::factory()->withTranslations()->create(['name' => 'Main']);
    $hiddenSite = Site::factory()->withTranslations()->create(['name' => 'Hidden site']);
    $current = Page::factory()->site($site)->type($type)->create(['name' => 'Current']);
    $secret = Page::factory()->site($site)->type($type)->create(['name' => 'Secret']);
    Page::factory()->site($site)->type($type)->parent($secret)->create(['name' => 'Visible child']);
    Page::factory()->site($hiddenSite)->type($type)->create(['name' => 'Hidden page']);
    Page::query()->fixTree();
    $resource = RecordSwitcherScopedPageResource::class;

    $options = BuildRecordSwitcherOptionsAction::run($resource, (string) $current->getRouteKey());
    expect(array_column($options, 'label'))->toBe(['Visible child'])
        ->and($options[0]['ancestors'])->toBe([])
        ->and(BuildRecordSwitcherOptionsAction::run($resource, (string) $current->getRouteKey(), search: 'secret'))->toBe([])
        ->and(BuildRecordSwitcherOptionsAction::run($resource, (string) $current->getRouteKey(), search: 'hidden'))->toBe([]);
});

it('finds a Page by its public path without matching its name', function (): void {
    $type = Blueprint::factory()->page()->default()->create();
    $site = Site::factory()->withTranslations(siteDomainData: ['domain' => 'switcher.test', 'scheme' => 'https', 'path' => null])->create();
    $current = Page::factory()->site($site)->type($type)->create(['name' => 'Current']);
    $target = Page::factory()->site($site)->type($type)->create(['name' => 'Contact']);
    PageUrl::factory()->page($target)->site($site)->create(['url' => '/help/get-in-touch']);

    $options = BuildRecordSwitcherOptionsAction::run(PageResource::class, (string) $current->getRouteKey(), search: '/help/get-in-touch');
    expect($options)->toHaveCount(1)
        ->and($options[0]['label'])->toBe('Contact')
        ->and($options[0]['path'])->toBe('https://switcher.test/help/get-in-touch');
});
