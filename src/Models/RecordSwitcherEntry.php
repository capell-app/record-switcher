<?php

declare(strict_types=1);

namespace Capell\RecordSwitcher\Models;

use Capell\Core\Concerns\HasCapellTable;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Override;

/**
 * One user's recently opened or pinned record for a resource.
 *
 * @property int $id
 * @property string $user_type
 * @property int $user_id
 * @property string $resource_class
 * @property string $record_key
 * @property CarbonImmutable|null $pinned_at
 * @property CarbonImmutable|null $visited_at
 */
class RecordSwitcherEntry extends Model
{
    use HasCapellTable;

    /** @var list<string> */
    protected $fillable = [
        'user_type',
        'user_id',
        'resource_class',
        'record_key',
        'pinned_at',
        'visited_at',
    ];

    /**
     * @return MorphTo<Model, $this>
     */
    public function user(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * @return array<string, string>
     */
    #[Override]
    protected function casts(): array
    {
        return [
            'pinned_at' => 'immutable_datetime',
            'visited_at' => 'immutable_datetime',
        ];
    }
}
