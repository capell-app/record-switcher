<?php

declare(strict_types=1);

namespace Capell\RecordSwitcher\Tests\Fixtures;

use Illuminate\Database\Eloquent\Model;
use Override;
use Symfony\Component\Routing\Exception\RouteNotFoundException;

final class RecordSwitcherUnavailableResource extends RecordSwitcherTestRecordResource
{
    /** @param array<string, mixed> $parameters */
    #[Override]
    public static function getUrl(?string $name = null, array $parameters = [], bool $isAbsolute = true, ?string $panel = null, ?Model $tenant = null, bool $shouldGuessMissingParameters = false, ?string $configuration = null): string
    {
        throw new RouteNotFoundException('Edit route is unavailable.');
    }
}
