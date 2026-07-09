<?php

declare(strict_types=1);

namespace Capell\RecordSwitcher\Data;

final readonly class RecordSwitcherOptionData
{
    public function __construct(
        public string $value,
        public string $label,
        public ?string $group = null,
    ) {}

    /**
     * @return array{value: string, label: string, group?: string}
     */
    public function toArray(): array
    {
        $option = [
            'value' => $this->value,
            'label' => $this->label,
        ];

        if ($this->group !== null && $this->group !== '') {
            $option['group'] = $this->group;
        }

        return $option;
    }
}
