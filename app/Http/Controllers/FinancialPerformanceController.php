<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\FinancialPerformance;

class FinancialPerformanceController extends Controller
{
    public function index()
    {
        $financials = FinancialPerformance::orderBy('year', 'asc')->get();
        return Inertia::render('Pilar/FinancialPerformance', [
            'financials' => $financials
        ]);
    }
}
