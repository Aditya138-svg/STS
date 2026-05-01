(function ($) {
    $(document).ready(function () {
        function AdminGroupsListPage() {
            var urlPaymentLogList = ('undefined' === typeof window.lsData) || (false === ('urlPaymentLogList' in window.lsData)) ? '' : window.lsData['urlPaymentLogList'],
                urlAddManualPaymentLog = ('undefined' === typeof window.lsData) || (false === ('urlAddManualPaymentLog' in window.lsData)) ? '' : window.lsData['urlAddManualPaymentLog'],
                screenName =  ('undefined' === typeof window.lsData) || (false === ('screenName' in window.lsData)) ? '' : window.lsData['screenName'],
                $btnAddPaymentLog = $('.addPaymentLog'),
                oTable = $('#listing_table');
                var dataTableInstance;
            init();
            function init() {
                $btnAddPaymentLog.on('click', addPaymentLog);
                $(document).on('click', '.view_more_log_modal', showMoreLogs );
                var textarea = document.getElementById('logText');
                textarea.addEventListener('input', function() {
                    clearErrorMessages();
                    var remainingChars = 250 - this.value.length;
                    if (remainingChars < 0) {
                    showSSErrorMessages('logText', 'You can not enter more than 250 characters.');
                    }
                });
                $(document).on('click', '.payment_log_modal', function() {
                    clearErrorMessages();
                    $('#logText').val('');
                    var orders_id = $(this).data('o-id');
                    $('#paymentLogModal').modal('show');
                    $('#payment_log_orders_id').val(orders_id);
                });
            }

            /**
             * Add manual payment log
             */
            function addPaymentLog(e) {
                clearErrorMessages();
                var logText = String($('#logText').val());
                var orders_id = $('#payment_log_orders_id').val();
                // Check if the text area is empty
                // Get button original text and replace with loader
                $this = $($btnAddPaymentLog);
                $loadingText = '<i class="fa fa-circle-notch fa-spin"></i> Adding...';
                $this_current_html = $($btnAddPaymentLog).html();
                // Get button original text and replace with loader 
                formData = { logText: logText, orders_id: orders_id , screen_name : screenName};
                if (logText.trim() === '') {
                    showSSErrorMessages('logText', 'Please enter your note.');
                    return;
                }
                if(logText.trim().length > 250) {
                    showSSErrorMessages('logText', 'You can not enter more than 250 characters.');
                    return;
                }
                $.ajax({
                    url: urlAddManualPaymentLog,
                    method: "POST",
                    data: formData,
                    headers: {
                        'X-CSRF-TOKEN': $('input[name="_token"]').val()
                    },
                    beforeSend: function(){
                            // Replace button's original text to loader
                            if ( $this_current_html !== $loadingText) {
                                $this.data('original-text', $this_current_html);
                                $this.html($loadingText);
                                $this.attr('disabled',true);
                            }
                        },
                    success: function(data) {
                        clearErrorMessages();
                        $this.prop("disabled", false);
                        if (data.status === false){
                            if (data.hasOwnProperty("field_errors")) {
                                var field_errors = data.field_errors;
                                showSSErrorMessagesBackend(field_errors);
                            } else {
                                // showFlashModal(data.status, data.message);
                            }
                            backToOriginalButton($this);
                        } else {
                            var rowIndex = $(this).closest('tr').index();
                            var row = oTable.DataTable().row(rowIndex);
                            row.invalidate().draw(false);
                            showFlashModal(data.status, data.message);
                            $('#logText').val('');
                            backToOriginalButton($this);
                        }
                    },
                    error: function(error) {
                        // $this.prop("disabled", false);
                        // Handle the error response if needed
                        console.error("Error adding payment log:", error);
                    }
                });
                clearErrorMessages();
            };

            /**
             * Show more Log
             */
            function showMoreLogs(e) {
                var orders_id = $(this).data('o-id');
                $('#moreLogsModal').modal('show');

                if (dataTableInstance) {
                    $('#morePaymentLogTable').DataTable().destroy(); // Destroy the DataTable instance
                }

                dataTableInstance = $('#morePaymentLogTable').DataTable({
                    "processing": true,
                    "searching": true,
                    "serverSide": true,
                    "order": [],
                    "ajax": function (data, callback, settings) {
                        data.orders_id = orders_id;

                        $.ajax({
                            url: urlPaymentLogList,
                            type: "POST",
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            },
                            data: data,
                            success: function (response) {
                                callback(response);
                            },
                            error: function (xhr, error, thrown) {
                                // Handle error if needed
                            }
                        });
                    },
                    "columns": [
                        {
                            "data": "payment_logs",
                            "render": function (data, type, row) {
                                return $('<div />').text(data).html();
                            }
                        }
                    ],
                    "dom": "<'row'<'col-sm-12'tr>><'row'<'col-sm-6'l><'col-sm-6'f>>tp",
                    "autoWidth": false
                });
            };

            /**
             * Roll Back the button to it's original text
             * @param {*} $this 
             */
            function backToOriginalButton($this) {
                $active_xhr = false;
                $this.html($this.data('original-text')); //Back To Save
                $this.attr('disabled', false);
            }

            function showSSErrorMessages(element_id, error_msg){
				$("#"+element_id).parent().addClass('has-error');
				$("#"+element_id).parent().append(
					$('<p />')
						.addClass('help-block text-danger ss-error-message')
						.html(error_msg)
				).html();
		    }
            function showSSErrorMessagesBackend(field_errors){
                var focus_elem = '';
                var counter=0;
                // append all errors to corresponding element
                $.each(field_errors, function(k,v){
                    v = v.join('<br>')
                    $("#"+k).parent().addClass('has-error');
                    $("#"+k).parent().append(
                        $('<p />')
                            .addClass('help-block text-danger ss-error-message')
                            .html(v)
                    ).html();
                    if(counter==0){
                        focus_elem = k;
                    }
                    counter++;
                });
            }

            function clearErrorMessages(){
                $('.has-error').each(function(){
                    $(this).find('p.ss-error-message').remove();
                    $(this).removeClass('has-error');
                });
            }
        }
        new AdminGroupsListPage();
    });
})(jQuery);