var tipReportsDataUrl = window.TIP_REPORTS_DATA_URL || '';
var tipReportsDataUrl = window.TIP_REPORTS_DATA_URL || '';
var tipReportsExportUrl = window.TIP_REPORTS_EXPORT_URL || '';
var tipReportsOrdersUrl = window.TIP_REPORTS_ORDERS_URL || '';
var filterFromDefault = window.TIP_REPORTS_FILTER_FROM || '';
var filterToDefault = window.TIP_REPORTS_FILTER_TO || '';
var hasFilterFromDefault = window.TIP_REPORTS_HAS_FILTER_FROM === true || window.TIP_REPORTS_HAS_FILTER_FROM === 1;
var hasFilterToDefault = window.TIP_REPORTS_HAS_FILTER_TO === true || window.TIP_REPORTS_HAS_FILTER_TO === 1;
var viewOrdersText = window.TIP_REPORTS_VIEW_ORDERS_TEXT || 'View Orders';
var ordersLoadingText = window.TIP_REPORTS_ORDERS_LOADING_TEXT || 'Loading orders...';
var ordersLoadingMoreText = window.TIP_REPORTS_ORDERS_LOADING_MORE_TEXT || 'Loading more orders...';
var ordersEmptyText = window.TIP_REPORTS_ORDERS_EMPTY_TEXT || 'No orders found.';
var ordersEndText = window.TIP_REPORTS_ORDERS_END_TEXT || 'All matching orders are loaded.';
var ordersLoadErrorText = window.TIP_REPORTS_ORDERS_LOAD_ERROR_TEXT || 'Unable to load employee orders.';

var filterFromPicker = null;
var filterToPicker = null;
var reportsTable = null;
var ordersModal = null;
var ordersModalState = {
    employeeKey: '',
    employeeName: '',
    page: 1,
    perPage: 15,
    hasMore: false,
    isLoading: false
};

var padDatePart = function (value) {
    return String(value || '').padStart(2, '0');
};

var formatMoney = function (amount) {
    var value = parseFloat(amount || 0);
    return isNaN(value) ? '0.00' : value.toFixed(2);
};

var escapeHtml = function (value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

var getInitials = function (name) {
    var parts = String(name || '').trim().split(/\s+/);
    var initials = '';

    for (var i = 0; i < parts.length && initials.length < 2; i++) {
        if (parts[i]) {
            initials += parts[i].charAt(0).toUpperCase();
        }
    }

    return initials || 'NA';
};

var formatDateObject = function (dt) {
    if (!(dt instanceof Date) || isNaN(dt.getTime())) {
        return '';
    }

    return padDatePart(dt.getMonth() + 1) + '/' + padDatePart(dt.getDate()) + '/' + dt.getFullYear();
};

var normalizeDateInput = function (value) {
    if (!value) {
        return '';
    }

    var str = String(value).trim();
    var match = str.match(/^(\d{4})-(\d{2})-(\d{2})(?:\s+\d{2}:\d{2}:\d{2})?$/);
    if (match) {
        return match[2] + '/' + match[3] + '/' + match[1];
    }

    match = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (match) {
        return str;
    }

    var dt = new Date(str);
    return isNaN(dt.getTime()) ? str : formatDateObject(dt);
};

var parseFilterDate = function (value) {
    var str = String(value || '').trim();
    var match = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) {
        return null;
    }

    var month = parseInt(match[1], 10);
    var day = parseInt(match[2], 10);
    var year = parseInt(match[3], 10);
    var dt = new Date(year, month - 1, day);

    if (dt.getFullYear() !== year || dt.getMonth() !== month - 1 || dt.getDate() !== day) {
        return null;
    }

    dt.setHours(0, 0, 0, 0);
    return dt;
};

