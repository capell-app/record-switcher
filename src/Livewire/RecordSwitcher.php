<?php

declare(strict_types=1);

namespace Capell\RecordSwitcher\Livewire;

use Capell\RecordSwitcher\Actions\BuildRecordSwitcherOptionsAction;
use Filament\Resources\Resource;
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
        return view('capell-record-switcher::components.record-switcher', [
            'label' => $this->label,
            'hasAlternatives' => BuildRecordSwitcherOptionsAction::run($this->resourceClass, $this->recordKey, limitResults: 1) !== [],
            'limit_results' => $this->limitResults,
            'value' => $this->recordKey,
        ]);
    }

    /**
     * @return list<array{value: string, label: string, group?: string, site: ?string, ancestors: list<string>, path: ?string, recordKey: string}>
     */
    #[Renderless]
    public function getOptions(?string $search = null): array
    {
        return BuildRecordSwitcherOptionsAction::run(
            resourceClass: $this->resourceClass,
            recordKey: $this->recordKey,
            limitResults: $this->limitResults,
            search: $search,
        );
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
