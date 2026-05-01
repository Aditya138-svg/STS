<?php

namespace App\Helpers;
use Request;
use App\Model\LogActivity as LogActivityModel;
use App\Model\PaymentLogActivity as PaymentLogActivityModel;
use App\Model\Orders;

class LogActivity
{

    public static function addToLog($data = NULL, $type = NULL)
    {
        if(empty($data) || !is_array($data) || empty($type)){
            return FALSE;
        }

    	$log = [];
    	$log['subject']    = $data['subject'];
    	$log['url']        = Request::fullUrl();
    	$log['method']     = Request::method();
    	$log['ip']         = Request::ip();
    	$log['agent']      = Request::header('user-agent');
    	$log['users_id']   = $data['users_id'];
        if(!empty($data['entity_id'])){
            $log['entity_id']  = $data['entity_id'];
        }
        // $log['entity_id']  = !empty($data['entity_id'])?$data['entity_id']:0;
        $log['type']       = $type;
        $log['active']     = config('constants.ACTIVE');
        $log['created_at'] = date('Y-m-d H:i:s');
        $log['updated_at'] = date('Y-m-d H:i:s');
        // dd($log);
        // $id = DB::table('log_activities')
        //             ->insertGetId( $log );
    	LogActivityModel::create($log);
    }
    public static function addToPaymentLog($data = NULL, $type = NULL)
    {  
        if(empty($data) || !is_array($data)  || (!key_exists('orders_id', $data))){
            return FALSE;
        }
    	$log = [];
        $Order = Orders::find($data['orders_id']);
        if($Order){
            $Order->latest_payment_log = $data['collection_notes'];
            $Order->last_cc_log = $data['last_cc_log'] ?? null;
            $Order->order_total = $data['order_total'] ?? 0;

            $log['collection_notes']    = $data['collection_notes'];
            $log['orders_id']  = $data['orders_id'];
            $log['users_id']   = $data['users_id'];
            $log['type']       = $type;
            $log['created_at'] = date('Y-m-d H:i:s');
            $log['updated_at'] = date('Y-m-d H:i:s');
            PaymentLogActivityModel::create($log);
            $Order->save();
        } else {
            return FALSE;
        }
    }

    public static function logActivityLists()
    {
    	return LogActivityModel::latest()->get();
    }

}