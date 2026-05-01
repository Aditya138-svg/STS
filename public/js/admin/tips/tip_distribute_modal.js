// Tip Distribution Modal logic (Bootstrap 5).
// All variables are declared at the top of this file.

var tipDistributionModalElement = null;
var tipDistributionModalInstance = null;
var tipAmount = 0;
var openModal = false;
var preselectedEmployeeIds = [];

var formatMoney = function (amount) {
    amount = isNaN(amount) ? 0 : amount;
    return (Math.round(amount * 100) / 100).toFixed(2);
};

var getSelectedEmployeeIds = function () {
    var selected = [];
    var checkboxes = document.querySelectorAll('.employee-checkbox:checked');
    checkboxes.forEach(function (cb) {
        var val = parseInt(cb.value, 10);
        if (!isNaN(val)) {
            selected.push(val);
        }
    });
    return selected;
};

var setAllSplitAmountsToZero = function () {
    var checkboxes = document.querySelectorAll('.employee-checkbox');
    checkboxes.forEach(function (cb) {
        var empId = cb.value;
        var span = document.getElementById('tip_split_amount_' + empId);
        if (span) {
            span.textContent = '$0.00';
        }
    });
};

var updateTipSplits = function () {
    setAllSplitAmountsToZero();

    var selectedEmployeeIds = getSelectedEmployeeIds();
    var count = selectedEmployeeIds.length;
    if (count === 0) {
        return;
    }

    var tipCents = Math.round(tipAmount * 100);
    var baseCents = Math.floor(tipCents / count);
    var remainderCents = tipCents - (baseCents * count);

    selectedEmployeeIds.forEach(function (empId, idx) {
        var empCents = baseCents + (idx < remainderCents ? 1 : 0);
        var span = document.getElementById('tip_split_amount_' + empId);
        if (span) {
            span.textContent = '$' + (empCents / 100).toFixed(2);
        }
    });
};

var initTipDistributionModal = function () {
    var rawTipAmount = window.TIP_MANAGEMENT_TIP_AMOUNT;
    tipAmount = parseFloat(rawTipAmount);
    if (isNaN(tipAmount)) {
        tipAmount = 0;
    }

    openModal = window.TIP_MANAGEMENT_OPEN === 1 || window.TIP_MANAGEMENT_OPEN === true;
    preselectedEmployeeIds = window.TIP_MANAGEMENT_PRESELECTED_EMPLOYEE_IDS || [];

    tipDistributionModalElement = document.getElementById('tipDistributionModal');

    if (tipDistributionModalElement && openModal && window.bootstrap && window.bootstrap.Modal) {
        tipDistributionModalInstance = new window.bootstrap.Modal(tipDistributionModalElement);
        tipDistributionModalInstance.show();
    }

    var checkboxes = document.querySelectorAll('.employee-checkbox');
    checkboxes.forEach(function (cb) {
        cb.addEventListener('change', function () {
            updateTipSplits();
        });
    });

    updateTipSplits();
};

initTipDistributionModal();

