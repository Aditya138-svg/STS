<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\OrderNotes;
use App\Models\OrderImage;
use App\Models\OrderItems;
use App\Models\OrderCriticalDates;
use App\Models\Payments;
use App\Models\OrderAccessorials;
use Illuminate\Support\Facades\DB;


class Orders extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'orders';

    protected $canRecalculateTotal = FALSE;

	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['id','users_id', 'quotes_id', 'employee_id', 'service_levels_id', 'customer_address_id', 'billing_address_id', 'origin_address_id', 'dest_address_id', 'user_cards_id', 'is_bill_addr_same', 'customer_ref', 'po_number', 'order_type', 'valuation_coverage', 'additional_valuation_declined', 'deductible', 'accessories', 'billing_method', 'total_amount', 'discount', 'freight_track_number', 'estimate_arrival_date', 'updated_by', 'latest_payment_log', 'fee_type', 'tip_amount', 'grand_total' ];

	/**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * Get the items for the order.
     */
    public function items()
    {
        return $this->hasMany(OrderItems::class, 'orders_id', 'id');
    }

    /**
     * Get the images for the order.
     */
    public function images()
    {
        return $this->hasMany(OrderImage::class, 'orders_id', 'id');
    }

    /**
     * Get the delivery images for the order.
     */
    public function deliveryImages()
    {
        return $this->images()->where('type', config('constants.IMAGE_TYPE.DISPATCH_D'));
    }

    /**
     * Get the public delivery images for the order.
     */
    public function publicDeliveryImages()
    {
        return $this->images()->where('type', config('constants.IMAGE_TYPE.DISPATCH_D'))->where('is_public', 1);
    }

    /**
     * Get the private delivery images for the order.
     */
    public function privateDeliveryImages()
    {
        return $this->images()->where('type', config('constants.IMAGE_TYPE.DISPATCH_D'))->where('is_public', 0);
    }

    /**
     * Get the scanned Docs for the order.
     */
    public function scannedDocs()
    {
        return $this->images()->where('type', config('constants.IMAGE_TYPE.SCANNED'));
    }

    /**
     * Get the public scanned Docs for the order.
     */
    public function publicScannedDocs()
    {
        return $this->images()->where('type', config('constants.IMAGE_TYPE.SCANNED'))->where('is_public', 1);
    }

    /**
     * Get the private scanned Docs for the order.
     */
    public function privateScannedDocs()
    {
        return $this->images()->where('type', config('constants.IMAGE_TYPE.SCANNED'))->where('is_public', 0);
    }

    /**
     * Get the notes for the order.
     */
    public function notes()
    {
        return $this->hasMany(OrderNotes::class, 'orders_id', 'id');
    }

    /**
     * Get the public notes for the order.
     */
    public function publicNotes()
    {
        return $this->notes()->where('is_public', config('constants.NOTES.PUBLIC'));
    }

    /**
     * Get the private notes for the order.
     */
    public function privateNotes()
    {
        return $this->notes()->where('is_public', config('constants.NOTES.PRIVATE'));
    }

    /**
     * Get the critical dates for the order.
     */
    public function criticalDates() {
        return $this->hasOne(OrderCriticalDates::class, 'orders_id');
    }

    /**
     * Get the extra accessorials for the order.
     */
    public function extraAccessorials() {
        return $this->hasOne(OrderAccessorials::class, 'orders_id');
    }

    /**
     * Get the payments for the order.
     */
    public function payments() {
        return $this->hasMany(Payments::class, 'orders_id');
    }

    /**
     * Get the sum of quantities for the order items i.e. total number of pieces.
     *
     * @return int
     */
    public function getTotalPieces()
    {
        return $this->items()->sum('quantity');
    }

    /**
     * Get the count of items for the order i.e. total number of line items.
     *
     * @return int
     */
    public function getTotalItems()
    {
        return $this->items()->count();
    }

    /**
     * Get the sum and count of quantities for the order items.
     *
     * @return array
     */
    public function getQuantitySummary()
    {
        return $this->items()->selectRaw('SUM(quantity) as total_pieces, COUNT(quantity) as total_items')->first();
    }

    /**
     * Summary of external customer means order is belongs to which customer: Relationship to User model to get the external customer
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function externalCustomer(){
        return $this->belongsTo(User::class, 'users_id');
    }

    /**
     * Summary of origin address: Relationship to AddressBooks model to get the origin address
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function originAddress(){
        return $this->belongsTo(AddressBooks::class, 'origin_address_id');
    }

    /**
     * Summary of destination Address: Relationship to AddressBooks model to get the destination address
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function destAddress(){
        return $this->belongsTo(AddressBooks::class, 'dest_address_id');
    }

    /**
     * Summary of billing Address: Relationship to AddressBooks model to get the billing address
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function billingAddress(){
        return $this->belongsTo(AddressBooks::class, 'billing_address_id');
    }

    /**
     * Summary of service levels: Relationship to ServiceLevels model to get the service levels
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function serviceLevels(){
        return $this->belongsTo(ServiceLevels::class, 'service_levels_id');
    }

    /**
     * Get the tracking information for the order.
     */
    public function tracking()
    {
        return $this->hasMany(OrderTracking::class, 'orders_id', 'id');
    }

    /**
     * Get tracking details for the order.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getTracking()
    {
        return $this->tracking()
            ->selectRaw('*,
                DATE_FORMAT(created_at, "%h:%i %p") AS created_at_time_formatted,
                DATE_FORMAT(created_at, "%m/%d/%Y %h:%i %p - %W") AS created_at_formatted,
                DATE_FORMAT(updated_at, "%m/%d/%Y %h:%i %p") AS updated_at_formatted')
            ->orderBy('created_at', 'ASC')
            ->get();
    }

    /**
     * Summary of getOrderDetailApiV1
     * @param mixed $id
     * @param mixed $users_id
     * @param mixed $sch_date
     * @param mixed $order_type
     * @param mixed $order_status
     * @param mixed $po_number_or_customer_ref
     * @return array
     */
    public function getOrderDetailApiV1($id = null, $users_id = null, $sch_date = '', $order_type = '', $order_status = '', $po_number_or_customer_ref = '')
    {
        $orders_list = [];

        if (empty($users_id)) {
            return $orders_list;
        }

        // This ensures that the foreign key (orders_id in this case) is included in the query, so Laravel can correctly associate the criticalDates, payments records with the orders.

        $query = self::with([
            'serviceLevels:id,service_name', // Only select the needed columns for serviceLevels
            'originAddress:id,company_name,contact_phone,contact_email,addressline1,city,state,zipcode', // Only select needed columns for originAddress
            'destAddress:id,company_name,contact_phone,contact_email,addressline1,city,state,zipcode', // Only select needed columns for destAddress
            'criticalDates:id,orders_id,scheduled_pickup_date,scheduled_pickup_window,actual_pickup_date,actual_pickup_window,scheduled_delivery_date,scheduled_delivery_window,actual_delivery_date,actual_delivery_window', // Only select needed columns for criticalDates
            'payments:id,orders_id,status', // Only select needed columns for payments
            // 'originAddress',
            // 'destAddress',
            // 'criticalDates',
            // 'payments',
            'items',
            'deliveryImages',
            'publicScannedDocs',
            'publicNotes'
            ])
            ->where('orders.users_id', $users_id)
            ->where('orders.active', config('constants.ACTIVE'));

        if (!empty($id)) { // For single record
            $query->where('orders.id', $id);
        }

        if (!empty($sch_date)) {
            $pickupScheduled = config('constants.ORDER_STATUS.SCHEDULE_PICKUP');
            $pickupScheduledOther = config('constants.ORDER_STATUS_OTHER.NEED_TO_PUSH_FOR_PICKUP');
            $deliverScheduled = config('constants.ORDER_STATUS.SCHEDULE_DELIVERY');
            $deliverScheduledOther = config('constants.ORDER_STATUS_OTHER.NEED_TO_PUSH_FOR_DELIVERY');

            $query->where(function ($subQuery) use ($pickupScheduled, $pickupScheduledOther, $deliverScheduled, $deliverScheduledOther, $sch_date) {
                $subQuery->where(function ($q) use ($pickupScheduled, $pickupScheduledOther, $sch_date) {
                    $q->whereIn('orders.status', [$pickupScheduled])
                        ->orWhereIn('orders.status_other', [$pickupScheduledOther])
                        ->where('order_critical_dates.scheduled_pickup_date', $sch_date);
                })->orWhere(function ($q) use ($deliverScheduled, $deliverScheduledOther, $sch_date) {
                    $q->whereIn('orders.status', [$deliverScheduled])
                        ->orWhereIn('orders.status_other', [$deliverScheduledOther])
                        ->where('order_critical_dates.scheduled_delivery_date', $sch_date);
                });
            });
        }

        // Filter by order type
        if (!empty($order_type)) {
            switch ($order_type) {
                case 'Pickup & Deliver':
                    $query->where('orders.order_type', config('constants.ORDER_TYPE.PICKUP'));
                    break;
                case 'Receive In & Deliver':
                    $query->where('orders.order_type', config('constants.ORDER_TYPE.RECEIVE_IN'));
                    break;
            }
        }

        // Filter by order status
        if (!empty($order_status)) {
            $this->filterByOrderStatus($query, $order_status);
        }

        // Search by PO number or customer reference
        if (!empty($po_number_or_customer_ref)) {
            $query->where(function ($q) use ($po_number_or_customer_ref) {
                $q->where('po_number', 'LIKE', "%{$po_number_or_customer_ref}%")
                    ->orWhere('customer_ref', 'LIKE', "%{$po_number_or_customer_ref}%");
            });
        }

        // Retrieve records
        $records = $query->get()
        ->map(function ($order) {

            $order_status = config('constants.REVERSAL_ORDER_STATUS')[$order->status] ?? '';
            if($order->status == config('constants.ORDER_STATUS.OTHER')){
                switch($order->status_other){
                    case config('constants.ORDER_STATUS_OTHER.NEED_TO_PUSH_FOR_PICKUP'):
                        $order_status = config('constants.ORDER_STATUS_OTHER.FOR_CUSTOMER_NEED_TO_PUSH_FOR_PICKUP');
                        break;

                    case config('constants.ORDER_STATUS_OTHER.NEED_TO_PUSH_FOR_DELIVERY'):
                        $order_status = config('constants.ORDER_STATUS_OTHER.FOR_CUSTOMER_NEED_TO_PUSH_FOR_DELIVERY');
                        break;
                    default:
                        $order_status = 'Other';
                        break;
                }
            }

            return [
                'orders_id' => $order->id ?: null,
                'order_type' => config('constants.REVERSAL_ORDER_TYPE')[$order->order_type] ?: null,
                'order_status' => $order_status ?: null,
                'customer_ref' => $order->customer_ref ?: null,
                'po_number' => $order->po_number ?: null,
                'service_level' => $order->serviceLevels->service_name ?: null,
                'billing_method' => config('constants.REVERSAL_BILLING_METHODS')[$order->billing_method] ?: null,
                'payment_status' => $this->processPaymentStatus($order->payments),
                'scheduled_pickup_date' => $order->criticalDates->scheduled_pickup_date ?: null,
                'scheduled_pickup_window' => $order->criticalDates->scheduled_pickup_window ?: null,
                'actual_pickup_date' => $order->criticalDates->actual_pickup_date ?: null,
                'actual_pickup_window' => $order->criticalDates->actual_pickup_window ?: null,
                'scheduled_delivery_date' => $order->criticalDates->scheduled_delivery_date ?: null,
                'scheduled_delivery_window' => $order->criticalDates->scheduled_delivery_window ?: null,
                'actual_delivery_date' => $order->criticalDates->actual_delivery_date ?: null,
                'actual_delivery_window' => $order->criticalDates->actual_delivery_window ?: null,
                'origin_company_name' => $order->originAddress->company_name ?: null,
                'origin_contact_phone' => $order->originAddress->contact_phone ?: null,
                'origin_contact_email' => $order->originAddress->contact_email ?: null,
                'origin_addressline1' => $order->originAddress->addressline1 ?: null,
                'origin_city' => $order->originAddress->city ?: null,
                'origin_state' => $order->originAddress->state ?: null,
                'origin_zip' => $order->originAddress->zipcode ?: null,
                'dest_company_name' => $order->destAddress->company_name ?: null,
                'dest_contact_phone' => $order->destAddress->contact_phone ?: null,
                'dest_contact_email' => $order->destAddress->contact_email ?: null,
                'dest_addressline1' => $order->destAddress->addressline1 ?: null,
                'dest_city' => $order->destAddress->city ?: null,
                'dest_state' => $order->destAddress->state ?: null,
                'dest_zip' => $order->destAddress->zipcode ?: null,
                'order_date' => date('Y-m-d', strtotime($order->created_at)),
                'order_time' => date('H:i:s', strtotime($order->created_at)),
                'items' => $this->processOrderItems($order->items) ?: [],
                'delivery_images' => $this->processDeliveryImages($order->deliveryImages) ?: [],
                'scan_docs' => $this->processPublicScannedDocs($order->publicScannedDocs) ?: [],
                'notes' => $this->processPublicNotes($order->publicNotes) ?: [] // it (?:) handles every case like empty, null, 0, [], and false
            ];
        })->filter()->values()->toArray();
        return $records;
    }

    public function get_orders_by_unique_payment_link($id = NULL){
		
		if(empty($id)){ //For listing
			$result = FALSE;
		}
		else{ //For single record
			$query = DB::table('orders')
					->leftJoin('users', 'orders.users_id', '=', 'users.id')
					->leftJoin('order_critical_dates', 'order_critical_dates.orders_id', '=', 'orders.id')
					->leftJoin('payments', 'orders.id', '=', 'payments.orders_id')
					->leftJoin('address_books AS ab2', 'ab2.id', '=', 'orders.dest_address_id')
					->select(DB::raw(
						'orders.id AS o_id, orders.status AS o_status, payments.id AS p_id, payments.status AS p_status, orders.*, payments.*, 
						ab2.company_name AS dest_company_name, ab2.contact_phone AS dest_contact_phone, ab2.contact_email AS dest_contact_email,
						ab2.addressline1 AS dest_addressline1, ab2.city AS dest_city, ab2.state AS dest_state, ab2.zipcode AS dest_zip,'.'
							COALESCE(orders.delivery_charges,0) + COALESCE(orders.insurance_charges,0) + COALESCE(orders.accessory_charges,0) + 
							COALESCE(CASE
							WHEN orders.order_type = "'. config('constants.ORDER_TYPE.PICKUP') .'" THEN orders.pickup_charges
						END,0) +
						COALESCE(CASE
							WHEN (orders.is_audit_required = "'.config('constants.AUDIT.APPROVED').'" || orders.is_audit_required = "'.config('constants.AUDIT.EDITED').'") THEN orders.extra_service_charges
						END,0) + 
							(CASE 
							WHEN (orders.is_absorb_order = "1" || orders.status = "'. config('constants.ORDER_STATUS.CANCELLED') .'") THEN "0.00"
							WHEN (users.is_cubic_consolidate = "1" ) THEN "0.00"
	
								WHEN (orders.order_type = "'. config('constants.ORDER_TYPE.PICKUP') .'" AND orders.storage_waive = "0" AND orders.storage_manually_override = "0" AND order_critical_dates.actual_delivery_date IS NULL) THEN 
									IF(DATEDIFF(CURDATE(), DATE_ADD(order_critical_dates.actual_pickup_date, INTERVAL orders.storage_rule_days_o DAY)) > 0, DATEDIFF(CURDATE(),DATE_ADD(order_critical_dates.actual_pickup_date, INTERVAL orders.storage_rule_days_o DAY)) * orders.storage_rule_amount_per_day_o, "0.00")
								WHEN (orders.order_type = "'. config('constants.ORDER_TYPE.PICKUP') .'" AND orders.storage_waive = "0" AND orders.storage_manually_override = "0" AND order_critical_dates.actual_delivery_date IS NOT NULL) THEN 
									IF(DATEDIFF(order_critical_dates.actual_delivery_date, DATE_ADD(order_critical_dates.actual_pickup_date, INTERVAL orders.storage_rule_days_o DAY)) > 0, DATEDIFF(order_critical_dates.actual_delivery_date,DATE_ADD(order_critical_dates.actual_pickup_date, INTERVAL orders.storage_rule_days_o DAY)) * orders.storage_rule_amount_per_day_o, "0.00")
								WHEN (orders.order_type = "'. config('constants.ORDER_TYPE.PICKUP') .'" AND orders.storage_waive = "1" AND orders.storage_manually_override = "0") THEN "0.00"
								WHEN (orders.order_type = "'. config('constants.ORDER_TYPE.PICKUP') .'" AND orders.storage_waive = "0" AND orders.storage_manually_override = "1" AND order_critical_dates.actual_delivery_date IS NULL) THEN 
									IF(orders.storage_override_date IS NOT NULL AND DATEDIFF(CURDATE(), orders.storage_override_date) > 0, DATEDIFF(CURDATE(), orders.storage_override_date) * orders.storage_rule_amount_per_day_o, "0.00")
								WHEN (orders.order_type = "'. config('constants.ORDER_TYPE.PICKUP') .'" AND orders.storage_waive = "0" AND orders.storage_manually_override = "1" AND order_critical_dates.actual_delivery_date IS NOT NULL) THEN 
									IF(orders.storage_override_date IS NOT NULL AND DATEDIFF(order_critical_dates.actual_delivery_date, orders.storage_override_date) > 0, DATEDIFF(order_critical_dates.actual_delivery_date, orders.storage_override_date) * orders.storage_rule_amount_per_day_o, "0.00")
								WHEN (orders.order_type = "'. config('constants.ORDER_TYPE.RECEIVE_IN') .'" AND orders.storage_waive = "0" AND orders.storage_manually_override = "0" AND order_critical_dates.actual_delivery_date IS NULL) THEN 
									IF(DATEDIFF(CURDATE(), DATE_ADD(order_critical_dates.actual_arrival_date, INTERVAL orders.storage_rule_days_o DAY)) > 0, DATEDIFF(CURDATE(),DATE_ADD(order_critical_dates.actual_arrival_date, INTERVAL orders.storage_rule_days_o DAY)) * orders.storage_rule_amount_per_day_o, "0.00")
								WHEN (orders.order_type = "'. config('constants.ORDER_TYPE.RECEIVE_IN') .'" AND orders.storage_waive = "0" AND orders.storage_manually_override = "0" AND order_critical_dates.actual_delivery_date IS NOT NULL) THEN 
									IF(DATEDIFF(order_critical_dates.actual_delivery_date, DATE_ADD(order_critical_dates.actual_arrival_date, INTERVAL orders.storage_rule_days_o DAY)) > 0, DATEDIFF(order_critical_dates.actual_delivery_date,DATE_ADD(order_critical_dates.actual_arrival_date, INTERVAL orders.storage_rule_days_o DAY)) * orders.storage_rule_amount_per_day_o, "0.00")
								WHEN (orders.order_type = "'. config('constants.ORDER_TYPE.RECEIVE_IN') .'" AND orders.storage_waive = "1" AND orders.storage_manually_override = "0") THEN "0.00"
								WHEN (orders.order_type = "'. config('constants.ORDER_TYPE.RECEIVE_IN') .'" AND orders.storage_waive = "0" AND orders.storage_manually_override = "1" AND order_critical_dates.actual_delivery_date IS NULL) THEN 
									IF(orders.storage_override_date IS NOT NULL AND DATEDIFF(CURDATE(), orders.storage_override_date) > 0, DATEDIFF(CURDATE(), orders.storage_override_date) * orders.storage_rule_amount_per_day_o, "0.00")
								WHEN (orders.order_type = "'. config('constants.ORDER_TYPE.RECEIVE_IN') .'" AND orders.storage_waive = "0" AND orders.storage_manually_override = "1" AND order_critical_dates.actual_delivery_date IS NOT NULL) THEN 
									IF(orders.storage_override_date IS NOT NULL AND DATEDIFF(order_critical_dates.actual_delivery_date, orders.storage_override_date) > 0, DATEDIFF(order_critical_dates.actual_delivery_date, orders.storage_override_date) * orders.storage_rule_amount_per_day_o, "0.00")
								ELSE "0.00" 
							END) 
							AS total_amount'));
			$result = $query->where('orders.unique_payment_link_id', '=', $id )
					->where('orders.active', '=', config('constants.ACTIVE'))
					->groupBy('orders.id')
					->get();
		}
		return $result;
	}

    	/**
     * To get order unique payment link
     * @var $id
     * @author Sandeep Rawat
     */
	public function get_orders_unique_payment_link($id = NULL){
		
		if(empty($id)){ //For listing
			$result = FALSE;
		}
		else{ //For single record
			$query = DB::table('orders_unique_payment_link')
					->leftJoin('orders', 'orders_unique_payment_link.id', '=', 'orders.unique_payment_link_id')
					->select(DB::raw('orders_unique_payment_link.*, orders_unique_payment_link.id AS oup_id, GROUP_CONCAT(COALESCE(orders_unique_payment_link.id,"")) AS order_ids'));
			$result = $query->where('orders_unique_payment_link.id', '=', $id )
					->groupBy('orders.id')
					->first();
		}
		return $result;
	}

    /**
     * Summary of filterByOrderStatus
     * @param mixed $query
     * @param mixed $order_status
     * @return void
     */
    protected function filterByOrderStatus($query, $order_status)
    {
        switch ($order_status) {
            case 'Wait For Pickup Schedule':
                $query->where('orders.status', config('constants.ORDER_STATUS.OTHER'));
                $query->where('orders.status_other', config('constants.ORDER_STATUS_OTHER.WAIT_FOR_SCHEDULE_PICKUP'));
                break;

            case 'Scheduled For Pickup':
                $query->where('orders.status', config('constants.ORDER_STATUS.OTHER'));
                $query->where('orders.status_other', config('constants.ORDER_STATUS_OTHER.NEED_TO_PUSH_FOR_PICKUP'));
                break;

            case 'Out For Pickup':
                $query->where('orders.status', config('constants.ORDER_STATUS.SCHEDULE_PICKUP'));
                break;

            case 'Wait For Delivery Schedule':
                $query->where('orders.status', config('constants.ORDER_STATUS.OTHER'));
                $query->where('orders.status_other', config('constants.ORDER_STATUS_OTHER.WAIT_FOR_SCHEDULE_DELIVERY'));
                break;

            case 'Scheduled For Delivery':
                $query->where('orders.status', config('constants.ORDER_STATUS.OTHER'));
                $query->where('orders.status_other', config('constants.ORDER_STATUS_OTHER.NEED_TO_PUSH_FOR_DELIVERY'));
                break;

            case 'Out For Delivery':
                $query->where('orders.status', config('constants.ORDER_STATUS.SCHEDULE_DELIVERY'));
                break;

            case 'Cancelled':
                $query->where('orders.status', config('constants.ORDER_STATUS.CANCELLED'));
                break;

            case 'Delivered':
                $query->where('orders.status', config('constants.ORDER_STATUS.DELIVERED'));
                break;

            case 'Other':
                $query->where('orders.status', config('constants.ORDER_STATUS.OTHER'));
                $query->whereNotIn('orders.status_other', [config('constants.ORDER_STATUS_OTHER.WAIT_FOR_SCHEDULE_PICKUP'), config('constants.ORDER_STATUS_OTHER.NEED_TO_PUSH_FOR_PICKUP'), config('constants.ORDER_STATUS_OTHER.WAIT_FOR_SCHEDULE_DELIVERY'), config('constants.ORDER_STATUS_OTHER.NEED_TO_PUSH_FOR_DELIVERY')]);
                break;
        }
    }

    /**
     * Summary of processPaymentStatus: It is used to get the order's payment status
     * @param mixed $payments
     * @return array|\Illuminate\Database\Eloquent\Collection|\Illuminate\Support\Collection
     * @author Sandeep Rawat
     */
    public function processPaymentStatus($payments = null)
    {
        // Fallback to a default status from the config if no payments are found
        $payment_status = config('constants.REVERSAL_PAYMENT_STATUS')[config('constants.PAYMENT_STATUS.PENDING')];

        // Check if there are any payments and retrieve the latest payment status
        return $payments->isNotEmpty()
            ? config('constants.REVERSAL_PAYMENT_STATUS')[$payments->sortByDesc('created_at')->first()->status] ?? $payment_status
            : $payment_status;
    }

    /**
     * Summary of processOrderItems: It is used to get the order's items
     * @param mixed $items
     * @return array|\Illuminate\Database\Eloquent\Collection|\Illuminate\Support\Collection
     * @author Sandeep Rawat
     */
    public function processOrderItems($items = null)
    {
        return $items ? $items->map(function ($item) {
            return [
                'item_id' => $item->id,
                'package_type' => config('constants.REVERSAL_PACKAGE_TYPE')[$item->package_type] ?? '',
                'sku' => $item->sku,
                'quantity' => $item->quantity,
                'has_marble_or_stone' => $item->has_marble_or_stone ? 'yes' : 'no',
                'item_name' => $item->item->item_name,
                'length' => $item->item->length,
                'width' => $item->item->width,
                'height' => $item->item->height,
                'weight' => $item->item->weight,
            ];
        })->filter()->values()->toArray() : [];
    }

        public function store_cc_charges($orders_id, $cc_fees_amount, $cc_fees_perc_of_user){
		
		if (empty($orders_id) || empty($cc_fees_amount) || empty($cc_fees_perc_of_user)) {
			return FALSE;
		}

		$updated = DB::table('orders')
			->where('id', $orders_id)
			->update([
				'cc_fees_value' => $cc_fees_amount,
				'cc_fees_perc' => $cc_fees_perc_of_user,
			]);

		return $updated ? TRUE : FALSE;
	}

    /**
     * Summary of processDeliveryImages: It is used to get the order's delivery images only
     * @param mixed $deliveryImages
     * @return array|\Illuminate\Database\Eloquent\Collection|\Illuminate\Support\Collection
     * @author Sandeep Rawat
     */
    public function processDeliveryImages($deliveryImages = null)
    {
        return $deliveryImages ? $deliveryImages->map(function ($deliveryImage) {
            return \Storage::disk('s3')->url('crm/scan_images/' . $deliveryImage->image);
        })->filter()->values()->toArray() : [];
    }

    /**
     * Summary of processPublicScannedDocs: It is used to get the order's public scanned docs
     * @param mixed $publicScannedDocs
     * @return array|\Illuminate\Database\Eloquent\Collection|\Illuminate\Support\Collection
     * @author Sandeep Rawat
     */
    public function processPublicScannedDocs($publicScannedDocs = null)
    {
        return $publicScannedDocs ? $publicScannedDocs->map(function ($publicScannedDoc) {
            return \Storage::disk('s3')->url('crm/scan_images/' . $publicScannedDoc->image);
        })->filter()->values()->toArray() : [];
    }

    /**
     * Summary of processPublicNotes: It is used to get the order's public notes
     * @param mixed $publicNotes
     * @return array|\Illuminate\Database\Eloquent\Collection|\Illuminate\Support\Collection
     * @author Sandeep Rawat
     */
    public function processPublicNotes($publicNotes = null)
    {
        return $publicNotes ? $publicNotes->sortByDesc('created_at')->map(function ($note) {
            return 'By ' . $note->creator->name . ', ' . datetimeFormattedDDMMYYgia($note->created_at) . ' > ' . e($note->notes);
        })->filter()->values()->toArray() : [];
    }

    /**
     * To create/edit orders
     * @var array $data, int $id (optional)
     * @author Sandeep Rawat
     */
	public function store($data=NULL, $id=NULL){

		if(empty($data)){
			return FALSE;
		}

		if(empty($id)){ //Creating order
			$last_id = DB::table('orders')->insertGetId(
				$data
			);
			return $last_id;
		}
		else{ //Editing order

			if(DB::table('orders')->where('id', $id)->update($data)){
				return $id;
			}
			return FALSE;
		}
	}

    public function store_item($data=NULL, $id=NULL,$sent_web=true){
		if(empty($data)){
			return FALSE;
		}
		if(empty($id)){ //Creating order items
			if(is_array($data)){
				$OrderItems = new OrderItems;
            //   dd($OrderItems);
				foreach($data AS $col=>$val){
					$OrderItems->$col = $val;
				}
				$OrderItems->save();

				$last_id = $OrderItems->id;
				//Add value in modified_orders table for offline sync
				if($sent_web){
					if(!empty($OrderItems->orders_id)){
						$orders_id = is_object($OrderItems)?$OrderItems->orders_id:$OrderItems['orders_id'];
						modified_orders_add($orders_id, config('constants.OFFLINE_SYNC_EVENT.NEW'), 'order_items', $last_id);
					}
				}
				return $last_id;
			}
			return FALSE;
		}
		else{ //Editing order items
			$OrderItems = OrderItems::find($id);
			if(is_array($data)){
				foreach($data AS $col=>$val){
					if($col == 'updated_at') continue; //We skipped out because the `order_items` table does not have an `updated_at` column.
					$OrderItems->$col = $val;
				}
			}
			$is_updated = $OrderItems->save();
			if($is_updated){
				//Add value in modified_orders table for offline sync
				if($sent_web){
					if(!empty($OrderItems->orders_id)){
						$orders_id = is_object($OrderItems)?$OrderItems->orders_id:$OrderItems['orders_id'];
						modified_orders_add($orders_id, config('constants.OFFLINE_SYNC_EVENT.EDIT'), 'order_items', $id);
					}
				}
				return $id;
			}
			return FALSE;
		}
	}

    public function store_notes($data=NULL, $id = NULL,$sent_web=true){

		if(empty($data)){
			return FALSE;
		}
		if(empty($id)){ //Creating order notes
			if(is_array($data)){
				$OrderNotes = new OrderNotes;
				// dd($data);
				foreach($data AS $col=>$val){
					$OrderNotes->$col = $val;
				}
				$OrderNotes->save();
				$last_id = $OrderNotes->id;
				//Add value in modified_orders table for offline sync
				if($sent_web){
					if(!empty($OrderNotes->orders_id)){
						$orders_id = is_object($OrderNotes)?$OrderNotes->orders_id:$OrderNotes['orders_id'];
						modified_orders_add($orders_id, config('constants.OFFLINE_SYNC_EVENT.NEW'), 'order_notes', $last_id);
					}
				}
				return $last_id;
			}
			return FALSE;
		}
		else{ //Editing order notes
			$OrderNotes = OrderNotes::find($id);
			if(is_array($data)){
				foreach($data AS $col=>$val){
					$OrderNotes->$col = $val;
				}
			}
			$OrderNotes->updated_at = date('Y-m-d H:i:s');
			$is_updated = $OrderNotes->save();
			if($is_updated){
				//Add value in modified_orders table for offline sync
				if($sent_web){
					if(!empty($OrderNotes->orders_id)){
						$orders_id = is_object($OrderNotes)?$OrderNotes->orders_id:$OrderNotes['orders_id'];
						modified_orders_add($orders_id, config('constants.OFFLINE_SYNC_EVENT.EDIT'), 'order_notes', $id);
					}
				}
				return $id;
			}
			return FALSE;
		}
	}

    public function store_critical_dates($data=NULL, $orders_id = NULL){

		if(empty($data)){
			return FALSE;
		}

		if(empty($orders_id)){ //Creating order critical dates
			$last_id = DB::table('order_critical_dates')->insertGetId(
				$data
			);
			return $last_id;
		}
		else{ //Editing order critical dates
			if(DB::table('order_critical_dates')->where('orders_id', $orders_id)->update($data)){
				return $orders_id;
			}
			return FALSE;
		}
	}

    public function store_order_tracking($data=NULL, $id = NULL){

		if(empty($data)){
			return FALSE;
		}

		if(empty($id)){ //Creating order reminders
			$last_id = DB::table('order_tracking')->insertGetId(
				$data
			);
			return $last_id;
		}
		else{ //Editing order reminders

			if(DB::table('order_tracking')->where('id', $id)->update($data)){
				return $id;
			}
			return FALSE;
		}
	}

    /**
     * Get the total amount for the model.
     *
     * This accessor will return the stored `total_amount` column value unless
     * a specific condition (via `shouldRecalculateTotal()`) is met, in which case
     * it will perform a dynamic calculation and return the recalculated total amount.
     *
     * @return float|string The total amount value, either stored or recalculated.
     */
    public function getTotalAmountAttribute()
    {
        // You can decide to use the database value or dynamic calculation
        // For example, you could return the stored value unless some flag requires recalculation
        if ($this->shouldRecalculateTotal()) {
            return $this->calculateTotalAmount();
        }

        // Otherwise, use the value stored in the 'total_amount' column
        return $this->attributes['total_amount'];
    }

    /**
     * Determine if total amount should be recalculated dynamically.
     *
     * @return bool
     */
    protected function shouldRecalculateTotal()
    {
        // Here you can implement conditions to decide whether to recalculate
        // For example, based on whether certain fields have changed or based on a flag
        return $this->canRecalculateTotal;
        // return true;
    }

    /**
     * Set the recalculate total accordingly
     *
     * @return bool
     */
    public function setRecalculateTotal($arg)
    {
        $this->canRecalculateTotal = $arg ?? FALSE;
    }

    /**
     * Calculate the total amount dynamicall
     *
     * @return float
     */
    public function calculateTotalAmount()
    {
        // Dynamic calculation method
        $total = 0;

        // Calculate the sum of delivery, insurance, and accessory charges
        $total += $this->delivery_charges ?? 0;
        $total += $this->insurance_charges ?? 0;
        $total += $this->accessory_charges ?? 0;

        // Add pickup charges if order type is '1' (assuming '1' means 'pickup')
        if ($this->order_type == config('constants.ORDER_TYPE.PICKUP')) {
            $total += $this->pickup_charges ?? 0;
        }

        // Add extra service charges if audit required is '2'=APPROVED or '3'=EDITED
        if (in_array($this->is_audit_required, [config('constants.AUDIT.APPROVED'), config('constants.AUDIT.EDITED')])) {
            $total += $this->extra_service_charges ?? 0;
        }

        // Storage charges calculation based on various conditions
        $total += $this->calculateStorageCharges();

        return $total;
    }

    /**
     * Calculate storage charges based on various conditions.
     *
     * @return float
     */
    protected function calculateStorageCharges()
    {
        $storageCharges = 0;

        // Check for absorb order or cancelled status
        if ($this->is_absorb_order == 1 || $this->status == config('constants.ORDER_STATUS.CANCELLED')) {
            return 0;
        }

        // Check for cubic consolidation
        if ($this->externalCustomer->is_cubic_consolidate == 1) {
            return 0;
        }

        // Various conditions for calculating storage charges
        // Determine the storage start date based on the conditions
        $storageStartDate = $this->getStorageStartDate();

        // Calculate the number of days for storage
        if ($storageStartDate) {
            $days = $this->calculateDateDiff($storageStartDate);
            $storageCharges += $days * $this->storage_rule_amount_per_day_o;
        }
        return $storageCharges;
    }

    /**
     * Get the storage start date based on various conditions.
     *
     * @return string|null
     */
    protected function getStorageStartDate()
    {
        // If it's a pickup order
        if ($this->order_type == config('constants.ORDER_TYPE.PICKUP')) {
            // If no waiver and no manual override
            if ($this->storage_waive == 0 && $this->storage_manually_override == 0) {
                if(!empty($this->criticalDates) && !empty($this->criticalDates->actual_pickup_date)){
                    return \Carbon\Carbon::parse($this->criticalDates->actual_pickup_date)->addDays($this->storage_rule_days_o);
                }
            }
        }

        // If it's a receive in order
        if ($this->order_type == config('constants.ORDER_TYPE.RECEIVE_IN')) {
            // No waiver and no manual override
            if ($this->storage_waive == 0 && $this->storage_manually_override == 0) {
                if(!empty($this->criticalDates) && !empty($this->criticalDates->actual_arrival_date)){
                    return \Carbon\Carbon::parse($this->criticalDates->actual_arrival_date)->addDays($this->storage_rule_days_o);
                }
            }
        }

        // If manual override is active and there is an override date
        if ($this->storage_manually_override == 1 && !empty($this->storage_override_date)) {
            return \Carbon\Carbon::parse($this->storage_override_date);
        }

        return null;
    }

    /**
     * Helper function to calculate the date difference from the storage start date.
     *
     * @param  string|null  $startDate
     * @return int
     */
    protected function calculateDateDiff($startDate)
    {
        if ($startDate) {
            // If actual delivery date exists, use it as the comparison date
            $compareDate = $this->criticalDates->actual_delivery_date ? \Carbon\Carbon::parse($this->criticalDates->actual_delivery_date) : \Carbon\Carbon::now();

            // Calculate the difference in days
            return max(\Carbon\Carbon::parse($startDate)->diffInDays($compareDate, false), 0);
        }

        return 0;
    }
}
