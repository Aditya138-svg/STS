var recvItemSelect;
// 24 May 2019 at 09:11:00 AM
var wh_it_name = [];
$(function(){
	
	recvItemSelect = $("#recv_items_id");

	// Click add item from recventroy button
	$(document).on('click', '#btn_add_item_from_recv', function(event){
		resetFields('recv_item_form_div');
		$("#recv_item_form_modal").modal('show');
	});

	//recventory item select2
	recvItemSelect.select2({
	    ajax: {
	        url: get_recv_items_list_select2,
	        dataType: 'json',
	        data: function(params) {
	        	var ex_items_id = [];
	        	var ex_items_id_length = $('input[name="ex_items_id_h"]').length;
	        	// console.log("ex_items_id_length: "+ex_items_id_length);
	        	if(ex_items_id_length>0){
	        		$.each($("input[name='ex_items_id_h']"), function(){
	        			ex_items_id.push($(this).val());
	        		});
	        	}

	        	var row_id = $("#recv_i_row_id").val();
	        	// var gl_ex_recv_items_id = $("#gl_ex_recv_items_id").val().split(",");
	        	var gl_ex_recv_items_id = get_ex_recv_items_id();
	        	// if(gl_ex_recv_items_id==''){
				// 	gl_ex_recv_items_id = [];
				// }
				var new_ex_items_id = [];
				if(row_id!=''){
					var old_recv_items_ids = $('#is_custom_'+row_id).attr('data-recv_it_ids_'+row_id);
					for(var i=0;i<gl_ex_recv_items_id.length;i++){
						if(old_recv_items_ids.indexOf(gl_ex_recv_items_id[i])==-1){
							new_ex_items_id.push(gl_ex_recv_items_id[i]);
						}
					}
					new_ex_items_id = $.merge( new_ex_items_id, ex_items_id );
				}
				else{
					new_ex_items_id = $.merge( gl_ex_recv_items_id, ex_items_id );
				}
				
	        	// var new_ex_items_id = $.merge( gl_ex_recv_items_id, ex_items_id );
	        	// console.log('ex_items_id: ', ex_items_id);
	        	// console.log('new_ex_items_id: ', new_ex_items_id);
	            return {
	                term: params.term || '',
	                page: params.page || 1,
	                receiving_item_type: receiving_item_type,
	                ex_items_id: new_ex_items_id
	            }
	        },
	        processResults: function (data, params) {
		      	// parse the results into the format expected by Select2
		      	// since we are using custom formatting functions we do not need to
		      	// alter the remote JSON data, except to indicate that infinite
		      	// scrolling can be used
		      	params.page = params.page || 1;
		      	// console.log('data.results: ', data.results);
		      	return {
			        results: data.results,
			        pagination: {
			          	more: (params.page * 10) < data.total_count
			        }
		      	};
		    },
	        cache: true
	    },
	    placeholder: '-Select Item From Receiver-',
	    width: '300px',
		// dropdownAutoWidth: false,
	    allowClear: true
	})
	.on("change", function (e) {
		var recv_items_id = $(this).val();
		// console.log("on change recv_items_id" + recv_items_id);
		
		if(recv_items_id!=null && recv_items_id!='' && recv_items_id!='0'){

			$("#recv_item_form_div").show();
		}
	})
	.on("select2:select", function (e) {
		var data = e.params.data;
		// var item_str = data.text;
		// // var item_str = escapeHtmlAlternate(String(data.text));
		// console.log(item_str);

		// var recv_items_id = $(this).val();
		// console.log("recv_items_id: "+recv_items_id);

		// if(item_str!='' && recv_items_id!=null && recv_items_id!='' && recv_items_id!='0'){
		
		// }
	})
	.on("select2:close", function (e) {
		// var recv_items_id = $(this).val();
		// console.log("on close recv_items_id" + recv_items_id);
	})
	.on("select2:open", function(e) { 
	   	var recv_items_id = $(this).val();
		// console.log("on open recv_items_id" + recv_items_id);
		if(recv_items_id=='' || recv_items_id == '0' || recv_items_id == null){
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

	// Add to bucket
	$(document).on('click', '#btn_add_to_bucket', function(){
		var recv_items_id = $("#recv_items_id").val();
		var item_str = $('#recv_items_id option:selected').html();
		
		// console.log(item_str);
		// console.log("recv_items_id: "+recv_items_id);

		if(item_str!='' && recv_items_id!=null && recv_items_id!='' && recv_items_id!='0'){
			var item_sp = item_str.split(', ');
			var item_parse_len = item_sp.length;
			// console.log('item_sp:', item_sp);
			// console.log('item_parse_len:'+ item_parse_len);
			var recv_id=0;
			var r_item_id=0;
			var item_name='';
			var rack_name='';
			var name='';
			var company_name='';
			var email='';
			var po_number='';
			var customer_ref='';
			var carrier_name='';
			var tracking_number='';
			var assigned_to_order='';
			if(item_parse_len > 0){
				recv_id = item_sp[0].replace('receiver ID:','').replace('-NA-','');
				r_item_id = item_sp[1].replace('item ID:','').replace('-NA-','');
				item_name=item_sp[2].replace('item name:','').replace('-NA-','');
				// console.log('item_name: '+(item_name));
				if(item_name!='' && wh_it_name.indexOf(item_name.toLowerCase()) ==-1){
					wh_it_name.push(item_name.toLowerCase());
				}
				rack_name=item_sp[3].replace('rack:','').replace('-NA-','');
				name=item_sp[4].replace('name:','').replace('-NA-','');
				company_name=item_sp[5].replace('company:','').replace('-NA-','');
				email=item_sp[6].replace('email:','').replace('-NA-','');
				var gen_info_arr = [];
				if(name!=''){
					gen_info_arr.push(name);
				}
				if(company_name!=''){
					gen_info_arr.push(company_name);
				}
				if(email!=''){
					gen_info_arr.push(email);
				}
				var gen_info = gen_info_arr.join('<br>');
				po_number=item_sp[7].replace('po number:','').replace('-NA-','');
				customer_ref=item_sp[8].replace('customer ref:','').replace('-NA-','');
				var ship_info = po_number+'<br>'+customer_ref;
				carrier_name=item_sp[9].replace('carrier name:','').replace('-NA-','');
				tracking_number=item_sp[10].replace('tracking number:','').replace('-NA-','');
				assigned_to_order=item_sp[11].replace('assigned to order:','').replace('-NA-','');
				var carrier_info = carrier_name+'<br>'+tracking_number;
				var i_tr = 	'<tr id="r_item_'+r_item_id+'">'+
								'<th>'+
									'<a href="javascript:;" class="text text-red" onclick="remove_recv_item('+r_item_id+')"><i class="fa fa-trash fa-lg"></i></a>'+
								'</th>'+
								'<th>'+
									'<input type="hidden" name="ex_items_id_h" id="ex_items_id_h_'+r_item_id+'" value="'+r_item_id+'">'+
									'#'+r_item_id+':'+(item_name)+
									'<br>Recv. ID: '+ recv_id+
								'</th>'+
								'<th>'+(assigned_to_order)+'</th>'+
								'<th>'+(rack_name)+'</th>'+
								'<th>'+(gen_info)+'</th>'+
								'<th>'+(carrier_info)+'</th>'+
								'<th>'+(ship_info)+'</th>'+
							'</tr>';
				$("#recv_item_table").append(i_tr);
				var recv_item_qty = parseInt($("#recv_item_qty").text());
				if(recv_item_qty>=0){
					recv_item_qty = recv_item_qty +1;
				}
				else{
					recv_item_qty = 0;
				}
				$("#recv_item_qty").text(recv_item_qty);
				$("#recv_items_id").val(null).trigger('change');
			}
		}
		else{
			alert('Please choose receiving item first.');
		}
	});

	// confirm to use item from recventory
	$(document).on('click', '#btn_cnf_recv_item', function(){
		var ex_items_id = [];
    	var ex_items_id_length = $('input[name="ex_items_id_h"]').length;
    	// console.log("ex_items_id_length: "+ex_items_id_length);
    	if(ex_items_id_length>0){
    		$.each($("input[name='ex_items_id_h']"), function(){
    			ex_items_id.push($(this).val());
    		});
    	}

		if(ex_items_id.length==0){
			alert('Please choose receiving item first');
		}
		else{
			var gl_ex_recv_items_id = get_ex_recv_items_id();
			
			var row_id = $("#recv_i_row_id").val();
			var sku = '';
			var desc = '';
			var dims = '';
			var length = 1;
			var width = 1;
			var height = 1;
			
			var qty = parseInt($("#recv_item_qty").text());
			if(parseInt(qty) <=0){
				alert('Please add item first.');
			}
			else{
				//Calculate cubes
				// var l = parseFloat(length);
				// var w = parseFloat(width);
				// var h = parseFloat(height);
				console.log("wh_it_name: ", wh_it_name);
				var desc = wh_it_name.join(', ');
				console.log('desc: '+unescapeHtmlAlternate(desc));
				var l = 1;
				var w = 1;
				var h = 1;
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
				//Calculate cubes close

				var recv_items_ids = ex_items_id.join(',');
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
			                  	'<input  class="item_is_custom" type="checkbox" name="is_custom[]" id="is_custom_'+row_count+'" value="'+row_count+'" checked data-it_id_'+row_count+'="" data-in_it_id_'+row_count+'="" data-recv_it_ids_'+row_count+'="'+recv_items_ids+'" data-item_length_'+row_count+'="'+length+'" data-item_width_'+row_count+'="'+width+'" data-item_height_'+row_count+'="'+height+'" disabled>'+
			                  	'<input type="hidden" name="hidden_is_custom[]" id="hidden_is_custom_'+row_count+'" value="on" >'+
			                  '</td>'+
			                  '<td style="width:20%;">'+
			                  	'<select class="form-control common_item_'+row_count+'" name="package_type[]" id="package_type_'+row_count+'">'+
			                    	'<option value="'+pt_blanket_wrap+'">Blanket Wrap</option>'+
									'<option value="'+pt_carton+'">Carton</option>'+
			                    '</select>'+
			                  '</td>'+
			                  '<td style="width:15%;">'+
			                  	// '<a onclick="add_item_from_recventory('+row_count+')" href="javascript;:"><i class="fa fa-pencil-square fa-lg"></i></a>'+
			                  	// '<input class="form-control padding_5px common_item_'+row_count+'" maxlength="100" type="text" name="item_sku[]" id="item_sku_'+row_count+'" value="'+sku+'" placeholder="Enter SKU">'+
			                  	'<div class="input-group">'+
					                '<div class="input-group-btn" id="btn_edit_item_recv_'+row_count+'">'+
					                	'<button type="button" class="btn btn-danger btn-sm" onclick="add_item_from_receiver('+row_count+')"><i class="fa fa-pencil-square"></i></button>'+
					                '</div>'+
					                '<input class="form-control padding_5px common_item_'+row_count+'" maxlength="100" type="text" name="item_sku[]" id="item_sku_'+row_count+'" value="" placeholder="SKU" >'+
					            '</div>'+
			                  '</td>'+
			                  '<td style="width:20%;">'+
			                  	'<select onchange="item_changed('+row_count+')" style="display:none;" class="form-control common_item_'+row_count+' item_name_'+row_count+'" name="item_name[]" id="item_name_menu_'+row_count+'" disabled required>'+
			                    	'<option value="">-Select Item-</option>'+
									items_options_str+
			                    '</select>'+
			                    '<input class="form-control common_item_'+row_count+' item_name_'+row_count+'" type="text" name="item_name[]" id="item_name_text_'+row_count+'" value="" placeholder="Enter item" required >'+
			                    '<input type="hidden" name="it_id[]" id="it_id_'+row_count+'" value="0" >'+
			                    '<input type="hidden" name="in_it_id[]" id="in_it_id_'+row_count+'" value="" data-row_id="'+row_count+'" >'+
			                    '<input type="hidden" name="receive_in_record_items_id[]" id="receive_in_record_items_id_'+row_count+'" value="'+recv_items_ids+'" >'+
			                  '</td>'+
			                  
			                  '<td>'+
			                  	'<input onkeyup=calc_cubes('+row_count+') class="form-control line_item padding_5px common_item_'+row_count+'" min="1" value="'+length+'" type="number" name="item_length[]" id="item_length_'+row_count+'"  required >'+
			                  '</td>'+
			                  '<td>'+
			                  	'<input onkeyup=calc_cubes('+row_count+') class="form-control line_item padding_5px common_item_'+row_count+'" min="1" value="'+width+'" type="number" name="item_width[]" id="item_width_'+row_count+'"  required >'+
			                  '</td>'+
			                  '<td>'+
			                  	'<input onkeyup=calc_cubes('+row_count+') class="form-control line_item padding_5px common_item_'+row_count+'" min="1" value="'+height+'" type="number" name="item_height[]" id="item_height_'+row_count+'"  required >'+
			                  '</td>'+
			                  '<td>'+
			                  	'<input class="form-control line_item padding_5px common_item_'+row_count+'" min="1" value="1" type="number" name="item_weight[]" id="item_weight_'+row_count+'"  required>'+
			                  '</td>'+
			                  '<td>'+
			                  	'<input onkeyup=calc_cubes('+row_count+') class="form-control line_item padding_5px common_item_'+row_count+'" min="1" value="'+qty+'" type="number" name="item_qty[]" id="item_qty_'+row_count+'" required>'+
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
			        $("#item_sku_"+row_count).val(unescapeHtmlAlternate(sku));
			        $("#item_name_text_"+row_count).val(unescapeHtmlAlternate(desc));
				}
				else{
					// row_count = row_id;
					// $("#row_"+row_id).remove();
					$('#is_custom_'+row_id).attr('checked', true);
					var old_recv_items_ids = $('#is_custom_'+row_id).attr('data-recv_it_ids_'+row_id);
					// var gl_ex_recv_items_id = $("#gl_ex_recv_items_id").val().split(",");
					
					// $("#gl_ex_recv_items_id").val(new_ex_items_id.join(","));
					$('#is_custom_'+row_id).attr('data-recv_it_ids_'+row_id, recv_items_ids);
					$('#is_custom_'+row_id).attr('data-item_length_'+row_id, length);
					$('#is_custom_'+row_id).attr('data-item_width_'+row_id, width);
					$('#is_custom_'+row_id).attr('data-item_height_'+row_id, height);


					item_custom(row_id);

					$('#receive_in_record_items_id_'+row_id).val(recv_items_ids);
					$('#item_sku_'+row_id).val((sku));
					$('#item_name_text_'+row_id).val(desc);
					$('#item_length_'+row_id).val(length);
					$('#item_width_'+row_id).val(width);
					$('#item_height_'+row_id).val(height);
					$('#item_qty_'+row_id).val(qty);
					$('#item_cubes_'+row_id).val(cubes);
				}
		        
				$("#recv_item_form_modal").modal('hide');
			}
		}
	});
});


function get_ex_recv_items_id(){
	var ex_recv_items_id = [];
	$.each($("input[name='receive_in_record_items_id[]']"), function(){
		var receive_in_record_items_id = $(this).val();
		// console.log('receive_in_record_items_id: '+ receive_in_record_items_id);
		if(!(receive_in_record_items_id == '' || receive_in_record_items_id == '0' || receive_in_record_items_id == 'undefined' || receive_in_record_items_id === null || receive_in_record_items_id == 'null')){
			ex_recv_items_id = $.merge(ex_recv_items_id, receive_in_record_items_id.split(","));
		}
    });
    return ex_recv_items_id;
}

function remove_recv_item(r_item_id){
	var r = confirm("Do you really want to remove item?");
	if(r==true){
		$("#r_item_"+r_item_id).remove();
		var recv_item_qty = parseInt($("#recv_item_qty").text());
		if(recv_item_qty>=0){
			recv_item_qty = recv_item_qty-1;
		}
		else{
			recv_item_qty = 0;
		}
		$("#recv_item_qty").text(recv_item_qty);
	}
}

function add_item_from_receiver(row_id){
	resetFields('recv_item_form_div');
	$("#recv_i_row_id").val(row_id);
	$("#recv_item_form_modal").modal('show');
	setTimeout(function(){ recvItemSelect.select2('open'); }, 500);
}