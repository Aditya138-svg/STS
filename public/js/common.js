//
// $('#element').donetyping(callback[, timeout=1000])
// Fires callback when a user has finished typing. This is determined by the time elapsed
// since the last keystroke and timeout parameter or the blur event--whichever comes first.
//   @callback: function to be called when even triggers
//   @timeout:  (default=1000) timeout, in ms, to to wait before triggering event if not
//              caused by blur.
// Requires jQuery 1.7+
//
;(function($){
    $.fn.extend({
        donetyping: function(callback,timeout){
            timeout = timeout || 1e3; // 1 second default timeout
            var timeoutReference,
                doneTyping = function(el){
                    if (!timeoutReference) return;
                    timeoutReference = null;
                    callback.call(el);
                };
            return this.each(function(i,el){
                var $el = $(el);
                // Chrome Fix (Use keyup over keypress to detect backspace)
                // thank you @palerdot
                $el.is(':input') && $el.on('input keyup keypress cut paste',function(e){
                    var BACKSPACE = 8; var UP = 38; var DOWN = 40;
                    var STR_BACKSPACE = 'Backspace'; var STR_UP = 'Up'; var STR_DOWN = 'Down';
                    var skip_key_codes = [BACKSPACE];
                    var skip_keys = [STR_BACKSPACE];
                    // This catches the backspace, up, down button in chrome, but also prevents
                    // the event from triggering too preemptively. Without this line,
                    // using tab/shift+tab will make the focused element fire the callback.
                    if(e.key !== undefined){
                        if (e.type=='keyup' && skip_keys.indexOf(e.key) == -1) return;
                    }
                    if(e.keyCode !== undefined){ //keyCode is deprecated and now key is operable
                        if (e.type=='keyup' && skip_key_codes.indexOf(e.keyCode) == -1) return;
                    }
                    
                    // Check if timeout has been set. If it has, "reset" the clock and
                    // start over again.
                    if (timeoutReference) clearTimeout(timeoutReference);
                    timeoutReference = setTimeout(function(){
                        // if we made it here, our timeout has elapsed. Fire the
                        // callback
                        doneTyping(el);
                    }, timeout);
                }).on('blur',function(){
                    // If we can, fire the event since we're leaving the field
                    doneTyping(el);
                });
            });
        }
    });
})(jQuery);

