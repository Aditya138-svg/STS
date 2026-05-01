<?php

namespace App\Models;
use App\Models\UserAddresses;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AddressBooks extends Model
{
    use HasFactory;
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'address_books';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['company_name', 'contact_phone', 'contact_email', 'addressline1', 'city', 'state', 'zipcode', 'used_count', 'lat', 'lng', 'address_type', 'short_code', 'terminal_name', 'active', 'is_notify_by_email', 'is_notify_by_sms', 'similiar_group_num', 'is_billable', 'is_authorize', 'custom_note', 'ignore_duplicacy', 'special_instruction', 'created_at', 'updated_at'];

    protected $hidden = [];

    public function userAddresses()
    {
        return $this->hasMany(UserAddresses::class, 'user_id');
    }

}
