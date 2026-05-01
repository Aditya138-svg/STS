<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItems extends Model
{
    public $timestamps = false;
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'order_items';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['orders_id', 'items_id', 'in_items_id', 'reason_codes_id', 'reason_codes_id_p', 'package_type', 'sku', 'cube', 'quantity', 'qty_for_delivery', 'qty_delivered', 'has_marble_or_stone', 'comment', 'comment_p', 'is_modified', 'off_modified_on'];

    protected $hidden = [];

    /**
     * Summary of order: Relationship to Orders model to get the order detail
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function order()
    {
        return $this->belongsTo(Orders::class, 'orders_id');
    }

    /**
     * Summary of item: Relationship to Items model to get the item detail
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function item()
    {
        return $this->belongsTo(Items::class, 'items_id');
    }
}