//countries instance
var select_countries_id = $("#countries_id"); 
$(document).ready(function() {
    $('.address--sidebar').height($(window).height());
    $('.address--sidebar').css('overflow-y', 'auto');
	setTimeout(function(){
		// console.log('dd1');
		if($('#flash_msg_modal').hasClass('in')){
			// console.log('dd2');
			if($('#flash_msg_modal .modal-header').hasClass('alert-success')){
				$('#flash_msg_modal .close').trigger('click');
			}
		}
	},3500);

    $(document).on('click', '.masonry .panel-heading span.clickable', function(e){
        var $this = $(this);
        if(!$this.hasClass('panel-collapsed')) {
            $this.parents('.panel').find('.panel-body').slideUp();
            $this.addClass('panel-collapsed');
            $this.find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        } else {
            $this.parents('.panel').find('.panel-body').slideDown();
            $this.removeClass('panel-collapsed');
            $this.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        }
    });
    
	$(document).ajaxComplete(function( event, xhr, settings ) {
		if(IsJsonString(xhr.responseText) == true){
			var obj = JSON.parse(xhr.responseText);
			var request_Status = obj.status;
			var request_code = obj.code;
			var request_message = obj.message;
			// console.log(obj);
			if(request_code == 401 && request_Status == false){
				// console.log('fff');
				event.stopPropagation();
				
				// location.reload();
				setTimeout(function(){
					if(!$('#flash_msg_modal').hasClass('in')){
						// console.log('ddd');
						showFlashModal(false,request_message);
					}
				},1500);	
				setTimeout(function () {
					location.reload();
				},5000);
				
			}else if(request_Status == true){
				// console.log(obj);
				setTimeout(function(){
					if($('#flash_msg_modal').hasClass('in')){
						$('#flash_msg_modal .close').trigger('click');
					}
				},3500);
			}
		}
	});
    
    $( document ).ajaxError(function( event, xhr, settings ) {
        if(IsJsonString(xhr.responseText) == true){
            var parse_error = JSON.parse(xhr.responseText);
            // console.log('parse_error:'+ parse_error.error);
            if(parse_error.error !== undefined && parse_error.error == 'Unauthenticated.'){
                showFlashModal(false,'Your session has expired. Please login again.');
                $(".close, .modal").click(function(){
                    window.location.reload();
                });
            }
        }
    });

	$('.modal').modal({
		backdrop: 'static',
		keyboard: false,
		show: false,
	});
	$('.datepicker').datepicker({
		autoclose: true,
		format: 'mm/dd/yyyy',
	});
	
	var dtToday = new Date();
    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();

    if(month < 10)
        month = '0' + month.toString();
    if(day < 10)
        day = '0' + day.toString();

    var maxDate = year + '-' + month + '-' + day;    
    $('#dob').attr('max', maxDate);
	
	//datatable
		
	//datatable close
    $(".option-heading").click(function() {
        $(this).next(".option-content").stop().slideToggle(500);
        $(this).find(".fa-arrow-circle-right, .fa-arrow-circle-down").toggle();
    });
	
    //Verify zipcode
    /**
     * Implementation of our price model calculation based in entire web app
     * @author Sandeep Rawat
     * @date 2020-03-14 / 2022-05-10
    **/
    $(document).on('click', '.btn_verify_zip', function(e){
        //our pricing
        var zipcode = '';
        var proceed_flag = false;
        var proceed_msg = 'Something Went Wrong!! Please try again.';
        var frm = $(this).attr('data-frm');
        var srtype = $(this).attr('data-srtype');
        if(frm == 'q' || frm == 'o'){
            if(srtype == 'o'){
                zipcode = $("#origin_zip").val();
                proceed_flag = true;
            }
            else if(srtype == 'd'){
                zipcode = $("#dest_zip").val();
                proceed_flag = true;
            }
            else{
                proceed_flag = false;
            }
        }
        if(zipcode == ''){
            showFlashModal(false, 'The ZipCode field is required and can\'t be empty.');
        }
        else if(proceed_flag == false){
            showFlashModal(false, proceed_msg);
        }
        else{
            var $this = $(this);
            var $loadingText = '<i class="fa fa-circle-notch fa-spin"></i> Verifying...';
            var $this_current_html = $(this).html();

            var datastring = (srtype == 'o')?'originZip='+zipcode:'destinationZip='+zipcode;
            var type = "GET"; //for creating new resource
            var api_url = crm_quote_api_url+'&'+datastring;
            xhr = $.ajax({
                type: type,
                url: api_url,
                beforeSend: function(){
                    if(active_xhr) {
                        xhr.abort();
                    }
                    active_xhr = true;
                    // showLoading();
                    if ( $this_current_html !== $loadingText) {
                    $this.data('original-text', $this_current_html);
                    $this.html($loadingText);
                    $this.attr('disabled',true);
                    }
                },
                success: function (result) {
                    active_xhr = false;
                    $this.html($this.data('original-text')); //Back To Save
                    $this.attr('disabled',false);
                    // console.log(result);
                    
                    var originLocation = '';
                    var originMarket = '';
                    var destinationLocation = '';
                    var destinationMarket = '';

                    if(result.status==true){
                        var output = result.data;

                        var origin = output.origin;
                        var is_origin_service = output.is_origin_service;
                        var destination = output.destination;
                        var is_dest_service = output.is_dest_service;

                        originMarket = is_origin_service;
                        destinationMarket = is_dest_service;
                        var origin_city = '';
                        var origin_state = '';
                        var dest_city = '';
                        var dest_state = '';
                        if(is_origin_service !='No Service' && origin['city'] && origin['state']){
                            originLocation = origin['city'] +', ' + origin['state'];
                            origin_city = origin['city'];
                            origin_state = origin['state'];
                        }
                        if(is_dest_service !='No Service' && destination['city'] && destination['state']){
                            destinationLocation = destination['city'] +', ' + destination['state'];
                            dest_city = destination['city'];
                            dest_state = destination['state'];
                        }

                        var zip_err_msg = appName + ' is not servicing this Zip Code at this time.';  
                        var zip_vrf_msg = appName + ' is servicing this Zip Code.';  
                        
                        if(srtype == 'o'){
                            $("#is_origin_servicable").val('0');
                            if(originMarket == "No Service" && zipcode != ""){
                                showFlashModal(false, zip_err_msg);
                            }
                            else{
                                showFlashModal(true, zip_vrf_msg);
                                $("#is_origin_servicable").val('1');
                            }
                        }
                        else{
                            $("#is_dest_servicable").val('0');
                            if(destinationMarket == "No Service" && zipcode != ""){
                                showFlashModal(false, zip_err_msg);
                            }
                            else{
                                showFlashModal(true, zip_vrf_msg);
                                $("#is_dest_servicable").val('1');
                            }
                        }
                    }
                },
                error: function (data) {
                    active_xhr = false;
                    $this.html($this.data('original-text')); //Back To Save
                    $this.attr('disabled',false);
                    console.log('error',data);
                }
            });
        }
        //our pricing end
    });
    //Verify zipcode close

    /**
     * Implementing new price modal calc based on POST method and eliminate GET method for better security
     */
    //Verify zipcode new
    var $v_xhr;
    var $v_active_xhr = false;
    $(document).on('click', '.btn_verify_zip_new', function(e){
        var zipcode = '';
        var proceed_flag = false;
        var proceed_msg = 'Something Went Wrong!! Please try again.';
        var frm = $(this).attr('data-frm');
        var srtype = $(this).attr('data-srtype');
        if(frm == 'q' || frm == 'o'){
            if(srtype == 'o'){
                zipcode = $("#origin_zip").val();
                proceed_flag = true;
            }
            else if(srtype == 'd'){
                zipcode = $("#dest_zip").val();
                proceed_flag = true;
            }
            else{
                proceed_flag = false;
            }
        }
        if(zipcode == ''){
            showFlashModal(false, 'The ZipCode field is required and can\'t be empty.');
        } else if(proceed_flag == false){
            showFlashModal(false, proceed_msg);
        } else {
            var $v_this = $(this);
            var $v_loadingText = '<i class="fa fa-circle-notch fa-spin"></i> Verifying...';
            var $v_this_current_html = $(this).html();

            if(zipcode != ''){
                var type = "POST";
                var api_url = EST_DEL_CHARGES_URL;
                if(srtype == 'o'){
                    var formdata = {
                        'key' : PRICE_MODEL_API_KEY,
                        'originZip' : zipcode
                    };
                } else {
                    var formdata = {
                        'key' : PRICE_MODEL_API_KEY,
                        'destinationZip' : zipcode
                    };
                }
                
                $v_xhr = $.ajax({
                    type: type,
                    url: api_url,
                    data: formdata,
                    headers: {
                        // 'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
                        'X-CSRF-TOKEN': $('input[name="_token"]').val()
                    },
                    beforeSend: function(){
                        if($v_active_xhr) {
                            $v_xhr.abort();
                        }
                        $v_active_xhr = true;
                        if ( $v_this_current_html !== $v_loadingText) {
                            $v_this.data('original-text', $v_this_current_html);
                            $v_this.html($v_loadingText);
                            $v_this.attr('disabled',true);
                        }
                    },
                    success: function (result) {
                        // console.log(result);
                        $v_active_xhr = false;
                        $v_this.html($v_this.data('original-text')); //Back To Save
                        $v_this.attr('disabled',false);
                        var originLocation = '';
                        var originMarket = '';
                        var destinationLocation = '';
                        var destinationMarket = '';

                        if(result.status==true){
                            var output = result.data;

                            var origin = output.origin;
                            var is_origin_service = output.is_origin_service;
                            var destination = output.destination;
                            var is_dest_service = output.is_dest_service;

                            originMarket = is_origin_service;
                            destinationMarket = is_dest_service;
                            var origin_city = '';
                            var origin_state = '';
                            var dest_city = '';
                            var dest_state = '';
                            if(is_origin_service !='No Service' && origin['city'] && origin['state']){
                                originLocation = origin['city'] +', ' + origin['state'];
                                origin_city = origin['city'];
                                origin_state = origin['state'];
                            }
                            if(is_dest_service !='No Service' && destination['city'] && destination['state']){
                                destinationLocation = destination['city'] +', ' + destination['state'];
                                dest_city = destination['city'];
                                dest_state = destination['state'];
                            }
                            
                            var zip_err_msg = appName + ' is not servicing this Zip Code at this time.';
                            var zip_vrf_msg = appName + ' is servicing this Zip Code.';
                            
                            if(srtype == 'o'){
                                $("#is_origin_servicable").val('0');
                                if(originMarket == "No Service" && zipcode != ""){
                                    showFlashModal(false, zip_err_msg);
                                }
                                else{
                                    showFlashModal(true, zip_vrf_msg);
                                    $("#is_origin_servicable").val('1');
                                }
                            }
                            else{
                                $("#is_dest_servicable").val('0');
                                if(destinationMarket == "No Service" && zipcode != ""){
                                    showFlashModal(false, zip_err_msg);
                                }
                                else{
                                    showFlashModal(true, zip_vrf_msg);
                                    $("#is_dest_servicable").val('1');
                                }
                            }
                        }
                    },
                    error: function (data) {
                        console.log('error',data);
                        $v_active_xhr = false;
                        $v_this.html($v_this.data('original-text')); //Back To Save
                        $v_this.attr('disabled',false);
                    }
                });
            }
        }
    });
    //Verify zipcode new close

    //by satnam
    $('.address--sidebar').height($(window).height());
    $('.address--sidebar').css('overflow-y', 'auto');
    //by satnam close
});


