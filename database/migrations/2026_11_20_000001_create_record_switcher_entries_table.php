<?php

declare(strict_types=1);

use Capell\Core\Support\TableName;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (TableName::existsAndIsOwned('record_switcher_entries', basename(__FILE__, '.php'))) {
            return;
        }

        Schema::create(TableName::resolve('record_switcher_entries'), function (Blueprint $table): void {
            $table->id();
            $table->morphs('user');
            $table->string('resource_class');
            $table->string('record_key', 64);
            $table->timestamp('pinned_at')->nullable();
            $table->timestamp('visited_at')->nullable();
            $table->timestamps();

            $table->unique(['user_type', 'user_id', 'resource_class', 'record_key'], TableName::namedIndex('record_switcher_entries', 'record_switcher_entry_unique'));
        });
    }

    public function down(): void
    {
        Schema::dropIfExists(TableName::resolve('record_switcher_entries'));
    }
};
