<?php

namespace App\Listeners;
use Auth;

class UserEventSubscriber
{
    /**
     * Handle user login events.
     */
    public function onUserLogin($event) {
        
        $type = config('constants.LOG.LOGIN');
        $data = array(
            'subject'   => 'login by',
            'users_id'  => Auth::user()->id,
        );
        \LogActivity::addToLog($data, $type);

    }

    /**
     * Handle user logout events.
     */
    public function onUserLogout($event) {
        
        //Deleting laravel_session cookie from storage/framework/sessions folder
        $laravel_session = $_COOKIE[config('session.cookie')];
        if(!empty($laravel_session)){
            $file_name = storage_path('framework/sessions').'/'.$laravel_session;
            if (file_exists($file_name)) { // Exist
                echo '<br>exist';
                unlink($file_name);
            }
        }
        //Deleting laravel_session cookie from storage/framework/sessions folder close

        $type = config('constants.LOG.LOGOUT');
        $data = array(
            'subject'   => 'logout by',
            'users_id'  => Auth::user()->id,
        );
        \LogActivity::addToLog($data, $type);
        // session()->getHandler()->destroy();
    }

    /**
     * Register the listeners for the subscriber.
     *
     * @param  Illuminate\Events\Dispatcher  $events
     */
    public function subscribe($events)
    {
        $events->listen(
            'Illuminate\Auth\Events\Login',
            'App\Listeners\UserEventSubscriber@onUserLogin'
        );

        $events->listen(
            'Illuminate\Auth\Events\Logout',
            'App\Listeners\UserEventSubscriber@onUserLogout'
        );
    }

}