//Sort all dropdown alphabetically ascending order
$( window ).on( "load", function() {
    // Loop for each select element on the page.
    $("select").each(function() {
    
        // Keep track of the selected option.
        var selectedID = $(this).attr('id');
        var selectedName = $(this).attr('name');
        var selectedCustomAttr = $(this).attr('custom-attr');
        var SKIP_SORTINGS = new Array('user_cards_id', 'expiry_month', 'nmi_expiry_month', 'request_pickup_window', 'estimate_arrival_window', 'price_model', 'listing_table_length', 'filter_by_status', 'same_item_select', 'skip_alphabetic_orders', 'request_delivery_window', 'user_id_for_address', 'change_dashboard', 'selectPeriod', 'selectPeriodSales', 'temp_plm_table_length', 'ticket_listing_table_length', 'filter_by_day');
        if( $.inArray(selectedID, SKIP_SORTINGS) != -1 || 
                $.inArray(selectedName, SKIP_SORTINGS) != -1 ||
                    $.inArray(selectedCustomAttr, SKIP_SORTINGS) != -1){}
        else{
            var selectedValue = $(this).val();
      
            // Sort all the options by text. I could easily sort these by val.
            $(this).html($("option", $(this)).sort(function(a, b) {
                return a.text.toLowerCase() == b.text.toLowerCase() ? 0 : a.text.toLowerCase() < b.text.toLowerCase() ? -1 : 1

            }));
          
            // Select one option.
            $(this).val(selectedValue);
        }
    });
  
});
//Sort all dropdown alphabetically ascending order close

