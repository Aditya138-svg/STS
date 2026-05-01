<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Auth;

class LogActivity extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'subject', 'url', 'method', 'ip', 'agent', 'users_id', 'entity_id',  'type', 'active', 'created_at', 'updated_at'
    ];


	/**
     * To get order log activities list detailed information
     * @var $id (optional), int $users_id (optional)
     * @author Sandeep Rawat
     */
	public function get_log_activities_list($id = NULL, $users_id = NULL, $filter_arr = array()){
		//get all orders ids based on zipcode session selected
		$locations_id= '';
		if(!empty($filter_arr['locations_id'])){
			$locations_id= $filter_arr['locations_id'];
		}
		// Get the relevant order IDs based on the warehouse location
        $orderIds = getOrderIdsByWarehouseLocation();
		//get all orders ids based on zipcode session selected close
		if(empty($id)){ //For listing

			$query = DB::table('log_activities')
					// ->leftJoin('orders', 'order_notes.orders_id', '=', 'orders.id')
					->leftJoin('users', 'log_activities.users_id', '=', 'users.id')
					->select(DB::raw('log_activities.*, log_activities.id AS lg_id, users.name AS user_name,
						COALESCE(log_activities.entity_id,"") AS entity_id_formatted,
						CONCAT( "<span class=\"fw700\">", DATE_FORMAT(log_activities.created_at, "On %m/%d/%Y %h:%i %p"),"</span>, ", log_activities.subject, "<span class=\"fw700\">", users.name, "</span>" ) AS log_text,
						DATE_FORMAT(log_activities.created_at, "On %m/%d/%Y %h:%i %p") AS created_at_formatted,
						DATE_FORMAT(log_activities.updated_at, "On %m/%d/%Y %h:%i %p") AS updated_at_formatted'));


			$filter_by_status = '';
			// return json_encode($filter_arr);
			if(!empty($filter_arr['filter_by_status'])){
				$filter_by_status = $filter_arr['filter_by_status'];
			}

			if(!empty($filter_arr['depot_id'])){
				$depot_id = $filter_arr['depot_id'];
                $sch_date = $filter_arr['sch_date'];
				$new_depot_id = str_replace('-','',$filter_arr['sch_date']).$filter_arr['depot_id'];
                if(!empty($sch_date))
                {
                    $query->where(DB::raw(' entity_id="'.$new_depot_id.'||'.$depot_id.'" OR  entity_id="||'.$depot_id.'" '));
                }
                else
                {
                    $query->where(DB::raw('entity_id="||'.$depot_id.'" '));
                }
            }
			$entity_id = '';
			if(!empty($filter_arr['entity_id'])){
				$entity_id = $filter_arr['entity_id'];
			}

			if(!empty($filter_by_status)){
				$query->where('log_activities.type', '=', $filter_by_status);
				switch ($filter_by_status) {
					case config('constants.LOG.ORDER'):
                        if(!empty($orderIds)){
                            $query->whereIn('log_activities.entity_id', $orderIds); // Filter by order IDs
                        }
						break;
				}
			}
			if(!empty($entity_id)){
				$query->where('log_activities.entity_id', '=', $entity_id);
			}
			if(!empty($users_id)){
				$query->where('log_activities.users_id', '=', $users_id);
			}

			if(!empty($filter_arr)){


				$search_val = $filter_arr['search_val'];
				$havingStr = '';
				if(!empty($search_val)){ //search by keyword
					$havingStr = '	(
									log_text like "%' . $search_val . '%" OR
									entity_id_formatted like "%' . $search_val . '%" OR
									log_activities.type like "%' . $search_val . '%" OR
									log_activities.subject like "%' . $search_val . '%" OR
									user_name like "%' . $search_val . '%" OR
									created_at_formatted like "%' . $search_val . '%"
									)
								';
				}

				if($filter_by_status != ''){
					if(empty($havingStr)){
						$havingStr .= ' ( log_activities.type = "' . $filter_by_status . '" ) ';
					}
					else{
						$havingStr .= ' AND ( log_activities.type = "' . $filter_by_status . '" ) ';
					}
				}

				if(!empty($havingStr)){
					$query->havingRaw($havingStr);
				}

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
							$query->orderBy($sort_column, $sort_by);
						}
					}
					else{
						$query->orderBy('log_activities.id','desc');
					}
					//sort close
				}

			}

			$result = $query->get();
			// $result = $query->toSql(); // To print query in string format
			// return $result;
			if($result->count() == 0){
				$result = FALSE;
			}

		}
		else{ //For single record
			$query = DB::table('log_activities')
					->leftJoin('users', 'log_activities.users_id', '=', 'users.id')
					->select(DB::raw('log_activities.*, log_activities.id AS lg_id, users.name AS user_name,
						COALESCE(log_activities.entity_id,"") AS entity_id_formatted,
						DATE_FORMAT(log_activities.created_at, "%m/%d/%Y %h:%i %p") AS created_at_formatted,
						DATE_FORMAT(log_activities.updated_at, "%m/%d/%Y %h:%i %p") AS updated_at_formatted'));

			if(!empty($users_id)){
				$query->where('log_activities.users_id', '=', $users_id);
			}

			$result = $query->where('log_activities.id', '=', $id )
					->first();
		}
		return $result;
	}

}
