<?php

declare(strict_types=1);

namespace Capell\RecordSwitcher\Tests\Fixtures;

use Capell\Tests\Fixtures\Models\User;
use Illuminate\Database\Schema\Blueprint as SchemaBlueprint;
use Illuminate\Support\Facades\Schema;
use RuntimeException;
use Spatie\Permission\Models\Role;

final class RecordSwitcherFixtures
{
    public static function createRecordsTable(): void
    {
        Schema::dropIfExists('record_switcher_test_records');
        Schema::create('record_switcher_test_records', static function (SchemaBlueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('code');
            $table->timestamps();
        });
    }

    public static function routeKey(RecordSwitcherTestRecord $record): string
    {
        $routeKey = $record->getRouteKey();

        throw_unless(is_string($routeKey) || is_int($routeKey), RuntimeException::class, 'Expected record switcher fixture route key to be scalar.');

        return (string) $routeKey;
    }

    public static function adminQueryBudget(): int
    {
        $manifest = capell_json_file_array(__DIR__ . '/../../capell.json');
        $budget = data_get($manifest, 'performance.adminQueryBudget', 10);

        return is_int($budget) ? $budget : 10;
    }

    public static function admin(): User
    {
        $user = User::factory()->create();
        $role = Role::findOrCreate('super_admin', 'web');
        $user->assignRole($role);

        return $user;
    }
}
