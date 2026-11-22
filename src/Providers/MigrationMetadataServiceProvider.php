<?php

declare(strict_types=1);

namespace Capell\RecordSwitcher\Providers;

use Capell\Core\Support\Migration\MigrationRootRegistry;
use Illuminate\Support\ServiceProvider;
use Override;

final class MigrationMetadataServiceProvider extends ServiceProvider
{
    #[Override]
    public function register(): void
    {
        $this->callAfterResolving(MigrationRootRegistry::class, static function (MigrationRootRegistry $registry): void {
            $registry->register('capell-app/record-switcher', __DIR__ . '/../../database/migrations', [
                '2026_11_20_000001_create_record_switcher_entries_table' => ['record_switcher_entries'],
            ]);
        });
    }
}
