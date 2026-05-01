<?php

namespace App\Mail;
use App\Model\Users;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendStorageNotification extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The users instance.
     *
     * @var Users
     */
    // protected $users;
    protected $content;
	
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($content)
    {
        $this->content = $content;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $subj = env('APP_NAME', 'Specialized Transport Systems') . ' #' . $this->content['orders_id'] . ' - Notice of Potential Storage';
        if($this->content['attempt'] == 2){
            $subj = env('APP_NAME', 'Specialized Transport Systems') . ' #' . $this->content['orders_id'] . ' - Storage Has Started';
        }
        // $subj = trans('custom.schedule_email_sub', ['s' => $this->content['orders_id']]);
        return $this->subject($subj)
					->markdown('emails.storage_notification')
                    // ->view('emails.storage_notification') 
					->with($this->content);
    }
}
