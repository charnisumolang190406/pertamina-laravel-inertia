<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!Auth::check()) {
            return redirect('/login');
        }

        $user = Auth::user();
        
        // If roles are specified in the route middleware (e.g. checkrole:Admin HC,Admin ICT)
        if (!empty($roles)) {
            // Because our user role is stored in 'role' column (or via relation)
            if (!in_array($user->role, $roles)) {
                abort(403, 'Unauthorized access.');
            }
        }

        return $next($request);
    }
}
