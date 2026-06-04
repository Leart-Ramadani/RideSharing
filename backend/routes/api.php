<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\ProfileController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserRoleController;
use App\Http\Controllers\Admin\DriverController;
use App\Http\Controllers\Admin\VehicleController;
use App\Http\Controllers\Admin\PassengerController;
use App\Http\Controllers\Admin\RideController;
use App\Http\Controllers\Admin\RideRequestController;
use App\Http\Controllers\Admin\FareController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\RatingController;
use App\Http\Controllers\Admin\PromoCodeController;
use App\Http\Controllers\Admin\DriverPayoutController;
use App\Http\Controllers\Driver\RideController as DriverRideController;
use App\Http\Controllers\Driver\ProfileController as DriverProfileController;
use App\Http\Controllers\Driver\AvailabilityController;
use App\Http\Controllers\Driver\RideRequestController as DriverRideRequestController;
use App\Http\Controllers\Passenger\RideController as PassengerRideController;
use App\Http\Controllers\Passenger\RideRequestController as PassengerRideRequestController;
use App\Http\Controllers\Passenger\WalletController;
use App\Http\Controllers\Passenger\RatingController as PassengerRatingController;
use App\Http\Controllers\Passenger\FareEstimateController;
use Illuminate\Support\Facades\Route;

// ─── Public auth routes ─────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('refresh', [AuthController::class, 'refresh']);
});

// ─── Protected routes (require valid JWT) ──────────────────────────────────
Route::middleware('auth:api')->group(function () {

    // Auth / Profile (shared by all roles)
    Route::post('auth/logout', [AuthController::class,  'logout']);
    Route::get('auth/me', [AuthController::class,  'me']);
    Route::patch('auth/profile', [ProfileController::class, 'update']);
    Route::patch('auth/change-password', [ProfileController::class, 'changePassword']);

    // ─── Admin routes ────────────────────────────────────────────────────────
    Route::middleware('role:ADMIN')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index']);

        Route::apiResource('users', UserController::class);
        Route::patch('users/{user}/toggle-status', [UserController::class, 'toggleStatus']);

        Route::get('roles', [RoleController::class, 'index']);
        Route::get('roles/{role}',[RoleController::class, 'show']);

        Route::apiResource('user-roles', UserRoleController::class)->except(['show', 'update']);

        Route::apiResource('drivers', DriverController::class);
        Route::apiResource('vehicles', VehicleController::class);

        Route::get('passengers', [PassengerController::class, 'index']);
        Route::get('passengers/{passenger}', [PassengerController::class, 'show']);

        Route::get('rides', [RideController::class, 'index']);
        Route::get('rides/{ride}', [RideController::class, 'show']);
        Route::get('ride-requests', [RideRequestController::class, 'index']);
        Route::get('ride-requests/{rideRequest}', [RideRequestController::class, 'show']);

        Route::apiResource('fares', FareController::class);
        Route::apiResource('payments', PaymentController::class);
        Route::apiResource('ratings', RatingController::class);
        Route::apiResource('promo-codes', PromoCodeController::class);
        Route::apiResource('driver-payouts', DriverPayoutController::class);
    });

    // ─── Driver routes ────────────────────────────────────────────────────────
    Route::middleware('role:DRIVER')->prefix('driver')->group(function () {
        Route::get('me', [DriverProfileController::class, 'me']);
        Route::patch('availability', [AvailabilityController::class,  'toggle']);

        // Pending ride requests the driver can accept
        Route::get('ride-requests', [DriverRideRequestController::class, 'index']);
        Route::post('ride-requests/{rideRequest}/accept', [DriverRideRequestController::class, 'accept']);
        Route::post('ride-requests/{rideRequest}/reject', [DriverRideRequestController::class, 'reject']);

        // Rides assigned to this driver
        Route::get('rides', [DriverRideController::class, 'index']);
        Route::get('rides/{ride}', [DriverRideController::class, 'show']);
        Route::patch('rides/{ride}/status', [DriverRideController::class, 'updateStatus']);
    });

    // ─── Passenger routes ──────────────────────────────────────────────────────
    Route::middleware('role:PASSENGER')->prefix('passenger')->group(function () {
        // Ride management
        Route::get('rides', [PassengerRideController::class, 'index']);
        Route::get('rides/{ride}', [PassengerRideController::class, 'show']);

        // Ride requests
        Route::get('ride-requests', [PassengerRideRequestController::class, 'index']);
        Route::post('ride-requests', [PassengerRideRequestController::class, 'store']);
        Route::get('ride-requests/{rideRequest}', [PassengerRideRequestController::class, 'show']);
        Route::patch('ride-requests/{rideRequest}/cancel', [PassengerRideRequestController::class, 'cancel']);

        // Wallet
        Route::get('wallet', [WalletController::class, 'show']);
        Route::post('wallet/top-up', [WalletController::class, 'topUp']);

        // Ratings (submit rating after completed ride)
        Route::post('rides/{ride}/rate', [PassengerRatingController::class, 'store']);
        Route::get('rides/{ride}/rating', [PassengerRatingController::class, 'show']);

        // Fare estimation (call with ?distance_km=X before booking)
        Route::get('fare-estimate', [FareEstimateController::class, 'estimate']);
    });
});
