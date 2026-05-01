(function ($) {
    $(document).ready(function () {
        // ASSOCIATE SELECT WITH MODAL CONFIRM -------------------
        const associateSelect = $('#associate_id');
        const applyToPendingInput = $('#apply_to_pending');
        const modal = $('#associateConfirmModal');

        let originalValue =  window.defaultAssociateId || '1'  ; 
        let previousValue = originalValue;
        let newSelectedValue = null;
        // Initialize Select2 with AJAX
        associateSelect.select2({
            placeholder: '--Choose Associate--',
            width: '100%',
            allowClear: true,
            ajax: {
                url: window.associatesFetchUrl,
                dataType: 'json',
                delay: 250,
                data: function(params) {
                    return {
                        term: params.term || '',
                        page: params.page || 1
                    };
                },
                processResults: function(res, params) {
                    params.page = params.page || 1;
                    // Filter out inactive or deleted associates
                    const filteredData = res.data.filter(item => 
                        item.a_status != window.associateStatus.INACTIVE &&
                        item.a_status != window.associateStatus.DELETED
                    );
                    return {
                        results: filteredData.map(item => ({
                            id: item.id,
                            text: `${item.a_company_name} (${item.a_short_code})`,
                            a_company_name: item.a_company_name,
                            a_short_code: item.a_short_code,
                            a_commission_percentage: item.a_commission_percentage,
                            a_status: item.a_status,
                            disabled: (
                                item.a_status == window.associateStatus.INACTIVE ||
                                item.a_status == window.associateStatus.DELETED
                            )
                        })),
                        pagination: {
                            more: res.pagination && res.pagination.more
                        }
                    };
                },
                cache: true
            }
        });
        // Preselect default associate
        if (window.defaultAssociateId) {
            $.ajax({
                url: window.associatesFetchUrl,
                type: 'GET',
                dataType: 'json',
                data: { selected_id: window.defaultAssociateId },
                success: function(res) {
                    if(res.status && res.data.length){
                        const assoc = res.data[0];
                        const option = new Option(
                            `${assoc.a_company_name} (${assoc.a_short_code})`,
                            assoc.id,
                            true,
                            true
                        );
                        $(option).data({
                            a_company_name: assoc.a_company_name,
                            a_short_code: assoc.a_short_code,
                            a_commission_percentage: assoc.a_commission_percentage
                        });
                        associateSelect.append(option).trigger('change');
                    }
                }
            });
        }
        // Handle change
        associateSelect.on('change', function () {
            const selectedId = $(this).val();
            if(selectedId !== originalValue && selectedId !== previousValue){
                newSelectedValue = selectedId;
                if( window.userId ) {
                    try {
                        // 1. Fetch pending quotes and orders for this associate
                        $.ajax({
                            url: window.fetchPendingItemsUrl.replace(':id', selectedId), // e.g., /admin/fetch-pending-items/:id
                            type: 'GET',
                            data: { associates_id: window.defaultAssociateId , users_id: window.userId  }, // send associate id and user id
                            dataType: 'json',
                            success: function (res) {
                                // Clear previous data first
                                $('#modal_pending_quotes').empty();
                                $('#modal_pending_orders').empty();

                                if (res.success && (res.quotes.length || res.orders.length)) {
                                    // 2. Build clickable links for each quote/order
                                    const quoteLinks = res.quotes.map(id => {
                                        const url = window.quoteRoute.replace(':id', id);
                                        return `<a href="${url}" target="_blank">${id}</a>`;
                                    }).join(', ');

                                    const orderLinks = res.orders.map(id => {
                                        const url = window.orderRoute.replace(':id', id);
                                        return `<a href="${url}" target="_blank">${id}</a>`;
                                    }).join(', ');
                                    const quotesText = quoteLinks + (res.quotes_more ? ', <em>and more...</em>' : '');
                                    const ordersText = orderLinks + (res.orders_more ? ', <em>and more...</em>' : '');

                                    // 3. Append inside modal body (below Apply note)
                                    const detailsHtml = `
                                        <div id="pending_items_section" class="mt-3" style="font-size:13px;">
                                            <p class="mb-1"><strong>Open Quotes:</strong> ${quotesText || 'None'}</p>
                                            <p class="mb-0"><strong>Open Orders:</strong> ${ordersText || 'None'}</p>
                                        </div>
                                    `;

                                    // If already exists, replace; else append
                                    if ($('#pending_items_section').length) {
                                        $('#pending_items_section').replaceWith(detailsHtml);
                                    } else {
                                        $('.modal-body ul').after(detailsHtml);
                                    }

                                    // 4. Show modal only if there are entries
                                    modal.modal('show');
                                } else {
                                    // No pending items → just mark "only new" silently
                                    applyToPendingInput.val("0");
                                    previousValue = newSelectedValue;
                                }
                            },
                            error: function () {
                                console.error("Error fetching pending items.");
                                // Fail silently fallback to default (only new)
                                applyToPendingInput.val("0");
                                previousValue = newSelectedValue;
                            }
                        });

                    } catch (err) {
                        console.error("Error in associate change handling:");
                    }
                } else {  // this means we are creating a new user so no need to hit the api and fetch open orders and quotes
                    applyToPendingInput.val("0");
                    previousValue = newSelectedValue;
                }

            } else {
                previousValue = selectedId;
                applyToPendingInput.val("0"); // reset
            }
        });

        // YES button
        $('#applyYes').on('click', function () {
            applyToPendingInput.val("1"); // apply to pending
            previousValue = newSelectedValue;
            modal.modal('hide');
        });

        // NO button
        $('#applyNo').on('click', function () {
            applyToPendingInput.val("0"); // only new
            previousValue = newSelectedValue;
            modal.modal('hide');
        });

        // CANCEL button
        $('#applyCancel').on('click', function () {
            associateSelect.val(previousValue).trigger('change'); // revert
            modal.modal('hide');
        });
        // ---------------------------------------------
        const $checkbox = $('#enable_cc');
        const $input = $('#ccemails');
        const $errorEl = $('#cc-error');
        const $submitBtn = $('button[type="submit"]');

        // Enable/disable input
        $checkbox.on('change', function () {
            const isChecked = $(this).is(':checked');
            $input.prop('disabled', !isChecked);

            if (!isChecked) {
                // Reset all styles and error messages when unchecked
                $errorEl.text('');
                $input.css('border', '');
                $submitBtn.prop('disabled', false);
            } else {
                // Checkbox checked, check if empty
                if ($input.val().trim() === '') {
                    showError('Please add at least one CC email or uncheck this box.');
                }
                validateEmails();
            }
        });

        // Validate as user types
        $input.on('input', validateEmails);

        function validateEmails() {
            const emailsRaw = $input.val().trim();
            $errorEl.text('');
            $input.css('border', ''); // reset border on every check
            const isChecked = $checkbox.is(':checked');


            // If checkbox unchecked → no validation
            if (!isChecked) {
                $errorEl.text('');
                $input.css('border', '');
                $submitBtn.prop('disabled', false);
                return;
            }

            // If checked and empty input
            if (emailsRaw === '') {
                showError('Please add at least one CC email or uncheck this box.');
                return;
            }


            // Reset visuals
            $errorEl.text('');
            $input.css('border', '');
            $submitBtn.prop('disabled', false);

            // Rule 1: No comma at the beginning
            if (/^\s*,/.test(emailsRaw)) {
                showError('Input cannot start with a comma.');
                return;
            }

            // Rule 2: No adjacent commas with only whitespace between
            if (/,\s*,/.test(emailsRaw)) {
                showError('No empty emails or commas with only spaces allowed.');
                return;
            }

            // Rule 3: Maximum 4 commas allowed (→ max 5 emails)
            const commaCount = (emailsRaw.match(/,/g) || []).length;
            if (commaCount > 4) {
                showError('You can enter a maximum of 5 emails.');
                return;
            }

            // Split emails
            const emails = emailsRaw.split(',')
                .map(e => e.trim())
                .filter(e => e.length > 0);

            // Check for duplicates
            const duplicates = emails.filter((e, i, arr) => arr.indexOf(e) !== i);
            if (duplicates.length > 0) {
                showError('Duplicate emails detected: ' + duplicates.join(', '));
                return;
            }

            // Validate each email
            const invalidEmails = emails.filter(e => !validateEmail(e));
            if (invalidEmails.length > 0) {
                showError('Invalid emails: ' + invalidEmails.join(', '));
                return;
            }

            // All good
            $errorEl.text('');
            $input.css('border', '');
            $submitBtn.prop('disabled', false);
        }

        function validateEmail(email) {
            // Basic email validation regex
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return regex.test(email);
        }

        function showError(message) {
            $errorEl.text(message);
            $input.css('border', '2px solid red'); // highlight border on error
            $submitBtn.prop('disabled', true);
        }
        // ---------------------------------------------
        function UserAccountDetail() {
            var urlAccountLogHistory = ('undefined' === typeof window.lsData) || (false === ('urlAccountLogHistory' in window.lsData)) ? '' : window.lsData['urlAccountLogHistory'],
                entityID = ('undefined' === typeof window.lsData) || (false === ('entityID' in window.lsData)) ? '' : window.lsData['entityID'],
                chkOverdueValOld = ('undefined' === typeof window.lsData) || (false === ('chkOverdueValOld' in window.lsData)) ? '' : window.lsData['chkOverdueValOld'],
                user_role_preselected = ('undefined' === typeof window.lsData) || (false === ('user_role_preselected' in window.lsData)) ? '' : window.lsData['user_role_preselected'],
                $btnAutoMailCheck = $(".digest_auto_email_chk"),
                $btnAutoMailCheckAll = $('#digest_auto_email_chk_all'),
                ROLES = ('undefined' === typeof window.lsData) || (false === ('ROLES' in window.lsData)) ? '' : window.lsData['ROLES'],
                $isOverwriteOverdue = $('#is_overwrite_overdue'),
                $userRole = $("#user_role"),
                $profileLogTable = $("#profile_log_table");
            init();
            function init() {
                if (user_role_preselected == ROLES.ADMIN) {
                    $("#can_switch_div").show();
                    console.log('test condition');
                    check_box = $('#can_switch_locations');
                    check_box.prop('disabled', true);
                    check_box.prop('checked', true);

                }
                var digest_auto_email_chk_first = $('.digest_auto_email_chk:checked');
                var digest_auto_email_total_first = $('.digest_auto_email_chk');
                if (digest_auto_email_chk_first.length == digest_auto_email_total_first.length){
                    $btnAutoMailCheckAll.prop('checked', true);
                } else {
                    $btnAutoMailCheckAll.prop('checked', false);
                }
                $btnAutoMailCheckAll.on('click', markEnabledDisabled);
                $btnAutoMailCheck.on('click', checkAll);
                $isOverwriteOverdue.on('click', overwriteOverdue);
                $userRole.on('change', userRoleChange);
            }

            function markEnabledDisabled(e) {
                if ($(this).is(":checked")) {
                    $btnAutoMailCheck.prop('checked', true);
                } else {
                    $btnAutoMailCheck.prop('checked', false);
                }
            }

            function checkAll() {
                var digest_auto_email_chk = $('.digest_auto_email_chk:checked');
                var digest_auto_email_total = $('.digest_auto_email_chk');

                if (digest_auto_email_chk.length < digest_auto_email_total.length) {
                    $btnAutoMailCheckAll.prop('checked', false);
                } else {
                    $btnAutoMailCheckAll.prop('checked', true);
                }
            }

            function overwriteOverdue(e) {
                $("#adminpassworddiv").toggle();
                var chk_overdue_val_old = chkOverdueValOld;
                var chk_overdue_val = 0;
                if ($(this).is(":checked")) {
                    var chk_overdue_val = 1;
                }
                if ($("#adminpassworddiv").is(":visible")) {
                    $("#adminpassword").attr('disabled', false);
                    $("#is_change_overwrite").val(1);
                } else {
                    $("#adminpassword").attr('disabled', true);
                    $("#is_change_overwrite").val(0);
                }

            }

            function userRoleChange(e) {
                var user_role = $userRole.val();
                $(".common_warehouse").hide();
                $(".ext_cust").hide();
                $("#invoice_term_div").hide();
                $("#invoice_cc_email_div").hide();
                $("#storage_div").hide();
                $("#digest_auto_email").hide();
                $("#user_note_div").hide();
                document.getElementById("locations_id").required = false;

                if (user_role == ROLES.WAREHOUSE) {
                    $('#can_switch_locations').prop('disabled', false);
                    $('#can_switch_locations').prop('checked', true);
                    $(".common_warehouse").show();
                    document.getElementById("locations_id").required = true;
                } else if (user_role == ROLES.CORPORATE || user_role ==
                    ROLES.NON_CORPORATE) {
                    $('#can_switch_locations').prop('disabled', false);
                    $('#can_switch_locations').prop('checked', false);
                    $("#invoice_term_div").show();
                    $("#invoice_cc_email_div").show();
                    $("#storage_div").show();
                    $("#digest_auto_email .digest_auto_email_chk").prop('checked', true);
                    $("#digest_auto_email").show();
                    $(".ext_cust").show();
                    $("#user_note_div").show();
                } else if (user_role == ROLES.ADMIN) {
                    $("#can_switch_div").show();
                    check_box = $('#can_switch_locations');
                    check_box.prop('disabled', true);
                    check_box.prop('checked', true);

                }
            }
            $('input:radio[name="is_cubic_consolidate"]').on('change', function () {
                var is_cubic_consolidate = $(this).val();
                console.log('is_cubic_consolidate: ' + is_cubic_consolidate);
                if (is_cubic_consolidate == 0) {
                    $("#storage_date_wise_div").show();
                    $("#storage_cubic_wise_div").hide();
                } else {
                    $("#storage_date_wise_div").hide();
                    $("#storage_cubic_wise_div").show();
                }
            });

            $profileLogTable.DataTable({
                dom: "<'row'<'col-sm-4'><'#filter_by_status_div.col-sm-4'><'col-sm-4'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-5'i><'col-sm-7'p>>",
                responsive: true,
                "scrollX": true,
                "scrollCollapse": true,
                "order": [], //By default, order by descending 1st column
                "processing": true,
                "serverSide": true,
                "ajax": {
                    url: urlAccountLogHistory,
                    data: function (d) {
                        d.filter_by_status = '';
                        d.entity_id = entityID;
                    }
                },
                "fnDrawCallback": function (oSettings) {
                    //Initialize jquery plugin ?? other functions

                },
                "columns": [
                    // { "data": "created_at"},
                    { "data": "subject" },
                    // { "data": "user_name"}
                ]
            });

        }
        new UserAccountDetail();
    });

    $('#cc_percentage_check').on('change', function () {
        if (this.checked) {
            let val = parseFloat(window.lsData['default_cc_prec_in_setting'] || 0).toFixed(2);
            $('#cc_percentage')
                .val(val)
                .prop('readonly', true);
        } else {
            $('#cc_percentage').prop('readonly', false);
        }
    });


})(jQuery);