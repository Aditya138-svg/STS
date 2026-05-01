$(document).ready(function () {
    $('[data-bs-toggle="tooltip"]').tooltip();
    const defaultAssociateId = window.ls.commission.defaultAssociateId;
    const associateSelect = $('#associate_id');
    const appTimezone = window.ls.commission.timezone;

    // Read more
    $('#toggle-notes').on('click', function() {
        const noteContainer = $('#note-container');
        const isExpanded = noteContainer.hasClass('expanded');
        
        if (isExpanded) {
            noteContainer.removeClass('expanded').css('max-height', '130px');
            $(this).text('Read More');
        } else {
            noteContainer.addClass('expanded').css('max-height', noteContainer.prop('scrollHeight') + 'px');
            $(this).text('Read Less');
        }
    });


    // Default date filter type
    let dateFilterType = window.ls.commission.dateFilterTypes.ORDER_CREATED_ON; // order.created_at || payments.txn_datetime
    // Tab click handlers
    $('#orderDateTab').on('click', function () {
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');
        dateFilterType = window.ls.commission.dateFilterTypes.ORDER_CREATED_ON;
        updateExportUrl(); // update Export URL
        $('#date_range_text').text('Order Created Between:');
        table.ajax.reload(); // refresh data

    });
    $('#txnDateTab').on('click', function () {
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');
        dateFilterType = window.ls.commission.dateFilterTypes.PAYMENT_MADE_ON;
        updateExportUrl(); // update Export URL
        $('#date_range_text').text('Paid Between:');
        table.ajax.reload();
    });



    // Initialize Select2 for associate selection
    associateSelect.select2({
        placeholder: '--Choose Associate--',
        width: '200px',
        allowClear: true,
        ajax: {
            url: window.ls.commission.routes.fetchAssociates,
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    term: params.term || '',
                    page: params.page || 1
                };
            },
            processResults: function (res, params) {
                params.page = params.page || 1;
                return {
                    results: res.data.map(item => ({
                        id: item.id,
                        text: `${item.a_company_name} (${item.a_short_code})`,
                        a_company_name: item.a_company_name,
                        a_short_code: item.a_short_code
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
    if (defaultAssociateId) {
        $.ajax({
            url: window.ls.commission.routes.fetchAssociates,
            type: 'GET',
            dataType: 'json',
            data: { selected_id: defaultAssociateId },
            success: function (res) {
                if (res.status && res.data.length) {
                    const assoc = res.data[0];
                    const text = `${assoc.a_company_name} (${assoc.a_short_code})`;
                    const option = new Option(text, assoc.id, true, true);

                    // Attach Select2-compatible data
                    $(option).data({
                        a_company_name: assoc.a_company_name,
                        a_short_code: assoc.a_short_code
                    });

                    associateSelect.append(option).trigger('change');
                }
            }
        });
    }


    // Variables to store selected dates
    let fromDate = null;
    let toDate = null;

    // Initialize daterangepicker
    $('#fil_date_range').daterangepicker({
        autoUpdateInput: false,
        opens: 'left',
        locale: {
            cancelLabel: 'Clear',
            format: 'YYYY-MM-DD'
        },
        ranges: {
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment()],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    });

    // Set default last 30 days
    let start = moment.tz(appTimezone).subtract(29, 'days');
    let end = moment.tz(appTimezone);
    $('#fil_date_range').data('daterangepicker').setStartDate(start);
    $('#fil_date_range').data('daterangepicker').setEndDate(end);
    $('#fil_date_range').val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
    fromDate = start.format('YYYY-MM-DD');
    toDate = end.format('YYYY-MM-DD');

    // Apply date selection
    $('#fil_date_range').on('apply.daterangepicker', function (ev, picker) {
        fromDate = picker.startDate.format('YYYY-MM-DD');
        toDate = picker.endDate.format('YYYY-MM-DD');
        $(this).val(fromDate + ' - ' + toDate);
    });

    // Cancel date selection
    $('#fil_date_range').on('cancel.daterangepicker', function (ev, picker) {
        fromDate = null;
        toDate = null;
        $(this).val('');
    });


    function updateExportUrl() {
        const associateId = associateSelect.val() || defaultAssociateId;
        const orderStatus = $('#payment_status').val() || '';
        const dateRange = (fromDate && toDate) ? `${fromDate} - ${toDate}` : '';

        // Build new URL with query parameters
        const newUrl = window.ls.commission.routes.export +
            "?associate_id=" + encodeURIComponent(associateId) +
            "&payment_status=" + encodeURIComponent(orderStatus) +
            "&from_date=" + encodeURIComponent(fromDate || '') +
            "&to_date=" + encodeURIComponent(toDate || '') +
            "&date_filter_type=" + encodeURIComponent(dateFilterType);

        $('#exportExcel').attr('href', newUrl);
    }

    const table = $('#commission_table').DataTable({
        processing: true,
        serverSide: true,
        searching: true,
        scrollX: true,
        ajax: {
            url: window.ls.commission.routes.dataAjax,
            type: "GET",
            data: function (d) {
                d._token = window.ls.commission.csrf;
                d.associate_id = associateSelect.val() || defaultAssociateId;
                d.payment_status = $('#payment_status').val() || '';
                d.from_date = fromDate; // selected or default
                d.to_date = toDate;
                d.date_filter_type = dateFilterType; // send tab filter type
                d.search_term = d.search.value; // global search term
                d.sort_column = d.order && d.order.length ? d.order[0].column : null;
                d.sort_order = d.order && d.order.length ? d.order[0].dir : null;
            },
        },
        pageLength: 10,
        order: [[9, 'desc']],
        columns: [
            {            
                data: 'order_id', 
                name: 'orders_id',
                className: 'text-center',
                render: function(data, type, row, meta) {
                    if (!data) return ''; // safety check
                    var url = window.ls.commission.routes.order.replace(':id', data);
                    url = url.replace('__ID__', data);
                    return `<a href="${url}" class="text-primary">${data}</a>`;
                } 
            },
            { data: 'user', name: 'user_name', className: 'text-center' },
            { data: 'destination_name', name: 'destination_name', className: 'text-center' },
            { data: 'associate', name: 'associate_name', className: 'text-center' },
            { data: 'commission_rate', name: 'commission_percentage', className: 'text-center' },
            {
                data: 'payment_status',
                name: 'payment_status',
                className: 'text-center',
                render: function (data, type, row) {
                    const reversalLabels =  window.ls.commission.reversalLabels;
                    const statusColors = window.ls.commission.statusColors;

                    // Map numeric status (0,1,2,3,4) to reversal label using array index
                    const label = reversalLabels[data] ?? 'N/A';
                    const color = statusColors[data] ?? 'grey';

                    return `<span style="color:${color}; font-weight:bold">${label}</span>`;
                }
            },
            { data: 'net_amount', name: 'net_amount', className: 'text-center' },
            { data: 'paid_amount', name: 'paid_amount', className: 'text-center' },
            { data: 'commission_value', name: 'commission_value', className: 'text-center' },
            { data: 'order_date', name: 'created_at', className: 'text-center' },
            { data: 'transaction_date', name: 'transaction_date', className: 'text-center' }
        ],
        drawCallback: function (settings) {
            const json = this.api().ajax.json();
            if (json && json.totalCommission !== undefined) {
                $('#totalCommission').text(json.totalCommission);
            } else {
                $('#totalCommission').text('$0.00');
            }
        }
    });


    // Refresh on filter apply
    $('#applyFilters').on('click', function () {
        updateExportUrl(); // update Export URL
        table.ajax.reload();
    });

    // Reset filters
    $('#resetFilters').on('click', function () {
        $('#payment_status').val(''); // reset status filter
        associateSelect.val(defaultAssociateId ?? 1).trigger('change');
        // Reset date range to last 30 days
        let start = moment.tz(appTimezone).subtract(29, 'days');
        let end = moment.tz(appTimezone);
        $('#fil_date_range').data('daterangepicker').setStartDate(start);
        $('#fil_date_range').data('daterangepicker').setEndDate(end);
        $('#fil_date_range').val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
        fromDate = start.format('YYYY-MM-DD');
        toDate = end.format('YYYY-MM-DD');

        // Reset number of entries per page to default
        table.page.len(10).draw(); // 10 is the default pageLength

        // Reload table data
        updateExportUrl(); // update Export URL
        table.ajax.reload();
    });

});