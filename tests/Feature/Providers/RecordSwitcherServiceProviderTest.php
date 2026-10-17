<?php

declare(strict_types=1);

use Capell\Admin\Filament\Resources\Pages\Pages\EditPage;
use Capell\Admin\Support\Schemas\AdminSchemaExtensionPipeline;
use Capell\Core\Models\Page;
use Capell\Tests\Support\InstalledRuntimeParity;
use Capell\Tests\Support\InstalledRuntimeState;
use Capell\Tests\Support\InstalledRuntimeTestCase;

it('keeps the default heading when the package is not installed', function (): void {
    $record = Page::factory()->withTranslations()->create();

    InstalledRuntimeState::run(static function () use ($record): void {
        $app = InstalledRuntimeTestCase::boot(InstalledRuntimeParity::manifest('record-switcher'), false);
        $page = new EditPage;
        $page->record = $record;
        $heading = $app->make(AdminSchemaExtensionPipeline::class)->editRecordHeading($page, 'Original page title');

        expect($heading)->toBe('Original page title');
    });
});
