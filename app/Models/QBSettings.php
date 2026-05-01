<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QBSettings extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'qb_settings';

	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['access_token', 'refresh_token', 'realmID', 'created_at', 'updated_at'];

	/**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];


}
?>