function showFlashModal(status, message){
	
    // $( '.modal-backdrop' ).remove();
    // $( 'body' ).removeClass( "modal-open" );
    $('.close').trigger('click');
    // $( '.modal' ).modal( 'hide' ).data( 'bs.modal', null );

	$("#myModalLabel_alert").html('');
	$("#modal_msg_alert").html('');
	$("#flash_msg_modal .modal-header").removeClass('alert-success');
	$("#flash_msg_modal .modal-header").removeClass('alert-danger');
	if(status==true){
		$("#myModalLabel_alert").html('Success alert');
		$("#modal_msg_alert").html(message);
		$("#flash_msg_modal .modal-header").addClass('alert-success');
	}
	else{
		$("#myModalLabel_alert").html('Failure alert');
		$("#modal_msg_alert").html(message);
		$("#flash_msg_modal .modal-header").addClass('alert-danger');
	}
    setTimeout(function(){
        $("#btn_flash_msg").trigger("click");
    },1000);
    // setTimeout(function(){
    //     $("#flash_msg_modal").modal("hide");
    //     // console.log(oTable);
    //     if(oTable){
    //         oTable.draw(false);
    //     }
    // },5000);
}

function findIndexIfObjWithOwnAttr(array, key, value){
    
    for(var i = 0; i < array.length; i++) {
        if(array[i].hasOwnProperty(key) && array[i][key] == value) {
            return i;
        }
    }
    return -1;
}

function findIndexIfObjWithOwnAttr2(array, key1, value1, key2, value2){
    
    for(var i = 0; i < array.length; i++) {
        if(array[i].hasOwnProperty(key1) && array[i].hasOwnProperty(key2) && array[i][key1] == value1 && array[i][key2] == value2) {
            return i;
        }
    }
    return -1;
}

function findObjSize(obj){
	var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}

function initializePhoneNumberMask() {
    //Set mask for phone number field
	
	$(".masked_input").mask("(999) 999-9999");
    //Store numbers in hidden field
    $(".masked_input").blur(function () {
    	var id = $(this).attr('id');
    	id = id.replace('mask_','');

        //Clear the hidden field
        $("#"+id).val("");

        //Create char array from phone number field
        var charArray = $(this).val().split("");

        var phoneNumber = "";

        //Iterate over each character in the char array
        //and determine if it is a number
        $.each(charArray, function(index, value) {
            if (!isNaN(value) && value != " ") {
                phoneNumber = phoneNumber + value;
            }
        });

        //Set hidden field
        $("#"+id).val(phoneNumber);
    });    
}

function showLoading(id_selector="",type=""){    
	// $('.box-primary').prepend(load_btn);
    if(id_selector){
        var load_btn = '<div id="overlay" class="overlay js_overlay" overlay-parent="'+id_selector+'"><i class="fa fa-refresh fa-spin"></i></div>';
        if(type != ""){
            if($(type+id_selector+' .js_overlay[overlay-parent="'+id_selector+'"]').length==0){
                $(type+id_selector).prepend(load_btn);
            }
        }
        else
        {
            if($('#'+id_selector+' .js_overlay[overlay-parent="'+id_selector+'"]').length==0){
                $('#'+id_selector).prepend(load_btn);
            }
        }
    }else{
        var load_btn = '<div id="overlay" class="overlay js_overlay"><i class="fa fa-refresh fa-spin"></i></div>';
	    if($('.box .js_overlay:not([overlay-parent])').length==0){
            $('.box').prepend(load_btn);
        }
    }
}

