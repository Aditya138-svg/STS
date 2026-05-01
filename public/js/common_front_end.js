
$(function(){

		

		//additional_valuation_declined checkbox button
		$('input:checkbox[name="additional_valuation_declined"]').click(function(){
			var chk = $(this).is(':checked');
			if(chk){
				// alert('checked');
				$("#deductible").prop('disabled', true);
			}
			else{
				// alert('not checked');
				$("#deductible").prop('disabled', false);
			}
		});

		//num_of_flights checkbox button
		$('input:checkbox[id="stair_carry_req"]').click(function(){
			var chk = $(this).is(':checked');
			
			if(!chk){
				// alert('checked');
				$("#num_of_flights").val('0');
				$("#num_of_flights").prop('disabled', true);
			}
			else{
				// alert('not checked');
				$("#num_of_flights").prop('disabled', false);
			}
		});

		//num_of_flights checkbox button
		$('#users_id').on('change', function(){
			var users_id = $(this).val();
			console.log('users_id: '+users_id);
			var index = findIndexIfObjWithOwnAttr(existing_customer_arr, 'id', users_id);
			console.log('index: '+index);
			if(index != -1){
				console.log('existing_customer_arr[index]', existing_customer_arr[index])
				$('#company_name').val(existing_customer_arr[index]['company_name']);
				$('#name').val(existing_customer_arr[index]['name']);
				$('#phone').val(existing_customer_arr[index]['phone1']);
				$('#email').val(existing_customer_arr[index]['email']);
			}
			else{
				resetFields('customer');
			}
		});


	});
        
        function resetFields(arg, row_id){
		switch(arg){

			case 'customer':
				$('#company_name').val('');
				$('#name').val('');
				$('#phone').val('');
				$('#email').val('');

				$('#company_name').prop('readonly',false);
				$('#name').prop('readonly',false);
				$('#phone').prop('readonly',false);
				$('#email').prop('readonly',false);
			break;

			case 'items':
				$('#item_length_'+row_id).val('1');
				$('#item_width_'+row_id).val('1');
				$('#item_height_'+row_id).val('1');
				$('#item_weight_'+row_id).val('1');

				$('#item_length_'+row_id).prop('readonly',true);
				$('#item_width_'+row_id).prop('readonly',true);
				$('#item_height_'+row_id).prop('readonly',true);
				$('#item_weight_'+row_id).prop('readonly',true);

			break;
                        case 'items_false':
				$('#item_length_'+row_id).val('1');
				$('#item_width_'+row_id).val('1');
				$('#item_height_'+row_id).val('1');
				$('#item_weight_'+row_id).val('1');
				$('#item_cubes_'+row_id).val('1');

				$('#item_length_'+row_id).prop('readonly',false);
				$('#item_width_'+row_id).prop('readonly',false);
				$('#item_height_'+row_id).prop('readonly',false);
				$('#item_weight_'+row_id).prop('readonly',false);

			break;


		}
	}
function item_changed(row_id){
		var item_id = $('#item_name_menu_'+row_id).val();
		var index = findIndexIfObjWithOwnAttr(items_arr, 'id', item_id);
		if(index !== -1){
			$('#item_length_'+row_id).val(items_arr[index]['length']);
			$('#item_width_'+row_id).val(items_arr[index]['width']);
			$('#item_height_'+row_id).val(items_arr[index]['height']);
			$('#item_weight_'+row_id).val(items_arr[index]['weight']);
		}
		else{
			resetFields('items', row_id);
		}
	
	}
        
