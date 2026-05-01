<?php

namespace App\Models;
use App\Models\AddressBooks;
use Illuminate\Database\Eloquent\Model;

class UserAddresses extends Model
{
    /**
     * The table associated with the model.
     * @var string
     */
    protected $table = 'user_addresses';
	
	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */	
    protected $fillable = ['user_id', 'address_book_id'];
	
    public function addressBook() {
        return $this->belongsTo(AddressBooks::class,'address_book_id', 'id');
    }

}
