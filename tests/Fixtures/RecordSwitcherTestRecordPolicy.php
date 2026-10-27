<?php

declare(strict_types=1);

namespace Capell\RecordSwitcher\Tests\Fixtures;

use Illuminate\Contracts\Auth\Authenticatable;

/**
 * Strict authorisation requires a policy for every resource model. The fixture
 * grants every ability so these tests exercise the switcher's own scoping.
 */
final class RecordSwitcherTestRecordPolicy
{
    public function viewAny(Authenticatable $user): bool
    {
        return true;
    }

    public function view(Authenticatable $user, RecordSwitcherTestRecord $record): bool
    {
        return true;
    }

    public function create(Authenticatable $user): bool
    {
        return true;
    }

    public function update(Authenticatable $user, RecordSwitcherTestRecord $record): bool
    {
        return true;
    }

    public function delete(Authenticatable $user, RecordSwitcherTestRecord $record): bool
    {
        return true;
    }

    public function deleteAny(Authenticatable $user): bool
    {
        return true;
    }
}
