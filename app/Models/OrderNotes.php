<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderNotes extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'order_notes';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['orders_id', 'notes', 'created_by', 'is_public', 'is_read', 'created_at', 'updated_at', 'is_modified', 'off_modified_on'];

    protected $hidden = [];

    /**
     * Summary of order
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function order()
    {
        return $this->belongsTo(Orders::class, 'orders_id');
    }

    // Relationship to the User model to get the creator
    public function creator() {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Relationship to the User model to get the creator's name
    public function createdBy() {
        return $this->belongsTo(User::class, 'created_by')->select('id', 'name');
    }

    // Assuming there's a many-to-many relationship between OrderNotes and Users
    public function assignedUsers()
    {
        return $this->belongsToMany(User::class, 'order_note_users', 'order_notes_id', 'users_id')
                    ->withPivot('read');  // Add 'read' if it's stored in the pivot table
    }

    // Method to get unread notes for the logged-in user
    public static function getUnreadNotesForUser($userId, $limit = 10, $offset = 0, $cacheRecords=FALSE) {
        if($cacheRecords == TRUE){
            $cKey = config('constants.CACHE_KEY.UNREAD_NOTES_FOR_USER');
            $cKey = str_replace('{userId}', $userId, $cKey);
            return cache()->remember($cKey, config('constants.DEFAULT_CACHE_TIME'), function() use ($userId, $limit, $offset) {
                // Get the relevant order IDs based on the warehouse location
                $orderIds = getOrderIdsByWarehouseLocation();
                $unreadNotes = self::select('id', 'orders_id', 'notes', 'created_at', 'created_by') // Select only necessary columns
                    ->whereHas('assignedUsers', function($query) use ($userId) {
                        $query->where('users_id', $userId)
                                ->where('read', '=', '0');
                    });
                    if(!empty($orderIds)){
                        $unreadNotes->whereIn('orders_id', $orderIds); // Filter by order IDs
                    }
                    return $unreadNotes->with(['createdBy']) // Eager load related creator if necessary
                            ->limit($limit)
                            ->offset($offset)
                            ->orderBy('created_at', 'desc')
                            ->get();
            });
        } else {
            // Get the relevant order IDs based on the warehouse location
            $orderIds = getOrderIdsByWarehouseLocation();
            $unreadNotes = self::select('id', 'orders_id', 'notes', 'created_at', 'created_by') // Select only necessary columns
                ->whereHas('assignedUsers', function($query) use ($userId) {
                    $query->where('users_id', $userId)
                            ->where('read', '=', '0');
                });
                if(!empty($orderIds)){
                    $unreadNotes->whereIn('orders_id', $orderIds); // Filter by order IDs
                }
                return $unreadNotes->with(['createdBy']) // Eager load related creator if necessary
                        ->limit($limit)
                        ->offset($offset)
                        ->orderBy('created_at', 'desc')
                        ->get();
        }
    }

    // Method to get total count for unread notes for the logged-in user
    public static function getTotalUnreadNotesForUser($userId, $cacheRecords=FALSE) {
        if($cacheRecords == TRUE){
            $cKey = config('constants.CACHE_KEY.TOTAL_UNREAD_NOTES_FOR_USER');
            $cKey = str_replace('{userId}', $userId, $cKey);
            return cache()->remember($cKey, config('constants.DEFAULT_CACHE_TIME'), function() use ($userId) {
                // Get the relevant order IDs based on the warehouse location
                $orderIds = getOrderIdsByWarehouseLocation();
                $totalUnreadNotes = self::whereHas('assignedUsers', function($query) use ($userId) {
                    $query->where('users_id', $userId)
                            ->where('read', '=', '0');
                });
                if(!empty($orderIds)){
                    $totalUnreadNotes->whereIn('orders_id', $orderIds); // Filter by order IDs
                }
                return $totalUnreadNotes->count();
            });
        } else {
            // Get the relevant order IDs based on the warehouse location
            $orderIds = getOrderIdsByWarehouseLocation();
            $totalUnreadNotes = self::whereHas('assignedUsers', function($query) use ($userId) {
                $query->where('users_id', $userId)
                        ->where('read', '=', '0');
            });
            if(!empty($orderIds)){
                $totalUnreadNotes->whereIn('orders_id', $orderIds); // Filter by order IDs
            }
            return $totalUnreadNotes->count();
        }
    }
}
