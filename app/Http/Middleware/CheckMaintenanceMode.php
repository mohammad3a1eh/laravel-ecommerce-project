<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;

class CheckMaintenanceMode
{
    public function handle(Request $request, Closure $next)
    {
        $isDown = File::exists(storage_path('framework/maintenance.flag'));

        $except = [
            'login',
            'register',
            'logout',
            'dashboard/maintenance',
            'dashboard/maintenance/toggle',
        ];

        if ($isDown
            && (!Auth::check() || !Auth::user()->hasRole('dev'))
            && !in_array($request->path(), $except)
        ) {
            return response()->view('dev.maintenance', ['isDown' => true]);
        }

        return $next($request);
    }
}
