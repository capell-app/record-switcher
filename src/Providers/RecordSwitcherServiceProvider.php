<?php

declare(strict_types=1);

namespace Capell\RecordSwitcher\Providers;

use Capell\Admin\Contracts\Extenders\EditRecordHeadingExtender;
use Capell\Core\Support\Packages\AbstractPackageServiceProvider;
use Capell\RecordSwitcher\Filament\RecordSwitcherHeadingExtender;
use Filament\Support\Assets\AlpineComponent;
use Filament\Support\Assets\Css;
use Filament\Support\Facades\FilamentAsset;
use Livewire\Livewire;
use Override;
use Spatie\LaravelPackageTools\Package;

final class RecordSwitcherServiceProvider extends AbstractPackageServiceProvider
{
    public static string $name = 'capell-record-switcher';

    public static string $packageName = 'capell-app/record-switcher';

    #[Override]
    public function configurePackage(Package $package): void
    {
        $package
            ->name(self::$name)
            ->hasViews()
            ->hasTranslations();
    }

    #[Override]
    public function packageBooted(): void
    {
        Livewire::addNamespace('capell-record-switcher', classNamespace: 'Capell\\RecordSwitcher\\Livewire');

        FilamentAsset::register([
            Css::make('record-switcher', __DIR__ . '/../../resources/css/components/record-switcher.css'),
            AlpineComponent::make('record-switcher', __DIR__ . '/../../resources/dist/record-switcher.js'),
        ], package: self::$name);
    }

    #[Override]
    protected function bootInstalledRuntime(): void
    {
        $this->app->tag([RecordSwitcherHeadingExtender::class], EditRecordHeadingExtender::TAG);
    }
}
