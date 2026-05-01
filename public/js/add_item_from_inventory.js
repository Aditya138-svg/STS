var customerSelect, invItemSelect;
// 8 April 2019 at 05:21:40 PM
$(function(){
	customerSelect = $("#users_id");
	invItemSelect = $("#in_items_id");

	//Change customer
	// $(document).on('change', '#users_id', function(){
	customerSelect
	.on("select2:select", function (e) { 
		var is_item_from_inventory = false;
		var data = e.params.data;
	    console.log(data.id);
	    // $("#btn_add_item_from_inv").hide();
		var cur_users_id = $(this).val();
		var row_ids = $("input[name='in_it_id[]']")
          	.map(function(){
          		return $(this).attr('data-row_id');
          	}).get();

		var in_item_row = [];
		$.each(row_ids, function(k,row_id){
			var in_it_id = $("#in_it_id_"+row_id).val();
			if(parseInt(in_it_id) != 0){
				is_item_from_inventory = true;
				in_item_row.push(row_id);
			}
		});
		if(old_users_id==''){
			old_users_id = cur_users_id;
		}
		
		if(is_item_from_inventory == true){
			var r = confirm("We have items from inventory of other customer? If you proceed then we unlink these items.");
			if(r == true){
				old_users_id = cur_users_id;
				//Reset all inventory item id to zero
				$.each(in_item_row, function(k,in_row){
					$("#in_it_id_"+in_row).val(0);
				});
			} else {
				console.log('old_users_id: '+old_users_id);
				if(old_users_id!=''){
					$("#users_id").val(old_users_id).trigger('change');
				}
			}
		}


		// if(cur_users_id != '' && old_users_id != cur_users_id){ // different

		// 	console.log('cur_users_id: '+cur_users_id);
		// 	$("#btn_add_item_from_inv").show();
		// 	if(is_item_from_inventory == true){
		// 		var r = confirm("We have items from inventory of other customer? If you proceed then we unlink these items.");
		// 		if(r == true){
		// 			old_users_id = cur_users_id;
		// 			//Reset all inventory item id to zero
		// 			$.each(in_item_row, function(k,in_row){
		// 				$("#in_it_id_"+in_row).val(0);
		// 			});
		// 		} else {
		// 			console.log('old_users_id: '+old_users_id);
		// 			$("#users_id").val(old_users_id).trigger('change');
		// 		    return false;

		// 		}
				
		// 	}
		// }
		// if(old_users_id=='' || old_users_id == '0'){
		// 	old_users_id = cur_users_id;
		// }
	})
	.on("select2:unselect", function(e) {
	  if (!e.params.originalEvent) {
	    return
	  }

	  e.params.originalEvent.stopPropagation();
	});

	// Click add item from inventroy button
	$(document).on('click', '#btn_add_item_from_inv', function(event){
		var u_id = $("#users_id").val();
		// console.log('u_id: '+u_id);
		if(typeof(u_id) == undefined || u_id == '' || u_id == '0' || u_id == null){
			showFlashModal(false,'Please choose customer first');
			$(document).on('click', '.close', function(){
				// customerSelect.select2('open');
				// $( '.close' ).unbind( event );
				// $( ".close" ).unbind( "click" );
			});
		}
		else{
			resetFields('inv_item_form_div');
			$("#inv_item_form_modal").modal('show');
		}
	});

	//inventory item select2
	invItemSelect.select2({
	    ajax: {
	        url: get_inv_items_list_select2,
	        dataType: 'json',
	        data: function(params) {
	            return {
	                users_id: $('#users_id').val(),
	                term: params.term || '',
	                page: params.page || 1,
					order_id : $('#id').val(),
					
	            }
	        },
	        processResults: function (data, params) {
		      	// parse the results into the format expected by Select2
		      	// since we are using custom formatting functions we do not need to
		      	// alter the remote JSON data, except to indicate that infinite
		      	// scrolling can be used
		      	params.page = params.page || 1;

		      	return {
			        results: data.results,
			        pagination: {
			          	more: (params.page * 10) < data.total_count
			        }
		      	};
		    },
	        cache: true
	    },
	    placeholder: '-Select Item From inventory-',
	    width: '300px',
	    allowClear: true
	})
	.on("change", function (e) {
		var in_items_id = $(this).val();
		// console.log("on change in_items_id" + in_items_id);
		
		if(in_items_id!=null && in_items_id!='' && in_items_id!='0'){

			$("#inv_item_form_div").show();
		}
	})
	.on("select2:select", function (e) {
		var data = e.params.data;
		var item_str = data.text;
		 
		var in_items_id = $(this).val();
		if(item_str!='' && in_items_id!=null && in_items_id!='' && in_items_id!='0'){
			var item_split = item_str.split('--');
			var i_sku = '';
			var i_desc = '';
			var i_dims = '';
			var i_length = '';
			var i_width = '';
			var i_height = '';
			var i_stock = data.sellable_qty;
			var i_total_allocated = data.total_allocated;
			var i_stockonhand = data.stock;
			// console.log('item_split.length: '+item_split.length);
			if(item_split.length == 4){
				i_sku = item_split[0].trim();
				i_desc = item_split[1].trim();
				i_dims = item_split[2].trim();
				// i_stockonhand = item_split[3].trim();
			}
			
			if(i_dims != ''){
				var dim_split = i_dims.split(' x ');
				if(dim_split.length==3){
					i_length = dim_split[0].trim();
					i_width  = dim_split[1].trim();
					i_height = dim_split[2].trim();
				}
			}
			
			$("#i_sku").val(i_sku);
			$("#i_desc").val(i_desc);
			$("#i_dims").val(i_dims);
			$("#i_length").val(i_length);
			$("#i_width").val(i_width);
			$("#i_height").val(i_height);
			
			$("#i_stock").val(i_stock);
			$("#onhand_stock").html(i_stockonhand);
			$("#allocated_stock").html(i_total_allocated);

			$("#a_stock").removeClass('text-success');
			$("#a_stock").removeClass('text-red');
			var i_stock_str = i_stock;
			if(i_stock !='' && parseInt(i_stock)<=10){
				if(parseInt(i_stock)<=0){
					i_stock_str = 'Out of Stock';
				} else {
					i_stock_str = 'This item is approaching low inventory you have '+i_stock+' available';
				}

				
				$("#a_stock").removeClass('text-success');
				$("#a_stock").addClass('text-red');
			}
			else{
				$("#a_stock").addClass('text-success');
			}
			// console.log('item_str: '+item_str);
			// console.log('i_sku: '+i_sku);
			// console.log('i_desc: '+i_desc);
			// console.log('i_dims: '+i_dims);
			// console.log('i_length: '+i_length);
			// console.log('i_width: '+i_width);
			// console.log('i_height: '+i_height);
			// console.log('i_stock: '+i_stock);
			$("#a_sku").html(i_sku);
			$("#a_desc").html(i_desc);
			$("#a_dims").html(i_dims);
			// $("#a_stock").html(i_stock);
			$("#a_stock").html(i_stock_str);

			//Calculate cubes
			var l = parseFloat(i_length);
			var w = parseFloat(i_width);
			var h = parseFloat(i_height);
			var cubes = (l*w*h)/1728.0;
			cubes = parseFloat(cubes).toFixed(1);
			
			if((cubes % 1) >= 0.5){
				cubes = Math.ceil(cubes);
			}
			else{
				cubes = Math.floor(cubes);
			}
			cubes = (cubes?cubes:0);

			var q = parseInt(1);
			q = q?q:1;
			cubes = cubes * q;
			// console.log('cubes: '+cubes);
			$("#i_cubes").val(cubes);
			//Calculate cubes close

			$("#inv_item_form_div").show();
		}
	})
	.on("select2:close", function (e) {
		// var in_items_id = $(this).val();
		// console.log("on close in_items_id" + in_items_id);
	})
	.on("select2:open", function(e) { 
	   	var in_items_id = $(this).val();
		// console.log("on open in_items_id" + in_items_id);
		if(in_items_id=='' || in_items_id == '0' || in_items_id == null){
			// clear_order_items();
		}
		// var $sku = $("#item_sku_"+$("#i_row_id").val()).val();
		// console.log('outside sku: '+$sku);
		// if($sku.trim()!='' && $sku != 'undefined' && $sku != null){
			// $(".select2-search__field").val($sku).trigger(
	        	// jQuery.Event( 'keydown', { keyCode: 65, which: 65 } )
	    	// );
		// }
	});

	// confirm to use item from inventory
	$(document).on('click', '#btn_cnf_inv_item', function(){
		var in_items_id = $("#in_items_id").val();
		if(in_items_id=='' || in_items_id == '0' || in_items_id == null){
			// clear_order_items();
		}
		else{
			var row_id = $("#i_row_id").val();
			var sku = $("#i_sku").val();
			var desc = $("#i_desc").val();
			var dims = $("#i_dims").val();
			var length = Math.ceil($("#i_length").val());
			var width = Math.ceil($("#i_width").val());
			var height = Math.ceil($("#i_height").val());
			var stock = $("#i_stock").val();
			var qty = $("#a_qty").val();
			if(parseInt(stock) <=0){
				alert('You cannot add item due to out of stock inventory. Please reconcile inventory.');
			}
			else if(parseInt(qty) > parseInt(stock)){
				alert('Quantity cannot more than '+stock+'. Please reconcile inventory.');
			}
			else{
				//Calculate cubes
				var l = parseFloat(length);
				var w = parseFloat(width);
				var h = parseFloat(height);
				var cubes = (l*w*h)/1728.0;
				cubes = parseFloat(cubes).toFixed(1);
				
				if((cubes % 1) >= 0.5){
					cubes = Math.ceil(cubes);
				}
				else{
					cubes = Math.floor(cubes);
				}
				cubes = (cubes?cubes:0);

				var q = parseInt(qty);
				q = q?q:1;
				cubes = cubes * q;
				// console.log('cubes: '+cubes);
				$("#i_cubes").val(cubes);
				//Calculate cubes close

				
				var is_edit_order = $("#is_edit_order").val();
				var items_options_str = '';
				for(var i=0;i<items_arr.length;i++){
					if(items_arr[i]['is_custom'] == 0 )
						items_options_str += '<option value="'+items_arr[i]['id']+'">'+items_arr[i]['item_name']+'</option>';
				}

				var str = '';
				if(row_id==''){
					row_count++;
					var item_qty_edit_str = '';
					if(is_edit_order == '1'){
						item_qty_edit_str = 
						  '<td>'+
		                  	'<input class="form-control padding_5px common_item_'+row_count+'" min="0" value="0" type="number" name="item_qty_for_delivery[]" id="item_qty_for_delivery_'+row_count+'" required>'+
		                  '</td>'+
						  '<td>'+
		                  	'<input class="form-control padding_5px common_item_'+row_count+'" min="0" value="0" type="number" name="item_qty_delivered[]" id="item_qty_delivered_'+row_count+'" required>'+
		                  '</td>';
					}

					str += '<tr id="row_'+row_count+'">'+
			                  '<td>'+
			                  	'<input class="item_is_custom" type="checkbox" name="is_custom[]" id="is_custom_'+row_count+'" value="'+row_count+'" checked data-it_id_'+row_count+'="" data-in_it_id_'+row_count+'="'+in_items_id+'" data-recv_it_ids_'+row_count+'="" data-item_length_'+row_count+'="'+length+'" data-item_width_'+row_count+'="'+width+'" data-item_height_'+row_count+'="'+height+'" disabled>'+
			                  	'<input type="hidden" name="hidden_is_custom[]" id="hidden_is_custom_'+row_count+'" value="on" >'+
			                  '</td>'+
			                  '<td style="width:20%;">'+
			                  	'<select class="form-control common_item_'+row_count+'" name="package_type[]" id="package_type_'+row_count+'">'+
			                    	'<option value="'+pt_blanket_wrap+'">Blanket Wrap</option>'+
									'<option value="'+pt_carton+'">Carton</option>'+
			                    '</select>'+
			                  '</td>'+
			                  '<td style="width:15%;">'+
			                  	// '<a onclick="add_item_from_inventory('+row_count+')" href="javascript;:"><i class="fa fa-pencil-square fa-lg"></i></a>'+
			                  	// '<input class="form-control padding_5px common_item_'+row_count+'" maxlength="100" type="text" name="item_sku[]" id="item_sku_'+row_count+'" value="'+sku+'" placeholder="Enter SKU">'+
			                  	'<div class="input-group">'+
					                '<div class="input-group-btn" id="btn_edit_item_inv_'+row_count+'">'+
					                	'<button type="button" class="btn btn-danger btn-sm" onclick="add_item_from_inventory('+row_count+')"><i class="fa fa-pencil-square"></i></button>'+
					                '</div>'+
					                '<input class="form-control padding_5px common_item_'+row_count+'" maxlength="100" type="text" name="item_sku[]" id="item_sku_'+row_count+'" value="'+(sku)+'" placeholder="SKU" readonly>'+
					            '</div>'+
			                  '</td>'+
			                  '<td style="width:20%;">'+
			                  	'<select onchange="item_changed('+row_count+')" style="display:none;" class="form-control common_item_'+row_count+' item_name_'+row_count+'" name="item_name[]" id="item_name_menu_'+row_count+'" disabled required>'+
			                    	'<option value="">-Select Item-</option>'+
									items_options_str+
			                    '</select>'+
			                    '<input class="form-control common_item_'+row_count+' item_name_'+row_count+'" type="text" name="item_name[]" id="item_name_text_'+row_count+'" value="'+(desc)+'" placeholder="Enter item" required readonly>'+
			                    '<input type="hidden" name="it_id[]" id="it_id_'+row_count+'" value="0" >'+
			                    '<input type="hidden" name="in_it_id[]" id="in_it_id_'+row_count+'" value="'+in_items_id+'" data-row_id="'+row_count+'" >'+
			                    '<input type="hidden" name="receive_in_record_items_id[]" id="receive_in_record_items_id_'+row_count+'" value="0" >'+
			                  '</td>'+
			                  
			                  '<td>'+
			                  	'<input onkeyup=calc_cubes('+row_count+') class="form-control padding_5px common_item_'+row_count+'" min="1" value="'+length+'" type="number" name="item_length[]" id="item_length_'+row_count+'"  required readonly>'+
			                  '</td>'+
			                  '<td>'+
			                  	'<input onkeyup=calc_cubes('+row_count+') class="form-control padding_5px common_item_'+row_count+'" min="1" value="'+width+'" type="number" name="item_width[]" id="item_width_'+row_count+'"  required readonly>'+
			                  '</td>'+
			                  '<td>'+
			                  	'<input onkeyup=calc_cubes('+row_count+') class="form-control padding_5px common_item_'+row_count+'" min="1" value="'+height+'" type="number" name="item_height[]" id="item_height_'+row_count+'"  required readonly>'+
			                  '</td>'+
			                  '<td>'+
			                  	'<input class="form-control padding_5px common_item_'+row_count+'" min="1" value="1" type="number" name="item_weight[]" id="item_weight_'+row_count+'"  required>'+
			                  '</td>'+
			                  '<td>'+
			                  	'<input onkeyup=calc_cubes('+row_count+') class="form-control padding_5px common_item_'+row_count+'" min="1" value="'+qty+'" type="number" name="item_qty[]" id="item_qty_'+row_count+'" required>'+
			                  '</td>'+
			                  item_qty_edit_str+
			                  '<td>'+
			                  	'<input class="form-control padding_5px common_item_'+row_count+'" min="0" value="'+cubes+'" type="number" name="item_cubes[]" id="item_cubes_'+row_count+'" readonly>'+
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
			        $(str).insertBefore("#add_item_row");
				}
				else{
					// row_count = row_id;
					// $("#row_"+row_id).remove();
					$('#is_custom_'+row_id).attr('checked', true);

					$('#is_custom_'+row_id).attr('data-in_it_id_'+row_id, in_items_id);
					$('#is_custom_'+row_id).attr('data-item_length_'+row_id, length);
					$('#is_custom_'+row_id).attr('data-item_width_'+row_id, width);
					$('#is_custom_'+row_id).attr('data-item_height_'+row_id, height);


					item_custom(row_id);

					$('#in_it_id_'+row_id).val(in_items_id);
					$('#item_sku_'+row_id).val(sku);
					$('#item_name_text_'+row_id).val(desc);
					$('#item_length_'+row_id).val(length);
					$('#item_width_'+row_id).val(width);
					$('#item_height_'+row_id).val(height);
					$('#item_qty_'+row_id).val(qty);
					$('#item_cubes_'+row_id).val(cubes);
				}
		        
				$("#inv_item_form_modal").modal('hide');
			}
		}
	});

	$(document).on('change', '.common_chk_inv_i', function(){
		var linked_inv_item = [];
        $.each($("input[name='link_in_it_id']:checked"), function(){            
            linked_inv_item.push($(this).val());
        });
        var linked_inv_item_str = linked_inv_item.join(', ');
        var total_linked_inv_item = linked_inv_item.length;
		if(total_linked_inv_item == 0) {
			$("#linked_inv_item_skus").val("");
		} else {
			$("#linked_inv_item_skus").val(linked_inv_item_str);
		}
	});
	
});

function add_item_from_inventory(row_id){
	var u_id = $("#users_id").val();
	if(typeof(u_id) == undefined || u_id == '' || u_id == '0'){
		showFlashModal(false,'Please choose customer first');
		$(document).on('click', '.close', function(){
			customerSelect.select2('open');
		});
	}
	else{
		resetFields('inv_item_form_div');
		$("#i_row_id").val(row_id);
		$("#inv_item_form_modal").modal('show');
		setTimeout(function(){ invItemSelect.select2('open'); }, 500);
		
	}
}