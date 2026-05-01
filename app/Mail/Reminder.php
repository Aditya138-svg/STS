<?php

namespace App\Mail;
use App\Model\Reminders;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class Reminder extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * The Reminders instance.
     *
     * @var Reminders
     */
    // protected $Reminders;
    protected $reminder_subject;
    protected $content;
	
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($content, $rem_sub = 'Reminder')
    {
        $this->reminder_subject = $rem_sub;
        $this->content = $content;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        // return $this->view('emails.newaccount')
        return $this->subject($this->reminder_subject)
					->markdown('emails.reminder')	
					->with($this->content);
    }
}
