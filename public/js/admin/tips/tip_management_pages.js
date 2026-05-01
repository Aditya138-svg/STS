/* ============================================================
   Tip Management Pages – pending.blade.php & payout.blade.php
   ============================================================ */

/* ── Variable declarations ─────────────────────────────────── */
var tipPageMode           = window.TIP_PAGE_MODE || '';
var pendingDataUrl        = window.TIP_PENDING_DATA_URL || '';
var payoutDataUrl         = window.TIP_PAYOUT_DATA_URL || '';
var pendingExportUrl      = window.TIP_PENDING_EXPORT_URL || '';
var payoutExportUrl       = window.TIP_PAYOUT_EXPORT_URL || '';
var distributionDetailUrl = window.TIP_DISTRIBUTION_DETAIL_URL || '';
var distributionSaveUrl   = window.TIP_DISTRIBUTION_SAVE_URL || '';
var openToken             = window.TIP_OPEN_TOKEN || '';
var openModal             = window.TIP_OPEN_MODAL === 1 || window.TIP_OPEN_MODAL === true;
var openQueryKey          = window.TIP_OPEN_QUERY_KEY || 'open';
var csrfToken             = (document.querySelector('meta[name="csrf-token"]') || {}).getAttribute
    ? document.querySelector('meta[name="csrf-token"]').getAttribute('content') : '';

var pendingTable          = null;
var payoutTable           = null;
var currentTable          = null;
var currentOrderToken     = '';
var currentTipAmount      = 0;
var currentDistributionVersion = '';
var activeStatusFilter    = window.TIP_FILTER_STATUS || (tipPageMode === 'payout' ? 'payout' : 'pending');
var toastTimer            = null;
var tipModalElement       = null;
var tipModalInstanceV5    = null;
var filterFromPicker      = null;
var filterToPicker        = null;

/* Label strings */
var statusPendingText         = window.TIP_STATUS_PENDING_TEXT || 'Pending';
var statusPayoutText          = window.TIP_STATUS_PAYOUT_TEXT  || 'Payout';
var distributeButtonText      = window.TIP_DISTRIBUTE_BUTTON_TEXT || 'Distribute';
var editDistributionText      = window.TIP_EDIT_DISTRIBUTION_TEXT || 'Edit Distribution';
var saveDistributionText      = window.TIP_SAVE_DISTRIBUTION_TEXT || 'Save Distribution';
var noDistributionLogText     = window.TIP_NO_DISTRIBUTION_LOG_TEXT || 'No distribution log';
var loadingText               = window.TIP_LOADING_TEXT || 'Loading...';
var selectEmployeeErrorText   = window.TIP_SELECT_EMPLOYEE_ERROR || 'Please select at least one employee.';
var noEmployeesText           = window.TIP_NO_EMPLOYEES_TEXT || 'No employees available.';
var loadDetailErrorText       = window.TIP_LOAD_DETAIL_ERROR_TEXT || 'Unable to load distribution details.';
var saveErrorText             = window.TIP_SAVE_ERROR_TEXT || 'Unable to save distribution.';
var copyLinkText              = window.TIP_COPY_LINK_TEXT || 'Copy Link';
var linkCopiedText            = window.TIP_LINK_COPIED_TEXT || 'Link copied';
var refreshTableText          = window.TIP_REFRESH_TABLE_TEXT || 'Refresh';
var distributionNoteLabelText = window.TIP_DISTRIBUTION_NOTE_TEXT || 'Note';
var noDistributionLogsText    = window.TIP_NO_DISTRIBUTION_LOGS_TEXT || 'No distribution logs yet.';
var selectEmployeesText       = window.TIP_SELECT_EMPLOYEES_TEXT || 'Select employees';
var noSelectedEmployeesText   = window.TIP_NO_SELECTED_EMPLOYEES_TEXT || 'No employees selected.';
var employeeShareLabelText    = window.TIP_EMPLOYEE_SHARE_LABEL || 'Tip share';
var savedSuccessText          = window.TIP_SAVED_SUCCESS_TEXT || 'Distribution saved successfully!';
var filterFromDefault         = window.TIP_FILTER_FROM || '';
var filterToDefault           = window.TIP_FILTER_TO   || '';
var hasFilterFromDefault      = window.TIP_HAS_FILTER_FROM === true || window.TIP_HAS_FILTER_FROM === 1;
var hasFilterToDefault        = window.TIP_HAS_FILTER_TO === true || window.TIP_HAS_FILTER_TO === 1;

var avatarColors = ['#1a6363', '#1565c0', '#6a1b9a', '#ad1457', '#e65100', '#2e7d32', '#00838f', '#4527a0'];

/* ── Utility ───────────────────────────────────────────────── */
var formatMoney = function (amount) {
    var v = parseFloat(amount || 0);
    return isNaN(v) ? '0.00' : v.toFixed(2);
};

var padDatePart = function (value) {
    return String(value || '').padStart(2, '0');
};

var formatDateObject = function (dt) {
    if (!(dt instanceof Date) || isNaN(dt.getTime())) { return ''; }
    return padDatePart(dt.getMonth() + 1) + '/' + padDatePart(dt.getDate()) + '/' + dt.getFullYear();
};

var formatDateForInput = function (value) {
    if (value instanceof Date) {
        return formatDateObject(value);
    }

    if (!value) { return ''; }

    var str = String(value).trim();
    if (!str) { return ''; }

    var match = str.match(/^(\d{4})-(\d{2})-(\d{2})(?:\s+\d{2}:\d{2}:\d{2})?$/);
    if (match) {
        return match[2] + '/' + match[3] + '/' + match[1];
    }

    match = str.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (match) {
        return match[2] + '/' + match[1] + '/' + match[3];
    }

    match = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (match) {
        return str;
    }

    var dt = new Date(str);
    if (!isNaN(dt.getTime())) {
        return padDatePart(dt.getMonth() + 1) + '/' + padDatePart(dt.getDate()) + '/' + dt.getFullYear();
    }

    return str;
};

var formatListingDate = function (value) {
    return formatDateForInput(value);
};

