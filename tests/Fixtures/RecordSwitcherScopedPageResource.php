<?php

declare(strict_types=1);

namespace Capell\RecordSwitcher\Tests\Fixtures;

use Capell\Admin\Filament\Resources\Pages\PageResource;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Override;

final class RecordSwitcherScopedPageResource extends PageResource
{
    /** @return Builder<Model> */
    #[Override]
    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->whereHas('site', fn (Builder $query): Builder => $query->where('name', '!=', 'Hidden site'));
    }

    #[Override]
    public static function canEdit(Model $record): bool
    {
        return $record->getAttribute('name') !== 'Secret';
    }

    /** @param array<string, mixed> $parameters */
    #[Override]
    public static function getUrl(?string $name = null, array $parameters = [], bool $isAbsolute = true, ?string $panel = null, ?Model $tenant = null, bool $shouldGuessMissingParameters = false, ?string $configuration = null): string
    {
        return PageResource::getUrl($name, $parameters, $isAbsolute, $panel, $tenant, $shouldGuessMissingParameters, $configuration);
    }
}