var getTodayDate = function () {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

var updateDatepickerBounds = function () {
    var today = getTodayDate();
    var fromDate = parseFilterDate(window.jQuery('#tipr-date-from').val());
    var toDate = parseFilterDate(window.jQuery('#tipr-date-to').val());

    if (filterFromPicker) {
        filterFromPicker.set('maxDate', toDate || today);
    }
    if (filterToPicker) {
        filterToPicker.set('minDate', fromDate || null);
        filterToPicker.set('maxDate', today);
    }
};

var normalizeAndValidateFilterDates = function () {
    var fromInput = window.jQuery('#tipr-date-from');
    var toInput = window.jQuery('#tipr-date-to');
    var fromRaw = normalizeDateInput(fromInput.val());
    var toRaw = normalizeDateInput(toInput.val());
    var fromDate = parseFilterDate(fromRaw);
    var toDate = parseFilterDate(toRaw);
    var today = getTodayDate();

    fromInput.val(fromDate ? fromRaw : '');
    toInput.val(toDate ? toRaw : '');

    if (fromDate && fromDate > today) {
        fromInput.val('');
        fromDate = null;
    }

    if (toDate && toDate > today) {
        toInput.val(formatDateObject(today));
        toDate = today;
    }

    if (fromDate && toDate && toDate < fromDate) {
        toInput.val(formatDateObject(fromDate));
        toDate = fromDate;
    }

    updateDatepickerBounds();

    if (filterFromPicker) {
        filterFromPicker.setDate(fromInput.val() || null, false, 'm/d/Y');
    }
    if (filterToPicker) {
        filterToPicker.setDate(toInput.val() || null, false, 'm/d/Y');
    }

    return {
        date_from: fromInput.val() || '',
        date_to: toInput.val() || ''
    };
};

var initializeFilterDatepickers = function () {
    if (typeof window.flatpickr !== 'function') {
        return;
    }

    var today = getTodayDate();
    var sharedOptions = {
        allowInput: true,
        clickOpens: true,
        dateFormat: 'm/d/Y',
        disableMobile: true,
        maxDate: today,
        onChange: function () {
            normalizeAndValidateFilterDates();
        },
        onClose: function () {
            normalizeAndValidateFilterDates();
        }
    };

    if (filterFromPicker && typeof filterFromPicker.destroy === 'function') {
        filterFromPicker.destroy();
    }
    if (filterToPicker && typeof filterToPicker.destroy === 'function') {
        filterToPicker.destroy();
    }

    filterFromPicker = window.flatpickr('#tipr-date-from', sharedOptions);
    filterToPicker = window.flatpickr('#tipr-date-to', sharedOptions);

    if (hasFilterFromDefault && filterFromDefault) {
        filterFromPicker.setDate(normalizeDateInput(filterFromDefault), false, 'm/d/Y');
    } else {
        window.jQuery('#tipr-date-from').val('');
    }

    if (hasFilterToDefault && filterToDefault) {
        filterToPicker.setDate(normalizeDateInput(filterToDefault), false, 'm/d/Y');
    } else {
        window.jQuery('#tipr-date-to').val('');
    }

    updateDatepickerBounds();
};

var isFlatpickrCalendarOpen = function () {
    return !!document.querySelector('.flatpickr-calendar.open');
};

var getCurrentFilterPayload = function () {
    return normalizeAndValidateFilterDates();
};

var updateFilterQueryInUrl = function () {
    var url = new URL(window.location.href);
    url.searchParams.delete('date_from');
    url.searchParams.delete('date_to');

    window.history.replaceState({}, '', url.toString());
};

var setDateFiltersFromPreset = function (preset) {
    var today = getTodayDate();
    var fromDate = new Date(today);
    var toDate = new Date(today);

    switch (preset) {
        case 'today':
            break;
        case 'last7':
            fromDate.setDate(fromDate.getDate() - 6);
            break;
        case 'last30':
            fromDate.setDate(fromDate.getDate() - 29);
            break;
        case 'this_month':
            fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
            break;
        default:
            return;
    }

    if (filterFromPicker && filterToPicker) {
        filterFromPicker.setDate(formatDateObject(fromDate), false, 'm/d/Y');
        filterToPicker.setDate(formatDateObject(toDate), false, 'm/d/Y');
    } else {
        window.jQuery('#tipr-date-from').val(formatDateObject(fromDate));
        window.jQuery('#tipr-date-to').val(formatDateObject(toDate));
    }

    normalizeAndValidateFilterDates();
    window.jQuery('.tipm-preset-btn').removeClass('active');
    window.jQuery('.tipm-preset-btn[data-range="' + preset + '"]').addClass('active');
    applyFiltersAndReload();
};

var updateSummaryCardsFromResponse = function (json) {
    if (!json || !json.summary) {
        return;
    }

    var count = parseInt(json.summary.count || 0, 10);
    var amount = parseFloat(json.summary.amount || 0);
    var avg = count > 0 ? (amount / count) : 0;

    window.jQuery('#reports-count-card').text(count);
    window.jQuery('#reports-amount-card').text('$' + formatMoney(amount));
    window.jQuery('#reports-avg-card').text('$' + formatMoney(avg));
};

var getAjaxDataPayload = function (data) {
    var filters = getCurrentFilterPayload();
    data.date_from = filters.date_from;
    data.date_to = filters.date_to;
    return data;
};

var buildExportCsvHref = function () {
    if (!tipReportsExportUrl) {
        return '#';
    }

    var params = new URLSearchParams();
    var filters = getCurrentFilterPayload();
    if (filters.date_from) {
        params.set('date_from', filters.date_from);
    }
    if (filters.date_to) {
        params.set('date_to', filters.date_to);
    }
    if (reportsTable) {
        var searchValue = reportsTable.search();
        if (searchValue) {
            params.set('search', searchValue);
        }
    }

    return params.toString() ? (tipReportsExportUrl + '?' + params.toString()) : tipReportsExportUrl;
};

var renderViewOrdersButton = function (row) {
    var count = parseInt(row.number_of_tips || 0, 10);
    return '<span class="tipm-order-count">'+escapeHtml(String(count))+'</span>'+'<button type="button" class="tipr-view-orders-btn js-tipr-view-orders"'
        + ' data-employee-key="' + escapeHtml(row.employee_key || '') + '"'
        + ' data-employee-name="' + escapeHtml(row.employee_name || '') + '">'
        + '<i class="fa fa-eye"></i> ' + escapeHtml(viewOrdersText)
        + '</button>';
};

var initializeReportsDataTable = function () {
    if (!window.jQuery || !window.jQuery.fn.DataTable || !document.getElementById('tipReportsTable')) {
        return;
    }

    reportsTable = window.jQuery('#tipReportsTable').DataTable({
        processing: true,
        serverSide: true,
        pageLength: 10,
        order: [[1, 'desc']],
        language: { processing: '<i class="fa fa-spinner fa-spin"></i>' },
        ajax: {
            url: tipReportsDataUrl,
            data: getAjaxDataPayload,
            dataSrc: function (json) {
                updateSummaryCardsFromResponse(json);
                return json && json.data ? json.data : [];
            }
        },
        columns: [
            {
                data: 'employee_name',
                render: function (value) {
                    var name = value || '';
                    return '<div class="tipm-employee-cell">'
                        + '<span class="tipm-employee-avatar">' + escapeHtml(getInitials(name)) + '</span>'
                        + '<span class="tipm-employee-name">' + escapeHtml(name) + '</span>'
                        + '</div>';
                }
            },
            {
                data: 'total_tips_given',
                render: function (value) {
                    return '<span class="tipm-money">$' + formatMoney(value || 0) + '</span>';
                }
            },
            {
                data: null,
                render: function (value, type, row) {
                    return renderViewOrdersButton(row || {});
                }
            }
        ]
    });
};

var applyFiltersAndReload = function () {
    normalizeAndValidateFilterDates();
    updateFilterQueryInUrl();

    if (reportsTable) {
        reportsTable.ajax.reload();
    }
};

var exportReportCsv = function () {
    var href = buildExportCsvHref();
    if (href && href !== '#') {
        window.location.href = href;
    }
};

var resetFilters = function () {
    window.jQuery('#tipr-date-from').val('');
    window.jQuery('#tipr-date-to').val('');

    if (filterFromPicker) {
        filterFromPicker.clear(false);
    }
    if (filterToPicker) {
        filterToPicker.clear(false);
    }

    window.jQuery('.tipm-preset-btn').removeClass('active');
    updateDatepickerBounds();
    applyFiltersAndReload();
};

var showOrdersStatus = function (targetId, text) {
    var ids = ['#tipr-orders-loading', '#tipr-orders-empty', '#tipr-orders-end'];
    for (var i = 0; i < ids.length; i++) {
        window.jQuery(ids[i]).addClass('tipr-hidden');
    }

    window.jQuery('#tipr-orders-empty').html('<i class="fa fa-inbox"></i> ' + escapeHtml(ordersEmptyText));
    window.jQuery('#tipr-orders-end').html('<i class="fa fa-check-circle"></i> ' + escapeHtml(ordersEndText));

    if (targetId) {
        window.jQuery(targetId).removeClass('tipr-hidden');
        if (targetId === '#tipr-orders-loading') {
            window.jQuery('#tipr-orders-loading-text').text(text || ordersLoadingText);
        } else if (targetId === '#tipr-orders-empty') {
            window.jQuery('#tipr-orders-empty').html('<i class="fa fa-inbox"></i> ' + escapeHtml(text || ordersEmptyText));
        } else if (targetId === '#tipr-orders-end') {
            window.jQuery('#tipr-orders-end').html('<i class="fa fa-check-circle"></i> ' + escapeHtml(text || ordersEndText));
        }
    }
};

var renderOrderRows = function (rows, append) {
    var html = '';
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i] || {};
        html += '<div class="tipr-order-row">'
            + '<div><a class="tipr-order-link" href="' + escapeHtml(row.order_view_url || '#') + '">' + escapeHtml(row.order_number || '') + '</a></div>'
            + '<div class="tipr-order-tip">$' + formatMoney(row.tip_amount || 0) + '</div>'
            + '<div class="tipr-order-date">' + escapeHtml(row.distribution_date || '') + '</div>'
            + '</div>';
    }

    if (append) {
        window.jQuery('#tipr-orders-list').append(html);
    } else {
        window.jQuery('#tipr-orders-list').html(html);
    }
};

