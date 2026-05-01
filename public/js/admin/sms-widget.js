// SMS Widget Component
(function ($) {
    $(document).ready(function () {
        function SMSWidget() {
            var urlGetContacts = ('undefined' === typeof window.lsSMSData) || (false === ('urlGetContacts' in window.lsSMSData)) ? '' : window.lsSMSData['urlGetContacts'],
                urlUserContacts = ('undefined' === typeof window.lsSMSData) || (false === ('urlUserContacts' in window.lsSMSData)) ? '' : window.lsSMSData['urlUserContacts'],
                userRoles = ('undefined' === typeof window.lsSMSData) || (false === ('userRoles' in window.lsSMSData)) ? '' : window.lsSMSData['userRoles'],
                urlSendSms = ('undefined' === typeof window.lsSMSData) || (false === ('urlSendSms' in window.lsSMSData)) ? '' : window.lsSMSData['urlSendSms'],
                urlGetSmsLogs = ('undefined' === typeof window.lsSMSData) || (false === ('urlGetSmsLogs' in window.lsSMSData)) ? '' : window.lsSMSData['urlGetSmsLogs'],
                MIN_CHARACTERS_5 = ('undefined' === typeof window.lsSMSData) || (false === ('MIN_CHARACTERS_5' in window.lsSMSData)) ? '' : window.lsSMSData['MIN_CHARACTERS_5'],
                MIN_CHARACTERS_10 = ('undefined' === typeof window.lsSMSData) || (false === ('MIN_CHARACTERS_10' in window.lsSMSData)) ? '' : window.lsSMSData['MIN_CHARACTERS_10'],
                MAX_CHARACTERS_200 = ('undefined' === typeof window.lsSMSData) || (false === ('MAX_CHARACTERS_200' in window.lsSMSData)) ? '' : window.lsSMSData['MAX_CHARACTERS_200'],
                MAX_CHARACTERS_300 = ('undefined' === typeof window.lsSMSData) || (false === ('MAX_CHARACTERS_300' in window.lsSMSData)) ? '' : window.lsSMSData['MAX_CHARACTERS_300'],
                contactDropdownPlaceholder = ('undefined' === typeof window.lsSMSData) || (false === ('contactDropdownPlaceholder' in window.lsSMSData)) ? '' : window.lsSMSData['contactDropdownPlaceholder'],
                userDropdownPlaceholder = ('undefined' === typeof window.lsSMSData) || (false === ('userDropdownPlaceholder' in window.lsSMSData)) ? '' : window.lsSMSData['userDropdownPlaceholder'],
                phoneAndMessageRequired = ('undefined' === typeof window.lsSMSData) || (false === ('phoneAndMessageRequired' in window.lsSMSData)) ? '' : window.lsSMSData['phoneAndMessageRequired'],
                invalidPhoneNumber = ('undefined' === typeof window.lsSMSData) || (false === ('invalidPhoneNumber' in window.lsSMSData)) ? '' : window.lsSMSData['invalidPhoneNumber'],
                phoneRequired = ('undefined' === typeof window.lsSMSData) || (false === ('phoneRequired' in window.lsSMSData)) ? '' : window.lsSMSData['phoneRequired'],
                messageRequired = ('undefined' === typeof window.lsSMSData) || (false === ('messageRequired' in window.lsSMSData)) ? '' : window.lsSMSData['messageRequired'],
                messageMinLength = ('undefined' === typeof window.lsSMSData) || (false === ('messageMinLength' in window.lsSMSData)) ? '' : window.lsSMSData['messageMinLength'],
                messageMaxLength = ('undefined' === typeof window.lsSMSData) || (false === ('messageMaxLength' in window.lsSMSData)) ? '' : window.lsSMSData['messageMaxLength'],
                smsSentSuccessfully = ('undefined' === typeof window.lsSMSData) || (false === ('smsSentSuccessfully' in window.lsSMSData)) ? '' : window.lsSMSData['smsSentSuccessfully'],
                smsFailed = ('undefined' === typeof window.lsSMSData) || (false === ('smsFailed' in window.lsSMSData)) ? '' : window.lsSMSData['smsFailed'],
                $btnOpenSMSModal = $('#btnOpenSMSModal'),
                $btnSendSMSToClient = $('#btnSendSMSToClient'),
                $contactDropdown = $('#contactDropdown'),
                $userDropdown = $('#userDropdown'),
                $our_sms_reference = $('#our_sms_reference'),
                $client_phone = $('#client_phone'),
                $sms_message = $('#sms_message'),
                $charCount = $('#charCount'),
                $sendSmsModal = $('#sendSmsModal'),
                $smsLogsTable = $('#smsLogsTable'),
                $formSendSms = $('#sendSmsForm');
            init();
            function init() {
                // Initialize Toastr
                toastr.options.closeButton = true;
                $btnOpenSMSModal.on('click', openSMSSendModal);
                $sendSmsModal.on('shown.bs.modal', function (e) {
                    // Reset form when modal is shown
                    resetSMSForm(e);
                    // Get SMS logs
                    // getSmsLogs(e);
                });

                // When the SMS Logs tab is shown, load the logs
                $('a[data-toggle="tab"][href="#sms-logs-tab"]').on('shown.bs.tab', function(e) {
                    getSmsLogs();
                });
                
                // Live character count for message
                $sms_message.on('input', charCount);
                let prevReqContactDropdown = null;
                // Contact Dropdown Initialization
                $contactDropdown.select2({
                    placeholder: contactDropdownPlaceholder,
                    dropdownParent: $sendSmsModal,
                    allowClear: true,
                    ajax: {
                        url: urlGetContacts,
                        dataType: 'json',
                        delay: 250,
                        method: "POST",
                        headers: {
                            'X-CSRF-TOKEN': $('input[name="_token"]').val()
                        },
                        data: function (params) {
                            return {
                                q: params.term || '',
                                page: params.page || 1
                            };
                        },
                        transport: function (params, success, failure) {
                            // Abort previous request if it exists
                            if (prevReqContactDropdown) {
                                prevReqContactDropdown.abort();
                            }

                            // Make new AJAX request
                            prevReqContactDropdown = $.ajax(params);
                            prevReqContactDropdown.then(success);
                            prevReqContactDropdown.fail(failure);

                            return prevReqContactDropdown;
                        },
                        processResults: function (data, params) {
                            params.page = params.page || 1;
                            return {
                                results: data.results,
                                pagination: {
                                    more: data.pagination.more
                                }
                            };
                        },
                        cache: true
                    }
                });
                // Handle contact selection
                $contactDropdown.on('select2:select', function(e) {
                    var data = e.params.data;
                    $client_phone.val(data.phone);
                    $our_sms_reference.val(data.reference);
                });

                let prevReqUserDropdown = null;
                // User Dropdown Initialization
                $userDropdown.select2({
                    placeholder: userDropdownPlaceholder,
                    dropdownParent: $sendSmsModal,
                    allowClear: true,
                    ajax: {
                        url: urlUserContacts,
                        dataType: 'json',
                        delay: 250,
                        method: "GET",
                        // headers: {
                        //     'X-CSRF-TOKEN': $('input[name="_token"]').val()
                        // },
                        data: function (params) {
                            return {
                                term: params.term || '',
                                page: params.page || 1,
                                u_roles: userRoles, // Filter by user roles if needed
                                u_with_roles: true // Include users with roles
                            };
                        },
                        transport: function (params, success, failure) {
                            // Abort previous request if it exists
                            if (prevReqUserDropdown) {
                                prevReqUserDropdown.abort();
                            }

                            // Make new AJAX request
                            prevReqUserDropdown = $.ajax(params);
                            prevReqUserDropdown.then(success);
                            prevReqUserDropdown.fail(failure);

                            return prevReqUserDropdown;
                        },
                        processResults: function (data, params) {
                            params.page = params.page || 1;
                            return {
                                results: data.results,
                                pagination: {
                                    more: data.pagination.more
                                }
                            };
                        },
                        cache: true
                    }
                });
                // Handle user selection
                $userDropdown.on('select2:select', function(e) {
                    var data = e.params.data;
                    $client_phone.val(data.phone1);
                    $our_sms_reference.val(data.text);
                });

                // Handle SMS form submission
                $sendSmsModal.on('submit', sendSMSForm);
            }
            function openSMSSendModal() {
                $sendSmsModal.modal('show');
            }
            function resetSMSForm() {
                $(this).removeAttr('aria-hidden');
                resetForm();
            }
            function resetForm() {
                $formSendSms[0].reset();
                $contactDropdown.val(null).trigger('change'); // Reset Select2
                $charCount.text(MAX_CHARACTERS_200 +' characters remaining.');
                $('#sms_log_date_filter').datepicker('setDate', new Date());
            }
            function charCount(){
                var remaining = MAX_CHARACTERS_200 - $(this).val().length;
                $charCount.text(remaining + ' characters remaining.');
            }
            function sendSMSForm(e){
                e.preventDefault();
                var sms_message = $sms_message.val().trim();
                var client_phone = $client_phone.val().trim();
                if (!sms_message && !client_phone) {
                    toastr.error(phoneAndMessageRequired);
                    $client_phone.focus();
                    return;
                }
                if (!client_phone) {
                    toastr.error(phoneRequired);
                    $client_phone.focus();
                    return;
                }
                // Validate phone numbers
                var phoneArray = client_phone.split(',');
                var invalidPhones = phoneArray.filter(function(phone) {
                    return !/^\d{10}$/.test(phone.trim());
                });

                if (invalidPhones.length > 0) {
                    toastr.error(invalidPhoneNumber);
                    $client_phone.focus();
                    return;
                }
                if (!sms_message) {
                    $sms_message.focus();
                    toastr.error(messageRequired);
                    return;
                }
                // Validate SMS message length
                if (sms_message.length < MIN_CHARACTERS_5) {
                    toastr.error(messageMinLength);
                    $sms_message.focus();
                    return;
                }
                if (sms_message.length > MAX_CHARACTERS_200) {
                    toastr.error(messageMaxLength);
                    $sms_message.focus();
                    return;
                }
                var formData = {
                    order_id: $contactDropdown.val(),
                    our_sms_reference: $our_sms_reference.val(),
                    client_phone: client_phone,
                    sms_message: sms_message
                };
                $.ajax({
                    url: urlSendSms,
                    method: 'POST',
                    data: formData,
                    headers: {
                        'X-CSRF-TOKEN': $('input[name="_token"]').val()
                    },
                    beforeSend: function() {
                        $sendSmsModal.find('.btn').prop('disabled', true);
                    },
                    success: function(res) {
                        $sendSmsModal.find('.btn').prop('disabled', false);
                        // $('#smsSuccess').show().delay(3000).fadeOut();
                        if(res.status){
                            if(res.code && res.code === 203){
                                // Partial success
                                toastr.warning(res.message);
                                showErrorMessages(res.errors);
                            } else {
                                toastr.success(res.message);
                            }
                            resetForm();
                            $smsLogsTable.DataTable().draw();
                        }else{
                            toastr.error(res.message);
                            showErrorMessages(res.errors);
                        }
                    },
                    error: function(xhr) {
                        $sendSmsModal.find('.btn').prop('disabled', false);
                        let msg = xhr.responseJSON?.message || 'Unknown error occurred.';
                        toastr.error(smsFailed + ' Error: '+ msg);
                    }
                });
            }

            function showErrorMessages(errors){
                if(errors.length > 0){
                    errors.forEach(function(error) {
                        toastr.error(error);
                    });
                }
            }

            function getSmsLogs(e){
                $smsLogsTable.DataTable({
                    destroy: true,
                    dom : "<'row'<'#filter_by_date_div.col-sm-4'><'col-sm-4'><'col-sm-4'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-5'i><'col-sm-7'p>>",
                    responsive: true,
                    order: [[0, 'desc']],
                    "processing": true,
                    "serverSide": true,
                    "ajax": {
                        url: urlGetSmsLogs,
                        type: 'POST',
                        headers: {
                            'X-CSRF-TOKEN': $('input[name="_token"]').val()
                        },
                        data: function (d) {
                            d.filter_by_date = $('#sms_log_date_filter').val();
                            d.filter_by_status = '';
                            d.entity_id = '';
                        },
                    },
                    "fnDrawCallback": function( oSettings ) {
                        //Initialize jquery plugin ?? other functions
                    },
                    "columns": [
                        { "data": "subject"},
                    ],
                    "language": {
                        search: "" // This removes the "Search:" label
                    },
                    "initComplete": function(settings, json) {
                        var table = this.api();
                        // Create the datepicker input using jQuery objects
                        var $datePickerContainer = $("#filter_by_date_div");
                        $datePickerContainer.empty(); // Clear existing content

                        var $inputGroup = $('<div>', { 'class': 'input-group date', 'style': 'width: 100%;' });
                        var $inputGroupAddon = $('<div>', { 'class': 'input-group-addon', 'style': 'width: 40px;' });
                        var $calendarIcon = $('<i>', { 'class': 'fa fa-calendar' });
                        var $dateInput = $('<input>', {
                            'type': 'text',
                            'class': 'form-control pull-right input-sm',
                            'id': 'sms_log_date_filter',
                            'readonly': true
                        });
                        
                        // Past Date button (< icon)
                        var $pastDateButton = $('<span>', {
                            'class': 'input-group-addon',
                            'style': 'cursor: pointer; width: 40px;',
                            'title': 'Past date'
                        }).html('<i class="fa fa-less-than"></i>'); // FontAwesome < icon

                        // Next Date button (> icon)
                        var $nextDateButton = $('<span>', {
                            'class': 'input-group-addon',
                            'style': 'cursor: pointer; width: 40px;',
                            'title': 'Next date'
                        }).html('<i class="fa fa-greater-than"></i>'); // FontAwesome > icon

                        // Clear button (X icon)
                        var $clearButton = $('<span>', {
                            'class': 'input-group-addon',
                            'style': 'cursor: pointer; width: 40px;',
                            'title': 'Clear date'
                        }).html('<i class="fa fa-times"></i>'); // FontAwesome X icon

                        // Assemble and append the elements
                        $inputGroupAddon.append($calendarIcon);
                        $inputGroup.append($inputGroupAddon);
                        $inputGroup.append($pastDateButton); // Add past date button
                        $inputGroup.append($dateInput);
                        $inputGroup.append($nextDateButton); // Add next date button
                        $inputGroup.append($clearButton); // Add clear button
                        $datePickerContainer.append($inputGroup);

                        // Initialize the datepicker
                        var datepicker = $inputGroup.datepicker({
                            autoclose: true,
                            format: 'mm/dd/yyyy',
                            todayHighlight: true
                        });

                        // Set default date to today and trigger initial draw
                        datepicker.datepicker('setDate', new Date());

                        // Manually trigger filter after setting the date
                        // Ensure input is updated before draw
                        setTimeout(function () {
                            $('#sms_log_date_filter').trigger('change'); // Optional: in case you're listening to change
                            table.draw(); // Now the input is filled, this will apply the filter correctly
                        }, 100); // Delay ensures datepicker sets the input value


                        // Add event listener for date change
                        datepicker.on('changeDate', function (e) {
                            table.draw();
                        });

                        // On clear button click
                        $clearButton.on('click', function () {
                            $dateInput.val(''); // Clear the input field
                            table.draw();       // Redraw table to reset filtering
                        });

                        // 📆 Button click logic (shared by both)
                        function updateDateBy(days) {
                            var $dateInput = $('#sms_log_date_filter');
                            var currentDateStr = $dateInput.val();

                            if (!currentDateStr) return;

                            var currentDate = new Date(currentDateStr);
                            if (isNaN(currentDate.getTime())) return;

                            // Update date by days (can be +1 or -1)
                            currentDate.setDate(currentDate.getDate() + days);

                            // Format as MM/DD/YYYY
                            var newDateStr = (currentDate.getMonth() + 1).toString().padStart(2, '0') + '/' +
                                            currentDate.getDate().toString().padStart(2, '0') + '/' +
                                            currentDate.getFullYear();

                            $dateInput.val(newDateStr);
                            $inputGroup.datepicker('update', currentDate);

                            // Redraw table
                            table.draw();
                        }

                        // 🔘 Hook up the buttons
                        $pastDateButton.on('click', function (e) {
                            e.stopPropagation(); // 🛑 Prevent calendar popup
                            e.stopImmediatePropagation(); // Stronger than stopPropagation
                            updateDateBy(-1);
                            $inputGroup.datepicker('hide'); // Force hide calendar
                        });

                        $nextDateButton.on('click', function (e) {
                            e.stopPropagation(); // 🛑 Prevent calendar popup
                            e.stopImmediatePropagation(); // Stronger than stopPropagation
                            updateDateBy(1);
                            $inputGroup.datepicker('hide'); // Force hide calendar
                        });

                        // Add placeholder to the search input
                        $('.dataTables_filter input')
                            .attr('placeholder', 'Search...')
                            .removeClass('form-control-sm'); // Optional styling tweak
                    },
                });
            }
        }
        new SMSWidget();
    });
})(jQuery);
