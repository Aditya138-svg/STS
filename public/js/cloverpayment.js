(function ($) {
  $(document).ready(function () {
    var routes = window.cloverRoutes || {};
    var getOrderPaymentUrl = routes.getOrderPayment || "";
    var orderRouteUrl = routes.orderRoute || "";
    var paymentPageLinkUrl = routes.paymentPageLinkUrl || "";
    var paymentIdValue = routes.paymentId || "";
    var encOrderIdValue = routes.encOrderId || "";
    var encUserIdValue = routes.encUserId || "";
    var orderId = routes.orderId || "";
    var userId = routes.userId || "";
      var popupBlockedText = routes.popupBlockedText || "Allow pop-ups to open the secure payment window.";
    var activePaymentWindow = null;
    var paymentWindowWatcher = null;

    var watchPaymentWindowClose = function (childWindow) {
      activePaymentWindow = childWindow || null;

      if (paymentWindowWatcher) {
        window.clearInterval(paymentWindowWatcher);
        paymentWindowWatcher = null;
      }

      if (!activePaymentWindow) {
        return;
      }

      paymentWindowWatcher = window.setInterval(function () {
        if (!activePaymentWindow) {
          window.clearInterval(paymentWindowWatcher);
          paymentWindowWatcher = null;
          return;
        }

        try {
          if (activePaymentWindow.closed) {
            window.clearInterval(paymentWindowWatcher);
            paymentWindowWatcher = null;
            activePaymentWindow = null;
            window.location.reload();
          }
        } catch (e) {}
      }, 800);
    };

    var openSecurePaymentWindow = function (orderPaymentData) {
      if (!paymentPageLinkUrl || !orderPaymentData) {
        return;
      }

      $.ajax({
        type: "POST",
        url: paymentPageLinkUrl,
        data: {
          o_id: orderPaymentData.o_id || 0,
          p_id: orderPaymentData.p_id || 0
        },
        headers: {
          "X-CSRF-TOKEN": $('input[name="_token"]').val()
        },
        success: function (response) {
          var secureUrl = response && response.data ? response.data.url : "";
          if (!response || response.status !== true || !secureUrl) {
            if (typeof window.showFlashModal === "function") {
              window.showFlashModal(false, (response && response.message) || popupBlockedText);
            } else {
              window.alert((response && response.message) || popupBlockedText);
            }
            return;
          }

          try {
            if (activePaymentWindow && !activePaymentWindow.closed) {
              activePaymentWindow.location.href = secureUrl;
              activePaymentWindow.focus();
              watchPaymentWindowClose(activePaymentWindow);
              return;
            }
          } catch (e) {
            activePaymentWindow = null;
          }

          var childWindow = null;
          var popupFeatures = "popup=yes,width=1280,height=880,top=60,left=80,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes";
          try {
            childWindow = window.open(secureUrl, "admin_secure_clover_payment_" + Date.now(), popupFeatures);
          } catch (e) {
            childWindow = null;
          }

          if (!childWindow) {
            if (typeof window.showFlashModal === "function") {
              window.showFlashModal(false, popupBlockedText);
            } else {
              window.alert(popupBlockedText);
            }
            return;
          }

          try {
            childWindow.focus();
          } catch (e) {}

          watchPaymentWindowClose(childWindow);
        }
      });
    };

    $(document).on("click", ".clover_payment", function () {
      var cloverPId = $(this).attr("data-p-id");
      var cloverOId = $(this).attr("data-o-id");
      var $button = $(this);
      $button.prop("disabled", true);

      $.ajax({
        type: "POST",
        url: getOrderPaymentUrl,
        data: {
          p_id: cloverPId,
          o_id: cloverOId,
          mode: "charge"
        },
        headers: {
          "X-CSRF-TOKEN": $('input[name="_token"]').val()
        },
        success: function (result) {
          $button.prop("disabled", false);
          if (result.status === true) {
            openSecurePaymentWindow(result.data || { o_id: cloverOId, p_id: cloverPId });
            return;
          }

          if (result && result.data && result.data.already_paid) {
            if (typeof window.showFlashModal === "function") {
              window.showFlashModal(false, result.message || "Payment has already been taken for this order.");
            } else {
              window.alert(result.message || "Payment has already been taken for this order.");
            }
            return;
          }

          if (document.URL === orderRouteUrl + "/" + cloverOId) {
            var payId = paymentIdValue;
            $("#audit_modal_info").html(result.message);
            $("#continue_audit").attr("data-p-id", payId);
            $("#continue_audit").attr("data-o-id", orderId);
            $("#continue_audit").attr("data-u-id", userId);
            $("#continue_audit").attr("data-p-id-en", payId === 0 ? paymentIdValue : paymentIdValue);
            $("#continue_audit").attr("data-o-id-en", encOrderIdValue);
            $("#continue_audit").attr("data-u-id-en", encUserIdValue);
            $("#after_audit_to").val("clover_payment");
            $("#audit_right_now").modal("show");
          } else if (typeof window.showFlashModal === "function") {
            window.showFlashModal(result.status, result.message);
          }
        },
        error: function (data) {
          $button.prop("disabled", false);
          var parseError = JSON.parse(data.responseText || "{}");
          if (typeof parseError.error !== "undefined" && parseError.error === "Unauthenticated.") {
            if (typeof window.showFlashModal === "function") {
              window.showFlashModal(false, "Your session has expired. Please login again.");
            }
            $(".close, .modal").click(function () {
              window.location.reload();
            });
          }
        }
      });
    });
  });
})(jQuery);