var resetOrdersModal = function () {
    ordersModalState = {
        employeeKey: '',
        employeeName: '',
        page: 1,
        perPage: 15,
        hasMore: false,
        isLoading: false
    };
    window.jQuery('#tipr-orders-employee-name').text('');
    window.jQuery('#tipr-orders-list').html('');
    showOrdersStatus(null);
    window.jQuery('#tipr-orders-scroll').scrollTop(0);
};

var loadEmployeeOrders = function (resetList) {
    if (!tipReportsOrdersUrl || !ordersModalState.employeeKey || ordersModalState.isLoading) {
        return;
    }

    if (!resetList && !ordersModalState.hasMore) {
        return;
    }

    ordersModalState.isLoading = true;
    showOrdersStatus('#tipr-orders-loading', resetList ? ordersLoadingText : ordersLoadingMoreText);

    var filters = getCurrentFilterPayload();
    window.jQuery.ajax({
        type: 'GET',
        url: tipReportsOrdersUrl,
        data: {
            employee_key: ordersModalState.employeeKey,
            employee_name: ordersModalState.employeeName,
            date_from: filters.date_from,
            date_to: filters.date_to,
            page: ordersModalState.page,
            per_page: ordersModalState.perPage
        },
        success: function (response) {
            var rows = response && response.data ? response.data : [];
            var meta = response && response.meta ? response.meta : {};

            if (resetList) {
                window.jQuery('#tipr-orders-list').html('');
            }

            if (!rows.length && ordersModalState.page === 1) {
                showOrdersStatus('#tipr-orders-empty', ordersEmptyText);
            } else {
                renderOrderRows(rows, !resetList);
                ordersModalState.hasMore = !!meta.has_more;
                showOrdersStatus(ordersModalState.hasMore ? null : '#tipr-orders-end', ordersEndText);
                if (ordersModalState.hasMore) {
                    ordersModalState.page += 1;
                }
            }
        },
        error: function () {
            showOrdersStatus('#tipr-orders-empty', ordersLoadErrorText);
        },
        complete: function () {
            ordersModalState.isLoading = false;
        }
    });
};

