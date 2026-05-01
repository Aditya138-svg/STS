<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendPaymentTipOtp extends Mailable
{
    use Queueable, SerializesModels;

    protected $content;

    public function __construct(array $content)
    {
        $this->content = $content;
    }

    public function build()
    {
        $subject = trans('payment.tip_otp_email_subject', array(
            'order' => $this->content['order_id'] ?? '',
        ));

        return $this->subject($subject)
            ->view('emails.payment_tip_otp')
            ->with($this->content);
    }
}
