<?php

namespace App\Models;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderImage extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'order_images';

    /**
     * Summary of order: Relationship to Orders model to get order details
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function order()
    {
        return $this->belongsTo(Orders::class, 'orders_id');
    }

    public static function deleteById($id)
    {
        $is_deleted = DB::table('order_images')
            ->where('id', $id)
            ->delete();
        return $is_deleted;
    }

    public static function getOrderImage($image_id)
    {
        $order_image = DB::table('order_images')
            ->where('id', $image_id)
            ->first();
        return $order_image;
    }
    public static function getQuoteImageByOrderId($id)
    {
        $quote_images = DB::table('order_images')
            ->where('orders_id', $id)
            ->where('type', config('constants.IMAGE_TYPE.QUOTE_IMAGE'))
            ->get();
        return $quote_images;
    }
}