<?php

declare(strict_types=1);

namespace Capell\RecordSwitcher\Actions;

use Capell\Admin\Support\SiteScope;
use Capell\Core\Exceptions\UrlMissingSiteDomainException;
use Capell\Core\Models\Page;
use Capell\Core\Models\PageUrl;
use Capell\RecordSwitcher\Data\RecordSwitcherOptionData;
use Filament\Resources\Resource;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Database\Eloquent\Builder as BuilderContract;
use Illuminate\Contracts\Database\Query\Expression as QueryExpressionContract;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Database\Connection;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Expression;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use LogicException;
use Lorisleiva\Actions\Concerns\AsFake;
use Lorisleiva\Actions\Concerns\AsObject;
use Symfony\Component\Routing\Exception\RouteNotFoundException;

/**
 * @method static list<array{value: string, label: string, group?: string, site: ?string, ancestors: list<string>, path: ?string, recordKey: string}> run(class-string<resource> $resourceClass, string $recordKey, int $limitResults = 10, ?string $search = null, ?string $targetKey = null)
 */
final class BuildRecordSwitcherOptionsAction
{
    use AsFake;
    use AsObject;

    /**
     * @param  class-string<resource>  $resourceClass
     * @return list<array{value: string, label: string, group?: string, site: ?string, ancestors: list<string>, path: ?string, recordKey: string}>
     */
    public function handle(
        string $resourceClass,
        string $recordKey,
        int $limitResults = 10,
        ?string $search = null,
        ?string $targetKey = null,
    ): array {
        if (auth()->guest() || ! is_subclass_of($resourceClass, Resource::class)
            || (method_exists($resourceClass, 'recordSwitcherEnabled') && ! $resourceClass::recordSwitcherEnabled())
            || ! $resourceClass::canAccess()) {
            return [];
        }

        $query = $resourceClass::getEloquentQuery();

        // Keep policy dependencies even though table-column eager loads are unnecessary.
        if ($query->getModel() instanceof Page) {
            $query->withoutEagerLoads()->with($this->pagePolicyRelations());
        }

        $current = (clone $query)->where($query->getModel()->getRouteKeyName(), $recordKey)->first();

        if (! $current instanceof Model || ! $resourceClass::canEdit($current)) {
            return [];
        }

        $query = $this->modifyQuery($query, $resourceClass, $current);

        if ($targetKey !== null) {
            $query->where($query->getModel()->qualifyColumn($query->getModel()->getRouteKeyName()), $targetKey);
        }

        $search = Str::substr(trim($search ?? ''), 0, 200);

        if ($search !== '' && ! $current instanceof Page) {
            $this->applyAttributeConstraints($query, $resourceClass, $search);
        }

        $items = [];

        // Apply the result limit after policy checks so denied records cannot hide alternatives.
        foreach ($query->lazy(100) as $model) {
            if (! $resourceClass::canEdit($model)) {
                continue;
            }

            try {
                $option = $this->item($model, $resourceClass, $current);

                if ($model instanceof Page && ! $option->matches($search)) {
                    continue;
                }

                $items[] = $option->toArray();
            } catch (RouteNotFoundException) {
                return [];
            }

            if (count($items) >= max(1, min(50, $limitResults))) {
                break;
            }
        }

        return $items;
    }

    /**
     * @param  Builder<Model>  $query
     * @param  class-string<resource>  $resourceClass
     * @return Builder<Model>
     */
    private function modifyQuery(Builder $query, string $resourceClass, Model $current): Builder
    {
        $modelClass = $resourceClass::getModel();

        if ($modelClass !== Page::class && ! is_subclass_of($modelClass, Page::class)) {
            $query->whereKeyNot($current->getKey());

            $updatedAtColumn = $query->getModel()->getUpdatedAtColumn();

            if ($query->getModel()->usesTimestamps() && is_string($updatedAtColumn)) {
                $query->orderByDesc($query->getModel()->qualifyColumn($updatedAtColumn));
            }

            return $query->orderBy($query->getModel()->getKeyName());
        }

        $hasPageHierarchy = method_exists($resourceClass, 'hasPageHierarchy')
            && (bool) $resourceClass::hasPageHierarchy();
        $ancestorScope = (clone $query)->select('pages.id');

        $query->with([
            'site:id,name,default',
            'pageUrl:id,pageable_type,pageable_id,site_id,language_id,url',
            'pageUrl.siteDomain:id,site_id,language_id,domain,path,scheme,port',
            ...($hasPageHierarchy ? ['ancestors' => fn (BuilderContract $ancestors): BuilderContract => $ancestors
                ->whereIn('pages.id', $ancestorScope)->with($this->pagePolicyRelations())] : []),
        ])
            ->whereHas(
                'type',
                fn (BuilderContract $query): BuilderContract => $query->adminResource($this->resourceName($resourceClass)),
            )
            ->whereKeyNot($current->getKey());

        $this->applyPagePriorityOrdering($query->reorder(), $current instanceof Page ? $current : null);

        return $query->orderBy('pages.name')->orderBy('pages.id');
    }

    /**
     * @param  Builder<Model>  $query
     * @return Builder<Model>
     */
    private function applyPagePriorityOrdering(Builder $query, ?Page $currentPage): Builder
    {
        if (! $currentPage instanceof Page) {
            return $query;
        }

        if ($currentPage->parent_id === null) {
            return $query->orderByRaw(
                'case when pages.parent_id is null and pages.site_id = ? then 0 when pages.site_id = ? then 1 else 2 end',
                [$currentPage->site_id, $currentPage->site_id],
            );
        }

        return $query->orderByRaw(
            'case when pages.parent_id = ? and pages.site_id = ? then 0 when pages.site_id = ? then 1 else 2 end',
            [$currentPage->parent_id, $currentPage->site_id, $currentPage->site_id],
        );
    }

