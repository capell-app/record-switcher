<?php

declare(strict_types=1);

namespace Capell\RecordSwitcher\Actions;

use Capell\RecordSwitcher\Models\RecordSwitcherEntry;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Lorisleiva\Actions\Concerns\AsFake;
use Lorisleiva\Actions\Concerns\AsObject;

final class RecordRecordSwitcherVisitAction
{
    use AsFake;
    use AsObject;

    /** Most recent records kept per user and resource. */
    public const int KEEP = 10;

    public function handle(string $resourceClass, string $recordKey, Authenticatable $user): void
    {
        if (! $user instanceof Model) {
            return;
        }

        $scope = ['user_type' => $user->getMorphClass(), 'user_id' => $user->getKey(), 'resource_class' => $resourceClass];

        RecordSwitcherEntry::query()->updateOrCreate([...$scope, 'record_key' => $recordKey], ['visited_at' => now()]);

        // Pinned rows stay even when old; only unpinned visits are trimmed.
        $stale = RecordSwitcherEntry::query()
            ->where($scope)
            ->whereNull('pinned_at')
            ->whereNotNull('visited_at')
            ->orderByDesc('visited_at')
            ->orderByDesc('id')
            ->skip(self::KEEP)
            ->take(PHP_INT_MAX)
            ->pluck('id');

        if ($stale->isNotEmpty()) {
            RecordSwitcherEntry::query()->whereKey($stale)->delete();
        }
    }
}
