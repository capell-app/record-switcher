<?php

declare(strict_types=1);

namespace Capell\RecordSwitcher\Tests\Fixtures;

use Capell\Core\Models\Site;
use Capell\Tests\Fixtures\Models\User;
use Filament\Models\Contracts\HasTenants;
use Filament\Panel;
use Illuminate\Database\Eloquent\Model;

final class RecordSwitcherTenantUser extends User implements HasTenants
{
    protected $table = 'users';

    public function canAccessTenant(Model $tenant): bool
    {
        return $tenant instanceof Site && $this->getRolesForSite($tenant)->isNotEmpty();
    }

    /** @return list<Site> */
    public function getTenants(Panel $panel): array
    {
        return array_values(Site::query()->get()->filter(fn (Site $site): bool => $this->canAccessTenant($site))->all());
    }
}
