<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Auth;

class OrderAccessorials extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'order_accessorials';
	
	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['accessorials_id', 'user_accessorials_id', 'orders_id', 'access_name', 'access_type', 'access_desc', 'access_charge', 'min_charge', 'per_qty', 'qty_asked', 'qty_used', 'asked_type', 'actually_charge', 'active', 'created_at', 'updated_at', 'is_modified', 'off_modified_on'];
	
	/**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

}
?>