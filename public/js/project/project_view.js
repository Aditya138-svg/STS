$(document).ready(function () {
    // 1) FETH DATA 
    const table = $('#projects_table').DataTable({
        processing: true,
        serverSide: true,
        ajax: window.LS.routes.projectsList ,
        columns: [
            { data: 0 },
            { data: 1 },
            { data: 2 },
            { data: 3 },
            { data: 4 },
            { data: 5 },
            { data: 6 },
            { data: 7 },
            { data: 8 },
            { data: 9 },
            { data: 10 },
            { data: 11 },
            { data: 12 },
            { data: 13, orderable: false, searchable: false }
        ],
        order: [[0, 'asc']],
        // Enables horizontal scrolling
        scrollX: true,          

    });

    // 2) FETCH SINGLE PROJECT ITEMS 
    $('#projects_table').on('click', '.btn-view', function () {
        const rowData = table.row($(this).closest('tr')).data();
        const projectId = rowData[0];

        // Create a hidden form dynamically
        const form = $('<form>', {
            method: 'POST',
            action: window.LS.routes.projectItemsShow
        });

        // CSRF token
        form.append($('<input>', { type: 'hidden', name: '_token', value: window.LS.csrfToken }));
        form.append($('<input>', { type: 'hidden', name: 'project_id', value: projectId }));

        // Append to body and submit
        $('body').append(form);
        form.submit();
    });


    // Open modal
    $('#btn_import_project').click(function () {
        $('#import_projects_modal').modal('show');
        $('#import_file_to_upload').val('');
        $('#import_users_id').val(null).trigger('change');
        $('.upload_files_error').hide();
        $('#import_users_id_err_msg').html('');
        $('#import_file_to_upload_err_msg').html('');
    });

    // Initialize Select2 for customer dropdown
    $('#import_users_id').select2({
        ajax: {
            url: window.LS.routes.getUserListSelect2,
            dataType: 'json',
            data: function (params) {
                return {
                    u_roles: [window.LS.constants.roles.corporate, window.LS.constants.roles.nonCorporate],
                    u_with_roles: true,
                    term: params.term || '',
                    page: params.page || 1
                };
            },
            processResults: function (data, params) {
                params.page = params.page || 1;
                return {
                    results: data.results,
                    pagination: { more: (params.page * 10) < data.total_count }
                };
            },
            cache: true
        },
        placeholder: '--Choose Customer--',
        width: '100%',
        allowClear: true
    }).on('open', function () {
        $(".select2-search__field").focus();
    });

    // AJAX submit (Unchanged)
    $('#btn_import_file').click(function () {
        $(".err_msg").html('');
        $(".upload_files_error").html('').hide();

        var userId = $('#import_users_id').val();
        var file = $('#import_file_to_upload')[0].files[0];

        if (!userId) {
            $('#import_users_id_err_msg').html('Please choose a customer.');
            return;
        }
        if (!file) {
            $('#import_file_to_upload_err_msg').html('Please choose a file to upload.');
            return;
        }

        var formData = new FormData();
        formData.append('_token', window.LS.csrfToken);
        formData.append('import_users_id', userId);
        formData.append('import_file_to_upload', file);

        var $btn = $(this);
        var loadingText = '<i class="fa fa-spinner fa-spin"></i> Uploading...';
        $btn.data('original-text', $btn.html()).html(loadingText).prop('disabled', true);

        $.ajax({
            url: window.LS.routes.projectsImportPost,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                $btn.html($btn.data('original-text')).prop('disabled', false);
                if (response.status) {
                    // Close modal
                    $('#import_projects_modal').modal('hide');
                    // Show success flash
                    showFlashModal(true, "File uploaded successfully!");
                    // Reload page when modal is closed
                    $(document).on("click", ".close, .modal", function () {
                        window.location.reload();
                    });
                } else {
                    // Show error flash
                    showFlashModal(false, response.message || "An error occurred while uploading file.");
                }
            },
            error: function (xhr) {
                $btn.html($btn.data('original-text')).prop('disabled', false);
                showFlashModal(false, "An error occurred while uploading file.");
            }
        });
    });
});
