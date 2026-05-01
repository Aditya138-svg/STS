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
					var old_recv_items_ids = $('#is_custom_'+row_id).attr('data-recv_it_ids');
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
			// console.log(item_sp) ;
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
				recv_id     = item_sp[0].replace('receiver ID:','').replace('-NA-','');
				r_item_id   = item_sp[1].replace('item ID:','').replace('-NA-','');
				item_name   = item_sp[2].replace('item name:','').replace('-NA-','');
				var item_sku     = item_sp[3].replace('item sku:','').replace('-NA-','-NA-');
				var item_pr_code = item_sp[4].replace('item PR Code:','').replace('-NA-','-NA-');
				rack_name   = item_sp[5].replace('rack:','').replace('-NA-','-NA-');
				name        = item_sp[6].replace('name:','').replace('-NA-','-NA-');
				company_name= item_sp[7].replace('company:','').replace('-NA-','-NA-');
				email       = item_sp[8].replace('email:','').replace('-NA-','-NA-');

				// Log values for debugging
				// console.log("Item Name:", item_name);
				// console.log("Item SKU:", item_sku);
				// console.log("Item PR Code:", item_pr_code);
				// console.log("Rack Name:", rack_name);
				// console.log("Name:", name);
				// console.log("Company:", company_name);
				// console.log("Email:", email);

				// Push item name to the whitelist if not already present
				if(item_name != '' && wh_it_name.indexOf(item_name) === -1){
					wh_it_name.push(item_name);
				}

				// Combine general info
				var gen_info_arr = [];
				if(name != ''){
					gen_info_arr.push(name);
				}
				if(company_name != ''){
					gen_info_arr.push(company_name);
				}
				if(email != ''){
					gen_info_arr.push(email);
				}
				var gen_info = gen_info_arr.join('<br>');

				// Shipping info
				po_number = item_sp[9].replace('po number:','').replace('-NA-','');
				customer_ref = item_sp[10].replace('customer ref:','').replace('-NA-','');
				var general_info = 'company:' + company_name + '<br>' + 'email:' + email ;

				// Carrier info
				carrier_name = item_sp[11].replace('carrier name:','').replace('-NA-','');
				tracking_number = item_sp[12].replace('tracking number:','').replace('-NA-','');
				assigned_to_order = item_sp[13].replace('assigned to order:','').replace('-NA-','-NA-');
				var carrier_info = 'carrier name:' + carrier_name + '</br>' + 'tracking number:' + tracking_number; ;
				var ship_info = "po number:" + po_number ;
				r_item_id = r_item_id.trim() ; 
				// Append row to table with hidden inputs for ID, SKU, and PR Code
				var i_tr = '<tr id="r_item_'+r_item_id+'">' +
 							'<th>' +
								'<a href="javascript:;" class="text text-red" onclick="remove_recv_item(' + r_item_id + ')"><i class="fa fa-trash fa-lg"></i></a>' +
							'</th>' +
							'<th>' +
								'<input type="hidden" name="ex_items_id_h" id="ex_items_id_h_' + r_item_id + '" value="' + r_item_id + '">' +
								'<input type="hidden" name="ex_items_sku_h" id="ex_items_sku_h_' + r_item_id + '" value="' + item_sku + '">' +
								'<input type="hidden" name="ex_items_pr_code_h" id="ex_items_pr_code_h_' + r_item_id + '" value="' + item_pr_code + '">' +
								'#' + r_item_id + ': ' + item_name +
								'<br>Recv. ID: ' + recv_id +
							'</th>' +
							'<th>' + assigned_to_order + '</th>' + 
							'<th>' + item_sku + '</th>' + 
							'<th>' + rack_name + '</th>' +
							'<th>' + general_info  + '</th>' +
							'<th>' + carrier_info + '</th>' +
							'<th>' + ship_info + '</th>' +
							'<th>' + item_pr_code + '</th>' +
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
	// Common function to clean array values
	function cleanValues(arr) {
		return [...new Set(arr.filter(val => val && !INVALID_VALUES.includes(val.trim())))];
	}

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
			var sku = [];
			$("input[name='ex_items_sku_h']").each(function(){
				sku.push($(this).val());
			});
			sku = cleanValues(sku).join(',');
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
				var desc = wh_it_name.join(', ');
				// console.log('desc: '+unescapeHtmlAlternate(desc));
				desc = unescapeHtmlAlternate(desc);
				desc = cleanValues(desc.split(',')).join(',');
				var recv_items_ids = ex_items_id.join(',');
				var is_edit_order = $("#is_edit_order").val();
				if(row_id==''){
					var i_data = {
						'receive_in_record_items_id' : recv_items_ids,
						'item_sku' : sku,
						'item_name' : desc,
						'item_qty' : qty,
					};
					create_line_item('rn', i_data);
					
				} else {
					// row_count = row_id;
					// $("#row_"+row_id).remove();
					$('#is_custom_'+row_id).attr('checked', true);
					var old_recv_items_ids = $('#is_custom_'+row_id).attr('data-recv_it_ids');
					// var gl_ex_recv_items_id = $("#gl_ex_recv_items_id").val().split(",");
					
					// $("#gl_ex_recv_items_id").val(new_ex_items_id.join(","));
					$('#is_custom_'+row_id).attr('data-recv_it_ids', recv_items_ids);
					$('#is_custom_'+row_id).attr('data-item_length', length);
					$('#is_custom_'+row_id).attr('data-item_width', width);
					$('#is_custom_'+row_id).attr('data-item_height', height);


					item_custom(row_id);

					$('#receive_in_record_items_id_'+row_id).val(recv_items_ids);
					$('#item_sku_'+row_id).val((sku));
					$('#item_name_text_'+row_id).val(desc);
					$('#item_length_'+row_id).val(length);
					$('#item_width_'+row_id).val(width);
					$('#item_height_'+row_id).val(height);
					$('#item_qty_'+row_id).val(qty);
					cubes = calculate_cubes(length,width,height,qty);
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