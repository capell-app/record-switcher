<?php

declare(strict_types=1);

namespace Capell\RecordSwitcher\Livewire;

use Capell\RecordSwitcher\Actions\BuildRecordSwitcherOptionsAction;
use Filament\Resources\Resource;
use Illuminate\View\View;
use Livewire\Attributes\Renderless;
use Livewire\Component;

final class RecordSwitcher extends Component
{
    /** @var class-string */
    public string $pageClass;

    /** @var class-string<resource> */
    public string $resourceClass;

    public string $recordKey;

    public string $label;

    public int $limitResults = 10;

    public function render(): View
    {
        return view('capell-record-switcher::components.record-switcher', [
            'label' => $this->label,
            'limit_results' => $this->limitResults,
            'value' => $this->recordKey,
        ]);
    }

    /**
     * @return list<array{value: string, label: string, group?: string}>
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
}
