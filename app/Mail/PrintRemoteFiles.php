<?php

namespace App\Mail;
use App\Model\Users;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use PDF;

class PrintRemoteFiles extends Mailable
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
    protected $invoice_pdf;
    protected $subject_string;
    protected $file_name;
    protected $ccList;
    protected $cc_emails;
    protected $bcc_emails;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($toEmail,$content, $invoice_pdf, $subject_string , $filename , $cc_emails = [], $bcc_emails = [])
    {
        $this->toEmail = $toEmail;
        $this->content = $content;
        $this->invoice_pdf = $invoice_pdf;
        $this->subject_string =  $subject_string;
        $this->file_name= $filename;
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
        $email = $this->subject($this->subject_string)
                    ->view('emails.remote_print')
                    ->attachData($this->invoice_pdf,$this->file_name, [
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
