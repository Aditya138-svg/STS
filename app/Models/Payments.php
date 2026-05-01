<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payments extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'payments';

	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['orders_id', 'employees_id', 'txn_id', 'net_amount', 'tip_amount', 'status', 'invoice_email_status', 'notes', 'txn_datetime', 'is_last_export_iif_file', 'nmi_authcode', 'gateway_response', 'is_export_iif_file', 'created_at', 'updated_at'];
    
    /**
     * Summary of order: Relationship to Orders model to get the order detail
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function order()
    {
        return $this->belongsTo(Orders::class, 'orders_id'); // specify the foreign key if it's not the default 'order_id'
    }

}
