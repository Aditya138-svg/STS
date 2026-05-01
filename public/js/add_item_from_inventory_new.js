var customerSelect, invItemSelect;
// 8 April 2019 at 05:21:40 PM
// Updated: 3 April 2023 at 06:39:00 PM
$(function(){
	customerSelect = $("#users_id");
	invItemSelect = $("#in_items_id");

	//Change customer
	// $(document).on('change', '#users_id', function(){
	customerSelect
	.on("select2:select", function (e) { 
		var is_item_from_inventory = false;
		var data = e.params.data;
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
				if(old_users_id!=''){
					$("#users_id").val(old_users_id).trigger('change');
				}
			}
		}
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
		if(typeof(u_id) == undefined || u_id == '' || u_id == '0' || u_id == null){
			showFlashModal(false,'Please choose customer first');
			$(document).on('click', '.close', function(){
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
			$("#a_sku").html(i_sku);
			$("#a_desc").html(i_desc);
			$("#a_dims").html(i_dims);
			// $("#a_stock").html(i_stock);
			$("#a_stock").html(i_stock_str);
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
				var is_edit_order = $("#is_edit_order").val();
				if(row_id==''){
					var i_data = {
						'in_it_id' : in_items_id,
						'receive_in_record_items_id' : '0',
						'item_sku' : sku,
						'item_name' : desc,
						'item_length' : length,
						'item_width' : width,
						'item_height' : height,
						'item_qty' : qty,
					};
					create_line_item('i', i_data);
				} else {
					// row_count = row_id;
					// $("#row_"+row_id).remove();
					$('#is_custom_'+row_id).attr('checked', true);

					$('#is_custom_'+row_id).attr('data-in_it_id', in_items_id);
					$('#is_custom_'+row_id).attr('data-item_length', length);
					$('#is_custom_'+row_id).attr('data-item_width', width);
					$('#is_custom_'+row_id).attr('data-item_height', height);


					item_custom(row_id);

					$('#in_it_id_'+row_id).val(in_items_id);
					$('#item_sku_'+row_id).val(sku);
					$('#item_name_text_'+row_id).val(desc);
					$('#item_length_'+row_id).val(length);
					$('#item_width_'+row_id).val(width);
					$('#item_height_'+row_id).val(height);
					$('#item_qty_'+row_id).val(qty);
					cubes = calculate_cubes(length,width,height,qty);
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