var parseFilterDate = function (value) {
    var str = String(value || '').trim();
    var match;
    if (!str) { return null; }

    match = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) { return null; }

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
    var fromInput = window.jQuery('#tipm-date-from');
    var toInput = window.jQuery('#tipm-date-to');
    var fromDate = parseFilterDate(fromInput.val());
    var toDate = parseFilterDate(toInput.val());

    if (filterFromPicker) {
        filterFromPicker.set('maxDate', toDate || today);
    }
    if (filterToPicker) {
        filterToPicker.set('minDate', fromDate || null);
        filterToPicker.set('maxDate', today);
    }
};

var normalizeAndValidateFilterDates = function (showErrors) {
    var fromInput = window.jQuery('#tipm-date-from');
    var toInput = window.jQuery('#tipm-date-to');
    var fromRaw = formatDateForInput(fromInput.val());
    var toRaw = formatDateForInput(toInput.val());
    var fromDate = parseFilterDate(fromRaw);
    var toDate = parseFilterDate(toRaw);
    var today = getTodayDate();

    if (fromRaw && !fromDate) {
        if (showErrors) { showToast('Invalid From Date. Use MM/DD/YYYY.', 'warning'); }
        fromInput.val('');
        fromDate = null;
    } else {
        fromInput.val(fromRaw);
    }

    if (toRaw && !toDate) {
        if (showErrors) { showToast('Invalid To Date. Use MM/DD/YYYY.', 'warning'); }
        toInput.val('');
        toDate = null;
    } else {
        toInput.val(toRaw);
    }

    if (fromDate && fromDate > today) {
        if (showErrors) { showToast('From Date cannot be after today.', 'warning'); }
        fromInput.val('');
        fromDate = null;
    }

    if (toDate && toDate > today) {
        if (showErrors) { showToast('To Date cannot be after today.', 'warning'); }
        toInput.val(formatDateObject(today));
        toDate = today;
    }

    if (fromDate && toDate && toDate < fromDate) {
        if (showErrors) { showToast('To Date cannot be before From Date.', 'warning'); }
        toInput.val(formatDateForInput(fromDate));
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
    var inputs = window.jQuery('.tipm-date-input');
    if (!inputs.length || typeof window.flatpickr !== 'function') { return; }

    var today = getTodayDate();
    var sharedOptions = {
        allowInput: true,
        clickOpens: true,
        dateFormat: 'm/d/Y',
        disableMobile: true,
        maxDate: today,
        onChange: function () {
            normalizeAndValidateFilterDates(false);
        },
        onClose: function () {
            normalizeAndValidateFilterDates(false);
        }
    };

    if (filterFromPicker && typeof filterFromPicker.destroy === 'function') { filterFromPicker.destroy(); }
    if (filterToPicker && typeof filterToPicker.destroy === 'function') { filterToPicker.destroy(); }

    filterFromPicker = window.flatpickr('#tipm-date-from', sharedOptions);
    filterToPicker = window.flatpickr('#tipm-date-to', sharedOptions);

    if (!hasFilterFromDefault) {
        window.jQuery('#tipm-date-from').val('');
    }
    if (!hasFilterToDefault) {
        window.jQuery('#tipm-date-to').val('');
    }

    updateDatepickerBounds();
};

var escapeHtml = function (str) {
    return String(str || '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
};

var getInitials = function (name) {
    var parts = (name || '').trim().split(/\s+/);
    var init  = '';
    for (var i = 0; i < parts.length && init.length < 2; i++) {
        if (parts[i]) { init += parts[i].charAt(0).toUpperCase(); }
    }
    return init || '?';
};

var getAvatarColor = function (idx) { return avatarColors[idx % avatarColors.length]; };

var buildLogEmployeesHtml = function (employees) {
    if (!employees || !employees.length) { return ''; }
    var html = '<div class="tipm-log-employee-list">';
    for (var i = 0; i < employees.length; i++) {
        var employee = employees[i] || {};
        var name = employee.employee_name || '';
        html += '<div class="tipm-log-employee">'
            + '<span class="tipm-log-employee-avatar" style="background:' + getAvatarColor(i) + ';">' + escapeHtml(getInitials(name)) + '</span>'
            + '<span class="tipm-log-employee-name">' + escapeHtml(name || '-') + '</span>'
            + '<span class="tipm-log-employee-amount">$' + formatMoney(employee.tip_paid || 0) + '</span>'
            + '</div>';
    }
    html += '</div>';
    return html;
};

/* ── Toast ─────────────────────────────────────────────────── */
var getToastIcon = function (type) {
    var icons = { success: 'fa-check', error: 'fa-times', warning: 'fa-exclamation', info: 'fa-info' };
    return icons[type] || 'fa-check';
};

var showToast = function (message, type) {
    var el = document.getElementById('tipm-toast');
    if (!el) { return; }
    var t = type || 'success';
    el.className = 'tipm-toast tipm-toast-' + t;
    el.innerHTML = '<div class="tipm-toast-icon"><i class="fa ' + getToastIcon(t) + '"></i></div>'
        + '<div class="tipm-toast-msg">' + message + '</div>';
    el.classList.add('tipm-toast-show');
    if (toastTimer) { clearTimeout(toastTimer); }
    toastTimer = setTimeout(function () { el.classList.remove('tipm-toast-show'); }, 3800);
};

/* ── URL state ─────────────────────────────────────────────── */
var getCurrentFilterPayload = function () {
    return normalizeAndValidateFilterDates(false);
};

var updateFilterQueryInUrl = function () {
    var f = getCurrentFilterPayload();
    var url = new URL(window.location.href);
    f.date_from ? url.searchParams.set('date_from', f.date_from) : url.searchParams.delete('date_from');
    f.date_to   ? url.searchParams.set('date_to',   f.date_to)   : url.searchParams.delete('date_to');
    url.searchParams.delete('status');
    window.history.replaceState({}, '', url.toString());
};

var updateModalUrlState = function (token, shouldOpen) {
    var url = new URL(window.location.href);
    if (shouldOpen && token) {
        url.searchParams.set(openQueryKey, '1');
        url.searchParams.set('ot', token);
    } else {
        url.searchParams.delete(openQueryKey);
        url.searchParams.delete('ot');
    }
    window.history.replaceState({}, '', url.toString());
};

var buildDistributionDeepLink = function (orderToken) {
    var url = new URL(window.location.href);
    url.searchParams.set(openQueryKey, '1');
    url.searchParams.set('ot', orderToken || '');
    return url.toString();
};

/* ── Date presets ──────────────────────────────────────────── */
var setDateFiltersFromPreset = function (preset) {
    var today = new Date();
    var fmt   = function (d) { return padDatePart(d.getMonth() + 1) + '/' + padDatePart(d.getDate()) + '/' + d.getFullYear(); };
    var to    = fmt(today);
    var from;
    switch (preset) {
        case 'today':      from = to; break;
        case 'last7':      var d7  = new Date(today); d7.setDate(d7.getDate() - 6);   from = fmt(d7);  break;
        case 'last30':     var d30 = new Date(today); d30.setDate(d30.getDate() - 29); from = fmt(d30); break;
        case 'this_month': from = padDatePart(today.getMonth() + 1) + '/01/' + today.getFullYear(); break;
        default: return;
    }

    if (filterFromPicker && filterToPicker) {
        filterFromPicker.setDate(from, false, 'm/d/Y');
        filterToPicker.setDate(to, false, 'm/d/Y');
    } else {
        window.jQuery('#tipm-date-from').val(from);
        window.jQuery('#tipm-date-to').val(to);
    }

    normalizeAndValidateFilterDates(false);
    window.jQuery('.tipm-preset-btn').removeClass('active');
    window.jQuery('.tipm-preset-btn[data-range="' + preset + '"]').addClass('active');
};

/* ── Status label ──────────────────────────────────────────── */
var getStatusLabelHtml = function (v) {
    var s = String(v || '').toLowerCase();
    if (s === 'payout') {
        return '<span class="label label-success label-payout">' + escapeHtml(statusPayoutText) + '</span>';
    }
    return '<span class="label label-warning label-pending">' + escapeHtml(statusPendingText) + '</span>';
};

/* ── Footer status badges (test distribution + along status) ── */
var getFooterStatusBadgesHtml = function (tipStatus, testDistStatus, alongStatus) {
    var html = getStatusLabelHtml(tipStatus || 'Pending');
    
    if (testDistStatus) {
        var s = String(testDistStatus || '').toLowerCase();
        var badgeClass = s === 'success' ? 'label-success' : s === 'error' ? 'label-danger' : 'label-info';
        html += ' <span class="label ' + badgeClass + '" style="margin-left:6px;"><i class="fa fa-flask"></i> ' + escapeHtml(testDistStatus) + '</span>';
    }
    
    if (alongStatus) {
        var s = String(alongStatus || '').toLowerCase();
        var badgeClass = s === 'active' ? 'label-success' : s === 'inactive' ? 'label-danger' : 'label-default';
        html += ' <span class="label ' + badgeClass + '" style="margin-left:6px;"><i class="fa fa-check-circle"></i> ' + escapeHtml(alongStatus) + '</span>';
    }
    
    return html;
};

/* ── Distribution log timeline renderer ───────────────────── */
var renderDistributionLogsHtml = function (logs) {
    if (!logs || !logs.length) {
        return '<div class="tipm-no-logs"><i class="fa fa-clock"></i> ' + escapeHtml(noDistributionLogsText) + '</div>';
    }
    var html = '';
    for (var i = logs.length - 1; i >= 0; i--) {
        var row          = logs[i] || {};
        var byName       = row.by_name || row.by_id || '-';
        var note         = row.note || '';
        var employees    = row.employees || [];
        var hasEmployees = !!(employees && employees.length);
        var empCnt       = row.employee_count || employees.length || 0;
        var tipTot       = row.tip_total || 0;
        var at           = formatListingDate(row.at || '');
        var panelId      = 'tipm-log-employees-' + i;
        var peopleBadge  = hasEmployees
            ? '<button type="button" class="tipm-log-badge tipm-log-badge-toggle js-tipm-log-employees-toggle" data-target="' + escapeHtml(panelId) + '" aria-expanded="false">'
                + '<i class="fa fa-users"></i> ' + escapeHtml(String(empCnt))
                + ' <i class="fa fa-angle-down tipm-log-toggle-icon"></i></button>'
            : '<span class="tipm-log-badge"><i class="fa fa-users"></i> ' + escapeHtml(String(empCnt)) + '</span>';
        html += '<div class="tipm-log-entry">'
            + '<div class="tipm-log-meta">'
            + '<span class="tipm-log-date"><i class="fa fa-clock"></i> ' + escapeHtml(at) + '</span>'
            + '<span class="tipm-log-by"><i class="fa fa-user-o"></i> ' + escapeHtml(byName) + '</span>'
            + '</div>'
            + '<div class="tipm-log-details">'
            + peopleBadge
            + '<span class="tipm-log-badge tipm-log-badge-tip">$' + formatMoney(tipTot) + '</span>'
            + '</div>'
            + (note ? '<div class="tipm-log-note"><i class="fa fa-quote-left"></i> ' + escapeHtml(note) + '</div>' : '')
            + (hasEmployees ? '<div class="tipm-log-employees tipm-hidden" id="' + escapeHtml(panelId) + '">' + buildLogEmployeesHtml(employees) + '</div>' : '')
            + '</div>';
    }
    return html;
};

/* ── Payout table: distribution column renderer ────────────── */
var renderDistributionCell = function (distribution, row) {
    var html = '';

    /* Employee rows */
    if (!distribution || !distribution.length) {
        html = '<span class="text-muted" style="font-size:12px;">' + escapeHtml(noDistributionLogText) + '</span>';
    } else {
        html = '<div class="tipm-dist-summary">';
        for (var i = 0; i < distribution.length; i++) {
            var d     = distribution[i] || {};
            var color = getAvatarColor(i);
            var init  = getInitials(d.employee_name || '');
            html += '<div class="tipm-dist-row">'
                + '<span class="tipm-dist-avatar" style="background:' + color + ';">' + escapeHtml(init) + '</span>'
                + '<span class="tipm-dist-name">'   + escapeHtml(d.employee_name || '') + '</span>'
                + '<span class="tipm-dist-amount">$' + formatMoney(d.tip_paid || 0)    + '</span>'
                + '</div>';
        }
        html += '</div>';
    }

    /* Note */
    var note = (row && row.distribution_note) ? String(row.distribution_note) : '';
    if (note) {
        html += '<div class="tipm-dist-note"><i class="fa fa-sticky-note-o"></i> ' + escapeHtml(note) + '</div>';
    }

    /* Latest log mini-line */
    var logs = (row && row.distribution_logs) ? row.distribution_logs : [];
    if (logs.length) {
        var latest = logs[logs.length - 1] || {};
        html += '<div class="tipm-dist-last-log">'
            + '<i class="fa fa-clock"></i> ' + escapeHtml(formatListingDate(latest.at || '')) + ' &mdash; ' + escapeHtml(latest.by_name || '-')
            + '</div>';
    }

    return html;
};

/* ── Action buttons renderer ───────────────────────────────── */
var renderActionButtons = function (orderToken, mode, logCount) {
    var isPayout = mode === 'payout';
    var btnClass = isPayout ? 'btn-default tipm-btn-edit' : 'tipm-action-primary';
    var btnIcon  = isPayout ? 'fa-pencil' : 'fa-random';
    var btnText  = isPayout ? editDistributionText : distributeButtonText;
    var tok      = escapeHtml(orderToken || '');
    var cnt      = parseInt(logCount || 0, 10);

    var html = '<div class="tipm-action-group">'
        + '<button type="button" class="btn btn-xs ' + btnClass + ' js-open-distribute" data-token="' + tok + '">'
        + '<i class="fa ' + btnIcon + '"></i> ' + escapeHtml(btnText)
        + '</button>';

    /* Copy deep-link */
    html += '<button type="button" class="btn btn-xs btn-default js-copy-distribute-link"'
        + ' data-token="' + tok + '" title="' + escapeHtml(copyLinkText) + '">'
        + '<i class="fa fa-link"></i> ' + escapeHtml(copyLinkText)
        + '</button>';

    /* View History — only on payout when logs exist */
    if (isPayout && cnt > 0) {
        html += '<button type="button" class="btn btn-xs btn-info js-view-logs"'
            + ' data-token="' + tok + '">'
            + '<i class="fa fa-history"></i> History (' + cnt + ')'
            + '</button>';
    }

    html += '</div>';
    return html;
};

/* ── Summary card updater ──────────────────────────────────── */
var updateSummaryCardsFromResponse = function (json) {
    if (!json || !json.summary) { return; }
    var count  = parseInt(json.summary.count  || 0, 10);
    var amount = parseFloat(json.summary.amount || 0);
    var avg    = count > 0 ? (amount / count) : 0;
    if (tipPageMode === 'pending') {
        window.jQuery('#pending-count-card').text(count);
        window.jQuery('#pending-amount-card').text('$' + formatMoney(amount));
        window.jQuery('#pending-avg-card').text('$' + formatMoney(avg));
    } else {
        window.jQuery('#payout-count-card').text(count);
        window.jQuery('#payout-amount-card').text('$' + formatMoney(amount));
        window.jQuery('#payout-avg-card').text('$' + formatMoney(avg));
    }
};

var getAjaxDataPayload = function (d) {
    var f = getCurrentFilterPayload();
    d.date_from = f.date_from;
    d.date_to   = f.date_to;
    return d;
};

/* ── DataTables ────────────────────────────────────────────── */
var initializePendingDataTable = function () {
    if (!window.jQuery || !window.jQuery.fn.DataTable || !document.getElementById('pendingTipsTable')) { return; }
    pendingTable = window.jQuery('#pendingTipsTable').DataTable({
        processing: true, serverSide: true, pageLength: 10, order: [[0, 'desc']],
        language: { processing: '<i class="fa fa-spinner fa-spin"></i>' },
        ajax: {
            url: pendingDataUrl, data: getAjaxDataPayload,
            dataSrc: function (json) { updateSummaryCardsFromResponse(json); return json && json.data ? json.data : []; }
        },
        columns: [
            {
                data: 'order_number',
                render: function (val, type, row) {
                    var href = (row && row.order_view_url) ? row.order_view_url : '#';
                    return '<a class="order-link" href="' + escapeHtml(href) + '">' + escapeHtml(val || '') + '</a>';
                }
            },
            { data: 'customer_name' },
            {
                data: 'base_payment_amount',
                render: function (val) { return '<span style="color:#555;">$' + formatMoney(val || 0) + '</span>'; }
            },
            {
                data: 'tip_amount',
                render: function (val) {
                    return '<strong style="color:#c49000; font-size:14px;">$' + formatMoney(val || 0) + '</strong>';
                }
            },
            {
                data: 'tip_status',
                render: function (val) { return getStatusLabelHtml(val); }
            },
            {
                data: 'order_token', orderable: false, searchable: false,
                render: function (val) { return renderActionButtons(val, 'pending', 0); }
            }
        ]
    });
    currentTable = pendingTable;
};

var initializePayoutDataTable = function () {
    if (!window.jQuery || !window.jQuery.fn.DataTable || !document.getElementById('payoutTipsTable')) { return; }
    payoutTable = window.jQuery('#payoutTipsTable').DataTable({
        processing: true, serverSide: true, pageLength: 10, order: [[0, 'desc']],
        language: { processing: '<i class="fa fa-spinner fa-spin"></i>' },
        ajax: {
            url: payoutDataUrl, data: getAjaxDataPayload,
            dataSrc: function (json) { updateSummaryCardsFromResponse(json); return json && json.data ? json.data : []; }
        },
        columns: [
            {
                data: 'order_number',
                render: function (val, type, row) {
                    var href = (row && row.order_view_url) ? row.order_view_url : '#';
                    return '<a class="order-link" href="' + escapeHtml(href) + '">' + escapeHtml(val || '') + '</a>';
                }
            },
            { data: 'customer_name' },
            {
                data: 'tip_amount',
                render: function (val) {
                    return '<strong style="color:#27ae60; font-size:14px;">$' + formatMoney(val || 0) + '</strong>';
                }
            },
            {
                data: 'distribution', orderable: false,
                render: function (val, type, row) { return renderDistributionCell(val, row); }
            },
            {
                data: 'tip_status',
                render: function (val) { return getStatusLabelHtml(val); }
            },
            {
                data: 'order_token', orderable: false, searchable: false,
                render: function (val, type, row) {
                    var logCount = (row && row.distribution_logs) ? row.distribution_logs.length : 0;
                    return renderActionButtons(val, 'payout', logCount);
                }
            }
        ]
    });
    currentTable = payoutTable;
};

/* ── Distribution modal: loading state ────────────────────── */
var setLoadingState = function (loading) {
    var loadEl  = document.getElementById('tip-distribution-loading');
    var contEl  = document.getElementById('tip-distribution-content');
    var saveBtn = document.getElementById('saveTipDistributionBtn');
    if (!loadEl || !contEl) { return; }
    if (loading) {
        loadEl.classList.remove('tipm-hidden');
        contEl.classList.add('tipm-hidden');
    } else {
        loadEl.classList.add('tipm-hidden');
        contEl.classList.remove('tipm-hidden');
    }
    if (saveBtn) { saveBtn.disabled = loading; }
};

/* ── Employee select helpers ───────────────────────────────── */
var getSelectedEmployeeIds = function () {
    var sel = [];
    window.jQuery('#tip_employee_select option:selected').each(function () {
        var v = parseInt(window.jQuery(this).val(), 10);
        if (!isNaN(v) && v > 0) { sel.push(v); }
    });
    return sel;
};

var updateTipSplits = function () {
    var sel      = getSelectedEmployeeIds();
    var tipCents = Math.round((parseFloat(currentTipAmount || 0) || 0) * 100);
    var alloc    = 0;
    if (!sel.length) {
        document.querySelectorAll('#tip-selected-employee-list .tip-split-amount').forEach(function (el) {
            el.textContent = '$0.00';
        });
        updateAllocationBar(0);
        return;
    }
    var base = Math.floor(tipCents / sel.length);
    var rem  = tipCents - base * sel.length;
    for (var i = 0; i < sel.length; i++) {
        var cents  = base + (i < rem ? 1 : 0);
        var target = document.getElementById('tip_split_amount_' + sel[i]);
        if (target) { target.textContent = '$' + (cents / 100).toFixed(2); }
        alloc += cents;
    }
    updateAllocationBar(alloc / 100);
};

var updateAllocationBar = function (allocated) {
    var wrap = document.getElementById('tip-allocation-bar-wrap');
    var bar  = document.getElementById('tip-allocation-bar');
    var text = document.getElementById('tip-allocation-text');
    if (!wrap) { return; }
    if (!getSelectedEmployeeIds().length || currentTipAmount <= 0) {
        wrap.classList.add('tipm-hidden'); return;
    }
    wrap.classList.remove('tipm-hidden');
    var pct = Math.min(100, currentTipAmount > 0 ? (allocated / currentTipAmount) * 100 : 0);
    if (bar)  { bar.style.width = pct + '%'; }
    if (text) { text.textContent = '$' + formatMoney(allocated) + ' / $' + formatMoney(currentTipAmount); }
};

var initializeEmployeeSelect2 = function () {
    var el = window.jQuery('#tip_employee_select');
    if (!el.length) { return; }
    if (window.jQuery.fn.select2) {
        try { el.select2('destroy'); } catch (e) {}
        el.select2({ width: '100%', placeholder: selectEmployeesText, closeOnSelect: false });
    }
    el.off('change.tipm').on('change.tipm', function () { renderSelectedEmployees(); });
};

var populateEmployeeSelectOptions = function (employees) {
    var el = window.jQuery('#tip_employee_select');
    if (!el.length) { return; }
    if (!employees || !employees.length) {
        el.html('').trigger('change');
        window.jQuery('#tip-selected-employee-list').html(
            '<div class="tipm-no-emp"><i class="fa fa-users"></i> ' + escapeHtml(noEmployeesText) + '</div>'
        );
        return;
    }
    var html = '';
    for (var i = 0; i < employees.length; i++) {
        var emp = employees[i] || {};
        html += '<option value="' + escapeHtml(emp.id || '') + '"' + (emp.checked ? ' selected' : '')
            + ' data-name="' + escapeHtml(emp.name || '') + '">'
            + escapeHtml(emp.name || '') + '</option>';
    }
    el.html(html);
    initializeEmployeeSelect2();
    renderSelectedEmployees();
};

var renderSelectedEmployees = function () {
    var container = window.jQuery('#tip-selected-employee-list');
    if (!container.length) { return; }
    var sel = getSelectedEmployeeIds();
    if (!sel.length) {
        container.html('<div class="tipm-no-emp"><i class="fa fa-users"></i> ' + escapeHtml(noSelectedEmployeesText) + '</div>');
        updateTipSplits();
        return;
    }
    var html = '<div class="tipm-emp-list">';
    for (var i = 0; i < sel.length; i++) {
        var empId  = sel[i];
        var opt    = window.jQuery('#tip_employee_select option[value="' + empId + '"]');
        var name   = opt.data('name') || opt.text() || '';
        var color  = getAvatarColor(i);
        var init   = getInitials(name);
        html += '<div class="tipm-emp-card">'
            + '<div class="tipm-emp-avatar" style="background:' + color + ';">' + escapeHtml(init) + '</div>'
            + '<div class="tipm-emp-info"><strong>' + escapeHtml(name) + '</strong></div>'
            + '<div class="tipm-emp-share">'
            + '<div class="tipm-emp-share-label">' + escapeHtml(employeeShareLabelText) + '</div>'
            + '<div class="tipm-emp-share-amount tip-split-amount" id="tip_split_amount_' + empId + '">$0.00</div>'
            + '</div></div>';
    }
    html += '</div>';
    container.html(html);
    updateTipSplits();
};

/* ── Fill distribution modal from AJAX payload ─────────────── */
var fillDistributionModal = function (payload) {
    var data = payload || {};
    currentOrderToken = data.order_token || '';
    currentTipAmount  = parseFloat(data.tip_amount || 0);
    currentDistributionVersion = data.distribution_version || '';
    if (isNaN(currentTipAmount)) { currentTipAmount = 0; }

    var tokField = document.getElementById('tip_order_token');
    if (tokField) { tokField.value = currentOrderToken; }

    /* Header badge */
    var rawOrderNum = String(data.order_number || '-').trim();
    var normalizedOrderNum = rawOrderNum.replace(/^#/, '').trim();
    var badge = document.getElementById('dist_order_badge');
    if (badge) {
        badge.textContent = 'Order — ' + (normalizedOrderNum || '-');
        badge.classList.remove('tipm-hidden');
    }

    /* Order meta bar */
    var orderNumEl = document.getElementById('dist_order_number');
    var customerEl = document.getElementById('dist_customer_name');
    var displayOrderNum = normalizedOrderNum || '—';
    if (orderNumEl) { orderNumEl.textContent = displayOrderNum; }
    if (customerEl) { customerEl.textContent = data.customer_name || '—'; }

    /* Order status badge */
    var statusBadgeEl = document.getElementById('dist_order_status_badge');
    if (statusBadgeEl) {
        var color = String(data.order_status_color || 'default').toLowerCase();
        var label = data.order_status_label || '—';
        var orderStatusOther = (data.order_status_other || '').toString().trim();
        if (String(label).toLowerCase() === 'other' && orderStatusOther) {
            label = orderStatusOther;
        }
        statusBadgeEl.className = 'label label-' + color + ' tipm-status-badge';
        statusBadgeEl.textContent = label;
    }

    /* Amount cards */
    document.getElementById('dist_base_amount').textContent  = '$' + formatMoney(data.base_payment_amount  || 0);
    document.getElementById('dist_tip_amount').textContent   = '$' + formatMoney(data.tip_amount  || 0);
    document.getElementById('dist_total_amount').textContent = '$' + formatMoney(data.total_payment_amount || 0);

    /* Note textarea */
    var noteEl = document.getElementById('tip_distribution_note');
    if (noteEl) { noteEl.value = data.existing_note || ''; updateNoteCharCount(noteEl.value.length); }

    /* Footer tip status badge */
    var footerBadge = document.getElementById('dist_status_badge_wrap');
    if (footerBadge) { 
        footerBadge.innerHTML = getFooterStatusBadgesHtml(
            data.tip_status || 'Pending',
            data.test_distribution_status || '',
            data.along_status || ''
        ); 
    }

    /* Previous distributions info bar */
    var logs     = data.logs || [];
    var prevBar  = document.getElementById('dist-prev-dist-info');
    var prevText = document.getElementById('dist-prev-dist-text');
    var viewBtn  = window.jQuery('.js-view-logs-from-modal');
    if (prevBar) {
        if (logs.length > 0) {
            prevBar.classList.remove('tipm-hidden');
            if (prevText) { prevText.textContent = logs.length + ' previous distribution(s)'; }
            viewBtn.attr('data-token', currentOrderToken).attr('data-order', rawOrderNum);
        } else {
            prevBar.classList.add('tipm-hidden');
        }
    }

    /* Relocation team preselect banner — shown whenever a team was found */
    var teamBanner = document.getElementById('delivered-preselect-message');
    var noTeamBanner = document.getElementById('no-relocation-team-message');
    if (teamBanner) {
        data.has_relocation_team ? teamBanner.classList.remove('tipm-hidden') : teamBanner.classList.add('tipm-hidden');
    }
    if (noTeamBanner) {
        (!data.has_relocation_team) ? noTeamBanner.classList.remove('tipm-hidden') : noTeamBanner.classList.add('tipm-hidden');
    }

    /* No-tip warning */
    var noTipBanner = document.getElementById('no-tip-warning-message');
    var saveBtn     = document.getElementById('saveTipDistributionBtn');
    var noTip       = currentTipAmount <= 0;
    if (noTipBanner) { noTip ? noTipBanner.classList.remove('tipm-hidden') : noTipBanner.classList.add('tipm-hidden'); }
    if (saveBtn)     { saveBtn.disabled = noTip; }

    updateAllocationBar(0);
    populateEmployeeSelectOptions(data.employees || []);
};

/* ── Logs Viewer Modal ─────────────────────────────────────── */
var openLogsViewer = function (orderToken, orderNum) {
    var viewerEl = document.getElementById('tipLogsViewerModal');
    if (!viewerEl || !distributionDetailUrl) { return; }

    var titleEl   = document.getElementById('logs_viewer_order_num');
    var loadingEl = document.getElementById('logs-viewer-loading');
    var contentEl = document.getElementById('logs-viewer-content');

    if (titleEl)   { titleEl.textContent = orderNum || ''; }
    if (loadingEl) { loadingEl.style.display = 'block'; }
    if (contentEl) { contentEl.style.display = 'none'; contentEl.innerHTML = ''; }

    window.jQuery(viewerEl).modal('show');

    window.jQuery.ajax({
        type: 'GET', url: distributionDetailUrl, data: { ot: orderToken },
        success: function (resp) {
            if (!resp || resp.status !== true) {
                if (contentEl) {
                    contentEl.innerHTML = '<p class="text-danger">' + escapeHtml(resp && resp.message ? resp.message : loadDetailErrorText) + '</p>';
                    contentEl.style.display = 'block';
                }
                if (loadingEl) { loadingEl.style.display = 'none'; }
                return;
            }
            var logs = (resp.data && resp.data.logs) ? resp.data.logs : [];
            if (contentEl) {
                contentEl.innerHTML = renderDistributionLogsHtml(logs);
                contentEl.style.display = 'block';
            }
            if (loadingEl) { loadingEl.style.display = 'none'; }
        },
        error: function () {
            if (contentEl) {
                contentEl.innerHTML = '<p class="text-danger">' + escapeHtml(loadDetailErrorText) + '</p>';
                contentEl.style.display = 'block';
            }
            if (loadingEl) { loadingEl.style.display = 'none'; }
        }
    });
};

/* ── Distribution modal: open / hide ──────────────────────── */
var showModal = function () {
    if (window.bootstrap && window.bootstrap.Modal) {
        if (!tipModalInstanceV5) { tipModalInstanceV5 = new window.bootstrap.Modal(tipModalElement); }
        tipModalInstanceV5.show();
    } else {
        window.jQuery(tipModalElement).modal('show');
    }
};

var hideModal = function () {
    if (window.bootstrap && window.bootstrap.Modal && tipModalInstanceV5) {
        tipModalInstanceV5.hide();
    } else {
        window.jQuery(tipModalElement).modal('hide');
    }
};

var openDistributionModal = function (orderToken) {
    if (!orderToken || !distributionDetailUrl || !tipModalElement) { return; }
    updateModalUrlState(orderToken, true);
    setLoadingState(true);
    showModal();
    window.jQuery.ajax({
        type: 'GET', url: distributionDetailUrl, data: { ot: orderToken },
        success: function (resp) {
            if (!resp || resp.status !== true) {
                showToast((resp && resp.message ? resp.message : loadDetailErrorText), 'error');
                setLoadingState(false);
                return;
            }
            fillDistributionModal(resp.data || {});
            setLoadingState(false);
        },
        error: function (xhr) {
            var msg = loadDetailErrorText;
            if (xhr && xhr.responseJSON && xhr.responseJSON.message) { msg = xhr.responseJSON.message; }
            showToast(msg, 'error');
            setLoadingState(false);
        }
    });
};

/* ── Save distribution ─────────────────────────────────────── */
var saveDistribution = function () {
    if (!distributionSaveUrl) { return; }
    var selIds = getSelectedEmployeeIds();
    if (!selIds.length) {
        showToast(selectEmployeeErrorText, 'warning');
        return;
    }
    var saveBtn = document.getElementById('saveTipDistributionBtn');
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> ' + escapeHtml(saveDistributionText);
    }
    window.jQuery.ajax({
        type: 'POST', url: distributionSaveUrl,
        data: {
            _token: csrfToken, ot: currentOrderToken,
            employee_ids: selIds,
            distribution_note: window.jQuery('#tip_distribution_note').val() || '',
            distribution_version: currentDistributionVersion
        },
        success: function (resp) {
            if (resp && resp.status === true) {
                hideModal();
                showToast(escapeHtml(savedSuccessText), 'success');
                if (pendingTable) { pendingTable.ajax.reload(null, false); }
                if (payoutTable)  { payoutTable.ajax.reload(null, false); }
                updateModalUrlState('', false);
            } else {
                showToast((resp && resp.message ? resp.message : saveErrorText), 'error');
            }
        },
        error: function (xhr) {
            var msg = saveErrorText;
            if (xhr && xhr.responseJSON && xhr.responseJSON.message) { msg = xhr.responseJSON.message; }
            showToast(msg, (xhr && (xhr.status === 409 || xhr.status === 422)) ? 'warning' : 'error');
        },
        complete: function () {
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = '<i class="fa fa-check"></i> ' + escapeHtml(saveDistributionText);
            }
        }
    });
};

/* ── Note char counter ─────────────────────────────────────── */
var updateNoteCharCount = function (len) {
    var el = document.getElementById('tipm-note-chars');
    if (el) { el.textContent = len; }
};

/* ── Copy link ─────────────────────────────────────────────── */
var copyDistributionLink = function (token) {
    if (!token) { return; }
    var link  = buildDistributionDeepLink(token);
    var done  = function () { showToast(escapeHtml(linkCopiedText), 'info'); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link).then(done);
    } else {
        var t = document.createElement('textarea');
        t.value = link; document.body.appendChild(t); t.select();
        document.execCommand('copy'); document.body.removeChild(t); done();
    }
};