var xhr;
var active_xhr = false;
function hideLoading(id_parent="",type=""){
    if(id_parent==""){
        $(".js_overlay:not([overlay-parent])").remove();
    }
    else{
        if(type == "")
            $("#"+id_parent+' .js_overlay[overlay-parent="'+id_parent+'"]').remove();
        else
            $(type+id_parent+' .js_overlay[overlay-parent="'+id_parent+'"]').remove();
    }
    active_xhr = false;
}

function getUrlParameter(sURL, sParam) {
    var sPageURL = sURL.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            // return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            return decodeURIComponent(sParameterName[1]);
        }
    }
    // return '';
};

var global_proceed_cal_for_quote = '';
//Common function to get estimated delivery charges and city/states name

/**
 * Implementation of our price model calculation based in entire web app
 * @author Sandeep Rawat
 * @date 2020-03-13
 * Our pricing
**/
function common_cal_for_quote_new(elem, request_params){
    console.log('common_cal_for_quote_new request_params: '+request_params);

    if(global_proceed_cal_for_quote != 'no'){

        //reset values & html
        $("#msg_origin_zip").html('');
        $("#msg_dest_zip").html('');
        $("#msg_origin_zip").parent().removeClass('has-error');
        $("#msg_dest_zip").parent().removeClass('has-error');
        $('#distance').val('0.00');
        $("#msg_distance").remove();
        //reset values & html close

        // var elem_id = elem.value;
        // console.log(url);
       
        var datastring = '';

        var originZip = '';
        var destinationZip = '';
        var cubes = '';
        var weight = '';
        var numberOfPieces = '';
        var serviceLevel = '';
        var priceModelsId = '';

        var ajax_flag = true;

        var request_form = '';

        var is_bill_zipcode = false;
        var request_params = request_params.split('|');
        $.each(request_params, function(key,val){
            request_form    = val.split(':')[0];
            var request_id  = val.split(':')[1];
            var request_val = $("#"+request_id).val();
            int_request_val = parseInt(request_val);
            switch(request_id){

                case 'zip':
                    datastring += request_val?'&originZip='+request_val:'';
                    // originZip = request_val;
                break;
                case 'origin_zip':
                    // if(isNaN(int_request_val)){
                    //     $("#msg_origin_zip").html('Please enter valid origin zipcode.');
                    //     $("#msg_origin_zip").parent().addClass('has-error');
                    //     // ajax_flag = false;
                        
                        
                    // }
                    // else if( !(int_request_val >= 1000 && int_request_val <= 99999) ){
                    //     $("#msg_origin_zip").html('You have entered invalid origin zipcode.');
                    //     $("#msg_origin_zip").parent().addClass('has-error');
                    //     // ajax_flag = false;
                        
                        
                    // }

                    datastring += request_val?'&originZip='+request_val:'';
                    originZip = request_val;
                break;
                case 'dest_zip':
                    // if(isNaN(int_request_val)){
                    //     $("#msg_dest_zip").html('Please enter valid destination zipcode.');
                    //     $("#msg_dest_zip").parent().addClass('has-error');
                    //     // ajax_flag = false;
                        
                    // }
                    // else if( !(int_request_val >= 1000 && int_request_val <= 99999) ){
                    //     $("#msg_dest_zip").html('You have entered invalid destination zipcode.');
                    //     $("#msg_dest_zip").parent().addClass('has-error');
                    //     // ajax_flag = false;
                        
                    // }
                    datastring += request_val?'&destinationZip='+request_val:'';
                    destinationZip = request_val;
                break;
                case 'total_cubes':
                    datastring += '&cubes='+request_val;
                    // cubes = request_val;

                break;
                case 'total_weight':
                    datastring += '&weight='+request_val;
                    // weight = request_val;
                    
                break;
                case 'total_items':
                    datastring += '&numberOfPieces='+request_val;
                    // numberOfPieces = request_val;

                break;
                case 'service_levels_id':
                    request_val = $("#service_levels_id option:selected").text();
                    datastring += '&serviceLevel='+request_val;
                    serviceLevel = request_val;

                break;

                case 'price_models_id':
                    request_val = $("#price_models_id").val();
                    datastring += '&priceModelId='+request_val;
                    priceModelsId = request_val;

                break;

                case 'bill_zip':

                    datastring += request_val?'&originZip='+request_val:'';
                    is_bill_zipcode = true;
                    // originZip = request_val;
                break;
            }
        });
        
        var type = "GET"; //for creating new resource
        var api_url = crm_quote_api_url+''+datastring;
        
        console.log("common_cal_for_quote_new api_url: "+api_url);
        if(ajax_flag == true){
            $.ajax({
                type: type,
                url: api_url,
                success: function (result) {
                    // console.log(result);
                    var originLocation = '';
                    var originMarket = '';
                    var destinationLocation = '';
                    var destinationMarket = '';
                    var ratePerLb = '';
                    var totalShipment = '';
                    var deliveryCharges = '';
                    var distance = '';

                    if(result.status==true){
                        var output = result.data;

                        var origin = output.origin;
                        var is_origin_service = output.is_origin_service;
                        var destination = output.destination;
                        var is_dest_service = output.is_dest_service;
                        var distance = output.distance;
                        var rate_per_cube = output.rate_per_cube;
                        var est_charge = output.est_charge;
                        var min_est_charge = output.min_est_charge;

                        deliveryCharges = (parseFloat(min_est_charge,2) > parseFloat(est_charge,2))?min_est_charge:est_charge;
                        originMarket = is_origin_service;
                        destinationMarket = is_dest_service;
                        ratePerLb = rate_per_cube;
                        var origin_city = '';
                        var origin_state = '';
                        var dest_city = '';
                        var dest_state = '';
                        if(is_origin_service !='No Service' && origin['city'] && origin['state']){
                            originLocation = origin['city'] +', ' + origin['state'];
                            origin_city = origin['city'];
                            origin_state = origin['state'];
                        }
                        if(is_dest_service !='No Service' && destination['city'] && destination['state']){
                            destinationLocation = destination['city'] +', ' + destination['state'];
                            dest_city = destination['city'];
                            dest_state = destination['state'];
                        }
                        
                        // var is_origin_service = output.is_origin_service;
                        // var is_dest_service = output.is_dest_service;

                        // originLocation = output.originLocation;
                        // originMarket = output.originMarket;
                        // destinationLocation = output.destinationLocation;
                        // destinationMarket = output.destinationMarket;
                        // ratePerLb = output.ratePerLb;
                        // totalShipment = output.totalShipment;
                        // var est_charge = output.est_charge;
                        // deliveryCharges = est_charge;
                        // distance = output.distance;

                        var zip_err_msg = appName + " is not servicing this Zip Code at this time.";

                        if(request_form == 'frmQuote'){
                            if(originMarket == 'No Service' && originZip != ""){
                                var orgin_loc = originLocation?' ('+originLocation+').':'.';
                                // var zip_err_msg = 'Sorry, we not serviced at this location'+orgin_loc;
                                console.log("zip_err_msg origin: "+zip_err_msg);
                                $("#msg_origin_zip").html(zip_err_msg);
                                $("#msg_origin_zip").parent().addClass('has-error');
                            }
                            else{
                                $("#msg_origin_zip").html(originLocation);
                            }
                            
                            if(destinationMarket == 'No Service' && destinationZip != ""){
                                var dest_loc = destinationLocation?' ('+destinationLocation+').':'.';
                                // var zip_err_msg = 'Sorry, we not serviced at this location'+dest_loc;
                                console.log("zip_err_msg dest: "+zip_err_msg);
                                $("#msg_dest_zip").html(zip_err_msg);
                                $("#msg_dest_zip").parent().addClass('has-error');
                            }
                            else{
                                $("#msg_dest_zip").html(destinationLocation);
                            }

                            if(originLocation != '' && destinationLocation != ''){
                                $('#distance').val(distance);
                                $("#msg_distance").remove();
                                $('<p id="msg_distance" class="help-block">Distance: '+distance+' mile(s)</p>').insertAfter('#msg_origin_zip');
                            }
                            
                            //origin location
                            $("#origin_city").val("");
                            $("#origin_state").val("");
                            var splitOriginLocation = originLocation.split(', ');
                            if(splitOriginLocation.length == 2){
                                var city = splitOriginLocation[0];
                                var state = splitOriginLocation[1];
                                // console.log("origin city: "+city);
                                // console.log("origin  state: "+state);
                                $("#origin_city").val(city);
                                $("#origin_state").val(state);
                                
                            }
                            //destination location
                            $("#dest_city").val("");
                            $("#dest_state").val("");
                            var splitDestinationLocation = destinationLocation.split(', ');
                            if(splitDestinationLocation.length == 2){
                                var city = splitDestinationLocation[0];
                                var state = splitDestinationLocation[1];
                                // console.log("dest city: "+city);
                                // console.log("dest state: "+state);
                                $("#dest_city").val(city);
                                $("#dest_state").val(state);
                                
                            }

                        }

                        if(request_form == 'frmOrder'){

                            //origin location
                            var splitOriginLocation = originLocation.split(', ');
                            if(splitOriginLocation.length == 2){
                                var city = splitOriginLocation[0];
                                var state = splitOriginLocation[1];
                                // console.log("origin city: "+city);
                                // console.log("origin  state: "+state);
                                // console.log("is_bill_zipcode: "+is_bill_zipcode);
                                if(is_bill_zipcode == true){
                                    $("#bill_city").val(city);
                                    $("#bill_state").val(state);
                                }
                                else{
                                    $("#origin_city").val(city);
                                    $("#origin_state").val(state);
                                }
                                
                            }
                            //destination location
                            var splitDestinationLocation = destinationLocation.split(', ');
                            if(splitDestinationLocation.length == 2){
                                var city = splitDestinationLocation[0];
                                var state = splitDestinationLocation[1];
                                // console.log("dest city: "+city);
                                // console.log("dest state: "+state);
                                $("#dest_city").val(city);
                                $("#dest_state").val(state);
                                
                            }

                            //For distance
                            if(originLocation != '' && destinationLocation != ''){
                                $('#distance').val(distance);
                                $("#msg_distance").remove();
                                $('<p id="msg_distance" class="help-block">Distance: '+distance+' mile(s)</p>').insertAfter('#msg_origin_zip');

                                calculate_price();
                            }

                            if(originMarket == "No Service" && originZip != ""){
                                // orgin_err_msg = 'Sorry, we not serviced at this location ('+orgin_loc+').';
                                orgin_err_msg = appName + " is not servicing this Zip Code at this time.";

                                // error_msg = orgin_err_msg;
                                $("#msg_origin_zip").html(orgin_err_msg);
                                $("#msg_origin_zip").parent().addClass('has-error');
                                $("#is_origin_servicable").val('0');
                            }
                            else{
                                $("#msg_origin_zip").parent().removeClass('has-error');
                                $("#msg_origin_zip").html(originLocation);
                                $("#is_origin_servicable").val('1');
                            }
                            
                            if(destinationMarket == "No Service" && destinationZip != ""){
                                dest_err_msg = appName + " is not servicing this Zip Code at this time.";
                                $("#msg_dest_zip").html(dest_err_msg);
                                $("#msg_dest_zip").parent().addClass('has-error');
                                $("#is_dest_servicable").val('0');
                            }
                            else{
                                $("#msg_dest_zip").parent().removeClass('has-error');
                                $("#msg_dest_zip").html(destinationLocation);
                                $("#is_dest_servicable").val('1');
                            }
                        }

                        if(request_form == 'frmForceEdit'){
                            $("#city").val("");
                            $("#state").val("");
                            //origin location
                            var splitOriginLocation = originLocation.split(', ');
                            if(splitOriginLocation.length == 2){
                                var city = splitOriginLocation[0];
                                var state = splitOriginLocation[1];
                                $("#city").val(city);
                                $("#state").val(state);
                            }
                            
                            if(originMarket == "No Service" && originZip != ""){
                                var orgin_loc = originLocation?' ('+originLocation+').':'.';
                                // var zip_err_msg = 'Sorry, we not serviced at this location'+orgin_loc;
                                
                                $("#msg_zip").html(zip_err_msg);
                                $("#msg_zip").parent().addClass('has-error');
                            }
                            else{
                                // $("#msg_zip").html(originLocation);
                            }
                        }
                    }
                },
                error: function (data) {
                    console.log('error',data);
                }
            }); 
        }
    }
}

