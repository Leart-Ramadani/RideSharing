<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\Passenger;
use App\Models\Payment;
use App\Models\Ride;
use App\Models\RideRequest;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Basic counts
        $stats = [
            'total_users'       => User::count(),
            'total_drivers'     => Driver::count(),
            'total_passengers'  => Passenger::count(),
            'total_rides'       => Ride::count(),
            'pending_requests'  => RideRequest::where('status', 'Pending')->count(),
            'completed_rides'   => Ride::where('status', 'Completed')->count(),
            'total_revenue'     => Payment::where('status', 'Completed')->sum('amount'),
            'active_drivers'    => Driver::where('status', 'Active')->count(),
            'online_drivers'    => Driver::where('is_online', true)->count(),
        ];

        // Rides per day for the last 7 days (for the bar chart)
        $ridesPerDay = Ride::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($row) => ['date' => $row->date, 'rides' => (int) $row->count]);

        // Revenue per day for the last 7 days
        $revenuePerDay = Payment::select(
                DB::raw('DATE(paid_at) as date'),
                DB::raw('SUM(amount) as total')
            )
            ->where('status', 'Completed')
            ->where('paid_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($row) => ['date' => $row->date, 'revenue' => round($row->total, 2)]);

        // Ride status distribution (for the pie chart)
        $ridesByStatus = Ride::select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(fn($row) => ['status' => $row->status, 'count' => (int) $row->count]);

        return response()->json([
            ...$stats,
            'rides_per_day'    => $ridesPerDay,
            'revenue_per_day'  => $revenuePerDay,
            'rides_by_status'  => $ridesByStatus,
        ]);
    }
}