/* ── Export / filter helpers ───────────────────────────────── */
var buildExportCsvHref = function () {
    var base = tipPageMode === 'payout' ? payoutExportUrl : pendingExportUrl;
    if (!base) { return '#'; }
    var p = new URLSearchParams();
    var f = getCurrentFilterPayload();
    if (f.date_from) { p.set('date_from', f.date_from); }
    if (f.date_to)   { p.set('date_to',   f.date_to); }
    if (currentTable) { var sv = currentTable.search(); if (sv) { p.set('search', sv); } }
    return p.toString() ? (base + '?' + p.toString()) : base;
};

var refreshExportButtonHref = function () {
    window.jQuery('#tipm-export-csv-btn').attr('href', buildExportCsvHref());
};

var applyFiltersAndReload = function () {
    normalizeAndValidateFilterDates(true);
    updateFilterQueryInUrl();
    if (currentTable) { currentTable.ajax.reload(); }
    refreshExportButtonHref();
};

var resetFilters = function () {
    window.jQuery('#tipm-date-from').val('');
    window.jQuery('#tipm-date-to').val('');
    if (filterFromPicker) { filterFromPicker.clear(false); }
    if (filterToPicker) { filterToPicker.clear(false); }
    updateDatepickerBounds();
    window.jQuery('.tipm-preset-btn').removeClass('active');
    applyFiltersAndReload();
};

