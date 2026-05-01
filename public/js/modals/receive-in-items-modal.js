$(document).ready(function () {

    const $modal  = $('#receiveInItemsModal');
    const $table  = $('#itemsTable');
    const $tbody  = $('#itemsTableBody');
    const $loader = $('#itemsLoader');
    const $search = $('#itemsCustomSearch');

    let itemsTable = null;
    let currentAjax = null; // track current request
    let searchTimer = null; // debounce 


    // ===============================
    // VIEW ITEMS CLICK
    // ===============================
    $(document).on('click', '.view-items', function (e) {
        e.preventDefault();

        const encryptedId = $(this).data('id');

        const $tr = $(this).closest('tr');
        const table = $('#listing_table').DataTable();
        const rowData = table.row($tr).data();

        let recordId = '';

        if (rowData && rowData.r_id) {
            const plainText = $('<div>').html(rowData.r_id).text().trim();
            const match = plainText.match(/RPFL\d+/);
            recordId = match ? match[0] : '';
        }

        $('#receiving-order-id').text(
            recordId ? `Receiving items of #${recordId}` : 'Receiving items'
        );

        // Reset UI
        $search.val('');
        $tbody.html('');
        $loader.removeClass('d-none').show();

        $modal.modal({
            backdrop: 'static',
            keyboard: true
        }).modal('show');

        if (!encryptedId) {
            hideLoaderWithMessage('Invalid record ID');
            return;
        }

        if (itemsTable) {
            itemsTable.destroy();
            $tbody.html('');
        }

        // ===============================
        // DATATABLE INIT
        // ===============================
        itemsTable = $table.DataTable({
            processing: true,
            serverSide: true,
            searching: false,
            ordering: true,
            pageLength: 10,
            scrollX: true, 
            scrollY:true,
            ajax: {
                url: window.routes.receiveInItemsList,
                type: 'POST',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },

                // ABORT PREVIOUS REQUEST
                beforeSend: function (jqXHR) {
                    if (currentAjax) {
                        currentAjax.abort();
                    }
                    currentAjax = jqXHR;
                },

                data: function (d) {
                    d.id = encryptedId;
                    d.search_value = $search.val();
                },

                dataSrc: function (json) {
                    $loader.addClass('d-none').hide();
                    return json.data ?? [];
                },

                error: function (xhr, status) {
                    if (status === 'abort') return;

                    $loader.addClass('d-none').hide();

                    if (itemsTable) {
                        itemsTable.clear().draw();
                    }

                    $('#itemsTable_processing').addClass('d-none').hide();
                    showMessage('No records found');
                }
            },

            columns: [
                { data: 'r_item_id', defaultContent: '-' },
                { data: 'item_name', defaultContent: '-' },
                { data: 'r_sku', defaultContent: '-' },
                { data: 'rack_name', defaultContent: '-' },
                { data: 'r_pr_code', defaultContent: '-' },
                { data: 'item_status_formatted', defaultContent: '-' },
                { data: 'notes', defaultContent: '-' }
            ]
        });

    });


    // ===============================
    // SEARCH WITH DEBOUNCE + ABORT
    // ===============================
    $('#itemsCustomSearch').on('keyup', function () {
        if (!itemsTable) return;

        clearTimeout(searchTimer);

        searchTimer = setTimeout(function () {
            itemsTable.ajax.reload(null, false);
        }, 500);

        // itemsTable.ajax.reload(null, false);
    });


    // ===============================
    // CLOSE BUTTON FIX
    // ===============================
    $modal.find('.btn-close, .btn-secondary').on('click', function () {
        $modal.modal('hide');
    });


    // ===============================
    // MODAL RESET
    // ===============================
    $modal.on('hidden.bs.modal', function () {
        if (itemsTable) {
            itemsTable.destroy();
            itemsTable = null;
        }
        $tbody.html('<tr><td colspan="7" class="text-center">No data</td></tr>');
        $loader.addClass('d-none').hide();
        $search.val('');
        currentAjax = null;
    });


    // ===============================
    // HELPERS
    // ===============================
    function showMessage(msg) {
        $tbody.html(`<tr><td colspan="7" class="text-center text-danger">${msg}</td></tr>`);
    }

    function hideLoaderWithMessage(msg) {
        $loader.addClass('d-none').hide();
        showMessage(msg);
    }

});
