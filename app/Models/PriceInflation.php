<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Auth;

class PriceInflation extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'price_inflation';
	
	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['inflation', 'code', 'wef', 'active', 'tiers_id'];
	
	/**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];
	
	/**
     * To create/edit price_inflation
     * @var array $data int $id (optional)
     * @author Sandeep Rawat
     */
	public function store($data=NULL, $id=NULL){
		
		
		if(empty($data)){
			return FALSE;
		}
		
		if(empty($id)){ //Creating quote
			$last_id = DB::table('price_inflation')->insertGetId(
				$data
			);
			return $last_id;
		}
		else{ //Editing quote
			
			if(DB::table('price_inflation')->where('id', $id)->update($data)){
				return $id;
			}
			return FALSE;
		}
	}
	/**
     * To get total orders attention count 
     * @var array $filter_arr
     * @author Ajish Kalia
     */
	public function prepare_inflation_row($row)
	{
        if(!empty($row)){
				$row->wef_formatted=date('m/d/Y',strtotime($row->wef));
				$row->created_at_formatted=date('m/d/Y h:i A',strtotime($row->created_at));
				$row->updated_at_formatted=date('m/d/Y h:i A',strtotime($row->updated_at));
				$row= $row;
		}
        return $row;
	}
	/**
     * To get total orders attention count 
     * @var array $filter_arr
     * @author Ajish Kalia
     */
	public function prepare_inflation_list($list=array())
	{
		$processed_data = array();
        if(!empty($list)){
        	if(is_array($list->toArray())){
	            foreach ($list as $row) {
					$row->wef_formatted=date('m/d/Y',strtotime($row->wef));
					$row->created_at_formatted=date('m/d/Y h:i A',strtotime($row->created_at));
					$row->updated_at_formatted=date('m/d/Y h:i A',strtotime($row->updated_at));
					$processed_data[] = $row;
	            }
	        }
        }
        return $processed_data;
	}
	/**
     * To get optimized zipcode List 
     * @var array $filter_arr
     * @author Ajish Kalia
     */
	public function get_opt_prepare_inflation_list($id = NULL, $tiers_id = NULL, $filter_arr = array())
	{
		if(empty($id))
		{
			$sub_query = $this->get_prepare_inflation_details_subquery($id, $tiers_id, $filter_arr);
			$result = $sub_query->get();
			if($result->count() == 0){
				$result = FALSE;
			}
			else{
				$result = $this->prepare_inflation_list($result);
			}
		}
		else
		{
			$sub_query = $this->get_prepare_inflation_details_subquery($id, $tiers_id, $filter_arr);
			$result = $sub_query->first();
			if($sub_query->count() == 0){
				$result = FALSE;
			}
			else{
				$result = $this->prepare_inflation_row($result);
			}
		}
		return $result;
	}
	/**
     * To get filtered zipcodes list count 
     * @var $id (optional), int $users_id, date $sch_date, array $filter_arr, array $exclude_orders
     * @author Ajish Kalia
     */
	public function get_opt_prepare_inflation_list_count($id = NULL, $tiers_id = NULL, $filter_arr = array()){
		$count = 0;
		if(empty($id)){ //For listing
			$sub_query = $this->get_prepare_inflation_details_subquery($id, $tiers_id, $filter_arr);
			$count=DB::table('price_inflation AS zips')
				        ->joinSub($sub_query, 'sub_query', function ($join) {
				            $join->on('zips.id', '=', 'sub_query.z_id');
				        })
				        ->count();
		}
		return $count;
	}
	/**
     * To get zipcodes detailed information
     * @var $id (optional), int $session_location, array $filter_arr
     * @author Ajish Kalia
     */
	public function get_prepare_inflation_details_subquery($id = NULL, $tiers_id = NULL, $filter_arr = array()){
		
		if(empty($id)){ //For listing
			$query = DB::table('price_inflation')
					->leftJoin('tiers', 'tiers.id', '=', 'price_inflation.tiers_id')
					->select(DB::raw('price_inflation.*, tiers.tier_name, tiers.tier_type, tiers.active, tiers.is_inflation_applied'));
			if(!empty($tiers_id)){
				$query->where('price_inflation.tiers_id', $tiers_id);
			}
			$query->where('price_inflation.active', config('constants.ACTIVE'));
			$query->groupBy('price_inflation.id');
			if(!empty($filter_arr)){

				$search_val = $filter_arr['search_val'];
				if(!empty($search_val)){ //search keyword
									// price_inflation.prepare_inflation_associate_with like "%' . $search_val . '%" OR 
					$havingStr = '	price_inflation.inflation like "%' . $search_val . '%" OR 
									price_inflation.code like "%' . $search_val . '%"
								';
					$query->havingRaw($havingStr);
				} //search keyword close
				if(!empty($filter_arr['filter_conflict_wrt_price_inflation']))
				{
					$query->whereNull('price_inflation.tiers_id');
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
							if($sort_column == 'created_at_formatted')
								$query->orderBy('price_inflation.created_at', $sort_by);
							else
							{
								$query->orderBy($sort_column, $sort_by);
							}
								
						}
					}
					else{
						$query->orderBy('id','desc');
					}
					//sort close
				}
				
			}
			$result = $query;
		}
		else{ //For single record
			$query = DB::table('price_inflation')
					->leftJoin('tiers', 'tiers.id', '=', 'price_inflation.tiers_id')
					->select(DB::raw('price_inflation.*, tiers.tier_name, tiers.tier_type, tiers.active, tiers.is_inflation_applied'));
			if(!empty($tiers_id)){
				$query->where('price_inflation.tiers_id', $tiers_id);
			}
			$query->where('price_inflation.active', config('constants.ACTIVE'));
			$result = $query->where('price_inflation.id', '=', $id );
		}
		return $result;
	}

	/**
     * To create/edit tiers
     * @var array $data int $id (optional)
     * @author Sandeep Rawat
     */
	public function store_price_inflation($data=NULL, $id=NULL){
		
		
		if(empty($data)){
			return FALSE;
		}
		
		if(empty($id)){ //Creating price_inflation
			$last_id = DB::table('price_inflation')->insertGetId(
				$data
			);
			return $last_id;
		}
		else{ //Editing price_inflation
			
			if(DB::table('price_inflation')->where('id', $id)->update($data)){
				return $id;
			}
			return FALSE;
		}
	}
}
