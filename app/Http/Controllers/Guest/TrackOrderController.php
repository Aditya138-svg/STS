<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\Orders;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TrackOrderController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Guest/TrackOrder', [
            'title' => 'Track your order',
            'orders_id' => $request->orders_id,
        ]);
    }

    public function track(Request $request)
    {
        $order = Orders::with(['serviceLevels', 'originAddress', 'destAddress'])->find($request->orders_id);
        if (!$order) {
            return response()->json(['status' => false, 'message' => 'Order not found']);
        }

        return response()->json([
            'status' => true,
            'data' => [
                'order_info' => [
                    'service_level' => $order->serviceLevels->service_name ?? '-',
                    'origin_city' => $order->originAddress->city ?? '-',
                    'origin_state' => $order->originAddress->state ?? '-',
                    'origin_zip' => $order->originAddress->zipcode ?? '-',
                    'dest_city' => $order->destAddress->city ?? '-',
                    'dest_state' => $order->destAddress->state ?? '-',
                    'dest_zip' => $order->destAddress->zipcode ?? '-',
                    'num_of_items' => $order->getTotalItems(),
                    'num_of_pieces' => $order->getTotalPieces(),
                ],
                'tracking_info' => $this->formatTracking($order->getTracking()),
            ]
        ]);
    }

    public function trackByRef(Request $request)
    {
        $ref_no = $request->ref_no;
        $phn_no = $request->phn_no;

        $orders = Orders::where('po_number', $ref_no)
            ->whereHas('destAddress', function($q) use ($phn_no) {
                $q->where('contact_phone', 'LIKE', "%$phn_no%");
            })
            ->with(['serviceLevels', 'originAddress', 'destAddress'])
            ->get();

        if ($orders->isEmpty()) {
            return response()->json(['status' => false, 'message' => 'No orders found matching this PO number and phone.']);
        }

        $result = $orders->map(function($order) {
            $tracking = $order->getTracking();
            $delivery_completed = $tracking->contains(fn($t) => strtolower($t->t_status) === 'delivery completed');
            $delivery_completed_on = $delivery_completed ? $tracking->first(fn($t) => strtolower($t->t_status) === 'delivery completed')->created_at_formatted : null;

            return [
                'order_info' => [
                    'orders_id' => $order->id,
                    'service_level' => $order->serviceLevels->service_name ?? '-',
                    'origin_city' => $order->originAddress->city ?? '-',
                    'origin_state' => $order->originAddress->state ?? '-',
                    'origin_zip' => $order->originAddress->zipcode ?? '-',
                    'dest_city' => $order->destAddress->city ?? '-',
                    'dest_state' => $order->destAddress->state ?? '-',
                    'dest_zip' => $order->destAddress->zipcode ?? '-',
                    'num_of_items' => $order->getTotalItems(),
                    'num_of_pieces' => $order->getTotalPieces(),
                ],
                'tracking_info' => $this->formatTracking($tracking),
                'delivery_completed' => $delivery_completed,
                'delivery_completed_on' => $delivery_completed_on,
            ];
        });

        return response()->json(['status' => true, 'data' => $result]);
    }

    private function formatTracking($tracking)
    {
        // Group by date
        return $tracking->groupBy(function($t) {
            return date('m/d/Y', strtotime($t->created_at));
        });
    }
}
