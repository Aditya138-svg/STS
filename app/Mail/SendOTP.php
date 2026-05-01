<?php

namespace App\Mail;
use App\Model\Users;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendOTP extends Mailable
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
		if(empty($this->content['isForgotPass'])) {
			$sub='Verification Email';
		} else{
			$sub='Change Password';
		}
        return $this->subject($sub)
					->markdown('emails.sendotp')
                    ->with($this->content)
                    ;
					
    }
}
