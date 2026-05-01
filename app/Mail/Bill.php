<?php

namespace App\Mail;
use App\Model\Users;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use PDF;

class Bill extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The users instance.
     *
     * @var Users
     */
    // protected $users;
    protected $toEmail;
    protected $content;
    protected $bill_pdf;
    protected $cc_emails;
    protected $bcc_emails;

	
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($toEmail, $content, $bill_pdf , $cc_emails = [], $bcc_emails = [])
    {
        $this->toEmail = $toEmail;
        $this->content = $content;
        $this->bill_pdf = $bill_pdf;
        $this->cc_emails = $cc_emails;
        $this->bcc_emails = $bcc_emails;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $subj = $this->content['subject'];
		$message = $this->content['msg'];
        $email = $this->subject($subj)
					->markdown('emails.bill')
                    // ->view('emails.bill')
                    ->with($this->content)
                    ->attachData($this->bill_pdf,'Orderbill.pdf', [
                        'mime' => 'application/pdf',
                    ]); 


        // Use the defined property $this->toEmail and $this->cc_email
        $ccList = getCcListForEmail($this->toEmail, $this->cc_emails); 
        $uniqueCcList = [] ;
        if (!empty($ccList)) {
            $uniqueCcList = removePrimaryRecipient($this->toEmail, $ccList); // remove $this->toEmail
            $email->cc($uniqueCcList);
        } 

        // 3. Filter initial BCC list
        $finalBccList = [];
        if (!empty($this->bcc_emails)) {
            $initialBccList = removePrimaryRecipient($this->toEmail, $this->bcc_emails); // remove $this->toEmail 
            $finalBccList = array_diff($initialBccList, $uniqueCcList); // remove cc emails from bcc 
            // PURPOSE : Preventing sending emails again and again
            if (!empty($finalBccList)) {
                $email->bcc($finalBccList);
            }
        }

        return $email ; 
        
    }
}