function item_custom(row_id){
		var chk = $('#is_custom_'+row_id).is(':checked');
		$(".item_name_"+row_id).hide();
		$(".item_name_"+row_id).prop('disabled', true);
		if(chk){
			// alert('checked');
			resetFields('items_false', row_id);
			$("#item_name_text_"+row_id).show();
			$("#item_name_text_"+row_id).prop('disabled', false);
			$("#hidden_is_custom_"+row_id).val('on');
		}
		else{
			// alert('not checked');
			resetFields('items', row_id);
			$("#item_name_menu_"+row_id).val('');
			$("#item_name_menu_"+row_id).show();
			$("#item_name_menu_"+row_id).prop('disabled', false);
			$("#hidden_is_custom_"+row_id).val('off');
		}
	
	}

	function item_has_marble(row_id){
		var chk = $('#item_has_marble_or_stone_'+row_id).is(':checked');
		
		if(chk){
			// alert('checked');
			$("#hidden_has_marble_"+row_id).val('on');
		}
		else{
			// alert('not checked');
			$("#hidden_has_marble_"+row_id).val('off');
		}
	
	}
	var row_count = 0;

	function add_item(gl_item_name){
		var items_options_str = '';
		for(var i=0;i<items_arr.length;i++){
			if(items_arr[i]['is_custom'] == 0 )
				items_options_str += '<option value="'+items_arr[i]['id']+'">'+items_arr[i]['item_name']+'</option>';
		}

		row_count++;
		var str = '';
		if(Array.isArray(gl_item_name) && gl_item_name.length > 0){
			for(var j=0;j<gl_item_name.length;j++){

				var is_custom = gl_is_custom[j];
				var is_custom_chk = (is_custom == 'on')?'checked':'';
				var package_type = gl_package_type[j];
				var item_name = gl_item_name[j];
				var item_name_str = '';
				var readonly_str = 'readonly';
				if(is_custom_chk == 'checked'){
					readonly_str = '';
					if(item_name == '' || item_name == 'undefined' || item_name == null)
						item_name = '';

					item_name_str = 
								'<select onchange="item_changed('+row_count+')" class="form-control common_item_'+row_count+' item_name_'+row_count+'" name="item_name[]" id="item_name_menu_'+row_count+'" style="display:none;" disabled required>'+
			                    	'<option value="">-Select Item-</option>'+
									items_options_str+
			                    '</select>'+
			                    '<input class="form-control common_item_'+row_count+' item_name_'+row_count+'" type="text" name="item_name[]" id="item_name_text_'+row_count+'" value="'+item_name+'" placeholder="Enter item" required>';
				}
				else{
					var items_options_str1 = items_options_str;
					if(item_name != '')
						items_options_str1 = items_options_str.replace('value="'+item_name+'"', 'value="'+item_name+'" selected');
					item_name_str = 
								'<select onchange="item_changed('+row_count+')" class="form-control common_item_'+row_count+' item_name_'+row_count+'" name="item_name[]" id="item_name_menu_'+row_count+'" required>'+
			                    	'<option value="">-Select Item-</option>'+
									items_options_str1+
			                    '</select>'+
			                    '<input class="form-control common_item_'+row_count+' item_name_'+row_count+'" type="text" name="item_name[]" id="item_name_text_'+row_count+'" style="display:none;" disabled placeholder="Enter item" required>';
				}
				var item_length = gl_item_length[j];
				var item_width = gl_item_width[j];
				var item_height = gl_item_height[j];
				var item_weight = gl_item_weight[j];
				var item_qty = gl_item_qty[j];
				var item_cubes = gl_item_cubes[j];
				var item_has_marble_or_stone = gl_item_has_marble_or_stone[j];
				var is_marble_chk = (item_has_marble_or_stone == 'on')?'checked':'';

				str += '<tr id="row_'+row_count+'">'+
	                  '<td>'+
	                  	'<input onclick="item_custom('+row_count+')"  class="item_is_custom" type="checkbox" name="is_custom[]" id="is_custom_'+row_count+'" value="'+row_count+'" '+is_custom_chk+'>'+
	                  	'<input type="hidden" name="hidden_is_custom[]" id="hidden_is_custom_'+row_count+'" value="'+is_custom+'">'+
	                  '</td>'+
	                  '<td style="width:20%;">'+
	                  	'<select class="form-control common_item_'+row_count+'" name="package_type[]" id="package_type_'+row_count+'">'+
	                    	'<option value="">Blanket Wrap</option>'+
							'<option value="">Carton</option>'+
	                    '</select>'+
	                  '</td>'+
	                  '<td style="width:20%;">'+
	                    item_name_str+
	                  '</td>'+
	                  
	                  '<td>'+
	                  	'<input class="form-control padding_5px common_item_'+row_count+'" min="1" value="'+item_length+'" type="number" name="item_length[]" id="item_length_'+row_count+'" '+readonly_str+' required>'+
	                  '</td>'+
	                  '<td>'+
	                  	'<input class="form-control padding_5px common_item_'+row_count+'" min="1" value="'+item_width+'" type="number" name="item_width[]" id="item_width_'+row_count+'" '+readonly_str+' required>'+
	                  '</td>'+
	                  '<td>'+
	                  	'<input class="form-control padding_5px common_item_'+row_count+'" min="1" value="'+item_height+'" type="number" name="item_height[]" id="item_height_'+row_count+'" '+readonly_str+' required>'+
	                  '</td>'+
	                  '<td>'+
	                  	'<input class="form-control padding_5px common_item_'+row_count+'" min="1" value="'+item_weight+'" type="number" name="item_weight[]" id="item_weight_'+row_count+'" '+readonly_str+' required>'+
	                  '</td>'+
	                  '<td>'+
	                  	'<input class="form-control padding_5px common_item_'+row_count+'" min="1" value="'+item_qty+'" type="number" name="item_qty[]" id="item_qty_'+row_count+'" required>'+
	                  '</td>'+
	                  '<td>'+
	                  	'<input class="form-control padding_5px common_item_'+row_count+'" min="1" value="'+item_cubes+'" type="number" name="item_cubes[]" id="item_cubes_'+row_count+'" '+readonly_str+'>'+
	                  '</td>'+
	                  '<td>'+
	                  	'<input onclick="item_has_marble('+row_count+')"  class="padding_5px common_item_'+row_count+'" type="checkbox" name="item_has_marble_or_stone[]" id="item_has_marble_or_stone_'+row_count+'" value="'+row_count+'" '+is_marble_chk+' >'+
	                  	'<input type="hidden" name="hidden_has_marble[]" id="hidden_has_marble_'+row_count+'" value="'+item_has_marble_or_stone+'">'+
	                  '</td>'+
	                  '<td>'+
	                  	'<a style="color:#dd4b39 !important;" title="Remove item" onclick="remove_item('+row_count+')" href="javascript:;">'+
						  '<i class="fa fa-trash fa-lg"></i>'+
						'</a>'+
	                  '</td>'+
	                '</tr>';
	                row_count++;
			}
		}
		else{
			str += '<tr id="row_'+row_count+'">'+
	                  '<td>'+
	                  	'<input onclick="item_custom('+row_count+')" class="item_is_custom" type="checkbox" name="is_custom[]" id="is_custom_'+row_count+'" value="'+row_count+'">'+
	                  	'<input type="hidden" name="hidden_is_custom[]" id="hidden_is_custom_'+row_count+'" value="off">'+
	                  '</td>'+
	                  '<td style="width:20%;">'+
	                  	'<select class="form-control common_item_'+row_count+'" name="package_type[]" id="package_type_'+row_count+'">'+
	                    	'<option value="">Blanket Wrap</option>'+
							'<option value="">Carton</option>'+
	                    '</select>'+
	                  '</td>'+
	                  '<td style="width:20%;">'+
	                  	'<select onchange="item_changed('+row_count+')" class="form-control common_item_'+row_count+' item_name_'+row_count+'" name="item_name[]" id="item_name_menu_'+row_count+'" required>'+
	                    	'<option value="">-Select Item-</option>'+
							items_options_str+
	                    '</select>'+
	                    '<input class="form-control common_item_'+row_count+' item_name_'+row_count+'" type="text" name="item_name[]" id="item_name_text_'+row_count+'" style="display:none;" disabled placeholder="Enter item" required>'+
	                  '</td>'+
	                  
	                  '<td>'+
	                  	'<input class="form-control padding_5px common_item_'+row_count+'" min="1" value="1" type="number" name="item_length[]" id="item_length_'+row_count+'" readonly required>'+
	                  '</td>'+
	                  '<td>'+
	                  	'<input class="form-control padding_5px common_item_'+row_count+'" min="1" value="1" type="number" name="item_width[]" id="item_width_'+row_count+'" readonly required>'+
	                  '</td>'+
	                  '<td>'+
	                  	'<input class="form-control padding_5px common_item_'+row_count+'" min="1" value="1" type="number" name="item_height[]" id="item_height_'+row_count+'" readonly required>'+
	                  '</td>'+
	                  '<td>'+
	                  	'<input class="form-control padding_5px common_item_'+row_count+'" min="1" value="1" type="number" name="item_weight[]" id="item_weight_'+row_count+'" readonly required>'+
	                  '</td>'+
	                  '<td>'+
	                  	'<input class="form-control padding_5px common_item_'+row_count+'" min="1" value="1" type="number" name="item_qty[]" id="item_qty_'+row_count+'" required>'+
	                  '</td>'+
	                  '<td>'+
	                  	'<input class="form-control padding_5px common_item_'+row_count+'" min="1" value="1" type="number" name="item_cubes[]" id="item_cubes_'+row_count+'" readonly>'+
	                  '</td>'+
	                  '<td>'+
	                  	'<input onclick="item_has_marble('+row_count+')" class="padding_5px common_item_'+row_count+'" type="checkbox" name="item_has_marble_or_stone[]" id="item_has_marble_or_stone_'+row_count+'" value="'+row_count+'">'+
	                  	'<input type="hidden" name="hidden_has_marble[]" id="hidden_has_marble_'+row_count+'" value="off">'+
	                  '</td>'+
	                  '<td>'+
	                  	'<a style="color:#dd4b39 !important;" title="Remove item" onclick="remove_item('+row_count+')" href="javascript:;">'+
						  '<i class="fa fa-trash fa-lg"></i>'+
						'</a>'+
	                  '</td>'+
	                '</tr>';
		}

		$(str).insertBefore("#add_item_row");
	}

