# Changelog

All notable changes to `capell-app/record-switcher` will be documented in this file.

## Unreleased

- Added pinned and recent records: the switcher lists a user's pinned records, then their last ten opened, before the normal results when the search is empty. Entries live in the new `record_switcher_entries` table and are re-checked against the edit policy on every load. Each suggestion in the menu has a pin button (and Alt+P for the highlighted one) that calls `RecordSwitcher::togglePin()` and shows the pinned state; options returned by `getOptions()` now carry a `pinned` flag.
