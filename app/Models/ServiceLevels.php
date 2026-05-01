<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceLevels extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'service_levels';


	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['service_name', 'service_short_name', 'service_discount', 'service_description', 'service_image', 'is_default', 'active'];

	/**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * This function is used to get the list of active service levels
     */
    public static function activeServiceLevels() {
        return self::where('active', config('constants.ACTIVE'))
            ->orderBy('service_name', 'ASC')
            ->get();
    }

    /**
     * This function is used to get the active service levels names Only
     */
    public static function activeServiceLevelNamesOnly() {
        return self::select('service_name')
            ->where('active', config('constants.ACTIVE'))
            ->orderBy('service_name', 'ASC')
            ->pluck('service_name')->values();
    }

    
    /**
     * This function is used to get the calculated service levels discount
     */
    public function getServiceLevelCalculatedDiscount(): float {
        if(!empty($this->service_discount)){
            // Convert percentage to decimal
            // For example, if service_discount is 20, it means 20%
            // So, we need to convert it to 0.20 for calculation
            // Then we subtract it from 1 to get the discount factor
            // For example, if service_discount is 20, the discount factor would be 0.80
            // 1 - (20 / 100) = 0.80
            // So, if the service_discount is 20, the discount factor would be 0.80
            // If the service_discount is 100, the discount factor would be 0
            // If the service_discount is 50, the discount factor would be 0.50, etc
            // This is used to calculate the discount factor
            return round(1 - ($this->service_discount / 100), 2);
        }
        // If the service_discount is 0, then no discount is applied
        return 0;
    }

    /**
     * This function is used to get the calculated service levels discount formatted
     */
    public function getServiceLevelCalculatedDiscountFormatted(): string {
        if(!empty($this->service_discount)){
            return round($this->service_discount, 2) . '%';
        }
        return 0 . '%';
    }

}