/* ── Auto-refresh ──────────────────────────────────────────── */
var updateAutoRefreshToggleUi = function () {
    var btn = window.jQuery('#tipm-auto-refresh-toggle');
    if (!btn.length) { return; }
    if (autoRefreshEnabled) {
        btn.attr('data-enabled', '1').html('<i class="fa fa-pause"></i> ' + escapeHtml(autoRefreshOnText))
           .removeClass('btn-default').addClass('btn-info');
    } else {
        btn.attr('data-enabled', '0').html('<i class="fa fa-play"></i> ' + escapeHtml(autoRefreshOffText))
           .removeClass('btn-info').addClass('btn-default');
    }
};

var setAutoRefresh = function (enabled) {
    autoRefreshEnabled = !!enabled;
    if (autoRefreshTimer) { clearInterval(autoRefreshTimer); autoRefreshTimer = null; }
    if (autoRefreshEnabled) {
        autoRefreshTimer = setInterval(function () {
            if (currentTable) { currentTable.ajax.reload(null, false); }
        }, 60000);
    }
    updateAutoRefreshToggleUi();
};

/* ── Toolbar event wiring ──────────────────────────────────── */
var setupToolbarEvents = function () {
    initializeFilterDatepickers();
    window.jQuery('#tipm-date-from').val(formatDateForInput(filterFromDefault));
    window.jQuery('#tipm-date-to').val(formatDateForInput(filterToDefault));

    if (!hasFilterFromDefault) {
        window.jQuery('#tipm-date-from').val('');
    }
    if (!hasFilterToDefault) {
        window.jQuery('#tipm-date-to').val('');
    }
    normalizeAndValidateFilterDates(false);

    window.jQuery('#tipm-apply-filters').on('click',  function () { applyFiltersAndReload(); });
    window.jQuery('#tipm-reset-filters').on('click',  function () { resetFilters(); });
    window.jQuery('#tipm-refresh-table').on('click', function (event) {
        event.preventDefault();
        if (currentTable) { currentTable.ajax.reload(null, false); }
        refreshExportButtonHref();
    });
    window.jQuery('#tipm-export-csv-btn').on('click', function (event) {
        var href = buildExportCsvHref();
        event.preventDefault();
        if (href && href !== '#') {
            window.location.href = href;
        }
    });
    window.jQuery(document).on('blur change', '.tipm-date-input', function () {
        normalizeAndValidateFilterDates(true);
    });

    window.jQuery(document).on('click', '.tipm-preset-btn', function () {
        setDateFiltersFromPreset(window.jQuery(this).data('range'));
        applyFiltersAndReload();
    });
    window.jQuery(document).on('keypress', '.dataTables_filter input', function (e) {
        if (e.which === 13) { refreshExportButtonHref(); }
    });
    window.jQuery(document).on('input', '.dataTables_filter input', function () {
        refreshExportButtonHref();
    });
};

