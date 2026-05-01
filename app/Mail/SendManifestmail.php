<?php

namespace App\Mail;
use App\Model\Users;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use PDF;

class SendManifestmail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The users instance.
     *
     * @var Users
     */
    // protected $users;
    protected $toEmail;
    protected $mail_data;
    protected $manifest_mail_pdf;
    protected $cc_emails;
    protected $bcc_emails;
	
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($toEmail,$mail_data, $manifest_mail_pdf, $cc_emails = [], $bcc_emails = [])
    {
        $this->toEmail = $toEmail;
        $this->mail_data = $mail_data;
        $this->manifest_mail_pdf = $manifest_mail_pdf;
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
        $subject = env('APP_NAME', 'Specialized Transport Systems') . ' - Dispatcher Statistics Order List';
        $email = $this->subject($subject)
                    ->markdown('emails.manifest_order_list')
                    // ->view('emails.manifest_order_list')
                    ->with($this->mail_data)
                    ->attachData($this->manifest_mail_pdf,'Dispatch_Statistics.pdf', [
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
