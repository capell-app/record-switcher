<?php

declare(strict_types=1);

use Capell\Core\Data\Diagnostics\DoctorCheckResultData;
use Capell\RecordSwitcher\Health\RecordSwitcherHealthCheck;

test('record switcher asset is generated from committed package source', function (): void {
    $packageRoot = dirname(__DIR__, 2);
    $packageManifest = json_decode(
        (string) file_get_contents($packageRoot . '/package.json'),
        true,
        flags: JSON_THROW_ON_ERROR,
    );
    throw_unless(is_array($packageManifest), RuntimeException::class, 'Record Switcher package manifest must decode to an array.');
    $source = file_get_contents($packageRoot . '/resources/js/record-switcher.js');
    $distribution = file_get_contents($packageRoot . '/resources/dist/record-switcher.js');
    $dependencies = is_array($packageManifest['dependencies'] ?? null) ? $packageManifest['dependencies'] : [];

    expect($packageManifest)->toBeArray()
        ->and($dependencies['choices.js'] ?? null)->toBe('11.2.3')
        ->and(data_get($packageManifest, 'scripts.build:check'))->toBe('node build.mjs --check')
        ->and($source)->toBeString()
        ->toContain("import Choices from 'choices.js'")
        ->toContain('this.$wire.on(')
        ->toContain('this.select.dropdown.element.querySelector(')
        ->not->toContain('this.select.dropdown.getChild(')
        ->and($distribution)->toBeString()
        ->toStartWith('// Generated from resources/js/record-switcher.js.')
        ->toContain('record-switcher:refresh')
        ->toContain('choices.js v11.2.3');
});

it('runs registration-aware diagnostics returning doctor check results', function (): void {
    $results = RecordSwitcherHealthCheck::runDiagnostics();

    expect($results)->toHaveCount(4)
        ->and($results->every(static fn (mixed $result): bool => $result instanceof DoctorCheckResultData))->toBeTrue();
});

it('passes when the admin extender, Livewire namespace, and Filament assets are registered', function (): void {
    $check = new RecordSwitcherHealthCheck;

    expect(RecordSwitcherHealthCheck::passed())->toBeTrue()
        ->and($check->headingExtenderCheck()->passed)->toBeTrue()
        ->and($check->headingExtenderIsTagged())->toBeTrue()
        ->and($check->headingExtenderRegistrationCheck()->passed)->toBeTrue()
        ->and($check->livewireNamespaceIsRegistered())->toBeTrue()
        ->and($check->livewireNamespaceCheck()->passed)->toBeTrue()
        ->and($check->missingRegisteredAssetHandles())->toBe([])
        ->and($check->adminAssetsCheck()->passed)->toBeTrue();
});

it('reports missing asset source files', function (): void {
    $check = new RecordSwitcherHealthCheck;

    expect($check->missingAssetPaths(['resources/dist/missing-record-switcher.js' => __DIR__ . '/missing.js']))
        ->toBe(['resources/dist/missing-record-switcher.js']);
});
