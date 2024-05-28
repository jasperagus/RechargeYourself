<?php

use App\Http\Controllers\DataController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DataController::class, 'index']);

route::resource('data', DataController::class);
Route::get('exportCSV', [DataController::class, 'exportCSV'])->name('exportCSV');
Route::get('exportExcel', [DataController::class, 'exportExcel'])->name('exportExcel');
route::get('importCSV', [DataController::class, 'importCSV']);
