<?php

declare(strict_types=1);

namespace Capell\RecordSwitcher\Data;

use Illuminate\Support\Str;

final readonly class RecordSwitcherOptionData
{
    /** @param list<string> $ancestors */
    public function __construct(
        public string $value,
        public string $label,
        public ?string $group = null,
        public ?string $site = null,
        public array $ancestors = [],
        public ?string $path = null,
        public string $recordKey = '',
    ) {}

    public function matches(string $search): bool
    {
        $context = Str::lower(implode(' ', [$this->label, ...$this->ancestors, $this->path ?? '']));

        return array_all(explode(' ', Str::lower(trim($search))), fn (string $word): bool => str_contains($context, $word));
    }

    /**
     * @return array{value: string, label: string, group?: string, site: ?string, ancestors: list<string>, path: ?string, recordKey: string}
     */
    public function toArray(): array
    {
        $option = [
            'value' => $this->value,
            'recordKey' => $this->recordKey,
            'label' => $this->label,
            'site' => $this->site,
            'ancestors' => $this->ancestors,
            'path' => $this->path,
        ];

        if ($this->group !== null && $this->group !== '') {
            $option['group'] = $this->group;
        }

        return $option;
    }
}
