<?php

declare(strict_types=1);

namespace Capell\RecordSwitcher\Tests\Fixtures;

use Override;

final class RecordSwitcherEmptySearchResource extends RecordSwitcherTestRecordResource
{
    /**
     * @return array<int, string>
     */
    #[Override]
    public static function getGloballySearchableAttributes(): array
    {
        return [];
    }
}