function remove_item(row_id){
	
	// $("#row_"+row_id).remove();
	var count = $('#item_table').children('tr').length;
	if(count>3){
		$("#row_"+row_id).remove();
	}
	else{
		alert("You cannot perform this action.");
	}
}



$(document).ready(function(){
                
                $("#other").click(function(){
                    $("#other-half").slideDown("slow");
                });
                $(".only-other").click(function(){
                    $("#other-half").slideUp("fast");
                });
                
                
                $("#recommendation").click(function(){
                    $("#recommendation-half").slideDown("slow");
                });
                $(".only-recomendation").click(function(){
                    $("#recommendation-half").slideUp("fast");
                });
                
                
                $("#internet").click(function(){
                    $(".inner-internet").slideDown("slow");
                });
                $(".only-internet").click(function(){
                    $(".inner-internet").slideUp("slow");
                });
                
                
                 $(".custombox").click(function(){
                    $(".custom2").slideToggle("slow");
                });
               $(".custombox").click(function(){
                    $(".custom1").slideToggle("slow");
                });
                
                
                
                
            });
        


$(document).ready(function(){
    $("#div1").click(function(){
        $(".step2").show();
    });
    $("#div1").click(function(){
        $(".step1").hide();
        
      });
    $("#div2a").click(function(){
        $(".step3a").show();
    });
    $("#div2a").click(function(){
        $(".step2").hide();
      });
    
    $("#div2b").click(function(){
        $(".step3b").show();
    });
    $("#div2b").click(function(){
        $(".step2").hide();
    });
      
      
    $("#div3a").click(function(){
        $(".step5").show();
    });
    $("#div3a").click(function(){
        $(".step3a").hide();
    });
    
    $("#div3b").click(function(){
        $(".step5").show();
    });
    $("#div3b").click(function(){
        $(".step3b").hide();
    });
    
    $("#div5").click(function(){
        $(".step6").show();
    });
    $("#div5").click(function(){
        $(".step5").hide();
    });
    
    $("#div6").click(function(){
        $(".step7").show();
    });
    $("#div6").click(function(){
        $(".step6").hide();
    });
    
    
    
    $("#back2").click(function(){
        $(".step1").show();
    });
    $("#back2").click(function(){
        $(".step2").hide();
        
      });
    $("#back3a").click(function(){
        $(".step2").show();
    });
    $("#back3a").click(function(){
        $(".step3a").hide();
    });
    
   $("#back3b").click(function(){
        $(".step2").show();
    });
    $("#back3b").click(function(){
        $(".step3b").hide();
    });
    
    $("#back5").click(function(){
        $(".step3a").show();
    });
    $("#back5").click(function(){
        $(".step5").hide();
    });
    
    $("#back6").click(function(){
        $(".step5").show();
    });
    $("#back6").click(function(){
        $(".step6").hide();
    });
    
});
$(document).ready(function() { 
$("#order-id-submit").click(function(){
        $(".trackorder").fadeIn("slow");
    });
    $("#order-id-submit").click(function(){
        $(".out-box").fadeOut("fast");
    });
});



	
