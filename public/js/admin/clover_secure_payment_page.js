(function ($, window, document) {
  "use strict";

  var config = window.adminCloverPaymentConfig || {};
  var texts = config.texts || {};
  var orderId = parseInt(config.orderId || 0, 10);
  var paymentId = parseInt(config.paymentId || 0, 10);
  var getOrderPaymentUrl = config.getOrderPaymentUrl || "";
  var currentTipAmount = 0;
  var baseAmount = 0;
  var ccFeeAmount = 0;
  var ccFeePercent = 0;
  var currentOtpMeta = {};
  var currentOtpRequestToken = "";
  var otpVerified = false;
  var currentOtpTipAmount = 0;
  var paymentProcessing = false;
  var closeCountdownTimer = null;
  var pageExpiresAt = parseInt(config.pageExpiresAt || 0, 10);
  var pageToken = config.pageToken || "";
  var pageSessionTimer = null;
  var sessionCloseTimer = null;
  var otpResendCooldownTimer = null;
  var otpResendCooldownSeconds = 0;
  var tipChangeState = null;
  var tipChangeModalActionHandled = false;
  var countdownRemainingSeconds = 600;
  var tipToastTimer = null;

  var formatMoney = function (amount) {
    var parsed = parseFloat(amount || 0);
    return isNaN(parsed) ? "0.00" : parsed.toFixed(2);
  };

  var getDigitsOnly = function (value) {
    return String(value || "").replace(/\D+/g, "");
  };

  var showUnavailable = function (message) {
    $("#admin_payment_loading").hide();
    $("#admin_clover_payment_form").hide();
    $("#admin_payment_unavailable_message").text(message || texts.secureUnavailable || "Payment details could not be loaded for this order.");
    $("#admin_payment_unavailable").show();
  };

  var clearFieldError = function (fieldId) {
    var $error = $("#" + fieldId + "_error");
    $error.text("");
    $error.hide();
  };

  var setFieldError = function (fieldId, message) {
    var $error = $("#" + fieldId + "_error");
    if (message) {
      $error.text(message);
      $error.show();
    } else {
      $error.text("");
      $error.hide();
    }
  };

  var getValidatorMessageContainer = function ($field) {
    var $formGroup = $field.closest(".admin-field-group");
    if ($formGroup.length) {
      return $formGroup;
    }
    var $column = $field.closest('[class*="col-xs-"], [class*="col-sm-"], [class*="col-md-"], [class*="col-lg-"]');
    if ($column.length) {
      return $column.eq(0);
    }
    return $field.parent();
  };

  var updateTotals = function () {
    var totalAmount = baseAmount + ccFeeAmount + currentTipAmount;
    $("#tip_amount").val(formatMoney(currentTipAmount));
    $("#clover_net_amount").val(formatMoney(totalAmount));
    $("#admin_base_amount").text("$" + formatMoney(baseAmount));
    $("#admin_cc_fee_amount").text("$" + formatMoney(ccFeeAmount));
    $("#admin_cc_fee_percent").text(formatMoney(ccFeePercent));
    $("#admin_tip_amount").text("$" + formatMoney(currentTipAmount));
    $("#admin_total_amount, #admin_payment_submit_total").text("$" + formatMoney(totalAmount));
  };

  var isAdminFormReady = function () {
    var cardNumber = $("#clover_card_number").val();
    var ccv = $("#clover_ccv").val();
    var name = $.trim($("#clover_name_on_card").val() || "");
    var email = $.trim($("#clover_recipient_email").val() || "");
    var emailOk = true;
    if (email !== "") {
      emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    return (
      name !== "" &&
      passesLuhn(cardNumber) &&
      isExpiryValid() &&
      /^\d{3,4}$/.test(String(ccv || "").trim()) &&
      emailOk &&
      validateCustomTip(false)
    );
  };

  var passesLuhn = function (value) {
    var digits = getDigitsOnly(value);
    var sum = 0;
    var shouldDouble = false;
    var i;
    var digit;

    if (digits.length < 13 || digits.length > 19) {
      return false;
    }

    for (i = digits.length - 1; i >= 0; i--) {
      digit = parseInt(digits.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  };

  var isExpiryValid = function () {
    var month = parseInt($("#clover_expiry_month").val(), 10);
    var year = parseInt($("#clover_expiry_year").val(), 10);
    var currentMonth = new Date().getMonth() + 1;
    var currentYear = new Date().getFullYear();

    if (isNaN(month) || isNaN(year)) {
      return false;
    }

    if (month < 1 || month > 12 || year < currentYear || year > currentYear + 100) {
      return false;
    }

    return year > currentYear || (year === currentYear && month >= currentMonth);
  };

  var resetOtpIfTipChanged = function () {
    var roundedTip = parseFloat(formatMoney(currentTipAmount));
    if (roundedTip === 0) {
      currentOtpRequestToken = "";
      otpVerified = false;
      currentOtpTipAmount = 0;
      $("#otp_request_token").val("");
      $("#admin_otp_boxes .admin-otp-box").val("");
      $("#admin_tip_otp_error").text("");
      $("#admin_tip_otp_error_modal").text("");
      return;
    }

    if (currentOtpTipAmount > 0 && parseFloat(formatMoney(currentOtpTipAmount)) !== roundedTip) {
      currentOtpRequestToken = "";
      otpVerified = false;
      currentOtpTipAmount = 0;
      $("#otp_request_token").val("");
      $("#admin_otp_boxes .admin-otp-box").val("");
      $("#admin_tip_otp_error").text(texts.tipOtpRequired || "Tip verification is required before payment.");
      $("#admin_tip_otp_error_modal").text(texts.tipOtpRequired || "Tip verification is required before payment.");
    }
  };

  var getOtpCodeFromBoxes = function () {
    var code = "";
    $("#admin_otp_boxes .admin-otp-box").each(function () {
      code += getDigitsOnly($(this).val()).slice(0, 1);
    });
    return code;
  };

  var setOtpCodeToBoxes = function (code) {
    var digits = getDigitsOnly(code || "").split("");
    $("#admin_otp_boxes .admin-otp-box").each(function (idx) {
      $(this).val(digits[idx] || "");
    });
  };

  var setResendCooldown = function (seconds) {
    otpResendCooldownSeconds = Math.max(0, parseInt(seconds || 0, 10));
    if (otpResendCooldownTimer) {
      window.clearInterval(otpResendCooldownTimer);
      otpResendCooldownTimer = null;
    }

    var tick = function () {
      if (otpResendCooldownSeconds <= 0) {
        $("#admin_tip_otp_resend_timer").text("");
        updateOtpUi();
        return;
      }
      $("#admin_tip_otp_resend_timer").text("Resend in " + otpResendCooldownSeconds + "s");
      otpResendCooldownSeconds -= 1;
      $("#admin_tip_otp_send_btn").prop("disabled", true);
      $("#admin_tip_otp_send_btn").text("Resend OTP");
      if (otpResendCooldownSeconds <= 0) {
        $("#admin_tip_otp_resend_timer").text("");
        updateOtpUi();
        if (otpResendCooldownTimer) {
          window.clearInterval(otpResendCooldownTimer);
          otpResendCooldownTimer = null;
        }
      }
    };
    tick();
    if (otpResendCooldownSeconds > 0) {
      otpResendCooldownTimer = window.setInterval(tick, 1000);
    }
  };

  var openOtpModalIfNeeded = function (forceOpen) {
    var isCustomSelected = $('input[name="tip_choice"]:checked').val() === "custom";
    if ((forceOpen || !isCustomSelected) && currentTipAmount > 0 && !otpVerified) {
      $("#admin_tip_otp_modal").modal("show");
      return;
    }
    if (currentTipAmount <= 0 || otpVerified) {
      $("#admin_tip_otp_modal").modal("hide");
    }
  };

  var getNoTipOption = function () {
    var selected = null;
    $('input[name="tip_choice"]').each(function () {
      var rawValue = $(this).val();
      var parsed = parseFloat(rawValue);
      if (rawValue !== "custom" && !isNaN(parsed) && parsed === 0) {
        selected = {
          id: this.id,
          value: rawValue
        };
      }
    });
    if (selected) {
      return selected;
    }
    var first = $('input[name="tip_choice"]').first();
    return {
      id: first.attr("id"),
      value: first.val() || "0"
    };
  };

  var revertTipToNoTip = function () {
    var noTip = getNoTipOption();
    currentOtpRequestToken = "";
    otpVerified = false;
    currentOtpTipAmount = 0;
    $("#otp_request_token").val("");
    setOtpCodeToBoxes("");
    $("#admin_custom_tip_amount").val("");
    applyTipSelection(noTip.value, noTip.id, "");
    $("#admin_tip_otp_error").text("");
    $("#admin_tip_otp_error_modal").text("");
    showTipToast("Tip was reset to No Tip because OTP verification was cancelled.");
  };

  var showTipToast = function (message) {
    var $toast = $("#admin_tip_toast");
    if (!$toast.length) {
      return;
    }
    if (tipToastTimer) {
      window.clearTimeout(tipToastTimer);
      tipToastTimer = null;
    }
    $toast.text(message || "");
    $toast.addClass("active");
    tipToastTimer = window.setTimeout(function () {
      $toast.removeClass("active");
      tipToastTimer = null;
    }, 2600);
  };

  var updateOtpUi = function () {
    var statusText = texts.tipOtpStatusNotNeeded || "Not Needed";
    var statusClass = "label-default";
    var destinationParts = [];
    var tipRequiresOtp = currentTipAmount > 0;
    var otpReady = currentOtpMeta.delivery_tip_otp_ready === true || currentOtpMeta.delivery_tip_otp_ready === 1;

    if (currentOtpMeta.masked_delivery_email) {
      destinationParts.push(currentOtpMeta.masked_delivery_email);
    }
    if (currentOtpMeta.masked_delivery_phone) {
      destinationParts.push(currentOtpMeta.masked_delivery_phone);
    }

    if (!tipRequiresOtp) {
      statusText = texts.tipOtpStatusNotNeeded || "Not Needed";
      statusClass = "label-default";
      $("#admin_tip_otp_error").text("");
      $("#admin_tip_otp_error_modal").text("");
      $("#admin_tip_otp_resend_timer").text("");
      if (otpResendCooldownTimer) {
        window.clearInterval(otpResendCooldownTimer);
        otpResendCooldownTimer = null;
      }
      otpResendCooldownSeconds = 0;
    } else if (!otpReady) {
      statusText = texts.tipOtpStatusUnavailable || "Contact Missing";
      statusClass = "label-danger";
    } else if (otpVerified) {
      statusText = texts.tipOtpStatusVerified || "Verified";
      statusClass = "label-success";
    } else if (currentOtpRequestToken) {
      statusText = texts.tipOtpStatusSent || "Code Sent";
      statusClass = "label-info";
    } else {
      statusText = texts.tipOtpStatusRequired || "Required";
      statusClass = "label-warning";
    }

    $("#admin_tip_otp_destination").text(destinationParts.length ? destinationParts.join(" | ") : (texts.tipOtpContactsMissing || "--"));
    $("#admin_tip_otp_status_badge").removeClass("label-default label-danger label-success label-info label-warning").addClass(statusClass).text(statusText);
    $("#admin_tip_otp_send_btn")
      .prop("disabled", !tipRequiresOtp || !otpReady || paymentProcessing || otpVerified || otpResendCooldownSeconds > 0)
      .text(currentOtpRequestToken ? "Resend OTP" : "Send OTP");
    $("#admin_tip_otp_verify_btn").prop("disabled", !tipRequiresOtp || !otpReady || paymentProcessing || !currentOtpRequestToken || otpVerified);
    $("#admin_otp_boxes .admin-otp-box").prop("disabled", !tipRequiresOtp || !otpReady || paymentProcessing || !currentOtpRequestToken || otpVerified);
    $(".admin-otp-panel").toggleClass("disabled", !tipRequiresOtp);
    var isCustomSelected = $('input[name="tip_choice"]:checked').val() === "custom";
    $("#admin_custom_tip_verify_wrap").toggle(isCustomSelected && tipRequiresOtp && !otpVerified);
    $("#admin_tip_verify_inline").toggle(tipRequiresOtp);
    $("#admin_tip_open_modal_btn").prop("disabled", !tipRequiresOtp || !otpReady || otpVerified);
    if (!tipRequiresOtp) {
      $("#admin_tip_verify_inline_status").text("No verification needed");
    } else if (!otpReady) {
      $("#admin_tip_verify_inline_status").text("Contact missing for OTP");
    } else if (otpVerified) {
      $("#admin_tip_verify_inline_status").text("Tip is verified");
    } else if (currentOtpRequestToken) {
      $("#admin_tip_verify_inline_status").text("Code sent, verification pending");
    } else {
      $("#admin_tip_verify_inline_status").text("Verification required");
    }
  };

  var updateSubmitState = function () {
    var canSubmit = !paymentProcessing && (currentTipAmount <= 0 || otpVerified) && isAdminFormReady();
    $("#admin_payment_submit_btn").prop("disabled", !canSubmit);
  };

  var setSelectedTipOption = function (tipChoice, customTipValue) {
    $(".admin-tip-option").removeClass("active");
    $("#" + tipChoice).prop("checked", true);
    $('.admin-tip-option[data-radio="' + tipChoice + '"]').addClass("active");

    if ($("#" + tipChoice).val() === "custom") {
      $("#admin_custom_tip_wrap").show();
      $("#admin_custom_tip_amount").prop("disabled", false).val(customTipValue ? formatMoney(customTipValue) : "");
    } else {
      $("#admin_custom_tip_wrap").hide();
      $("#admin_custom_tip_amount").prop("disabled", true).val("");
      $("#admin_custom_tip_error").text("");
    }
  };

  var applyExistingTip = function (existingTipAmount) {
    var roundedTip = parseFloat(formatMoney(existingTipAmount || 0));
    var matchedRadioId = null;
    $('input[name="tip_choice"]').each(function () {
      var rawValue = $(this).val();
      if (rawValue !== "custom" && !isNaN(parseFloat(rawValue)) && parseFloat(formatMoney(rawValue)) === roundedTip) {
        matchedRadioId = this.id;
      }
    });

    if (roundedTip > 0 && !matchedRadioId) {
      matchedRadioId = "tip_choice_custom";
      if (!$("#" + matchedRadioId).length) {
        matchedRadioId = $('input[name="tip_choice"][value="custom"]').attr("id");
      }
      setSelectedTipOption(matchedRadioId, roundedTip);
      currentTipAmount = roundedTip;
    } else {
      matchedRadioId = matchedRadioId || $('input[name="tip_choice"]:checked').attr("id");
      setSelectedTipOption(matchedRadioId, 0);
      currentTipAmount = roundedTip > 0 ? roundedTip : parseFloat($('input[name="tip_choice"]:checked').val() || 0) || 0;
    }
  };

  var syncOtpMetaForCurrentTip = function (otpMeta) {
    currentOtpMeta = otpMeta || {};
    currentOtpRequestToken = "";
    otpVerified = false;
    currentOtpTipAmount = 0;

    if (!currentTipAmount || currentTipAmount <= 0) {
      $("#otp_request_token").val("");
      updateOtpUi();
      updateSubmitState();
      return;
    }

    if ((otpMeta.has_valid_tip_otp === true || otpMeta.has_valid_tip_otp === 1) && parseFloat(formatMoney(otpMeta.valid_tip_amount || 0)) === parseFloat(formatMoney(currentTipAmount))) {
      currentOtpRequestToken = String(otpMeta.otp_request_token || "");
      otpVerified = otpMeta.has_verified_tip_otp === true || otpMeta.has_verified_tip_otp === 1;
      currentOtpTipAmount = parseFloat(formatMoney(otpMeta.valid_tip_amount || 0));
    }

    $("#otp_request_token").val(currentOtpRequestToken);
    updateOtpUi();
    updateSubmitState();
  };

  var fillPaymentPage = function (data) {
    var existingTipAmount = 0;

    $("#clover_p_id").val(data.p_id || paymentId || 0);
    $("#clover_o_id").val(data.o_id || orderId || 0);
    $("#clover_o_total_amount").val(data.o_total_amount || 0);
    $("#cc_fees_value").val(data.cc_fees_value || 0);
    $("#o_total_amount_before_cc").val(data.o_total_amount_before_cc || 0);
    $("#cc_fees_of_user").val(data.cc_fees_perc || 0);
    $("#clover_notes").val(data.notes || "");
    $("#clover_recipient_email").val(data.bill_contact_email || "");
    $("#admin_pay_order_badge").text("Order #" + (data.o_id || orderId || "--"));
    if (!pageToken) {
      pageToken = $("#admin_page_token").val() || "";
    }

    baseAmount = parseFloat(data.o_total_amount_before_cc || 0);
    ccFeeAmount = parseFloat(data.cc_fees_value || 0);
    ccFeePercent = parseFloat(data.cc_fees_perc || 0);

    // Always start secure admin payment with No Tip selected.
    // This prevents stale unsubmitted tip/OTP state from a previous window.
    applyExistingTip(existingTipAmount);
    updateTotals();
    syncOtpMetaForCurrentTip({});

    $("#admin_payment_loading").hide();
    $("#admin_clover_payment_form").show();

    // Ensure no stale validator error classes are visible on initial render.
    var bv = $("#admin_clover_payment_form").data("bootstrapValidator");
    if (bv) {
      bv.resetForm(false);
    }
    $(".admin-field-error").text("").hide();
  };

  var loadPaymentDetails = function () {
    if (!orderId || !getOrderPaymentUrl) {
      showUnavailable(texts.secureUnavailable);
      return;
    }

    $.ajax({
      type: "POST",
      url: getOrderPaymentUrl,
      data: {
        o_id: orderId,
        p_id: paymentId || 0,
        mode: "charge"
      },
      headers: {
        "X-CSRF-TOKEN": config.csrfToken || ""
      },
      success: function (response) {
        if (!response || response.status !== true || !response.data) {
          showUnavailable((response && response.message) || texts.secureUnavailable);
          return;
        }
        fillPaymentPage(response.data || {});
      },
      error: function () {
        showUnavailable(texts.secureUnavailable);
      }
    });
  };

  var validateCustomTip = function () {
    var selectedChoice = $('input[name="tip_choice"]:checked').val();
    var customTipValue;

    $("#admin_custom_tip_error").text("");

    if (selectedChoice !== "custom") {
      return true;
    }

    customTipValue = parseFloat($("#admin_custom_tip_amount").val() || "");
    if (isNaN(customTipValue)) {
      $("#admin_custom_tip_error").text(texts.customRequired || "Enter a custom tip amount before submitting payment.");
      return false;
    }

    if (customTipValue <= 0) {
      $("#admin_custom_tip_error").text(texts.customPositive || "The custom tip amount must be greater than $0.00.");
      return false;
    }

    if (customTipValue < 1) {
      $("#admin_custom_tip_error").text(texts.customMin || "The custom tip amount must be at least $1.00.");
      return false;
    }

    if (customTipValue > parseFloat(config.tipCustomMax || 100000)) {
      $("#admin_custom_tip_error").text("The tip amount must not exceed $" + formatMoney(config.tipCustomMax || 100000) + ".");
      return false;
    }

    return true;
  };

  var validatePaymentFields = function () {
    var valid = true;
    var cardNumber = $("#clover_card_number").val();
    var ccv = $("#clover_ccv").val();

    clearFieldError("clover_name_on_card");
    clearFieldError("clover_card_number");
    clearFieldError("clover_expiry_month");
    clearFieldError("clover_expiry_year");
    clearFieldError("clover_ccv");

    if ($.trim($("#clover_name_on_card").val()) === "") {
      setFieldError("clover_name_on_card", "The name on card is required.");
      valid = false;
    }

    if (!passesLuhn(cardNumber)) {
      setFieldError("clover_card_number", "The credit card number is not valid.");
      valid = false;
    }

    if (!$("#clover_expiry_month").val()) {
      setFieldError("clover_expiry_month", "The expiration month is required.");
      valid = false;
    }

    if (!$("#clover_expiry_year").val()) {
      setFieldError("clover_expiry_year", "The expiration year is required.");
      valid = false;
    } else if (!isExpiryValid()) {
      setFieldError("clover_expiry_year", "Please choose a valid future expiration date.");
      valid = false;
    }

    if (!/^\d{3,4}$/.test($.trim(ccv))) {
      setFieldError("clover_ccv", "The CVV must be 3 or 4 digits.");
      valid = false;
    }

    return valid;
  };

  var setProcessingState = function (isProcessing) {
    paymentProcessing = !!isProcessing;
    $("#admin_pay_progress_wrap").toggleClass("active", !!isProcessing);
    updateOtpUi();
    updateSubmitState();
  };

  var renderCloseCountdown = function (message, seconds) {
    var notice = message + " Closing this window in " + seconds + " second" + (seconds === 1 ? "" : "s") + "...";
    alert(notice);
  };

  var finishPaymentSuccess = function (message) {
    var successMessage = message || texts.secureSuccess || "Payment processed successfully.";
    var remainingSeconds = 3;

    if (closeCountdownTimer) {
      clearInterval(closeCountdownTimer);
      closeCountdownTimer = null;
    }

    try {
      if (window.opener && !window.opener.closed && window.opener.location) {
        window.opener.location.reload();
      }
    } catch (e) {}

    renderCloseCountdown(successMessage, remainingSeconds);
    closeCountdownTimer = setInterval(function () {
      remainingSeconds -= 1;
      if (remainingSeconds <= 0) {
        clearInterval(closeCountdownTimer);
        closeCountdownTimer = null;
        window.close();
        return;
      }
    }, 1000);
  };

  var submitPayment = function () {
    if (paymentProcessing) {
      return;
    }

    if (!validateCustomTip()) {
      return;
    }

    var bv = $("#admin_clover_payment_form").data("bootstrapValidator");
    if (bv) {
      bv.validate();
      if (!bv.isValid()) {
        updateSubmitState();
        return;
      }
    } else if (!validatePaymentFields()) {
      return;
    }
    if (!pageToken) {
      $("#admin_tip_otp_error").text("Secure payment session expired. Please reopen the payment page.");
      return;
    }

    if (currentTipAmount > 0 && !otpVerified) {
      $("#admin_tip_otp_error").text(texts.tipOtpRequired || "Tip verification is required before payment.");
      $("#admin_tip_otp_error_modal").text(texts.tipOtpRequired || "Tip verification is required before payment.");
      openOtpModalIfNeeded();
      return;
    }

    setProcessingState(true);

    $.ajax({
      type: "POST",
      url: config.cloverPayUrl,
      data: $("#admin_clover_payment_form").serialize() + "&screen_name=" + encodeURIComponent(config.screenName || "[Admin Secure Clover Payment]"),
      headers: {
        "X-CSRF-TOKEN": config.csrfToken || ""
      },
      success: function (response) {
        setProcessingState(false);
        if (response && response.status === true) {
          finishPaymentSuccess(response.message);
          return;
        }

        $("#admin_tip_otp_error").text((response && response.message) || texts.secureUnavailable);
      },
      error: function (xhr) {
        setProcessingState(false);
        var responseJson = (xhr && xhr.responseJSON) ? xhr.responseJSON : null;
        $("#admin_tip_otp_error").text((responseJson && responseJson.message) || texts.secureUnavailable);
      }
    });
  };

  var postOtpRequest = function (url, payload, successHandler) {
    if (!pageToken) {
      $("#admin_tip_otp_error").text("Secure payment session expired. Please reopen the payment page.");
      return;
    }
    payload.admin_page_token = pageToken;
    $.ajax({
      type: "POST",
      url: url,
      data: payload,
      headers: {
        "X-CSRF-TOKEN": config.csrfToken || ""
      },
      success: function (response) {
        if (!response || response.status !== true) {
          var msg = (response && response.message) || texts.tipOtpVerifyFailed || "Unable to verify the tip code.";
          $("#admin_tip_otp_error").text(msg);
          $("#admin_tip_otp_error_modal").text(msg);
          return;
        }

        if ($.isFunction(successHandler)) {
          successHandler(response);
        }

        $("#admin_tip_otp_error").text(response.message || "");
        $("#admin_tip_otp_error_modal").text(response.message || "");
      },
      error: function (xhr) {
        var responseJson = (xhr && xhr.responseJSON) ? xhr.responseJSON : null;
        var errorMsg = (responseJson && responseJson.message) || texts.tipOtpVerifyFailed || "Unable to verify the tip code.";
        $("#admin_tip_otp_error").text(errorMsg);
        $("#admin_tip_otp_error_modal").text(errorMsg);
      }
    });
  };

  var formatRemainingTimer = function (secondsLeft) {
    var minutes = Math.floor(secondsLeft / 60);
    var seconds = secondsLeft % 60;
    return (minutes < 10 ? "0" + minutes : String(minutes)) + ":" + (seconds < 10 ? "0" + seconds : String(seconds));
  };

  var stopSession = function (message) {
    if (pageSessionTimer) {
      window.clearInterval(pageSessionTimer);
      pageSessionTimer = null;
    }
    setProcessingState(true);
    $("#admin_tip_otp_error").text(message || "This secure payment page has expired. Please reopen it.");
    $("#admin_payment_submit_btn").prop("disabled", true);
    $("#admin_session_timer").text("00:00");
  };

  var showSessionExpiredAndClose = function (message) {
    var remaining = 3;
    stopSession(message || texts.sessionExpiredTitle || "This secure payment page has expired.");
    $("#admin_session_expired_message").text(message || texts.sessionExpiredTitle || "This secure payment page has expired.");
    $("#admin_session_close_countdown").text(String(remaining));
    $("#admin_session_expired_modal").modal({
      backdrop: "static",
      keyboard: false
    });
    $("#admin_session_expired_modal").modal("show");

    if (sessionCloseTimer) {
      window.clearInterval(sessionCloseTimer);
      sessionCloseTimer = null;
    }
    sessionCloseTimer = window.setInterval(function () {
      remaining -= 1;
      if (remaining <= 0) {
        window.clearInterval(sessionCloseTimer);
        sessionCloseTimer = null;
        window.close();
        return;
      }
      $("#admin_session_close_countdown").text(String(remaining));
    }, 1000);
  };

  var startSessionCountdown = function () {
    var now = Math.floor(Date.now() / 1000);
    if (pageExpiresAt && !isNaN(pageExpiresAt)) {
      if (pageExpiresAt > 1000000000000) {
        pageExpiresAt = Math.floor(pageExpiresAt / 1000);
      }
      countdownRemainingSeconds = Math.max(0, pageExpiresAt - now);
    } else {
      countdownRemainingSeconds = 600;
    }

    var tick = function () {
      if (countdownRemainingSeconds <= 0) {
        showSessionExpiredAndClose("This secure payment page has expired.");
        return;
      }
      $("#admin_session_timer").text(formatRemainingTimer(countdownRemainingSeconds));
      countdownRemainingSeconds -= 1;
    };
    tick();
    if (pageSessionTimer) {
      window.clearInterval(pageSessionTimer);
      pageSessionTimer = null;
    }
    pageSessionTimer = window.setInterval(tick, 1000);
  };

  var promptTipChange = function (pendingData, onConfirm, onCancel) {
    tipChangeState = {
      pendingData: pendingData,
      onConfirm: onConfirm,
      onCancel: onCancel
    };
    tipChangeModalActionHandled = false;
    $("#admin_tip_change_confirm_modal .modal-body").text(texts.tipChangeConfirm || "Changing tip amount requires OTP verification again. Do you want to continue?");
    $("#admin_tip_change_confirm_modal").modal("show");
  };

  var applyTipSelection = function (tipValue, radioId, customValue) {
    $(".admin-tip-option").removeClass("active");
    $('.admin-tip-option[data-radio="' + radioId + '"]').addClass("active");
    $("#" + radioId).prop("checked", true);

    if (tipValue === "custom") {
      $("#admin_custom_tip_wrap").show();
      $("#admin_custom_tip_amount").prop("disabled", false).val(customValue || "").focus();
      currentTipAmount = parseFloat($("#admin_custom_tip_amount").val() || 0) || 0;
    } else {
      $("#admin_custom_tip_wrap").hide();
      $("#admin_custom_tip_amount").prop("disabled", true).val("");
      $("#admin_custom_tip_error").text("");
      currentTipAmount = parseFloat(tipValue || 0) || 0;
    }

    updateTotals();
    resetOtpIfTipChanged();
    updateOtpUi();
    updateSubmitState();
    openOtpModalIfNeeded(false);
  };

  var bindEvents = function () {
    $("#admin_payment_close_btn, #admin_payment_close_unavailable").on("click", function () {
      window.close();
    });

    $(".admin-tip-option").on("click", function () {
      var tipValue = $(this).data("tip");
      var radioId = $(this).data("radio");
      var previousTip = parseFloat(formatMoney(currentTipAmount || 0));
      var nextTip = tipValue === "custom"
        ? (parseFloat($("#admin_custom_tip_amount").val() || 0) || 0)
        : (parseFloat(tipValue || 0) || 0);

      if (previousTip > 0 && parseFloat(formatMoney(nextTip)) !== previousTip) {
        promptTipChange(
          { tipValue: tipValue, radioId: radioId, customValue: tipValue === "custom" ? formatMoney(nextTip) : "" },
          function () { applyTipSelection(tipValue, radioId, tipValue === "custom" ? formatMoney(nextTip) : ""); },
          function () {}
        );
        return;
      }

      applyTipSelection(tipValue, radioId, tipValue === "custom" ? formatMoney(nextTip) : "");
    });

    $("#admin_custom_tip_amount").on("change", function () {
      var previousTip = parseFloat(formatMoney(currentTipAmount || 0));
      var nextTip = parseFloat($(this).val() || 0) || 0;
      if (previousTip > 0 && parseFloat(formatMoney(nextTip)) !== previousTip) {
        var previousValue = previousTip;
        var entered = $(this).val();
        var self = $(this);
        promptTipChange(
          { customValue: entered },
          function () {
            currentTipAmount = parseFloat(entered || 0) || 0;
            validateCustomTip();
            updateTotals();
            resetOtpIfTipChanged();
            updateOtpUi();
            updateSubmitState();
            openOtpModalIfNeeded(false);
          },
          function () {
            self.val(formatMoney(previousValue));
          }
        );
        return;
      }
      currentTipAmount = nextTip;
      validateCustomTip();
      updateTotals();
      resetOtpIfTipChanged();
      updateOtpUi();
      updateSubmitState();
    });

    $("#admin_tip_otp_send_btn").on("click", function () {
      if (currentTipAmount <= 0) {
        $("#admin_tip_otp_error_modal").text(texts.tipOtpRequired || "Tip verification is required before payment.");
        return;
      }

      postOtpRequest(currentOtpRequestToken ? config.tipOtpResendUrl : config.tipOtpSendUrl, {
        o_id: orderId,
        tip_amount: formatMoney(currentTipAmount),
        otp_request_token: currentOtpRequestToken || "",
        secure_window: 1
      }, function (response) {
        currentOtpRequestToken = (response.data && response.data.otp_request_token) ? String(response.data.otp_request_token) : currentOtpRequestToken;
        currentOtpTipAmount = parseFloat(formatMoney(currentTipAmount));
        otpVerified = false;
        $("#otp_request_token").val(currentOtpRequestToken);
        setOtpCodeToBoxes("");
        $("#admin_otp_boxes .admin-otp-box").first().focus();
        $("#admin_tip_otp_error_modal").text(response.message || "");
        setResendCooldown(30);
        updateOtpUi();
        updateSubmitState();
      });
    });

    $("#admin_tip_otp_verify_btn").on("click", function () {
      var otpCode = getOtpCodeFromBoxes();
      if (otpCode.length !== 6) {
        $("#admin_tip_otp_error_modal").text("Please enter 6-digit OTP.");
        return;
      }
      postOtpRequest(config.tipOtpVerifyUrl, {
        o_id: orderId,
        tip_amount: formatMoney(currentTipAmount),
        otp_request_token: currentOtpRequestToken,
        tip_otp: otpCode,
        secure_window: 1
      }, function () {
        otpVerified = true;
        currentOtpTipAmount = parseFloat(formatMoney(currentTipAmount));
        $("#admin_tip_otp_error").text("");
        $("#admin_tip_otp_error_modal").text("");
        $("#admin_tip_otp_modal").modal("hide");
        updateOtpUi();
        updateSubmitState();
      });
    });

    $("#admin_otp_boxes .admin-otp-box").on("input", function () {
      var $boxes = $("#admin_otp_boxes .admin-otp-box");
      var idx = parseInt($(this).attr("data-otp-index"), 10);
      var val = getDigitsOnly($(this).val()).slice(0, 1);
      $(this).val(val);
      if (val && idx < $boxes.length - 1) {
        $boxes.eq(idx + 1).focus();
      }
    });

    $("#admin_otp_boxes .admin-otp-box").on("keydown", function (event) {
      var $boxes = $("#admin_otp_boxes .admin-otp-box");
      var idx = parseInt($(this).attr("data-otp-index"), 10);
      if ((event.key === "Backspace" || event.keyCode === 8) && !$(this).val() && idx > 0) {
        $boxes.eq(idx - 1).focus();
      }
    });

    $("#admin_otp_boxes .admin-otp-box").on("paste", function (event) {
      var clipboardData = event.originalEvent && event.originalEvent.clipboardData ? event.originalEvent.clipboardData.getData("text") : "";
      var digits = getDigitsOnly(clipboardData).slice(0, 6);
      if (!digits) {
        return;
      }
      event.preventDefault();
      setOtpCodeToBoxes(digits);
      $("#admin_otp_boxes .admin-otp-box").eq(Math.min(digits.length, 6) - 1).focus();
    });

    if ($.isFunction($.fn.bootstrapValidator)) {
      $("#admin_clover_payment_form")
        .bootstrapValidator({
          excluded: ":disabled",
          live: "disabled",
          container: function ($field) {
            return getValidatorMessageContainer($field);
          },
          message: "This value is not valid",
          feedbackIcons: {
            valid: "glyphicon glyphicon-ok",
            invalid: "glyphicon glyphicon-remove",
            validating: "glyphicon glyphicon-refresh"
          },
          fields: {
            clover_name_on_card: {
              validators: {
                notEmpty: { message: "The name on card is required and can't be empty" }
              }
            },
            clover_card_number: {
              validators: {
                notEmpty: { message: "The credit card number is required and can't be empty" },
                creditCard: { message: "The credit card number is not valid" }
              }
            },
            clover_expiry_month: {
              validators: {
                notEmpty: { message: "The expiration month is required and can't be empty" },
                digits: { message: "The expiration month can contain digits only" }
              }
            },
            clover_expiry_year: {
              validators: {
                notEmpty: { message: "The year is required and can't be empty" },
                digits: { message: "The expiration year can contain digits only" },
                callback: {
                  message: "Please check your credit card's expiration date.",
                  callback: function (value, validator) {
                    if (value === "") { return true; }
                    value = parseInt(value, 10);
                    var month = validator.getFieldElements("clover_expiry_month").val();
                    var currentMonth = new Date().getMonth() + 1;
                    var currentYear = new Date().getFullYear();
                    if (value < currentYear || value > currentYear + 100) { return false; }
                    if (month === "") { return true; }
                    month = parseInt(month, 10);
                    if (value > currentYear || (value === currentYear && month > currentMonth)) {
                      return true;
                    }
                    return false;
                  }
                }
              }
            },
            clover_ccv: {
              validators: {
                notEmpty: { message: "The CVV is required and can't be empty" },
                digits: { message: "The CVV can contain digits only" },
                stringLength: { min: 3, max: 4, message: "The CVV must be 3 or 4 characters long" }
              }
            },
            clover_recipient_email: {
              validators: {
                emailAddress: { message: "Please enter a valid email address." }
              }
            }
          }
        })
        .on("success.form.bv", function (e) {
          e.preventDefault();
          submitPayment();
        })
        .on("status.field.bv", function () {
          updateSubmitState();
        });
    }

    $("#clover_card_number, #clover_ccv").on("input paste", function () {
      var fieldName = this.name;
      var bv = $("#admin_clover_payment_form").data("bootstrapValidator");
      if (bv) {
        bv.updateStatus(fieldName, "NOT_VALIDATED");
      }
      setTimeout(function () {
        updateSubmitState();
      }, 0);
    });

    $("#clover_card_number, #clover_ccv").on("blur", function () {
      var bv = $("#admin_clover_payment_form").data("bootstrapValidator");
      if (bv) {
        bv.revalidateField(this.name);
      }
      updateSubmitState();
    });

    $("#clover_expiry_month, #clover_expiry_year").on("change", function () {
      var bv = $("#admin_clover_payment_form").data("bootstrapValidator");
      var changedFieldName = this.name;
      var otherFieldName = changedFieldName === "clover_expiry_month" ? "clover_expiry_year" : "clover_expiry_month";
      var changedValue = $.trim($("#" + this.id).val());
      var otherValue = $.trim($('[name="' + otherFieldName + '"]').val());
      if (bv) {
        bv.updateStatus(changedFieldName, "NOT_VALIDATED");
        bv.revalidateField(changedFieldName);
        if (changedValue !== "" && otherValue !== "") {
          bv.updateStatus(otherFieldName, "NOT_VALIDATED");
          bv.revalidateField(otherFieldName);
        } else if (otherValue === "") {
          bv.updateStatus(otherFieldName, "NOT_VALIDATED");
        }
      }
      updateSubmitState();
    });

    $("#admin_clover_payment_form").on("submit", function (e) {
      var $form = $(this);
      var bv = $form.data("bootstrapValidator");
      if (bv) {
        bv.validate();
        if (!bv.isValid()) {
          updateSubmitState();
          e.preventDefault();
          return;
        }
      }
      e.preventDefault();
      submitPayment();
    });

    $("#admin_custom_tip_verify_btn").on("click", function () {
      openOtpModalIfNeeded(true);
    });

    $("#admin_tip_open_modal_btn").on("click", function () {
      openOtpModalIfNeeded(true);
    });

    $("#admin_tip_otp_modal").on("shown.bs.modal", function () {
      if (currentOtpRequestToken) {
        $("#admin_otp_boxes .admin-otp-box").first().focus();
      }
    });

    $("#admin_tip_otp_modal").on("hidden.bs.modal", function () {
      if (currentTipAmount > 0 && !otpVerified) {
        revertTipToNoTip();
      }
    });

    $(document).on("contextmenu", function (event) {
      event.preventDefault();
    });

    // $(document).on("keydown", function (event) {
    //   var keyCode = event.keyCode || event.which;

    //   if (keyCode === 123) {
    //     event.preventDefault();
    //     return false;
    //   }

    //   if (event.ctrlKey && event.shiftKey && (
    //     keyCode === "I".charCodeAt(0) ||
    //     keyCode === "J".charCodeAt(0) ||
    //     keyCode === "C".charCodeAt(0) ||
    //     keyCode === "K".charCodeAt(0)
    //   )) {
    //     event.preventDefault();
    //     return false;
    //   }

    //   if (event.metaKey && event.altKey && keyCode === "I".charCodeAt(0)) {
    //     event.preventDefault();
    //     return false;
    //   }

    //   if (event.ctrlKey && keyCode === "U".charCodeAt(0)) {
    //     event.preventDefault();
    //     return false;
    //   }

    //   return true;
    // });

    $("#admin_tip_change_confirm_btn").on("click", function () {
      tipChangeModalActionHandled = true;
      $("#admin_tip_change_confirm_modal").modal("hide");
      if (tipChangeState && $.isFunction(tipChangeState.onConfirm)) {
        tipChangeState.onConfirm(tipChangeState.pendingData || {});
      }
      tipChangeState = null;
    });

    $("#admin_tip_change_cancel_btn").on("click", function () {
      tipChangeModalActionHandled = true;
      if (tipChangeState && $.isFunction(tipChangeState.onCancel)) {
        tipChangeState.onCancel(tipChangeState.pendingData || {});
      }
      tipChangeState = null;
    });

    $("#admin_tip_change_confirm_modal").on("hidden.bs.modal", function () {
      if (!tipChangeModalActionHandled && tipChangeState && $.isFunction(tipChangeState.onCancel)) {
        tipChangeState.onCancel(tipChangeState.pendingData || {});
      }
      tipChangeState = null;
      tipChangeModalActionHandled = false;
    });

    $("#clover_name_on_card").on("input blur", function (event) {
      var bv = $("#admin_clover_payment_form").data("bootstrapValidator");
      if (bv) {
        bv.updateStatus(this.name, "NOT_VALIDATED");
        if (this.value.trim() !== "" || (event && event.type === "blur")) {
          bv.revalidateField(this.name);
        }
      }
      updateSubmitState();
    });
    $("#clover_recipient_email").on("input blur", function (event) {
      var bv = $("#admin_clover_payment_form").data("bootstrapValidator");
      if (bv) {
        bv.updateStatus(this.name, "NOT_VALIDATED");
        if ($.trim($(this).val()) !== "" || (event && event.type === "blur")) {
          bv.revalidateField(this.name);
        }
      }
      setFieldError("clover_recipient_email", "");
      updateSubmitState();
    });
  };

  $(function () {
    $(".admin-field-error").hide();
    bindEvents();
    loadPaymentDetails();
    startSessionCountdown();
  });
}(jQuery, window, document));
