<?php

declare(strict_types=1);

use BezhanSalleh\FilamentShield\Facades\FilamentShield;
use BezhanSalleh\FilamentShield\Support\Utils;
use Capell\Admin\Filament\Resources\Pages\PageResource;
use Capell\Admin\Filament\Resources\Pages\Pages\EditPage;
use Capell\Core\Models\Blueprint;
use Capell\Core\Models\Page;
use Capell\Core\Models\Site;
use Capell\RecordSwitcher\Livewire\RecordSwitcher;
use Capell\RecordSwitcher\Tests\Fixtures\RecordSwitcherTenantUser;
use Filament\Facades\Filament;
use Filament\Http\Middleware\IdentifyTenant;
use Filament\Panel;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Route;
use Livewire\Livewire;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

it('restricts Livewire navigation to reachable records in the active Filament tenant and gates cross-site switching', function (): void {
    config()->set('permission.teams', true);
    resolve(PermissionRegistrar::class)->teams = true;
    resolve(PermissionRegistrar::class)->forgetCachedPermissions();

    $type = Blueprint::factory()->page()->default()->create();
    $restrictedType = Blueprint::factory()->page()->create();
    $site = Site::factory()->withTranslations()->create(['name' => 'Primary']);
    $otherSite = Site::factory()->withTranslations()->create(['name' => 'Secondary']);
    $forbiddenSite = Site::factory()->withTranslations()->create(['name' => 'Forbidden']);
    $current = Page::factory()->site($site)->type($type)->create(['name' => 'Current']);
    $denied = Page::factory()->site($site)->type($restrictedType)->create(['name' => 'Classified']);
    $allowed = Page::factory()->site($site)->type($type)->parent($denied)->create(['name' => 'Allowed']);
    Page::query()->fixTree();
    $otherCurrent = Page::factory()->site($otherSite)->type($type)->create(['name' => 'Other current']);
    $otherAllowed = Page::factory()->site($otherSite)->type($type)->create(['name' => 'Other allowed']);
    $forbidden = Page::factory()->site($forbiddenSite)->type($type)->create(['name' => 'Forbidden record']);
    $restrictedRole = Role::findOrCreate('restricted-editor', 'web');
    $restrictedType->syncRoleRestrictions([$restrictedRole->id]);

    $role = Role::findOrCreate('navigator-editor', 'web');
    $permissionConfig = Utils::getConfig()->permissions;
    foreach (['view_any', 'view', 'update'] as $affix) {
        $role->givePermissionTo(Permission::findOrCreate(FilamentShield::defaultPermissionKeyBuilder(
            affix: $affix,
            separator: $permissionConfig->separator,
            subject: 'Page',
            case: $permissionConfig->case,
        ), 'web'));
    }

    Relation::morphMap(['record-switcher-tenant-user' => RecordSwitcherTenantUser::class]);
    config()->set('auth.providers.users.model', RecordSwitcherTenantUser::class);
    $actor = RecordSwitcherTenantUser::query()->create(['name' => 'Editor', 'email' => 'navigator@example.test', 'password' => 'password']);
    $actor->assignRoleForSite($site, 'navigator-editor');
    $actor->assignRoleForSite($otherSite, 'navigator-editor');
    $this->actingAs($actor);

    $previousPanel = Filament::getCurrentPanel();
    $panel = Panel::make()->id('record-switcher-tenant')->path('record-switcher-tenant')
        ->tenant(Site::class, ownershipRelationship: 'site')->resources([PageResource::class]);
    Filament::registerPanel($panel);
    Filament::setCurrentPanel($panel);
    // Match Filament's panel boot: setTenant alone does not register the model scope.
    PageResource::registerTenancyModelGlobalScope($panel);
    Route::get('/record-switcher-tenant/{tenant}/pages/{record}/edit', fn (): string => 'Edit page')
        ->middleware(IdentifyTenant::class)->name('filament.record-switcher-tenant.resources.pages.edit');

    try {
        $this->get('/record-switcher-tenant/' . $site->getRouteKey() . '/pages/' . $current->getRouteKey() . '/edit')->assertOk();
        resolve(PermissionRegistrar::class)->setPermissionsTeamId($site->getKey());
        $actor->unsetRelation('roles')->unsetRelation('permissions');
        expect(Filament::getTenant()?->is($site))->toBeTrue()
            ->and($actor->canAccessTenant($otherSite))->toBeTrue()
            ->and($actor->canAccessTenant($forbiddenSite))->toBeFalse()
            ->and(PageResource::canEdit($denied))->toBeFalse();

        $component = Livewire::test(RecordSwitcher::class, [
            'resourceClass' => PageResource::class,
            'pageClass' => EditPage::class,
            'recordKey' => (string) $current->getRouteKey(),
            'label' => 'Current',
            'limitResults' => 1,
        ])->assertSee('Switch record')->call('getOptions');

        $component->assertReturned(fn (array $options): bool => array_column($options, 'label') === ['Allowed'] && $options[0]['ancestors'] === []);
        $component->call('getEditUrl', (string) $allowed->getRouteKey())
            ->assertReturned(url('/record-switcher-tenant/' . $site->getRouteKey() . '/pages/' . $allowed->getRouteKey() . '/edit'));
        foreach ([$denied, $otherCurrent, $otherAllowed, $forbidden] as $unreachable) {
            $component->call('getOptions', $unreachable->name)->assertReturned([])
                ->call('getEditUrl', (string) $unreachable->getRouteKey())->assertReturned(null);
        }

        $this->get('/record-switcher-tenant/' . $forbiddenSite->getRouteKey() . '/pages/' . $forbidden->getRouteKey() . '/edit')->assertNotFound();
        expect(Filament::getTenant()?->is($site))->toBeTrue();

        $this->get('/record-switcher-tenant/' . $otherSite->getRouteKey() . '/pages/' . $otherCurrent->getRouteKey() . '/edit')->assertOk();
        resolve(PermissionRegistrar::class)->setPermissionsTeamId($otherSite->getKey());
        $actor->unsetRelation('roles')->unsetRelation('permissions');
        expect(Filament::getTenant()?->is($otherSite))->toBeTrue();
        $component->call('getOptions')->assertReturned([])
            ->call('getEditUrl', (string) $allowed->getRouteKey())->assertReturned(null);

        $otherComponent = Livewire::test(RecordSwitcher::class, [
            'resourceClass' => PageResource::class,
            'pageClass' => EditPage::class,
            'recordKey' => (string) $otherCurrent->getRouteKey(),
            'label' => 'Other current',
        ])->call('getOptions');
        $otherComponent->assertReturned(fn (array $options): bool => array_column($options, 'label') === ['Other allowed']);
        $otherComponent->call('getEditUrl', (string) $otherAllowed->getRouteKey())
            ->assertReturned(url('/record-switcher-tenant/' . $otherSite->getRouteKey() . '/pages/' . $otherAllowed->getRouteKey() . '/edit'))
            ->call('getEditUrl', (string) $allowed->getRouteKey())->assertReturned(null);
        // A global actor bypasses SiteScope and Page policies: only Filament can isolate this request.
        resolve(PermissionRegistrar::class)->setPermissionsTeamId(null);
        $actor->assignRole(Role::findOrCreate('super_admin', 'web'));
        $actor->unsetRelation('roles')->unsetRelation('permissions');
        $globalComponent = Livewire::test(RecordSwitcher::class, [
            'resourceClass' => PageResource::class,
            'pageClass' => EditPage::class,
            'recordKey' => (string) $otherCurrent->getRouteKey(),
            'label' => 'Other current',
        ])->call('getOptions');
        $globalComponent->assertReturned(fn (array $options): bool => array_column($options, 'label') === ['Other allowed']);
        $globalComponent->call('getEditUrl', (string) $allowed->getRouteKey())->assertReturned(null);
    } finally {
        resolve(PermissionRegistrar::class)->setPermissionsTeamId(null);
        resolve(PermissionRegistrar::class)->teams = false;
        resolve(PermissionRegistrar::class)->forgetCachedPermissions();
        config()->set('permission.teams', false);
        Filament::setTenant(null);
        Filament::setCurrentPanel($previousPanel);
    }
});
