<?php

declare(strict_types=1);

namespace Capell\RecordSwitcher\Tests\Fixtures;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Override;

final class RecordSwitcherScopedResource extends RecordSwitcherTestRecordResource
{
    /** @return Builder<Model> */
    #[Override]
    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('code', '!=', 'outside-tenant');
    }

    #[Override]
    public static function canEdit(Model $record): bool
    {
        return $record->getAttribute('code') !== 'denied';
    }
}
