<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PromoCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PromoCodeController extends Controller
{
    public function index()
    {
        return response()->json(PromoCode::latest()->get());
    }

    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'code'             => 'required|string|unique:promo_codes,code',
            'discount_percent' => 'required|numeric|min:0|max:100',
            'max_value'        => 'nullable|numeric|min:0',
            'start_date'       => 'required|date',
            'expiry_date'      => 'required|date|after:start_date',
            'max_uses'         => 'required|integer|min:1',
            'status'           => 'nullable|in:Active,Inactive',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $promo = PromoCode::create($v->validated());
        return response()->json($promo, 201);
    }

    public function show(PromoCode $promoCode)
    {
        return response()->json($promoCode);
    }

    public function update(Request $request, PromoCode $promoCode)
    {
        $v = Validator::make($request->all(), [
            'code'             => 'sometimes|string|unique:promo_codes,code,' . $promoCode->id,
            'discount_percent' => 'sometimes|numeric|min:0|max:100',
            'max_value'        => 'nullable|numeric|min:0',
            'start_date'       => 'sometimes|date',
            'expiry_date'      => 'sometimes|date',
            'max_uses'         => 'sometimes|integer|min:1',
            'status'           => 'nullable|in:Active,Inactive',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $promoCode->update($v->validated());
        return response()->json($promoCode);
    }

    public function destroy(PromoCode $promoCode)
    {
        $promoCode->delete();
        return response()->json(['message' => 'Promo code deleted.']);
    }
}