var openOrdersModal = function (employeeKey, employeeName) {
    if (!employeeKey) {
        return;
    }

    resetOrdersModal();
    ordersModalState.employeeKey = employeeKey;
    ordersModalState.employeeName = employeeName || '';
    window.jQuery('#tipr-orders-employee-name').text(employeeName || '');
    window.jQuery('#tipReportOrdersModal').modal('show');
    loadEmployeeOrders(true);
};

var bindOrdersModalScroll = function () {
    window.jQuery('#tipr-orders-scroll').off('scroll.tipr').on('scroll.tipr', function () {
        var $this = window.jQuery(this);
        var threshold = 80;
        if (($this[0].scrollHeight - $this.scrollTop() - $this.outerHeight()) <= threshold) {
            loadEmployeeOrders(false);
        }
    });
};

window.jQuery(function () {
    initializeFilterDatepickers();
    initializeReportsDataTable();
    normalizeAndValidateFilterDates();
    updateFilterQueryInUrl();
    bindOrdersModalScroll();

    window.jQuery('.tipm-preset-btn').on('click', function () {
        setDateFiltersFromPreset(window.jQuery(this).data('range'));
    });

    window.jQuery('#tipr-apply-filters').on('click', function () {
        applyFiltersAndReload();
    });

    window.jQuery('#tipr-reset-filters').on('click', function () {
        resetFilters();
    });

    window.jQuery('#tipr-refresh-table').on('click', function (event) {
        event.preventDefault();
        if (reportsTable) {
            reportsTable.ajax.reload(null, false);
        }
    });
    window.jQuery('#tipr-export-csv-btn').on('click', function (event) {
        event.preventDefault();
        exportReportCsv();
    });

    window.jQuery('#tipr-date-from, #tipr-date-to').on('change', function () {
        normalizeAndValidateFilterDates();
    });

    window.jQuery('#tipr-date-from, #tipr-date-to').on('blur', function () {
        window.setTimeout(function () {
            if (!isFlatpickrCalendarOpen()) {
                normalizeAndValidateFilterDates();
            }
        }, 0);
    });

    window.jQuery(document).on('click', '.js-tipr-view-orders', function () {
        openOrdersModal(
            String(window.jQuery(this).data('employee-key') || ''),
            String(window.jQuery(this).data('employee-name') || '')
        );
    });

    window.jQuery('#tipReportOrdersModal').on('hidden.bs.modal', function () {
        resetOrdersModal();
    });
});
