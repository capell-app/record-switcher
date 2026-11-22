<?php

declare(strict_types=1);

namespace Capell\RecordSwitcher\Livewire;

use Capell\RecordSwitcher\Actions\BuildRecordSwitcherOptionsAction;
use Capell\RecordSwitcher\Actions\RecordRecordSwitcherVisitAction;
use Capell\RecordSwitcher\Actions\ToggleRecordSwitcherPinAction;
use Capell\RecordSwitcher\Models\RecordSwitcherEntry;
use Filament\Resources\Resource;
use Illuminate\Database\Eloquent\Model;
use Illuminate\View\View;
use Livewire\Attributes\Locked;
use Livewire\Attributes\On;
use Livewire\Attributes\Renderless;
use Livewire\Component;

final class RecordSwitcher extends Component
{
    /** @var class-string */
    #[Locked]
    public string $pageClass;

    /** @var class-string<resource> */
    #[Locked]
    public string $resourceClass;

    #[Locked]
    public string $recordKey;

    public string $label;

    #[Locked]
    public int $limitResults = 10;

    public function render(): View
    {
        $user = auth()->user();

        if ($user !== null) {
            RecordRecordSwitcherVisitAction::run($this->resourceClass, $this->recordKey, $user);
        }

        return view('capell-record-switcher::components.record-switcher', [
            'label' => $this->label,
            'hasAlternatives' => BuildRecordSwitcherOptionsAction::run($this->resourceClass, $this->recordKey, limitResults: 1) !== [],
            'limit_results' => $this->limitResults,
            'value' => $this->recordKey,
        ]);
    }

    /**
     * @return list<array{value: string, label: string, group?: string, site: ?string, ancestors: list<string>, path: ?string, recordKey: string, pinned: bool}>
     */
    #[Renderless]
    public function getOptions(?string $search = null): array
    {
        $options = BuildRecordSwitcherOptionsAction::run(
            resourceClass: $this->resourceClass,
            recordKey: $this->recordKey,
            limitResults: $this->limitResults,
            search: $search,
        );
        $user = auth()->user();

        if ($options === [] || ! $user instanceof Model) {
            return array_map(static fn (array $option): array => [...$option, 'pinned' => false], $options);
        }

        $pinned = RecordSwitcherEntry::query()
            ->where(['user_type' => $user->getMorphClass(), 'user_id' => $user->getKey(), 'resource_class' => $this->resourceClass])
            ->whereNotNull('pinned_at')
            ->get()
            ->map(static fn (RecordSwitcherEntry $entry): string => $entry->record_key)
            ->all();

        return array_map(static fn (array $option): array => [...$option, 'pinned' => in_array($option['recordKey'], $pinned, true)], $options);
    }

    /**
     * Pins or unpins a record in the switcher for the current user. Returns whether it is now pinned.
     */
    #[Renderless]
    public function togglePin(string $recordKey): bool
    {
        $user = auth()->user();

        // Only a record this user could switch to may be pinned.
        if ($user === null || BuildRecordSwitcherOptionsAction::run($this->resourceClass, $this->recordKey, limitResults: 1, targetKey: $recordKey) === []) {
            return false;
        }

        return ToggleRecordSwitcherPinAction::run($this->resourceClass, $recordKey, $user);
    }

    #[On('record-switcher:refresh')]
    public function refreshLabel(string $label): void
    {
        $this->label = strip_tags($label);
    }

    #[Renderless]
    public function getEditUrl(string $recordKey): ?string
    {
        $options = BuildRecordSwitcherOptionsAction::run(
            resourceClass: $this->resourceClass,
            recordKey: $this->recordKey,
            limitResults: 1,
            targetKey: $recordKey,
        );

        return $options[0]['value'] ?? null;
    }
}
