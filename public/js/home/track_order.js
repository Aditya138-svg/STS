(function($) {
    $(document).ready(function() {
        function homeTrackOrder() {
            var $order_id_exist = (typeof window.lsData === 'undefined' || false === ('order_id_exist' in window.lsData)) ? '' : window.lsData['order_id_exist'];
            var ORDER_ID_EXIST_HOME = (typeof window.lsData === 'undefined' || false === ('ORDER_ID_EXIST_HOME' in window.lsData)) ? '' : window.lsData['ORDER_ID_EXIST_HOME'];
            var urlTrackingOrder = (typeof window.lsData === 'undefined' || false === ('urlTrackingOrder' in window.lsData)) ? '' : window.lsData['urlTrackingOrder'];
            var urlTrackingOrderPhn = (typeof window.lsData === 'undefined' || false === ('urlTrackingOrderPhn' in window.lsData)) ? '' : window.lsData['urlTrackingOrderPhn'];


            var $inputOrderId = $("#track_orders_id");
            var $btnTrackOrder = $("#btn_track_order_f");
            var $formTrackOrder = $("#order_trackbyRef"); 
            var $ulOrderTimeLine = $("#ot_timeline_ul1");
            var $tableOrderTrack = $("#order_track_table_div1");
            var $tbodyOrderTrack = $("#order_track_tbody_div1");
            var $ulTrackRef = $("#ul_track_ref");
            var $tableOrderTrackRef = $("#order_track_Ref_table_div");
            var $divErrorMsg = $('.errorMsg');
            var $inputRefNumber = $("#ref_num");
            var $inputPhoneNumber = $("#phn_num");
            var $spanPoNumberError = $('.err1');
            var $spanPhoneError = $('.err2');
            var $btnTrackOrderRef = $('#btn_track_ref_order');
            var $ulTimeline = $("#ot_timeline_ref_ul1"); 
            

            $xhr = null,
            $active_xhr = false;

            init();
            function init() {
                $formTrackOrder.on('submit',trackOrderByRef);
                $btnTrackOrder.on('click',trackOrder);
                $inputOrderId.focus();
                if($order_id_exist == ORDER_ID_EXIST_HOME['YES']){
                    setTimeout(function(){
                        $btnTrackOrder.click();
                    },500);
                }
                $inputPhoneNumber.on('input', function() {
                    var input = $(this).val();
                    if (input.length > 12) {
                        $(this).val(input.slice(0, 12)); // truncate input to first 12 digits
                    }
                });
                
            }

            /**
             * Ajax request to track the Order
             * @param {*} $this 
             */
            function trackOrder(e) {
                var t_orders_id = $inputOrderId.val();
                if (t_orders_id == '' || t_orders_id == null) {
                    alert('The Order ID is a required field.');
                } else {
                    $ulOrderTimeLine.html('');
                    $tbodyOrderTrack.html('');
                    $tableOrderTrack.hide();
            
                    var $this = $btnTrackOrder;
                    var $loadingText = '<i class="fa fa-refresh fa-lg action-icons fa-spin"></i>';
                    var $this_current_html = $btnTrackOrder.html();
                    var formData = new FormData();
                    formData.append('orders_id', t_orders_id);
            
                    $xhr = $.ajax({
                        type: 'POST',
                        url: urlTrackingOrder,
                        data: formData,
                        cache: false,
                        processData: false,
                        contentType: false,
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        beforeSend: function(){
                            if($active_xhr) {
                                $xhr.abort();
                            }
                            $active_xhr = true;
                            // Replace button's original text to loader
                            if ( $this_current_html !== $loadingText) {
                                $this.data('original-text', $this_current_html);
                                $this.html($loadingText);
                                $this.attr('disabled',true);
                            }
                        },
                        success: function(result) {
                            // clear all error message
                            clearErrorMessages();
                            backToOriginalButton($this);
            
                            var data = result.data;
                            var data_ot = result.data['tracking_info'];
                            var data_od = result.data['order_info'];
            
                            if (result.status == false) {
                                if (data.hasOwnProperty("field_errors")) {
                                    var field_errors = data.field_errors;
                                    showSSErrorMessages(field_errors);
                                } else { 
                                    alert(result.message);  
                                }
                            } else {
                                $tbodyOrderTrack.empty().append(function() {
                                    var $tableBody = $('<tbody />');

                                    var rows = [
                                        { label: 'Service Level', value: data_od['service_level'] },
                                        { label: 'Origin', value: [data_od['origin_city'], data_od['origin_state'], data_od['origin_zip']].join(', ') },
                                        { label: 'Destination', value: [data_od['dest_city'], data_od['dest_state'], data_od['dest_zip']].join(', ') },
                                        { label: '#Items', value: data_od['num_of_items'] },
                                        { label: '#Pieces', value: data_od['num_of_pieces'] }
                                    ];

                                    $.each(rows, function(index, row) {
                                        var $tr = $('<tr />').append(
                                            $('<td />').text(row.label),
                                            $('<td />').append(
                                                $('<b />').addClass('text-green').text(row.value)
                                            )
                                        );
                                        $tableBody.append($tr);
                                    });

                                    if (rows.length === 0) {
                                        var $tr = $('<tr />').append(
                                            $('<td />').attr('colspan', '2').text('No information found')
                                        );
                                        $tableBody.append($tr);
                                    }

                                    return $tableBody;
                                }).addClass('table-body');

                                // Create a new timeline list and append to ulOrderTimeLine
                                var $timelineList = $('<ul />').attr('id', 'ot_timeline_ul1').addClass('timeline').append(function() {
                                    var $timelineItems = $();

                                    var deliveryCompleted = false;
                                    var deliveryCompletedOn = '';

                                    $.each(data_ot, function(key1, value1) {
                                        var $timeLabel = $('<li />').addClass('time-label').append(
                                            $('<span />').addClass('bg-maroon').text(key1)
                                        );
                                        $timelineItems = $timelineItems.add($timeLabel);

                                        $.each(value1, function(index, v2) {
                                            var iconClass = (v2['t_status'].toLowerCase() === 'delivery completed') ? 'fa-truck bg-green' : 'fa-truck bg-green';
                                            var $listItem = $('<li />').append(
                                                $('<i />').addClass('fa ' + iconClass).css({ bottom: '0px', top: 'initial' }),
                                                $('<div />').addClass('timeline-item').append(
                                                    $('<span />').addClass('time').html('<i class="fa fa-clock"></i> ' + v2['created_at_time_formatted']),
                                                    $('<h3 />').addClass('timeline-header no-border').text(v2['t_status'])
                                                )
                                            );
                                            
                                            $timelineItems = $timelineItems.add($listItem);

                                            if (v2['t_status'].toLowerCase() === 'delivery completed') {
                                                deliveryCompleted = true;
                                                deliveryCompletedOn = v2['created_at_formatted'];
                                            }
                                        });
                                    });

                                    if ($timelineItems.length === 0) {
                                        $timelineItems = $('<li />').text('No information found');
                                    } else {
                                        if (!deliveryCompleted) {
                                            $timelineItems = $timelineItems.add($('<li />').html('<i class="fa fa-clock bg-gray"></i>'));
                                        } else {
                                            var $tr = $('<tr />').append(
                                                $('<td />').text('Delivery Completed on'),
                                                $('<td />').append(
                                                    $('<b />').addClass('text-green').text(deliveryCompletedOn)
                                                )
                                            );
                                            $tbodyOrderTrack.find('tbody').append($tr);
                                        }
                                    }

                                    return $timelineItems;
                                });

                                $ulOrderTimeLine.empty().append($timelineList);

                                // Show the table with animation
                                $tableOrderTrack.show("slow");

                            }
                        },
                        error: function(data) {
                            console.log('Error:', data);
                            $this.html($this.data('original-text'));
                            $this.attr('disabled', false);
                        }
                    });
                }
            }

            /**
             * Ajax request to track the Order by ref (PO number and Delivery phone)
             * @param {*} $this 
             */
            function trackOrderByRef(e) {
                e.preventDefault(); // Prevent default form submission
                $ulTrackRef.html('');
                $tableOrderTrackRef.hide();
                $divErrorMsg.html('');
            
                var t_ref_no = $inputRefNumber.val();
                var t_phn_no = $inputPhoneNumber.val();
                var error = 0;
            
                if (t_ref_no == '' || t_ref_no == null) {
                    $spanPoNumberError.html('PO Number is required*');
                    error = 1;
                } else {
                    $spanPoNumberError.html('');
                }
            
                if (t_phn_no == '' || t_phn_no == null) {
                    $spanPhoneError.html('Phone Number is required*');
                    error = 1;
                } else {
                    var pattern = /^\d{10}$/;
                    if (!pattern.test(t_phn_no)) {
                        error = 1;
                        $spanPhoneError.html('Invalid Phone Number*');
                    } else {
                        $spanPhoneError.html('');
                    }
                }
            
                if (error == 0) {
                    var $this = $btnTrackOrderRef;
                    var $loadingText = '<i class="fa fa-refresh fa-lg action-icons fa-spin"></i>';
                    var $this_current_html = $this.html();
            
                    var formDataRef = new FormData();
                    formDataRef.append('ref_no', t_ref_no);
                    formDataRef.append('phn_no', t_phn_no);
            
                    $.ajax({
                        type: 'POST',
                        url: urlTrackingOrderPhn,
                        data: formDataRef,
                        cache: false,
                        processData: false,
                        contentType: false,
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        beforeSend: function () {
                            if ($active_xhr) {
                                $xhr.abort();
                            }
                            $active_xhr = true;
                            // Replace button's original text to loader
                            if ($this_current_html !== $loadingText) {
                                $this.data('original-text', $this_current_html);
                                $this.html($loadingText);
                                $this.attr('disabled', true);
                            }
                        },
                        success: function (result) {
                            // clear all error message
                            clearErrorMessages();
                            backToOriginalButton($this);
            
                            var data = result.data;
                            if (result.status == false) {
                                $divErrorMsg.html('<div class="alert alert-danger">' + result.message + '</div>');
                            } else {
                                if (result.data == '' && result.message != '') {
                                    $divErrorMsg.html('<div class="alert alert-danger">' + result.message + '</div>');
                                }
            
                                $.each(data, function (index, dRow) {
                                    var data_ot = dRow.tracking_info;
                                    var data_od = dRow.order_info;
            
                                    // Clear any existing content in #ulTrackRef
                                    $ulTrackRef.empty();
            
                                    var $fullWidthDiv = $('<div />').addClass('full_width');
                                    var $flipOrderRow = $('<div />').addClass('flipOrderRow').attr('data-num', data_od['orders_id']);
                                    var $orderNumTxt = $('<span />').addClass('OrderNumTxt').text('#' + data_od['orders_id']);
                                    var deliveredTxt = dRow.delivery_completed ? $('<span />').addClass('btn btn-xs btn-success').text('Delivered') : '';
                                    var $sortIcon = $('<span />').addClass('pFRight').html('<i class="fa fa-sort-down"></i>');
            
                                    $flipOrderRow.append($orderNumTxt, deliveredTxt, $sortIcon);
                                    $fullWidthDiv.append($flipOrderRow);
            
                                    var $panelOrderRow = $('<div />').addClass('panelOrderRow').addClass('OrderRow' + data_od['orders_id']);
                                    if (index === 0) {
                                        $panelOrderRow.css('display', 'block');
                                    }
            
                                    var $table = $('<table />').addClass('table table-striped table-hover');
                                    var $tbody = $('<tbody />').attr('id', 'order_track_Ref_tbody');
            
                                    var $serviceLevelRow = $('<tr />');
                                    $serviceLevelRow.append($('<td />').text('Service Level'), $('<td />').html('<b class="text-green">' + data_od['service_level'] + '</b>'));
            
                                    var origin = [data_od['origin_city'], data_od['origin_state'], data_od['origin_zip']].join(', ');
                                    var $originRow = $('<tr />');
                                    $originRow.append($('<td />').text('Origin'), $('<td />').html('<b class="text-green">' + origin + '</b>'));
            
                                    var dest = [data_od['dest_city'], data_od['dest_state'], data_od['dest_zip']].join(', ');
                                    var $destRow = $('<tr />');
                                    $destRow.append($('<td />').text('Destination'), $('<td />').html('<b class="text-green">' + dest + '</b>'));
            
                                    var $numOfItemsRow = $('<tr />');
                                    $numOfItemsRow.append($('<td />').text('#Items'), $('<td />').html('<b class="text-green">' + data_od['num_of_items'] + '</b>'));
            
                                    var $numOfPiecesRow = $('<tr />');
                                    $numOfPiecesRow.append($('<td />').text('#Pieces'), $('<td />').html('<b class="text-green">' + data_od['num_of_pieces'] + '</b>'));
            
                                    $tbody.append($serviceLevelRow, $originRow, $destRow, $numOfItemsRow, $numOfPiecesRow);
                                    $table.append($tbody);
            
                                    var $timelineList = $('<ul />').attr('id', 'ot_timeline_ul1').addClass('timeline');
            
                                    $.each(data_ot, function (k1, v1) {
                                        var $timeLabel = $('<li />').addClass('time-label').append($('<span />').addClass('bg-maroon').text(k1));
                                        $timelineList.append($timeLabel);
            
                                        $.each(v1, function (k2, v2) {
                                            var $icon = $('<i />').addClass('fa fa-truck bg-green');
                                            var $time = $('<span />').addClass('time').html('<i class="fa fa-clock"></i> ' + v2['created_at_time_formatted']);
                                            var $header = $('<h3 />').addClass('timeline-header no-border').text(v2['t_status']);
                                            var $timelineItem = $('<li />').append($icon, $('<div />').addClass('timeline-item').append($time, $header));
                                            $timelineList.append($timelineItem);
            
                                            if (v2['t_status'].toLowerCase() === 'delivery completed') {
                                                $icon.css({ 'bottom': '0px', 'top': 'initial' });
                                                dRow.delivery_completed = true;
                                                dRow.delivery_completed_on = v2['created_at_formatted'];
                                            }
                                        });
            
                                        if ($timelineList.children().length === 0) {
                                            $timelineList.append($('<li />').text('No information found'));
                                        } else {
                                            if (!dRow.delivery_completed) {
                                                var $listItem = $('<li />').html('<i class="fa fa-clock bg-gray"></i>');
                                                $timelineList.append($listItem);
                                            } else {
                                                rows.push({ label: 'Delivery Completed on', value: deliveryCompletedOn });
                                            }
                                        }
                                    });
            
                                    $panelOrderRow.append($table);
                                    $fullWidthDiv.append($panelOrderRow);
            
                                    $ulTrackRef.append($fullWidthDiv);
                                    $ulTimeline.append($timelineList);
                                });
            
                                $tableOrderTrackRef.show("slow");
                            }
                        },
                        error: function (data) {
                            console.log('Error:', data);
                            $this.html($this_current_html);
                            $this.attr('disabled', false);
                        }
                    });
                }
            }
                              

            /**
             * Roll Back the button to it's original text
             * @param {*} $this
             */
            function backToOriginalButton($this){
                $active_xhr = false;
                $this.html($this.data('original-text')); //Back To Save
                $this.attr('disabled',false);
            }
            
            /**
             * clear all error messages from form
             */
            function clearErrorMessages(){
                $('.has-error').each(function(){
                    $(this).find('p.ss-error-message').remove();
                    $(this).removeClass('has-error');
                });
            }
            /**
             * Show all server side error messages to corresponding element
             * @param field_errors
             */
            function showSSErrorMessages(field_errors){
                var focus_elem = '';
                var counter=0;
                // append all errors to corresponding element
                $.each(field_errors, function(k,v){
                    v = v.join('<br>')
                    if(k.indexOf('.') !== -1){
                        var k_split = k.split('.');
                        var aElem = $("input[name='"+k_split[0]+"[]']");
                        $.each(aElem, function(k1,v1){
                            if($(v1).prop('id') == 'agent_name_'+ (parseInt(k_split[1])+1)){
                                $(v1).parent().parent().addClass('has-error');
                                $(v1).parent().parent().append(
                                    $('<p />')
                                        .addClass('help-block text-danger ss-error-message')
                                        .html(v)
                                ).html();
                            }
                        })
                    } else {
                        $("#"+k).parent().addClass('has-error');
                        $("#"+k).parent().append(
                            $('<p />')
                                .addClass('help-block text-danger ss-error-message')
                                .html(v)
                        ).html();
                    }
                    if(counter==0){
                        focus_elem = k;
                    }
                    counter++;
                });
                // focus to first error element and scroll to that element
                if(focus_elem != ''){
                    $("#"+focus_elem).focus();
                    $('html, body').animate({
                        scrollTop: ($('.has-error').first().offset().top)
                    },500);
                }
            }


        }

        new homeTrackOrder();
    });
})(jQuery);
