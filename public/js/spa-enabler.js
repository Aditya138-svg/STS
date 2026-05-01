
var unsaved = false;
function SaveForm(form_id, callback){ 
	var $form = jQuery("#"+form_id);
	var action_url = $form.attr("data-action-url");
	if($form.validationEngine("validate")){
		var formData = new FormData($form[0]);
		//console.log($("#PP_image").val());
        var me = $(this);
		jQuery.ajax({
			type:'post',
			url:action_url,
			data:formData,
			processData: false,
			contentType: false,
			success: function(data){;
				if(typeof data == 'object'){
					if(data.status==1){
						if(callback && typeof callback == "function"){ 
							callback(data);
						}
					}
					else{
						var error_msg = "";
						 jQuery.each(data.errors, function( index, error ) {
							 error_msg += "<li>"+error+"</li>";
						 });
						// console.log(error_msg);
						ps_notify(error_msg, "danger");
					}
				}
				else{
					ps_notify(data, "dangerf");
				}
			},
			complete: function() {
	            me.data('requestRunning', false);
	        }
		});
	}
}
function loadContent(_href,callback){
	if ($(".select2-dropdown--below").is(':visible')) {
		//do something
		$(".select2-dropdown--below").remove();
		// console.log('inside');
	}else{
		// console.log('outside');
	}
	// close datepicker if remain open 
	if ($(".daterangepicker.show-calendar,.daterangepicker.show-ranges").is(':visible')) {
		//do something
		$(".daterangepicker.show-calendar,.daterangepicker.show-ranges").hide();
		// console.log('inside');
	}else{
		// console.log('outside');
	}
	if ($(".ui-datepicker").is(':visible')) {
		//do something
		$(".ui-datepicker").hide();
		// console.log('inside');
	}else{
		// console.log('outside');
	}
    var me = $(this);
	jQuery.ajax({
		type:'get',
		url: _href,
		headers: {
			'X-CSRF-TOKEN': jQuery('meta[name="_token"]').attr('content'),
			'X-CSRF-TOKEN': jQuery('input[name="_token"]').val()
		},
		success: function(data){
			// update sidebar
			var data1 = jQuery(data).filter(".mpage_container").html();
			if(typeof(data1)=="undefined"){ data1 = jQuery(".mpage_container > *", data); }
			//console.log(data1);
			jQuery(".mpage_container").html(data1);
			$('[data-toggle="tooltip"]').tooltip();
			initdatepicker();
			// close select2 dropdown if remain open 
			if($('#navbarNav').hasClass('show')){
				$('#nav-close-btn').click();
			}
			unsaved=false;
			if(callback && typeof callback == "function"){ 
				callback(data);
			}
		},
		complete: function() {
            me.data('requestRunning', false);
        }
	});
}
function ValidateImage(field, rules, i, options){
	var error_msg = "";
	var IMAGE_EXTENSIONS=["jpg","jpeg","png","gif"];
	var MAX_FILE_SIZE=10485760;
    var fuData = field[0];
    var FileUploadPath = fuData.value;
    if (FileUploadPath == '') {
		//return "Please upload an image";
    }
	else {
	    var Extension = FileUploadPath.substring(FileUploadPath.lastIndexOf('.') + 1).toLowerCase();
		var arr = IMAGE_EXTENSIONS;
		if( jQuery.inArray(Extension, IMAGE_EXTENSIONS) != -1){
		    if (fuData.files && fuData.files[0]) {
                var size = fuData.files[0].size;
				//alert(size);
                if(size > MAX_FILE_SIZE){
                    return "Sorry, Image size cant be greater than "+bytesToSize(MAX_FILE_SIZE)+".";
                }else{
                   //ok
                }
            }
        } 
        else {
			var array = arr.join(", ");
            return "Sorry, only "+array+" files are allowed for images. ";
        } 
    }
	return true;
}
function bytesToSize(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
function initdatepicker(){
	
	jQuery(".datepicker").val(
		function(index,value){
			if(value.length>10){
				return value.substr(0,value.length-9);
			}
			else{
				return value;
			}
	});
	jQuery(".datepicker").datepicker({
		changeMonth: true,
		changeYear: true,
		dateFormat: "dd-mm-yy",
		defaultDate: "01-01-2000",
		yearRange: "-100:+0",
	}).attr('placeholder','DD-MM-YYYY').addClass("validate[custom[date]]");
	
	jQuery('.datepicker_icon').click(function(){
		var dpic_id = jQuery(this).attr("data-dpic-id");
		jQuery('#'+dpic_id).datepicker("show");
	});
}

function load_video_previews(){
	jQuery(".vid_preview").each(function(){
		var v_id = jQuery(this).attr("data-vid");
		var v_type = jQuery(this).attr("data-vtype");
		$this_v = jQuery(this);
		if(v_id!=""){
			if(v_type==2){
				jQuery(this).css('background-image', 'url(https://i.ytimg.com/vi/' + v_id + '/hqdefault.jpg)');
			}
			else{
			    var me = $(this);
	            if ( me.data('requestRunning') ) {
                   return;
                  }
                 me.data('requestRunning', true);
				jQuery.ajax({
					type:'GET',
					url: 'https://vimeo.com/api/v2/video/' + v_id + '.json',
					global: false,
					jsonp: 'callback',
					dataType: 'jsonp',
					success: function(data){
						var thumbnail_src = data[0].thumbnail_large;
						$this_v.css('background-image', 'url("'+thumbnail_src+'")');
					},
        			complete: function() {
        	            me.data('requestRunning', false);
        	        }
				});
			}
			// Overlay the Play icon to make it look like a video player
			jQuery(this).append(jQuery('<div/>', {'class': 'video-play-btn'}));
		}
	});
}

//////////////////
jQuery(document).ready(function(){
	$(document).on('click','input,textarea', function(){
		// alert('hello');
		$(this).focus();
	});
	// $('#company_id_input').select2({
 //      ajax: {
 //        url: 'https://api.github.com/search/repositories',
 //        data: function (params) {
 //          var query = {
 //            search: params.term,
 //            page: params.page || 1
 //          }
    
 //          // Query parameters will be ?search=[term]&page=[page]
 //          return query;
 //        }
 //      }
 //    });
	jQuery(document).on('click', '.vid_preview', function() {
		var v_id = jQuery(this).attr("data-vid");
		var v_type = jQuery(this).attr("data-vtype");
		if(v_id!=""){
			if(v_type==2){
				var iframe_url = "https://www.youtube.com/embed/" + v_id + "?autoplay=1&autohide=1";
			}
			else{
				var iframe_url = "https://player.vimeo.com/video/" + v_id + "?autoplay=1&autohide=1";
			}
			// The height and width of the iFrame should be the same as parent
			if(typeof(jQuery(this).attr("data-open-in-popup"))!="undefined"){
				// alert("aaa"+jQuery("#popup_video_container").width());
				var v_width = "100%";
				var v_height = jQuery("#popup_video_container").height();
			}
			else {
				// alert(jQuery(this).width());
				var v_width = jQuery(this).width();
				var v_height = jQuery(this).height();
			}
			var iframe = jQuery('<iframe/>', {'frameborder': '0', 'class':'em_video', 'allowfullscreen':'true', 'src': iframe_url, 'width': v_width, 'height': v_height })
			
			if(typeof(jQuery(this).attr("data-open-in-popup"))!="undefined"){
				jQuery("#popup_video_container").html(iframe);
				jQuery('#video-popup1').modal({backdrop: 'static'});
			}
			else{
				// Replace the YouTube thumbnail with YouTube HTML5 Player
				jQuery(this).replaceWith(iframe);
			}
		}
	});
	jQuery('.modal').on('hidden.bs.modal', function () {
		var iframe= jQuery('iframe.em_video').attr('src');
		if(typeof(iframe)!="undefined"){
			var iframe = iframe.replace("autoplay=1", "autoplay=0");
			jQuery('iframe.em_video').attr('src','');
			jQuery('iframe.em_video').attr('src', iframe);
		}
	});
	if(Modernizr.history){
		history.replaceState({ myTag: true }, null, window.location.href);
    }
	initdatepicker();
	jQuery(window).bind("popstate", function(e) {
		if (e.originalEvent.state && e.originalEvent.state.myTag) { // to avoud safari popstate on page load 
			var _href = location.href;
			loadContent(_href);
		}
	});
	jQuery(document).on("click", "a.load_ajax", function(evt) {
		if(evt.which==1){
			if(!evt.ctrlKey && Modernizr.history){
				var _href = jQuery(this).attr("href");
				if(unsaved){
					return "You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?";
				}
				else{
					var me = $(this);
					if ( me.data('requestRunning') ) {
						return;
					}
					me.data('requestRunning', true);
					loadContent(_href,function(data){
						history.pushState({ myTag: true }, null, _href);
					});
				}
				return false;
			}
			else{
				return true;
			}
		}
		else{
			return false;
		}
	});
	jQuery(document).on("change", "select.load_ajax", function(evt) {
		var _href = jQuery(this).val();
		if(Modernizr.history){
			loadContent(_href,function(data){
				history.pushState({ myTag: true }, null, _href);
			});
			return false;
		}
		else{
			window.location.href=_href;
		}
	});
	jQuery(document).on("click", ".select_all_checkbox", function() { 
        var pno = jQuery(this).attr("data-pno");
		if(this.checked) {
            jQuery('.single_checkbox_'+pno).prop("checked",true);
			jQuery("#delete_selected_"+pno).removeAttr("disabled");
        }else{
            jQuery('.single_checkbox_'+pno).prop("checked",false);
			jQuery("#delete_selected_"+pno).attr("disabled","disabled");
        }
    });
	jQuery(document).on("click", ".single_checkbox_event", function() {
        var pno = jQuery(this).attr("data-pno");
        // alert(pno);
        
        if (jQuery('.single_checkbox_event:checked').length == jQuery('.single_checkbox_event').length) {
			jQuery('.select_all_checkbox').prop("checked",true);
		}
		else{
			jQuery('.select_all_checkbox').prop("checked",false);
		}
        
		var enable_delete_button = 0;
		jQuery('.single_checkbox_'+pno).each(function() {
			if(this.checked) {
				enable_delete_button = 1;
			}
		});
		if(enable_delete_button==1) {
            jQuery("#delete_selected_"+pno).removeAttr("disabled");
        }else{
            jQuery("#delete_selected_"+pno).attr("disabled","disabled");        
        }
    });
	jQuery(document).on("click", ".delete_selected_btn", function(){
		var pno = jQuery(this).attr("data-pno");
		var _href = jQuery(this).attr("data-action-url");
		var reload_url = jQuery(this).attr("data-reload-url");
		UIkit.modal.confirm("Are you sure you want to Delete selected Records?").then(function(){
			// will be executed on confirm.
			var arr = new Array();
			jQuery.each( jQuery(".single_checkbox_"+pno), function( key, value ) {
				if(jQuery(this).is(":checked")){
					arr.push(jQuery(this).val());
				}
			});
				var me = $(this);
    	if ( me.data('requestRunning') ) {
            return;
        }
        me.data('requestRunning', true);
			jQuery.ajax({
				url:_href,
				data: jQuery.param({del_ids:arr}),
				type: "post",
				success: function(data){
					if(data=="1"){
						// load_page_1(jQuery("#select_page_1").val());
						// alert("Successfully Deleted");
						if(Modernizr.history){
							loadContent(reload_url);
							return false;
						}
						else{
							window.location.href=reload_url;
						}
						ps_notify("Successfully Deleted", "success");
					}
					else{
						// alert(data);
						ps_notify(data, "danger");
					}
				},
    			complete: function() {
    	            me.data('requestRunning', false);
    	        }
			});
		});
		return false;
	});
	jQuery(document).on("submit", "form.submit_ajax", function() {
		return false;
	});
	jQuery(document).on("click", ".save_btn_action", function() {		
		var form_id = jQuery(this).attr("data-form-id");
		var back_url = jQuery("#"+form_id).attr("data-back-url");
		var reload = jQuery("#"+form_id).attr("data-reload");
		var me = $(this);
		if ( me.data('requestRunning') ) {
			return;
		}
		me.data('requestRunning', true); 
		SaveForm(form_id, function(data){
			if(typeof(data.message)!="undefined"){
				ps_notify(data.message, "success");
			}
			else{
				ps_notify("Successfully Saved", "success");
				//window.location.href = "listemp.php";
			}
			if(reload=="true"){
				var _href = location.href;
				if(typeof(jQuery("#"+form_id).attr('data-new-key')) != "undefined"){
					var new_key = jQuery("#"+form_id).attr('data-new-key');
					//console.log(data[new_key]);
					if(typeof(data[new_key]) != "undefined"){
						if(data[new_key] != ""){
							_href = _href+"&"+new_key+"="+data[new_key];
						}
					}
				}
				loadContent(_href);
			}
			else{
				if(Modernizr.history){
					loadContent(back_url,function(data){
						history.pushState({ myTag: true }, null, back_url);
					});
					return false;
				}
				else{
					window.location.href = back_url;
				}
			}
		});
		return false;
    });
	jQuery(document).on("click", ".save_and_new_btn_action", function() {	
		var form_id = jQuery(this).attr("data-form-id");
		var add_url = jQuery("#"+form_id).attr("data-add-url");
				var me = $(this);
	if ( me.data('requestRunning') ) {
        return;
    }
    me.data('requestRunning', true);
		SaveForm(form_id, function(){
			ps_notify("Successfully Saved", "success");
			// save and create new
			if(Modernizr.history){
				loadContent(add_url,function(data){
					history.pushState({ myTag: true }, null, add_url);
				});
				return false;
			}
			else{
				window.location.href = add_url;
			}
		});
		return false;
    });
	jQuery(document).on("click", ".cancel_btn_action", function(){
		var $form = jQuery(this).closest("form");
		var back_url = $form.attr("data-back-url");
		if(Modernizr.history){
			loadContent(back_url,function(data){
				history.pushState({ myTag: true }, null, back_url);
			});
			return false;
		}
		else{
			window.location.href = back_url;
		}
		return false;
	});
	jQuery(document).bind("ajaxStart", function(){
		jQuery(".ajax_loading").show();
	}).bind("ajaxStop", function(){
		jQuery(".ajax_loading").hide();
	});
	jQuery(document).ajaxError(function( event, jqXHR, ajaxSettings, thrownError ) {
      if (jqXHR.status === 0) {
       ps_notify("Not connect. Verify Network.", "danger");
      } 
      else if (jqXHR.status == 401) {
       ps_notify("Session Expired! Please login", "danger");
    
       setTimeout(function(){
        window.location.reload();
       }, 1000);
      }
      else if (jqXHR.status == 429) {
       ps_notify("User is not active", "danger");
    
       setTimeout(function(){
        window.location.href=SITE_URL+"/index.php";
       }, 1000);
      }
      else if (jqXHR.status == 498) {
      	// ps_notify("Permissions Changed [498].", "danger");
      	setTimeout(function(){
       		window.location.href=SITE_URL+"/portal";
       	}, 1000);
      }
      else if (jqXHR.status == 404) {
       ps_notify("Connectivity Error or Page not found [404]", "danger");
      } else if (jqXHR.status == 500) {
       ps_notify("Internal Server Error [500].", "danger");
      } else if (thrownError === "parsererror") {
       ps_notify("Requested JSON parse failed.", "danger");
      } else if (thrownError === "timeout") {
       ps_notify("Time out error.", "danger");
      } else if (thrownError === "abort") {
       ps_notify("Ajax request aborted.", "danger");
      } else {
       ps_notify("Uncaught Error. "+ jqXHR.responseText, "danger");
      }
      jQuery(".ajax_loading").hide();
    });
	jQuery(window).bind('beforeunload', function() {
		if(unsaved){
			return "You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?";
		}
	});
    // $(document).ready(function(){
		$('[data-toggle="tooltip"]').tooltip(); 
	
	// });
});