// our pricing
function calculate_distance_new(originZip, destZip){
    var datastring = '&originZip='+originZip+'&destinationZip='+destZip;
    // var datastring = '&origin_zip='+originZip+'&dest_zip='+destZip;
    var type = "GET"; //for creating new resource
    var api_url = crm_quote_api_url+''+datastring;
    var $distance = 0;
    // console.log("api_url: "+api_url);
    $.ajax({
        type: type,
        url: api_url,
        async: false,
        success: function (result) {
            // console.log(result);

            var output = result.data;
            if(result.status == true){
                $distance = output.distance;
            }
            var zip_err_msg = appName + " is not servicing this Zip Code at this time.";

        },
        error: function (data) {
            console.log('error',data);
        }
    });
    console.log('new final distance '+originZip+' - '+destZip+': '+$distance);
    return $distance;
}

// our pricing
function common_cal_for_quote(elem, request_params){
    common_cal_for_quote_new(elem, request_params);
}

// our distance
function calculate_distance(originZip, destZip){
    return calculate_distance_new(originZip, destZip);
}

function str_pad(n) {
    return String("00" + n).slice(-2);
}

function scrollToElement(arg){
    $('html, body').animate({
        scrollTop: $(arg).offset().top
    }, 2000);
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}


function escapeHtmlAlternate(text) {
    if (text && typeof text === 'string') {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    } else {
        return text;
    }
}

