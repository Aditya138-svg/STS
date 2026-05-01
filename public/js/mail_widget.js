$(document).ready(function(){

    // $(document).on('click','.mail_widget',function(e){
    //     var parent_div = $(e.target).parent().parent('.add_cc_bcc');
    //     $(parent_div).hide();
    //     var multiple_btns_html = '<div class="send_more_buttons">';
    //     multiple_btns_html +=       '<small style="float: right;">';
    //     multiple_btns_html +=           '<span class="label label-default cc_toggle" style="cursor:pointer;">CC</span>';
    //     multiple_btns_html +=           '<span class="label label-default bcc_toggle" style="cursor:pointer;">BCC</span>'
    //     multiple_btns_html +=       '</small>';
    //     multiple_btns_html +=    '</div>';
    //     var html_div = $(parent_div).parent();
    //     $(html_div).append(multiple_btns_html);
    // });

    $(document).on('click','.cc_toggle',function(e){
        var body_div = $(e.target).closest('.modal-body');
        if($('.multiple_cc').is(':visible')){
            $(this).addClass('label-default');
            $(this).removeClass('label-success');
            var has_cc = $(body_div).find('.multiple_cc');
            if(has_cc.length > 0){
                $(has_cc).remove();
            }
        }else{
            $(this).removeClass('label-default');
            $(this).addClass('label-success');
            var cc_input = '<span class="multiple_cc form-group">';
            cc_input +=         '<label for="recipient_email_cc">Add CC</label>';
            cc_input +=         '<select name="recipient_email_cc" id="recipient_email_cc" multiple style="width:100%"></select>';
            cc_input +=         '<p class="help-block" id="cc_msg"></p>'
            cc_input +=     '</span>';
            $(body_div).append(cc_input);

            $('#recipient_email_cc').select2({
                tags: true,
                tokenSeparators: [',',' ']
            });
        }
    });
    $(document).on('click','.bcc_toggle',function(e){
        var body_div = $(e.target).closest('.modal-body');
        if($('.multiple_bcc').is(':visible')){
            $(this).addClass('label-default');
            $(this).removeClass('label-success');
            var has_cc = $(body_div).find('.multiple_bcc');
            if(has_cc.length > 0){
                $(has_cc).remove();
            }
        }else{
            $(this).removeClass('label-default');
            $(this).addClass('label-success');
            var cc_input = '<span class="multiple_bcc form-group">';
            cc_input +=         '<label for="recipient_email_bcc">Add BCC</label>';
            cc_input +=         '<select name="recipient_email_bcc" id="recipient_email_bcc" multiple style="width:100%"></select>';
            cc_input +=         '<p class="help-block" id="bcc_msg"></p>'
            cc_input +=     '</span>';
            $(body_div).append(cc_input);

            $('#recipient_email_bcc').select2({
                tags: true,
                tokenSeparators: [',',' ']
            });
        }
    });

});