<?php

declare(strict_types=1);

namespace Capell\RecordSwitcher\Actions;

use Capell\RecordSwitcher\Models\RecordSwitcherEntry;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Lorisleiva\Actions\Concerns\AsFake;
use Lorisleiva\Actions\Concerns\AsObject;

final class ToggleRecordSwitcherPinAction
{
    use AsFake;
    use AsObject;

    /** Returns whether the record is pinned after the call. */
    public function handle(string $resourceClass, string $recordKey, Authenticatable $user): bool
    {
        if (! $user instanceof Model) {
            return false;
        }

        $entry = RecordSwitcherEntry::query()->firstOrNew([
            'user_type' => $user->getMorphClass(),
            'user_id' => $user->getKey(),
            'resource_class' => $resourceClass,
            'record_key' => $recordKey,
        ]);

        $entry->pinned_at = $entry->pinned_at === null ? CarbonImmutable::now() : null;

        if ($entry->pinned_at === null && $entry->visited_at === null) {
            if ($entry->exists) {
                $entry->delete();
            }

            return false;
        }

        $entry->save();

        return $entry->pinned_at !== null;
    }
}
