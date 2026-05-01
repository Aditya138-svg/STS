<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;


class Items extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'items';

	//NEW
	public function is_item_exists_new($where_array = array()) {

		if (empty($where_array)) {
			return FALSE;
		}
		$row = DB::table('items')
				->select('id','item_name', 'length', 'width', 'height', 'created_at', 'updated_at')
				->where($where_array)
				->first();
	
		if (empty($row)) {
			return FALSE;
		}
	
		$row->item_dimensions = $row->length . ' x ' . $row->width . ' x ' . $row->height;
		$row->created_at_formatted = date('m/d/Y h:i A', strtotime($row->created_at));
		$row->updated_at_formatted = date('m/d/Y h:i A', strtotime($row->updated_at));
	
		return $row;
	}


	public function is_item_exists($where_array = array()){

		if(empty($where_array)){

			return FALSE;

		}

		

		$row = DB::table('items')

					->orderBy('item_name','asc')

					->select(DB::raw('items.*, 

						CONCAT(COALESCE(items.length,"0"), " x ", COALESCE(items.width,"0"), " x ", COALESCE(items.height,"0") ) AS item_dimesnions,

						DATE_FORMAT(items.created_at, "%m/%d/%Y %h:%i %p") AS created_at_formatted, 

						DATE_FORMAT(items.updated_at, "%m/%d/%Y %h:%i %p") AS updated_at_formatted'))

					->where($where_array)

					->first();

		

		if(empty($row)){

			$row = FALSE;

		}

		return $row;

	}
	
	
	public function update_item_used_count($items_id=NULL){
		if(empty($items_id)){
			return FALSE;
		}

		$row = DB::table('items')
				->where('items.id', $items_id)
				->first();
		if(!empty($row)){
			$used_count = $row->used_count;
			$used_count = ((int)$used_count + 1);
			$data = array(
				'used_count' => $used_count,
				'updated_at' => date('Y-m-d H:i:s')

			);



			$result = DB::table('items')

						->where('items.id', $items_id)

						->update($data);

			if(!empty($result)){
				return $items_id;

			}



		}



		return FALSE;

	}
	//NEW
    public function update_item_used_count_new($items_id = NULL) {
		if (empty($items_id)) {
			return FALSE;
		}
		// Update the used_count directly without fetching the row first
		$result = DB::table('items')
					->where('id', $items_id)
					->increment('used_count', 1, ['updated_at' => date('Y-m-d H:i:s')]);

		return $result ? $items_id : FALSE;

	}

	//NEW
	public function store_item_new($data=NULL, $items_id=NULL){
		if(empty($data)){
			return FALSE;
		}
		if(empty($items_id)){
			return DB::table($this->table)->insertGetId($data);
		}
		else{ //Editing user
			$result = DB::table($this->table)
						->where('id', $items_id)
						->update($data);

			if(!empty($result)){
				return $items_id;
			}
			return FALSE; 
		}

	}

	public function store_item($data=NULL, $items_id=NULL){

		if(empty($data)){
			return FALSE;
		}

		if(empty($items_id)){
			$id = DB::table($this->table)->insertGetId(
				$data
			);

			return $id;

		}

		else{ //Editing user

			

			$result = DB::table($this->table)

						->where($this->table.'.id', $items_id)

						->update($data);

			if(!empty($result)){

				return $items_id;

			}

			return FALSE; 

		}

	}

}
