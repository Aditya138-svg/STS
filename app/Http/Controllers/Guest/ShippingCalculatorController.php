<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

use Illuminate\Http\Request;

class ShippingCalculatorController extends Controller
{
    /**
     * Display the shipping calculator page.
     */
    public function index(): Response
    {
        $serviceLevels = \App\Models\ServiceLevels::activeServiceLevels();

        return Inertia::render('Guest/ShippingCalculator', [
            'title' => 'Shipping Calculator',
            'serviceLevels' => $serviceLevels
        ]);
    }

    /**
     * Handle the calculation request.
     */
    public function calculate(Request $request)
    {
        $validated = $request->validate([
            'calc_by' => 'required|string',
            'weight' => 'nullable|numeric',
            'length' => 'nullable|numeric',
            'width' => 'nullable|numeric',
            'height' => 'nullable|numeric',
            'qty' => 'nullable|integer',
            'origin_zip' => 'required|string',
            'dest_zip' => 'required|string',
            'service_levels_id' => 'required'
        ]);

        try {
            $originZip = $validated['origin_zip'];
            $destZip = $validated['dest_zip'];

            // Check if zips are in service
            $originService = \App\Models\Zipcodes::where('zipcode', $originZip)->first();
            $destService = \App\Models\Zipcodes::where('zipcode', $destZip)->first();

            if (!$originService || !$destService) {
                return response()->json([
                    'success' => false,
                    'message' => 'One or both zip codes are outside our standard service area. Please request a formal quote for detailed pricing.'
                ]);
            }

            // Calculation logic
            $cubes = 0;
            if ($validated['calc_by'] === 'size') {
                $cubes = (($validated['length'] * $validated['width'] * $validated['height']) / 1728) * ($validated['qty'] ?: 1);
            } else {
                // Approximate cubes from weight (standard 7 lbs per cube)
                $cubes = ($validated['weight'] ?: 0) / 7;
            }

            // Get pricing model (default)
            $pricing = \App\Models\Pricing::where('active', 1)->where('is_standard', 1)->first() 
                       ?? \App\Models\Pricing::where('active', 1)->first();

            if (!$pricing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pricing configuration not found.'
                ]);
            }

            // Basic calculation (Simplified for demonstration)
            // In a real scenario, this would use mileage and tiers
            $ratePerCube = 15.00; // Mock rate
            $baseCharge = $pricing->base_charge ?? 50.00;
            
            // Adjust rate based on service level
            $serviceLevel = \App\Models\ServiceLevels::find($validated['service_levels_id']);
            if ($serviceLevel && $serviceLevel->service_discount) {
                $factor = $serviceLevel->getServiceLevelCalculatedDiscount();
                if ($factor > 0) {
                    $ratePerCube *= $factor;
                }
            }

            $total = ($cubes * $ratePerCube) + $baseCharge;
            $total = max($total, $pricing->min_cube_charge ?? 150.00);

            return response()->json([
                'success' => true,
                'data' => [
                    'total' => number_format($total, 2),
                    'rate' => number_format($ratePerCube, 2),
                    'in_service' => true,
                    'message' => 'Estimation based on standard rates. Final price may vary based on item complexity.'
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred during calculation: ' . $e->getMessage()
            ]);
        }
    }
}
