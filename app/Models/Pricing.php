<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Auth;

class Pricing extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'price_model';

	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['pm_name', 'mileage_interval', 'max_mileage', 'mileage_step', 'min_cube', 'cube_discount', 'base_charge', 'min_cube_charge', 'is_standard', 'active', 'created_at', 'updated_at'];
	// ff
	/**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

	public function get_config_standard() {
		return Pricing::where('price_model.active','=',config('constants.ACTIVE'))
		        ->where('price_model.is_default_pm', '=', config('constants.DEFAULT_PRICE_MODEL_NEW.YES'))
                ->first();
	}

}
