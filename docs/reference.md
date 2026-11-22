# Record Switcher reference

<!-- prettier-ignore-start -->

Developer reference for `capell-app/record-switcher`. Start with the [README](../README.md) for what the extension does and how to install it.

## Package Details

Record Switcher is an **Available** Capell package in the **Capell Essentials** product group. It ships as `capell-app/record-switcher` and extends these surfaces: admin.

- Status: Available
- Tier: free
- Bundle: foundation
- Composer package: `capell-app/record-switcher`
- Namespace: `Capell\RecordSwitcher`
- Theme key: not applicable

## Technical Shape

### Service providers

- `Capell\RecordSwitcher\Providers\MigrationMetadataServiceProvider`
- `Capell\RecordSwitcher\Providers\RecordSwitcherServiceProvider`

### Migrations

- `packages/record-switcher/database/migrations/2026_11_20_000001_create_record_switcher_entries_table.php`

### Models

- `RecordSwitcherEntry`

### Filament classes

- `RecordSwitcherHeadingExtender`

### Livewire components

- `RecordSwitcher`

### Actions

- `BuildRecordSwitcherOptionsAction`
- `PrepareRecordSwitcherScreenshotAction`
- `RecordRecordSwitcherVisitAction`
- `ToggleRecordSwitcherPinAction`

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

- Required tables: `record_switcher_entries`.
- Models: `RecordSwitcherEntry`.
- Core record references in migrations: `users via user_id`.
- Migration files: `2026_11_20_000001_create_record_switcher_entries_table.php`.
- Migration impact: run host migrations through the package install flow before opening package surfaces.
- Deletion/retention behaviour: Docs gap: migrations and manifest contributions do not prove a cascade, pruning command, or timed retention policy.

<!-- prettier-ignore-end -->
