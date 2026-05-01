function ps_notify(msg, type) {
    if ($('.ps-notify-cont').length === 0) {
        $('body').append('<div class="ps-notify-cont"></div>');
    }
    var fade_speed = 500;
    var remove_after = 3000;
    var noti_id = '_' + Math.random().toString(36).substr(2, 9);
    var noti = '<div style="display: none;" id=ps-noti-' + noti_id + ' class="ps-notify-alert ' + type + '"><span class="ps-notify-close">&times;</span>' + msg + '</div>';
    $('.ps-notify-cont').append(noti);
    $("#ps-noti-" + noti_id).fadeIn(fade_speed, function() {
        var timer = new Timer(function() {
            $("#ps-noti-" + noti_id).fadeOut(fade_speed, function() {
                $(this).remove();
            });
        }, remove_after);
        $("#ps-noti-" + noti_id)[0].timer = timer;
        $("#ps-noti-" + noti_id).hover(function() {
            $(this)[0].timer.pause();
        }, function() {
            $(this)[0].timer.resume();
        });
        $("#ps-noti-" + noti_id).click(function() {
            window.clearTimeout($(this)[0].timer);
            $(this).fadeOut(fade_speed, function() {
                $(this).remove();
            });
        });
    });
}

function Timer(callback, delay) {
    var timerId, start, remaining = delay;
    this.pause = function() {
        window.clearTimeout(timerId);
        remaining -= Date.now() - start;
    };
    this.resume = function() {
        start = Date.now();
        window.clearTimeout(timerId);
        timerId = window.setTimeout(callback, remaining);
    };
    this.resume();
}