/* ── Modal & viewer event wiring ───────────────────────────── */
var initializeModal = function () {
    tipModalElement = document.getElementById('tipDistributionModal');
    if (!tipModalElement) { return; }

    /* Open distribution modal from table */
    window.jQuery(document).on('click', '.js-open-distribute', function () {
        openDistributionModal(window.jQuery(this).data('token'));
    });

    /* Copy link */
    window.jQuery(document).on('click', '.js-copy-distribute-link', function () {
        copyDistributionLink(window.jQuery(this).data('token'));
    });

    /* Open logs viewer from table */
    window.jQuery(document).on('click', '.js-view-logs', function () {
        var tok = window.jQuery(this).data('token');
        /* Try to find the order number from the same row */
        var orderNum = '';
        try {
            var td = window.jQuery(this).closest('tr').find('td:first-child .order-link');
            orderNum = td.length ? td.text() : '';
        } catch (e) {}
        openLogsViewer(tok, orderNum);
    });

    /* Open logs viewer from inside distribution modal */
    window.jQuery(document).on('click', '.js-view-logs-from-modal', function () {
        var tok = window.jQuery(this).data('token') || currentOrderToken;
        var ord = window.jQuery(this).data('order') || '';
        openLogsViewer(tok, ord);
    });

    window.jQuery(document).on('click', '.js-tipm-log-employees-toggle', function () {
        var btn = window.jQuery(this);
        var targetId = btn.data('target');
        if (!targetId) { return; }
        var panel = window.jQuery('#' + targetId);
        if (!panel.length) { return; }
        var expanded = btn.attr('aria-expanded') === 'true';
        btn.attr('aria-expanded', expanded ? 'false' : 'true');
        panel.toggleClass('tipm-hidden', expanded);
    });

    /* Save button */
    window.jQuery('#saveTipDistributionBtn').on('click', function () { saveDistribution(); });

    /* Note char counter */
    window.jQuery(document).on('input', '#tip_distribution_note', function () {
        updateNoteCharCount(this.value.length);
    });

    /* Clean URL when modal closes */
    window.jQuery(tipModalElement).on('hidden.bs.modal', function () {
        currentDistributionVersion = '';
        updateModalUrlState('', false);
    });

    /* Auto-open from URL parameter */
    if (openModal && openToken) { openDistributionModal(openToken); }
};

