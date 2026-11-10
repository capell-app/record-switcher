# Record Switcher reference

<!-- prettier-ignore-start -->

Developer reference for `capell-app/record-switcher`. Start with the [README](../README.md) for what the extension does and how to install it.

## Package Details

Record Switcher is an **Available**, **No schema impact** Capell package in the **Capell Essentials** product group. It ships as `capell-app/record-switcher` and extends these surfaces: admin.

- Status: Available
- Tier: free
- Bundle: foundation
- Composer package: `capell-app/record-switcher`
- Namespace: `Capell\RecordSwitcher`
- Theme key: not applicable

## Technical Shape

### Service providers

- `Capell\RecordSwitcher\Providers\RecordSwitcherServiceProvider`

### Filament classes

- `RecordSwitcherHeadingExtender`

### Livewire components

- `RecordSwitcher`

### Actions

- `BuildRecordSwitcherOptionsAction`
- `PrepareRecordSwitcherScreenshotAction`

### Data objects

- `RecordSwitcherOptionData`

### Manifest contributions

- `asset: Capell\RecordSwitcher\Manifest\RecordSwitcherAssetsContribution`
- `health-check: Capell\RecordSwitcher\Manifest\RecordSwitcherHealthContribution`

### Health checks

- `Capell\RecordSwitcher\Health\RecordSwitcherHealthCheck`

### Blade views

- `packages/record-switcher/resources/views/components/record-switcher.blade.php`


## Data Model

This package has no schema impact. It extends Capell through `asset` contributions and `health-check` contributions instead of declaring package-owned tables.

<!-- prettier-ignore-end -->
