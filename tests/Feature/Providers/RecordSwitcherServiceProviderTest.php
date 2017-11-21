<?php

declare(strict_types=1);

use Capell\Admin\Contracts\Extenders\EditRecordHeadingExtender;
use Capell\Core\Facades\CapellCore;
use Capell\RecordSwitcher\Filament\RecordSwitcherHeadingExtender;
use Capell\RecordSwitcher\Providers\RecordSwitcherServiceProvider;

it('does not tag the heading extender when the package is not installed', function (): void {
    $tagsProperty = new ReflectionProperty(app(), 'tags');
    $originalTags = $tagsProperty->getValue(app());
    throw_unless(is_array($originalTags), RuntimeException::class, 'Expected the application container tags to be an array.');

    $tags = $originalTags;
    $tags[EditRecordHeadingExtender::TAG] = array_values(array_filter(
        (array) ($tags[EditRecordHeadingExtender::TAG] ?? []),
        static fn (mixed $abstract): bool => $abstract !== RecordSwitcherHeadingExtender::class,
    ));

    $tagsProperty->setValue(app(), $tags);
    CapellCore::forcePackageInstalled(RecordSwitcherServiceProvider::$packageName, false);

    try {
        $provider = app()->getProvider(RecordSwitcherServiceProvider::class);
        throw_unless($provider instanceof RecordSwitcherServiceProvider, RuntimeException::class, 'Expected the Record Switcher service provider to be loaded.');

        $provider->packageBooted();

        $hasHeadingExtender = false;

        foreach (app()->tagged(EditRecordHeadingExtender::TAG) as $extender) {
            if ($extender instanceof RecordSwitcherHeadingExtender) {
                $hasHeadingExtender = true;
                break;
            }
        }

        expect($hasHeadingExtender)->toBeFalse();
    } finally {
        $tagsProperty->setValue(app(), $originalTags);
        CapellCore::forcePackageInstalled(RecordSwitcherServiceProvider::$packageName);
    }
});