/* ── Bootstrap ─────────────────────────────────────────────── */
window.jQuery(function () {
    activeStatusFilter = tipPageMode === 'payout' ? 'payout' : 'pending';
    setupToolbarEvents();

    if (tipPageMode === 'pending') {
        initializePendingDataTable();
    } else if (tipPageMode === 'payout') {
        initializePayoutDataTable();
    }

    initializeModal();
    refreshExportButtonHref();

    /* Action group inline style */
    var styleEl = document.createElement('style');
    styleEl.textContent = '.tipm-action-group { display:flex; flex-direction:column; gap:4px; align-items:flex-start; }'
        + '.tipm-action-group .btn-xs { font-size:12px; font-weight:600; border-radius:4px !important; color: #fff !important; }'
        + '.tipm-action-primary { background:#1a6363 !important; border-color:#1a6363 !important; color:#fff !important; }'
        + '.tipm-action-primary:hover { background:#135050 !important; }'
        + '.tipm-btn-edit { color:#555; }'
        + '.tipm-action-group .btn-info { background:#17a2b8 !important; border-color:#17a2b8 !important; color:#fff !important; }'
        + '.tipm-log-badge-toggle { border:none; cursor:pointer; display:inline-flex; align-items:center; gap:5px; transition:background .15s ease,color .15s ease; }'
        + '.tipm-log-badge-toggle:hover { background:#cfe5e5; color:#114949; }'
        + '.tipm-log-badge-toggle:focus { outline:none; box-shadow:0 0 0 2px rgba(26,99,99,.18); }'
        + '.tipm-log-badge-toggle[aria-expanded=\"true\"] .tipm-log-toggle-icon { transform:rotate(180deg); }'
        + '.tipm-log-toggle-icon { transition:transform .15s ease; }'
        + '.tipm-log-employees { margin-top:8px; padding-top:8px; border-top:1px dashed #d5e5e5; }'
        + '.tipm-log-employee-list { display:flex; flex-direction:column; gap:6px; }'
        + '.tipm-log-employee { display:flex; align-items:center; gap:8px; padding:6px 8px; background:#fff; border:1px solid #e6efef; border-radius:6px; }'
        + '.tipm-log-employee-avatar { width:24px; height:24px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; color:#fff; font-size:10px; font-weight:800; }'
        + '.tipm-log-employee-name { flex:1; font-size:12px; color:#385353; font-weight:600; }'
        + '.tipm-log-employee-amount { font-size:12px; color:#1a6363; font-weight:700; }';
    document.head.appendChild(styleEl);
});
