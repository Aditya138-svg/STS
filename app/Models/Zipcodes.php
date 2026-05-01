<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Auth;

class Zipcodes extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'zipcodes_management';
	
	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['zipcode', 'zipcode_associate_with', 'city', 'state', 'latitude', 'longitude', 'timezone', 'DST', 'tier', 'quote_only', 'market', 'DST', 'tiers_id'];
	
	/**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];
	
	/**
     * To create/edit zipcodes_management
     * @var array $data int $id (optional)
     * @author Sandeep Rawat
     */
	public function store($data=NULL, $id=NULL){
		
		
		if(empty($data)){
			return FALSE;
		}
		
		if(empty($id)){ //Creating quote
			$last_id = DB::table('zipcodes_management')->insertGetId(
				$data
			);
			return $last_id;
		}
		else{ //Editing quote
			
			if(DB::table('zipcodes_management')->where('id', $id)->update($data)){
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
	public function prepare_zipcode_row($row)
	{
        if(!empty($row)){
        	// if(is_array($row->toArray())){
				$row->tier_type_formatted = "";
        		if(!empty($row->tier_type)){
	        		switch ($row->tier_type) {
	        			case config('constants.TIER_TYPE.SERVICE'):
	        				$row->tier_type_formatted = config('constants.REVERSAL_TIER_TYPE')[config('constants.TIER_TYPE.SERVICE')];
	        				break;
	        			
	        			case config('constants.TIER_TYPE.NO_SERVICE'):
	        				$row->tier_type_formatted = config('constants.REVERSAL_TIER_TYPE')[config('constants.TIER_TYPE.NO_SERVICE')];
	        				break;
	        			
	        			case config('constants.TIER_TYPE.QUOTE_ONLY'):
	        				$row->tier_type_formatted = config('constants.REVERSAL_TIER_TYPE')[config('constants.TIER_TYPE.QUOTE_ONLY')];
	        				break;
	        			
	        			default:
	        				$row->tier_type_formatted = "";
	        				break;
	        		}
	        	}
				$row->created_at_formatted=date('m/d/Y h:i A',strtotime($row->created_at));
				$row->updated_at_formatted=date('m/d/Y h:i A',strtotime($row->updated_at));
				$row= $row;
			// }
		}
        return $row;
	}
	/**
     * To get total orders attention count 
     * @var array $filter_arr
     * @author Ajish Kalia
     */
	public function prepare_zipcode_list($list=array())
	{
		$processed_data = array();
        if(!empty($list)){
        	if(is_array($list->toArray())){
	            foreach ($list as $row) {
					//Days
					$serviceable_days_arr = array();
					if($row->monday=="1")
					{
						$row->monday_formatted="Monday";
						$serviceable_days_arr[]="Monday";
					}
					else
					{
						$row->monday_formatted="";
					}
					if($row->tuesday=="1")
					{
						$row->tuesday_formatted="Tuesday";
						$serviceable_days_arr[]="Tuesday";
					}
					else
					{
						$row->tuesday_formatted="";
					}
					if($row->wednesday=="1")
					{
						$row->wednesday_formatted="Wednesday";
						$serviceable_days_arr[]="Wednesday";
					}
					else
					{
						$row->wednesday_formatted="";
					}
					if($row->thursday=="1")
					{
						$row->thursday_formatted="Thursday";
						$serviceable_days_arr[]="Thursday";
					}
					else
					{
						$row->thursday_formatted="";
					}
					if($row->friday=="1")
					{
						$row->friday_formatted="Friday";
						$serviceable_days_arr[]="Friday";
					}
					else
					{
						$row->friday_formatted="";
					}
					if($row->saturday=="1")
					{
						$row->saturday_formatted="Saturday";
						$serviceable_days_arr[]="Saturday";
					}
					else
					{
						$row->saturday_formatted="";
					}
					if($row->sunday=="1")
					{
						$row->sunday_formatted="Sunday";
						$serviceable_days_arr[]="Sunday";
					}
					else
					{
						$row->sunday_formatted="";
					}
					$row->serviceable_days=str_replace(" ","",$row->monday_formatted." ".$row->tuesday_formatted." ".$row->wednesday_formatted." ".$row->thursday_formatted." ".$row->friday_formatted." ".$row->saturday_formatted." ".$row->sunday_formatted);
					$row->tier_type_formatted = "";
					if(!empty($row->tier_type)){
		        		switch ($row->tier_type) {
		        			case config('constants.TIER_TYPE.SERVICE'):
		        				$row->tier_type_formatted = config('constants.REVERSAL_TIER_TYPE')[config('constants.TIER_TYPE.SERVICE')];
		        				break;
		        			
		        			case config('constants.TIER_TYPE.NO_SERVICE'):
		        				$row->tier_type_formatted = config('constants.REVERSAL_TIER_TYPE')[config('constants.TIER_TYPE.NO_SERVICE')];
		        				break;
		        			
		        			case config('constants.TIER_TYPE.QUOTE_ONLY'):
		        				$row->tier_type_formatted = config('constants.REVERSAL_TIER_TYPE')[config('constants.TIER_TYPE.QUOTE_ONLY')];
		        				break;
		        			
		        			default:
		        				$row->tier_type_formatted = "";
		        				break;
		        		}
		        	}
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
	public function get_opt_zipcode_list($id = NULL, $session_location = NULL, $filter_arr = array())
	{
		if(empty($id))
		{
			$sub_query = $this->get_zipcode_details_subquery($id,$session_location, $filter_arr);
			$result = $sub_query->get();
			if($result->count() == 0){
				$result = FALSE;
			}
			else{
				$result = $this->prepare_zipcode_list($result);
			}
		}
		else
		{
			$sub_query = $this->get_zipcode_details_subquery($id,$session_location, $filter_arr);
			$result = $sub_query->first();
			if($sub_query->count() == 0){
				$result = FALSE;
			}
			else{
				$result = $this->prepare_zipcode_row($result);
			}
		}
		return $result;
	}
	/**
     * To get filtered zipcodes list count 
     * @var $id (optional), int $users_id, date $sch_date, array $filter_arr, array $exclude_orders
     * @author Ajish Kalia
     */
	public function get_opt_zipcode_list_count($id = NULL, $session_location = NULL, $filter_arr = array()){
		$count = 0;
		if(empty($id)){ //For listing
			$sub_query = $this->get_zipcode_details_subquery($id,$session_location,$filter_arr);
			$count=DB::table('zipcodes_management AS zips')
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
	public function get_zipcode_details_subquery($id = NULL, $session_location = NULL, $filter_arr = array()){
		
		if(empty($id)){ //For listing
			$query = DB::table('zipcodes_management')
					->leftJoin('schedule_settings', 'schedule_settings.id', '=', 'zipcodes_management.schedule_settings_id')
					->leftJoin('address_books AS depot', function ($join) {
			            $join->on('zipcodes_management.locations_id', '=', 'depot.id')
			                 ->where('depot.address_type', '=', config('constants.ADDRESS_TYPE.DEPOT'));
			        })
					->leftJoin('tiers', 'tiers.id', '=', 'zipcodes_management.tiers_id')
					// ->leftJoin('address_books AS depot', 'depot.id', '=', 'zipcodes_management.locations_id')
					->select(DB::raw('zipcodes_management.zipcode, zipcodes_management.zipcode_associate_with, zipcodes_management.schedule_settings_id, zipcodes_management.city, zipcodes_management.state, zipcodes_management.latitude, zipcodes_management.longitude, zipcodes_management.timezone, zipcodes_management.DST, zipcodes_management.tier, zipcodes_management.quote_only, zipcodes_management.market, zipcodes_management.created_at, zipcodes_management.updated_at, zipcodes_management.id AS z_id, schedule_settings.id, schedule_settings.depot_id, schedule_settings.loc_name, schedule_settings.monday, schedule_settings.tuesday, schedule_settings.wednesday, schedule_settings.thursday, schedule_settings.friday, schedule_settings.saturday, schedule_settings.sunday, schedule_settings.needed, schedule_settings.gmap_area, COALESCE(CONCAT("'.config('constants.MODULE_INITIALS.RECEIVER').'", depot.short_code),"") AS zipcode_associate_with_formatted,
						depot.short_code, depot.terminal_name, depot.terminal_name AS terminal_formatted, zipcodes_management.locations_id,
						zipcodes_management.locations_id as warehouse_id_formatted, zipcodes_management.tiers_id, tiers.tier_name, tiers.tier_type'));
					
			if(!empty($session_location)){
				// $query->where('zipcodes_management.zipcode_associate_with', $session_location);
				$query->where('zipcodes_management.locations_id', $session_location);
			}
			if(!empty($filter_arr['filter_by_territory'])){
				$query->where('schedule_settings.id', $filter_arr['filter_by_territory']);
			}
			
			$query->groupBy('zipcodes_management.id');
			if(!empty($filter_arr)){

				$search_val = $filter_arr['search_val'];
				if(!empty($search_val)){ //search keyword
									// zipcodes_management.zipcode_associate_with like "%' . $search_val . '%" OR 
					$havingStr = '	zipcodes_management.zipcode like "%' . $search_val . '%" OR 
									schedule_settings.loc_name like "%' . $search_val . '%" OR 
									tiers.tier_name like "%' . $search_val . '%" OR 
									zipcode_associate_with like "%' . $search_val . '%"   
								';
					$query->havingRaw($havingStr);
				} //search keyword close
				if(!empty($filter_arr['filter_by_area']))
				{
					$query->where('zipcodes_management.zipcode_associate_with','=',$filter_arr['filter_by_area']);
				}
				if(!empty($filter_arr['filter_by_day']))
				{
					$day=$filter_arr['filter_by_day'];
					if($day=="monday")
					{
						$query->where('schedule_settings.monday','=',1);
					}
					if($day=="tuesday")
					{
						$query->where('schedule_settings.tuesday','=',1);
					}
					if($day=="wednesday")
					{
						$query->where('schedule_settings.wednesday','=',1);
					}
					if($day=="thursday")
					{
						$query->where('schedule_settings.thursday','=',1);
					}
					if($day=="friday")
					{
						$query->where('schedule_settings.friday','=',1);
					}
					if($day=="saturday")
					{
						$query->where('schedule_settings.saturday','=',1);
					}
					if($day=="sunday")
					{
						$query->where('schedule_settings.sunday','=',1);
					}
				}
				if(!empty($filter_arr['filter_conflict_wrt_tier']))
				{
					$query->whereNull('zipcodes_management.tiers_id');
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
								$query->orderBy('zipcodes_management.created_at', $sort_by);
							else
							{
								if($sort_column=='serviceable_days'){
									$query->orderByRaw('(monday*64)+(tuesday*32)+(wednesday*16)+(thursday*8)+(friday*4)+(saturday*2)+(sunday) '.$sort_by);
								}else if($sort_column == 'zipcodes_management.zipcode'){
									$query->orderByRaw('CAST(zipcodes_management.zipcode AS UNSIGNED) '. $sort_by);
								}else
								{
									$query->orderBy($sort_column, $sort_by);
								}
							}
								
						}
					}
					else{
						$query->orderBy('z_id','desc');
					}
					//sort close
				}
				
			}
			$result = $query;
		}
		else{ //For single record
			$query = DB::table('zipcodes_management')
					->leftJoin('schedule_settings', 'schedule_settings.id', '=', 'zipcodes_management.schedule_settings_id')
					->leftJoin('address_books AS depot', function ($join) {
			            $join->on('zipcodes_management.locations_id', '=', 'depot.id')
			                 ->where('depot.address_type', '=', config('constants.ADDRESS_TYPE.DEPOT'));
			        })
					->leftJoin('tiers', 'tiers.id', '=', 'zipcodes_management.tiers_id')
					->select(DB::raw('zipcodes_management.zipcode,zipcodes_management.zipcode_associate_with,zipcodes_management.schedule_settings_id, zipcodes_management.city,zipcodes_management.state,zipcodes_management.latitude,zipcodes_management.longitude,zipcodes_management.timezone,zipcodes_management.DST,zipcodes_management.tier,zipcodes_management.quote_only,zipcodes_management.market,zipcodes_management.created_at, zipcodes_management.updated_at,zipcodes_management.id AS z_id,schedule_settings.id,schedule_settings.depot_id,schedule_settings.loc_name, schedule_settings.monday,schedule_settings.tuesday,schedule_settings.wednesday,schedule_settings.thursday,schedule_settings.friday, schedule_settings.saturday,schedule_settings.sunday,schedule_settings.needed,schedule_settings.gmap_area, COALESCE(CONCAT("'.config('constants.MODULE_INITIALS.RECEIVER').'", depot.short_code),"") AS zipcode_associate_with_formatted,
						depot.short_code, depot.terminal_name, depot.terminal_name AS terminal_formatted, zipcodes_management.locations_id,
						zipcodes_management.locations_id as warehouse_id_formatted, zipcodes_management.tiers_id, tiers.tier_name, tiers.tier_type'));
			
			if(!empty($session_location)){
				// $query->where('zipcodes_management.session_location', $session_location);
				$query->where('zipcodes_management.locations_id', $session_location);
			}
			
			$result = $query->where('zipcodes_management.id', '=', $id );
		}
		return $result;
	}
	public function get_zipcode_details_subquery_2020_12_07($id = NULL, $session_location = NULL, $filter_arr = array()){
		if(empty($id)){ //For listing
			$query = DB::table('zipcodes_management')
					->leftJoin('schedule_settings', 'schedule_settings.id', '=', 'zipcodes_management.schedule_settings_id')
					->select(DB::raw('zipcodes_management.zipcode,zipcodes_management.zipcode_associate_with,zipcodes_management.schedule_settings_id, zipcodes_management.city,zipcodes_management.state,zipcodes_management.latitude,zipcodes_management.longitude,zipcodes_management.timezone,zipcodes_management.DST,zipcodes_management.tier,zipcodes_management.quote_only,zipcodes_management.market,zipcodes_management.created_at, zipcodes_management.updated_at,zipcodes_management.id AS z_id,schedule_settings.id,schedule_settings.depot_id,schedule_settings.loc_name, schedule_settings.monday,schedule_settings.tuesday,schedule_settings.wednesday,schedule_settings.thursday,schedule_settings.friday, schedule_settings.saturday,schedule_settings.sunday,schedule_settings.needed,schedule_settings.gmap_area'));
					
			if(!empty($session_location)){
				$query->where('zipcodes_management.zipcode_associate_with', $session_location);
			}
			
			$query->groupBy('zipcodes_management.id');
			if(!empty($filter_arr)){

				$search_val = $filter_arr['search_val'];
				if(!empty($search_val)){ //search keyword
									// zipcodes_management.zipcode_associate_with like "%' . $search_val . '%" OR 
					$havingStr = '	zipcodes_management.zipcode like "%' . $search_val . '%" OR 
									schedule_settings.loc_name like "%' . $search_val . '%" OR 
									zipcode_associate_with like "%' . $search_val . '%"   
								';
					$query->havingRaw($havingStr);
				} //search keyword close
				if(!empty($filter_arr['filter_by_area']))
				{
					$query->where('zipcodes_management.zipcode_associate_with','=',$filter_arr['filter_by_area']);
				}
				if(!empty($filter_arr['filter_by_day']))
				{
					$day=$filter_arr['filter_by_day'];
					if($day=="monday")
					{
						$query->where('schedule_settings.monday','=',1);
					}
					if($day=="tuesday")
					{
						$query->where('schedule_settings.tuesday','=',1);
					}
					if($day=="wednesday")
					{
						$query->where('schedule_settings.wednesday','=',1);
					}
					if($day=="thursday")
					{
						$query->where('schedule_settings.thursday','=',1);
					}
					if($day=="friday")
					{
						$query->where('schedule_settings.friday','=',1);
					}
					if($day=="saturday")
					{
						$query->where('schedule_settings.saturday','=',1);
					}
					if($day=="sunday")
					{
						$query->where('schedule_settings.sunday','=',1);
					}
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
								$query->orderBy('zipcodes_management.created_at', $sort_by);
							else
							{
								if($sort_column=='serviceable_days')
								{
									$query->orderByRaw('(monday*64)+(tuesday*32)+(wednesday*16)+(thursday*8)+(friday*4)+(saturday*2)+(sunday) '.$sort_by);
								}
								else
								{
									$query->orderBy($sort_column, $sort_by);
								}
							}
								
						}
					}
					else{
						$query->orderBy('z_id','desc');
					}
					//sort close
				}
				
			}
			$result = $query;
		}
		else{ //For single record
			$query = DB::table('zipcodes_management')
					->leftJoin('schedule_settings', 'schedule_settings.id', '=', 'zipcodes_management.schedule_settings_id')
					->select(DB::raw('zipcodes_management.zipcode,zipcodes_management.zipcode_associate_with,zipcodes_management.schedule_settings_id, zipcodes_management.city,zipcodes_management.state,zipcodes_management.latitude,zipcodes_management.longitude,zipcodes_management.timezone,zipcodes_management.DST,zipcodes_management.tier,zipcodes_management.quote_only,zipcodes_management.market,zipcodes_management.created_at, zipcodes_management.updated_at,zipcodes_management.id AS z_id,schedule_settings.id,schedule_settings.depot_id,schedule_settings.loc_name, schedule_settings.monday,schedule_settings.tuesday,schedule_settings.wednesday,schedule_settings.thursday,schedule_settings.friday, schedule_settings.saturday,schedule_settings.sunday,schedule_settings.needed,schedule_settings.gmap_area'));
			
			if(!empty($session_location)){
				$query->where('zipcodes_management.session_location', $session_location);
			}
			
			$result = $query->where('zipcodes_management.id', '=', $id );
		}
		return $result;
	}

	/**
     * To get zipcodes detailed information
     * @var $id (optional), int $session_location, array $filter_arr
     * @author Sandeep Rawat
     */
	public function get_zipcode_details($id = NULL, $session_location = NULL, $filter_arr = array()){
		
		if(empty($id)){ //For listing
			
			$query = DB::table('zipcodes_management')
					->leftJoin('schedule_settings', 'schedule_settings.id', '=', 'zipcodes_management.schedule_settings_id')
					->leftJoin('address_books AS depot', function ($join) {
			            $join->on('zipcodes_management.locations_id', '=', 'depot.id')
			                 ->where('depot.address_type', '=', config('constants.ADDRESS_TYPE.DEPOT'));
			        })
			        ->select(DB::raw('zipcodes_management.*, zipcodes_management.id AS z_id, schedule_settings.*, 
						COALESCE(CONCAT("'.config('constants.MODULE_INITIALS.RECEIVER').'", depot.short_code),"") AS zipcode_associate_with_formatted,
						depot.short_code, depot.terminal_name, depot.terminal_name AS terminal_formatted, zipcodes_management.locations_id,
						zipcodes_management.locations_id as warehouse_id_formatted,
						IF(schedule_settings.monday="1", "Monday", "") AS monday_formatted,
						IF(schedule_settings.tuesday="1", "Tuesday", "") AS tuesday_formatted,
						IF(schedule_settings.wednesday="1", "Wednesday", "") AS wednesday_formatted,
						IF(schedule_settings.thursday="1", "Thursday", "") AS thursday_formatted,
						IF(schedule_settings.friday="1", "Friday", "") AS friday_formatted,
						IF(schedule_settings.saturday="1", "Saturday", "") AS saturday_formatted,
						IF(schedule_settings.sunday="1", "Sunday", "") AS sunday_formatted,
						REPLACE(CONCAT(
							IF(schedule_settings.monday="1", "Monday", "")," ",
							IF(schedule_settings.tuesday="1", "Tuesday", "")," ",
							IF(schedule_settings.wednesday="1", "Wednesday", "")," ",
							IF(schedule_settings.thursday="1", "Thursday", "")," ",
							IF(schedule_settings.friday="1", "Friday", "")," ",
							IF(schedule_settings.saturday="1", "Saturday", "")," ",
							IF(schedule_settings.sunday="1", "Sunday", "")," "
						),"  "," ") AS serviceable_days,
						DATE_FORMAT(zipcodes_management.created_at, "%m/%d/%Y %h:%i %p") AS created_at_formatted, 
						DATE_FORMAT(zipcodes_management.updated_at, "%m/%d/%Y %h:%i %p") AS updated_at_formatted'));
					
			if(!empty($session_location)){
				// $query->where('zipcodes_management.zipcode_associate_with', $session_location);
				$query->where('zipcodes_management.locations_id', $session_location);
			}
			
			$query->groupBy('zipcodes_management.id');
			if(!empty($filter_arr)){

				$search_val = $filter_arr['search_val'];
				if(!empty($search_val)){ //search keyword
									// zipcodes_management.zipcode_associate_with like "%' . $search_val . '%" OR 
					$havingStr = '	zipcodes_management.zipcode like "%' . $search_val . '%" OR 
									schedule_settings.loc_name like "%' . $search_val . '%" OR 
									monday_formatted like "%' . $search_val . '%" OR 
									tuesday_formatted like "%' . $search_val . '%" OR 
									wednesday_formatted like "%' . $search_val . '%" OR 
									thursday_formatted like "%' . $search_val . '%" OR 
									friday_formatted like "%' . $search_val . '%" OR 
									saturday_formatted like "%' . $search_val . '%" OR 
									sunday_formatted like "%' . $search_val . '%" OR 
									serviceable_days like "%' . $search_val . '%" OR 
									zipcode_associate_with_formatted like "%' . $search_val . '%"   
								';
					$query->havingRaw($havingStr);
				} //search keyword close

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
								$query->orderBy('zipcodes_management.created_at', $sort_by);
							else
								$query->orderBy($sort_column, $sort_by);
						}
					}
					else{
						$query->orderBy('z_id','desc');
					}
					//sort close
				}
				
			}
			// $query->latest();
			$result = $query->get();
			// return $query->toSql(); // To print query in string format
			
			
			if($result->count() == 0){
				$result = FALSE;
			}
					
		}
		else{ //For single record
			$query = DB::table('zipcodes_management')
					->leftJoin('address_books AS depot', function ($join) {
			            $join->on('zipcodes_management.locations_id', '=', 'depot.id')
			                 ->where('depot.address_type', '=', config('constants.ADDRESS_TYPE.DEPOT'));
			        })
			        ->leftJoin('schedule_settings', 'schedule_settings.id', '=', 'zipcodes_management.schedule_settings_id')
					->select(DB::raw('zipcodes_management.*, zipcodes_management.id AS z_id, schedule_settings.*, 
						COALESCE(CONCAT("'.config('constants.MODULE_INITIALS.RECEIVER').'", depot.short_code),"") AS zipcode_associate_with_formatted,
						depot.short_code, depot.terminal_name, depot.terminal_name AS terminal_formatted, zipcodes_management.locations_id,
						zipcodes_management.locations_id as warehouse_id_formatted,
						DATE_FORMAT(zipcodes_management.created_at, "%m/%d/%Y %h:%i %p") AS created_at_formatted, 
						DATE_FORMAT(zipcodes_management.updated_at, "%m/%d/%Y %h:%i %p") AS updated_at_formatted'));
			
			if(!empty($session_location)){
				$query->where('zipcodes_management.session_location', $session_location);
			}
			$result = $query->where('zipcodes_management.id', '=', $id )
					->first();
		}
		// dd($result);
		return $result;
	}
	
	/**
     * To get zipcodes location wise
     * @var $zipcodes (optional), array $schedule_settings_id (exclude this location)
     * @author Sandeep Rawat
     */
	public function get_zipcodes_location_wise($zipcodes = array(), $schedule_settings_id = NULL, $is_location_exclude = FALSE){
		
		$query = DB::table('zipcodes_management')
					->leftJoin('address_books AS depot', function ($join) {
			            $join->on('zipcodes_management.locations_id', '=', 'depot.id')
			                 ->where('depot.address_type', '=', config('constants.ADDRESS_TYPE.DEPOT'));
			        })
					->select(DB::raw('zipcodes_management.*, zipcodes_management.id AS z_id, 
						COALESCE(CONCAT("'.config('constants.MODULE_INITIALS.RECEIVER').'", depot.short_code),"") AS zipcode_associate_with_formatted,
						depot.short_code, depot.terminal_name, depot.terminal_name AS terminal_formatted, zipcodes_management.locations_id,
						zipcodes_management.locations_id as warehouse_id_formatted,
						DATE_FORMAT(zipcodes_management.created_at, "%m/%d/%Y %h:%i %p") AS created_at_formatted, 
						DATE_FORMAT(zipcodes_management.updated_at, "%m/%d/%Y %h:%i %p") AS updated_at_formatted'));

		$query->whereNotNull('zipcodes_management.schedule_settings_id');
		if(!empty($schedule_settings_id)){
			if($is_location_exclude === TRUE){
				$query->where('zipcodes_management.schedule_settings_id', '<>', $schedule_settings_id);
			}
			else{
				$query->where('zipcodes_management.schedule_settings_id', '=', $schedule_settings_id);
			}
			
		}
		if(!empty($zipcodes)){
			$query->whereIn('zipcodes_management.zipcode', $zipcodes);
		}

		$result = $query->get();
		
		if($result->count() == 0){
			$result = FALSE;
		}
		
		return $result;
	}
	
	/**
     * To check is zipcode exist or not in our zipcode list
     * @var $zipcode 
     * @author Sandeep Rawat
     */
	public function is_zipcode_exist($zipcode = NULL){
		
		if(empty($zipcode)){
			return FALSE;
		}

		$zipcode = trim($zipcode);
		$query = DB::table('zipcodes_management')
					->leftJoin('tiers AS t', 't.id', '=', 'zipcodes_management.tiers_id')
					->leftJoin('schedule_settings AS ss', 'ss.id', '=', 'zipcodes_management.schedule_settings_id')
					->select(DB::raw('zipcodes_management.*,   t.id AS t_id, t.tier_name, t.tier_type, t.active, t.active AS t_active, t.is_inflation_applied, t.created_by AS t_created_by, t.created_at AS t_created_at, t.updated_at AS t_updated_at,   ss.id AS ss_id, ss.depot_id, ss.loc_name, ss.monday, ss.tuesday, ss.wednesday, ss.thursday, ss.friday, ss.saturday, ss.sunday, ss.needed, ss.gmap_area, ss.active AS ss_active, ss.created_at AS ss_created_at, ss.updated_at AS ss_updated_at'))
					->where('zipcodes_management.zipcode', '=', $zipcode);

		$result = $query->get();
		// return $query->toSql(); // To print query in string format		
		
		if($result->count() == 0){
			$result = FALSE;
		}
		return $result;
	}
	
	/**
     * To create/edit tiers
     * @var array $data int $id (optional)
     * @author Sandeep Rawat
     */
	public function store_tier($data=NULL, $id=NULL){
		
		
		if(empty($data)){
			return FALSE;
		}
		
		if(empty($id)){ //Creating quote
			$last_id = DB::table('tiers')->insertGetId(
				$data
			);
			return $last_id;
		}
		else{ //Editing quote
			
			if(DB::table('tiers')->where('id', $id)->update($data)){
				return $id;
			}
			return FALSE;
		}
	}
	
	/**
     * To prepare tiers row
     * @var array $filter_arr
     * @author Sandeep Rawat
     */
    public function prepare_tiers_row($row)
    {
        if(!empty($row)){
            // if(is_array($row->toArray())){
                $row->tier_type_formatted = !empty($row->tier_type)?config('constants.REVERSAL_TIER_TYPE')[$row->tier_type]:"-";
                $row->created_at_formatted=date('m/d/Y h:i A',strtotime($row->created_at));
                $row->updated_at_formatted=date('m/d/Y h:i A',strtotime($row->updated_at));
                $row= $row;
            // }
        }
        return $row;
    }

    /**
     * To prepare tiers list
     * @var array $filter_arr
     * @author Sandeep Rawat
     */
    public function prepare_tiers_list($list=array())
    {
        $processed_data = array();
        if(!empty($list)){
            if(is_array($list->toArray())){
                foreach ($list as $row) {
                    
                    $row->tier_type_formatted = !empty($row->tier_type)?config('constants.REVERSAL_TIER_TYPE')[$row->tier_type]:"-";
                    $row->created_at_formatted=date('m/d/Y h:i A',strtotime($row->created_at));
                    $row->updated_at_formatted=date('m/d/Y h:i A',strtotime($row->updated_at));
                    $processed_data[] = $row;
                }
            }
        }
        return $processed_data;
    }

    /**
     * To get optimized tier List 
     * @var array $filter_arr
     * @author Sandeep Rawat
     */
    public function get_opt_tiers_list($id = NULL, $filter_arr = array())
    {
        $sub_query = $this->get_tiers_details_subquery($id, $filter_arr);
        if(empty($id))
        {
            $result = $sub_query->get();
            if($result->count() == 0){
                $result = FALSE;
            }
            else{
                $result = $this->prepare_tiers_list($result);
            }
        }
        else
        {
            $result = $sub_query->first();
            if($sub_query->count() == 0){
                $result = FALSE;
            }
            else{
                $result = $this->prepare_tiers_row($result);
            }
        }
        return $result;
    }

    /**
     * To get filtered tiers list count 
     * @var $id (optional), array $filter_arr
     * @author Sandeep Rawat
     */
    public function get_opt_tiers_list_count($id = NULL, $filter_arr = array()){
        $count = 0;
        if(empty($id)){ //For listing
            $sub_query = $this->get_tiers_details_subquery($id,$filter_arr);
            $count=DB::table('tiers')
                        ->joinSub($sub_query, 'sub_query', function ($join) {
                            $join->on('tiers.id', '=', 'sub_query.t_id');
                        })
                        ->count();
        }
        return $count;
    }

    /**
     * To get tiers detailed information
     * @var $id (optional), array $filter_arr
     * @author Sandeep Rawat
     */
    public function get_tiers_details_subquery($id = NULL, $filter_arr = array()){
        
        if(empty($id)){ //For listing
            $query = DB::table('tiers')
                    ->select(DB::raw('tiers.id AS t_id, tiers.*'));
            
            $query->groupBy('tiers.id');
            if(!empty($filter_arr)){

                $search_val = $filter_arr['search_val'];
                if(!empty($search_val)){ //search keyword
                    $havingStr = '  tiers.tier_name like "%' . $search_val . '%"   
                                ';
                    $query->havingRaw($havingStr);
                } //search keyword close
                if(!empty($filter_arr['filter_by_active']))
                {
                    $query->where('tiers.active','=',$filter_arr['filter_by_active']);
                }
                if(!empty($filter_arr['filter_by_tier_type']))
                {
                    $query->where('tiers.tier_type','=',$filter_arr['filter_by_tier_type']);
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
                        $sort_by     = !empty($sort['sort_by'])?$sort['sort_by']:'';

                        if( !empty($sort_column) && !empty($sort_by) ){
                            if($sort_column == 'created_at_formatted'){
                                $query->orderBy('tiers.created_at', $sort_by);
                            } else {
                                $query->orderBy($sort_column, $sort_by);
                            }
                        }
                    }
                    else{
                        $query->orderBy('t_id','desc');
                    }
                    //sort close
                }
                
            }
            $result = $query;
        }
        else{ //For single record
            $query = DB::table('tiers')
                    ->select(DB::raw('tiers.id AS t_id, tiers.*'));
            
            $result = $query->where('tiers.id', '=', $id );
        }
        return $result;
    }

	/**
     * Get tier list for select2 ajax
     * @var $filter_arr
     * @author Sandeep Rawat
     */
	public function get_tier_list_select2( $tiers_id = NULL, $filter_arr = array(), $ex_tiers_id = NULL){
		
		$tier_types = array();
		if(!empty($filter_arr) && !empty($filter_arr['tier_types'])){
			$tier_types = $filter_arr['tier_types'];
		}
		$text = ' tiers.tier_name ';
		$fields ='';
		if(!empty($filter_arr) && !empty($filter_arr['with_tier_types'])){
			$text = ' CONCAT(tiers.tier_name, " (", (CASE 
						WHEN (tiers.tier_type = "'. config('constants.TIER_TYPE.SERVICE') .'") THEN "'. config('constants.REVERSAL_TIER_TYPE')[config('constants.TIER_TYPE.SERVICE')] .'"
						WHEN (tiers.tier_type = "'. config('constants.TIER_TYPE.NO_SERVICE') .'") THEN "'. config('constants.REVERSAL_TIER_TYPE')[config('constants.TIER_TYPE.NO_SERVICE')] .'"
						WHEN (tiers.tier_type = "'. config('constants.TIER_TYPE.QUOTE_ONLY') .'") THEN "'. config('constants.REVERSAL_TIER_TYPE')[config('constants.TIER_TYPE.QUOTE_ONLY')] .'"
						ELSE "" 
					 END), ")") ';
			$fields =' , tiers.tier_name, tiers.tier_type, tiers.active';
		}
		
		
		
		$query = DB::table('tiers')
				->select(DB::raw('tiers.id,'.$text .' AS text'.$fields));
		if(!empty($tier_types)){
			$query->where(function ($qry) use ($tier_types) {
		  		$qry->whereIn('tiers.tier_type', $tier_types);
            });
		}
		if(!empty($ex_tiers_id)){ //Exclude specific tier
			$query->where('tiers.id', '<>', $ex_tiers_id);
		}
		$query->where('tiers.active', config('constants.ACTIVE'));

		if(!empty($filter_arr)){

			//search keyword
			$search_val = $filter_arr['search_val'];
			if(!empty($search_val)){
				$havingStr = 'text like "%' . $search_val . '%"';
				$query->havingRaw($havingStr);
			}
			//search keyword close

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
					$query->orderBy('tiers.id','asc');
				}
				//sort close
			}		
		}
		if(empty($tiers_id)){
			$result = $query->get();
			if($result->count() == 0){
				$result = FALSE;
			}
		}
		else{
			$query->where('tiers.id', '=', $tiers_id);
			$result = $query->first();
		}
		
		return $result;
	}
	public function get_zips_for_script($tier_id = NULL){
		if(empty($tier_id)){
			$tiers_id = 'null';
		}
		$query = DB::table('zipcodes_management')
					->select('zipcodes_management.*')
					->whereNull('zipcodes_management.tiers_id')
					->whereNotNull('zipcodes_management.tier');
		$result = $query->get();
		return $result;					
	}
	public function get_tiers_for_script($fil_arr = NULL){
		if(empty($fil_arr)){
			return false;
		}else{
			$query = DB::table('tiers')
						->select('tiers.*')
						->where('tiers.active',config('constants.ACTIVE'));
			if(!empty($fil_arr['tier_name'])){
				if($fil_arr['tier_name'] == config('constants.REVERSAL_TIER_TYPE')[config('constants.TIER_TYPE.NO_SERVICE')]){
					if($fil_arr['tier_type'] == 0){
						$tier_ty = config('constants.TIER_TYPE.NO_SERVICE');
					}elseif($fil_arr['tier_type'] == 1){
						$tier_ty = config('constants.TIER_TYPE.QUOTE_ONLY');
					}
				}else{
					if($fil_arr['tier_type'] == 0){
						$tier_ty = config('constants.TIER_TYPE.SERVICE');
					}elseif($fil_arr['tier_type'] == 1){
						$tier_ty = config('constants.TIER_TYPE.QUOTE_ONLY');
					}
				}

				$query->where('tiers.tier_name','=',$fil_arr['tier_name']);
				$query->where('tiers.tier_type','=',$tier_ty);

			}
			$result = $query->get();
		}
		return $result;					
	}	
}
