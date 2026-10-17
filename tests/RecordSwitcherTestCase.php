<?php

declare(strict_types=1);

namespace Capell\RecordSwitcher\Tests;

use Capell\Core\Facades\CapellCore;
use Capell\Frontend\Actions\RegenerateSiteErrorPagesAction;
use Capell\RecordSwitcher\Providers\RecordSwitcherServiceProvider;
use Capell\Tests\Packages\PackagesTestCase;
use Illuminate\Foundation\Application;
use Override;

abstract class RecordSwitcherTestCase extends PackagesTestCase
{
    #[Override]
    protected function setUp(): void
    {
        parent::setUp();

        // Cache regeneration creates system pages on each site save. These
        // navigation fixtures own their page set, not the derived cache job.
        RegenerateSiteErrorPagesAction::mock()->shouldReceive('handle')->andReturnNull();
    }

    /**
     * @param  Application  $app
     * @return class-string[]
     */
    #[Override]
    protected function getPackageProviders(mixed $app): array
    {
        return [
            ...parent::getPackageProviders($app),
            RecordSwitcherServiceProvider::class,
        ];
    }

    /**
     * @param  Application  $app
     */
    #[Override]
    protected function getEnvironmentSetUp(mixed $app): void
    {
        parent::getEnvironmentSetUp($app);

        CapellCore::forcePackageInstalled(RecordSwitcherServiceProvider::$packageName);
    }

    #[Override]
    protected function getPackageServiceName(): string
    {
        return 'capell-record-switcher';
    }
}
