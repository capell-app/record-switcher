<?php

declare(strict_types=1);

use Capell\Admin\Filament\Resources\Pages\PageResource;
use Capell\RecordSwitcher\Actions\PrepareRecordSwitcherScreenshotAction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth'])->get('/screenshot-fixtures/record-switcher/pages', static function (): RedirectResponse {
    $page = app(PrepareRecordSwitcherScreenshotAction::class)->handle();

    return redirect(PageResource::getUrl('edit', ['record' => $page]));
});
