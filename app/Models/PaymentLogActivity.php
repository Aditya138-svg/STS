<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Auth;

class PaymentLogActivity extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'payment_log_activity';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'users_id', 'orders_id', 'collection_notes', 'created_at', 'updated_at', 'type'
    ];


	/**
     * To get list of user_addresses sub query
     * @var int $id (optional), array $filter_arr (optional)
     * @author Tushar Riyat
     */
	public function get_payment_log_subquery($id = NULL, $filter_arr = array() ){

		if(empty($id)){ //For listing
			// DB::table($this->table. ' AS pla');
			$query = DB::table($this->table.' AS pla')
						->select(DB::raw('pla.*'));

			if(!empty($filter_arr)){
				if(array_key_exists('orders_id',$filter_arr)){
					$query->where('pla.orders_id', '=', $filter_arr['orders_id']);
				}
				if(array_key_exists('users_id',$filter_arr)){
					$query->where('pla.users_id', '=', $filter_arr['users_id']);
				}
				//search keyword
				if(array_key_exists('search_val', $filter_arr)){
                    $search_val = $filter_arr['search_val'];
                    if(!empty($search_val)){
						$query->where(function($qry) use ($search_val) {
							$qry->where('pla.collection_notes', 'like', '%'.$search_val.'%');
						});
                    }
                }
				//search keyword close
				if(array_key_exists('recordsFiltered', $filter_arr)){
					if($filter_arr['recordsFiltered'] === FALSE){
						//offset
						$offset = $filter_arr['offset'];
						if(!empty($offset)){
							$query->offset($offset);
						}
						//offset close
						//limit
						$limit = $filter_arr['limit'];
						if(!empty($limit)){
							$query->limit($limit);
						}
						//limit close
						//sort
						$sort = $filter_arr['sort'];
						if(!empty($sort)){
							$sort_column = !empty($sort['sort_column'])?$sort['sort_column']:'';
							$sort_by 	 = !empty($sort['sort_by'])?$sort['sort_by']:'';

							if( !empty($sort_column) && !empty($sort_by) ){
								if($sort_column == 'created_at_formatted')
									$query->orderBy('created_at', $sort_by);
								else
									$query->orderBy($sort_column, $sort_by);
							}
						} else {
							$query->orderBy('pla.id','desc');
						}
						//sort close
					}
				}
			}

			$result = $query;
		}
		else{ //For single record
			$query = DB::table('pla')
					->select(DB::raw('pla.*, DATE_FORMAT(pla.created_at, "%m/%d/%Y %h:%i %p") AS created_at_formatted'));
			$result = $query->where('pla.id', '=', $id );
		}
		return $result;
	}
	/**
     * To get order log activities list detailed information
     * @var $id (optional), int $users_id (optional)
     * @author Tushar Riyat
     */
	public function get_opt_payment_log_list($id = NULL,$filter_arr = array())
	{
		$sub_query = $this->get_payment_log_subquery($id,$filter_arr);
		if(empty($id)) {
			$result = $sub_query->get();
			// $result = $this->prepare_enrol_list($result);
		} else {
			$result = $sub_query->first();
			// $result = $this->prepare_enrol_row($result);
		}
		return $result;
	}

	/**
     * To get count of group
     * @var int $id (optional), array $filter_arr (optional)
     * @author Tushar Riyat
     */
	public function get_opt_logs_filtered_count($id = NULL, $filter_arr = array())
	{
		if(empty($id)){ //For listing
			$sub_query = $this->get_payment_log_subquery($id,$filter_arr);

			$count = DB::table($sub_query, 'ord')->count();
		return $count;
		}

	}

}
