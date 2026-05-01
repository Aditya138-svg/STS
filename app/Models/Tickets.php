<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\TicketComments;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
class Tickets extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tickets';

	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['id','users_id', 'ticket_categories_id', 'hub_id', 'code', 'title', 'priority', 'message', 'status', 'active', 'is_read', 'updated_by', 'opened_since', 'is_billable', 'created_at', 'updated_at', 'closed_at'];

	/**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * Get the comments for the ticket.
     */
    public function comments()
    {
        return $this->hasMany(TicketComments::class, 'tickets_id', 'id');
    }

    /**
     * Get the completed ticket comments for the ticket.
     */
    public function completedTicketComment()
    {
        if ($this->status == config('constants.TICKET_STATUS.COMPLETED')) {
            return $this->comments()
                ->where('comment', 'LIKE', '%' . trans("custom.ticket_complete") . '%')
                ->orderBy('created_at', 'DESC')
                ->first();
        }

        return null;
    }

    /**
     * Calculate time for completed ticket since creation of ticket.
     */
    public function calculateTimeToCompleteTicket()
    {
        $completedTicketComment = $this->completedTicketComment();
        if($completedTicketComment) {
            $createdAt = Carbon::make($this->created_at);
            $completedAt = Carbon::make($completedTicketComment->created_at);
            $seconds = $createdAt->diffInSeconds($completedAt);
            return 'Took '. convertSecondsToText($seconds) . ' to complete since open';
        }
        return 0;
    }
}
