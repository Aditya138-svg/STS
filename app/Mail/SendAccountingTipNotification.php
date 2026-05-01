<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendAccountingTipNotification extends Mailable
{
    use Queueable, SerializesModels;

    protected $content;

    public function __construct(array $content)
    {
        $this->content = $content;
    }

    public function build()
    {
        $subject = trans('tips.email_accounting_tip_subject', ['s' => $this->content['orders_id'] ?? '']);

        return $this->subject($subject)
            ->view('emails.accounting_tip_notification')
            ->with($this->content);
    }
}