function unescapeHtmlAlternate(text) {
    if (text && typeof text === 'string') {
        return text
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '\"')
            .replace(/&#039;/g, "\'");
    } else {
        return text;
    }
}

function extractContent(html) {
    var tmp = document.createElement("DIV");
    // tmp.innerHTML = html;
    tmp.innerHTML = html.replace(/\s\s+/g, ' ');
    return tmp.textContent || tmp.innerText || "";
};

//
// Updates "Select all" control in a data table
//

//Date Format to MMDDYY
function datetimeFormattedMMDDYY(datetime){
    var date = new Date(datetime);
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
}

//go back 
function goBack() {
  window.history.back();
}

function ValidateExcelSheet(field, rules, i, options){
	var error_msg = "";
	var fuData = field[0];
	var FileUploadPath = fuData.value;
	if (FileUploadPath == '') {
	}
	else {
		var Extension = FileUploadPath.substring(FileUploadPath.lastIndexOf('.') + 1).toLowerCase();
		var EXCEL_EXTENSIONS = new Array('jpeg', 'jpg', 'png', 'gif');
		var arr = EXCEL_EXTENSIONS;
		if( $.inArray(Extension, EXCEL_EXTENSIONS) != -1){
			if (fuData.files && fuData.files[0]) {
				var size = fuData.files[0].size;
				if(size > 5452595.2){
					return "Sorry, File size cant be greater than 5MB";
				}
			}
		} 
		else {
			var array = arr.join(", ");
			return "Sorry, only "+array+" files are allowed. ";
		} 
	}
	return true;
}
$(document).on('change','#profile_pic',function(){
	var valid_excel = ValidateExcelSheet($(this));
	// console.log(valid_excel);
	if(valid_excel!=true){
		$(this).val("");
		//alert(valid_excel);
		showFlashModal(0,valid_excel);
	}
});

