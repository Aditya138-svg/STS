<?php

namespace App\Mail;
use App\Model\Users;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Image;

class SendReceiverNotification extends Mailable
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
	protected $inspection_report;
    protected $cc_emails;
    protected $bcc_emails;


    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($toEmail,$content, $inspection_report=NULL, $cc_emails = [], $bcc_emails = [])
    {
        $this->toEmail = $toEmail;
        $this->content = $content;
        $this->inspection_report = $inspection_report;
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
        $subj = trans('custom.receiver_notification_sub', ['s' => $this->content['id']]);
        $message = $this->subject($subj)
                    ->view('emails.receiver_notification') 
                    ->with($this->content);
        
        if(!empty($this->inspection_report)){
            // $message->attachData($this->inspection_report,'report.pdf', [
            //             'mime' => 'application/pdf',
            //         ]); // attach each file
        }

        $files = []; // array of all files to be attached 
        if(!empty($this->content['receiving_images'])){
            $i_count = 0;
            $receiving_images = $this->content['receiving_images'];
            foreach ($receiving_images as $key=>$image_path) { 
                $img_w = 500;
                $img_h = 500;
                if($i_count >= 8)
                    break;
                // read image file and resize it to 300x300
                // but keep aspect-ratio and do not size up,
                // so smaller sizes don't stretch
                try{
                    $image_path = str_replace(' ', '%20', $image_path);
                    $image = Image::make($image_path)->resize($img_w, $img_h, function ($c) {
                        $c->aspectRatio();
                        $c->upsize();
                    })->encode('png');
                    $img_name = 'Image_'.($key+1).'.png';
                    $message->attachData($image->__toString(), $img_name, [
                        'mime' => 'image/png',
                    ]);
                    // $img_name = 'Image_'.($key+1).'.png';
                    // $message->attach($image_path); // attach each file
                    $i_count++;
                }
                catch(\Exception $e){
					// echo $e; die;
                }
            }
        }

        // Use the defined property $this->toEmail and $this->cc_email
        $ccList = getCcListForEmail($this->toEmail, $this->cc_emails); 
        $uniqueCcList = [] ;
        if (!empty($ccList)) {
            $uniqueCcList = removePrimaryRecipient($this->toEmail, $ccList); // remove $this->toEmail
            $message->cc($uniqueCcList);
        } 

        // 3. Filter initial BCC list
        $finalBccList = [];
        if (!empty($this->bcc_emails)) {
            $initialBccList = removePrimaryRecipient($this->toEmail, $this->bcc_emails); // remove $this->toEmail 
            $finalBccList = array_diff($initialBccList, $uniqueCcList); // remove cc emails from bcc 
            // PURPOSE : Preventing sending emails again and again
            if (!empty($finalBccList)) {
                $message->bcc($finalBccList);
            }
        }

        return $message ; 
    }
}
