var table = $(".common_table");
$(document).ready(function() {
	
	//datatable
		table = $('.common_table').DataTable({
		  "paging": true,
		  "searching": true,
		  "ordering": true,
		  "info": true,
		  "autoWidth": false,
		  "lengthChange": false,
		  "lengthMenu": [10, 25, 50, 100],
          "columnDefs": [{"orderable": false, "targets": 0}],
		  /*'columnDefs': [{
			 'targets': 0,
			 'searchable': false,
			 'orderable': false,
			 'className': 'dt-body-center',
			 'render': function (data, type, full, meta){
				 return '<input type="checkbox" name="id[]" value="' + $('<div/>').text(data).html() + '">';
			 }
		  }],
		  'order': [[1, 'asc']]*/
          'order': [],
		  'scrollX':        true,
		  'scrollCollapse': true,
		});
		
		// Handle click on "Select all" control
		$('#example-select-all').on('click', function(){
			// Get all rows with search applied
			// var rows = table.rows({ 'search': 'applied' }).nodes();
			// Check/uncheck checkboxes for all rows in the table
			// $('input[type="checkbox"]', rows).prop('checked', this.checked);
		});

		// Handle click on checkbox to set state of "Select all" control
		// $('.common_table tbody').on('change', 'input[type="checkbox"]', function(){
		// 	// If checkbox is not checked
		// 	if(!this.checked){
		// 		var el = $('#example-select-all').get(0);
		// 		// If "Select all" control is checked and has 'indeterminate' property
		// 		if(el && el.checked && ('indeterminate' in el)){
		// 			// Set visual state of "Select all" control 
		// 			// as 'indeterminate'
		// 			el.indeterminate = true;
		// 		}
		// 	}
		// });

		// 2023-08-23 (Sandeep) - Adding custom donetyping function and ajax call request will initiate
		// only when typing done from datatable search box to reduce ajax calls 
		// Call datatables, and return the API to the variable for use in our code
		// Binds datatables to all elements with a class of datatable
		if ($.fn.DataTable.isDataTable('.dataTable')) {
			var dataTable = $(".dataTable");
			// Abort previous ajax request if it is still in process on new request.
			dataTable.on('preXhr.dt', function ( e, settings, data ) {
				if (settings.jqXHR) settings.jqXHR.abort();
			});
			
			var dtable = dataTable.dataTable().api();
			$('.dataTables_filter input', dtable.table().container())
			.off('.DT')
			.donetyping(function(e){
				// Abort previous ajax request if it is still in process.
				var dtSettings = dtable.settings();
				if (dtSettings[0].jqXHR) {
					dtSettings[0].jqXHR.abort();
				}
				var searchVal = this.value.trim();
				// console.log('searchVal: '+searchVal);
				// If the length is 2 or more characters
				if(searchVal.length >= 2) {
					// Call the API search function
					dtable.search(searchVal).draw();
				}
				// Ensure we clear the search if they backspace far enough
				if(searchVal == "") {
					dtable.search("").draw();
				}
				return;
			});
		}
	//datatable close
});
// Updates "Select all" control in a data table
function updateDataTableSelectAllCtrl(table){
   var $table             = table.table().node();
   var $chkbox_all        = $('tbody input[type="checkbox"]', $table);
   var $chkbox_checked    = $('tbody input[type="checkbox"]:checked', $table);
   var chkbox_select_all  = $('thead input[name="select_all"]', $table).get(0);

   // If none of the checkboxes are checked
   if($chkbox_checked.length === 0){
        chkbox_select_all.checked = false;
        if('indeterminate' in chkbox_select_all){
            chkbox_select_all.indeterminate = false;
        }

   // If all of the checkboxes are checked
   } else if ($chkbox_checked.length === $chkbox_all.length){
        chkbox_select_all.checked = true;
        if('indeterminate' in chkbox_select_all){
            chkbox_select_all.indeterminate = false;
        }

   // If some of the checkboxes are checked
   } else {
        chkbox_select_all.checked = true;
        if('indeterminate' in chkbox_select_all){
            chkbox_select_all.indeterminate = true;
        }
   }
}