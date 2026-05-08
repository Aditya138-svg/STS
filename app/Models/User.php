<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\DB;
use App\Models\UserAddresses;
use App\Model\UserCards;
use App\Notifications\CustomResetPasswordNotification;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['name', 'email', 'phone1', 'password', 'phone2', 'profile_pic', 'user_role', 'active', 'associates_id', 'company_name', 'cc_email', 'can_notify_new_order', 'invoice_cc_email'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    // public function sendPasswordResetNotification($token)
    // {
    //     $this->notify(new CustomResetPasswordNotification($token));
    // }

	public function addresses()
    {
        return $this->hasMany(UserAddresses::class, 'users_id');
    }

    public function addressBooks() {
        return $this->hasManyThrough(
            AddressBooks::class, // Final target model (address_books)
            UserAddresses::class, // Intermediate model (user_addresses)
            'users_id', // Foreign key on user_addresses (linking to users table)
            'id', // Foreign key on address_books (linking to user_addresses table)
            'id', // Local key on users table
            'address_book_id' // Local key on user_addresses table
        );
    }

    public function store_address($data=NULL, $address_book_id=NULL){


		if(empty($data)){
			return FALSE;
		}

		if(empty($address_book_id)){ //Creating user
			$id = DB::table('address_books')->insertGetId(
				$data
			);
			return $id;
		}
		else{ //Editing user
			// print_r($data ); echo $address_book_id; die;
			$result = DB::table('address_books')
						->where('address_books.id', $address_book_id)
						->update($data);


			if(!empty($result)){
				return $address_book_id;
			}
			return FALSE;
		}
	}

    public function cards()
    {
        return $this->hasMany(UserCards::class, 'users_id');
    }

    public function store_user_address($data=NULL){
		
		
		if(empty($data)){
			return FALSE;
		}
		
		$result = DB::table('user_addresses')->insertGetId(
			$data
		);
		if(empty($result)){
			return TRUE;
		}
		return FALSE;
	}



    public function get_user_addresses_list($users_id = NULL, $id = NULL){

		if(empty($users_id)){
			return FALSE;
		}

		if(empty($id)){ //For listing

			$result = DB::table('user_addresses')
					->leftJoin('users', 'users.id', '=', 'user_addresses.users_id')


					->leftJoin('address_books', 'address_books.id', '=', 'user_addresses.address_book_id')
					->select(DB::raw('users.name AS user_name, users.user_role, user_addresses.*, address_books.*,
								CONCAT(COALESCE(address_books.company_name,""), " ", COALESCE(address_books.contact_phone,""), " ", COALESCE(address_books.contact_email,"") ) AS contact_details,
								CONCAT(COALESCE(address_books.addressline1,""), " ", COALESCE(address_books.addressline2,""), " ", COALESCE(address_books.city,""), " ", COALESCE(address_books.state,""), " ", COALESCE(address_books.zipcode,"") ) AS contact_address,
								DATE_FORMAT(address_books.created_at, "%m/%d/%Y %h:%i %p") AS created_at_formatted'))
					->where('user_addresses.users_id', '=', $users_id )
					->where('address_books.active', '=', config('constants.ACTIVE'))
					->get();
					// ->toSql(); // To print query in string format
			// dd($result);
			if($result->count() == 0){
				$result = FALSE;
			}

		}
		else{ //For single record
			$result = DB::table('user_addresses')
					->leftJoin('users', 'users.id', '=', 'user_addresses.users_id')
					->leftJoin('address_books', 'address_books.id', '=', 'user_addresses.address_book_id')
					->select(DB::raw('users.name AS user_name, users.user_role, user_addresses.*, address_books.*,
								CONCAT(COALESCE(address_books.company_name,""), " ", COALESCE(address_books.contact_phone,""), " ", COALESCE(address_books.contact_email,"") ) AS contact_details,
								CONCAT(COALESCE(address_books.addressline1,""), " ", COALESCE(address_books.addressline2,""), " ", COALESCE(address_books.city,""), " ", COALESCE(address_books.state,""), " ", COALESCE(address_books.zipcode,"") ) AS contact_address,
									DATE_FORMAT(address_books.created_at, "%m/%d/%Y %h:%i %p") AS created_at_formatted'))
					->where('user_addresses.users_id', '=', $users_id )
					->where('user_addresses.address_book_id', '=', $id )
					->where('address_books.active', '=', config('constants.ACTIVE'))
					->first();
		}

		return $result;
	}

    public function get_user_addresses_list_new($users_id = NULL, $id = NULL)
    {
        if (empty($users_id)) {
            return FALSE;
        }

        // Fetch user details once regardless of $id
        $user = User::select('name', 'user_role')->where('id', $users_id)->first();

        // Initialize collection to ensure consistency in return types
        $collection = collect();

        // If no $id is provided, fetch all addresses for the user
        if (empty($id)) {
            $addresses = UserAddresses::with('addressBook')
                ->where('users_id', $users_id)
                ->get();

            foreach ($addresses as $userAddress) {
                if ($userAddress->addressBook) {
                    $data = [
                        'user_name' =>  $user->name  ?? 'N/A', // Assuming user relation exists
                        'user_role' => $user->user_role ?? 'N/A',
                        'users_id' => $userAddress->users_id,
                        'address_book_id' => $userAddress->address_book_id,
                        'id' => $userAddress->address_book_id,
                        'parent_id' => $userAddress->addressBook->parent_id,
                        'qb_display_name' => $userAddress->addressBook->qb_display_name,
                        'company_name' => $userAddress->addressBook->company_name,
                        'contact_name' => $userAddress->addressBook->contact_name ?? null,
                        'contact_phone' => $userAddress->addressBook->contact_phone ?? null,
                        'contact_email' => $userAddress->addressBook->contact_email ?? null,
                        'addressline1' => $userAddress->addressBook->addressline1 ?? null,
                        'addressline2' => $userAddress->addressBook->addressline2 ?? null,
                        'city' => $userAddress->addressBook->city ?? null,
                        'state' => $userAddress->addressBook->state ?? null,
                        'zipcode' => $userAddress->addressBook->zipcode ?? null,
                        'used_count' => $userAddress->addressBook->used_count ?? 0,
                        'lat' => $userAddress->addressBook->lat ?? null,
                        'lng' => $userAddress->addressBook->lng ?? null,
                        'address_type' => $userAddress->addressBook->address_type ?? 1,
                        'short_code' => $userAddress->addressBook->short_code ?? null,
                        'terminal_name' => $userAddress->addressBook->terminal_name ?? null,
                        'active' => $userAddress->addressBook->active ?? 0,
                        'is_notify_by_email' => $userAddress->addressBook->is_notify_by_email ?? 0,
                        'is_notify_by_sms' => $userAddress->addressBook->is_notify_by_sms ?? 0,
                        'similiar_group_num' => $userAddress->addressBook->similiar_group_num ?? 0,
                        'is_billable' => $userAddress->addressBook->is_billable ?? 0,
                        'is_authorize' => $userAddress->addressBook->is_authorize ?? 0,
                        'custom_note' => $userAddress->addressBook->custom_note ?? null,
                        'ignore_duplicacy' => $userAddress->addressBook->ignore_duplicacy ?? 0,
                        'special_instruction' => $userAddress->addressBook->special_instruction ?? null,
                        'created_at' => $userAddress->addressBook->created_at->format('Y-m-d H:i:s'),
                        'updated_at' => $userAddress->addressBook->updated_at->format('Y-m-d H:i:s'),
                        'contact_details' => $userAddress->addressBook->company_name . ' ' .
                                            ($userAddress->addressBook->contact_phone ?? '') . ' ' .
                                            ($userAddress->addressBook->contact_email ?? ''),
                        'contact_address' => trim(
                            $userAddress->addressBook->addressline1 . ' ' .
                            $userAddress->addressBook->addressline2 . ' ' .
                            $userAddress->addressBook->city . ' ' .
                            $userAddress->addressBook->state . ' ' .
                            $userAddress->addressBook->zipcode
                        ),
                        'created_at_formatted' => $userAddress->addressBook->created_at->format('m/d/Y h:i A')
                    ];

                    // Add this data to the collection
                    $collection->push((object) $data);

                }
            }
        } else {
            // If $id is provided, fetch the specific address
            $result = DB::table('user_addresses')
                ->leftJoin('users', 'users.id', '=', 'user_addresses.users_id')
                ->leftJoin('address_books', 'address_books.id', '=', 'user_addresses.address_book_id')
                ->select(DB::raw('users.name AS user_name, users.user_role, user_addresses.*, address_books.*,
                            CONCAT(COALESCE(address_books.company_name,""), " ", COALESCE(address_books.contact_phone,""), " ", COALESCE(address_books.contact_email,"") ) AS contact_details,
                            CONCAT(COALESCE(address_books.addressline1,""), " ", COALESCE(address_books.addressline2,""), " ", COALESCE(address_books.city,""), " ", COALESCE(address_books.state,""), " ", COALESCE(address_books.zipcode,"") ) AS contact_address,
                                DATE_FORMAT(address_books.created_at, "%m/%d/%Y %h:%i %p") AS created_at_formatted'))
                ->where('user_addresses.users_id', '=', $users_id)
                ->where('user_addresses.address_book_id', '=', $id)
                ->where('address_books.active', '=', config('constants.ACTIVE'))
                ->first();

            return $result; // Return the specific result if $id is provided
        }
        // Return the collection of addresses
        return $collection;
    }


    /**
     * To get address information
     * @var int $users_id, int $id (optional - it is address book id)
     * @author Sandeep Rawat
     */
	public function get_addresses_detail($id = NULL){
		// $exclude_addresses = array(config('constants.ADDRESS_TYPE.DEPOT'), config('constants.ADDRESS_TYPE.CBD'), config('constants.ADDRESS_TYPE.WILL_CALL'), config('constants.ADDRESS_TYPE.STORAGE'), config('constants.ADDRESS_TYPE.RECYCLE'), config('constants.ADDRESS_TYPE.REPAIR'));
		if(empty($id)){
			return FALSE;
		}
		else{ //For single record
			$result = DB::table('address_books')
					->select(DB::raw('address_books.*, 
									(CASE 
										WHEN (address_books.address_type = "'. config('constants.ADDRESS_TYPE.DEPOT') .'") THEN "'. config('constants.REVERSAL_ADDRESS_TYPE')[config('constants.ADDRESS_TYPE.DEPOT')] .'"
										WHEN (address_books.address_type = "'. config('constants.ADDRESS_TYPE.CBD') .'") THEN "'. config('constants.REVERSAL_ADDRESS_TYPE')[config('constants.ADDRESS_TYPE.CBD')] .'"
										WHEN (address_books.address_type = "'. config('constants.ADDRESS_TYPE.WILL_CALL') .'") THEN "'. config('constants.REVERSAL_ADDRESS_TYPE')[config('constants.ADDRESS_TYPE.WILL_CALL')] .'"
										WHEN (address_books.address_type = "'. config('constants.ADDRESS_TYPE.STORAGE') .'") THEN "'. config('constants.REVERSAL_ADDRESS_TYPE')[config('constants.ADDRESS_TYPE.STORAGE')] .'"
										WHEN (address_books.address_type = "'. config('constants.ADDRESS_TYPE.RECYCLE') .'") THEN "'. config('constants.REVERSAL_ADDRESS_TYPE')[config('constants.ADDRESS_TYPE.RECYCLE')] .'"
										WHEN (address_books.address_type = "'. config('constants.ADDRESS_TYPE.REPAIR') .'") THEN "'. config('constants.REVERSAL_ADDRESS_TYPE')[config('constants.ADDRESS_TYPE.REPAIR')] .'"
										WHEN (address_books.address_type = "'. config('constants.ADDRESS_TYPE.RESIDENCE') .'") THEN "'. config('constants.REVERSAL_ADDRESS_TYPE')[config('constants.ADDRESS_TYPE.RESIDENCE')] .'"
										ELSE "" 
									 END) as address_type_formatted,
									IF(address_books.is_notify_by_email="1", "Yes", "No") AS is_notify_by_email_formatted,
									IF(address_books.is_notify_by_sms="1", "Yes", "No") AS is_notify_by_sms_formatted,
									DATE_FORMAT(address_books.created_at, "%m/%d/%Y %h:%i %p") AS created_at_formatted'))
					->where('address_books.id', '=', $id )
					// ->where('address_books.active', '=', config('constants.ACTIVE'))
					->first();
		}
		return $result;
	}
	

}