    /** @param class-string<resource> $resourceClass */
    private function resourceName(string $resourceClass): string
    {
        $resourceName = [$resourceClass, 'getResourceName'];

        if (! is_callable($resourceName)) {
            return class_basename($resourceClass);
        }

        return (string) $resourceName();
    }

    /**
     * @param  Builder<Model>  $query
     * @param  class-string<resource>  $resourceClass
     */
    private function applyAttributeConstraints(Builder $query, string $resourceClass, string $search): void
    {
        $search = Str::lower($search);

        foreach (explode(' ', $search) as $searchWord) {
            $query->where(function (Builder $query) use ($resourceClass, $searchWord): void {
                $isFirst = true;

                foreach ($this->searchColumns($resourceClass) as $attributes) {
                    $this->applyAttributeConstraint($query, $searchWord, Arr::wrap($attributes), $isFirst);
                }
            });
        }
    }

    /**
     * @param  Builder<Model>  $query
     * @param  array<int, string>  $searchAttributes
     */
    private function applyAttributeConstraint(
        Builder $query,
        string $search,
        array $searchAttributes,
        bool &$isFirst,
    ): void {
        /** @var Connection $databaseConnection */
        $databaseConnection = $query->getConnection();

        foreach ($searchAttributes as $searchAttribute) {
            $whereClause = $isFirst ? 'where' : 'orWhere';
            $whereHasClause = $isFirst ? 'whereHas' : 'orWhereHas';

            $query->when(
                str($searchAttribute)->contains('.') && ! str($searchAttribute)->contains('`'),
                fn (Builder $query): Builder => $query->{$whereHasClause}(
                    (string) str($searchAttribute)->beforeLast('.'),
                    fn (Builder $query): Builder => $query->where(
                        $this->searchColumnExpression($query, (string) str($searchAttribute)->afterLast('.'), $databaseConnection),
                        'like',
                        sprintf('%%%s%%', $search),
                    ),
                ),
                fn (Builder $query): Builder => $query->{$whereClause}(
                    $this->searchColumnExpression($query, $searchAttribute, $databaseConnection),
                    'like',
                    sprintf('%%%s%%', $search),
                ),
            );

            $isFirst = false;
        }
    }

    /**
     * @param  class-string<resource>  $resourceClass
     * @return array<int, string|array<int, string>>
     */
    private function searchColumns(string $resourceClass): array
    {
        return $resourceClass::getGloballySearchableAttributes();
    }

    /** @param Builder<Model> $query */
    private function searchColumnExpression(Builder $query, string $column, Connection $databaseConnection): QueryExpressionContract
    {
        $qualifiedColumn = str_contains($column, '`')
            ? $column
            : $databaseConnection->getQueryGrammar()->wrap($query->qualifyColumn($column));

        $columnExpression = sprintf('lower(%s)', $qualifiedColumn);
        $collation = $databaseConnection->getConfig('search_collation');

        if (is_string($collation) && $collation !== '') {
            $columnExpression = sprintf('%s collate %s', $columnExpression, $collation);
        }

        /** @var literal-string $columnExpression */
        return new Expression($columnExpression);
    }

    /**
     * @param  class-string<resource>  $resourceClass
     */
    private function item(Model $model, string $resourceClass, Model $current): RecordSwitcherOptionData
    {
        $isPage = $model instanceof Page;
        $sameSite = $isPage && $current instanceof Page && $model->site_id === $current->site_id;
        $related = $sameSite && $model->parent_id === $current->parent_id;

        $group = $isPage ? match (true) {
            $related => __('capell-record-switcher::switcher.related'),
            $sameSite => __('capell-record-switcher::switcher.this_site'),
            default => __('capell-record-switcher::switcher.other_sites'),
        } : null;
        throw_unless($group === null || is_string($group), LogicException::class, 'Record switcher group translations must be strings.');

        $routeKey = $model->getRouteKey();
        throw_unless(is_string($routeKey) || is_int($routeKey), LogicException::class, 'Record switcher requires a scalar route key.');
        $title = $resourceClass::getRecordTitle($model);

        return new RecordSwitcherOptionData(
            value: $resourceClass::getUrl('edit', ['record' => $model]),
            label: $isPage ? $model->name : strip_tags($title instanceof Htmlable ? $title->toHtml() : ($title ?? '')),
            group: $group,
            site: $isPage ? $model->site?->name : null,
            ancestors: $isPage && $model->relationLoaded('ancestors')
                ? array_values($model->ancestors->filter(fn (Page $ancestor): bool => $resourceClass::canEdit($ancestor))->map(fn (Page $ancestor): string => $ancestor->name)->all())
                : [],
            path: $isPage ? $this->pageUrl($model) : null,
            recordKey: (string) $routeKey,
        );
    }

    private function pageUrl(Page $model): string
    {
        $pageUrl = $model->getRelation('pageUrl');

        if (! $pageUrl instanceof PageUrl || ! $pageUrl->exists) {
            return '';
        }

        $pageUrl->loadMissing('siteDomain');

        try {
            return $pageUrl->fullUrl();
        } catch (UrlMissingSiteDomainException) {
            return '';
        }
    }

    /** @return list<string> */
    private function pagePolicyRelations(): array
    {
        $actor = auth()->user();

        // Global admins bypass Page restrictions; other actors need hydrated policy context.
        return $actor instanceof Authenticatable && ! SiteScope::isGlobalActor($actor)
            ? ['blueprint.roleRestrictions', 'site']
            : [];
    }
}