$(document).on('click','.toggle-chat-wdget',function(){
    $("#chatbox").toggle();      
});

function IsJsonString(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}
// function readURL(input) {
	
	// if (input.files && input.files[0]) {
		// var reader = new FileReader();

		// reader.onload = function (e) {
			// $('#profile_img_display')
				// .attr('src', e.target.result);
		// };

		// reader.readAsDataURL(input.files[0]);
	// }
// }

function preventInspectElement(){
    $(document).keydown(function (event) {
        if (event.keyCode == 123) { // Prevent F12
            return false;      
        } else if (event.ctrlKey && event.shiftKey && (
                event.keyCode == 'I'.charCodeAt(0) || // Prevent Ctrl+Shift+I
                event.keyCode == 'J'.charCodeAt(0) || // Prevent Ctrl+Shift+J
                event.keyCode == 'E'.charCodeAt(0) || // Prevent Ctrl+Shift+E
                event.keyCode == 'K'.charCodeAt(0) // Prevent Ctrl+Shift+K 
            )
        ) { 
            return false;
        }  else if (event.metaKey && event.altKey && event.keyCode == 'I'.charCodeAt(0)) { // Prevent Command+Alt+I
            return false;
        } else if (event.ctrlKey && event.keyCode == 'U'.charCodeAt(0)) { // Prevent Ctrl+U
            return false;
        }
    });
}

function preventRightClick(){
    $(document).on("contextmenu", function (e) {        
        e.preventDefault();
    });
}
function distance(lat1,lon1,lat2,lon2) {
	function toRad(x) {
		return x * Math.PI / 180;
	}
	var R = 3959; // miles (change this constant to get km)
	//has a problem with the .toRad() method below.
	console.log("lat1:"+lat1+"  lat2:"+lat2);
	var x1 = lat2-lat1;
	var dLat = toRad(x1);
	var x2 = lon2-lon1;
	var dLon = toRad(x2);  
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
					Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
					Math.sin(dLon/2) * Math.sin(dLon/2);  
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;
	if(isNaN(d))
	{
		return 0;
	}
	console.log(d);
	return d;
}

// $(document).on('click', '.masonry .panel-heading span.clickable', function(e){
//     var $this = $(this);
//     if(!$this.hasClass('panel-collapsed')) {
//         $this.parents('.panel').find('.panel-body').slideUp();
//         $this.addClass('panel-collapsed');
//         $this.find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
//     } else {
//         $this.parents('.panel').find('.panel-body').slideDown();
//         $this.removeClass('panel-collapsed');
//         $this.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
//     }
// })