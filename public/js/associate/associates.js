$(function () {
    var $btn = null;
    // GET DATA DYNAMICALLY
    var table = $('#associates_table').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: window.ls.associates.routes.list,
            type: "GET",
            data: function(d) {
                d.status = $('#filter_status').val() || '-All-';
            }
        },
        columns: [
            { data: 0, orderable: false, searchable: false, className: 'text-center' },
            { data: 1, orderable: false , className: 'text-center'},
            { data: 2, className: 'text-center' },
            { data: 3, className: 'text-center' },
            { data: 4, className: 'text-center' },
            { data: 5, className: 'text-center' },
            { data: 6, className: 'text-center' },
            { data: 7, className: 'text-center' },
            { data: 8, orderable: false, className: 'text-center' },
            { data: 9 , className: 'text-center'},
            { data: 10, orderable: false}
        ],
        lengthMenu: [[10,25,50,100], [10,25,50,100]],
        scrollX: true
    });

    $('#filtersButton').click(function(){
        table.ajax.reload();
    });

    $('#btn_reset_filters').click(function(){
        $('#filter_status').val('-All-');
        table.ajax.reload();
    });

    $('#check_all').on('click', function(){
        $('.associate-checkbox').prop('checked', this.checked);
    });

    $(document).on('change','.associate-checkbox',function(){
        $('#check_all').prop($('.associate-checkbox:checked').length === $('.associate-checkbox').length);
    });




    function showError(fieldId, message) {
        // Displays the error message text (e.g., in #a_company_name_error)
        $('#' + fieldId + '_error').text(message);
        // Highlights the input's parent form group
        $('#' + fieldId).closest('.form-group').addClass('has-error');
        // Note: isValid is set to false in the submit handler scope
    }

    function sanitizeInput(value) {
        value = value.trim();

        // Remove any potentially dangerous special characters
        // (e.g. <, >, ", ', /, \, ;, (, ), {, }, etc.)
        return value.replace(/[<>"'\/\\;(){}$%^&*+=\[\]|`~]/g, '');
    }

    //1) ADD ASSOCIATE (Replaces the alert with a modal)
    $('#btn_add_associate').on('click', function () {
        $btn = null ; 

        // 1. Clear previous form data and errors
        $('#addAssociateForm')[0].reset();
        $('.help-block').text('');
        $('.form-group').removeClass('has-error');
        // Hide the edit-only radio group
        $('#apply_commission_group').hide();

        $('#addAssociateModal').modal('show');
    });


    // Form Submission using AJAX
    $('#addAssociateForm').on('submit', function (e) {
        e.preventDefault();

        // 1. CLEAR ALL PREVIOUS ERRORS AND CLASSES
        $('.help-block').text('');
        $('.form-group').removeClass('has-error');

        // --- Start Client-Side Validation ---
        let isValid = true;


        // Logo validation function (kept internal to the submit handler)
        function validateLogoFile(file) {
            if (!file) return "A Logo file is required to create an associate.";

            if (file.size > window.ls.associates.MAX_LOGO_SIZE_MB * 1024 * 1024) {
                return `File size is too large. Logo must not exceed ${MAX_LOGO_SIZE_MB}MB.`;
            }

            if (!window.ls.associates.ALLOWED_LOGO_TYPES.includes(file.type)) {
                return `Invalid file type`;
            }

            return null; // valid
        }

        // Individual Field Validations
        const companyName =  sanitizeInput($('#a_company_name').val().trim());
        if (!companyName) {
            showError('a_company_name', 'Company Name cannot be empty.'); // Improved
            isValid = false;
        }

        const shortCode =  sanitizeInput($('#a_short_code').val().trim());
        if (!shortCode) {
            showError('a_short_code', 'Short Code is required for system identification.');
            isValid = false;
        } else if (shortCode.length > 15) {
            showError('a_short_code', 'Short Code must be 15 characters or less.');
            isValid = false;
        }

        const logoFile = $('#a_logo')[0].files[0];
        const logoError = validateLogoFile(logoFile);
        if (logoError) {
            showError('a_logo', logoError);
            isValid = false;
        }

        const contactPerson =  sanitizeInput($('#a_contact_person').val().trim());
        if (!contactPerson) {
            showError('a_contact_person', 'Contact Person name is required.');
            isValid = false;
        }

        const email = sanitizeInput($('#a_email').val().trim());
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            showError('a_email', 'Email address is required.');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError('a_email', 'Please enter a valid email address (e.g., name@company.com).');
            isValid = false;
        }

        const phoneNumber =  sanitizeInput($('#a_phone_number').val().trim());
        if (!phoneNumber) {
            showError('a_phone_number', 'A Phone Number is required.');
            isValid = false;
        } else if (phoneNumber.length > 50) {
            showError('a_phone_number', 'Phone Number must not exceed 50 characters.');
            isValid = false;
        }

        const commissionPercentage =  sanitizeInput($('#a_commission_percentage').val());
        const commissionNum = parseFloat(commissionPercentage);

        // Validate commission
        if (commissionPercentage === '' || isNaN(commissionNum)) {
            showError('a_commission_percentage', 'Commission % required.');
            isValid = false;
        } else if (commissionNum < 0.01 || commissionNum > 99.99) {
            showError('a_commission_percentage', 'Commission % must be between 0.01 and 99.99.');
            isValid = false;
        }
        // Stop submission if client-side validation failed
        if (!isValid) {
            $('#btn_save_associate').prop('disabled', false).text('Save Associate');
            // No alert, rely on inline messages for better UX
            return;
        }
        // --- End Client-Side Validation ---


        const formData = new FormData();
        formData.append('a_company_name', companyName);
        formData.append('a_short_code', shortCode);
        formData.append('a_contact_person', contactPerson);
        formData.append('a_email', email);
        formData.append('a_phone_number', phoneNumber);
        formData.append('a_commission_percentage', commissionPercentage);
        formData.append('a_logo', $('#a_logo')[0].files[0]);
        // Add loading state before AJAX
        $('#btn_save_associate').prop('disabled', true).text('Saving...');

        $.ajax({
            url: window.ls.associates.routes.add,
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (response) {
                // Success logic (modal close, alert, reload)
                $('#addAssociateModal').modal('hide');
                // Using a nicer toast/swal/toastr is recommended over default alert for success
                showFlashModal(true, "Associate added successully");
                $(document).on("click", ".close, .modal", function () {
                    table.ajax.reload();
                });
            },
            error: function (xhr) {
                // Server-side validation error handling (preserved)
                var errors = xhr.responseJSON.errors;
                if (errors) {
                    // Clear errors one more time before showing server errors
                    $('.help-block').text('');
                    $('.form-group').removeClass('has-error');

                    $.each(errors, function (key, value) {
                        // key will be the input name (e.g., 'a_company_name')
                        // fieldName will be the same as key (assuming no nested arrays)
                        var fieldName = key.replace('.', '_');
                        // This line is correct to display the specific server error message
                        showError(fieldName, value[0]);
                    });
                } else {
                    var errorMsg = xhr.responseJSON.message || 'An unexpected error occurred.';
                    showFlashModal(false, errorMsg);
                    $(document).on("click", ".close, .modal", function () {
                        table.ajax.reload();
                    });
                }
            },
            complete: function () {
                // Remove loading state regardless of success or failure
                $('#btn_save_associate').prop('disabled', false).text('Save Associate');
            }
        });
    });


    // 2) DEFAULT BUTTON 
    $(document).on('change', '.default-switch', function () {
        var $switch = $(this); // Cache 'this'
        var id = $switch.data('id');
        var isChecked = $switch.is(':checked') ? 1 : 0;
        // updateUrl = updateUrl.replace(':id', id);
        var url = window.ls.associates.routes.updateTemplate.replace(':id', id);
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: {
                a_default: isChecked // Only send the actual data
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') // CSRF in headers
            },
            success: function (response) {
                if (response.success) {
                    showFlashModal(true, "Associate Updated Successfully");
                    $(document).on("click", ".close, .modal", function () {
                        table.ajax.reload();
                    });
                } else {
                    showFlashModal(false, "Update Failed");
                    $(document).on("click", ".close, .modal", function () {
                        table.ajax.reload();
                    });
                    // Revert the switch
                    $switch.prop('checked', !isChecked);
                }
            },
            error: function (xhr) {
                var errorMsg = 'An unknown error occurred.';

                // Use the Laravel response if available
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMsg = xhr.responseJSON.message;
                } else if (xhr.status === 422) {
                    errorMsg = 'Validation failed. Please check your input.';
                } else if (xhr.status === 400) {
                    errorMsg = xhr.responseJSON?.message || 'Bad request';
                } else if (xhr.status === 404) {
                    errorMsg = 'Update URL not found.';
                } else if (xhr.status === 500) {
                    errorMsg = xhr.responseJSON?.message || 'Internal server error.';
                }

                showFlashModal(false, errorMsg);
                $(document).on("click", ".close, .modal", function () {
                    table.ajax.reload();
                });
                // Revert the switch state so UI matches DB
                $switch.prop('checked', !isChecked);
            }
        });
    });





    // 3) -> EDIT/UPDATE
    $(document).on('click', '.btn_edit_associate', function () {
        $btn = $(this);

        // --- RESET pending items for fresh modal ---
        $('#apply_commission_group').hide();
        $('#pending_items_list').hide();
        $('#pending_quotes').empty();
        $('#pending_orders').empty();
        // Reset radio buttons each time modal opens
        $('#apply_commission_checkbox').prop('checked', false);

        // 0. CLEAR PREVIOUS ERRORS AND SET MODAL FOR EDIT 🚀
        // Clear any leftover validation errors from a previous Add or Edit attempt
        $('.help-block').text('');
        $('.form-group').removeClass('has-error');

        // Set Modal Title and Save Button Text for Edit
        $('#addAssociateModalLabel').text('Edit Associate');
        $('#btn_save_associate').text('Update Associate'); // Change button text for edit context

        // Populate modal fields directly from data attributes
        $('#a_company_name').val($btn.data('company-name'));
        $('#a_short_code').val($btn.data('short-code'));
        $('#a_email').val($btn.data('email'));
        $('#a_contact_person').val($btn.data('contact-person'));
        $('#a_phone_number').val($btn.data('phone-number'));
        $('#a_commission_percentage').val($btn.data('commission'));

        // Logo preview
        const logoUrl = $btn.data('logo');
        if (logoUrl) {
            $('#logoPreview').attr('src', logoUrl).show();
        } else {
            $('#logoPreview').hide();
        }

        // Show modal
        $('#addAssociateModal').modal('show');

        // Bind form submission for update
        $('#addAssociateForm').off('submit').on('submit', function (e) {
            e.preventDefault();

            // 1. CLEAR ALL PREVIOUS ERRORS AND CLASSES
            $('.help-block').text('');
            $('.form-group').removeClass('has-error');

            let isValid = true;
            const formData = new FormData();
            // Only include checkbox value if editing
            if ($('#apply_commission_group').is(':visible')) {
                const applyPending = $('#apply_commission_checkbox').is(':checked') ? 1 : 0;
                formData.append('apply_pending_commission', applyPending);
            }
            // Optional logo validation only if file selected
            const logoFile = $('#a_logo')[0].files[0];
            if (logoFile) {
                if (logoFile.size > MAX_LOGO_SIZE_MB * 1024 * 1024) {
                    showError('a_logo', `File size must not exceed ${MAX_LOGO_SIZE_MB}MB.`);
                    isValid = false;
                } else if (!ALLOWED_LOGO_TYPES.includes(logoFile.type)) {
                    showError('a_logo', `Invalid file type.`);
                    isValid = false;
                }
            }

            // Validate other fields (same as add)
            const companyName =  sanitizeInput($('#a_company_name').val().trim());
            if (!companyName) { showError('a_company_name', 'Company Name cannot be empty.'); isValid = false; }

            const shortCode =  sanitizeInput($('#a_short_code').val().trim());
            if (!shortCode) { showError('a_short_code', 'Short Code is required.'); isValid = false; }
            else if (shortCode.length > 15) { showError('a_short_code', 'Short Code must be 15 chars or less'); isValid = false; }

            const contactPerson =  sanitizeInput($('#a_contact_person').val().trim());
            if (!contactPerson) { showError('a_contact_person', 'Contact Person is required.'); isValid = false; }

            const email =  sanitizeInput($('#a_email').val().trim());
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email) { showError('a_email', 'Email is required.'); isValid = false; }
            else if (!emailRegex.test(email)) { showError('a_email', 'Enter valid email.'); isValid = false; }

            const phoneNumber =  sanitizeInput($('#a_phone_number').val().trim());
            if (!phoneNumber) { showError('a_phone_number', 'Phone Number required.'); isValid = false; }
            else if (phoneNumber.length > 50) { showError('a_phone_number', 'Phone must be ≤50 chars.'); isValid = false; }

            const commissionPercentage =  sanitizeInput($('#a_commission_percentage').val());
            const commissionNum = parseFloat(commissionPercentage);

            // Validate commission
            if (commissionPercentage === '' || isNaN(commissionNum)) {
                showError('a_commission_percentage', 'Commission % required.');
                isValid = false;
            } else if (commissionNum < 0.01 || commissionNum > 99.99) {
                showError('a_commission_percentage', 'Commission % must be between 0.01 and 99.99.');
                isValid = false;
            }
            if (!isValid) { $('#btn_save_associate').prop('disabled', false).text('Save Associate'); return; }

            
            formData.append('a_company_name', companyName);
            formData.append('a_short_code', shortCode);
            formData.append('a_contact_person', contactPerson);
            formData.append('a_email', email);
            formData.append('a_phone_number', phoneNumber);
            formData.append('a_commission_percentage', commissionPercentage);
            formData.append('a_logo', $('#a_logo')[0].files[0]);
            
            $('#btn_save_associate').prop('disabled', true).text('Updating...');
            var id =  $btn.data('id');
            var url = window.ls.associates.routes.updateTemplate.replace(':id', id);
            $.ajax({
                url: url,
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                success: function (response) {
                    if (response.success) {
                        $('#addAssociateModal').modal('hide');
                        showFlashModal(true, 'Associate updated successfully');
                        $(document).on("click", ".close, .modal", function () {
                            table.ajax.reload();
                        });
                    } else {
                        showFlashModal(false, 'Update failed');
                        $(document).on("click", ".close, .modal", function () {
                            table.ajax.reload();
                        });
                    }
                },
                error: function (xhr) {
                    const errors = xhr.responseJSON?.errors;
                    if (errors) {
                        $('.help-block').text('');
                        $('.form-group').removeClass('has-error');
                        $.each(errors, function (key, value) {
                            showError(key.replace('.', '_'), value[0]);
                        });
                    } else {
                        showFlashModal(false, xhr.responseJSON?.message || 'Unexpected error');
                        $(document).on("click", ".close, .modal", function () {
                            table.ajax.reload();
                        });
                    }
                },
                complete: function () {
                    $('#btn_save_associate').prop('disabled', false).text('Save Associate');
                }
            });
        });
    });


    // 3) -> Trigger only on edit modal and only if commission input changes
    $(document).on('input', '#a_commission_percentage', function () {
        if (!$btn) return; // no button reference → exit
        const pendingItemsUrl = $btn.data('pending-items-url'); // safe now
        const associateId = $btn.data('id');  // get selected associate id

        if (!pendingItemsUrl) return;

        $.ajax({
            url: pendingItemsUrl,
            type: 'GET',
            data: { associates_id: associateId }, // send associate id only
            dataType: 'json',
            success: function (res) {
                if (res.success && (res.quotes.length || res.orders.length)) {
                    $('#apply_commission_group').show();
                    $('#pending_items_list').show();

                    // Quotes links
                    const quoteLinks = res.quotes.map(id => {
                        const url = window.ls.associates.routes.quote.replace(':id', id);  // replace placeholder
                        return `<a href="${url}" target="_blank">${id}</a>`;
                    }).join(', ');
                    const quotesText = quoteLinks + (res.quotes_more ? ', <em>and more...</em>' : '');
                    $('#pending_quotes').html(quotesText || 'None');

                    // Orders links
                    const orderLinks = res.orders.map(id => {
                        const url = window.ls.associates.routes.order.replace(':id', id);
                        return `<a href="${url}" target="_blank">${id}</a>`;
                    }).join(', ');
                    const ordersText = orderLinks + (res.orders_more ? ', <em>and more...</em>' : '');
                    $('#pending_orders').html(ordersText || 'None');
                } else {
                    $('#apply_commission_group').hide();
                    $('#pending_items_list').hide();
                }
            },
            error: function () { // if any kind of error occured while fetcing the data of all the open orders or qutes then we will just not show that div and 
                $('#apply_commission_group').hide();
                $('#pending_items_list').hide();
                $('#apply_commission_checkbox').prop('checked', false);
            }
        });
    });


    // 4) DELETE
    // Function to display errors/warnings nicely
    function showErrors(errors) {
        if (!errors || !errors.length) return;

        let errorMsg = errors.join("\n");
        showFlashModal(false, errorMsg);
    }

    // SINGLE DELETE
    $(document).on('click', '.btn_delete_associate', function() {
        const id =  $(this).data('id');
        if (!confirm('Remove selected associate? All open quotes and orders of users linked to this associate will be reassigned to the default associate.')) return;

        $.ajax({
            url: window.ls.associates.routes.delete,
            type: 'POST',
            data: { ids: [id] }, // Always send as array
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            success: function(response) {
                if (response.status) {
                    showFlashModal(true, response.message);
                    if (response.error && response.error.length) {
                        showErrors(response.error);
                    }
                    $(document).on("click", ".close, .modal", function () {
                        table.ajax.reload();
                    });
                } else {
                    // showFlashModal(false,response.message || 'Delete failed.');
                    if (response.error && response.error.length) {
                        showErrors(response.error);
                    }
                }
            },
            error: function (xhr) {
                showFlashModal(false, xhr.responseJSON?.message || 'An unexpected error occurred.');
            }
        });
    });

    // BULK DELETE
    $('#btn_delete_selected').on('click', function () {
        const selectedIds = $('.associate-checkbox:checked').map(function () {
            return  sanitizeInput($(this).val());
        }).get();

        if (selectedIds.length === 0) {
            showFlashModal(false, 'Please select at least one associate to delete.');
            return;
        }

        if (!confirm('Remove selected associates? All open quotes and orders of users linked to this associate will be reassigned to the default associate.')) return;

        $.ajax({
            url: window.ls.associates.routes.delete,
            type: 'POST',
            data: { ids: selectedIds },
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            success: function (response) {
                if (response.status) {
                    showFlashModal(true, response.message);
                    if (response.error && response.error.length) {
                        showErrors(response.error);
                    }
                    $(document).on("click", ".close, .modal", function () {
                        table.ajax.reload();
                    });
                } else {
                    showFlashModal(false, response.message || 'Bulk delete failed.');
                }
            },
            error: function (xhr) {
                showFlashModal(false, xhr.responseJSON?.message || 'An unexpected error occurred.');
            }
        });
    });

});