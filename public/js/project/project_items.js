$(document).ready(function() {
    const table = $('#project_items_table').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url:  window.LS.routes.projectItemsList,
            type: 'POST',
            data: {
                _token: window.LS.csrfToken,
                project_id: window.LS.projectId
            }
        },
        columns: [
            { data: 0 }, { data: 1 }, { data: 2 }, { data: 3 }, { data: 4 },
            { data: 5 }, { data: 6 }, { data: 7 }, { data: 8 }, { data: 9 },
            { data: 10 }, { data: 11 }, { data: 12 }, { data: 13 }, { data: 14 },
            { data: 15 }, { data: 16 }
        ],
        scrollX: true,
        order: [[16, 'desc']],
        drawCallback: function() {
            // Format currency columns after draw
            table.rows().every(function() {
                const row = this.node();
                const data = this.data();
                [11,12].forEach(col => { // rec_cost_pickup, monthly_rate
                    const cell = $(row).find('td').eq(col);
                    if (cell.text().trim() !== '') {
                        let val = parseFloat(cell.text().replace(/\$/g,''));
                        if (!isNaN(val)) cell.text('$' + val.toFixed(2));
                    }
                });
            });
        }
    });

    // Helper: ISO (YYYY-MM-DD) -> MM/DD/YYYY (display)
    function isoToMmdd(iso) {
        if (!iso) return '';
        const d = iso.toString().slice(0,10);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return iso;
        const [y, m, day] = d.split('-');
        return `${m}/${day}/${y}`;
    }

    // Helper: MM/DD/YYYY -> ISO YYYY-MM-DD (backend)
    function mmddToIso(mmdd) {
        if (!mmdd) return null;
        const parts = mmdd.split('/');
        if (parts.length !== 3) return null;
        let [m, d, y] = parts.map(s => s.trim());
        if (!/^\d{1,2}$/.test(m) || !/^\d{1,2}$/.test(d) || !/^\d{4}$/.test(y)) return null;
        m = m.padStart(2, '0');
        d = d.padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    // Currency columns (zero-based)
    const currencyCols = [11,12]; 
    // Date columns (zero-based)
    const dateCols = [7,13]; 
    // Mandatory columns
    const mandatoryCols = [1,2,5]; // manufacturer_address, po_number, item_description

    // Editable cells
    $('#project_items_table').on('click', 'td', function() {
        const cell = $(this);
        const colIndex = table.cell(cell).index().column;
        const notEditable = [0, 10, 12, 15, 16]; // id, cube_expanded, monthly_rate, created_at, updated_at


        if (notEditable.includes(colIndex)) return;
        if (cell.find('input').length) return;

        const originalValue = cell.text().trim().replace(/\$/g,''); // remove $ for editing
        const input = $('<input>', { type: 'text', value: originalValue, class: 'form-control form-control-sm' });
        cell.empty().append(input);
        input.focus();

        input.on('blur', function() {
            let newValue = $(this).val().trim();

            // Mandatory validation
            if (mandatoryCols.includes(colIndex) && newValue === '') {
                showFlashModal(false,"This field cannot be empty.");
                cell.text(originalValue);
                return;
            }

            // Date validation
            if (dateCols.includes(colIndex)) {
                const iso = mmddToIso(newValue);
                if (!iso) {
                    showFlashModal(false,"Invalid date. Use MM/DD/YYYY format.");
                    cell.text(originalValue);
                    return;
                }
                newValue = iso;
                cell.text(isoToMmdd(newValue));
            }

            // Currency validation
            if (currencyCols.includes(colIndex)) {
                newValue = newValue.replace(/\$/g,'');
                if (isNaN(newValue) || newValue === '') {
                    showFlashModal(false, "Enter a valid numeric value.");
                    cell.text(originalValue);
                    return;
                }
                cell.text('$' + parseFloat(newValue).toFixed(2));
            } else if (!dateCols.includes(colIndex)) {
                // escape any harmful HTML for XSS protection
                newValue = $('<div>').text(newValue).text();
                cell.text(newValue);
            }

            // Revert if same as original
            if (newValue == originalValue) return;

            const rowData = table.row(cell.closest('tr')).data();
            const rowId = rowData[0];

            // AJAX update
            $.ajax({
                url: window.LS.routes.projectItemsUpdateCell,
                type: 'POST',
                data: {
                    _token:  window.LS.csrfToken,
                    id: rowId,
                    column: colIndex,
                    value: newValue
                },
                success: function(res) {
                    if (res.status) showFlashModal(true, res.message);
                    else {
                        showFlashModal(false, res.message || 'Update failed.');
                        cell.text(originalValue);
                    }
                    table.ajax.reload(null,false);
                },
                error: function(xhr) {
                    let msg = 'Update failed!';
                    if (xhr.responseJSON) {
                        // Prefer field-specific validation error
                        if (xhr.responseJSON.error && xhr.responseJSON.error.length > 0) {
                            msg = xhr.responseJSON.error[0]; // show the first error
                        } else if (xhr.responseJSON.message) {
                            msg = xhr.responseJSON.message;
                        }
                    }
                    showFlashModal(false, msg);
                    cell.text(originalValue);
                }
            });
        });
    });
});