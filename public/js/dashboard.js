(function ($) {
    var TRUCK_ORDER_STATUS = ('undefined' === typeof window.lsData) || (false === ('TRUCK_ORDER_STATUS' in window.lsData)) ? '' : window.lsData['TRUCK_ORDER_STATUS'],
        ORDER_STATUS = ('undefined' === typeof window.lsData) || (false === ('ORDER_STATUS' in window.lsData)) ? '' : window.lsData['ORDER_STATUS'],
        ROLES = ('undefined' === typeof window.lsData) || (false === ('ROLES' in window.lsData)) ? '' : window.lsData['ROLES'],
        ROUTE_TYPE = ('undefined' === typeof window.lsData) || (false === ('ROUTE_TYPE' in window.lsData)) ? '' : window.lsData['ROUTE_TYPE'],
        ORDER_TYPE = ('undefined' === typeof window.lsData) || (false === ('ORDER_TYPE' in window.lsData)) ? '' : window.lsData['ORDER_TYPE'],
        REASON_CATEGORY = ('undefined' === typeof window.lsData) || (false === ('REASON_CATEGORY' in window.lsData)) ? '' : window.lsData['REASON_CATEGORY'],
        CALL_AHEAD_STATUS = ('undefined' === typeof window.lsData) || (false === ('CALL_AHEAD_STATUS' in window.lsData)) ? '' : window.lsData['CALL_AHEAD_STATUS'],
        REVERSAL_TRUCK_ORDER_STATUS = ('undefined' === typeof window.lsData) || (false === ('REVERSAL_TRUCK_ORDER_STATUS' in window.lsData)) ? '' : window.lsData['REVERSAL_TRUCK_ORDER_STATUS'],
        REVERSAL_ROUTE_TYPE = ('undefined' === typeof window.lsData) || (false === ('REVERSAL_ROUTE_TYPE' in window.lsData)) ? '' : window.lsData['REVERSAL_ROUTE_TYPE'],
        trucksListWithOrdersUrl = ('undefined' === typeof window.lsData) || (false === ('trucksListWithOrdersUrl' in window.lsData)) ? '' : window.lsData['trucksListWithOrdersUrl'],
        checkTransferCompletedUrl = ('undefined' === typeof window.lsData) || (false === ('checkTransferCompletedUrl' in window.lsData)) ? '' : window.lsData['checkTransferCompletedUrl'],
        updateDispatchMapCoordsUrl = ('undefined' === typeof window.lsData) || (false === ('updateDispatchMapCoordsUrl' in window.lsData)) ? '' : window.lsData['updateDispatchMapCoordsUrl'],
        unassignOrderListUrl = ('undefined' === typeof window.lsData) || (false === ('unassignOrderListUrl' in window.lsData)) ? '' : window.lsData['unassignOrderListUrl'],
        checkTruckOrderStatusUrl = ('undefined' === typeof window.lsData) || (false === ('checkTruckOrderStatusUrl' in window.lsData)) ? '' : window.lsData['checkTruckOrderStatusUrl'],
        uploadDtImageUrl = ('undefined' === typeof window.lsData) || (false === ('uploadDtImageUrl' in window.lsData)) ? '' : window.lsData['uploadDtImageUrl'],
        dashboardDriverListSelect2Url = ('undefined' === typeof window.lsData) || (false === ('dashboardDriverListSelect2Url' in window.lsData)) ? '' : window.lsData['dashboardDriverListSelect2Url'],
        reasonCodesListSelect2Url = ('undefined' === typeof window.lsData) || (false === ('reasonCodesListSelect2Url' in window.lsData)) ? '' : window.lsData['reasonCodesListSelect2Url'],
        undeliveredOrdersUrl = ('undefined' === typeof window.lsData) || (false === ('undeliveredOrdersUrl' in window.lsData)) ? '' : window.lsData['undeliveredOrdersUrl'],
        orderWithoutImageUrl = ('undefined' === typeof window.lsData) || (false === ('orderWithoutImageUrl' in window.lsData)) ? '' : window.lsData['orderWithoutImageUrl'],
        removeEndedFlagUrl = ('undefined' === typeof window.lsData) || (false === ('removeEndedFlagUrl' in window.lsData)) ? '' : window.lsData['removeEndedFlagUrl'],
        saveOrderScheduleInfoUrl = ('undefined' === typeof window.lsData) || (false === ('saveOrderScheduleInfoUrl' in window.lsData)) ? '' : window.lsData['saveOrderScheduleInfoUrl'],
        orderScheduleInfoUrl = ('undefined' === typeof window.lsData) || (false === ('orderScheduleInfoUrl' in window.lsData)) ? '' : window.lsData['orderScheduleInfoUrl'],
        orderScheduledInfoDashboardUrl = ('undefined' === typeof window.lsData) || (false === ('orderScheduledInfoDashboardUrl' in window.lsData)) ? '' : window.lsData['orderScheduledInfoDashboardUrl'],
        calcTruckOrderTimeUrl = ('undefined' === typeof window.lsData) || (false === ('calcTruckOrderTimeUrl' in window.lsData)) ? '' : window.lsData['calcTruckOrderTimeUrl'],
        saveTruckOrderUrl = ('undefined' === typeof window.lsData) || (false === ('saveTruckOrderUrl' in window.lsData)) ? '' : window.lsData['saveTruckOrderUrl'],
        checkTruckOrderStatusUrl = ('undefined' === typeof window.lsData) || (false === ('checkTruckOrderStatusUrl' in window.lsData)) ? '' : window.lsData['checkTruckOrderStatusUrl'],
        failedMissingOrderUrl = ('undefined' === typeof window.lsData) || (false === ('failedMissingOrderUrl' in window.lsData)) ? '' : window.lsData['failedMissingOrderUrl'],
        briefingSheetUrl = ('undefined' === typeof window.lsData) || (false === ('briefingSheetUrl' in window.lsData)) ? '' : window.lsData['briefingSheetUrl'],
        briefingSheetAddUrl = ('undefined' === typeof window.lsData) || (false === ('briefingSheetAddUrl' in window.lsData)) ? '' : window.lsData['briefingSheetAddUrl'],
        endTodaysDeliveriesUrl = ('undefined' === typeof window.lsData) || (false === ('endTodaysDeliveriesUrl' in window.lsData)) ? '' : window.lsData['endTodaysDeliveriesUrl'],
        unfinishedOrdersEndDayUrl = ('undefined' === typeof window.lsData) || (false === ('unfinishedOrdersEndDayUrl' in window.lsData)) ? '' : window.lsData['unfinishedOrdersEndDayUrl'],
        getUserDetailsByIdUrl = ('undefined' === typeof window.lsData) || (false === ('getUserDetailsByIdUrl' in window.lsData)) ? '' : window.lsData['getUserDetailsByIdUrl'],
        sendDHSmsUrl = ('undefined' === typeof window.lsData) || (false === ('sendDHSmsUrl' in window.lsData)) ? '' : window.lsData['sendDHSmsUrl'],
        dispatchDashboardUrl = ('undefined' === typeof window.lsData) || (false === ('dispatchDashboardUrl' in window.lsData)) ? '' : window.lsData['dispatchDashboardUrl'],
        orderViewUrl = ('undefined' === typeof window.lsData) || (false === ('orderViewUrl' in window.lsData)) ? '' : window.lsData['orderViewUrl'],
        updatePartialOrderItemsUrl = ('undefined' === typeof window.lsData) || (false === ('updatePartialOrderItemsUrl' in window.lsData)) ? '' : window.lsData['updatePartialOrderItemsUrl'],
        truckRouteLogHistoryUrl = ('undefined' === typeof window.lsData) || (false === ('truckRouteLogHistoryUrl' in window.lsData)) ? '' : window.lsData['truckRouteLogHistoryUrl'],
        truckListSelect2Url = ('undefined' === typeof window.lsData) || (false === ('truckListSelect2Url' in window.lsData)) ? '' : window.lsData['truckListSelect2Url'],
        truckDetailsUrl = ('undefined' === typeof window.lsData) || (false === ('truckDetailsUrl' in window.lsData)) ? '' : window.lsData['truckDetailsUrl'],
        patialOrderItemsUrl = ('undefined' === typeof window.lsData) || (false === ('patialOrderItemsUrl' in window.lsData)) ? '' : window.lsData['patialOrderItemsUrl'],
        same_day_logo = ('undefined' === typeof window.lsData) || (false === ('same_day_logo' in window.lsData)) ? '' : window.lsData['same_day_logo'],
        getUserStatus = ('undefined' === typeof window.lsData) || (false === ('getUserStatus' in window.lsData)) ? '' : window.lsData['getUserStatus'];

    var oTable, geocoder, map, request, searched_addr;
    var markers = [];
    var all_order_id = [];
    var all_addr = [];
    var all_cust = [];
    var all_city = [];
    var markerStack = [];
    var individual_markers = [];
    var truck_markers = [];
    var original_trucks_json = JSON.stringify("");
    var trucks_json = JSON.stringify("");
    var trucks_json_truck_number = {};
    var orders_json = JSON.stringify("");
    var delete_partial_items = [];
    var trucks_orders_json = JSON.stringify("");
    var drivers_json = {};
    var helpers_json = {};
    var $this = $(".save_trucks_and_orders");
    var $loadingText = '<i class="fa fa-circle-notch fa-spin"></i> Processing...';
    var $this_current_html = $(".save_trucks_and_orders").html();
    var assign_status = 1;
    var coords = [];
    var markers2 = [];
    var lines_made = [];
    var lines_coords = [];
    var used_coords = [];
    var $gl_line_coords = [];
    var li_id = [];
    var trucks_with_orders = [];
    var used_coords = [];
    var polyline = new google.maps.Polyline();
    var route_line;
    var bounds = lastGribBoundingBox = null;
    var shiftPressed = false;
    var mouseDownPos, gribBoundingBox = null, mouseIsDown = 0;
    var auto_routes = [];
    var markers_routed = [];
    var ok_markers_routed = [];
    var truck_color = '';
    var assigned_markers = [];
    var infoWindow_polyline = null;
    var pickup_not_assigned = [];
    var sidebar_number_orders = -1;
    var sidebar_number_transfer = -1;
    var order_tab_selected = 0;
    var markers_assigned_to_trucks_local = [];
    var locked_trucks_id = [];
    var routed_truck_polyline = [];
    var route_markers = [];
    var ignore_trucks_id = [];
    var num_sidebar_data = [];
    var modal = $('#unAssignModal');


    function update_prpi_items(row_id) {
        var is_chk_val = document.querySelector('input[name="prpi_items_' + row_id + '"]:checked').value;
        console.log("is_chk_val: " + is_chk_val);
        $("#item_main_" + row_id).slideToggle('slow');
    }

    $('#unAssignModal button.btn-success').click(() => {
        const $checkedCheckboxes = $('input[name="order-checkbox"]:checked');
        if ($checkedCheckboxes.length === 0) {
            $('#unAssignModal #warningMsg').text('*Please select at least one order to un-assign.').show();
            return;
        }
        $checkedCheckboxes.each((index, checkbox) => {
            const order_number = $(checkbox).data('order-number');
            const sidebar_num = $(checkbox).data('side');
            const truck_number = $(checkbox).data('truck-number');
            const location = $(checkbox).data('loc');
            const addr = $(checkbox).data('addr-unassign');
            const warehouse_addr = $(checkbox).data('warehouse_addr');

            // Do whatever you want with the data attributes here
            unassign_orders(order_number, truck_number, true, sidebar_num, location, addr, warehouse_addr);
            refresh_unassigned_order()
            $('#unAssignModal').modal('hide');
        });
    });

    function calcRoute(coordinates, truckColor) {
        if (truckColor == "#e7e677") {
            truckColor = '#FF8200';
        }

        var request = {
            travelMode: google.maps.TravelMode.DRIVING
        };
        for (i = 0; i < coordinates.length; i++) {
            marker = google.maps.marker.AdvancedMarkerElement({
                position: new google.maps.LatLng(coordinates[i][0], coordinates[i][1]),
            });

            if (i == 0) {
                request.origin = marker.getPosition();
                map.panTo(request.origin);
            }
            else if (i == coordinates.length - 1) request.destination = marker.getPosition();
            else {
                if (!request.waypoints) request.waypoints = [];
                request.waypoints.push({
                    location: marker.getPosition(),
                    stopover: true
                });
            }
        }
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer({
            polylineOptions: {
                strokeColor: truckColor
            }
        });
        directionsDisplay.setOptions({ suppressMarkers: true, preserveViewport: true });
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                directionsDisplay.setMap(map);
            } else {
            }
        });
    }

    function pinSymbol(color) {
        return {
            path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
            fillColor: color,
            fillOpacity: 1,
            labelOrigin: new google.maps.Point(0, -25),
            strokeColor: '#000',
            strokeWeight: 2,
            scale: 0.75,
        };
    }

    function pinSymbolSmall(color) {
        return {
            path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
            fillColor: color,
            fillOpacity: 1,
            labelOrigin: new google.maps.Point(0, -25),
            strokeColor: '#000',
            strokeWeight: 2,
            scale: 0.55,
        };
    }

    $(document).ready(function () {
        $('input[name="check-all-checkbox"]').on('change', function () {
            var checked = $(this).is(':checked');
            $('input[name="order-checkbox"]').prop('checked', checked);
        });
    });

    function initmap() {
        showLoading("dispatchDashboard_box", '#');
        if (markers) {
            for (var i = 0; i < markers.length; i++) {
                if (markers[i]) {
                    for (var j = 0; j < markers[i].length; j++) {
                        markers[i][j].setMap(null);
                    }
                }
            }
        }
        markers.length = 0;
        var mapOptions = {
            zoom: 5,
            center: new google.maps.LatLng(34.0522, -118.2437),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            draggableCursor: 'default',
            streetViewControl: false,
            fullscreenControl: false,
        };
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        geocoder = new google.maps.Geocoder();
        var infowindow = new google.maps.InfoWindow();
        var coords = [];
        var i = 0;
        markers = [];
        hideLoading("dispatchDashboard_box", '#');
        // Load Truck Markers
        var datep = $('#save_truck_date').val();
        var Date_today = new Date();
        var Date_obj = new Date(datep);
        if (truck_markers.length != 0 && (!(dateInPast(Date_obj, Date_today)) && !(dateInFuture(Date_obj, Date_today)))) {
            for (var i = 0; i < truck_markers.length; i++) {
                if (truck_markers[i] != null) {
                    makeTruckMarker_new(truck_markers[i].lat, truck_markers[i].lng, truck_markers[i].truck_name, truck_markers[i].id, truck_markers[i].color)
                }
            }
        }
        const main_div = document.createElement("div");
        const resetZoom = document.createElement("div");
        resetzoom(resetZoom, map);

        const findAddress = document.createElement("div");
        findaddress(findAddress, map);

        const findOrder = document.createElement("div");
        findorder(findOrder, map);

        main_div.append(resetZoom);
        main_div.append(findAddress);
        main_div.append(findOrder);
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(main_div);


        var themap = map;

        $(window).keydown(function (evt) {
            if (evt.which === 16) { // shift
                shiftPressed = true;

            }
        }).keyup(function (evt) {
            if (evt.which === 16) { // shift
                shiftPressed = false;
                themap.setOptions({ draggableCursor: 'default' });
                if (gribBoundingBox !== null && mouseIsDown) {
                    //&& order_tab_selected == 1
                    gribBoundingBox.setMap(null); // remove the rectangle
                    getRectangleCoordinates();
                }
            }
        });

        google.maps.event.addListener(themap, 'mousemove', function (e) {
            if (mouseIsDown && shiftPressed) {                             //&& order_tab_selected == 1
                if (gribBoundingBox !== null) // box exists
                {
                    bounds.extend(e.latLng);
                    gribBoundingBox.setBounds(bounds); // If this statement is enabled, I lose mouseUp events

                } else // create bounding box
                {
                    bounds = new google.maps.LatLngBounds();
                    bounds.extend(e.latLng);
                    gribBoundingBox = new google.maps.Rectangle({
                        map: themap,
                        bounds: bounds,
                        fillOpacity: 0.15,
                        strokeWeight: 0.9,
                        clickable: false
                    });

                    LastGribBoundingBox = null;
                    LastGribBoundingBox = gribBoundingBox;
                }
            }
        });

        google.maps.event.addListener(themap, 'mousedown', function (e) {
            if (shiftPressed) {
                mouseIsDown = 1;
                mouseDownPos = e.latLng;
                themap.setOptions({
                    draggable: false,
                    draggableCursor: 'crosshair'
                });
            }
        });

        google.maps.event.addListener(themap, 'mouseup', function (e) {
            if (mouseIsDown && shiftPressed) {                             //&& order_tab_selected == 1
                mouseIsDown = 0;
                if (gribBoundingBox !== null) // box exists
                {
                    getRectangleCoordinates();
                }
                gribBoundingBox = null;
            }

            themap.setOptions({
                draggable: true
            });
            //stopDraw(e);
        });

        // Making box with shift for selecting orders from map



        function getRectangleCoordinates() {
            if (LastGribBoundingBox !== null) {
                var gribBoundingBox = LastGribBoundingBox;
                var boundsSelectionArea = new google.maps.LatLngBounds(gribBoundingBox.getBounds().getSouthWest(), gribBoundingBox.getBounds().getNorthEast());
                var i = 0;
                // var auto_routes=[];
                var datep = $('#save_truck_date').val();
                var Date_today = new Date();
                var Date_obj = new Date(datep);
                if (!(dateInPast(Date_obj, Date_today))) {
                    for (var key in individual_markers) { // looping through my Markers Collection	
                        if (boundsSelectionArea.contains(individual_markers[key].getPosition()) && $.inArray(key, markers_routed) == -1 && $.inArray(key, assigned_markers) == -1) {
                            individual_markers[key].setIcon(pinSymbolSmall('#00A65A'));
                            var lat = individual_markers[key].getPosition().lat();
                            var lng = individual_markers[key].getPosition().lng();
                            var obj = { lat, lng };
                            markers_routed.push(key);
                            auto_routes.push(obj);
                        }
                        i++;
                    }
                }
                make_route_path(auto_routes);
                setTimeout(function () {
                    if (gribBoundingBox !== null) {
                        gribBoundingBox.setMap(null); // remove the rectangle
                    }
                }, 500);
            }
        }

        function make_route_path(route_coords = []) {
            polyline.setMap(null);
            var line = new google.maps.Polyline({
                path: route_coords,
                geodesic: true,
                strokeColor: "#00A65A",
                strokeOpacity: 1.0,
                strokeWeight: 8
            });
            line.setMap(map);
            polyline = line;

            var map_cord = "";
            if (infoWindow_polyline != null)
                map_cord = infoWindow_polyline.getMap();
            if (map_cord == "" || map_cord == null) {
                infoWindow_polyline = new google.maps.InfoWindow({
                    position: route_coords[0],
                });


                var html = "<button class='btn btn-info btn-sm create_route_polyline' style='padding:5px;'>Assign</button>";
                html += "<button class='btn btn-info btn-sm clear_polyline'style='padding:5px;margin-left:10px'>Clear</button>";
                var html_btn1 = $('<button>', { class: 'btn btn-info btn-sm create_route_polyline', 'style': 'padding:5px;', text: 'Assign' });
                var html_btn2 = $('<button>', { class: 'btn btn-info btn-sm clear_polyline', 'style': 'padding:5px;margin-left:10px', text: 'Clear' });
                html_str = html_btn1[0].outerHTML + html_btn2[0].outerHTML;
                if ($('#tab1button').parent('.route_type_order_list').hasClass('active') == true) {
                    html += "<button class='btn btn-info btn-sm auto_route_orders_btn' style='padding:5px;margin-left:10px'>Auto Route</button>";
                    var html_btn3 = $('<button>', { class: 'btn btn-info btn-sm auto_route_orders_btn', 'style': 'padding:5px;margin-left:10px', text: 'Auto Route' })
                    html_str += html_btn3[0].outerHTML;
                }

                infoWindow_polyline.setContent(
                    html_str
                );

                infoWindow_polyline.open(map);
            }
            line.addListener("click", (mapsMouseEvent) => {
                var map_cord = "";
                if (infoWindow_polyline != null)
                    infoWindow_polyline.close();

                if (map_cord == "" || map_cord == null) {
                    infoWindow_polyline = new google.maps.InfoWindow({
                        position: mapsMouseEvent.latLng,
                    });


                    var html = "<button class='btn btn-info btn-sm create_route_polyline' style='padding:5px;'>Assign</button>";
                    html += "<button class='btn btn-info btn-sm clear_polyline'style='padding:5px;margin-left:10px'>Clear</button>";
                    html_btn1 = $('<button>', { class: 'btn btn-info btn-sm create_route_polyline', 'style': 'padding:5px;', text: 'Assign' });
                    html_btn2 = $('<button>', { class: 'btn btn-info btn-sm clear_polyline', 'style': 'padding:5px;margin-left:10px' });
                    html_str = html_btn1[0].outerHTML + html_btn2[0].outerHTML;
                    if ($('#tab1button').parent('.route_type_order_list').hasClass('active') == true) {
                        html += "<button class='btn btn-info btn-sm auto_route_orders_btn' style='padding:5px;margin-left:10px'>Auto Route</button>";
                        var html_btn3 = $('<button>', { class: 'btn btn-info btn-sm auto_route_orders_btn', 'style': 'padding:5px;margin-left:10px', text: 'Auto Route' });
                        html_str += html_btn3[0].outerHTML;
                    }

                    infoWindow_polyline.setContent(
                        html_str
                    );

                    infoWindow_polyline.open(map);
                }

            });

        }

    }

    //Modal For AutoRouting orders
    $(document).on('click', '.auto_route_orders_btn', auto_route_orders)
    function auto_route_orders() {
        var all_t_data = JSON.parse(trucks_orders_json);
        var exclude_trucks_id = Object.keys(all_t_data);

        $.ajax({
            type: "GET",
            cache: false,
            url: truckListSelect2Url,
            data: {
                exclude_trucks: exclude_trucks_id,
                show_all: true
            },
            beforeSend: function () {
                showLoading("dispatchDashboard_box", '#');
            },
            success: function (data) {

                var available_trucks = data.results;
                var selected_id = [];
                for (i = 0; i < markers_routed.length; i++) {
                    selected_id.push(all_order_id[markers_routed[i]]);
                }

                ok_markers_routed = [];
                var no_stops = 0;
                var no_pieces = 0;

                $.each(orders_json, function (key1, value1) {
                    $.each(orders_json[key1], function (key, value) {

                        var color = "";
                        var check = 1;
                        var type = '';

                        if ($.inArray(value.orders_id + " " + value.order_type, selected_id) > -1) {
                            if (value.ors_type == ORDER_TYPE.PICKUP) {
                                var sum_order_quant = Number(value.quantity);
                                var sum_order_quan_for_delivery = Number(value.qty_for_delivery);
                                if (value.order_type == "Pickup") {
                                    type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                                    ok_markers_routed.push(markers_routed[type]);
                                    no_stops++;
                                    no_pieces += Number(sum_order_quant);
                                } else if (value.order_type == "Delivery") {
                                    if (sum_order_quan_for_delivery == 0 && value.is_same_day == 0) {
                                        check = 0
                                        type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                                        ok_markers_routed.push(markers_routed[type]);
                                        no_stops++;
                                        no_pieces += Number(sum_order_quan_for_delivery);
                                    } else if (sum_order_quant != sum_order_quan_for_delivery && value.is_same_day == 0) {
                                        type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                                        ok_markers_routed.push(markers_routed[type]);
                                        no_stops++;
                                        no_pieces += Number(sum_order_quan_for_delivery);
                                    } else {
                                        type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                                        ok_markers_routed.push(markers_routed[type]);
                                        no_stops++;
                                        no_pieces += Number(sum_order_quan_for_delivery);
                                    }
                                }
                                else {
                                    type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                                    ok_markers_routed.push(markers_routed[type]);
                                    no_stops++;
                                    no_pieces += Number(sum_order_quan);
                                }
                            } else if (value.ors_type == ORDER_TYPE.RECEIVE_IN) {
                                var sum_order_quant = value.quantity;
                                var sum_order_quan_for_delivery = value.qty_for_delivery;
                                if (value.order_type == "Delivery") {
                                    if (sum_order_quan_for_delivery == 0) {
                                        check = 0
                                        type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                                        ok_markers_routed.push(markers_routed[type]);
                                        no_stops++;
                                        no_pieces += Number(sum_order_quan_for_delivery);
                                    } else if (sum_order_quant != sum_order_quan_for_delivery) {
                                        type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                                        ok_markers_routed.push(markers_routed[type]);
                                        no_stops++;
                                        no_pieces += Number(sum_order_quan_for_delivery);
                                    } else {
                                        type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                                        ok_markers_routed.push(markers_routed[type]);
                                        no_stops++;
                                        no_pieces += Number(sum_order_quan_for_delivery);
                                    }
                                }
                                else {
                                    type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                                    ok_markers_routed.push(markers_routed[type]);
                                    no_stops++;
                                    no_pieces += Number(sum_order_quan);
                                }
                            } else {
                                if (value.t_o_id) {
                                    var sum_order_quant = value.quantity;
                                    var sum_order_quan_for_delivery = value.qty_for_delivery;
                                    if (value.order_type == "Pickup") {
                                        type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                                        ok_markers_routed.push(markers_routed[type]);
                                        no_stops++;
                                        no_pieces += Number(sum_order_quan);
                                    }
                                    else if (value.order_type == "Delivery") {
                                        if (sum_order_quan_for_delivery == 0 && value.is_same_day == 0) {
                                            check = 0
                                            type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                                            ok_markers_routed.push(markers_routed[type]);
                                            no_stops++;
                                            no_pieces += Number(sum_order_quan_for_delivery);
                                        } else if (sum_order_quant != sum_order_quan_for_delivery && value.is_same_day == 0) {
                                            type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                                            ok_markers_routed.push(markers_routed[type]);
                                            no_stops++;
                                            no_pieces += Number(sum_order_quan_for_delivery);
                                        } else {
                                            type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                                            ok_markers_routed.push(markers_routed[type]);
                                            no_stops++;
                                            no_pieces += Number(sum_order_quan_for_delivery);
                                        }
                                    }
                                }
                            }
                        }
                    });
                });
                var html_str = "<div class='col-sm-12'><span class='pull-left'>Total Pieces: " + no_pieces + "</span><span class='pull-right' id='auto_route_stop_no' data-stop-num ='" + no_stops + "'>No. Of Stops: " + no_stops + "</span></div>";
                html_str += "<hr><div class='col-sm-12' style='max-height: 200px;overflow-y: auto;border-bottom:1px solid #eee;'><ul style='list-style:none;'>";

                var counter_check = 0;

                var geocoder = new google.maps.Geocoder();

                $.each(available_trucks, async function (key, value) {
                    var lat = value.s_latitude;
                    var lng = value.s_longitude;
                    if (value.s_latitude == null || value.s_latitude == 'undefined' || value.s_longitude == null || value.s_longitude == 'undefined') {
                        var truck_start_address = "";
                        if (value.s_addressline1) {
                            truck_start_address += value.s_addressline1;
                        }
                        if (value.s_addressline2) {
                            truck_start_address += ', ' + value.s_addressline2;
                        }
                        if (value.s_city) {
                            truck_start_address += ', ' + value.s_city;
                        }
                        if (value.s_state) {
                            truck_start_address += ', ' + value.s_state;
                        }
                        if (value.s_zipcode) {
                            truck_start_address += ', ' + value.s_zipcode;
                        }

                        await geocoder.geocode({
                            'address': truck_start_address,
                        }, await function (results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                lat = results[0].geometry.location.lat();
                                lng = results[0].geometry.location.lng();
                            }
                        });
                    }


                    html_str += "<li class='col-sm-6'><label><input type='checkbox' class='auto_truckRoute' data-truck-id=" + value.id + " data-truck-lat=" + lat + " data-truck-lng=" + lng + " id='truck_auto_route_" + key + "' name='truck_ar_" + value.id + "'>" + value.text + "</label> </li>"
                    counter_check++;

                    if (counter_check == available_trucks.length) {
                        html_str += "</ul></div>";
                        html_str += "<div class='col-sm-3'><label>Max Stop</label><input type='number' value='0' id='auto_route_max_stop' class='form-control'></div><div class='text-danger' id='max_stop_err'></div>";
                        $("#auto_route_modal").find('.modal-body').html(html_str);
                        $(".polyline_assign_button").prop("disabled", false);
                        $("#auto_route_modal").modal('show');
                        hideLoading("dispatchDashboard_box", '#');
                    }
                });

            },
            error: function (data) {
                hideLoading("dispatchDashboard_box", '#');

            }
        });
    }

    $(document).on('change keyup', "#auto_route_max_stop", function () {
        $("#max_stop_err").html('');
    });
    $(document).on('click', '.hide_modal', hide_modal);
    function hide_modal() {
        var max_stops = $("#auto_route_max_stop").val();
        var selected_trucks = $(".auto_truckRoute:checked");
        var max_stops_allowed = selected_trucks.length * max_stops;
        if (max_stops_allowed < $("#auto_route_stop_no").attr('data-stop-num')) {
            $("#max_stop_err").html('ERROR: Stop Constraint - Not enough trucks to accommodate all the stops. Increase the trucks or Increase the stops per truck');
            return false;
        }

        $("#auto_route_modal").modal('hide');
        showLoading("dispatchDashboard_box", '#');
        setTimeout(function () {
            auto_truck_route_submit();
        }, 1);
    }

    function auto_truck_route_submit() {
        try {
            let start = Date.now();
            var selected_id = [];
            var selected_order_details = [];
            var selected_trucks = $(".auto_truckRoute:checked");
            var sorted_truck_order = {};
            var marker_order_arr = {};
            sorted_truck_order['route_list'] = {};
            sorted_truck_order['o_name_list'] = {};
            sorted_truck_order['dist_between'] = {};
            sorted_truck_order['dist_truck'] = {};
            var max_stops = $("#auto_route_max_stop").val();
            var total_order = [];
            for (i = 0; i < ok_markers_routed.length; i++) {
                selected_id.push(all_order_id[ok_markers_routed[i]]);
                let temp_var = all_order_id[ok_markers_routed[i]].split(' ');
                let o_name_made = "";
                if (temp_var[1] == "Delivery") {
                    o_name_made = temp_var[0] + "D";
                }
                else if (temp_var[1] == "Pickup") {
                    o_name_made = temp_var[0] + "P";
                }

                marker_order_arr[ok_markers_routed[i]] = o_name_made;
            }
            console.log(ok_markers_routed)
            $.each(orders_json, function (key, value) {
                $.each(orders_json[key], function (key1, value1) {
                    if ($.inArray(value1.orders_id + " " + value1.order_type, selected_id) > -1) {
                        selected_order_details.push(value1);
                    }
                });
            });

            $.each(selected_trucks, function (key, value) {
                var new_shortest_distance = 0;
                var shortest_distance = 0;
                var largest_dist = Infinity;
                var pointer1 = '';
                var pointer2 = '';
                var compare_order_id = '';
                var skip_order_array = [];
                var skip_order_row_array = [];
                var route = [];
                var r_list = [];
                var dist_Array = {};
                var truck_dist_array = {};
                var i = 0;
                var current_pointer = {};

                current_pointer.lat = $(this).attr('data-truck-lat');
                current_pointer.lng = $(this).attr('data-truck-lng');
                var truck_coords = current_pointer;
                while (i < selected_order_details.length) {
                    largest_dist = Infinity;
                    $.each(selected_order_details, function (key1, val) {
                        if ($.inArray(selected_order_details[key1], route) == -1) {
                            var o_name = '';
                            pointer2 = {};
                            if (val.route_type == ROUTE_TYPE.Pickup) {
                                pointer2.lat = val.origin_lat;
                                pointer2.lng = val.origin_lng;
                                o_name = val.o_id + 'P';
                            }
                            else {
                                pointer2.lat = val.dest_lat;
                                pointer2.lng = val.dest_lng;
                                if (val.route_type == ROUTE_TYPE.Delivery) {
                                    o_name = val.o_id + 'D';
                                }
                            }
                            selected_order_details[key1].coordinates = pointer2;
                            pointer1 = current_pointer;

                            var dist = getDistance(pointer1, pointer2);
                            var truck_dist = getDistance(truck_coords, pointer2);
                            if (dist < largest_dist) {
                                route[i] = selected_order_details[key1];
                                r_list[i] = o_name;
                                total_order[i] = o_name;
                                dist_Array[o_name] = dist;
                                truck_dist_array[o_name] = truck_dist;
                                largest_dist = dist;
                            }
                        } else {
                            return true;
                        }
                    });
                    current_pointer = route[i].coordinates;
                    i++;
                }

                var t_id = $(value).attr('data-truck-id').toString();

                sorted_truck_order['route_list'][t_id] = { ...route };
                sorted_truck_order['o_name_list'][t_id] = { ...r_list };
                sorted_truck_order['dist_between'][t_id] = { ...dist_Array };
                sorted_truck_order['dist_truck'][t_id] = { ...truck_dist_array };
            });

            var test_assign_arr = [];
            var assigned_complete = [];
            var i = 0;
            while (total_order.length != 0) {

                $.each(sorted_truck_order.o_name_list, function (key, value) {
                    console.log(typeof test_assign_arr[key]);
                    if (typeof test_assign_arr[key] == 'undefined' || typeof test_assign_arr[key] == 'null')
                        test_assign_arr[key] = [];

                    if (test_assign_arr[key].length >= max_stops) {

                        return true;
                    }

                    $.each(value, function (key1, value1) {

                        var to_check_o_id = value1;
                        var is_nearest = true;
                        if ($.inArray(value1, assigned_complete) != -1) {

                            return true;
                        }
                        if (test_assign_arr[key].length >= max_stops) {

                            return false;
                        }
                        $.each(sorted_truck_order.dist_truck, function (key2, value2) {

                            var curr_t_dis = sorted_truck_order.dist_truck[key][to_check_o_id];
                            if (key2 == key)
                                return true;
                            var check_condition = (typeof test_assign_arr[key2] != 'undefined') ? (test_assign_arr[key2].length < max_stops) : true;
                            if (curr_t_dis < value2[to_check_o_id] && check_condition) {
                                is_nearest = false;
                                return false;
                            }
                        });
                        if (is_nearest == true) {

                            test_assign_arr[key].push(to_check_o_id);
                            assigned_complete.push(to_check_o_id);

                            var index1 = total_order.indexOf(to_check_o_id);
                            total_order.splice(index1, 1);
                        }

                    });
                });
            }

            let timeTaken1 = Date.now() - start;
            console.log("Total time taken : " + timeTaken1 + " milliseconds");
            $.each(test_assign_arr, async function (k, v) {
                if (v) {
                    ok_markers_routed = [];
                    $.each(v, function (k1, v1) {
                        ok_markers_routed.push(Object.keys(marker_order_arr).find(key => marker_order_arr[key] === v1));
                    });
                    if (ok_markers_routed.length) {

                        await assign_order_for_polyline(k);
                    }
                }
            });
            let timeTaken = Date.now() - start;
            console.log("Total time taken : " + timeTaken + " milliseconds");
            hideLoading("dispatchDashboard_box", '#');
        }
        catch (err) {
            $('#changed').val(0);
            showFlashModal(false, "Error Occured. Reloading Page.");
            $(".close, .modal").click(function () {
                window.location.reload();
            });
        }

    }


    $(document).on("click", ".create_route_polyline",create_route_polyline);
    function create_route_polyline() {
        var html_add = '';
        var selected_id = [];
        ok_markers_routed = [];
        var count = 0;
        pColElm = $('<div>', { class: 'p-col' }).append($('<select>', { class: 'form-control', id: 'truck_polyline_choose' }));
        textElm = $('<div>', { class: 'text-danger', id: 'truck_error_polyline' });
        truckSpecElm = $('<div>', { id: 'truck_specification_modal', 'style': 'display:none !important;' })
            .append($('<small>').text('Truck details - V = ')
                .append($('<span>', { id: 'used_vol_modal' }), '/')
                .append($('<span>', { id: 'max_vol_modal' }), ' W = ')
                .append($('<span>', { id: 'used_weight_modal' }), '/')
                .append($('<span>', { id: 'max_weight_modal' })));
        ulElm = $('<ul>', { 'style': 'list-style:none;' });
        html_add += '<div class="p-col" style=""><select class="form-control" id="truck_polyline_choose"></select></div><div class="text-danger" id="truck_error_polyline"></div><div id="truck_specification_modal" style="display:none !important;"><small>Truck details - V = <span id="used_vol_modal"></span>/<span id="max_vol_modal"></span>   W = <span id="used_weight_modal"></span>/<span id="max_weight_modal"></span></small></div>';
        html_add += '<ul style="list-style:none;">';
        for (i = 0; i < markers_routed.length; i++) {
            selected_id.push(all_order_id[markers_routed[i]]);
        }
        $("#note_delivery_polyline").hide();
        $.each(orders_json, function (key1, value1) {
            $.each(orders_json[key1], function (key, value) {
                var color = "";
                var check = 1;
                var type = '';
                var order_type = '';
                if ($.inArray(value.orders_id + " " + value.order_type, selected_id) > -1) {
                    if (value.ors_type == ORDER_TYPE.PICKUP) {
                        var sum_order_quant = value.quantity;
                        var sum_order_quan_for_delivery = value.qty_for_delivery;
                        if (value.order_type == "Pickup") {
                            type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                            count++;
                            ok_markers_routed.push(markers_routed[type]);
                            order_type = 'P';
                        }
                        else if (value.order_type == "Delivery") {
                            if (sum_order_quan_for_delivery == 0 && value.is_same_day == 0) {
                                check = 0
                                type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                                ok_markers_routed.push(markers_routed[type]);
                                count++;
                            } else if (sum_order_quant != sum_order_quan_for_delivery && value.is_same_day == 0) {
                                type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                                count++;
                                ok_markers_routed.push(markers_routed[type]);
                            } else {
                                type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                                count++;
                                ok_markers_routed.push(markers_routed[type]);
                            }
                            order_type = 'D';
                        }
                        else {
                            type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                            count++;
                            ok_markers_routed.push(markers_routed[type]);
                            order_type = 'T';
                        }
                    } else if (value.ors_type == ORDER_TYPE.RECEIVE_IN) {
                        var sum_order_quant = value.quantity;
                        var sum_order_quan_for_delivery = value.qty_for_delivery;
                        if (value.order_type == "Delivery") {
                            if (sum_order_quan_for_delivery == 0) {
                                check = 0
                                type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                                ok_markers_routed.push(markers_routed[type]);
                                count++;
                            } else if (sum_order_quant != sum_order_quan_for_delivery) {
                                type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                                count++;
                                ok_markers_routed.push(markers_routed[type]);
                            } else {
                                type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                                count++;
                                ok_markers_routed.push(markers_routed[type]);
                            }
                            order_type = 'D';
                        }
                        else {
                            type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                            count++;
                            ok_markers_routed.push(markers_routed[type]);
                            order_type = 'T';
                        }
                    }
                    else {
                        if (value.t_o_id) {
                            var sum_order_quant = value.quantity;
                            var sum_order_quan_for_delivery = value.qty_for_delivery;
                            if (value.order_type == "Pickup") {
                                type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                                count++;
                                ok_markers_routed.push(markers_routed[type]);
                                order_type = 'P';
                            }
                            else if (value.order_type == "Delivery") {
                                if (sum_order_quan_for_delivery == 0 && value.is_same_day == 0) {
                                    check = 0
                                    type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                                    ok_markers_routed.push(markers_routed[type]);
                                    count++;
                                } else if (sum_order_quant != sum_order_quan_for_delivery && value.is_same_day == 0) {
                                    type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                                    count++;
                                    ok_markers_routed.push(markers_routed[type]);
                                } else {
                                    type = $.inArray(value.orders_id + " " + value.order_type, selected_id);
                                    count++;
                                    ok_markers_routed.push(markers_routed[type]);
                                }
                                order_type = 'D';
                            }
                        }
                    }

                    html_add += '<hr class="hr_polyline_modal"><li><div style="color:' + color + '; border-radius:2px;"><p class="p_polyline_modal"><label>' + count + ') ' + value.orders_id + ' ' + order_type + ' - ' + all_cust[markers_routed[type]] + '</label>, ' + all_addr[markers_routed[type]] + '</p></div></li>';
                    liElm = $('<li>').append($('<div>', { 'style': 'color:' + color + ';' + 'border-radius:2px;' }).append($('<p>', { class: 'p_polyline_modal' }).append($('<label>', { text: count + ') ' + value.orders_id + ' ' + order_type + ' - ' + all_cust[markers_routed[type]] }), ', ' + all_addr[markers_routed[type]])));
                    ulElm.append($('<hr>', { class: 'hr_polyline_modal' }), liElm);
                }
            });
        });

        html_add += '</ul>';
        $(".polyline_assign_button").prop("disabled", true);
        htmlDiv = pColElm[0].outerHTML + textElm[0].outerHTML + truckSpecElm[0].outerHTML + ulElm[0].outerHTML;
        $('#polyline_selected_orders').html(htmlDiv);
        $("#assign_route_modal").modal("show");
        $('#truck_polyline_choose').select2({
            width: '100%',
            allowClear: true,
            placeholder: '--Choose a Truck --',
            ajax: {
                url: truckListSelect2Url,
                error: function (jqXHR, exception) {
                    active_xhr = false;
                },
                data: function (params) {
                    var query = {
                        term: params.term,
                        page: params.page || 1,
                        size: 10
                    }
                    return query;
                },
                processResults: function (data, params) {
                    return {
                        results: data.results,
                        pagination: {
                            more: data.pagination.more
                        }
                    };
                }
            }
        }).on("change", function (e) {
            var select_val = e.currentTarget;
            var id = $(select_val).val();
            var date = $('#save_truck_date').val();
            var used_vol = 0;
            var pieces = 0;
            var weight = 0;
            var max_weight = 0;
            var max_vol = 0;
            $.ajax({
                type: "GET",
                cache: false,
                url: truckDetailsUrl + "/" + id + "/" + date,
                success: function (data) {
                    $("#truck_error_polyline").html("");
                    $(".polyline_assign_button").prop("disabled", false);

                    used_vol = $('.t_no_' + id + '_vol').html();
                    if (typeof used_vol == 'undefined') {
                        used_vol = 0;
                    }
                    pieces = $('.t_no_' + id + '_pieces').html();
                    if (typeof pieces == 'undefined') {
                        pieces = 0;
                    }
                    weight = $('.t_no_' + id + 'wt').html();
                    if (typeof weight == 'undefined') {
                        weight = 0;
                    }
                    max_weight = data.data.max_weight;
                    max_vol = data.data.max_volume;
                    $("#truck_specification_modal").css("display", "block");
                    check_vol_weight(used_vol, weight, max_vol, max_weight);
                }
            });
        }).on("select2:unselect", function (e) {
            $("#truck_error_polyline").html("Please select truck to assign orders.");
            $(".polyline_assign_button").prop("disabled", true);

            $("#truck_specification_modal").css("display", "none");
        });
    }

    $("#btn_cnf_update").on('click', function () {
        $(this).attr('disabled', 'disabled');
        var is_valid_form = $("#prpi_form").validationEngine('validate');
        if (is_valid_form) {
            $.ajax({
                type: "POST",
                headers: {
                    'X-CSRF-TOKEN': $('input[name="_token"]').val()
                },
                data: { 'formData': $("#prpi_form").serialize() },
                url: updatePartialOrderItemsUrl,
                success: function (data) {
                    showFlashModal(data.status, data.message);
                    $("#update_items").modal('hide');
                    var assign_type = $("#partial_assign_type").val();
                    var partial_order = $("#partial_assign_order").val();
                    var cnt = $("#partial_assign_num").val();
                    var loc_name = $("#partial_assign_loc").val();
                    var truc_num = $("#partial_assign_truc_num").val();
                    if (assign_type == 'sidebar') {
                        $.each(orders_json[loc_name], function (key, value) {
                            if (partial_order.indexOf(value.o_id) != -1) {
                                orders_json[loc_name][key].qty_for_delivery = orders_json[loc_name][key].quantity;
                            }
                        });
                        assign_order_from_sidebar(loc_name, truc_num, cnt);
                        reset('sidebar_list', cnt);
                        var sub_order_list = $('#sub_orders_' + cnt).children().length;
                        if (sub_order_list) {
                            $('.order_numbers' + cnt).html(sub_order_list);
                        }
                    }
                    if (assign_type == "polyline") {
                        assign_order_for_polyline();
                    }
                    $("#partial_assign_type").val('');
                    $("#partial_assign_order").val('');
                    $("#partial_assign_loc").val('');
                    $("#partial_assign_truc_num").val('');
                    $("#partial_assign_num").val('');
                    $("#btn_cnf_update").prop('disabled', false);
                }
            });
        }
        else {
            $("#btn_cnf_update").prop('disabled', false);
        }

    });

    function makeTruckMarker_new(lat, lng, name_n, tr_id, tr_color) {
        const svgMarker = {
            path: "M0.975,0.687 h-0.025 V0.475 c0,-0.025,-0.008,-0.049,-0.022,-0.066 L0.772,0.215 c-0.014,-0.018,-0.033,-0.028,-0.053,-0.028 H0.65 V0.094 c0,-0.052,-0.034,-0.094,-0.075,-0.094 H0.075 C0.034,0,0,0.042,0,0.094 v0.624 c0,0.052,0.034,0.094,0.075,0.094 h0.025 c0,0.104,0.067,0.188,0.15,0.188 s0.15,-0.084,0.15,-0.187 h0.2 c0,0.104,0.067,0.188,0.15,0.188 s0.15,-0.084,0.15,-0.187 h0.075 c0.014,0,0.025,-0.014,0.025,-0.031 v-0.062 c0,-0.017,-0.011,-0.031,-0.025,-0.031 M0.25,0.904 c-0.041,0,-0.075,-0.042,-0.075,-0.094 s0.034,-0.094,0.075,-0.094 s0.075,0.042,0.075,0.094 s-0.034,0.094,-0.075,0.094 m0.5,0 c-0.041,0,-0.075,-0.042,-0.075,-0.094 s0.034,-0.094,0.075,-0.094 s0.075,0.042,0.075,0.094 s-0.034,0.094,-0.075,0.094 m0.125,-0.405 H0.65 V0.28 h0.069 l0.156,0.195 V0.499",
            fillColor: tr_color,
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 35,
            scaledSize: new google.maps.Size(50, 50),
        };

        var myLatLng = { lat: lat, lng: lng };
        var marker_trucks = google.maps.marker.AdvancedMarkerElement({
            id: tr_id,
            position: new google.maps.LatLng(lat, lng),
            map: map,
            title: 'Truck Name : ' + name_n,
            icon: svgMarker,
        });
        markers.push(marker_trucks);
        google.maps.event.addListener(marker_trucks, 'dblclick', function () {
            map.panTo(this.getPosition());
            map.setZoom(18);
        });
    }

    function addMinutes(timeString, addMinutes, hourFormat) {
        if (!timeString.match(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)) {
            return null;
        }
        var timeSplit = timeString.split(':');
        var hours = parseInt(timeSplit[0]);
        var minutes = parseInt(timeSplit[1]) + parseInt(addMinutes);
        hours += Math.floor(minutes / 60);
        while (hours >= 24) {
            hours -= 24;
        }
        minutes = minutes % 60;
        var time = ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2);

        switch (hourFormat) {
            case '24':
                return time;

            default:
                if (hours == 12) {
                    return "12:" + ('0' + minutes).slice(-2) + " PM";
                } else if (hours > 12) {
                    hours = hours % 12;
                    return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + " PM";
                } else {
                    return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + " AM";
                }
                break;
        }
    }

    function assign_order_to_truck(order_number, truck_number, list_no, auto_assign_check = false) {
        console.log('function call');
        var truck_json = JSON.parse(trucks_orders_json);
        $('.No-trucks-div').hide();
        $('.trucks_div').show();
        $('#changed').val(1);
        // console.log('making truck order boxed dynamically');
        if (typeof (truck_json[truck_number]) == "undefined" || $('.t_no_' + truck_number).length == 0) {
            console.log('check 1')
            if (truck_json == "") {
                $('.trucks_div').html("");
            }
            var date = $('#save_truck_date').val();
            $.ajax({
                type: "GET",
                cache: false,
                async: false,
                url: truckDetailsUrl + "/" + truck_number + "/" + date,
                success: function (data) {
                    var weight = 0;
                    var cubes = 0;
                    var quantity = 0;
                    var total_labels_in_new_truck = 0;
                    var scanned_labels_in_new_truck = 0;
                    var t_order_service_time = (data.data.t_order_service_time) ? data.data.t_order_service_time : 20;
                    var t_start_time = (data.data.t_start_time) ? data.data.t_start_time : "08:00:00";
                    t_start_time = t_start_time.split(":")[0] + ":" + t_start_time.split(":")[1];
                    $.each(orders_json[order_number], function (key, value) {
                        weight = weight + parseInt(value.order_weight);
                        cubes = cubes + parseInt(value.total_cubes);
                        quantity = quantity + parseInt(value.quantity);
                        if (value.total_labels_in_order != undefined) {
                            total_labels_in_new_truck += parseInt(value.total_labels_in_order);
                        } else {
                            if (value.order_type == 'Transfer') {
                                total_labels_in_new_truck += parseInt(value.quantity);
                                value.total_labels_in_order = parseInt(value.quantity);
                            } else {
                                value.total_labels_in_order = 0;
                                value.scanned_labels_in_order = 0;
                            }
                        }
                        if (value.scanned_labels_in_order != undefined && value.truck_number != undefined && value.truck_number == truck_number) {
                            scanned_labels_in_new_truck += parseInt(value.scanned_labels_in_order);
                        }
                    });
                    if (data.data.is_ended) {
                        showFlashModal(false, "This route has ended. You Cannot add orders to an ended route!");
                        if ($('.trucks_div').children().length == 0) {
                            $('.No-trucks-div').show();
                            $('.trucks_div').hide();
                        }
                        set_status(0);
                        return false;
                    }
                    if (!auto_assign_check) {
                        if (weight > parseInt(data.data.max_weight)) {
                            showFlashModal(false, "This Order's Weight exceeds the remaining weight in the truck");
                            if ($('.trucks_div').children().length == 0) {
                                $('.No-trucks-div').show();
                                $('.trucks_div').hide();
                            }
                            set_status(0);
                            return false;
                        } else {
                            if (typeof $('.t_no_' + truck_number + 'wt').html() == "undefined") {
                                var wt = 0;
                            } else {
                                var wt = parseInt($('.t_no_' + truck_number + 'wt').html());
                            }
                            set_status(1);
                            weight1 = parseInt(weight) + wt;
                        }
                        if (cubes > parseInt(data.data.max_volume)) {
                            showFlashModal(false, "This Order's volume exceeds the remaining volume in the truck");
                            if ($('.trucks_div').children().length == 0) {
                                $('.No-trucks-div').show();
                                $('.trucks_div').hide();
                            }
                            set_status(0);
                            return false;
                        } else {
                            if (typeof $('.t_no_' + truck_number + '_vol').html() == "undefined") {
                                var vol = 0;
                            } else {
                                var vol = parseInt($('.t_no_' + truck_number + '_vol').html());
                            }
                            cubes1 = parseInt(cubes) + vol;
                            set_status(1);
                        }
                    } else {
                        if (typeof $('.t_no_' + truck_number + 'wt').html() == "undefined") {
                            var wt = 0;
                        } else {
                            var wt = parseInt($('.t_no_' + truck_number + 'wt').html());
                        }
                        set_status(1);
                        weight1 = parseInt(weight) + wt;
                        if (typeof $('.t_no_' + truck_number + '_vol').html() == "undefined") {
                            var vol = 0;
                        } else {
                            var vol = parseInt($('.t_no_' + truck_number + '_vol').html());
                        }
                        cubes1 = parseInt(cubes) + vol;
                        set_status(1);
                    }
                    var routes = $('.scheduled_routes_box').html();
                    if (data.data.driver == "") {
                        var driver_str = "<a href='Javascript:void(0)' class='add-driver-to-truck' data-truck-number='" + data.data.t_id + "'><i class='fa fa-plus'></i></a>";
                    } else {
                        var driver_str = data.data.driver + " <a href='Javascript:void(0)' class='remove-driver' data-truck-number='" + data.data.t_id + "'><i class='fa fa-trash'></i></a>";

                        drivers_json[data.data.t_id] = data.data.driver;
                    }
                    driverElm = $('<a>', {
                        class: 'add-driver-to-truck',
                        href: 'Javascript:void(0)',
                        'data-truck-number': data.data.t_id
                    }).append($('<i>', { class: 'fa fa-plus' }));
                    if (data.data.helper == "") {
                        var helper_str = "<a href='Javascript:void(0)' class='add-helper-to-truck' data-truck-number='" + data.data.t_id + "'><i class='fa fa-plus'></i></a>";
                    } else {
                        var helper_str = data.data.helper + " <a href='Javascript:void(0)' class='remove-helper' data-truck-number='" + data.data.t_id + "'> <i class='fa fa-trash'></i></a>";

                        helpers_json[data.data.t_id] = data.data.helper;
                    }
                    helperElm = $('<a>', {
                        class: 'add-helper-to-truck',
                        href: 'Javascript:void(0)',
                        'data-truck-number': data.data.t_id
                    }).append($('<i>', { class: 'fa fa-plus' }));
                    $('.scheduled_routes_box').html(parseInt(routes) + 1);
                    if (data.data.is_ended) {
                        endedElm = $('<span>', {
                            class: 'text text-danger msg_ended',
                            text: '(Ended)'
                        });
                        var ended = "<span class='text text-danger msg_ended'>(Ended)</span>"
                    } else {
                        var ended = "";
                    }


                    var truck_start_address = truck_end_address = truck_start_lat = truck_start_lng = "";

                    if (data.data.s_addressline1) {
                        truck_start_address += data.data.s_addressline1;
                    }
                    if (data.data.s_addressline2) {
                        truck_start_address += ', ' + data.data.s_addressline2;
                    }
                    if (data.data.s_city) {
                        truck_start_address += ', ' + data.data.s_city;
                    }
                    if (data.data.s_state) {
                        truck_start_address += ', ' + data.data.s_state;
                    }
                    if (data.data.s_zipcode) {
                        truck_start_address += ', ' + data.data.s_zipcode;
                    }
                    if (!(data.data.s_latitude == null || data.data.s_latitude == "null" || data.data.s_longitude == null || data.data.s_longitude == "null")) {
                        truck_start_lat = data.data.s_latitude;
                        truck_start_lng = data.data.s_longitude;
                    }
                    else {
                        geocoder = new google.maps.Geocoder();
                        geocoder.geocode({
                            'address': truck_start_address
                        }, function (results, status) {
                            truck_start_lat = results[0].geometry.location.lat();
                            truck_start_lng = results[0].geometry.location.lng();
                        });
                    }
                    var time_window = '';
                    // console.log(`total_labels_in_new_truck : ${total_labels_in_new_truck} , scanned_labels_in_new_truck : ${scanned_labels_in_new_truck}`);
                    // var sortBtnElm = $('<div>', { class: 'empty_label_div_' + data.data.t_id });
                    // if (total_labels_in_new_truck != 0) {
                        //     sortBtnElm.append(
                            //         $('<div>', { class: 'label_scan main_div_label_' + data.data.t_id }).text('Scanned transfer labels : ')
                                //             .append($('<span>', { class: 'label_heighlight' })
                                    //                 .append($('<span>', { class: 'scanned_label_count_' + data.data.t_id }).text(scanned_labels_in_new_truck))
                                    //                 .text('/')
                                    //                 .append($('<span>', { class: 'label_count_' + data.data.t_id, text: total_labels_in_new_truck }))
                                //             )
                    //     )
                    // }
                    // var sort_btn = (total_labels_in_new_truck == 0) ? '<div class="empty_label_div_' + data.data.t_id + '"></div>' : '<div class="empty_label_div' + data.data.t_id + '"><div class="label_scan main_div_label_' + data.data.t_id + '">Scanned transfer labels : <span class="label_heighlight"><span class="scanned_label_count_' + data.data.t_id + '">' + scanned_labels_in_new_truck + '</span>/<span class="label_count_' + data.data.t_id + '">' + total_labels_in_new_truck + '</span></div></div>';
                    sort_btn = '<div class="toa-sort-orders" data-truck-number = "' + data.data.t_id + '"><small class="short-dist bg-info">Shortest Distance</small><small class="rev-route bg-info">Reverse Routes</small><small class="calc-time-truck bg-info" data-truck-id = "' + data.data.t_id + '">Calc. Time</small></div>';
                    var lockElm = $('<i>', { class: 'fa fa-unlock fa-sm' });
                    var lock_str = '<i class="fa fa-unlock fa-sm"></i>';

                    var saveSingleElm = $('<i>', { class: 'fa fa-floppy fa-sm' });
                    var save_single = '<i class="fa fa-floppy fa-sm"></i>';

                    var swapTruckElm = $('<i>', { class: 'fa fa-exchange fa-sm' });
                    var swap_truck = '<i class="fa fa-exchange fa-sm"></i>';


                    var truckDivUnsaved = $('<div>', {
                        class: 'panel panel-dark t_no_' + data.data.t_id,
                        'data-is-locked': "0",
                        'data-is-ended': data.is_ended,
                        'data-is-started': data.data.day_started_at,
                        'data-start-lat': truck_start_lat,
                        'data-start-lng': truck_start_lng,
                        'data-start-address': truck_start_address,
                        'data-temp': "1"
                    });

                    var headingDiv = $('<div>', {
                        class: "panel-heading",
                        'truck-color': data.data.t_color,
                        'style': 'background-color:' + data.data.t_color
                    }).append($('<h3>', {
                        class: 'panel-title',
                        'style': 'font-weight:600',
                        text: data.data.t_name + " " + ended
                    }), $('<ul>', {
                        class: 'pull-right truck--actions--list'
                    }).append($('<li>').append($('<span>', {
                        class: "clickable"
                    }).append($('<i>', {
                        class: 'fa fa-chevron-down fa-sm'
                    })))));
                    truckDivUnsaved.append(headingDiv)


                    var actionBtnElm = $('<div>', {
                        class: 'panel-heading btn-actions',
                        'truck-color': data.data.t_color,
                        'style': 'background-color:#baba9b'
                    }).append($('<ul>', { class: 'truck--actions--list', 'style': 'margin-left:auto;' })
                        .append($('<li>', { class: '' }).append($('<span>').append($('<a>', {
                            class: 'lock-truck',
                            'data-is-local': '1',
                            'data-is-locked': '0',
                            'data-truck-id': data.data.t_id,
                            'title': 'Lock Truck'
                        }).append(lockElm))))
                        .append($('<li>', { class: '' }).append($('<span>').append($('<a>', {
                            class: 'save-single-route',
                            href: 'Javascript:void(0)',
                            'data-truck-id': data.data.t_id,
                            'title': 'Save This Route'
                        }).append(saveSingleElm))))
                        .append($('<li>', { class: '' }).append($('<span>').append($('<a>', {
                            class: 'swap-truck',
                            'title': 'Swap Truck Orders',
                            'data-truck-name': data.data.t_name,
                            'data-truck-id': data.data.t_id,
                            href: 'Javascript:void(0)',
                        }).append(swapTruckElm)))));
                    truckDivUnsaved.append(actionBtnElm);
                    var truckFunctions = $('<div>', { class: 'toa-sort-orders', 'data-truck-number': data.data.t_id }).append(
                        $('<small>', { class: 'short-dist bg-info', text: 'Shortest Distance' }),
                        $('<small>', { class: 'rev-route bg-info', text: 'Reverse Routes' }),
                        $('<small>', { class: 'calc-time-truck bg-info', 'data-truck-id': data.data.t_id, text: 'Calc. Time' })
                    );

                    var truckPannelBody = $('<div>', { class: 'panel-body' });
                    var truckDetailsElement = $('<ul>', { class: 'truck-stats-info' })
                        .append(
                            $('<li>').append($('<span>', { text: 'Vol: ' }).append($('<strong>').append($('<span>', { class: 't_no_' + data.data.t_id + '_vol', text: cubes1 })).text(parseInt(cubes1) + '/').append($('<span>', { class: 't_no_' + data.data.t_id + '_max_vol', text: parseInt(data.data.max_volume) })))),
                            $('<li>').append($('<span>', { text: 'Weight: ' }).append($('<strong>').append($('<span>', { class: 't_no_' + data.data.t_id + 'wt', text: weight1 })).text(parseInt(weight1) + '/').append($('<span>', { class: 't_no_' + data.data.t_id + '_max_wt', text: parseInt(data.data.max_weight) })))),
                            $('<li>').append($('<span>', { text: 'Pieces: ' }).append($('<strong>').append($('<span>', { class: 't_no_' + data.data.t_id + '_pieces', text: parseInt(quantity) })))),
                            $('<li>'),
                            $('<li>').append($('<span>', { text: 'Driver: ' }).append($('<strong>').append($('<a>', { href: 'Javascript:void(0)' }).append($('<i>', { class: 'fa fa-user' }), data.data.driver, ' ', driverElm)))),
                            $('<li>').append($('<span>', { text: 'Started at: ' }).append($('<strong>', { text: data.data.day_ended_at }))),
                            $('<li>').append($('<span>', { text: 'Helper: ' }).append($('<strong>').append(data.data.helper, ' ', helperElm))),
                            $('<li>').append($('<span>', { text: 'Ended at: ' }).append($('<strong>', { text: data.data.day_started_at }))),
                        );
                    // truckPannelBody.append(truckDetailsElement, truckFunctions, sortBtnElm);
                    truckPannelBody.append(truckDetailsElement, truckFunctions);

                    var assignedTruckListElement = $('<ul>', {
                        class: 'truck-orders-addresses collapses can_assign t_o_no_' + truck_number,
                        'data-t_order_service_time': t_order_service_time,
                        'data-t_start_time': t_start_time
                    });
                    //<ul class='truck-orders-addresses collapses can_assign t_o_no_' + truck_number + '" data-t_order_service_time="' + t_order_service_time + '" data-t_start_time="' + t_start_time + '">
                    // <li><span>Vol: <strong><span class="t_no_' + data.data.t_id + '_vol">' + parseInt(cubes1) + '</span>/<span class="t_no_' + data.data.t_id + '_max_vol">' + parseInt(data.data.max_volume) + '</span></strong></span></li><li><span>Weight: <strong><span class="t_no_' + data.data.t_id + 'wt">' + parseInt(weight1) + '</span>/<span class="t_no_' + data.data.t_id + '_max_wt">' + parseInt(data.data.max_weight) + '</span></strong></span></li><li><span>Pieces: <strong><span class="t_no_' + data.data.t_id + '_pieces">' + parseInt(quantity) + '</span></strong></span></li><li></li><li><span>Driver: <strong><a href="Javascript:void(0)"><i class="fa fa-user"></i> ' + driver_str + '</a></strong></span></li><li><span>Started: <strong>' + data.data.day_started_at + '</strong></span></li><li><span>Helper: <strong><a href="#">' + helper_str + '</a></strong></span></li><li><span>Ended at: <strong>' + data.data.day_ended_at + '</strong></span></li></ul> + sort_btn + <ul class='truck-orders-addresses collapses can_assign t_o_no_' + truck_number + '" data-t_order_service_time="' + t_order_service_time + '" data-t_start_time="' + t_start_time + '">
                    // var html_str = '<div class="panel panel-dark t_no_' + data.data.t_id + '" data-is-locked="0" data-is-ended="' + data.data.is_ended + '" data-is-started="' + data.data.day_started_at + '" data-start-lat = "' + truck_start_lat + '" data-start-lng = "' + truck_start_lng + '" data-start-address="' + truck_start_address + '" data-temp="1"><div class="panel-heading" truck-color="' + data.data.t_color + '" style="background-color:' + data.data.t_color + '"><h3 class="panel-title" style="font-weight:600" >' + data.data.t_name + " " + ended + '</h3><ul class="pull-right truck--actions--list"><li><span class="clickable"><i class="fa fa-chevron-down fa-sm"></i></span></li></ul></div><div class="panel-heading btn-actions" truck-color="' + data.data.t_color + '" style="background-color:#baba9b"><ul class="truck--actions--list" style="margin-left: auto;"><li><span class=""><a class="lock-truck" data-is-local="1" data-is-locked="0" data-truck-id = "' + data.data.t_id + '" title="Lock Truck" href="Javascript:void(0)">' + lock_str + '</a></span></li><li><span class=""><a class="save-single-route" title="Save This Route" data-truck-id = "' + data.data.t_id + '" href="Javascript:void(0)">' + save_single + '</a></span></li><li style="display:none;"><span class="clickable eye"><i class="fa fa-eye fa-sm"></i></span></li><li style="display:none;"><span class="clickable log" ><i class="fa fa-file fa-sm"></i></span></li><li style="display:none;"><span class="clickable lock"><i class="fa fa-lock fa-sm"></i></span></li><li><span class=""><a class="swap-truck" title="Swap Truck Orders" data-truck-name="' + data.data.t_name + '" data-truck-id = "' + data.data.t_id + '" href="Javascript:void(0)">' + swap_truck + '</a></span></li></ul></div><div class="panel-body"><ul class="truck-stats-info"><li><span>Vol: <strong><span class="t_no_' + data.data.t_id + '_vol">' + parseInt(cubes1) + '</span>/<span class="t_no_' + data.data.t_id + '_max_vol">' + parseInt(data.data.max_volume) + '</span></strong></span></li><li><span>Weight: <strong><span class="t_no_' + data.data.t_id + 'wt">' + parseInt(weight1) + '</span>/<span class="t_no_' + data.data.t_id + '_max_wt">' + parseInt(data.data.max_weight) + '</span></strong></span></li><li><span>Pieces: <strong><span class="t_no_' + data.data.t_id + '_pieces">' + parseInt(quantity) + '</span></strong></span></li><li></li><li><span>Driver: <strong><a href="Javascript:void(0)"><i class="fa fa-user"></i> ' + driver_str + '</a></strong></span></li><li><span>Started: <strong>' + data.data.day_started_at + '</strong></span></li><li><span>Helper: <strong><a href="#">' + helper_str + '</a></strong></span></li><li><span>Ended at: <strong>' + data.data.day_ended_at + '</strong></span></li></ul>' + sort_btn + '<ul class="truck-orders-addresses collapses can_assign t_o_no_' + truck_number + '" data-t_order_service_time="' + t_order_service_time + '" data-t_start_time="' + t_start_time + '">'; // last 2  closing div
                    var orders = $('.unassigned_orders_box').html();
                    var img_str = "";
                    var order_eye = "";
                    $('.unassigned_orders_box').html(orders - orders_json[order_number].length);
                    $.each(orders_json[order_number], function (key, value) {
                        order_eye = "<a href='" + orderViewUrl + "/" + value.o_id + "'><i class='fa fa-eye'></i></a>";
                        console.log('has_sameday 1: ', value);
                        if (value.is_same_day > 0) {
                            img_str = "<img title='Has Same Day Delivery Orders' style='width:18px;' src='" + same_day_logo + "' >";
                        } else {
                            img_str = "";
                        }
                        if (value.hasOwnProperty('is_cc_internally_unpaid')) {
                            if (value.is_cc_internally_unpaid == 1) {
                                img_str += '<span class="text-red"><i class="fa fa-dollar"></i></span>';
                            }
                        }

                        var from_terminal = to_terminal = transfer_terms = "";
                        var dateC = $('#save_truck_date').val();
                        var temp_str = "";
                        var customer_name = "";
                        var obj;
                        var info_data = '';
                        if (value.order_type == "Pickup") {
                            if (!(typeof (value.origin_company_name) == "undefined" || value.origin_company_name == "null" || value.origin_company_name == null || value.origin_company_name == "")) {
                                customer_name = escapeHtmlAlternate(value.origin_company_name);
                            }
                            var type_head = "P";

                            obj = { lat: value.origin_lat, lng: value.origin_lng };

                            temp_str = value.o_id + type_head;
                            markers_assigned_to_trucks_local.push(temp_str);
                            var order_type = "Pickup";
                            var addr = '';
                            var transfer_id = '';
                            var time_window = '';
                            if (value.origin_addressline1) {
                                addr += value.origin_addressline1;
                            }
                            if (value.origin_addressline2) {
                                addr += ', ' + value.origin_addressline2;
                            }
                            if (value.origin_city) {
                                addr += ', ' + value.origin_city;
                            }
                            if (value.origin_state) {
                                addr += ', ' + value.origin_state;
                            }
                            if (value.origin_zip) {
                                addr += ', ' + value.origin_zip;
                            }
                            if (value.scheduled_pickup_window) {
                                time_window = value.scheduled_pickup_window;
                            }

                            info_data += '<label>' + value.orders_id + ' ' + type_head + ' - ' + value.origin_company_name + '</label><p>' + addr + '</p><p>' + value.origin_contact_phone +/*'V-'+value_inner.total_cubes+' W-'+value_inner.order_weight+' P-'+value_inner.quantity+*/'</p>';
                            const infowindow1 = new google.maps.InfoWindow({
                                content: info_data,
                            });

                        } else if (value.order_type == "Transfer") {
                            if (!(typeof (value.dest_warehouse_info[0].company_name) == "undefined" || value.dest_warehouse_info[0].company_name == "null" || value.dest_warehouse_info[0].company_name == null || value.dest_warehouse_info[0].company_name == "")) {
                                customer_name = escapeHtmlAlternate(value.dest_warehouse_info[0].company_name);
                            }
                            obj = { lat: value.dest_warehouse_info[0].lat, lng: value.dest_warehouse_info[0].lng };

                            var from_terminal = get_active_warehouse(value.from_terminal, 'warehouse_initials');
                            var to_terminal = get_active_warehouse(value.to_terminal, 'warehouse_initials');
                            var transfer_terms = "TID #" + value.transfer_id + " " + from_terminal + ' - ' + to_terminal;
                            var type_head = "T";
                            temp_str = value.o_id + type_head + value.transfer_id;
                            markers_assigned_to_trucks_local.push(temp_str);
                            var order_type = "Transfer";
                            var transfer_id = value.transfer_id;
                            var addr = '';
                            var addr1 = '';
                            var time_window = '';
                            if (value.dest_warehouse_info[0].addressline1) {
                                addr1 += value.dest_warehouse_info[0].addressline1;
                            }
                            if (value.dest_warehouse_info[0].addressline2) {
                                addr1 += ', ' + value.dest_warehouse_info[0].addressline2;
                            }
                            if (value.dest_warehouse_info[0].city) {
                                addr1 += ', ' + value.dest_warehouse_info[0].city;
                            }
                            if (value.dest_warehouse_info[0].state) {
                                addr1 += ', ' + value.dest_warehouse_info[0].state;
                            }
                            if (value.dest_warehouse_info[0].zipcode) {
                                addr1 += ', ' + value.dest_warehouse_info[0].zipcode;
                            }
                            if (value.dest_addressline1) {
                                addr += value.dest_addressline1;
                            }
                            if (value.dest_addressline2) {
                                addr += ', ' + value.dest_addressline2;
                            }
                            if (value.dest_city) {
                                addr += ', ' + value.dest_city;
                            }
                            if (value.dest_state) {
                                addr += ', ' + value.dest_state;
                            }
                            if (value.dest_zip) {
                                addr += ', ' + value.dest_zip;
                            }
                            if (value.t_sch_window) {
                                time_window = value.t_sch_window;
                            }
                            var loc_new_name = order_number;

                            info_data += '<label>' + value.orders_id + ' ' + type_head + ' [' + from_terminal + ' - ' + to_terminal + '] ' + ' - ' + value.dest_warehouse_info[0].company_name + '</label><p>' + addr1 + '</p><p>' + value.dest_warehouse_info[0].contact_phone + '</p>';
                            const infowindow1 = new google.maps.InfoWindow({
                                content: info_data,
                            });

                        } else {
                            if (!(typeof (value.dest_company_name) == "undefined" || value.dest_company_name == "null" || value.dest_company_name == null || value.dest_company_name == "")) {
                                customer_name = escapeHtmlAlternate(value.dest_company_name);
                            }
                            obj = { lat: value.dest_lat, lng: value.dest_lng };

                            var type_head = "D";
                            temp_str = value.o_id + type_head;
                            markers_assigned_to_trucks_local.push(temp_str);
                            var order_type = "Delivery";
                            var addr = '';
                            var transfer_id = '';
                            var time_window = '';
                            if (value.dest_addressline1) {
                                addr += value.dest_addressline1;
                            }
                            if (value.dest_addressline2) {
                                addr += ', ' + value.dest_addressline2;
                            }
                            if (value.dest_city) {
                                addr += ', ' + value.dest_city;
                            }
                            if (value.dest_state) {
                                addr += ', ' + value.dest_state;
                            }
                            if (value.dest_zip) {
                                addr += ', ' + value.dest_zip;
                            }
                            if (value.scheduled_delivery_window) {
                                time_window = value.scheduled_delivery_window;
                            }

                            info_data += '<label>' + value.orders_id + ' ' + type_head + ' - ' + value.dest_company_name + '</label><p>' + addr + '</p><p>' + value.dest_contact_phone +/*'V-'+value_inner.total_cubes+' W-'+value_inner.order_weight+' P-'+value_inner.quantity+*/'</p>';
                            const infowindow1 = new google.maps.InfoWindow({
                                content: info_data,
                            });

                        }
                        value.truck_order_status = TRUCK_ORDER_STATUS.SCHEDULED;
                        if (data.data.day_started_at != "") {
                            loc_name_assign = value.original_loc_name;
                        } else {
                            if (loc_new_name) {
                                loc_name_assign = loc_new_name;
                            } else {
                                loc_name_assign = loc_new_name = value.origin_loc_name;
                            }
                        }
                        var liElement = $('<li>', {
                            id: 't_o_' + value.orders_id + type_head + transfer_id,
                            class: 'truck_ord_list',
                            'data-pieces': "",
                            'data-cubes-vol': value.total_cubes,
                            'data-weight': value.order_weight,
                            'data-loc': loc_name_assign,
                            'data-order-number': value.orders_id
                        }).append($('<div>', { class: 'dropdown' })
                            .append($('<button>', { class: 'btn btn-sm btn-primary dropdown-toggle', type: 'button', 'data-toggle': 'dropdown' }).append($('<i>', { class: 'fa fa-ellipsis-h' })),
                                $('<ul>', { class: 'dropdown-menu dropdown-menu-right' }).append(
                                    $('<li>').append($('<a>', { class: 'move_button', 'data-truck-number': truck_number, 'data-order-number': value.orders_id + type_head + transfer_id, 'data-loc': order_number, 'data-removed-scanned-label': value.scanned_labels_in_order, 'data-label-in-order': value.total_labels_in_order, 'data-transfer-id': value.transfer_id, href: 'Javascript:void(0);', text: 'Move' })),
                                    $('<li>').append($('<a>', { class: 'edit_order_info', 'data-truck-number': truck_number, 'data-order-number': value.orders_id + type_head + transfer_id, 'data-loc': order_number, 'data-transfer-id': value.transfer_id, href: 'Javascript:void(0);', text: 'Edit Order Info' })),
                                    $('<li>').append($('<a>', { class: 'unassign_button', 'data-stop_num': key, 'data-side': list_no, 'data-loc': order_number, 'data-truck-number': truck_number, 'data-order-number': value.orders_id + type_head + transfer_id, 'data-transfer-id': value.transfer_id, 'data-addr-unassign': addr, 'data-addr-unassign_warehouse': addr1, href: 'Javascript:void(0);', text: 'Unassign' }))
                                )
                            )
                        );
                        var para1Elm = $('<p>', { class: 'toa-order-by' }).append(
                            $('<span>', { class: 'sr-no', text: key + 1 + '.' }),
                            $('<span>', { class: 'order_no', text: value.orders_id }),
                            $('<span>', { class: 'order_type', text: type_head + ' - ' }),
                            $('<span>', { class: 'order-company-name' }).append(customer_name, ' ', img_str, ' ', order_eye)
                        );
                        var para2Elm = $('<p>', { class: 'small' }).append(
                            $('<b>', { text: transfer_terms })
                        );
                        var para3Elm = $('<p>', { class: 'toa-order-address small text-muted', text: addr });
                        var para4Elm = $('<p>', { class: 'toa-order-time small text-muted', 'data-transfer': transfer_id, 'data-remove-scanned-label': value.scanned_labels_in_order, 'data-label-in-order': value.total_labels_in_order, text: time_window });
                        var ordeStatusElm = $('<span>', { class: 'badge btn-primary status_str', text: REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.SCHEDULED] });
                        var inputHiddenElm = $('<input>', { 'type': 'hidden', id: 't_o_json_' + value.orders_id + type_head + transfer_id, value: JSON.stringify(value) })
                        liElement.append(para1Elm, para2Elm, para3Elm, para4Elm, ordeStatusElm, inputHiddenElm);
                        assignedTruckListElement.append(liElement);
                        //<span class="badge btn-primary status_str">' + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.SCHEDULED] + '</span><input type="hidden" id="t_o_json_' + value.orders_id + type_head + transfer_id + '" value=\'' + parsejson(value) + '\'></li>';
                        // html_str += '<li id="t_o_' + value.orders_id + type_head + transfer_id + '" data-pieces="" data-cubes-vol=' + value.total_cubes + ' data-weight="' + value.order_weight + '" data-loc="' + loc_name_assign + '" class="truck_ord_list" data-order-no = "' + value.orders_id + '"><div class="dropdown"><button class="btn btn-sm btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><i class="fa fa-ellipsis-h"></i></button><ul class="dropdown-menu dropdown-menu-right"><li><a class="move_button" data-truck-number="' + truck_number + '" data-order-number="' + value.orders_id + type_head + transfer_id + '" data-loc="' + order_number + '" data-remove-scanned-label = "' + value.scanned_labels_in_order + '" data-label-in-order = "' + value.total_labels_in_order + '" data-transfer-id = "' + value.transfer_id + '" href="Javascript:void(0)">Move</a></li><li><a class="edit_order_info" data-truck-number="' + truck_number + '"  data-order-number="' + value.orders_id + type_head + transfer_id + '" data-transfer-id = "' + value.transfer_id + '" href="Javascript:void(0)">Edit Order Info</a></li><li><a class="unassign_button" data-stop_num="' + key + '" data-side="' + list_no + '" data-loc="' + order_number + '" data-truck-number="' + truck_number + '" data-order-number="' + value.orders_id + type_head + transfer_id + '" data-transfer-id = "' + value.transfer_id + '" data-addr-unassign = "' + addr + '" data-addr-unassign_warehouse="' + addr1 + '" href="Javascript:void(0)">Unassign</a></li></ul></div><p class="toa-order-by"><span class="sr-no">' + (key + 1) + '.</span><span class="order_no">' + value.orders_id + '</span>' + '<span class="order-type">' + type_head + '</span>' + ' - <span class="order-company-name"> ' + customer_name + " " + img_str + ' ' + order_eye + '</span></p><p class="small"><b>' + transfer_terms + '</b></p><p class="toa-order-address small text-muted">' + addr + '</p><p class="toa-order-time small text-muted" data-transfer="' + transfer_id + '" data-remove-scanned-label = "' + value.scanned_labels_in_order + '" data-label-in-order = "' + value.total_labels_in_order + '" >' + time_window + '</p><span class="badge btn-primary status_str">' + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.SCHEDULED] + '</span><input type="hidden" id="t_o_json_' + value.orders_id + type_head + transfer_id + '" value=\'' + parsejson(value) + '\'></li>';
                        if (truck_json == "") {
                            var truck = {};
                            truck[truck_number] = [{
                                'id': value.orders_id,
                                'address': addr,
                                'window': time_window,
                                'type': order_type,
                                'transfer_id': transfer_id,
                                'truck_order_id': value.truck_order_id,
                                'coordinates': obj,
                                'color': data.data.t_color,
                                'info_window_data': info_data,
                                'is_locked': 0
                            }];
                            truck_json = truck;
                        } else {
                            if (typeof truck_json[truck_number] == "undefined") {
                                truck_json[truck_number] = [{
                                    'id': value.orders_id,
                                    'address': addr,
                                    'window': time_window,
                                    'type': order_type,
                                    'transfer_id': transfer_id,
                                    'truck_order_id': value.truck_order_id,
                                    'coordinates': obj,
                                    'color': data.data.t_color,
                                    'info_window_data': info_data,
                                    'is_locked': 0
                                }];
                            } else {
                                truck_json[truck_number].push({
                                    'id': value.orders_id,
                                    'address': addr,
                                    'window': time_window,
                                    'type': order_type,
                                    'transfer_id': transfer_id,
                                    'truck_order_id': value.truck_order_id,
                                    'coordinates': obj,
                                    'color': data.data.t_color,
                                    'info_window_data': info_data,
                                    'is_locked': 0
                                });
                            }
                            trucks_orders_json = truck_json;
                        }
                        if(markerIdForOrders != undefined)
                        google.maps.event.trigger(individual_markers[markerIdForOrders[temp_str]], 'mouseout');
                    });
                    // html_str = html_str + '</ul></div></div>';
                    // $('.trucks_div').append(html_str);
                    truckPannelBody.append(assignedTruckListElement);
                    truckDivUnsaved.append(truckPannelBody);
                    $('.trucks_div').append(truckDivUnsaved);
                    $.each(orders_json[order_number], function (key, value) {
                        if (value.order_type == "Transfer") {
                            $.each($('#transfer-accordion').children(), function (key, value) {
                                if ($(value).find('.assign_btn_' + list_no).attr('data-loc-key') == order_number) {
                                    $.each($('.sub_order_' + list_no), function (k, v) {
                                        if ($(v).is(':checked')) {
                                            var listid = $(this).attr('id');
                                            console.log($('#' + listid).parent().parent().remove());
                                            $('#' + listid).parent().parent().remove();
                                        }
                                    });
                                }
                            });
                            if ($('#sub_orders_' + list_no).children().length == 0) {
                                $('#map-marker-' + list_no).remove();
                            }
                        } else {
                            $.each($('#orders-accordion').children(), function (key, value) {
                                if ($(value).find('.assign_btn_' + list_no).attr('data-loc-key') == order_number) {
                                    $.each($('.sub_order_' + list_no), function (k, v) {
                                        if ($(v).is(':checked')) {
                                            var listid = $(this).attr('id');
                                            $('#' + listid).parent().parent().remove();
                                        }
                                    });
                                }
                            });
                            if ($('#sub_orders_' + list_no).children().length == 0) {
                                $('#map-marker-' + list_no).remove();
                            }
                        }
                    });
                    refresh_unassigned_order();

                    orders_json[order_number] = [];
                    var datep = $('#save_truck_date').val();
                    var Date_today = new Date();
                    var Date_obj = new Date(datep);
                    if (!dateInPast(Date_obj, Date_today)) {
                        $('.t_o_no_' + truck_number).sortable({
                            connectWith: ".collapses.can_assign",
                            containment: "body",
                            dropOnEmpty: true,
                            scroll: false,
                            cancel: ".sorting-disabled",
                            stop: function (e) {
                                var order_list = e.target;
                                var truck_orders = $(order_list).children();
                                var stop = true;
                                $.each(truck_orders, function (k, v) {
                                    var order_no = $(v).attr('data-order-no');
                                    var pick_order_no = "#t_o_" + order_no + "P";
                                    var deli_order_no = "#t_o_" + order_no + "D";
                                    if ($(pick_order_no).length > 0 && $(deli_order_no).length > 0) {
                                        var pick_point = $(pick_order_no).index();
                                        var del_point = $(deli_order_no).index();
                                        if (pick_point > del_point) {
                                            stop = false;
                                        }
                                    }
                                });
                                if (stop == false) {
                                    return false;
                                }
                            },
                            update: function (event, ui) {
                                change_trucks_orders(truck_number);
                                truck_route_number_polyline(truck_number);
                                console.log("CHeck2");
                                $('#changed').val(1)
                            }
                        });
                    }
                    trucks_orders_json = JSON.stringify(truck_json);
                    truck_route_number_polyline(truck_number);
                }
            });

        } else {
            // var have_made_label = ($('.main_div_label_' + truck_number).length != 0) ? true : false;
            var t_order_service_time = ($(".t_o_no_" + truck_number).data('t_order_service_time')) ? ($(".t_o_no_" + truck_number).data('t_order_service_time')) : 20;

            var t_start_time = "08:00";
            var toa_order_time = $(".t_o_no_" + truck_number).find('.toa-order-time').last().text();
            if (toa_order_time) {
                var toa_time_split = toa_order_time.split(" - ");
                if (toa_time_split[1]) {
                    t_start_time = toa_time_split[1].split(" ")[0];
                }
            }
            var max_vol = parseInt($('.t_no_' + truck_number + '_max_vol').html());
            var vol = parseInt($('.t_no_' + truck_number + '_vol').html());
            var vol_left = parseInt(max_vol - vol);
            var max_wt = parseInt($('.t_no_' + truck_number + '_max_wt').html());
            var wt = parseInt($('.t_no_' + truck_number + 'wt').html());
            var wt_left = parseInt(max_wt - wt);
            var in_hand_pcs = parseInt($('.t_no_' + truck_number + '_pieces').html());
            var order_wt = 0;
            var order_vol = 0;
            var inhandpiece = 0;
            // var total_labels_in_new_truck = 0;
            var scanned_labels_in_new_truck = 0;
            $.each(orders_json[order_number], function (key, value) {
                order_wt = order_wt + parseInt(value.order_weight);
                order_vol = order_vol + parseInt(value.total_cubes);
                inhandpiece = inhandpiece + parseInt(value.quantity);
                // total_labels_in_new_truck += parseInt(value.total_labels_in_order);
                // console.log(value.truck_number != undefined && value.truck_number == truck_number);
                // if (value.truck_number != undefined && value.truck_number == truck_number) {
                    //     scanned_labels_in_new_truck += parseInt(value.scanned_labels_in_order);
                // }
            });
            var started = $('.t_no_' + truck_number).attr('data-is-started');
            var no_move = 0;
            if (typeof started != "undefined" && started != "") {
                no_move = 1;
            }
            // if (total_labels_in_new_truck > 0) {
                //     labelDiv = $('<div>',
                    //         {
            //             class: 'label_scan main_div_label_' + truck_number,
                        //             text: 'Scanned transfer labels : '
                    //         }).append(
                        //             $('<span>', { class: 'label_heighlight' }),
                        //             $('<span>', { class: 'scanned_label_count_' + truck_number, text: scanned_labels_in_new_truck }),
                        //             '/',
                        //             $('<span>', { class: 'label_count_' + truck_number, text: total_labels_in_new_truck }));
                //     label_div = '<div class="label_scan main_div_label_' + truck_number + '">Scanned transfer labels : <span class="label_heighlight"><span class="scanned_label_count_' + truck_number + '">' + scanned_labels_in_new_truck + '</span>/<span class="label_count_' + truck_number + '">' + total_labels_in_new_truck + '</span></div>';
                //     $('.empty_label_div_' + truck_number).html(labelDiv);
            // }
            if ($('.t_no_' + truck_number).attr('data-is-locked') == 1) {
                showFlashModal(false, "The Route Is Locked. Kindly Unlock it to assign orders.");
                if ($('.trucks_div').children().length == 0) {
                    $('.No-trucks-div').show();
                    $('.trucks_div').hide();
                }
                set_status(0);
                return false;
            }
            var ended = $('.t_no_' + truck_number).attr('data-is-ended');
            if (ended == 1) {
                showFlashModal(false, "This route has ended. You Cannot add orders to an ended route!");
                if ($('.trucks_div').children().length == 0) {
                    $('.No-trucks-div').show();
                    $('.trucks_div').hide();
                }
                set_status(0);
                return false;
            }
            if (!auto_assign_check) {
                if (order_vol > vol_left) {
                    showFlashModal(false, "This Order's volume exceeds the remaining volume in the truck");
                    set_status(0);
                    return false;
                } else {
                    $('.t_no_' + truck_number + '_vol').html(vol + parseInt(order_vol));
                    set_status(1);
                }
                if (order_wt > wt_left) {
                    showFlashModal(false, "This Order's Weight exceeds the remaining weight in the truck");
                    $('.t_no_' + truck_number + '_vol').html(vol);
                    set_status(0);
                    return false;
                } else {
                    $('.t_no_' + truck_number + 'wt').html(wt + parseInt(order_wt));
                    set_status(1);
                }
            } else {
                $('.t_no_' + truck_number + '_vol').html(vol + parseInt(order_vol));
                $('.t_no_' + truck_number + 'wt').html(wt + parseInt(order_wt));
                set_status(1);
            }
            $('.t_no_' + truck_number + '_pieces').html(in_hand_pcs + inhandpiece);
            var orders = $('.unassigned_orders_box').html();
            $('.unassigned_orders_box').html(orders - orders_json[order_number].length);
            var html_str = "";
            var liElement = '';
            var img_str = "";
            var imgDiv = '';
            var order_eye = "";
            $.each(orders_json[order_number], function (key, value) {
                order_eye = "<a href='" + orderViewUrl + "/" + value.o_id + "'><i class='fa fa-eye'></i></a>";
                console.log('has_sameday 2: ', value);
                if (value.is_same_day > 0) {
                    img_str = "<img title='Has Same Day Delivery Orders' style='width:18px;' src='" + same_day_logo + "' >";
                    imgDiv = $('<img>', { 'title': 'Has Same Day Delivery Orders', 'style': 'width:18px;', 'src': same_day_logo })[0].outerHTML;
                } else {
                    img_str = "";
                }
                if (value.hasOwnProperty('is_cc_internally_unpaid')) {
                    if (value.is_cc_internally_unpaid == 1) {
                        img_str += '<span class="text-red"><i class="fa fa-dollar"></i></span>';
                        imgDiv += $('<span>', { class: 'text-red' }).append($('<i>', { class: 'fa fa-dollar' }))[0].outerHTML;
                    }
                }
                var temp_str = "";
                var dateC = $('#save_truck_date').val();
                var customer_name = "";
                var from_terminal = to_terminal = transfer_terms = "";
                var obj;
                var info_data = '';
                var time_window = '';
                if (value.order_type == "Pickup") {
                    if (!(typeof (value.origin_company_name) == "undefined" || value.origin_company_name == "null" || value.origin_company_name == null || value.origin_company_name == "")) {
                        customer_name = escapeHtmlAlternate(value.origin_company_name);
                    }
                    var type_head = "P";
                    temp_str = value.o_id + type_head;
                    markers_assigned_to_trucks_local.push(temp_str);
                    var addr = '';
                    var order_type = "Pickup";
                    var transfer_id = '';
                    if (value.origin_addressline1) {
                        addr += value.origin_addressline1;
                    }
                    if (value.origin_addressline2) {
                        addr += ', ' + value.origin_addressline2;
                    }
                    if (value.origin_city) {
                        addr += ', ' + value.origin_city;
                    }
                    if (value.origin_state) {
                        addr += ', ' + value.origin_state;
                    }
                    if (value.origin_zip) {
                        addr += ', ' + value.origin_zip;
                    }

                    if (value.scheduled_pickup_window) {
                        time_window = value.scheduled_pickup_window;
                    }

                    obj = { lat: value.origin_lat, lng: value.origin_lng };
                    infoDiv = $('<label>', { text: value.orders_id + ' ' + type_head + ' - ' + value.origin_company_name })[0].outerHTML + $('<p>', { text: addr })[0].outerHTML + $('<p>', { text: value.origin_contact_phone })[0].outerHTML;
                    info_data += '<label>' + value.orders_id + ' ' + type_head + ' - ' + value.origin_company_name + '</label><p>' + addr + '</p><p>' + value.origin_contact_phone +/*'V-'+value_inner.total_cubes+' W-'+value_inner.order_weight+' P-'+value_inner.quantity+*/'</p>';
                    const infowindow1 = new google.maps.InfoWindow({
                        content: infoDiv,
                    });

                } else if (value.order_type == "Transfer") {
                    if (!(typeof (value.origin_company_name) == "undefined" || value.origin_company_name == "null" || value.origin_company_name == null || value.origin_company_name == "")) {
                        customer_name = escapeHtmlAlternate(value.dest_warehouse_info[0].company_name);
                    }
                    var from_terminal = get_active_warehouse(value.from_terminal, 'warehouse_initials');
                    var to_terminal = get_active_warehouse(value.to_terminal, 'warehouse_initials');
                    var transfer_terms = "TID #" + value.transfer_id + " " + from_terminal + ' - ' + to_terminal;
                    var type_head = "T";
                    temp_str = value.o_id + type_head + value.transfer_id;
                    markers_assigned_to_trucks_local.push(temp_str);
                    var order_type = "Transfer";
                    var addr = '';
                    var addr1 = '';
                    var transfer_id = value.transfer_id;
                    if (value.dest_warehouse_info[0].addressline1) {
                        addr1 += value.dest_warehouse_info[0].addressline1;
                    }
                    if (value.dest_warehouse_info[0].addressline2) {
                        addr1 += ', ' + value.dest_warehouse_info[0].addressline2;
                    }
                    if (value.dest_warehouse_info[0].city) {
                        addr1 += ', ' + value.dest_warehouse_info[0].city;
                    }
                    if (value.dest_warehouse_info[0].state) {
                        addr1 += ', ' + value.dest_warehouse_info[0].state;
                    }
                    if (value.dest_warehouse_info[0].zipcode) {
                        addr1 += ', ' + value.dest_warehouse_info[0].zipcode;
                    }
                    if (value.dest_addressline1) {
                        addr += value.dest_addressline1;
                    }
                    if (value.dest_addressline2) {
                        addr += ', ' + value.dest_addressline2;
                    }
                    if (value.dest_city) {
                        addr += ', ' + value.dest_city;
                    }
                    if (value.dest_state) {
                        addr += ', ' + value.dest_state;
                    }
                    if (value.dest_zip) {
                        addr += ', ' + value.dest_zip;
                    }
                    if (value.t_sch_window) {
                        time_window = value.t_sch_window;
                    }
                    var loc_new_name = order_number;

                    obj = { lat: value.dest_warehouse_info[0].lat, lng: value.dest_warehouse_info[0].lng };
                    infoDiv += $('<label>', { text: value.orders_id + ' ' + type_head + ' [' + from_terminal + ' - ' + to_terminal + '] ' + ' - ' + value.dest_warehouse_info[0].company_name })[0].outerHTML + $('<p>', { text: addr1 })[0].outerHTML + $('<p>', { text: value.dest_warehouse_info[0].contact_phone })[0].outerHTML;
                    info_data += '<label>' + value.orders_id + ' ' + type_head + ' [' + from_terminal + ' - ' + to_terminal + '] ' + ' - ' + value.dest_warehouse_info[0].company_name + '</label><p>' + addr1 + '</p><p>' + value.dest_warehouse_info[0].contact_phone + '</p>';
                    const infowindow1 = new google.maps.InfoWindow({
                        content: infoDiv,
                    });

                } else {
                    if (!(typeof (value.dest_company_name) == "undefined" || value.dest_company_name == "null" || value.dest_company_name == null || value.dest_company_name == "")) {
                        customer_name = escapeHtmlAlternate(value.dest_company_name);
                    }
                    var type_head = "D";
                    temp_str = value.o_id + type_head;
                    markers_assigned_to_trucks_local.push(temp_str);
                    var addr = '';
                    var order_type = "Delivery";
                    var transfer_id = '';
                    if (value.dest_addressline1) {
                        addr += value.dest_addressline1;
                    }
                    if (value.dest_addressline2) {
                        addr += ', ' + value.dest_addressline2;
                    }
                    if (value.dest_city) {
                        addr += ', ' + value.dest_city;
                    }
                    if (value.dest_state) {
                        addr += ', ' + value.dest_state;
                    }
                    if (value.dest_zip) {
                        addr += ', ' + value.dest_zip;
                    }

                    var time_window = value.scheduled_delivery_window;
                    if (time_window) {
                        time_window = value.scheduled_delivery_window;
                    }

                    obj = { lat: value.dest_lat, lng: value.dest_lng };
                    infoDiv = $('<label>', { text: value.orders_id + ' ' + type_head + ' - ' + value.dest_company_name })[0].outerHTML + $('<p>', { text: addr })[0].outerHTML + $('<p>', { text: value.dest_contact_phone })[0].outerHTML;
                    info_data += '<label>' + value.orders_id + ' ' + type_head + ' - ' + value.dest_company_name + '</label><p>' + addr + '</p><p>' + value.dest_contact_phone +/*'V-'+value_inner.total_cubes+' W-'+value_inner.order_weight+' P-'+value_inner.quantity+*/'</p>';
                    const infowindow1 = new google.maps.InfoWindow({
                        content: infoDiv,
                    });

                }
                value.truck_order_status = TRUCK_ORDER_STATUS.SCHEDULED;
                var children = $('.t_o_no_' + truck_number).children('li').length;
                var loc_new_name_crm = '';
                if (no_move == 1) {
                    loc_new_name_crm = value.origin_loc_name;
                } else {
                    if (!loc_new_name) {
                        loc_new_name_crm = loc_new_name = value.origin_loc_name;
                    }
                }
                html_str = html_str + '<li id="t_o_' + value.orders_id + type_head + transfer_id + '" data-pieces="" data-cubes-vol=' + value.total_cubes + ' data-weight="' + value.order_weight + '" data-loc="' + loc_new_name_crm + '" class="truck_ord_list"><div class="dropdown"><button class="btn btn-sm btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><i class="fa fa-ellipsis-h"></i></button><ul class="dropdown-menu dropdown-menu-right"><li><a class="move_button" data-truck-number="' + truck_number + '" data-order-number="' + value.orders_id + type_head + transfer_id + '" data-loc="' + order_number + '" data-remove-scanned-label = "' + value.scanned_labels_in_order + '" data-label-in-order = "' + value.total_labels_in_order + '" data-transfer-id = "' + value.transfer_id + '" href="Javascript:void(0)">Move</a></li><li><a class="edit_order_info" data-truck-number="' + truck_number + '"  data-order-number="' + value.orders_id + type_head + transfer_id + '" data-transfer-id = "' + value.transfer_id + '" href="Javascript:void(0)">Edit Order Info</a></li><li><a class="unassign_button" data-stop_num="' + (children + key) + '" data-side="' + list_no + '" data-loc="' + order_number + '" data-truck-number="' + truck_number + '" data-order-number="' + value.orders_id + type_head + transfer_id + '" data-transfer-id = "' + value.transfer_id + '" data-addr-unassign = "' + addr + '" data-addr-unassign_warehouse="' + addr1 + '" href="Javascript:void(0)">Unassign</a></li></ul></div><p class="toa-order-by" id="t_o_' + value.orders_id + type_head + '" data-pieces="" data-cubes-vol=' + value.total_cubes + ' data-weight="' + value.order_weight + '"><span class="sr-no">' + (children + key + 1) + '.</span><span class="order_no">' + value.orders_id + '</span>' + '<span class="order-type">' + type_head + '</span>' + ' - <span class="order-company-name"> ' + customer_name + " " + img_str + ' ' + order_eye + '</span></p><p class="small"><b> ' + transfer_terms + '</b></p><p class="toa-order-address small text-muted">' + addr + '</p><p class="toa-order-time small text-muted" data-transfer="' + transfer_id + '" data-remove-scanned-label = "' + value.scanned_labels_in_order + '" data-label-in-order = "' + value.total_labels_in_order + '">' + time_window + '</p><span class="badge btn-primary status_str">' + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.SCHEDULED] + '</span><input type="hidden" id="t_o_json_' + value.orders_id + type_head + transfer_id + '" value=\'' + parsejson(value) + '\'></li>';

                if(value.scanned_labels_in_order == undefined){
                    value.scanned_labels_in_order = 0
                }
                if(value.total_labels_in_order == undefined){
                    value.total_labels_in_order = 0
                }
                var liElement = $('<li>', {
                    id: 't_o_' + value.orders_id + type_head + transfer_id,
                    class: 'truck_ord_list',
                    'data-pieces': "",
                    'data-cubes-vol': value.total_cubes,
                    'data-weight': value.order_weight,
                    'data-loc': loc_new_name_crm,
                    'data-order-number': value.orders_id
                }).append($('<div>', { class: 'dropdown' })
                    .append($('<button>', { class: 'btn btn-sm btn-primary dropdown-toggle', type: 'button', 'data-toggle': 'dropdown' }).append($('<i>', { class: 'fa fa-ellipsis-h' })),
                        $('<ul>', { class: 'dropdown-menu dropdown-menu-right' }).append(
                            $('<li>').append($('<a>', { class: 'move_button', 'data-truck-number': truck_number, 'data-order-number': value.orders_id + type_head + transfer_id, 'data-loc': order_number, 'data-removed-scanned-label': value.scanned_labels_in_order, 'data-label-in-order': value.total_labels_in_order, 'data-transfer-id': value.transfer_id, href: 'Javascript:void(0);', text: 'Move' })),
                            $('<li>').append($('<a>', { class: 'edit_order_info', 'data-truck-number': truck_number, 'data-order-number': value.orders_id + type_head + transfer_id, 'data-loc': order_number, 'data-transfer-id': value.transfer_id, href: 'Javascript:void(0);', text: 'Edit Order Info' })),
                            $('<li>').append($('<a>', { class: 'unassign_button', 'data-stop_num': key, 'data-side': list_no, 'data-loc': order_number, 'data-truck-number': truck_number, 'data-order-number': value.orders_id + type_head + transfer_id, 'data-transfer-id': value.transfer_id, 'data-addr-unassign': addr, 'data-addr-unassign_warehouse': addr1, href: 'Javascript:void(0);', text: 'Unassign' }))
                        )
                    )
                );
                var para1Elm = $('<p>', { class: 'toa-order-by' }).append(
                            $('<span>', { class: 'sr-no', text: children + key + 1 + '.' }),
                            $('<span>', { class: 'order_no', text: value.orders_id }),
                            $('<span>', { class: 'order_type', text: type_head + ' - ' }),
                            $('<span>', { class: 'order-company-name' }).append(customer_name, ' ', img_str, ' ', order_eye)
                        );
                var para2Elm = $('<p>', { class: 'small' }).append(
                            $('<b>', { text: transfer_terms })
                        );
                var para3Elm = $('<p>', { class: 'toa-order-address small text-muted', text: addr });
                var para4Elm = $('<p>', { class: 'toa-order-time small text-muted', 'data-transfer': transfer_id, 'data-remove-scanned-label': value.scanned_labels_in_order, 'data-label-in-order': value.total_labels_in_order, text: time_window });
                var ordeStatusElm = $('<span>', { class: 'badge btn-primary status_str', text: REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.SCHEDULED] });
                var inputHiddenElm = $('<input>', { 'type': 'hidden', id: 't_o_json_' + value.orders_id + type_head + transfer_id, value: JSON.stringify(value) })
                    liElement.append(para1Elm, para2Elm, para3Elm, para4Elm, ordeStatusElm, inputHiddenElm);
                truck_json[truck_number].push({
                    'id': value.orders_id,
                    'address': addr,
                    'window': time_window,
                    'type': order_type,
                    'transfer_id': transfer_id,
                    'truck_order_id': value.truck_order_id,
                    'coordinates': obj,
                    'color': $('.t_no_' + truck_number).find('.panel-heading').attr('truck-color'),
                    'info_window_data': info_data,
                    'is_locked': $('.t_no_' + truck_number).attr('data-is-locked')
                });
                trucks_orders_json = JSON.stringify(truck_json);
                $('.t_o_no_'+truck_number).append(liElement);
                if(markerIdForOrders != undefined)
                google.maps.event.trigger(individual_markers[markerIdForOrders[temp_str]], 'mouseout');
            });
            // $('.t_o_no_' + truck_number).append(html_str);
            $.each(orders_json[order_number], function (key, value) {
                if (value.order_type == "Transfer") {
                    $.each($('#transfer-accordion').children(), function (key, value) {
                        if ($(value).find('.assign_btn_' + list_no).attr('data-loc-key') == order_number) {
                            $.each($('.sub_order_' + list_no), function (k, v) {
                                if ($(v).is(':checked')) {
                                    var listid = $(this).attr('id');
                                    console.log($('#' + listid).parent().parent().remove());
                                    $('#' + listid).parent().parent().remove();
                                }
                            });
                        }
                    });
                    if ($('#sub_orders_' + list_no).children().length == 0) {
                        $('#map-marker-' + list_no).remove();
                    }
                } else {
                    $.each($('#orders-accordion').children(), function (key, value) {
                        if ($(value).find('.assign_btn_' + list_no).attr('data-loc-key') == order_number) {
                            $.each($('.sub_order_' + list_no), function (k, v) {
                                if ($(v).is(':checked')) {
                                    var listid = $(this).attr('id');
                                    $('#' + listid).parent().parent().remove();
                                }
                            });
                        }
                    });
                    if ($('#sub_orders_' + list_no).children().length == 0) {
                        $('#map-marker-' + list_no).remove();
                    }
                }
            });
            truck_color = $('.t_no_' + truck_number).find('.panel-heading').attr('truck-color');
            refresh_unassigned_order();
            orders_json[order_number] = [];

            truck_route_number_polyline(truck_number);

        }
        if (($('#orders-accordion').find('li').length) == 0) {
            $('.No-orders-div').show();
            $('.orders_div').hide();
        }
        if (($('#transfer-accordion').find('li').length) == 0) {
            $('.No-t-orders-div').show();
            $('.t-orders_div').hide();
        }
        if ($('.check_order_number').length == $('.check_order_number:checked').length) {
            $('#select-all-check').attr("checked", true);
            $('#select-all-check').prop("checked", true);
        }
        $("#assign_route_modal").modal("hide");
        if (markers_routed.length)
            clear_polyline();
        return true;
    }

    function reset(form_id, count) {
        switch (form_id) {
            case "sidebar_list":
                $('#truck_chose_' + count).val(null).trigger('change');
                $('.selected_vol_' + count).html("0");
                $('.selected_wgt_' + count).html("0");
                $('.selected_pcs_' + count).html("0");
                $('.assign_btn_' + count).prop('disabled', true);
        }
    }

    function get_status() {
        return assign_status;
    }
    function set_status(status) {
        assign_status = status;
    }
    function parsejson(json) {
        $.each(json, function (key, value) {
            if (typeof value == "string") {
                json[key] = value.replace(/'/g, '\\"');
            }
        });
        return JSON.stringify(json);
    }

    function refresh_unassigned_order() {
        $.each($('#orders-accordion').children('li'), function (key, value) {
            $(value).find('.Number').html((key + 1) + ".");
            orderid = value.getAttribute('data-marker-id');
            unAssignedId = '#sub_orders_' + orderid;
            // x = $(unAssignedId).length;
            orderCnt = 0
            $.each($(unAssignedId).children('li'), function (key1, value1) {
                orderCnt += 1
            })
            $('.order_numbers' + orderid).html(orderCnt);
        });
        $.each($('#transfer-accordion').children('li'), function (key, value) {
            $(value).find('.Number').html((key + 1) + ".");
        });
    }

    $(".route_type_order_list").on('click', function () {
        var sch_date = $(".orders_date").text();
        sch_date = moment(sch_date, "MM/DD/YYYY").format('YYYY-MM-DD');
        var check = $("#date_switch_done").val();
        $("#date_switch_done").val(0);
        if (check == 1) {
            refresh_list(sch_date);
        }
        else {
            console.log('test 4')
            refresh_list(sch_date, 1);
        }

    })

    function refresh_list(sch_date, check = null) {
        markers = [];
        individual_markers = [];
        all_addr = [];
        all_cust = [];
        all_order_id = [];
        markerIdForOrders = {};
        auto_routes = [];
        markers_routed = [];
        infoWindow_polyline = null;
        markers_routed = [];
        assigned_markers = [];
        var temp_orders_json = {};
        $.ajax({
            type: "GET",
            cache: false,
            url: unassignOrderListUrl + "/" + sch_date,
            beforeSend: function () {
                showLoading("dispatchDashboard_box", '#');
            },
            success: function (data) {
                initmap();
                $('#save_truck_date').val(data.data);
                $('#save_single_truck_date').val(data.data);
                var all_empty = 1;
                var total = 0;
                $('#orders-accordion').html("");
                $('#transfer-accordion').html("");
                $.each(data.orders, function (key, val) {
                    if (val.length > 0) {
                        all_empty = 0;
                        total = total + val.length;
                    }
                });
                if (all_empty == 1) {
                    $('.No-orders-div').show();
                    $('.orders_div').hide();
                    $('.unassigned_orders_box').html(0);
                    if (check) {
                        data.orders = orders_json;
                    } else {
                        orders_json = data.orders;
                    }
                } else {
                    if (check) {
                        data.orders = orders_json;
                    } else {
                        orders_json = data.orders;
                    }
                    var Date_today = new Date();
                    var Date_obj = new Date(sch_date);
                    $('.unassigned_orders_box').html(total);
                    var uo_count = 0;
                    var ut_count = 0;

                    var active_list = 'uo'; //uo = unassigned orders, ut = unassigned transfers
                    $.each($('.route_type_order_list'), function () {
                        if ($(this).hasClass('active')) {
                            active_list = $(this).data('l_type');
                        }
                    });
                    var unassign_orders = [];
                    var unassign_transfers = [];
                    var count = 0;
                    var count1 = 0;
                    var all_address = '';
                    var all_id = '';
                    var all_customer = '';
                    var type3 = '';
                    $.each(data.orders, function (key, value) {
                        var location = [];
                        var promises = [];
                        var count = 0;
                        $.each(value, function (key_inner, value_inner) {
                            var valll = orders_json[key];
                            geocoder = new google.maps.Geocoder();
                            var condition_check = parseInt(value_inner.route_type.toString());
                            switch (condition_check) {
                                case ROUTE_TYPE.Pickup:
                                    if (active_list == 'uo') {
                                        var addr1 = '';
                                        type3 = "P";
                                        if ($.inArray(value_inner.o_id + type3, markers_assigned_to_trucks_local) > -1)
                                            return;
                                        if (value_inner.origin_addressline1) {
                                            addr1 += value_inner.origin_addressline1;
                                        }
                                        if (value_inner.origin_addressline2) {
                                            addr1 += ', ' + value_inner.origin_addressline2;
                                        }
                                        if (value_inner.origin_city) {
                                            addr1 += ', ' + value_inner.origin_city;
                                        }
                                        if (value_inner.origin_state) {
                                            addr1 += ', ' + value_inner.origin_state;
                                        }
                                        if (value_inner.origin_zip) {
                                            addr1 += ', ' + value_inner.origin_zip;
                                        }
                                        var info_data = '';
                                        all_address = addr1;
                                        all_customer = value_inner.origin_company_name;
                                        all_id = value_inner.orders_id + ' ' + value_inner.order_type;
                                        info_data += '<label>' + value_inner.orders_id + ' ' + type3 + ' - ' + value_inner.origin_company_name + '</label><p>' + addr1 + '</p><p>' + value_inner.origin_contact_phone +/*'V-'+value_inner.total_cubes+' W-'+value_inner.order_weight+' P-'+value_inner.quantity+*/'</p>';
                                        const infowindow1 = new google.maps.InfoWindow({
                                            content: info_data,
                                        });
                                        var mlng = value_inner.origin_lng;
                                        var mlat = value_inner.origin_lat;
                                        var type_head = "P";
                                        if (mlng == null || mlng == "" || mlat == null || mlat == "") {
                                            var str = value_inner.origin_addressline1 + "," + value_inner.origin_addressline2 + "," + value_inner.origin_city + "," + value_inner.origin_state + "," + value_inner.origin_zip;
                                            geocoder.geocode({
                                                'address': str
                                            }, function (results, status) {
                                                if (status == google.maps.GeocoderStatus.OK) {
                                                    request = $.ajax({
                                                        type: "POST",
                                                        url: updateDispatchMapCoordsUrl,
                                                        data: {
                                                            'orders_id': value_inner.o_id,
                                                            'route_type': value_inner.route_type,
                                                            'address': str,
                                                            'lat': results[0].geometry.location.lat(),
                                                            'lng': results[0].geometry.location.lng(),
                                                        },
                                                        headers: {
                                                            'X-CSRF-TOKEN': $('input[name="_token"]').val()
                                                        },
                                                        success: function (result) {
                                                        },
                                                        error: function (data) {
                                                            console.log('error', data);
                                                        }
                                                    });
                                                    var new_lat = results[0].geometry.location.lat();
                                                    var new_lng = results[0].geometry.location.lng();
                                                    valll[key_inner].origin_lat = new_lat;
                                                    valll[key_inner].origin_lng = new_lng;
                                                    var marker = google.maps.marker.AdvancedMarkerElement({
                                                        position: new google.maps.LatLng(new_lat, new_lng),
                                                        map: map,
                                                        draggable: true,
                                                        label: "",
                                                        icon: pinSymbolSmall("#FE6256")
                                                    });
                                                    marker.customInfo = value_inner.orders_id + " " + value_inner.order_type;
                                                    marker.addListener("click", () => {

                                                        assign_marker_to_selected_truck(marker);
                                                    });
                                                    var timeout = '';
                                                    marker.addListener("mouseover", () => {
                                                        timeout = setTimeout(function () {
                                                            infowindow1.open({
                                                                anchor: marker,
                                                                map,
                                                            });
                                                        }, 500);
                                                    });
                                                    marker.addListener("mouseout", () => {
                                                        clearTimeout(timeout);
                                                        infowindow1.close();
                                                    });
                                                    marker.addListener("dragend", () => {
                                                        var finalLat = marker.getPosition().lat();
                                                        var finalLng = marker.getPosition().lng();
                                                        let latlng = new google.maps.LatLng(new_lat, new_lng);
                                                        marker.setPosition(latlng);
                                                        check_drag_marker_ending(marker, finalLat, finalLng);
                                                    });
                                                    location.push(marker);
                                                    all_addr.push(value_inner.origin_addressline1 + "," + value_inner.origin_addressline2 + "," + value_inner.origin_city + "," + value_inner.origin_state + "," + value_inner.origin_zip);
                                                    all_cust.push(value_inner.origin_company_name);
                                                    all_order_id.push(value_inner.orders_id + ' ' + value_inner.order_type);
                                                    markerIdForOrders[value_inner.orders_id+value_inner.order_type[0]] = all_order_id.length-1;
                                                    individual_markers.push(marker);

                                                }
                                            });
                                        } else {
                                            var marker = google.maps.marker.AdvancedMarkerElement({
                                                position: new google.maps.LatLng(mlat, mlng),
                                                map: map,
                                                label: "",
                                                draggable: true,
                                                icon: pinSymbolSmall("#FE6256")
                                            });
                                            marker.customInfo = value_inner.orders_id + " " + value_inner.order_type;
                                            marker.addListener("click", () => {
                                                console.log('4');
                                                assign_marker_to_selected_truck(marker);
                                            });
                                            marker.addListener("mouseover", () => {
                                                timeout = setTimeout(function () {
                                                    infowindow1.open({
                                                        anchor: marker,
                                                        map,
                                                    });
                                                }, 500);
                                            });
                                            marker.addListener("mouseout", () => {
                                                clearTimeout(timeout);
                                                infowindow1.close();
                                            });

                                            marker.addListener("dragend", () => {
                                                var finalLat = marker.getPosition().lat();
                                                var finalLng = marker.getPosition().lng();
                                                let latlng = new google.maps.LatLng(mlat, mlng);
                                                marker.setPosition(latlng);
                                                check_drag_marker_ending(marker, finalLat, finalLng);
                                            });
                                            location.push(marker);
                                            all_addr.push(all_address);
                                            all_cust.push(all_customer);
                                            all_order_id.push(all_id);
                                            key_obj = all_id.split(' ')
                                            markerIdForOrders[key_obj[0]+key_obj[1][0]] = all_order_id.length-1;
                                            individual_markers.push(location[location.length - 1]);

                                        }
                                    }
                                    count++;
                                    break;
                                case ROUTE_TYPE.Delivery:
                                    if (active_list == 'uo') { //unassigned orders
                                        var addr1 = '';
                                        type3 = "D";
                                        if ($.inArray(value_inner.o_id + type3, markers_assigned_to_trucks_local) > -1)
                                            return;
                                        if (value_inner.dest_addressline1) {
                                            addr1 += value_inner.dest_addressline1;
                                        }
                                        if (value_inner.dest_addressline2) {
                                            addr1 += ', ' + value_inner.dest_addressline2;
                                        }
                                        if (value_inner.dest_city) {
                                            addr1 += ', ' + value_inner.dest_city;
                                        }
                                        if (value_inner.dest_state) {
                                            addr1 += ', ' + value_inner.dest_state;
                                        }
                                        if (value_inner.dest_zip) {
                                            addr1 += ', ' + value_inner.dest_zip;
                                        }
                                        var info_data = '';
                                        all_address = addr1;
                                        all_customer = value_inner.dest_company_name;
                                        all_id = value_inner.orders_id + ' ' + value_inner.order_type;
                                        info_data += '<label>' + value_inner.orders_id + ' ' + type3 + ' - ' + value_inner.dest_company_name + '</label><p>' + addr1 + '</p><p>' + value_inner.dest_contact_phone + '</p>';
                                        const infowindow1 = new google.maps.InfoWindow({
                                            content: info_data,
                                        });
                                        var mlng = value_inner.dest_lng;
                                        var mlat = value_inner.dest_lat;
                                        var type_head = "D";
                                        if (mlng == null || mlng == "" || mlat == null || mlat == "") {
                                            var str = value_inner.dest_addressline1 + "," + value_inner.dest_addressline2 + "," + value_inner.dest_city + "," + value_inner.dest_state + "," + value_inner.dest_zip;
                                            geocoder.geocode({
                                                'address': str
                                            }, function (results, status) {
                                                if (status == google.maps.GeocoderStatus.OK) {
                                                    request = $.ajax({
                                                        type: "POST",
                                                        url: updateDispatchMapCoordsUrl,
                                                        data: {
                                                            'orders_id': value_inner.o_id,
                                                            'route_type': value_inner.route_type,
                                                            'address': str,
                                                            'lat': results[0].geometry.location.lat(),
                                                            'lng': results[0].geometry.location.lng(),
                                                        },
                                                        headers: {
                                                            'X-CSRF-TOKEN': $('input[name="_token"]').val()
                                                        },
                                                        success: function (result) {
                                                        },
                                                        error: function (data) {
                                                            console.log('error', data);
                                                        }
                                                    });
                                                    var new_lat = results[0].geometry.location.lat();
                                                    var new_lng = results[0].geometry.location.lng();
                                                    valll[key_inner].dest_lat = new_lat;
                                                    valll[key_inner].dest_lng = new_lng;
                                                    var marker = google.maps.marker.AdvancedMarkerElement({
                                                        position: new google.maps.LatLng(new_lat, new_lng),
                                                        map: map,
                                                        label: "",
                                                        draggable: true,
                                                        icon: pinSymbolSmall("#FE6256")
                                                    });
                                                    marker.customInfo = value_inner.orders_id + " " + value_inner.order_type;
                                                    marker.addListener("click", () => {

                                                        assign_marker_to_selected_truck(marker);
                                                    });
                                                    var timeout = '';
                                                    marker.addListener("mouseover", () => {
                                                        timeout = setTimeout(function () {
                                                            infowindow1.open({
                                                                anchor: marker,
                                                                map,
                                                            });
                                                        }, 500);
                                                    });
                                                    marker.addListener("mouseout", () => {
                                                        clearTimeout(timeout);
                                                        infowindow1.close();
                                                    });
                                                    marker.addListener("dragend", () => {
                                                        var finalLat = marker.getPosition().lat();
                                                        var finalLng = marker.getPosition().lng();
                                                        let latlng = new google.maps.LatLng(new_lat, new_lng);
                                                        marker.setPosition(latlng);
                                                        check_drag_marker_ending(marker, finalLat, finalLng);
                                                    });
                                                    location.push(marker);
                                                    all_addr.push(value_inner.dest_addressline1 + "," + value_inner.dest_addressline2 + "," + value_inner.dest_city + "," + value_inner.dest_state + "," + value_inner.dest_zip);
                                                    all_cust.push(value_inner.dest_company_name);
                                                    all_order_id.push(value_inner.orders_id + ' ' + value_inner.order_type);
                                                    markerIdForOrders[value_inner.orders_id+value_inner.order_type[0]] = all_order_id.length-1;
                                                    individual_markers.push(marker);
                                                }
                                            });
                                        } else {
                                            var marker = google.maps.marker.AdvancedMarkerElement({
                                                position: new google.maps.LatLng(mlat, mlng),
                                                map: map,
                                                label: "",
                                                icon: pinSymbolSmall("#FE6256"),
                                                draggable: true,
                                            });
                                            marker.customInfo = value_inner.orders_id + " " + value_inner.order_type;
                                            marker.addListener("click", () => {
                                                assign_marker_to_selected_truck(marker);
                                            });
                                            var timeout = '';
                                            marker.addListener("mouseover", () => {
                                                timeout = setTimeout(function () {
                                                    infowindow1.open({
                                                        anchor: marker,
                                                        map,
                                                    });
                                                }, 500);
                                            });
                                            marker.addListener("mouseout", () => {
                                                clearTimeout(timeout);
                                                infowindow1.close();
                                            });
                                            marker.addListener("dragend", () => {
                                                var finalLat = marker.getPosition().lat();
                                                var finalLng = marker.getPosition().lng();
                                                let latlng = new google.maps.LatLng(mlat, mlng);
                                                marker.setPosition(latlng);
                                                check_drag_marker_ending(marker, finalLat, finalLng);
                                            });
                                            location.push(marker);
                                            all_addr.push(all_address);
                                            all_cust.push(all_customer);
                                            all_order_id.push(all_id);
                                            key_obj = all_id.split(' ');
                                            markerIdForOrders[key_obj[0]+key_obj[1][0]] = all_order_id.length-1;
                                            individual_markers.push(location[location.length - 1]);
                                        }
                                    }
                                    count++;
                                    break;
                                case ROUTE_TYPE.Transfer:
                                    if (active_list == 'ut') {
                                        var addr1 = '';
                                        var addr2 = "";
                                        var type3 = "T";
                                        if ($.inArray(value_inner.o_id + type3 + value_inner.transfer_id, markers_assigned_to_trucks_local) > -1)
                                            return;
                                        if (value_inner.dest_warehouse_info[0].addressline1) {
                                            addr2 += value_inner.dest_warehouse_info[0].addressline1;
                                        }
                                        if (value_inner.dest_warehouse_info[0].addressline2) {
                                            addr2 += ', ' + value_inner.dest_warehouse_info[0].addressline2;
                                        }
                                        if (value_inner.dest_warehouse_info[0].city) {
                                            addr2 += ', ' + value_inner.dest_warehouse_info[0].city;
                                        }
                                        if (value_inner.dest_warehouse_info[0].state) {
                                            addr2 += ', ' + value_inner.dest_warehouse_info[0].state;
                                        }
                                        if (value_inner.dest_warehouse_info[0].zipcode) {
                                            addr2 += ', ' + value_inner.dest_warehouse_info[0].zipcode;
                                        }
                                        if (value_inner.dest_addressline1) {
                                            addr1 += value_inner.dest_addressline1;
                                        }
                                        if (value_inner.dest_addressline2) {
                                            addr1 += ',' + value_inner.dest_addressline2;
                                        }
                                        if (value_inner.dest_city) {
                                            addr1 += ',' + value_inner.dest_city;
                                        }
                                        if (value_inner.dest_state) {
                                            addr1 += ',' + value_inner.dest_state;
                                        }
                                        if (value_inner.dest_zip) {
                                            addr1 += ',' + value_inner.dest_zip;
                                        }
                                        var info_data = '';
                                        all_address = addr2;
                                        all_customer = ' [' + key + '] ' + value_inner.dest_warehouse_info[0].company_name;
                                        all_id = value_inner.orders_id + ' ' + value_inner.order_type;
                                        info_data += '<label>' + value_inner.orders_id + ' ' + type3 + ' [' + key + '] ' + ' - ' + value_inner.dest_warehouse_info[0].company_name + '</label><p>' + addr1 + '</p><p>' + value_inner.dest_warehouse_info[0].contact_phone + '</p>';
                                        const infowindow1 = new google.maps.InfoWindow({
                                            content: info_data,
                                        });
                                        var dlng = value_inner.dest_warehouse_info[0].lng;
                                        var dlat = value_inner.dest_warehouse_info[0].lat;
                                        if (dlng == null || dlng == "" || dlat == null || dlat == "") {
                                            var str = value_inner.dest_warehouse_info[0].addressline1 + "," + value_inner.dest_warehouse_info[0].addressline2 + "," + value_inner.dest_warehouse_info[0].city + "," + value_inner.dest_warehouse_info[0].state + "," + value_inner.dest_warehouse_info[0].zipcode;
                                            geocoder.geocode({
                                                'address': str
                                            }, function (results, status) {
                                                if (status == google.maps.GeocoderStatus.OK) {
                                                    request = $.ajax({
                                                        type: "POST",
                                                        url: updateDispatchMapCoordsUrl,
                                                        data: {
                                                            'orders_id': value_inner.o_id,
                                                            'route_type': value_inner.route_type,
                                                            'address': str,
                                                            'lat': results[0].geometry.location.lat(),
                                                            'lng': results[0].geometry.location.lng(),
                                                        },
                                                        headers: {
                                                            'X-CSRF-TOKEN': $('input[name="_token"]').val()
                                                        },
                                                        success: function (result) {
                                                        },
                                                        error: function (data) {
                                                            console.log('error', data);
                                                        }
                                                    });
                                                    var new_lat = results[0].geometry.location.lat();
                                                    var new_lng = results[0].geometry.location.lng();
                                                    var marker = google.maps.marker.AdvancedMarkerElement({
                                                        position: new google.maps.LatLng(new_lat, new_lng),
                                                        map: map,
                                                        label: "",
                                                        icon: pinSymbolSmall("#FE6256")
                                                    });
                                                    marker.customInfo = value_inner.orders_id + " " + value_inner.order_type;
                                                    marker.addListener("click", () => {
                                                        assign_marker_to_selected_truck(marker);
                                                    });
                                                    var timeout = '';
                                                    marker.addListener("mouseover", () => {
                                                        timeout = setTimeout(function () {
                                                            infowindow1.open({
                                                                anchor: marker,
                                                                map,
                                                            });
                                                        }, 500);
                                                    });
                                                    marker.addListener("mouseout", () => {
                                                        clearTimeout(timeout);
                                                        infowindow1.close();
                                                    });
                                                    location.push(marker);
                                                    all_addr.push(value_inner.dest_warehouse_info[0].addressline1 + "," + value_inner.dest_warehouse_info[0].addressline2 + "," + value_inner.dest_warehouse_info[0].city + "," + value_inner.dest_warehouse_info[0].state + "," + value_inner.dest_warehouse_info[0].zipcode);
                                                    all_cust.push(' [' + key + '] ' + value_inner.dest_warehouse_info[0].company_name);
                                                    all_order_id.push(value_inner.orders_id + ' ' + value_inner.order_type);
                                                    markerIdForOrders[value_inner.orders_id+value_inner.order_type[0]] = all_order_id.length-1;
                                                    individual_markers.push(marker);
                                                }
                                            });
                                        } else {
                                            var marker = google.maps.marker.AdvancedMarkerElement({
                                                position: new google.maps.LatLng(dlat, dlng),
                                                map: map,
                                                label: "",
                                                icon: pinSymbolSmall("#FE6256")
                                            });
                                            marker.customInfo = value_inner.orders_id + " " + value_inner.order_type;
                                            marker.addListener("click", () => {
                                                assign_marker_to_selected_truck(marker);
                                            });
                                            var timeout = '';
                                            marker.addListener("mouseover", () => {
                                                timeout = setTimeout(function () {
                                                    infowindow1.open({
                                                        anchor: marker,
                                                        map,
                                                    });
                                                }, 500);
                                            });
                                            marker.addListener("mouseout", () => {
                                                clearTimeout(timeout);
                                                infowindow1.close();
                                            });
                                            location.push(marker);
                                            all_addr.push(all_address);
                                            all_cust.push(all_customer);
                                            all_order_id.push(all_id);
                                            key_obj = all_id.split(' ');
                                            markerIdForOrders[key_obj[0]+key_obj[1][0]] = all_order_id.length-1;
                                            individual_markers.push(location[location.length - 1]);
                                        }
                                    }
                                    count++;
                                    break;
                            }
                            orders_json[key] = valll;
                        });
                        if (count == 0) {
                            return;
                        }

                        markers[key] = location;
                        var has_same_day = 0;
                        var has_cc_internally_unpaid = 0;
                        $.each(value, function (orders, order_row) {
                            if (order_row.is_same_day == 1) {
                                has_same_day = 1;
                            }
                            if (order_row.hasOwnProperty('is_cc_internally_unpaid')) {
                                if (order_row.is_cc_internally_unpaid == 1) {
                                    has_cc_internally_unpaid = 1;
                                }
                            }
                        });
                        // console.log('has_sameday 3: ', value);
                        if (has_same_day > 0) {
                            var img_str = "<img title='Has Same Day Delivery Orders' style='width:25px;' src='" + same_day_logo + "' >";
                        } else {
                            var img_str = "";
                        }
                        if (has_cc_internally_unpaid == 1) {
                            img_str += '<span class="text-red"><i class="fa fa-dollar"></i></span>';
                        }
                        
                        if (value.length > 0) {
                            var accordion_id = 'orders-accordion';
                            var cnt = 0;
                            var cnt_dup = 0;
                            var term = '';
                            var loc_name = value[0].origin_loc_name;
                            if (typeof value[0].route_type == 'undefined' || typeof value[0].route_type == null) {
                                uo_count++;
                                cnt = uo_count;
                            } else if (value[0].route_type == ROUTE_TYPE.Transfer) {
                                accordion_id = 'transfer-accordion';
                                cnt = 't' + ut_count;
                                cnt_dup = ut_count;
                                ut_count++;
                            } else {
                                term = get_active_warehouse(value[0].depot_id, 'terminal_name');
                                if (term != '') {
                                    term = ' (' + term + ') ';
                                }
                                cnt = uo_count;
                                cnt_dup = uo_count;
                                uo_count++;
                            }

                            var total_cubes = 0;
                            var total_weight = 0;

                            $.each(value, function (index, val) {
                                total_cubes = total_cubes + parseInt(val.total_cubes);
                                total_weight = total_weight + parseInt(val.order_weight);
                            });
                            var Date_today = new Date();
                            var Date_obj = new Date(sch_date);
                            var img_cnd;
                            if (dateInPast(Date_obj, Date_today)) {
                                img_cnd = count;
                                assignBtn = '';
                                anchorDiv = $('<a>', { 'data-toggle': 'collapse' });
                                $('.actions-header').hide();
                            } else {
                                img_cnd = count + ' ' + img_str;
                                anchorDiv = $('<a>', { class: 'one_at_time_accordion', 'data-toggle': 'collapse', 'data-parent': '#' + accordion_id, href: '#collapse_' + cnt });
                                var assignBtn = $('<button>', {
                                    class: 'btn btn-info btn-sm assign_butns assign_btn_' + cnt,
                                    'data-cnt': cnt,
                                    'data-total-cubes': total_cubes,
                                    'data-total-weight': total_weight,
                                    'data-loc-key': key,
                                    text: 'Assign'
                                });
                            }
                            var checkBox = $('<h6>', { class: 'panel-title' }).append(
                                $('<input>', {
                                    'type': 'hidden',
                                    class: 'check_order_number',
                                    'data-loc-key': key
                                }),
                                $('<span>', { class: 'Number', text: cnt_dup + 1 + '.' }),
                                anchorDiv.append(
                                    $('<span>', { text: key+term }),
                                    $('<small>', { class: 'text-muted' }).text('Orders: ').append($('<span>', { class: 'order_number' + cnt }).html(img_cnd))
                                )
                            );
                            var ulDiv = $('<ul>', { class: 'list-sub-orders', id: 'sub_orders_' + cnt });
                            var mainDiv = $('<div>', {
                                id: 'collapse_' + cnt,
                                class: 'panel-collapse check_collapse collapse'
                            }).append(
                                $('<div>', { class: 'panel-body p-0' }).append($('<div>', { class: 'p-col' }).append($('<select>', { class: 'form-control sidebar_select_truck', id: 'truck_chose_' + cnt }), assignBtn),
                                    $('<small>', { class: 'capacity-col' }).append($('<input>', { 'type': 'text', class: 'form-control srch_ord', placeholder: 'Search Order', 'style': 'width:100%' }),
                                    ),
                                    $('<small>', { class: 'capacity-col truck_details_' + cnt }).append($('<span>', { text: 'V-' }).append($('<sp>', { class: 'selected_vol_' + cnt, text: '0/' }), $('<sp>', { class: 'total_vol_' + cnt, text: '103' })), $('<span>', { text: 'W-' }).append($('<sp>', { class: 'selected_wgt_' + cnt, text: '0/' }), $('<sp>', { class: 'total_wgt_' + cnt, text: '1200' })), $('<span>', { text: 'P-' }).append($('<sp>', { class: 'selected_pcs_' + cnt, text: '0' }))),
                                    $('<small>', { class: 'capacity-col chose_msg' + cnt + ' text-muted text text-red', 'style': 'text-align:center;', text: 'Choose any truck to assign orders.' }),
                                    $('<label>', { class: 'select_all_' + cnt, 'style': 'display:none;margin: 0px 0px;font-weight: 100;padding-left: 12px;font-size: 13px;' }).append($('<input>', { class: 'select_all_order select_all_' + cnt, 'type': 'checkbox' }), 'Select All'),
                                    ulDiv
                                )
                            );

                            $.each(orders_json[key], function (key1, value) {
                                var order_state = "";
                                var orderStateClass = '';
                                var orderStateText = '';
                                if (value.ors_type == ORDER_TYPE.PICKUP) {
                                    var sum_order_quant = value.quantity;
                                    var sum_order_quan_for_delivery = value.qty_for_delivery;
                                    if (sum_order_quan_for_delivery == 0) {
                                        orderStateClass = 'label-danger';
                                        orderStateText = 'Not Picked Yet';
                                    } else if (sum_order_quant != sum_order_quan_for_delivery) {
                                        orderStateClass = 'label-warning';
                                        orderStateText = 'Partially Picked';
                                    } else {
                                        orderStateClass = 'label-success';
                                        orderStateText = 'Picked';
                                    }
                                } else {
                                    var sum_order_quant = value.quantity;
                                    var sum_order_quan_for_delivery = value.qty_for_delivery;
                                    if (sum_order_quan_for_delivery == 0) {
                                        orderStateClass = 'label-danger';
                                        orderStateText = 'Not Recieved Yet';
                                    } else if (sum_order_quant != sum_order_quan_for_delivery) {
                                        orderStateClass = 'label-warning';
                                        orderStateText = 'Partially Recieved';
                                    } else {
                                        orderStateClass = 'label-success';
                                        orderStateText = 'Recieved';
                                    }
                                }
                                var orderStateDiv = $('<span>', {
                                    class: 'label ' + orderStateClass,
                                    text: orderStateText
                                });
                                var account_name = "";
                                if (!(typeof (value.u_name) == "undefined" || value.u_name == "null" || value.u_name == null || value.u_name == "")) {
                                    account_name = value.u_name;
                                }
                                if (account_name) {
                                    account_name = escapeHtmlAlternate(account_name);
                                }

                                var customer_name = account_name;
                                var addr = '';
                                if (value.order_type == "Pickup") {
                                    var type = "P";
                                    if ($.inArray(value.o_id + type, markers_assigned_to_trucks_local) > -1) {
                                        if (typeof temp_orders_json[key] == "undefined") {
                                            temp_orders_json[key] = [];
                                        }

                                        temp_orders_json[key].push(key1);

                                        return;
                                    }
                                    if (!(typeof (value.origin_company_name) == "undefined" || value.origin_company_name == "null" || value.origin_company_name == null || value.origin_company_name == "")) {
                                        customer_name = escapeHtmlAlternate(value.origin_company_name);
                                    }
                                    if (value.origin_addressline1) {
                                        addr += value.origin_addressline1;
                                    }
                                    if (value.origin_addressline2) {
                                        addr += ', ' + value.origin_addressline2;
                                    }
                                    if (value.origin_city) {
                                        addr += ', ' + value.origin_city;
                                    }
                                    if (value.origin_state) {
                                        addr += ', ' + value.origin_state;
                                    }
                                    if (value.origin_zip) {
                                        addr += ', ' + value.origin_zip;
                                    }
                                } else if (value.order_type == "Transfer") {
                                    var type = "T";
                                    if ($.inArray(value.o_id + type + value.transfer_id, markers_assigned_to_trucks_local) > -1) {
                                        if (typeof temp_orders_json[key] == "undefined") {
                                            temp_orders_json[key] = [];
                                        }

                                        temp_orders_json[key].push(key1);


                                        return;
                                    }
                                    if (!(typeof (value.origin_company_name) == "undefined" || value.origin_company_name == "null" || value.origin_company_name == null || value.origin_company_name == "")) {
                                        customer_name = escapeHtmlAlternate(value.dest_warehouse_info[0].company_name);
                                    }
                                    if (value.dest_addressline1) {
                                        addr += value.dest_addressline1;
                                    }
                                    if (value.dest_addressline2) {
                                        addr += ', ' + value.dest_addressline2;
                                    }
                                    if (value.dest_city) {
                                        addr += ', ' + value.dest_city;
                                    }
                                    if (value.dest_state) {
                                        addr += ', ' + value.dest_state;
                                    }
                                    if (value.dest_zip) {
                                        addr += ', ' + value.dest_zip;
                                    }
                                } else {
                                    var type = "D";
                                    if ($.inArray(value.o_id + type, markers_assigned_to_trucks_local) > -1) {
                                        if (typeof temp_orders_json[key] == "undefined") {
                                            temp_orders_json[key] = [];
                                        }

                                        temp_orders_json[key].push(key1);

                                        return;
                                    }
                                    if (!(typeof (value.dest_company_name) == "undefined" || value.dest_company_name == "null" || value.dest_company_name == null || value.dest_company_name == "")) {
                                        customer_name = escapeHtmlAlternate(value.dest_company_name);
                                    }
                                    if (value.dest_addressline1) {
                                        addr += value.dest_addressline1;
                                    }
                                    if (value.dest_addressline2) {
                                        addr += ', ' + value.dest_addressline2;
                                    }
                                    if (value.dest_city) {
                                        addr += ', ' + value.dest_city;
                                    }
                                    if (value.dest_state) {
                                        addr += ', ' + value.dest_state;
                                    }
                                    if (value.dest_zip) {
                                        addr += ', ' + value.dest_zip;
                                    }
                                }

                                var image_str = "";
                                // console.log('same day 1: ', value);
                                if (value.is_same_day == 1) {
                                    image_str += "<img title='Is a Same Day Delivery Order' style='width:18px;max-height:15px;' src='" + same_day_logo + "' >";
                                }
                                if (value.hasOwnProperty('is_cc_internally_unpaid')) {
                                    if (value.is_cc_internally_unpaid == 1) {
                                        image_str += '<span class="text-red"><i class="fa fa-dollar"></i></span>';
                                    }
                                }
                                var remove_pickup_str = "";
                                if (type == "D") {
                                    if (value.not_deliverable_rows == 0 || value.is_same_day == 1) {
                                        var disabled = "";
                                        var is_same_day = 1;
                                    }
                                } else {
                                    if (value.not_pickupable_rows == 0 || value.is_same_day == 1) {
                                        var disabled = "";
                                        var is_same_day = 1;
                                    }
                                }

                                if (type == "T") {
                                    var trnfr_id = value.transfer_id;
                                    var transferHtml = $('<span>', { class: 'btn-danger btn-sm badge ml-auto', text: 'TID #' + trnfr_id });
                                } else {
                                    var trnfr_id = "";
                                }
                                liElement = $('<li>', { class: 'inner_order_item', 'data-indi-id': count1 }).append(
                                    $('<div>', { class: 'sub-order-item' }).append(
                                        $('<input>', {
                                            class: 'order-seleection-check ord_search sub_order_' + cnt,
                                            'data-is-same-day': is_same_day,
                                            'type': 'checkbox',
                                            id: 'check' + value.o_id + type + trnfr_id,
                                            'data-cubes': value.total_cubes,
                                            'data-weight': value.order_weight,
                                            'data-loc': key,
                                            'data-peice': value.quantity,
                                            disabled: true
                                        }),
                                        $('<label>', { 'for': 'check' + value.o_id + type + trnfr_id }).append(
                                            $('<strong>', { html: value.o_id + ' ' + type + ' - ' + customer_name + ' ' + image_str }),
                                            $('<p>', { class: 'address1', text: addr }),
                                            $('<small>',
                                                { class: 'text-muted' }).append(
                                                    $('<span>', {
                                                        class: 'uni_trk_detail',
                                                        text: 'V-' + value.total_cubes + ' W-' + value.order_weight + ' P-' + value.quantity
                                                    }),
                                                    orderStateDiv,
                                                    transferHtml)))

                                );
                                ulDiv.append(liElement);

                                count1++;
                            });

                            htmlDiv = $('<div>').append(checkBox, mainDiv);
                            var color_counter = ((cnt_dup % 5) + 1);
                            var r_type = '';
                            $('#' + accordion_id).append(
                                $('<li />')
                                    .attr('id', 'map-marker-' + cnt)
                                    .attr('data-marker-id', cnt)
                                    .attr('class', 'depot-result list-group-itemz list-group-item-o loc_name_' + cnt + ' show_marker color' + color_counter)
                                    .html(htmlDiv)
                            );

                            if ($('#truck_chose_' + cnt).val() == null) {
                                $('.sub_order_' + cnt).prop('disabled', true);
                                $('.truck_details_' + cnt).hide();
                            } else {
                                $('.truck_details_' + cnt).show();
                            }


                            $('#truck_chose_' + cnt).select2({
                                width: '100%',
                                allowClear: true,
                                placeholder: '--Choose a Truck--',
                                ajax: {
                                    url: truckListSelect2Url,
                                    error: function (jqXHR, exception) {
                                        active_xhr = false;
                                    },
                                    data: function (params) {
                                        var query = {
                                            term: params.term,
                                            page: params.page || 1,
                                            size: 10
                                        }
                                        return query;
                                    },
                                    processResults: function (data, params) {
                                        return {
                                            results: data.results,
                                            pagination: {
                                                more: data.pagination.more
                                            }
                                        };
                                    }
                                }
                            }).on("change", function (e) {
                                var select_val = e.currentTarget;
                                var id = $(select_val).val();
                                var date = $('#save_truck_date').val();
                                if (id == null) {
                                    $('.sub_order_' + cnt).prop('disabled', true);
                                    $.each($('.sub_order_' + cnt), function (key, val) {
                                        $(val).attr("checked", false);
                                        $(val).prop("checked", false);
                                    });
                                    $('.select_all_' + cnt).hide();
                                    $('.truck_details_' + cnt).hide();
                                    $('.chose_msg' + cnt).show();
                                    $('.srch_ord').hide();
                                } else {
                                    $('.selected_wgt_' + cnt).html('0');
                                    $('.selected_vol_' + cnt).html('0');
                                    $('.selected_pcs_' + cnt).html('0');
                                    $('.sub_order_' + cnt).prop('disabled', false);
                                    $('.truck_details_' + cnt).show();
                                    $('.chose_msg' + cnt).hide();
                                    $('.assign_btn_' + cnt).prop('disabled', false);
                                    $(".selected_vol_" + cnt).css("color", "black");
                                    $(".selected_wgt_" + cnt).css("color", "black");
                                    $('.srch_ord').show();
                                    $('.select_all_' + cnt).show();
                                    $.ajax({
                                        type: "GET",
                                        cache: false,
                                        url: truckDetailsUrl + "/" + id + "/" + date,
                                        success: function (data) {
                                            var used_vol = $('.t_no_' + id + '_vol').html();
                                            if (typeof used_vol == 'undefined') {
                                                used_vol = 0;
                                            }
                                            var pieces = $('.t_no_' + id + '_pieces').html();
                                            if (typeof pieces == 'undefined') {
                                                pieces = 0;
                                            }
                                            var weight = $('.t_no_' + id + 'wt').html();
                                            if (typeof weight == 'undefined') {
                                                weight = 0;
                                            }
                                            var location = key;
                                            var loc_weight = 0;
                                            var loc_cubes = 0;
                                            $('.total_vol_' + cnt).html(parseInt(data.data.max_volume));
                                            $('.total_wgt_' + cnt).html(parseInt(data.data.max_weight));

                                            $.each($('#orders-accordion').children(), function (key, value) {
                                                if ($(value).find('.assign-order-to-truck').attr('data-loc-key') == location) {
                                                    loc_weight = $(value).find('.assign-order-to-truck').attr('data-total-weight');
                                                    loc_cubes = $(value).find('.assign-order-to-truck').attr('data-total-cubes');
                                                    return false;
                                                }
                                            });
                                            $.each($('#transfer-accordion').children(), function (key, value) {
                                                if ($(value).find('.assign-order-to-truck').attr('data-loc-key') == location) {
                                                    loc_weight = $(value).find('.assign-order-to-truck').attr('data-total-weight');
                                                    loc_cubes = $(value).find('.assign-order-to-truck').attr('data-total-cubes');
                                                    return false;
                                                }
                                            });
                                            OpenSelectionModalDup(location, data.data, loc_weight, loc_cubes, data.data.max_weight - weight, data.data.max_volume - used_vol, cnt);
                                            $('.selected_wgt_' + cnt).html(parseInt($('.selected_wgt_' + cnt).html()) + parseInt(weight));
                                            $('.selected_vol_' + cnt).html(parseInt($('.selected_vol_' + cnt).html()) + parseInt(used_vol));
                                            $('.selected_pcs_' + cnt).html(parseInt($('.selected_pcs_' + cnt).html()) + parseInt(pieces));
                                            $(".pieces").html(pieces);
                                            $(".driver_name").html(data.data.driver);
                                            $('#truck_details_assign').show();
                                            if ($('.sub_order_' + cnt).length == $('.sub_order_' + cnt + ':checked').length) {
                                                $('.select_all_' + cnt).attr("checked", true);
                                                $('.select_all_' + cnt).prop("checked", true);
                                            } else {
                                                $('.select_all_' + cnt).attr("checked", false);
                                                $('.select_all_' + cnt).prop("checked", false);
                                            }
                                        }
                                    });

                                }
                            }).on("select2:unselect", function (e) {
                                $('#truck_chose_' + cnt).val(null).trigger('change');
                                var get_select_truck = $('#truck_chose_' + cnt).val();
                                if (!get_select_truck) {
                                    $('.assign_btn_' + cnt).prop('disabled', true);
                                    $('.selected_wgt_' + cnt).html('0');
                                    $('.selected_vol_' + cnt).html('0');
                                    $('.selected_pcs_' + cnt).html('0');
                                    $.each($('.sub_order_' + cnt), function (key, val) {
                                        $(val).attr("checked", false);
                                        $(val).prop("checked", false);
                                    });
                                }
                            });

                            $('.assign_btn_' + cnt).on('click', function (e) {
                                var $loadingText = '<i class="fa fa-refresh  fa-spin"></i>';
                                $('.assign_btn_' + cnt).html($loadingText);

                                setTimeout(() => {
                                    var truc_num = $('#truck_chose_' + cnt).val();
                                    check_partial_items(key, truc_num, cnt);
                                }, 600);
                                return false;
                            });
                            if (typeof cnt == 'string' && cnt.includes("t"))
                                sidebar_number_transfer = parseInt(cnt.slice(1));
                            else
                                sidebar_number_orders = cnt;
                            gl_make_lines_on_gmap();
                        } else {
                            return;
                        }
                    });
                    

                }
                $('.No-orders-div').hide();
                $('.orders_div').show();
                if (($('#transfer-accordion').find('li').length) == 0) {
                    $('.No-t-orders-div').show();
                    $('.t-orders_div').hide();
                } else {
                    if (!dateInPast(Date_obj, Date_today)) {
                        $('#collapse_t0').addClass('in');
                    }
                }
                if (($('#orders-accordion').find('li').length) == 0) {
                    $('.No-orders-div').show();
                    $('.orders_div').hide();
                } else {
                    if (!dateInPast(Date_obj, Date_today)) {
                        $('#collapse_0').addClass('in');
                    }
                }
                hideLoading("dispatchDashboard_box", '#');
                console.log("Done");
                var temp_order_json_main = {};
                $.each(orders_json, function (territory, orders) {
                    var temp_order_json_inner = [];
                    if (temp_orders_json.hasOwnProperty(territory)) {
                        var skipped_orders = temp_orders_json[territory];
                        $.each(orders, function (k, order) {
                            if ($.inArray(k, skipped_orders) == -1) {
                                temp_order_json_inner.push(order);
                            }
                        });
                    } else {
                        temp_order_json_inner = orders;
                    }
                    temp_order_json_main[territory] = temp_order_json_inner;
                });

                orders_json = temp_order_json_main;
                truck_data = JSON.parse(trucks_orders_json);
                if (Object.keys(truck_data).length > 0) {
                    $.each(truck_data, function (key, value) {
                        truck_route_number_polyline(key);
                    });
                }
                if (orders_json != JSON.stringify("")) {
                    $.each(orders_json, function (key_0, value_0) {
                        $.each(orders_json[key_0], function (key_1, value_1) {
                            value_1.is_last_label = false;
                        });
                    });
                }
            }
        });
    }

    function check_partial_items(loc, truc_num, num) {
        // console.log('check_partial_items');
        $("#prpi_main_div").html('');
        var partial_orders = [];
        var order_data = [];
        var location = loc;
        delete_partial_items = [];
        var orders_json_value = [];
        if (location.indexOf("|") == -1) {
            $.each($('.sub_order_' + num), function (key, value) {
                if ($(value).prop('checked')) {
                    $.each(orders_json[location], function (key1, value1) {
                        if (value1.transfer_id) {
                            value1.transfer_id = value1.transfer_id;
                        } else {
                            value1.transfer_id = "";
                        }
                        if (value1.order_type == "Pickup") {
                            var type = "P";
                        } else if (value1.order_type == "Transfer") {
                            var type = "T";
                        } else {
                            var type = "D";
                        }
                        var t_o_id_formatted = value1.o_id + type + value1.transfer_id; //order_id + type + transfer id
                        // Only allow delivery type of orders and exclude same day deliveries
                        if (t_o_id_formatted == $(value).attr('data-order-id') && type == "D" && value1.is_same_day == 0) {
                            if (parseInt(value1.qty_for_delivery) < parseInt(value1.quantity)) {
                                partial_orders.push(value1.o_id);
                                order_data.push(value1);
                                orders_json_value[value1.o_id] = value1;
                            }
                            return false;
                        }
                    });
                }
            });
        }
        $("#partial_assign_type").val('sidebar');
        $("#partial_assign_loc").val(loc);
        $("#partial_assign_truc_num").val(truc_num);
        $("#partial_assign_num").val(num);
        $("#partial_assign_order").val(partial_orders);
        var pl = partial_orders.length;
        if (pl == 0) {
            assign_order_from_sidebar(loc, truc_num, num);
        } else {
            $.ajax({
                type: "POST",
                headers: {
                    'X-CSRF-TOKEN': $('input[name="_token"]').val()
                },

                url: patialOrderItemsUrl,
                data: {
                    orders_array: partial_orders
                },
                success: function (data) {

                    if (data.status) {
                        var final = '';
                        var finalDiv = '';
                        var item_str = '';
                        var row_id = 0;
                        var total_qty = 0;
                        var total_qty_for_del = 0;
                        $.each(data.data, function (key, value) {
                            ++row_id;
                            var index = findIndexIfObjWithOwnAttr(order_data, 'o_id', key);
                            if (index != -1) {
                                var order_detail = order_data[index];
                                var num = 1;
                                var q_type = order_detail['ors_type'] == ORDER_TYPE.PICKUP ? 'Picked' : "Received";
                                item_str = '';
                                total_qty = 0;
                                total_qty_for_del = 0;
                                $.each(value, function (key1, value1) {
                                    var item_row_id = key1 + 1;
                                    total_qty += parseInt(value1.quantity);
                                    total_qty_for_del += parseInt(value1.qty_for_delivery);
                                    var itemDiv = $('<div>', { class: 'row', id: 'item_row_' + row_id + '_' + item_row_id }).append(
                                        $('<div>', { class: 'col-sm-6', id: 'item_name_div_' + row_id + '_' + item_row_id }.append(
                                            $('<label>', { text: item_row_id + '. ' + escapeHtml(value1.item_name) }),
                                            $('<input>', { 'type': 'hidden', 'name': 'prpi_item_row_id[]', 'value': item_row_id }),
                                            $('<input>', { 'type': 'hidden', 'name': 'prpi_item_ids[]', 'value': value1.oi_id }),
                                            $('<input>', {
                                                'type': 'hidden', 'name': 'prpi_oi_id_' + row_id + '_' + item_row_id,
                                                id: 'prpi_oi_id_' + row_id + '_' + item_row_id,
                                                'value': value1.oi_id
                                            }),
                                        )
                                        ),
                                        $('<div>', { class: 'col-sm-3', id: 'item_qty_div_' + row_id + '_' + item_row_id }).append(
                                            $('<div>', { class: 'input-group' }).append(
                                                $('<input>', {
                                                    class: 'item_qty_val form-control validate[required,min[1],max[' + value1.quantity + '],custom[number]]',
                                                    'type': 'number',
                                                    'step': '1',
                                                    'min': '1',
                                                    'value': value1.qty_for_delivery,
                                                    'max': value1.quantity,
                                                    'data-errormessage': 'Minimum value must be 1 and cannot be greater than item quantity.',
                                                    'name': 'prpi_qty_used_' + row_id + '_' + item_row_id,
                                                    id: 'prpi_qty_used_' + row_id + '_' + item_row_id
                                                }),
                                                $('<span>', {
                                                    class: 'input-group-addon',
                                                    'style': 'width:75%',
                                                    text: 'out of '
                                                }
                                                ).append($('<b>', { text: value1.quantity })).text(' Qty')),
                                            $('<p>', { class: 'help-block text-red prpi_item_err', id: 'prpi_i_err_' + row_id + '_' + item_row_id })
                                        ),
                                        $('<div>', { class: 'col-sm-3' }).append(
                                            $('<label>', { class: 'text-red' }).append(
                                                $('<input>', { 'type': 'checkbox', 'name': 'prpi_remove_item_' + row_id + '_' + item_row_id }))
                                        )
                                    );
                                    console.log(itemDiv[0]);
                                    item_str += '<div class="row" id="item_row_' + row_id + '_' + item_row_id + '">' +
                                        '<div class="col-sm-6" id="item_name_div_' + row_id + '_' + item_row_id + '">' +
                                        '<label>' + item_row_id + '. ' + escapeHtml(value1.item_name) + ' </label>' +
                                        '<input type="hidden" name="prpi_item_row_id[]" value="' + item_row_id + '">' +
                                        '<input type="hidden" name="prpi_item_ids[]" value="' + value1.oi_id + '">' +
                                        '<input type="hidden" name="prpi_oi_id_' + row_id + '_' + item_row_id + '" id="prpi_oi_id_' + row_id + '_' + item_row_id + '" value="' + value1.oi_id + '">' +
                                        '</div>' +
                                        '<div class="col-sm-3" id="item_qty_div_' + row_id + '_' + item_row_id + '">' +
                                        '<div class="input-group">' +
                                        '<input type="number" step="1" min="1" value="' + value1.qty_for_delivery + '" max="' + value1.quantity + '" class="item_qty_val form-control validate[required,min[1],max[' + value1.quantity + '],custom[number]]" data-errormessage="Minimum value must be 1 and cannot be greater than item quantity." name="prpi_qty_used_' + row_id + '_' + item_row_id + '" id="prpi_qty_used_' + row_id + '_' + item_row_id + '">' +
                                        '<span class="input-group-addon" style="width:75%;">out of <b>' + value1.quantity + '</b> Qty</span>' +
                                        '</div>' +
                                        '<p class="help-block text-red prpi_item_err" id="prpi_i_err_' + row_id + '_' + item_row_id + '"></p>' +
                                        '</div>' +
                                        '<div class="col-sm-3">' +
                                        '<label class="text-red">' +
                                        '<input type="checkbox" name="prpi_remove_item_' + row_id + '_' + item_row_id + '" id="prpi_remove_item_' + row_id + '_' + item_row_id + '" value="remove_item" data-row_id="' + row_id + '" data-item_row_id="' + item_row_id + '" class="prpi_items minimal prpi_remove_item_' + row_id + '"> Remove' +
                                        '</label>' +
                                        '</div>' +
                                        '</div>';
                                });
                                finalDiv += $('<div>', { id: 'pannel_row_' + row_id }).append(
                                    $('<div>', { class: 'form-group' }).append(
                                        $('<label>', { text: row_id + '. Order#' + key }).append(
                                            $('<span>', { class: 'badge btn-danger status_str', 'style': 'margin-left:10px;' }).append(
                                                $('<b>', { text: q_type + ' ' + total_qty_for_del + '/' + total_qty })
                                            )
                                        ),
                                        $('<div>', { class: 'col-sm-12' }).append(
                                            $('<input>', {
                                                'type': 'textbox',
                                                'name': 'prpi_notes_' + row_id + '_' + item_row_id,
                                                'class': 'form-control validate[maxSize[500]]',
                                                'placeholder': 'Enter notes here...'
                                            }
                                            )
                                        )
                                    ),
                                    $('<div>', { class: 'form-group panel panel-default custom_panel', id: 'item_main_' + row_id }).append(
                                        $('<div>', { class: 'row' }).append(
                                            $('<div>', { class: 'col-sm-6' }).append(
                                                $('<label>', { text: 'Item Name' })
                                            ),
                                            $('<div>', { class: 'col-sm-3' }).append(
                                                $('<label>', { text: 'Remove Item?' })
                                            )
                                        ),
                                        itemDiv
                                    )
                                )[0].outerHTML;
                                final += '<div id="panel_row_' + row_id + '">' +
                                    '<div class="form-group">' +
                                    '<label>' + row_id + '. Order#' + key + ' <span class="badge btn-danger status_str" style="margin-left:10px;"><b>' + q_type + ' ' + total_qty_for_del + '/' + total_qty + '</b></span></label>' +
                                    '<div class="row">' +
                                    '<div class="col-sm-12">' +
                                    '<input type="textbox" name="prpi_notes_' + row_id + '" id="prpi_notes_' + row_id + '" class="form-control validate[maxSize[500]]" placeholder="Enter notes here...">' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="form-group panel panel-default custom_panel" id="item_main_' + row_id + '">' +
                                    '<div class="row">' +
                                    '<div class="col-sm-6">' +
                                    '<label>Item Name</label>' +
                                    '</div>' +
                                    '<div class="col-sm-3">' +
                                    '<label>Picked/Recv. vs Actual Qty</label>' +
                                    '</div>' +
                                    '<div class="col-sm-3">' +
                                    '<label>Remove Item?</label>' +
                                    '</div>' +
                                    '</div>' +
                                    item_str +
                                    '</div>' +
                                    '</div>';
                            }
                        });
                        // $("#prpi_main_div").html(final);
                        $("#prpi_main_div").html(finalDiv);
                        $("#update_items").modal('show');
                        //iCheck for checkbox and radio inputs
                        init_iCheck();
                    }
                }
            });
        }
        $('.assign_btn_' + num).html('Assign');
    }

    function assign_order_from_sidebar(loc, truc_num, num) {
        var selected_orders = [];
        var un_selected_orders = [];
        var location = loc;
        var tnum = truc_num;
        if (tnum == "") {
            showFlashModal(false, "Please Select a Truck");
            return false;
        }
        var weight = 0;
        var volume = 0;
        var unselected_weight = 0;
        var unselected_volume = 0;
        var is_diff = $('#has_same_p_d_trucks').val();
        if (is_diff == 1) {
            if (!confirm("You are assigning some same day deliveries to a different trucks than the pickups. Are you sure you want to continue?")) {
                $('#has_same_p_d_trucks').val(0);
                return false;
            }
            else {
                $('#has_same_p_d_trucks').val(0);
            }
        }
        if (location.indexOf("|") == -1) {
            $.each($('.sub_order_' + num), function (key, value) {
                if ($(value).prop('checked')) {
                    $.each(orders_json[location], function (key1, value1) {
                        if (value1.transfer_id) {
                            value1.transfer_id = value1.transfer_id;
                        } else {
                            value1.transfer_id = "";
                        }
                        if (value1.order_type == "Pickup") {
                            var type = "P";
                        } else if (value1.order_type == "Transfer") {
                            var type = "T";
                        } else {
                            var type = "D";
                        }
                        if (value1.o_id + type + value1.transfer_id == $(value).attr('data-order-id')) {
                            selected_orders.push(value1);
                            weight = weight + parseInt(value1.order_weight);
                            volume = volume + parseInt(value1.total_cubes);
                            //add orders in ok marker routed
                            var index = $.inArray(value1.orders_id + " " + value1.order_type, all_order_id);
                            clear_polyline();
                            ok_markers_routed.push(String(index));
                        }
                    });
                } else {
                    $.each(orders_json[location], function (key1, value1) {
                        if (value1.order_type == "Pickup") {
                            var type = "P";
                        } else if (value1.order_type == "Transfer") {
                            var type = "T";
                        } else {
                            var type = "D";
                        }
                        if (value1.transfer_id) {
                            value1.transfer_id = value1.transfer_id
                        } else {
                            value1.transfer_id = '';
                        }
                        if (value1.o_id + type + value1.transfer_id == $(value).attr('data-order-id')) {
                            un_selected_orders.push(value1);
                            unselected_weight = unselected_weight + parseInt(value1.order_weight);
                            unselected_volume = unselected_volume + parseInt(value1.total_cubes);
                        }
                    });
                }
            });
            if (selected_orders.length == 0) {
                showFlashModal(false, "No Orders Selected!");
                return false;
            }
            var proceed = true;
            $.each(selected_orders, function (index, row) {
                if (row.is_same_day == 1 && row.order_type == "Delivery") {
                    // Check if Delivery is Scheduled or is being scheduled now.
                    if ($('#check' + row.orders_id + 'P').prop('checked')) {
                        //Delivery is being assigned now
                    } else {
                        // Pickup Not being assigned with this lot, check if Pickup has been asssigned already
                        var pick = $('#t_o_' + row.orders_id + 'P').attr('data-pieces');
                        if (typeof pick == "undefined") {
                            // Pickup Has not been assigned.
                            var i = $.inArray(row.orders_id + ' ' + row.order_type, all_order_id);
                            showFlashModal(false, "You cannot schedule Delivery without scheduling pickup");
                            pickup_not_assigned.push(i);
                            assign_truck_color_to_markers('FE6256', 1);
                            proceed = false;
                        } else {
                            // Pickup assigned to another Truck.
                        }
                    }
                }
                if (row.order_type == "Transfer") {
                    check_transfer_completed(row.transfer_id).done(function (data) {
                        if (data.status) {
                            proceed = false;
                            showFlashModal(false, "Found some completed transfers. Refreshing...");
                            $(".close, .modal").on('click', function () {
                                window.location.reload();
                            });
                            return false;
                        }
                    });
                }
            });
            if (proceed == false) {
                return false;
            }
            orders_json[location] = selected_orders;
            var iter = 0;
            $.each(orders_json[location], function (or_list, or_val) {
                if (or_val.order_type == "Transfer") {
                    $.each($('#transfer-accordion').children(), function (key, value) {
                        if ($(value).find('.assign-order-to-truck').attr('data-loc-key') == location) {
                            $(value).find('.assign-order-to-truck').attr('data-total-weight', weight);
                            $(value).find('.assign-order-to-truck').attr('data-total-cubes', volume);
                            return false;
                        }
                    });

                    assign_order_to_truck(location, tnum, num);

                    if (++iter == selected_orders.length) { // when all selected will be assigned then iterate for unassigned orders.
                        if (get_status() == 1) {
                            orders_json[location] = un_selected_orders;
                        }
                        var i = $('#transfer-accordion').children().length;
                        if (un_selected_orders.length > 0) {

                            $.each($('#transfer-accordion').children(), function (key, value) {
                                if ($(value).find('.assign_btn_' + num).attr('data-loc-key') == location) {
                                    $(value).find('.assign_btn_' + num).attr('data-total-weight', unselected_weight);
                                    $(value).find('.assign_btn_' + num).attr('data-total-cubes', unselected_volume);
                                    return false;
                                }
                            });
                        }
                    }
                } else {

                    assign_order_to_truck(location, tnum, num);

                    if (++iter == selected_orders.length) {
                        if (get_status() == 1) {
                            orders_json[location] = un_selected_orders;
                        }
                        var i = $('#orders-accordion').children().length;
                        if (un_selected_orders.length > 0) {
                            $.each($('#orders-accordion').children(), function (key, value) {
                                if ($(value).find('.assign_btn_' + num).attr('data-loc-key') == location) {
                                    $(value).find('.assign_btn_' + num).attr('data-total-weight', unselected_weight);
                                    $(value).find('.assign_btn_' + num).attr('data-total-cubes', unselected_volume);
                                    return false;
                                }
                            });
                        }
                    }
                }
            });
        }
    }

    function showMarkerOnSave(truckColor, orders_count, context) {
        var index_sr = 1;
        var popupContent = [];
        var all_markers = [];

        if (orders_count > 1) {
            var coordinates = [];
            $(context).find(".truck-orders-addresses > li").each(function () {
                var li_lat = $(this).attr("order_lat");
                var li_lng = $(this).attr("order_lng");
                popupContent.push(makePopUpContent(this))
                if (li_lat == undefined || li_lat == undefined) {
                    return false;
                }
                coordinates.push([li_lat, li_lng]);
            });
            calcRoute(coordinates, truckColor);
            for (i = 0; i < coordinates.length; i++) {
                var marker = google.maps.marker.AdvancedMarkerElement({
                    position: new google.maps.LatLng(coordinates[i][0], coordinates[i][1]),
                    map: map,
                    label: "",
                    icon: drawPin(index_sr)
                });
                all_markers.push(marker);
                addInfoWindow(marker, popupContent[i])
                index_sr++;
            }
            createCluster(all_markers)
        }
        else {
            var coordinates = [];
            var infoText = "";
            $(context).find(".truck-orders-addresses > li").each(function () {
                var li_lat = $(this).attr("order_lat");
                var li_lng = $(this).attr("order_lng");
                infoText = makePopUpContent(this)
                if (li_lat == undefined || li_lat == undefined) {
                    return false;
                }
                var marker = google.maps.marker.AdvancedMarkerElement({
                    position: new google.maps.LatLng(li_lat, li_lng),
                    map: map,
                    label: "",
                    icon: drawPin(index_sr)
                });
                all_markers.push(marker);
                addInfoWindow(marker, infoText)
                map.panTo(marker.getPosition());
                index_sr++;
                coordinates.push([li_lat, li_lng]);
            });
            createCluster(all_markers)
        }

    }

    function check_vol_weight(used_vol, used_weight, max_vol, max_weight) {
        var weight = 0;
        var vol = 0;
        var selected_id = [];
        used_vol = parseInt(used_vol);
        used_weight = parseInt(used_weight);
        max_vol = parseInt(max_vol);
        max_weight = parseInt(max_weight);

        for (i = 0; i < ok_markers_routed.length; i++) {
            selected_id.push(all_order_id[ok_markers_routed[i]]);
        }
        $.each(orders_json, function (key, value) {
            $.each(orders_json[key], function (key1, value1) {
                if ($.inArray(value1.orders_id + " " + value1.order_type, selected_id) > -1) {
                    weight = weight + parseInt(value1.order_weight);
                    vol = vol + parseInt(value1.total_cubes);
                }
            });
        });
        used_weight = used_weight + weight;
        used_vol = used_vol + vol;
        $("#used_vol_modal").html(used_vol);
        $("#used_weight_modal").html(used_weight);
        $("#max_weight_modal").html(max_weight);
        $("#max_vol_modal").html(max_vol);
        $("#used_vol_modal").removeAttr("style");
        $("#used_weight_modal").removeAttr("style");
        if (used_vol > max_vol) {
            $("#used_vol_modal").css("color", "red");
            $(".polyline_assign_button").prop("disabled", true);
            $("#truck_error_polyline").html("Selected Orders Volume Exceeded Truck's Volume.");
        }
        if (used_weight > max_weight) {
            $("#used_weight_modal").css("color", "red");
            $(".polyline_assign_button").prop("disabled", true);
            $("#truck_error_polyline").html("Selected Orders Weight Exceeded Truck's Weight.");
        }
        if (used_vol > max_vol && used_weight > max_weight) {
            $("#used_vol_modal").css("color", "red");
            $("#used_weight_modal").css("color", "red");
            $(".polyline_assign_button").prop("disabled", true);
            $("#truck_error_polyline").html("Selected Orders Volume and Weight Exceeded Truck's Volume and Weight.");
        }
    }

    //Function partial for polyline selection
    $(document).on('click', '.check_partial_items_polyline', check_partial_items_polyline);
    function check_partial_items_polyline() {
        var selected_id = [];
        var partial_orders = [];
        delete_partial_items = [];
        for (i = 0; i < ok_markers_routed.length; i++) {
            selected_id.push(all_order_id[ok_markers_routed[i]]);
        }
        var order_data = [];
        $.each(orders_json, function (key, value) {
            $.each(orders_json[key], function (key1, value1) {
                if (value1.transfer_id) {
                    value1.transfer_id = value1.transfer_id;
                } else {
                    value1.transfer_id = "";
                }
                if (value1.order_type == "Pickup") {
                    var type = "P";
                } else if (value1.order_type == "Transfer") {
                    var type = "T";
                } else {
                    var type = "D";
                }
                var t_o_id_formatted = value1.o_id + type + value1.transfer_id; //order_id + type + transfer id
                // Only allow delivery type of orders and exclude same day deliveries
                if ($.inArray(value1.orders_id + " " + value1.order_type, selected_id) > -1 && type == "D" && value1.is_same_day == 0) {
                    if (parseInt(value1.qty_for_delivery) < parseInt(value1.quantity)) {
                        partial_orders.push(value1.o_id);
                        order_data.push(value1);
                    }
                }
            });
        });
        var pl = partial_orders.length;
        $("#partial_assign_type").val('polyline');
        $("#partial_assign_loc").val('');
        $("#partial_assign_truc_num").val('');
        $("#partial_assign_num").val('');
        $("#partial_assign_order").val(partial_orders);
        if (pl == 0) {

            assign_order_for_polyline();
        } else {
            $.ajax({
                type: "POST",
                headers: {
                    'X-CSRF-TOKEN': $('input[name="_token"]').val()
                },

                url: patialOrderItemsUrl,
                data: {
                    orders_array: partial_orders
                },
                success: function (data) {
                    if (data.status) {
                        var final = '';
                        var item_str = '';
                        var row_id = 0;
                        var total_qty = 0;
                        var total_qty_for_del = 0;
                        $.each(data.data, function (key, value) {
                            ++row_id;

                            var index = findIndexIfObjWithOwnAttr(order_data, 'o_id', key);
                            if (index != -1) {
                                var order_detail = order_data[index];
                                var num = 1;
                                var q_type = order_detail['ors_type'] == ORDER_TYPE.PICKUP ? 'Picked' : "Received";
                                item_str = '';
                                total_qty = 0;
                                total_qty_for_del = 0;
                                $.each(value, function (key1, value1) {
                                    var item_row_id = key1 + 1;
                                    total_qty += parseInt(value1.quantity);
                                    total_qty_for_del += parseInt(value1.qty_for_delivery);
                                    item_str += '<div class="row" id="item_row_' + row_id + '_' + item_row_id + '">' +
                                        '<div class="col-sm-6" id="item_name_div_' + row_id + '_' + item_row_id + '">' +
                                        '<label>' + item_row_id + '. ' + escapeHtml(value1.item_name) + ' </label>' +
                                        '<input type="hidden" name="prpi_item_row_id[]" value="' + item_row_id + '">' +
                                        '<input type="hidden" name="prpi_item_ids[]" value="' + value1.oi_id + '">' +
                                        '<input type="hidden" name="prpi_oi_id_' + row_id + '_' + item_row_id + '" id="prpi_oi_id_' + row_id + '_' + item_row_id + '" value="' + value1.oi_id + '">' +
                                        '</div>' +
                                        '<div class="col-sm-3" id="item_qty_div_' + row_id + '_' + item_row_id + '">' +
                                        '<div class="input-group">' +
                                        '<input type="number" step="1" min="1" value="' + value1.qty_for_delivery + '" max="' + value1.quantity + '" class="item_qty_val form-control validate[required,min[1],max[' + value1.quantity + '],custom[number]]" data-errormessage="Minimum value must be 1 and cannot be greater than item quantity." name="prpi_qty_used_' + row_id + '_' + item_row_id + '" id="prpi_qty_used_' + row_id + '_' + item_row_id + '">' +
                                        '<span class="input-group-addon" style="width:75%;">out of <b>' + value1.quantity + '</b> Qty</span>' +
                                        '</div>' +
                                        '<p class="help-block text-red prpi_item_err" id="prpi_i_err_' + row_id + '_' + item_row_id + '"></p>' +
                                        '</div>' +
                                        '<div class="col-sm-3">' +
                                        '<label class="text-red">' +
                                        '<input type="checkbox" name="prpi_remove_item_' + row_id + '_' + item_row_id + '" id="prpi_remove_item_' + row_id + '_' + item_row_id + '" value="remove_item" data-row_id="' + row_id + '" data-item_row_id="' + item_row_id + '" class="prpi_items minimal prpi_remove_item_' + row_id + '"> Remove' +
                                        '</label>' +
                                        '</div>' +
                                        '</div>';
                                });
                                final += '<div id="panel_row_' + row_id + '">' +
                                    '<div class="form-group">' +
                                    '<label>' + row_id + '. Order#' + key + ' <span class="badge btn-danger status_str" style="margin-left:10px;"><b>' + q_type + ' ' + total_qty_for_del + '/' + total_qty + '</b></span></label>' +
                                    '<div class="row">' +
                                    '<div class="col-sm-12">' +
                                    '<input type="textbox" name="prpi_notes_' + row_id + '" id="prpi_notes_' + row_id + '" class="form-control validate[maxSize[500]]" placeholder="Enter notes here...">' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="form-group panel panel-default custom_panel" id="item_main_' + row_id + '">' +
                                    '<div class="row">' +
                                    '<div class="col-sm-6">' +
                                    '<label>Item Name</label>' +
                                    '</div>' +
                                    '<div class="col-sm-3">' +
                                    '<label>Picked/Recv. vs Actual Qty</label>' +
                                    '</div>' +
                                    '<div class="col-sm-3">' +
                                    '<label>Remove Item?</label>' +
                                    '</div>' +
                                    '</div>' +
                                    item_str +
                                    '</div>' +
                                    '</div>';
                            }
                        });
                        $("#prpi_main_div").html(final);
                        $("#update_items").modal('show');
                        init_iCheck();
                    }
                    else {

                    }
                }
            });
            $("#assign_route_modal").modal('hide');
        }
    }

    function init_iCheck() {
        $('input[type="checkbox"].prpi_items, input[type="radio"].prpi_items').iCheck({
            checkboxClass: 'icheckbox_flat-red',
            radioClass: 'iradio_flat-blue',
        }).on('ifChanged', function (e) {
            // Get the field name
            var isChecked = e.currentTarget.checked;
            var isValue = e.currentTarget.value;
            var row_id = $(e.currentTarget).attr("data-row_id");
            var item_row_id = $(e.currentTarget).attr("data-item_row_id");
            if (isChecked) {
                if (isValue == 'remove_item') {
                    $("#prpi_qty_used_" + row_id + "_" + item_row_id).prop("disabled", true)
                    $("#item_name_div_" + row_id + "_" + item_row_id).addClass("py_disabled");
                    $("#item_qty_div_" + row_id + "_" + item_row_id).addClass("py_disabled");
                    var l = $('input:checkbox.prpi_remove_item_' + row_id + ':checked').length; //checked checkboxes
                    var t = $('input:checkbox.prpi_remove_item_' + row_id).length; //total checkboxes
                    if (l == t) { // you cannot allow to remove all items
                        var chk_id = "prpi_remove_item_" + row_id + "_" + item_row_id;
                        setTimeout(function () {
                            $("#" + chk_id).iCheck('uncheck');
                        }, 200);
                        alert("You cannot remove all items from an order. Please keep at least one line item in an order.");
                    }
                }
            } else {
                if (isValue == 'remove_item') {
                    var row_id = $(e.currentTarget).attr("data-row_id");
                    var item_row_id = $(e.currentTarget).attr("data-item_row_id");
                    $("#prpi_qty_used_" + row_id + "_" + item_row_id).prop("disabled", false);
                    $("#item_name_div_" + row_id + "_" + item_row_id).removeClass("py_disabled");
                    $("#item_qty_div_" + row_id + "_" + item_row_id).removeClass("py_disabled");
                }
            }
        });

    }

    function assign_order_for_polyline(auto_assign_t_id = null) {
        console.log('trigger main function');
        var selected_orders = [];
        var un_selected_orders = [];
        pickup_not_assigned = [];
        has_any_pickup_unassign_before_delivery = [];
        total_orders = ok_markers_routed.length;
        unAssignedCount = 0
        var location;
        var tnum = "";
        var auto_assign = false;
        if (auto_assign_t_id) {
            tnum = auto_assign_t_id;
            auto_assign = true;
        }
        else {
            tnum = $("#truck_polyline_choose").val();
        }

        var arr_loc = {};
        var num = [];
        if (tnum == "") {
            showFlashModal(false, "Please Select a Truck");
            return false;
        }
        var weight = 0;
        var volume = 0;
        var unselected_weight = 0;
        var unselected_volume = 0;
        var is_diff = $('#has_same_p_d_trucks').val();
        if (is_diff == 1) {
            if (!confirm("You are assigning some same day deliveries to a different trucks than the pickups. Are you sure you want to continue?")) {
                $('#has_same_p_d_trucks').val(0);
                return false;
            } else {
                $('#has_same_p_d_trucks').val(0);
            }
        }
        $(".polyline_assign_button").prop("disabled", true);

        var selected_id = [];
        for (i = 0; i < ok_markers_routed.length; i++) {
            selected_id.push(all_order_id[ok_markers_routed[i]]);
        }
        $.each($('.assign_butns'), function (ke, va) {
            var cnt = $(va).attr('data-cnt');
            var city_key = $(va).attr('data-loc-key');
            if ($('#tab1button').parent('.route_type_order_list').hasClass('active') == true) {
                if (!cnt.includes("t")) {
                    var arr_temp = [];
                    arr_temp.push(city_key);
                    arr_temp.push(cnt);

                    num.push(arr_temp);
                }
            }
            else {
                if (cnt.includes("t")) {
                    var arr_temp = [];
                    arr_temp.push(city_key);
                    arr_temp.push(cnt);

                    num.push(arr_temp);
                }
            }
        });
        $.each(orders_json, function(key, value) {
            $.each(orders_json[key], function(key1, value1) {
                if($.inArray(value1.orders_id+" "+value1.order_type, selected_id) > -1)
                {if(value1.order_type == 'Delivery')
                    {
                        type = "D";
                        orders_json[key][key1].qty_for_delivery = value1.quantity;
                    }
                }
            });
        });
        $.each(orders_json, function(key, value) {
            var arr1 = [];
            var check = 0;
            selected_orders = [];
            un_selected_orders = [];
            weight = 0;
            volume = 0;
            unselected_weight = 0;
            unselected_volume = 0;
            location = key;

            $.each(orders_json[key], function(key1, value1) {
                var type;
                if($.inArray(value1.orders_id+" "+value1.order_type, selected_id) > -1)
                {   var pick = $('#t_o_' + value1.orders_id + 'P').attr('data-pieces');
                    if ((value1.is_same_day == 1 && value1.order_type == "Delivery") &&  (typeof pick == "undefined") ) {
                        var x = $.inArray(value1.orders_id+' '+value1.order_type, all_order_id);
                        pickup_not_assigned.push(x);
                        unAssignedCount += 1;
                        un_selected_orders.push(value1);
                        unselected_weight = unselected_weight + parseInt(value1.order_weight);
                        unselected_volume = unselected_volume + parseInt(value1.total_cubes);
                    } else {
                        selected_orders.push(value1);
                        weight = weight + parseInt(value1.order_weight);
                        volume = volume + parseInt(value1.total_cubes);

                        arr1.push(value1.orders_id);
                        check = 1;
                        if(value1.order_type == 'Pickup')
                            type = "P";
                        else if(value1.order_type == 'Delivery')
                        {
                            type = "D";
                            orders_json[key][key1].qty_for_delivery = value1.quantity;
                        }
                        else
                        {
                            type = "T"+value1.transfer_id;
                        }
                        $("#check"+value1.orders_id+type).prop("checked", true);
                    }

                }
                else
                {
                    un_selected_orders.push(value1);
                    unselected_weight = unselected_weight + parseInt(value1.order_weight);
                    unselected_volume = unselected_volume + parseInt(value1.total_cubes);
                }
            });

            var proceed = true;
            $.each(selected_orders, function(index, row) {
                if (row.is_same_day == 1 && row.order_type == "Delivery") {
                    // Check if Delivery is Scheduled or is being scheduled now.

                    if($.inArray(row.orders_id+" Pickup", selected_id) > -1){
                        //Delivery is being assigned now
                    } else {
                        // Pickup Not being assigned with this lot, check if Pickup has been asssigned already
                        var pick = $('#t_o_' + row.orders_id + 'P').attr('data-pieces');
                        if (typeof pick == "undefined") {
                            // Pickup Has not been assigned.
                            // unAssignedCount += 1;
                            var i = $.inArray(row.orders_id+' '+row.order_type, all_order_id);
                            // showFlashModal(false, "You cannot assign delivery order before pickup to truck.");
                            pickup_not_assigned.push(i);
                        // assign_truck_color_to_markers('FE6256',1);
                            // proceed = false;
                        } else {
                            // Pickup assigned to another Truck.
                        }
                    }
                }
                if(row.order_type == "Transfer"){
                    check_transfer_completed(row.transfer_id).done(function(data){
                        if(data.status){
                            proceed = false;
                            showFlashModal(false, "Found some completed transfers. Refreshing...");
                            $(".close, .modal").click(function(){
                                window.location.reload();
                            });
                            return false;
                        }
                    });
                }
            });

            if (proceed == false) {
                return false;
            }
            if(selected_orders.length > 0)
                orders_json[location] = selected_orders;
            var iter = 0;
            $.each(orders_json[location], function(or_list, or_val) {
                if (or_val.order_type == "Transfer") {
                    $.each($('#transfer-accordion').children(), function(key, value) {
                        if ($(value).find('.assign-order-to-truck').attr('data-loc-key') == location) {
                            $(value).find('.assign-order-to-truck').attr('data-total-weight', weight);
                            $(value).find('.assign-order-to-truck').attr('data-total-cubes', volume);
                            return false;
                        }
                    });
                    var num_key = -1;
                    $.each(num, function(k,v) {
                        if(v[0] == key)
                        {
                            num_key = v[1];
                        }
                    });

                    if(selected_orders.length > 0){
                        // console.log(`location : ${location}, tnum : ${tnum}, num_key : ${num_key}, auto_assign : ${auto_assign}`);
                        // num_key  = num_sidebar_data[location];
                        assign_order_to_truck(location, tnum, num_key, auto_assign);
                    }
                    if(++iter == selected_orders.length){ // when all selected will be assigned then iterate for unassigned orders.
                        if (get_status() == 1) {
                            orders_json[location] = un_selected_orders;
                        }
                        var i = $('#transfer-accordion').children().length;
                        if (un_selected_orders.length > 0) {
                            $.each($('#transfer-accordion').children(), function(key, value) {
                                if ($(value).find('.assign_btn_'+num_key).attr('data-loc-key') == location) {
                                    $(value).find('.assign_btn_'+num_key).attr('data-total-weight', unselected_weight);
                                    $(value).find('.assign_btn_'+num_key).attr('data-total-cubes', unselected_volume);
                                    return false;
                                }
                            });
                        }
                    }
                } else {
                    var num_key = -1;
                    $.each(num, function(k,v) {
                        if(v[0] == key)
                        {
                            num_key = v[1];
                        }
                    });

                    if(selected_orders.length > 0){
                        assign_order_to_truck(location, tnum,num_key,auto_assign);
                        }
                    if(++iter == selected_orders.length){
                        if (get_status() == 1) {
                            orders_json[location] = un_selected_orders;
                        }
                        var i = $('#orders-accordion').children().length;
                        if (un_selected_orders.length > 0) {
                            $.each($('#orders-accordion').children(), function(key, value) {
                                if ($(value).find('.assign_btn_'+num_key).attr('data-loc-key') == location) {
                                    $(value).find('.assign_btn_'+num_key).attr('data-total-weight', unselected_weight);
                                    $(value).find('.assign_btn_'+num_key).attr('data-total-cubes', unselected_volume);
                                    return false;
                                }
                            });
                        }
                    }
                }
            });

        });
        // unAssignedCount = has_any_pickup_unassign_before_delivery.length
        if(unAssignedCount){
            if (total_orders>1)
                showFlashModal(false, `<p style="color:green;">We have successfully assigned ${total_orders-unAssignedCount} order(s) to truck</p> <p style="color:red;">But we found ${unAssignedCount} delivery order(s) (skipped) whose pickup is still not assigned to truck so you have to assign them first.</p>`);
            else
                showFlashModal(false, `You cannot assign delivery order before pickup to truck.`);
        }
    }

    function assign_truck_color_to_markers(color, i) {
        if (typeof color === 'undefined')
            return false;
        var new1 = color.replace("#", "");
        for (var key in ok_markers_routed) {
            if (i == 1) {
                if (pickup_not_assigned.indexOf(parseInt(ok_markers_routed[key])) > -1) {
                    individual_markers[ok_markers_routed[key]].setIcon('https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=|' + color + '|000000');
                    var index1 = assigned_markers.indexOf(ok_markers_routed[key]);
                    if (index1 > -1) {
                        assigned_markers.splice(index1, 1); // 2nd parameter means remove one item only
                    }
                }
            }
            else {
                individual_markers[ok_markers_routed[key]].setIcon('https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=|' + new1 + '|000000');
                if (assigned_markers.indexOf(ok_markers_routed[key]) === -1) {
                    // this.items.push(item);
                    assigned_markers.push(ok_markers_routed[key]);
                }
            }
        }
        pickup_not_assigned = [];
        truck_color = '';
        ok_markers_routed = [];
    }
    $(document).on('click', '.clear_polyline', clear_polyline);
    function clear_polyline() {
        polyline.setMap(null);
        polyline = new google.maps.Polyline();
        for (var key in markers_routed) {
            if (jQuery.inArray(markers_routed[key], assigned_markers) == -1)
                individual_markers[markers_routed[key]].setIcon(pinSymbolSmall("#FE6256"));
        }
        markers_routed = [];
        auto_routes = [];
        ok_markers_routed = [];
        if (infoWindow_polyline != null)
            infoWindow_polyline.close();
        infoWindow_polyline = null;
    }

    function unassign_order_marker(order_number, truck_number, location, addr, warehouse_addr = '') {
        truck_json = JSON.parse(trucks_orders_json);
        var truck_data = truck_json[truck_number];
        for (i = 0; i < truck_data.length; i++) {
            value = truck_data[i];
            if (value.type == "Pickup") {
                var type = "P";
                var main_type = value.type;
            } else if (value.type == "Transfer") {
                var type = "T";
                var main_type = value.type;
            } else {
                var type = "D";
                var main_type = value.type;
            }
            var main_addr = "";
            if (warehouse_addr == '')
                main_addr = addr;
            else
                main_addr = warehouse_addr;
            if ((value.id + type + value.transfer_id) == order_number) {
                var json = $('#t_o_json_' + order_number).val();
                if (JSON.parse(json)) {
                    var json = JSON.parse(json);
                }
                if (type == "P") {
                    var cust_name = json.origin_company_name;
                    var phone = json.origin_contact_phone;
                }
                else {
                    var cust_name = json.dest_company_name;
                    var phone = json.dest_contact_phone;
                }
                all_address = main_addr;
                all_customer = cust_name;
                all_id = json.orders_id + ' ' + type;
                order_number = json.orders_id + ' ' + value.type;
                var info_data = '<label>' + all_id + ' - ' + all_customer + '</label><p>' + addr + '</p><p>' + phone + '</p>';
                const infowindow1 = new google.maps.InfoWindow({
                    content: info_data,
                });
                var check = 0;

                var coords_temp = value.coordinates;


                var new_lat = coords_temp.lat;
                var new_lng = coords_temp.lng;
                var marker = google.maps.marker.AdvancedMarkerElement({
                    position: new google.maps.LatLng(new_lat, new_lng),
                    map: map,
                    label: "",
                    draggable: true,
                    icon: pinSymbolSmall("#FE6256")
                });
                marker.customInfo = json.orders_id + " " + main_type;
                marker.addListener("click", () => {

                    assign_marker_to_selected_truck(marker);
                });
                var timeout = '';
                marker.addListener("mouseover", () => {
                    timeout = setTimeout(function () {
                        infowindow1.open({
                            anchor: marker,
                            map,
                        });
                    }, 500);
                });
                marker.addListener("mouseout", () => {
                    clearTimeout(timeout);
                    infowindow1.close();
                });
                marker.addListener("dragend", () => {
                    var finalLat = marker.getPosition().lat();
                    var finalLng = marker.getPosition().lng();
                    let latlng = new google.maps.LatLng(new_lat, new_lng);
                    marker.setPosition(latlng);
                    check_drag_marker_ending(marker, finalLat, finalLng);
                });
                var check = 0;
                if ($.inArray(marker, individual_markers) == -1) {
                    $.each(markers[location], function (key, value) {
                        lat = value.position.lat();
                        lng = value.position.lng();
                        if (new_lat == lat && new_lng == lng && marker.customInfo == value.customInfo) {

                            value.setIcon(pinSymbolSmall("#FE6256"));
                            var index = all_order_id.indexOf(json.orders_id + " " + json.order_type);
                            index = index.toString();
                            if ($.inArray(index, assigned_markers) > -1) {
                                var index1 = assigned_markers.indexOf(index);
                                if (index1 > -1) {
                                    assigned_markers.splice(index1, 1); // 2nd parameter means remove one item only
                                }
                            }

                            check = 1;
                            marker.setMap(null);
                            return false;
                        }
                    });
                    if (!(location in markers)) {
                        markers[location] = [marker];
                        individual_markers.push(marker);
                        if ($.inArray(order_number, all_order_id) == -1) {
                            all_addr.push(main_addr);
                            all_cust.push(all_customer);
                            all_order_id.push(order_number);
key = order_number.split(' ');
                            markerIdForOrders[key[0]+key[1][0]] = all_order_id.length-1;
                        }
                        check = 1;
                    }
                    if (check == 0) {
                        markers[location].push(marker);
                        individual_markers.push(marker);
                        if ($.inArray(order_number, all_order_id) == -1) {
                            all_addr.push(main_addr);
                            all_cust.push(all_customer);
                            all_order_id.push(order_number);
key = order_number.split(' ');
                            markerIdForOrders[key[0]+key[1][0]] = all_order_id.length-1;
                        }
                    }
                }
                else {

                    individual_markers[$.inArray(marker, individual_markers)].setIcon(pinSymbolSmall("#FE6256"));
                }

                break;
            }
        }
    }

    function resetzoom(controlDiv, map) {
        const controlText = document.createElement("div");
        const controlUI = document.createElement("div");
        controlUI.style.backgroundColor = "#fed452";
        controlUI.style.border = "1px solid black";
        controlUI.style.padding = "2px";
        controlUI.style.borderRadius = "3px";

        controlUI.style.cursor = "pointer";
        controlUI.style.margin = "5px";
        controlUI.style.textAlign = "center";
        controlUI.title = "Click to recenter the map";
        controlDiv.appendChild(controlUI);
        controlText.style.color = "rgb(25,25,25)";
        controlText.style.fontSize = "10px";

        controlText.style.paddingLeft = "5px";
        controlText.style.paddingRight = "5px";
        controlText.innerHTML = "RESET ZOOM";
        controlUI.appendChild(controlText);
        controlUI.addEventListener("click", () => {
            map.setCenter(new google.maps.LatLng(34.0522, -118.2437));
            map.setZoom(5);
        });
    }

    function findorder(controlDiv, map) {
        const controlText = document.createElement("div")
        const controlUI = document.createElement("div");;
        controlUI.style.backgroundColor = "#fed452";
        controlUI.style.border = "1px solid black";
        controlUI.style.padding = "2px";
        controlUI.style.borderRadius = "3px";

        controlUI.style.cursor = "pointer";
        controlUI.style.margin = "5px";
        controlUI.style.textAlign = "center";
        controlUI.title = "Click to search for an order.";
        controlDiv.appendChild(controlUI);
        controlText.style.color = "rgb(25,25,25)";
        controlText.style.fontSize = "10px";

        controlText.style.paddingLeft = "5px";
        controlText.style.paddingRight = "5px";
        controlText.innerHTML = "FIND ORDER";
        controlUI.appendChild(controlText);
        controlUI.addEventListener("click", () => {
            $("#search_order_id_error").html("");
            $("#search_order_cust_error").html("");
            $("#search_customer_value").val("");
            $("#search_order_value").val("");
            $("#order_search_modal").modal("show");
            $("#result_orders").html("");
            $("#search_order").prop('disabled', false);
        });
    }

    $("#search_order").on('click', function () {
        var val;
        var count = 0;
        var ans = [];
        var errorClass = 'text-danger';
        var errorText = '';
        if ($("#search_order_value").val() != '') {
            val = $("#search_order_value").val();
            val = val.toLowerCase();
            for (i = 0; i < all_order_id.length; i++) {
                if (all_order_id[i].toLowerCase().includes(val)) {
                    ans.push(i);
                }
            }
        }
        else if ($("#search_customer_value").val() != '') {
            val = $("#search_customer_value").val();
            val = val.toLowerCase();
            for (i = 0; i < all_cust.length; i++) {
                if (all_cust[i].toLowerCase().includes(val)) {
                    ans.push(i);
                }
            }
        }
        else {
            errorDiv = $('<p>', { class: errorClass, text: 'Please enter either Order Id or Customer name to search.' });
            $("#search_order_cust_error").html(errorDiv);
            return false;
        }
        if (ans.length == 0) {

            if ($("#search_order_value").val() != '') {
                errorText = "Order with entered ID doesn't exist.";
            }
            else if ($("#search_customer_value").val() != '') {
                errorText = "Order with entered Customer Name doesn't exist.";
            }
            errorDiv = $('<p>', { class: errorClass, text: errorText });
            $("#search_order_cust_error").html(errorDiv);
        }
        else if (ans.length == 1) {
            var addr = all_addr[ans[0]];
            geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'address': addr
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var new_lat = results[0].geometry.location.lat();
                    var new_lng = results[0].geometry.location.lng();
                    map.panTo(new google.maps.LatLng(new_lat, new_lng));
                    map.setZoom(15);
                    google.maps.event.trigger(individual_markers[ans[0]], 'mouseover');
                }
            });
            $("#btn_search_order_close").trigger('click');
        }
        else {
            var str = '';
            var strDiv = $('<div>');
            var ulElement = $('<ul>', { 'style': 'list-style: none;' }).append('<p>', { class: errorClass, text: 'Choose one of the orders from below to get information.' });
            str += '<div><ul style="list-style: none;">';
            str += '<p class="text-danger">Choose one of the orders from below to get information.</p>';
            for (i = 0; i < ans.length; i++) {
                var str1 = '';
                var j = i + 1;
                liDiv = $('<div>', { class: 'searched_order_list_div', 'data-selected-order': ans[i], 'style': 'background-color: #f1f6f9!important;' }).append(
                    $('<li>', { class: 'search_order_list' }).append(
                        $('<p>').append($('<strong>', { text: j + ') ' + all_order_id[ans[i]] + ' - ' + all_cust[ans[i]] + ' - ' + all_addr[ans[i]] }))
                    )
                );
                ulElement.append(liDiv, '<br>');
                str1 += '<div class="searched_order_list_div" data-selected-order="' + ans[i] + '" style="background-color: #f1f6f9!important;">';
                str1 += '<li class="searched_order_list">';
                str1 += '<p><strong>' + j + ') ' + all_order_id[ans[i]] + ' - ' + all_cust[ans[i]] + ' - ' + all_addr[ans[i]] + '</strong></p>';
                str1 += '</li></div><br>';
                str += str1;
            };
            strDiv.append(ulElement);
            str += '</ul></div>';
            $("#search_order").prop('disabled', true);
            // $("#result_orders").append(str);
            $("#result_orders").append(strDiv);
        }
    });

    $(document).on('click', 'div.searched_order_list_div', function () {
        var m_id = $(this).data('selected-order');
        var addr = all_addr[m_id];
        geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'address': addr
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var new_lat = results[0].geometry.location.lat();
                var new_lng = results[0].geometry.location.lng();
                map.panTo(new google.maps.LatLng(new_lat, new_lng));
                map.setZoom(15);
                google.maps.event.trigger(individual_markers[m_id], 'click');
            }
        });
        $("#btn_search_order_close").trigger('click');
    });

    $("#search_order_value").on('keyup', function () {
        $("#search_order_id_error").html("");
        $("#search_order_cust_error").html("");
        $("#search_order").prop('disabled', false);
        $("#result_orders").html("");
    });
    $("#search_customer_value").on('keyup', function () {
        $("#search_order_id_error").html("");
        $("#search_order_cust_error").html("");
        $("#search_order").prop('disabled', false);
        $("#result_orders").html("");
    });

    function findaddress(controlDiv, map) {
        const controlText = document.createElement("div")
        const controlUI = document.createElement("div");;
        controlUI.style.backgroundColor = "#fed452";
        controlUI.style.border = "1px solid black";
        controlUI.style.padding = "2px";
        controlUI.style.borderRadius = "3px";

        controlUI.style.cursor = "pointer";
        controlUI.style.margin = "5px";
        controlUI.style.textAlign = "center";
        controlUI.title = "Click to search for an address.";
        controlDiv.appendChild(controlUI);
        controlText.style.color = "rgb(25,25,25)";
        controlText.style.fontSize = "10px";

        controlText.style.paddingLeft = "5px";
        controlText.style.paddingRight = "5px";
        controlText.innerHTML = "FIND ADDRESS";
        controlUI.appendChild(controlText);
        controlUI.addEventListener("click", () => {
            $("#search_address_error").html("");
            $("#search_address_value").val("")
            $("#address_search_modal").modal("show");
        });
    }

    $("#search_address_value").on('keyup', function () {
        $("#search_error").html("");
    });

    $("#search_address").on('click', function () {
        var addr = $("#search_address_value").val();
        if (addr == '') {
            $("#search_error").html("<p class='text-danger'>Please enter address.</p>");
            return false;
        }
        if (searched_addr) {
            searched_addr.setMap(null);
            searched_addr = null;
        }
        const info_data = "<a href='javascript:void(0);' onclick='remove_address_marker()'>Click Here To Remove Marker</a>";
        const infoDiv = $('<a>', {href:'javascript:void(0);', class:'remove_address_marker', text:'Click Here To Remove Marker'});
        const infowindow1 = new google.maps.InfoWindow({
            content: infoDiv,
        });
        geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'address': addr
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var new_lat = results[0].geometry.location.lat();
                var new_lng = results[0].geometry.location.lng();
                var marker = google.maps.marker.AdvancedMarkerElement({
                    position: new google.maps.LatLng(new_lat, new_lng),
                    map: map,
                    label: "",
                    icon: pinSymbol("#00a65a")
                });
                searched_addr = marker;
                marker.addListener("click", () => {
                    infowindow1.open({
                        anchor: marker,
                        map,
                    });
                });
                map.panTo(new google.maps.LatLng(new_lat, new_lng));
                map.setZoom(13);
            } else if (status == "OVER_QUERY_LIMIT") {
                console.log("OQL3");
            } else {
                showFlashModal(false, "Please enter a valid address");
            }
        });
        $("#btn_search_addr_close").trigger('click');
    });
    $('.remove_address_marker').on('click', remove_address_marker);
    function remove_address_marker() {
        searched_addr.setMap(null);
        map.setCenter(new google.maps.LatLng(34.0522, -118.2437));
        map.setZoom(5);
    }

    $('.undelived_orders_redirect').on('click', undelived_orders_redirect);
    function undelived_orders_redirect() {
        window.location.href = undeliveredOrdersUrl + "?sch_date=" + $(".orders_date").text();
    }

    function makeTruckMarker_new(lat, lng, name_n, tr_id, tr_color) {
        const svgMarker = {
            path: "M0.975,0.687 h-0.025 V0.475 c0,-0.025,-0.008,-0.049,-0.022,-0.066 L0.772,0.215 c-0.014,-0.018,-0.033,-0.028,-0.053,-0.028 H0.65 V0.094 c0,-0.052,-0.034,-0.094,-0.075,-0.094 H0.075 C0.034,0,0,0.042,0,0.094 v0.624 c0,0.052,0.034,0.094,0.075,0.094 h0.025 c0,0.104,0.067,0.188,0.15,0.188 s0.15,-0.084,0.15,-0.187 h0.2 c0,0.104,0.067,0.188,0.15,0.188 s0.15,-0.084,0.15,-0.187 h0.075 c0.014,0,0.025,-0.014,0.025,-0.031 v-0.062 c0,-0.017,-0.011,-0.031,-0.025,-0.031 M0.25,0.904 c-0.041,0,-0.075,-0.042,-0.075,-0.094 s0.034,-0.094,0.075,-0.094 s0.075,0.042,0.075,0.094 s-0.034,0.094,-0.075,0.094 m0.5,0 c-0.041,0,-0.075,-0.042,-0.075,-0.094 s0.034,-0.094,0.075,-0.094 s0.075,0.042,0.075,0.094 s-0.034,0.094,-0.075,0.094 m0.125,-0.405 H0.65 V0.28 h0.069 l0.156,0.195 V0.499",
            fillColor: tr_color,
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 35,
            scaledSize: new google.maps.Size(50, 50),
        };

        var myLatLng = { lat: lat, lng: lng };
        var marker_trucks = google.maps.marker.AdvancedMarkerElement({
            id: tr_id,
            position: new google.maps.LatLng(lat, lng),
            map: map,
            title: 'Truck Name : ' + name_n,
            icon: svgMarker,
        });
        markers.push(marker_trucks);
        google.maps.event.addListener(marker_trucks, 'dblclick', function () {
            map.panTo(this.getPosition());
            map.setZoom(18);
        });
    }

    function makeTruckMarker(lat, lng, truck_n, entity_id, color) {

        if (lat == 0 && lng == 0) {
            if ($('#tab2button').parent('.route_type_order_list').hasClass('active') == true) {
                if ($('#transfer-accordion').find('.check_order_number:checked').length == 0) {
                    $('#tab2button').trigger('click');
                }
            }
            if ($('#tab1button').parent('.route_type_order_list').hasClass('active') == true) {
                if ($('#orders-accordion').find('.check_order_number:checked').length == 0) {
                    $('#tab1button').trigger('click');
                }
            }
            return false;
        }
        else {
            for (var i = 0; i < markers.length; i++) {
                if (markers[i]?.id != null) {
                    if (markers[i]?.id == entity_id) {
                        markers[i].setMap(null);
                    }
                }
            }
            for (var i = 0; i < truck_markers.length; i++) {
                if (truck_markers[i]?.id != null) {
                    if (truck_markers[i]?.id == entity_id) {
                        truck_markers.splice(i, 1);
                    }
                }
            }
            const svgMarker = {
                path: "M0.975,0.687 h-0.025 V0.475 c0,-0.025,-0.008,-0.049,-0.022,-0.066 L0.772,0.215 c-0.014,-0.018,-0.033,-0.028,-0.053,-0.028 H0.65 V0.094 c0,-0.052,-0.034,-0.094,-0.075,-0.094 H0.075 C0.034,0,0,0.042,0,0.094 v0.624 c0,0.052,0.034,0.094,0.075,0.094 h0.025 c0,0.104,0.067,0.188,0.15,0.188 s0.15,-0.084,0.15,-0.187 h0.2 c0,0.104,0.067,0.188,0.15,0.188 s0.15,-0.084,0.15,-0.187 h0.075 c0.014,0,0.025,-0.014,0.025,-0.031 v-0.062 c0,-0.017,-0.011,-0.031,-0.025,-0.031 M0.25,0.904 c-0.041,0,-0.075,-0.042,-0.075,-0.094 s0.034,-0.094,0.075,-0.094 s0.075,0.042,0.075,0.094 s-0.034,0.094,-0.075,0.094 m0.5,0 c-0.041,0,-0.075,-0.042,-0.075,-0.094 s0.034,-0.094,0.075,-0.094 s0.075,0.042,0.075,0.094 s-0.034,0.094,-0.075,0.094 m0.125,-0.405 H0.65 V0.28 h0.069 l0.156,0.195 V0.499",
                fillColor: color,
                fillOpacity: 1,
                strokeWeight: 0,
                rotation: 0,
                scale: 35,
                scaledSize: new google.maps.Size(50, 50),
            };

            var myLatLng = { lat: lat, lng: lng };
            var marker_trucks = google.maps.marker.AdvancedMarkerElement({
                id: entity_id,
                position: new google.maps.LatLng(lat, lng),
                map: map,
                title: 'Truck Name : ' + truck_n,
                icon: svgMarker,
            });
            google.maps.event.addListener(marker_trucks, 'dblclick', function () {
                map.panTo(this.getPosition());
                map.setZoom(18);
            });
            markers.push(marker_trucks);
            truck_markers.push({
                'lat': lat,
                'lng': lng,
                'truck_name': truck_n,
                'id': entity_id,
                'color': color
            });
        }
    }

    function makePopUpContent(ctx) {
        var customer_info = $(ctx).find('input').attr('map_info');
        var popup_srno = $(ctx).find('.sr-no').html();
        var popup_time = $(ctx).find('.toa-order-time').html();
        var popup_addr = $(ctx).find('.toa-order-address').html();

        var div_content = '<div><p><span>' + popup_srno + '</span> <strong>' + customer_info + '</strong></p><p>' + popup_addr + '</p><p>' + popup_time + '</p></div>';
        return div_content;
    }

    function addInfoWindow(marker, message) {
        var infoWindow = new google.maps.InfoWindow({
            content: message
        });

        google.maps.event.addListener(marker, 'mouseover', function () {
            infoWindow.open(map, marker);
        });

        google.maps.event.addListener(marker, 'mouseout', function () {
            infoWindow.close();
        });
    }

    function createCluster(all_markers) {
        new MarkerClusterer(map, all_markers, {
            imagePath:
                "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
        });
    }

    function drawPin(number) {
        var marker_text_color = "000000";
        var marker_color = "71A9F7";
        var sr_no = number;

        return "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + sr_no + "|" + marker_color + "|" + marker_text_color
    }

    function refresh_trucks_backup(sch_date, batch = 0) {
        var trucks_orders_array_outer = {};
        console.log('refresh_trucks_backup');
        $.ajax({
            type: "GET",
            cache: false,
            url: trucksListWithOrdersUrl + '/' + sch_date + '/' + batch,
            success: function (data) {
                if ((data.truck_data.length) == 0) {
                    $('.No-trucks-div').show();
                    $('.trucks_div').hide();
                    $('.scheduled_routes_box').html(0);
                } else {
                    $('.No-trucks-div').hide();
                    $('.trucks_div').show();
                    $('.scheduled_routes_box').html(data.count);
                    if (batch == 0) {
                        $('.trucks_div').html("");
                    }
                    $.each(data.truck_data, async function (key, value) {
                        var t_order_service_time = (value.t_order_service_time) ? value.t_order_service_time : 20;
                        var t_start_time = (value.t_start_time) ? value.t_start_time : "08:00:00";
                        t_start_time = t_start_time.split(":")[0] + ":" + t_start_time.split(":")[1];

                        //Nothing
                        trucks_json = data.truck_data;
                        trucks_json_truck_number[value.trucks_id] = value;
                        var trucks_orders_array_inner = [];
                        var datep = $('#save_truck_date').val();
                        var Date_today = new Date();
                        var Date_obj = new Date(datep);
                        if (dateInPast(Date_obj, Date_today)) {
                            var View_only = 1;
                        } else {
                            var View_only = 0;
                        }
                        var truck_start_address = truck_end_address = truck_start_lat = truck_start_lng = "";
                        if (value.s_addressline1) {
                            truck_start_address += value.s_addressline1;
                        }
                        if (value.s_addressline2) {
                            truck_start_address += ', ' + value.s_addressline2;
                        }
                        if (value.s_city) {
                            truck_start_address += ', ' + value.s_city;
                        }
                        if (value.s_state) {
                            truck_start_address += ', ' + value.s_state;
                        }
                        if (value.s_zipcode) {
                            truck_start_address += ', ' + value.s_zipcode;
                        }
                        if (!(value.s_latitude == null || value.s_latitude == "null" || value.s_longitude == null || value.s_longitude == "null")) {
                            truck_start_lat = value.s_latitude;
                            truck_start_lng = value.s_longitude;
                        }
                        else {
                            geocoder = new google.maps.Geocoder();
                            await geocoder.geocode({
                                'address': truck_start_address
                            }, function (results, status) {
                                truck_start_lat = results[0].geometry.location.lat();
                                truck_start_lng = results[0].geometry.location.lng();
                            });
                        }
                        var time_window = '';
                        if (value.driver == "") {
                            if (View_only == 1) {
                                var driver_str = "";
                            } else {
                                var driver_str = "<a href='Javascript:void(0)' class='add-driver-to-truck' data-truck-number='" + value.trucks_id + "'><i class='fa fa-plus'></i></a>";
                            }
                        } else {
                            if (View_only == 1) {
                                var driver_str = value.driver;
                            } else {
                                var driver_str = value.driver + " <span class='driver_status_str_" + value.trucks_id + "'></span><a href='Javascript:void(0)' class='remove-driver' data-truck-number='" + value.trucks_id + "'><i class='fa fa-trash'></i></a>";
                                driver_str += "<a href='Javascript:void(0)' class='send_d_h_sms sms_driver' data-d-h-name='" + value.driver + "' data-send-type='1' data-send-id='" + value.driver_id + "'><i class='fa fa-comment'></i></a>";
                            }
                            drivers_json[value.trucks_id] = value.driver_id;
                            $('#drivers_json').val(JSON.stringify(drivers_json));
                        }
                        if (value.helper == "") {
                            if (View_only == 1) {
                                var helper_str = "";
                            } else {
                                var helper_str = "<a href='Javascript:void(0)' class='add-helper-to-truck' data-truck-number='" + value.trucks_id + "'><i class='fa fa-plus'></i></a>";
                            }
                        } else {
                            if (View_only == 1) {
                                var helper_str = value.helper;
                            } else {
                                var helper_str = "<span class='helper_status_str_" + value.trucks_id + "'></span>" + value.helper + " <a href='Javascript:void(0)' class='remove-helper' data-truck-number='" + value.trucks_id + "'> <i class='fa fa-trash'></i></a>";
                                helper_str += "<a href='Javascript:void(0)' class='send_d_h_sms sms_helper' data-d-h-name='" + value.helper + "' data-send-type='2' data-send-id='" + value.helper_id + "'><i class='fa fa-comment'></i></a>";
                            }
                            helpers_json[value.trucks_id] = value.helper_id;
                            $('#helpers_json').val(JSON.stringify(helpers_json));
                        }
                        var lock_str = "";
                        var is_locked = false;
                        var sort_btn = "";
                        var calc_time = "";
                        var swap_truck = "";
                        var save_single = '';
                        if (!dateInPast(Date_obj, Date_today)) {
                            if (value.r_is_lock == 0) {
                                var lock_str = '<i class=" fa fa-unlock fa-sm "></i>';
                                is_locked = false;
                                sort_btn = '<div class="toa-sort-orders" data-truck-number = "' + value.trucks_id + '"><small class="short-dist bg-info">Shortest Distance</small><small class="rev-route bg-info">Reverse Routes</small><small class="calc-time-truck bg-info" data-truck-id = "' + value.trucks_id + '">Calc. Time</small></div>';
                            } else {
                                var lock_str = '<i class="text-danger fa fa-lock fa-sm "></i>';
                                is_locked = true;
                                locked_trucks_id.push(Number(value.trucks_id));
                                sort_btn = '<div class="toa-sort-orders" style="display: none;" data-truck-number = "' + value.trucks_id + '"><small class="short-dist bg-info">Shortest Distance</small><small class="rev-route bg-info">Reverse Routes</small><small class="calc-time-truck bg-info" data-truck-id = "' + value.trucks_id + '">Calc. Time</small></div>';
                            }
                            calc_time = '<i class="fa fa-clock fa-sm"></i>';
                            swap_truck = '<i class="fa fa-exchange fa-sm"></i>';
                            save_single = '<i class="fa fa-floppy fa-sm"></i>';
                        }
                        if (value.is_ended == 1) {
                            var ended = "<span class='text text-danger msg_ended'>(Ended)</span>";
                        } else {
                            var ended = "";
                        }
                        var current_date = moment().format('YYYY/MM/DD');
                        var started_date = moment(value.started_date).format('YYYY/MM/DD');
                        if (value.day_started_at != "" && value.is_ended != 1 && moment(started_date).isSame(current_date)) {
                            var end_td_btn = '<a data-truck-number="' + value.trucks_id + '" class="end-day-deliveries"><i class="fa fa-power-off"></i> End todays Deliveries</a>';
                        } else {
                            var end_td_btn = '';
                        }
                        var can_assign = is_locked ? "" : "can_assign";
                        var total_labels_in_truck = value.total_labels_in_truck;
                        var scanned_labels_in_truck = value.scanned_labels_in_truck;
                        // var label_html = (total_labels_in_truck == 0) ? '<div class="empty_label_div_' + value.trucks_id + '"></div>' : '<div class="empty_label_div_' + value.trucks_id + '"><div class="label_scan main_div_label_' + value.trucks_id + '">Scanned transfer labels : <span class="label_heighlight"><span class="scanned_label_count_' + value.trucks_id + '">' + scanned_labels_in_truck + '</span>/<span class="label_count_' + value.trucks_id + '">' + total_labels_in_truck + '</span></span></div></div>'
                        var html_str = '<div class="panel panel-dark t_no_' + value.trucks_id + '" entity-id="' + value.id + '" data-is-locked="' + value.r_is_lock + '"  data-is-ended="' + value.is_ended + '" data-is-started="' + value.day_started_at + '" data-start-lat = "' + truck_start_lat + '" data-start-lng = "' + truck_start_lng + '" data-start-address = "' + truck_start_address + '"><div class="panel-heading" truck-color="' + value.t_color + '"style="background-color:' + value.t_color + '"><h3 class="panel-title truck_name_title" style="font-weight:600" >' + value.t_name + " " + ended + '</h3><ul class="pull-right truck--actions--list"><li><span class="clickable"><i class="fa fa-chevron-down fa-sm"></i></span></li></ul></div><div class="panel-heading btn-actions" truck-color="' + value.t_color + '"style="background-color:#baba9b"><ul class="truck--actions--list" style="margin-left: auto;"><li><span class=""><a class="lock-truck" title="Lock Truck" data-is-locked="' + value.r_is_lock + '" data-truck-id = "' + value.trucks_id + '" href="' + value.lock_link + '">' + lock_str + '</a></span></li><li><span class=""><a class="save-single-route" title="Save This Route" data-truck-id = "' + value.trucks_id + '" href="Javascript:void(0)">' + save_single + '</a></span></li><li style="display:none;"><span class="showMapMarkers"><i class="fa fa-map-marker" style="background: transparent; font-size: 18px; color: white;cursor:pointer;"></i></span></li><li><span class=""><a target="_blank" href="' + value.view_link + '"><i class="fa fa-eye fa-sm "></i></a></span></li><li><span style="cursor:pointer;" class="view_order_log" data-route-number="' + value.id + '" ><i class="fa fa-file fa-sm"></i></span></li><li><span class=""><a class="swap-truck" data-truck-name="' + value.t_name + '" title="Swap Truck Orders" data-truck-id = "' + value.trucks_id + '" href="Javascript:void(0)">' + swap_truck + '</a></span></li></ul></div><div class="panel-body"><ul class="truck-stats-info"><li><span>Vol: <strong><span class="t_no_' + value.trucks_id + '_vol">' + parseInt(value.Volume) + '</span>/<span class="t_no_' + value.trucks_id + '_max_vol">' + parseInt(value.max_volume) + '</span></strong></span></li><li><span>Weight: <strong><span class="t_no_' + value.trucks_id + 'wt">' + parseInt(value.weight) + '</span>/<span class="t_no_' + value.trucks_id + '_max_wt">' + parseInt(value.max_weight) + '</span></strong></span></li><li><span>Pieces: <strong><span class="t_no_' + value.trucks_id + '_pieces">' + value.pieces + '</span></strong></span></li><li></li><li><span>Driver: <strong><a class="driver-info" href="Javascript:void(0)"><i class="fa fa-user"></i> ' + driver_str + '</a></strong></span></li><li><span>Started: <strong>' + value.day_started_at + '</strong></span></li><li><span>Helper: <strong><a href="#">' + helper_str + '</a></strong></span></li><li><span>Ended at: <strong>' + value.day_ended_at + '</strong></span></li></ul><div style="display: flex;align-items: center;justify-content: space-around;" ><a id="bs" data-tr_id="' + value.tr_id + '" data-toggle="modal" data-target="#briefing_sheet_modal" class="bs-btns">Briefing Sheet</a><a style="display:none;" data-toggle="modal" data-target="#running_behind_modal" id="rb" class="bs-btns">Running Behind</a></div>' + end_td_btn + value.recent_act + sort_btn + '<ul class="truck-orders-addresses collapses ' + can_assign + ' t_o_no_' + value.trucks_id + '" data-t_order_service_time="' + t_order_service_time + '" data-t_start_time="' + t_start_time + '">';
                        var i = 0;
                        if (data.orders_data[value.trucks_id].length == 0) {
                            return;
                        }
                        var color = value.t_color;

                        var auto_routes = [];
                        var img_str = "";
                        var order_eye = "";
                        if (value.day_started_at != "") {
                            get_user_status_once(value.enc_driver_id, value.trucks_id, 1);
                        }

                        $.each(data.orders_data[value.trucks_id], function (key1, value1) {
                            order_eye = "<a href='" + orderViewUrl + "/" + value1.o_id + "'><i class='fa fa-eye'></i></a>";
                            console.log('has_sameday 4: ', value1);
                            if (value1.is_same_day > 0) {
                                img_str = "<img title='Has Same Day Delivery Orders' style='width:18px;' src='" + same_day_logo + "' >";
                            } else {
                                img_str = "";
                            }
                            if (value1.hasOwnProperty('is_cc_internally_unpaid')) {
                                if (value1.is_cc_internally_unpaid == 1) {
                                    img_str += '<span class="text-red"><i class="fa fa-dollar"></i></span>';
                                }
                            }
                            i = i + 1;
                            var customer_name = "";
                            var from_terminal = to_terminal = transfer_tids = transfer_terms = "";
                            var a_lat = a_lng = null;
                            if (value1.order_type == "Delivery") {
                                if (!(typeof (value1.dest_company_name) == "undefined" || value1.dest_company_name == "null" || value1.dest_company_name == null || value1.dest_company_name == "")) {
                                    customer_name = escapeHtmlAlternate(value1.dest_company_name);
                                }
                                var addr = '';
                                var time_window = '';
                                if (value1.dest_addressline1) {
                                    addr += value1.dest_addressline1;
                                }
                                if (value1.dest_addressline2) {
                                    addr += ', ' + value1.dest_addressline2;
                                }
                                if (value1.dest_city) {
                                    addr += ', ' + value1.dest_city;
                                }
                                if (value1.dest_state) {
                                    addr += ', ' + value1.dest_state;
                                }
                                if (value1.dest_zip) {
                                    addr += ', ' + value1.dest_zip;
                                }
                                if (value1.scheduled_delivery_window) {
                                    var time_window = value1.scheduled_delivery_window;
                                }

                                var type = "Delivery";
                                var type_head = "D";
                                var loc_name = value1.dest_loc_name;
                                var transfer_id = '';
                                var info_data = '';
                                info_data += '<label>' + value1.orders_id + ' ' + type_head + ' - ' + value1.dest_company_name + '</label><p>' + addr + '</p><p>' + value1.dest_contact_phone +/*'V-'+value_inner.total_cubes+' W-'+value_inner.order_weight+' P-'+value_inner.quantity+*/'</p>';
                                const infowindow1 = new google.maps.InfoWindow({
                                    content: info_data,
                                });
                                if (!(value1.dest_lat == null || value1.dest_lat == "null" || value1.dest_lng == null || value1.dest_lng == "null")) {
                                    a_lat = value1.dest_lat;
                                    a_lng = value1.dest_lng;
                                }
                            } else if (value1.order_type == "Transfer") {
                                if (!(typeof (value1.origin_company_name) == "undefined" || value1.origin_company_name == "null" || value1.origin_company_name == null || value1.origin_company_name == "")) {
                                    customer_name = escapeHtmlAlternate(value1.origin_company_name);
                                }
                                var addr = '';
                                var addr1 = "";
                                var time_window = '';
                                var from_terminal = get_active_warehouse(value1.from_terminal, 'warehouse_initials');
                                var to_terminal = get_active_warehouse(value1.to_terminal, 'warehouse_initials');
                                var transfer_terms = "TID #" + value1.truck_o_t_id + " " + from_terminal + ' - ' + to_terminal;
                                var transfer_tids = "TID #" + value1.truck_o_t_id;
                                if (value1.dest_warehouse_info[0].addressline1) {
                                    addr1 += value1.dest_warehouse_info[0].addressline1;
                                }
                                if (value1.dest_warehouse_info[0].addressline2) {
                                    addr1 += ', ' + value1.dest_warehouse_info[0].addressline2;
                                }
                                if (value1.dest_warehouse_info[0].city) {
                                    addr1 += ', ' + value1.dest_warehouse_info[0].city;
                                }
                                if (value1.dest_warehouse_info[0].state) {
                                    addr1 += ', ' + value1.dest_warehouse_info[0].state;
                                }
                                if (value1.dest_warehouse_info[0].zipcode) {
                                    addr1 += ', ' + value1.dest_warehouse_info[0].zipcode;
                                }
                                if (value1.dest_addressline1) {
                                    addr += value1.dest_addressline1;
                                }
                                if (value1.dest_addressline2) {
                                    addr += ', ' + value1.dest_addressline2;
                                }
                                if (value1.dest_city) {
                                    addr += ', ' + value1.dest_city;
                                }
                                if (value1.dest_state) {
                                    addr += ', ' + value1.dest_state;
                                }
                                if (value1.dest_zip) {
                                    addr += ', ' + value1.dest_zip;
                                }
                                if (value1.t_sch_win) {
                                    time_window = value1.t_sch_win;
                                }
                                var type = "Transfer";
                                var type_head = "T";
                                var loc_name = value1.term;
                                var transfer_id = value1.truck_o_t_id;
                                var info_data = '';
                                info_data += '<label>' + value1.orders_id + ' ' + type_head + ' [' + value1.term + '] ' + ' - ' + value1.dest_warehouse_info[0].company_name + '</label><p>' + addr1 + '</p><p>' + value1.dest_warehouse_info[0].contact_phone + '</p>';
                                const infowindow1 = new google.maps.InfoWindow({
                                    content: info_data,
                                });
                                if (!(value1.dest_warehouse_info[0].lat == null || value1.dest_warehouse_info[0].lat == "null" || value1.dest_warehouse_info[0].lng == null || value1.dest_warehouse_info[0].lng == "null")) {
                                    a_lat = value1.dest_warehouse_info[0].lat;
                                    a_lng = value1.dest_warehouse_info[0].lng;
                                }
                            } else {
                                if (!(typeof (value1.origin_company_name) == "undefined" || value1.origin_company_name == "null" || value1.origin_company_name == null || value1.origin_company_name == "")) {
                                    customer_name = escapeHtmlAlternate(value1.origin_company_name);
                                }
                                var addr = '';
                                var time_window = '';
                                if (value1.origin_addressline1) {
                                    addr += value1.origin_addressline1;
                                }
                                if (value1.origin_addressline2) {
                                    addr += ', ' + value1.origin_addressline2;
                                }
                                if (value1.origin_city) {
                                    addr += ', ' + value1.origin_city;
                                }
                                if (value1.origin_state) {
                                    addr += ', ' + value1.origin_state;
                                }
                                if (value1.origin_zip) {
                                    addr += ', ' + value1.origin_zip;
                                }
                                if (value1.scheduled_pickup_window) {
                                    time_window = value1.scheduled_pickup_window;
                                }
                                var type = "Pickup";
                                var type_head = "P";
                                var loc_name = value1.origin_loc_name;
                                var transfer_id = '';
                                var info_data = '';
                                info_data += '<label>' + value1.orders_id + ' ' + type_head + ' - ' + value1.origin_company_name + '</label><p>' + addr + '</p><p>' + value1.origin_contact_phone + '</p>';
                                const infowindow1 = new google.maps.InfoWindow({
                                    content: info_data,
                                });
                                if (!(value1.origin_lat == null || value1.origin_lat == "null" || value1.origin_lng == null || value1.origin_lng == "null")) {
                                    a_lat = value1.origin_lat;
                                    a_lng = value1.origin_lng;
                                }
                            }
                            var text_color = getTextColor(color);
                            if (a_lat == null || a_lat == "null" || a_lng == null || a_lng == "null") {
                            } else {
                                var lat = a_lat;
                                var lng = a_lng;
                                var obj = {
                                    lat,
                                    lng
                                };
                                auto_routes[value1.stop_num - 1] = (obj);
                            }
                            trucks_orders_array_inner.push({
                                'id': value1.orders_id,
                                'address': addr,
                                'window': time_window,
                                'type': type,
                                'transfer_id': transfer_id,
                                'truck_order_id': value1.truck_order_id,
                                'coordinates': obj,
                                'color': color,
                                'info_window_data': info_data,
                                'is_locked': value.r_is_lock,
                                'total_labels_in_order': value1.total_labels_in_order,
                                'scanned_labels_in_order': value1.scanned_labels_in_order
                            });
                            var datep = $('#save_truck_date').val();
                            var Date_today = new Date();
                            var Date_obj = new Date(datep);
                            var status_str = "";
                            var no_move = 0;
                            if (value.day_started_at != "") {
                                no_move = 1;
                            }
                            var delivered_qty = "";
                            var tranfered_qty = "";
                            var class_status_str = "btn-success";
                            if (value1.qty_for_delivery != "" && value1.to_type != 3 && value1.qty_for_delivery != value1.quantity) {
                                delivered_qty = '(' + value1.qty_for_delivery + '/' + value1.quantity + ')';
                                class_status_str = 'btn-danger';
                            }
                            else if (value1.transferred_items != "" && value1.to_type == 3 && value1.transferred_items != value1.transfered_qty) {
                                tranfered_qty = '(' + value1.transferred_items + '/' + value1.transfered_qty + ')';
                                class_status_str = 'btn-danger';
                            }
                            switch (value1.tr_o_status) {
                                case TRUCK_ORDER_STATUS.SCHEDULED:
                                    status_str = "<span class='badge btn-primary status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.SCHEDULED] + "</b></span>";
                                    break;
                                case TRUCK_ORDER_STATUS.IN_TRANSIT:
                                    status_str = "<span class='badge btn-warning status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.IN_TRANSIT] + "</b></span>";
                                    break;
                                case TRUCK_ORDER_STATUS.ARRIVED:
                                    status_str = "<span class='badge status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.ARRIVED] + "</b></span>";
                                    break;
                                case TRUCK_ORDER_STATUS.UNLOADED:
                                    status_str = "<span style='color:#cc0099' class='status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.UNLOADED] + "</b></span>";
                                    break;
                                case TRUCK_ORDER_STATUS.LOADED:
                                    status_str = "<span style='color:#cc0099' class='status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.LOADED] + "</b></span>";
                                    break;
                                case TRUCK_ORDER_STATUS.FINISHED:
                                    status_str = "<span class='badge " + class_status_str + " status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.FINISHED] + delivered_qty + tranfered_qty + "</b></span>";
                                    break;
                                case constants.TRUCK_ORDER_STATUS.CANCELLED:
                                    status_str = "<span class='badge btn-danger status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.CANCELLED] + "</b></span>";
                                    break;
                                case TRUCK_ORDER_STATUS.UNABLE_TO_COMPLETE:
                                    status_str = "<span class='badge btn-danger status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.UNABLE_TO_COMPLETE] + "</b></span>";
                                    break;
                                default:
                                    status_str = "<span class='badge btn-primary status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.SCHEDULED] + "</b></span>";
                            }
                            if (value1.order_status == ORDER_STATUS.DELIVERED) {
                                var order_total_quantity = parseInt(value1.quantity);
                                var total_deliverd_quant = parseInt(value1.total_item_delivered);
                                if (total_deliverd_quant != order_total_quantity) {
                                    status_str = "<span class='badge btn-danger status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.FINISHED] + "</b>(" + total_deliverd_quant + "/" + order_total_quantity + ")</span>";
                                } else {
                                    status_str = "<span class='badge btn-success status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.FINISHED] + "</b></span>";
                                }
                            }
                            if (value1.order_status == ORDER_STATUS.CANCELLED) {
                                status_str = "<span class='badge btn-danger status_str'><b>Cancelled</b></span>";
                            }
                            if (dateInPast(Date_obj, Date_today)) {
                                var View_only = 1;
                            } else if (value1.is_not_movable == 1) {
                                var View_only = 2;
                            } else {
                                var View_only = 0;
                            }
                            var scanned_labels_in_order = value1.scanned_labels_in_order;
                            var total_labels_in_order = value1.total_labels_in_order;
                            if (View_only == 0) {
                                var li_class = "";
                                if (no_move == 1) {
                                    var show_unassign = (is_locked) ? "none" : "";
                                    if (value1.tr_o_status == TRUCK_ORDER_STATUS.FINISHED) {
                                        var li_class = "sorting-disabled";
                                        var html_button = '<div class="dropdown"><button class="btn btn-sm btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><i class="fa fa-ellipsis-h"></i></button><ul class="dropdown-menu dropdown-menu-right"><li><a class="edit_order_info" data-truck-number="' + value.trucks_id + '"  data-order-number="' + value1.t_o_id + type_head + transfer_id + '" data-transfer-id = "' + value1.transfer_id + '" data-truck-order = "' + value1.truck_order_id + '" href="Javascript:void(0)">Edit Order Info</a></li></ul></div>';
                                    } else {
                                        var html_button = '<div class="dropdown"><button class="btn btn-sm btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><i class="fa fa-ellipsis-h"></i></button><ul class="dropdown-menu dropdown-menu-right"><li><a class="edit_order_info" data-truck-number="' + value.trucks_id + '"  data-order-number="' + value1.t_o_id + type_head + transfer_id + '" data-transfer-id = "' + value1.transfer_id + '" data-truck-order = "' + value1.truck_order_id + '" href="Javascript:void(0)">Edit Order Info</a></li><li><a class="unassign_button" data-stop_num="' + key + '" style="display:' + show_unassign + '" data-truck-number="' + value.trucks_id + '" data-order-number="' + value1.t_o_id + type_head + transfer_id + '" data-loc="' + loc_name + '"  data-transfer-id = "' + value1.transfer_id + '" data-remove-scanned-label="' + scanned_labels_in_order + '" data-label-in-order="' + total_labels_in_order + '"data-addr-unassign="' + addr + '" data-addr-unassign_warehouse="' + addr1 + '" href="Javascript:void(0)">Unassign</a></li></ul></div>';
                                    }

                                } else {
                                    var show_unassign = (is_locked) ? "none" : "";
                                    var html_button = '<div class="dropdown"><button class="btn btn-sm btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><i class="fa fa-ellipsis-h"></i></button><ul class="dropdown-menu dropdown-menu-right"><li><a  class="move_button" style="display:' + show_unassign + '" data-truck-number="' + value.trucks_id + '" data-order-number="' + value1.t_o_id + type_head + transfer_id + '" data-remove-scanned-label="' + scanned_labels_in_order + '" data-label-in-order="' + total_labels_in_order + '" data-loc="' + loc_name + '" data-transfer-id = "' + value1.transfer_id + '" href="Javascript:void(0)">Move</a></li><li><a class="edit_order_info" data-truck-number="' + value.trucks_id + '"  data-order-number="' + value1.t_o_id + type_head + transfer_id + '" data-transfer-id = "' + value1.transfer_id + '" data-truck-order = "' + value1.truck_order_id + '" href="Javascript:void(0)">Edit Order Info</a></li><li><a class="unassign_button" data-stop_num="' + key + '" style="display:' + show_unassign + '" data-truck-number="' + value.trucks_id + '" data-order-number="' + value1.t_o_id + type_head + transfer_id + '"data-transfer-id = "' + value1.transfer_id + '" data-remove-scanned-label="' + scanned_labels_in_order + '" data-label-in-order="' + total_labels_in_order + '" data-loc="' + loc_name + '" data-addr-unassign_warehouse="' + addr1 + '" data-addr-unassign="' + addr + '" href="Javascript:void(0)">Unassign</a></li></ul></div>';
                                }
                                if (value1.tr_o_status == TRUCK_ORDER_STATUS.CANCELLED) {
                                    li_class = 'sorting-disabled';
                                    var html_button = '';
                                }
                            } else if (View_only == 2) {
                                var li_class = "sorting-disabled";
                                var html_button = '<div class="dropdown"><button class="btn btn-sm btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><i class="fa fa-ellipsis-h"></i></button><ul class="dropdown-menu dropdown-menu-right"><li><a class="view_order_info" data-truck-number="' + value.trucks_id + '"  data-order-number="' + value1.t_o_id + type_head + transfer_id + '" data-transfer-id = "' + value1.transfer_id + '" data-truck-order = "' + value1.truck_order_id + '" href="Javascript:void(0)">Edit Order Info</a></li></ul></div>';
                                if (value1.order_status == ORDER_STATUS.CANCELLED) {
                                    if (value1.to_type == 3) {
                                        switch (value1.tr_o_status) {
                                            case TRUCK_ORDER_STATUS.SCHEDULED:
                                                status_str = "<span class='badge btn-primary status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.SCHEDULED] + "</b></span>";
                                                break;
                                            case TRUCK_ORDER_STATUS.IN_TRANSIT:
                                                status_str = "<span class='badge btn-warning status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.IN_TRANSIT] + "</b></span>";
                                                break;
                                            case TRUCK_ORDER_STATUS.ARRIVED:
                                                status_str = "<span class='badge status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.ARRIVED] + "</b></span>";
                                                break;
                                            case TRUCK_ORDER_STATUS.UNLOADED:
                                                status_str = "<span style='color:#cc0099' class='status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.UNLOADED] + "</b></span>";
                                                break;
                                            case TRUCK_ORDER_STATUS.LOADED:
                                                status_str = "<span style='color:#cc0099' class='status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.LOADED] + "</b></span>";
                                                break;
                                            case TRUCK_ORDER_STATUS.FINISHED:
                                                status_str = "<span class='badge btn-success status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.FINISHED] + "</b></span>";
                                                break;
                                            case TRUCK_ORDER_STATUS.CANCELLED:
                                                status_str = "<span class='badge btn-danger status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.CANCELLED] + "</b></span>";
                                                break;
                                            case TRUCK_ORDER_STATUS.UNABLE_TO_COMPLETE:
                                                status_str = "<span class='badge btn-danger status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.UNABLE_TO_COMPLETE] + "</b></span>";
                                                break;
                                            default:
                                                status_str = "<span class='badge btn-primary status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.SCHEDULED] + "</b></span>";
                                        }
                                    } else {
                                        var status_str = "<span class='badge btn-danger status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.CANCELLED] + "</b></span>";
                                    }
                                } else {
                                    if (value1.order_status == ORDER_STATUS.DELIVERED) {
                                        var order_total_quantity = parseInt(value1.quantity);
                                        var total_deliverd_quant = parseInt(value1.total_item_delivered);
                                        if (total_deliverd_quant != order_total_quantity) {
                                            status_str = "<span class='badge btn-danger status_str'><b>Finished </b>(" + total_deliverd_quant + "/" + order_total_quantity + ")</span>";
                                        } else {
                                            status_str = "<span class='badge btn-success status_str'><b>Finished</b></span>";
                                        }
                                    } else {
                                        var status_str = "";
                                    }
                                }
                            } else {
                                var li_class = "sorting-disabled";
                                var html_button = "";
                            }
                            if (is_locked) {
                                var li_class = "sorting-disabled";
                            }
                            var order_notify = '';
                            if (value1.call_ahead_status == CALL_AHEAD_STATUS.CONFIRMED) {
                                order_notify = '<p class="toa-customer_status small text-success">Order Notification : Confirmed <i class="fa fa-check"></i></p>';
                            }
                            var act_win = "";
                            var late_by = "";
                            html_str = html_str + '<li class="' + li_class + ' truck_ord_list " order_lat="' + a_lat + '" order_lng="' + a_lng + '" truck_o_' + value.trucks_id + ' truck_ord_list" id="t_o_' + value1.t_o_id + type_head + transfer_id + '" truck_order_id="' + value1.truck_order_id + '" truck_tids="' + transfer_tids + '" truck_route_id="' + value1.truck_routes_id + '" data-pieces="' + value1.quantity + '" data-cubes-vol=' + value1.total_cubes + ' data-weight="' + value1.order_weight + '" data-loc="' + loc_name + '" class="truck_ord_list">' + html_button + '<p class="toa-order-by"><span class = "sr-no">' + (i) + '. </span><span class = "order_no">' + value1.t_o_id + '</span>' + '<span class="order-type">' + type_head + '</span>' + ' - <span class="order-company-name">' + customer_name + " " + img_str + ' ' + order_eye + '</span></p><p class="small"><b> ' + transfer_terms + '</b></p><p class="toa-order-address small text-muted">' + addr + '</p><p class="toa-order-time small text-muted" data-transfer = "' + transfer_id + '" data-remove-scanned-label="' + scanned_labels_in_order + '"data-label-in-order="' + total_labels_in_order + '">' + time_window + '</p>' + order_notify + status_str + '<input type="hidden" id="t_o_json_' + value1.t_o_id + type_head + transfer_id + '" data-transfer=' + value1.transfer_id + ' value=\'' + parsejson(value1) + '\'map_info="' + value1.t_o_id + type_head + ' - ' + customer_name + '">';
                            var status_finished = TRUCK_ORDER_STATUS.FINISHED;
                            var status_arrived = TRUCK_ORDER_STATUS.ARRIVED;
                            var id_string = '#t_o_' + value1.t_o_id + type_head + transfer_id;
                            if (value.day_started_at != "") {
                                if (value1.tr_o_status != status_finished && value1.tr_o_status != status_arrived) {

                                    make_start_marker(a_lat, a_lng, false, i, value.t_color, value.t_name);
                                    li_id.push(id_string)
                                }
                            }
                            if (value1.tr_o_status == status_finished) {
                                if (type_head == "P") {
                                    if (value1.actual_pickup_window) {
                                        act_win = "Actual Win:<br>" + value1.actual_pickup_window;
                                    }
                                } else {
                                    if (type_head == "D") {
                                        if (value1.actual_delivery_window) {
                                            act_win = "Actual Win:<br> " + value1.actual_delivery_window;
                                        }
                                    }
                                }
                            }
                            html_str += '<span class="eta-text-arr small text-muted">' + act_win + '</span><span class="eta-text small text-muted"></span><br><span class="late-text small text-muted">' + late_by + '</span></li>';
                        });
                        var t_lines_coords = {
                            'lines': auto_routes,
                            'color': color
                        }
                        $gl_line_coords.push(t_lines_coords);
                        trucks_orders_array_outer[value.trucks_id] = trucks_orders_array_inner;
                        trucks_orders_json = JSON.stringify(trucks_orders_array_outer);
                        original_trucks_json = JSON.stringify(trucks_orders_array_outer);
                        // trucks_json_truck_number = JSON.stringify(trucks_json_truck_number_array);
                        html_str = html_str + '</ul></div></div>';
                        truck_route_number_polyline(value.trucks_id);
                        $('.trucks_div').append(html_str);
                        var datep = $('#save_truck_date').val();
                        var Date_today = new Date();
                        var Date_obj = new Date(datep);
                        if (!dateInPast(Date_obj, Date_today)) {
                            $('.t_o_no_' + value.trucks_id).sortable({
                                connectWith: ".collapses.can_assign",
                                containment: "body",
                                dropOnEmpty: true,
                                scroll: false,
                                cancel: ".sorting-disabled",
                                update: function (event, ui) {
                                    change_trucks_orders(value.trucks_id);
                                    truck_route_number_polyline(value.trucks_id);
                                    console.log("CHeckty3");
                                    $('#changed').val(1)
                                }
                            });
                        }
                        get_user_status_d(value.enc_driver_id, value.trucks_id, 1);
                        get_user_status_d(value.enc_helper_id, value.trucks_id, 2);
                        var onUser_Online = ref($fbDatabase, 'userStatus/' + value.enc_driver_id);
                        onUser_Online.on('value', function (snapshot) {
                            get_user_status_d(value.enc_driver_id, value.trucks_id, 1);
                            get_user_status_d(value.enc_helper_id, value.trucks_id, 2);
                        });
                        class_str = '.t_no_' + value.trucks_id;
                        if (value.day_started_at != "") {
                            get_eta(class_str, li_id, value.is_ended);
                            li_id = [];
                        }
                    });
                    gl_make_lines_on_gmap();
                    if (data.more_data) {
                        $('.load_more_div').html('<center><button class="btn btn-sm btn-primary load_more">Load More</button></center>');
                    } else {
                        $('.load_more_div').html('');
                    }
                }
            }
        });
    }

    function refresh_trucks(sch_date, batch = 0) {
        var trucks_orders_array_outer = {};
        console.log('refresh_trucks');
        $.ajax({
            type: "GET",
            cache: false,
            url: trucksListWithOrdersUrl + '/' + sch_date + '/' + batch,
            success: function (data) {
                if ((data.truck_data.length) == 0) {
                    $('.No-trucks-div').show();
                    $('.trucks_div').hide();
                    $('.scheduled_routes_box').html(0);
                } else {
                    $('.No-trucks-div').hide();
                    $('.trucks_div').show();
                    $('.scheduled_routes_box').html(data.count);
                    if (batch == 0) {
                        $('.trucks_div').html("");
                    }
                    $.each(data.truck_data, async function (key, value) {
                        var t_order_service_time = (value.t_order_service_time) ? value.t_order_service_time : 20;
                        var t_start_time = (value.t_start_time) ? value.t_start_time : "08:00:00";
                        t_start_time = t_start_time.split(":")[0] + ":" + t_start_time.split(":")[1];

                        //Nothing
                        trucks_json = data.truck_data;
                        trucks_json_truck_number[value.trucks_id] = value;
                        var trucks_orders_array_inner = [];
                        var datep = $('#save_truck_date').val();
                        var Date_today = new Date();
                        var Date_obj = new Date(datep);
                        if (dateInPast(Date_obj, Date_today)) {
                            var View_only = 1;
                        } else {
                            var View_only = 0;
                        }
                        var truck_start_address = truck_end_address = truck_start_lat = truck_start_lng = "";
                        if (value.s_addressline1) {
                            truck_start_address += value.s_addressline1;
                        }
                        if (value.s_addressline2) {
                            truck_start_address += ', ' + value.s_addressline2;
                        }
                        if (value.s_city) {
                            truck_start_address += ', ' + value.s_city;
                        }
                        if (value.s_state) {
                            truck_start_address += ', ' + value.s_state;
                        }
                        if (value.s_zipcode) {
                            truck_start_address += ', ' + value.s_zipcode;
                        }
                        if (!(value.s_latitude == null || value.s_latitude == "null" || value.s_longitude == null || value.s_longitude == "null")) {
                            truck_start_lat = value.s_latitude;
                            truck_start_lng = value.s_longitude;
                        }
                        else {
                            geocoder = new google.maps.Geocoder();
                            await geocoder.geocode({
                                'address': truck_start_address
                            }, function (results, status) {
                                truck_start_lat = results[0].geometry.location.lat();
                                truck_start_lng = results[0].geometry.location.lng();
                            });
                        }
                        var time_window = '';
                        if (value.driver == "") {
                            if (View_only == 0) {
                                // Create the anchor element
                                var driverWebElm = $("<a>", {
                                    href: "javascript:void(0)",
                                    class: "add-driver-to-truck",
                                    "data-truck-number": value.trucks_id,
                                });
                                // Create the <i> element and add it as a child of the anchor
                                var iElement = $("<i>", {
                                    class: "fa fa-plus",
                                });
                                // Append the <i> element as a child of the anchor
                                driverWebElm.append(iElement);
                            }
                        } else {
                            if (View_only == 1) {
                                var driverWebElm = value.driver;
                            } else {

                                var driverWebElm = $("<div>");

                                // Create the driver status span element
                                var driverStatusElement = $("<span>", {
                                    class: "driver_status_str_" + value.trucks_id,
                                });

                                // Create the remove-driver anchor element
                                var removeDriverElement = $("<a>", {
                                    href: "javascript:void(0)",
                                    class: "remove-driver",
                                    "data-truck-number": value.trucks_id,
                                });

                                // Create the <i> element and add it as a child of the remove-driver anchor
                                var removeDriverIconElement = $("<i>", {
                                    class: "fa fa-trash",
                                });

                                // Append the <i> element as a child of the remove-driver anchor
                                removeDriverElement.append(removeDriverIconElement);

                                // Create the send_d_h_sms anchor element
                                var sendDHSmsElement = $("<a>", {
                                    href: "javascript:void(0)",
                                    class: "send_d_h_sms sms_driver",
                                    "data-d-h-name": value.driver,
                                    "data-send-type": "1",
                                    "data-send-id": value.driver_id,
                                });

                                // Create the <i> element and add it as a child of the send_d_h_sms anchor
                                var sendDHSmsIconElement = $("<i>", {
                                    class: "fa fa-comment",
                                });

                                // Append the <i> element as a child of the send_d_h_sms anchor
                                sendDHSmsElement.append(sendDHSmsIconElement);

                                // Combine all the elements together to form the final driverWebElm
                                driverWebElm.append(value.driver + " ");
                                driverWebElm.append(driverStatusElement);
                                driverWebElm.append(removeDriverElement);
                                driverWebElm.append(sendDHSmsElement);
                            }
                            drivers_json[value.trucks_id] = value.driver_id;
                            $('#drivers_json').val(JSON.stringify(drivers_json));
                        }
                        if (value.helper == "") {
                            if (View_only == 1) {
                                var helperElement = "";
                            } else {
                                // Create the anchor element
                                var helperElement = $("<a>", {
                                    href: "javascript:void(0)",
                                    class: "add-helper-to-truck",
                                    "data-truck-number": value.trucks_id,
                                });

                                // Create the <i> element and add it as a child of the anchor
                                var helperIconElement = $("<i>", {
                                    class: "fa fa-plus",
                                });

                                // Append the <i> element as a child of the anchor
                                helperElement.append(helperIconElement);
                            }
                        } else {
                            if (View_only == 1) {
                                var helperElement = value.helper;
                            } else {

                                // Create the <span> element
                                var helperStatusElement = $("<span>", {
                                    class: "helper_status_str_" + value.trucks_id,
                                });

                                // Set the text for the <span> element
                                helperStatusElement.text(value.helper + " ");

                                // Create the first <a> element for removing the helper
                                var removeHelperElement = $("<a>", {
                                    href: "javascript:void(0)",
                                    class: "remove-helper",
                                    "data-truck-number": value.trucks_id,
                                });

                                // Create the <i> element and add it as a child of the first <a> element
                                var removeHelperIconElement = $("<i>", {
                                    class: "fa fa-trash",
                                });

                                // Append the <i> element as a child of the first <a> element
                                removeHelperElement.append(removeHelperIconElement);

                                // Create the second <a> element for sending SMS
                                var sendSmsElement = $("<a>", {
                                    href: "javascript:void(0)",
                                    class: "send_d_h_sms sms_helper",
                                    "data-d-h-name": value.helper,
                                    "data-send-type": "2",
                                    "data-send-id": value.helper_id,
                                });

                                // Create the <i> element and add it as a child of the second <a> element
                                var sendSmsIconElement = $("<i>", {
                                    class: "fa fa-comment",
                                });

                                // Append the <i> element as a child of the second <a> element
                                sendSmsElement.append(sendSmsIconElement);

                                // Concatenate all the generated elements and text
                                var helperElement = helperStatusElement.prop('outerHTML') + value.helper + " " +
                                    removeHelperElement.prop('outerHTML') + sendSmsElement.prop('outerHTML');
                                console.log(helperElement);
                            }
                            helpers_json[value.trucks_id] = value.helper_id;
                            $('#helpers_json').val(JSON.stringify(helpers_json));
                        }
                        var lockElement = "";
                        var is_locked = false;
                        var sortBtnElement = "";
                        if (!dateInPast(Date_obj, Date_today)) {
                            if (value.r_is_lock == 0) {
                                lockElement = $('<i>', {
                                    class: 'fa fa-unlock fa-sm',
                                });
                                is_locked = false;
                                sortBtnElement = $('<div>', {
                                    class: 'toa-sort-orders',
                                    'data-truck-number': value.trucks_id,
                                });

                                // Create the small elements for sorting options
                                var shortestDistanceElement = $('<small>', {
                                    class: 'short-dist bg-info',
                                    text: 'Shortest Distance',
                                });

                                var reverseRoutesElement = $('<small>', {
                                    class: 'rev-route bg-info',
                                    text: 'Reverse Routes',
                                });

                                var calcTimeElement = $('<small>', {
                                    class: 'calc-time-truck bg-info',
                                    'data-truck-id': value.trucks_id,
                                    text: 'Calc. Time',
                                });

                                // Append the small elements to the sort_btn container
                                sortBtnElement.append(shortestDistanceElement, reverseRoutesElement, calcTimeElement);
                            } else {

                                locked_trucks_id.push(Number(value.trucks_id));
                                lockElement = $('<i>', {
                                    class: 'text-danger fa fa-lock fa-sm',
                                });
                                is_locked = true;
                                sortBtnElement = $('<div>', {
                                    class: 'toa-sort-orders',
                                    style: 'display: none;',
                                    'data-truck-number': value.trucks_id,
                                });

                                // Create the small elements for sorting options
                                var shortestDistanceElement = $('<small>', {
                                    class: 'short-dist bg-info',
                                    text: 'Shortest Distance',
                                });

                                var reverseRoutesElement = $('<small>', {
                                    class: 'rev-route bg-info',
                                    text: 'Reverse Routes',
                                });

                                var calcTimeElement = $('<small>', {
                                    class: 'calc-time-truck bg-info',
                                    'data-truck-id': value.trucks_id,
                                    text: 'Calc. Time',
                                });

                                // Append the small elements to the sortBtnElement container
                                sortBtnElement.append(shortestDistanceElement, reverseRoutesElement, calcTimeElement);
                            }

                            calc_time = $('<i>', {
                                class: 'fa fa-clock fa-sm',
                            });
                            swap_truck = $('<i>', {
                                class: 'fa fa-exchange fa-sm',
                            });
                            save_single = $('<i>', {
                                class: 'fa fa-floppy fa-sm',
                            });
                        }
                        if (value.is_ended == 1) {
                            ended = $('<i>', {
                                class: 'text text-danger msg_ended',
                                text: '(Ended)'
                            });
                        } else {
                            var ended = "";
                        }
                        var current_date = moment().format('YYYY/MM/DD');
                        var started_date = moment(value.started_date).format('YYYY/MM/DD');
                        if (value.day_started_at != "" && value.is_ended != 1 && moment(started_date).isSame(current_date)) {
                            endTdBtnElement = $('<a>', {
                                'data-truck-number': value.trucks_id,
                                class: 'end-day-deliveries',
                            }).append($('<i>', { class: 'fa fa-power-off' })).append(' End todays Deliveries');
                        } else {
                            var endTdBtnElement = '';
                        }
                        var can_assign = is_locked ? "" : "can_assign";
                        var total_labels_in_truck = value.total_labels_in_truck!=undefined?value.total_labels_in_truck:0;
                        var scanned_labels_in_truck = value.scanned_labels_in_truck!=undefined?value.scanned_labels_in_truck:0;
                        var divTruck = $("<div>", {
                            class: "panel panel-dark t_no_" + value.trucks_id,
                            "entity-id": value.id,
                            "data-is-locked": value.r_is_lock,
                            "data-is-ended": value.is_ended,
                            "data-is-started": value.day_started_at,
                            "data-start-lat": value.truck_start_lat,
                            "data-start-lng": value.truck_start_lng,
                            "data-start-address": value.truck_start_address,
                        });

                        var panelHeadingElement = $('<div>', {
                            class: 'panel-heading',
                            'truck-color': value.t_color,
                            style: 'background-color:' + value.t_color,
                        }).append(
                            $('<h3>', {
                                class: 'panel-title truck_name_title',
                                style: 'font-weight:600',
                                text: value.t_name + (value.ended ? ' Ended' : ''),
                            }).append(ended),
                            $('<ul>', {
                                class: 'pull-right truck--actions--list',
                            }).append(
                                $('<li>').append(
                                    $('<span>', {
                                        class: 'clickable',
                                    }).html('<i class="fa fa-chevron-down fa-sm"></i>')
                                )
                            )
                        );
                        divTruck.append(panelHeadingElement);

                        var panelHeadingBtnActionsElement = $('<div>', {
                            class: 'panel-heading btn-actions',
                            'truck-color': value.t_color,
                            style: 'background-color:#baba9b',
                        }).append(
                            $('<ul>', {
                                class: 'truck--actions--list',
                                style: 'margin-left: auto;',
                            }).append(
                                $('<li>').append(
                                    $('<span>').append(
                                        $('<a>', {
                                            class: 'lock-truck',
                                            title: 'Lock Truck',
                                            'data-is-locked': value.r_is_lock,
                                            'data-truck-id': value.trucks_id,
                                            href: value.lock_link,
                                        }).append(lockElement)
                                    )
                                ),
                                $('<li>').append(
                                    $('<span>').append(
                                        $('<a>', {
                                            class: 'save-single-route',
                                            title: 'Save This Route',
                                            'data-truck-id': value.trucks_id,
                                            href: 'Javascript:void(0)',
                                        }).append($('<i>', { class: 'fa fa-floppy fa-sm' }))
                                    )
                                ),
                                $('<li>', { style: 'display:none;' }).append(
                                    $('<span>', { class: 'showMapMarkers' }).append(
                                        $('<i>', {
                                            class: 'fa fa-map-marker',
                                            style: 'background: transparent; font-size: 18px; color: white; cursor:pointer;',
                                        })
                                    )
                                ),
                                $('<li>').append(
                                    $('<span>').append(
                                        $('<a>', {
                                            target: '_blank',
                                            href: value.view_link,
                                        }).append($('<i>', { class: 'fa fa-eye fa-sm' }))
                                    )
                                ),
                                $('<li>').append(
                                    $('<span>', {
                                        class: 'view_order_log',
                                        'data-route-number': value.id,
                                    }).append($('<i>', { class: 'fa fa-file fa-sm' }))
                                ),
                                $('<li>').append(
                                    $('<span>').append(
                                        $('<a>', {
                                            class: 'swap-truck',
                                            'data-truck-name': value.t_name,
                                            title: 'Swap Truck Orders',
                                            'data-truck-id': value.trucks_id,
                                            href: 'Javascript:void(0)',
                                        }).append($('<i>', { class: 'fa fa-exchange fa-sm' }))
                                    )
                                )
                            )
                        );
                        divTruck.append(panelHeadingBtnActionsElement);
                        var panelBodyElement = $("<div>", { class: "panel-body" }).append(
                            $("<ul>", { class: "truck-stats-info" }).append(
                                $("<li>").append(
                                    $("<span>").text("Vol: ").append(
                                        $("<strong>").append(
                                            $("<span>", { class: "t_no_" + value.trucks_id + "_vol" }).text(parseInt(value.Volume)),
                                            "/",
                                            $("<span>", { class: "t_no_" + value.trucks_id + "_max_vol" }).text(parseInt(value.max_volume))
                                        )
                                    )
                                ),
                                $("<li>").append(
                                    $("<span>").text("Weight: ").append(
                                        $("<strong>").append(
                                            $("<span>", { class: "t_no_" + value.trucks_id + "wt" }).text(parseInt(value.weight)),
                                            "/",
                                            $("<span>", { class: "t_no_" + value.trucks_id + "_max_wt" }).text(parseInt(value.max_weight))
                                        )
                                    )
                                ),
                                $("<li>").append(
                                    $("<span>").text("Pieces: ").append(
                                        $("<strong>").append($("<span>", { class: "t_no_" + value.trucks_id + "_pieces" }).text(value.pieces))
                                    )
                                ),
                                $("<li>"),
                                $("<li>").append(
                                    $("<span>").text("Driver: ").append(
                                        $("<strong>").append($("<a>", { href: "Javascript:void(0)" }))
                                            .append($("<i>", { class: "fa fa-user" }), " ", driverWebElm)
                                    )
                                ),
                                $("<li>").append(
                                    $("<span>").text("Started at: ").append($("<strong>").html(value.day_started_at))
                                ),
                                $("<li>").append(
                                    $("<span>").text("Helper: ").append(
                                        $("<strong>").append(helperElement)
                                    )
                                ),
                                $("<li>").append(
                                    $("<span>").text("Ended at: ").append($("<strong>").html(value.day_ended_at))
                                )
                            )
                        );

                        var briefingSheetContainer = $("<div>", {
                            style: "display: flex; align-items: center; justify-content: space-around;",
                        });

                        // Create the "Briefing Sheet" link (first link)
                        var briefingSheetLink = $("<a>", {
                            id: "bs",
                            "data-tr_id": value.tr_id,
                            "data-toggle": "modal",
                            "data-target": "#briefing_sheet_modal",
                            class: "bs-btns",
                            text: "Briefing Sheet",
                        });

                        // Create the "Running Behind" link (second link with display set to none)
                        var runningBehindLink = $("<a>", {
                            style: "display: none;", // Set to "block" or "inline-block" to display the link
                            "data-toggle": "modal",
                            "data-target": "#running_behind_modal",
                            id: "rb",
                            class: "bs-btns",
                            text: "Running Behind",
                        });
                        briefingSheetContainer.append(briefingSheetLink, runningBehindLink);
                        panelBodyElement.append(briefingSheetContainer);
                        // panelBodyElement.append(endTdBtnElement, value.recent_act, labelScanElement, sortBtnElement);
                        panelBodyElement.append(endTdBtnElement, value.recent_act, sortBtnElement);
                        var truckListElement = $("<ul>", {
                            class: "truck-orders-addresses collapses " + can_assign + " t_o_no_" + value.trucks_id,
                            "data-t_order_service_time": value.t_order_service_time,
                            "data-t_start_time": value.t_start_time,
                        });
                        // divTruck.append(panelBodyElement);
                        // $('.trucks_div').append(divTruck);
                        // return;

                        var i = 0;
                        if (data.orders_data[value.trucks_id].length == 0) {
                            return;
                        }
                        var color = value.t_color;

                        var auto_routes = [];
                        var img_str = "";
                        var order_eye = "";
                        if (value.day_started_at != "") {
                            get_user_status_once(value.enc_driver_id, value.trucks_id, 1);
                        }

                        $.each(data.orders_data[value.trucks_id], function (key1, value1) {

                            order_eye = $('<a>', {
                                href: orderViewUrl + "/" + value1.o_id
                            }).append($('<i>', { class: 'fa fa-eye' }));

                            console.log('has_sameday 4: ', value1);
                            $img_str = $('<div>');
                            if (value1.is_same_day > 0) {
                                $img_str.append($('<img>', {
                                    title: 'Has Same Day Orders',
                                    style: 'width:18px;',
                                    src: same_day_logo
                                }));
                            } else {
                                $img_str = '';
                            }
                            if (value1.hasOwnProperty('is_cc_internally_unpaid')) {
                                if (value1.is_cc_internally_unpaid == 1) {
                                    if ($img_str == '') {
                                        img_str = $('<span>', { class: 'text-red' }).append($('<i>', { class: 'fa fa-dollar' }));
                                    } else {
                                        $img_str.append($('<span>', { class: 'text-red' }).append($('<i>', { class: 'fa fa-dollar' })));
                                    }
                                }
                            }
                            i = i + 1;
                            var customer_name = "";
                            var from_terminal = to_terminal = transfer_tids = transfer_terms = "";
                            var a_lat = a_lng = null;
                            if (value1.order_type == "Delivery") {
                                if (!(typeof (value1.dest_company_name) == "undefined" || value1.dest_company_name == "null" || value1.dest_company_name == null || value1.dest_company_name == "")) {
                                    customer_name = escapeHtmlAlternate(value1.dest_company_name);
                                }
                                var addr = '';
                                var time_window = '';
                                if (value1.dest_addressline1) {
                                    addr += value1.dest_addressline1;
                                }
                                if (value1.dest_addressline2) {
                                    addr += ', ' + value1.dest_addressline2;
                                }
                                if (value1.dest_city) {
                                    addr += ', ' + value1.dest_city;
                                }
                                if (value1.dest_state) {
                                    addr += ', ' + value1.dest_state;
                                }
                                if (value1.dest_zip) {
                                    addr += ', ' + value1.dest_zip;
                                }
                                if (value1.scheduled_delivery_window) {
                                    var time_window = value1.scheduled_delivery_window;
                                }

                                var type = "Delivery";
                                var type_head = "D";
                                var loc_name = value1.dest_loc_name;
                                var transfer_id = '';
                                labelDiv = $('<label>', { text: value1.orders_id + ' ' + type_head + ' - ' + value1.dest_company_name })
                                paraDiv1 = $('<p>', { text: addr });
                                paraDiv2 = $('<p>', { text: value1.dest_contact_phone });
                                labelDiv.after(paraDiv1);
                                labelDiv.after(paraDiv2);
                                info_data = '<label>' + value1.orders_id + ' ' + type_head + ' - ' + value1.dest_company_name + '</label><p>' + addr + '</p><p>' + value1.dest_contact_phone + '</p>';
                                // info_data += $('<label>', {text: value1.orders_id + ' ' + type_head + ' - ' + value1.dest_company_name}) + $('<p>', {text: addr}) + $('<p>', {text: value1.dest_contact_phone});
                                const infowindow1 = new google.maps.InfoWindow({
                                    content: info_data,
                                });
                                if (!(value1.dest_lat == null || value1.dest_lat == "null" || value1.dest_lng == null || value1.dest_lng == "null")) {
                                    a_lat = value1.dest_lat;
                                    a_lng = value1.dest_lng;
                                }
                            } else if (value1.order_type == "Transfer") {
                                if (!(typeof (value1.origin_company_name) == "undefined" || value1.origin_company_name == "null" || value1.origin_company_name == null || value1.origin_company_name == "")) {
                                    customer_name = escapeHtmlAlternate(value1.origin_company_name);
                                }
                                var addr = '';
                                var addr1 = "";
                                var time_window = '';
                                var from_terminal = get_active_warehouse(value1.from_terminal, 'warehouse_initials');
                                var to_terminal = get_active_warehouse(value1.to_terminal, 'warehouse_initials');
                                var transfer_terms = "TID #" + value1.truck_o_t_id + " " + from_terminal + ' - ' + to_terminal;
                                var transfer_tids = "TID #" + value1.truck_o_t_id;
                                if (value1.dest_warehouse_info[0].addressline1) {
                                    addr1 += value1.dest_warehouse_info[0].addressline1;
                                }
                                if (value1.dest_warehouse_info[0].addressline2) {
                                    addr1 += ', ' + value1.dest_warehouse_info[0].addressline2;
                                }
                                if (value1.dest_warehouse_info[0].city) {
                                    addr1 += ', ' + value1.dest_warehouse_info[0].city;
                                }
                                if (value1.dest_warehouse_info[0].state) {
                                    addr1 += ', ' + value1.dest_warehouse_info[0].state;
                                }
                                if (value1.dest_warehouse_info[0].zipcode) {
                                    addr1 += ', ' + value1.dest_warehouse_info[0].zipcode;
                                }
                                if (value1.dest_addressline1) {
                                    addr += value1.dest_addressline1;
                                }
                                if (value1.dest_addressline2) {
                                    addr += ', ' + value1.dest_addressline2;
                                }
                                if (value1.dest_city) {
                                    addr += ', ' + value1.dest_city;
                                }
                                if (value1.dest_state) {
                                    addr += ', ' + value1.dest_state;
                                }
                                if (value1.dest_zip) {
                                    addr += ', ' + value1.dest_zip;
                                }
                                if (value1.t_sch_win) {
                                    time_window = value1.t_sch_win;
                                }
                                var type = "Transfer";
                                var type_head = "T";
                                var loc_name = value1.term;
                                var transfer_id = value1.truck_o_t_id;
                                labelDiv = $('<label>', { text: value1.orders_id + ' ' + type_head + ' [' + value1.term + '] ' + ' - ' + value1.dest_warehouse_info[0].company_name })
                                paraDiv1 = $('<p>', { text: addr1 });
                                paraDiv2 = $('<p>', { text: value1.dest_warehouse_info[0].contact_phone });
                                labelDiv.after(paraDiv1);
                                labelDiv.after(paraDiv2);
                                var info_data = '<label>' + value1.orders_id + ' ' + type_head + ' [' + value1.term + '] ' + ' - ' + value1.dest_warehouse_info[0].company_name + '</label><p>' + addr1 + '</p><p>' + value1.dest_warehouse_info[0].contact_phone + '</p>';
                                // var info_data = $('<label>', {text:value1.orders_id + ' ' + type_head + ' [' + value1.term + '] ' + ' - ' + value1.dest_warehouse_info[0].company_name})+$('<p>', {text: addr1})+$('<p>', {text:value1.dest_warehouse_info[0].contact_phone});
                                const infowindow1 = new google.maps.InfoWindow({
                                    content: info_data,
                                });
                                if (!(value1.dest_warehouse_info[0].lat == null || value1.dest_warehouse_info[0].lat == "null" || value1.dest_warehouse_info[0].lng == null || value1.dest_warehouse_info[0].lng == "null")) {
                                    a_lat = value1.dest_warehouse_info[0].lat;
                                    a_lng = value1.dest_warehouse_info[0].lng;
                                }
                            } else {
                                if (!(typeof (value1.origin_company_name) == "undefined" || value1.origin_company_name == "null" || value1.origin_company_name == null || value1.origin_company_name == "")) {
                                    customer_name = escapeHtmlAlternate(value1.origin_company_name);
                                }
                                var addr = '';
                                var time_window = '';
                                if (value1.origin_addressline1) {
                                    addr += value1.origin_addressline1;
                                }
                                if (value1.origin_addressline2) {
                                    addr += ', ' + value1.origin_addressline2;
                                }
                                if (value1.origin_city) {
                                    addr += ', ' + value1.origin_city;
                                }
                                if (value1.origin_state) {
                                    addr += ', ' + value1.origin_state;
                                }
                                if (value1.origin_zip) {
                                    addr += ', ' + value1.origin_zip;
                                }
                                if (value1.scheduled_pickup_window) {
                                    time_window = value1.scheduled_pickup_window;
                                }
                                var type = "Pickup";
                                var type_head = "P";
                                var loc_name = value1.origin_loc_name;
                                var transfer_id = '';
                                var info_data = '';
                                labelDiv = $('<label>', { text: value1.orders_id + ' ' + type_head + ' - ' + value1.origin_company_name })
                                paraDiv1 = $('<p>', { text: addr });
                                paraDiv2 = $('<p>', { text: value1.origin_contact_phone });
                                labelDiv.after(paraDiv1);
                                labelDiv.after(paraDiv2);
                                info_data += '<label>' + value1.orders_id + ' ' + type_head + ' - ' + value1.origin_company_name + '</label><p>' + addr + '</p><p>' + value1.origin_contact_phone +/*'V-'+value_inner.total_cubes+' W-'+value_inner.order_weight+' P-'+value_inner.quantity+*/'</p>';
                                const infowindow1 = new google.maps.InfoWindow({
                                    content: info_data,
                                });
                                if (!(value1.origin_lat == null || value1.origin_lat == "null" || value1.origin_lng == null || value1.origin_lng == "null")) {
                                    a_lat = value1.origin_lat;
                                    a_lng = value1.origin_lng;
                                }
                            }
                            var text_color = getTextColor(color);
                            if (a_lat == null || a_lat == "null" || a_lng == null || a_lng == "null") {
                            } else {
                                var lat = a_lat;
                                var lng = a_lng;
                                var obj = {
                                    lat,
                                    lng
                                };
                                auto_routes[value1.stop_num - 1] = (obj);
                            }
                            trucks_orders_array_inner.push({
                                'id': value1.orders_id,
                                'address': addr,
                                'window': time_window,
                                'type': type,
                                'transfer_id': transfer_id,
                                'truck_order_id': value1.truck_order_id,
                                'coordinates': obj,
                                'color': color,
                                'info_window_data': info_data,
                                'is_locked': value.r_is_lock,
                                'total_labels_in_order': value1.total_labels_in_order,
                                'scanned_labels_in_order': value1.scanned_labels_in_order
                            });
                            var datep = $('#save_truck_date').val();
                            var Date_today = new Date();
                            var Date_obj = new Date(datep);
                            var status_str = "";
                            var no_move = 0;
                            if (value.day_started_at != "") {
                                no_move = 1;
                            }
                            var delivered_qty = "";
                            var tranfered_qty = "";
                            var class_status_str = "btn-success";
                            if (value1.qty_for_delivery != "" && value1.to_type != 3 && value1.qty_for_delivery != value1.quantity) {
                                delivered_qty = '(' + value1.qty_for_delivery + '/' + value1.quantity + ')';
                                class_status_str = 'btn-danger';
                            }
                            else if (value1.transferred_items != "" && value1.to_type == 3 && value1.transferred_items != value1.transfered_qty) {
                                tranfered_qty = '(' + value1.transferred_items + '/' + value1.transfered_qty + ')';
                                class_status_str = 'btn-danger';
                            }
                            var switchClass = '';
                            var switchText = '';
                            var switchColor = '';
                            switch (value1.tr_o_status) {
                                case TRUCK_ORDER_STATUS.SCHEDULED:
                                    switchClass = 'badge btn-primary status_str';
                                    switchText = REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.SCHEDULED];
                                    break;
                                case TRUCK_ORDER_STATUS.IN_TRANSIT:
                                    switchClass = 'badge btn-warning status_str';
                                    switchText = REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.IN_TRANSIT];
                                    break;
                                case TRUCK_ORDER_STATUS.ARRIVED:
                                    switchClass = 'badge status_str';
                                    switchText = REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.ARRIVED];
                                    break;
                                case TRUCK_ORDER_STATUS.UNLOADED:
                                    switchClass = 'status_str';
                                    switchText = REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.UNLOADED];
                                    switchColor = 'color:#cc0099';
                                    break;
                                case TRUCK_ORDER_STATUS.LOADED:
                                    switchClass = 'status_str';
                                    switchText = REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.LOADED];
                                    switchColor = 'color:#cc0099';
                                    break;
                                case TRUCK_ORDER_STATUS.FINISHED:
                                    switchClass = 'badge ' + class_status_str + ' status_str';
                                    switchText = REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.FINISHED];
                                    break;
                                case constants.TRUCK_ORDER_STATUS.CANCELLED:
                                    switchClass = 'badge btn-danger status_str';
                                    switchText = REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.CANCELLED];
                                    break;
                                case TRUCK_ORDER_STATUS.UNABLE_TO_COMPLETE:
                                    switchClass = 'badge btn-danger status_str';
                                    switchText = REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.UNABLE_TO_COMPLETE];
                                    break;
                                default:
                                    switchClass = 'badge btn-primary status_str';
                                    switchText = REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.SCHEDULED];
                            }
                            var textOuter = '';
                            if (value1.order_status == ORDER_STATUS.DELIVERED) {
                                var order_total_quantity = parseInt(value1.quantity);
                                var total_deliverd_quant = parseInt(value1.total_item_delivered);
                                if (total_deliverd_quant != order_total_quantity) {
                                    switchClass = 'badge btn-danger status_str';
                                    switchText = REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.FINISHED];
                                    textOuter = '(' + total_deliverd_quant + "/" + order_total_quantity + ')';
                                } else {
                                    switchClass = 'badge btn-success status_str';
                                    switchText = REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.FINISHED];
                                }
                            }
                            if (value1.order_status == ORDER_STATUS.CANCELLED) {
                                switchClass = 'badge btn-danger status_str';
                                switchText = REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.CANCELLED];
                            }
                            status_str = $('<span>', {
                                class: switchClass,
                            }).append($('<b>', { text: switchText }));
                            if (switchColor != '') {
                                status_str.attr('style', switchColor)
                            }
                            if (textOuter != '') {
                                status_str.text(textOuter);
                            }
                            if (dateInPast(Date_obj, Date_today)) {
                                var View_only = 1;
                            } else if (value1.is_not_movable == 1) {
                                var View_only = 2;
                            } else {
                                var View_only = 0;
                            }
                            var scanned_labels_in_order = value1.scanned_labels_in_order;
                            var total_labels_in_order = value1.total_labels_in_order;
                            // Create the dropdown menu
                            var dropdownMenu = $('<ul>', {
                                class: 'dropdown-menu dropdown-menu-right',
                            })
                            var editOrderButton = ($('<li>').append($('<a>', {
                                class: 'edit_order_info',
                                'data-truck-number': value.trucks_id,
                                'data-order-number': value1.t_o_id + type_head + transfer_id,
                                'data-transfer-id': value1.transfer_id,
                                'data-truck-order': value1.truck_order_id,
                                href: 'Javascript:void(0)',
                            }).text('Edit Order Info')));

                            var unAssignButton = $('<li>').append($('<a>', {
                                class: 'unassign_button',
                                'data-stop_num': key,
                                'data-truck-number': value.trucks_id,
                                'data-order-number': value1.t_o_id + type_head + transfer_id,
                                'data-loc': loc_name,
                                'data-transfer-id': value1.transfer_id,
                                'data-remove-scanned-label': scanned_labels_in_order,
                                'data-label-in-order': total_labels_in_order,
                                'data-addr-unassign': addr,
                                'data-addr-unassign_warehouse': addr1,
                                href: 'Javascript:void(0)',
                            }).text('Unassign'));

                            var moveButton = $('<li>').append($('<a>', {
                                class: 'move_button',
                                'data-stop_num': key,
                                'data-truck-number': value.trucks_id,
                                'data-order-number': value1.t_o_id + type_head + transfer_id,
                                'data-remove-scanned-label': scanned_labels_in_order,
                                'data-label-in-order': total_labels_in_order,
                                'data-loc': loc_name,
                                'data-transfer-id': value1.transfer_id,
                                href: 'Javascript:void(0)',
                            }).text('Move'));
                            if (View_only == 0) {
                                var li_class = "";
                                //creating unassign button

                                var dropdownButton = $('<button>', {
                                    class: 'btn btn-sm btn-primary dropdown-toggle',
                                    type: 'button',
                                    'data-toggle': 'dropdown',
                                }).append($('<i>', {
                                    class: 'fa fa-ellipsis-h',
                                }));
                                if (no_move == 1) {
                                    console.log('test case 1');

                                    if (value1.tr_o_status != TRUCK_ORDER_STATUS.FINISHED) {
                                        var li_class = "sorting-disabled";
                                        dropdownMenu.append(editOrderButton);
                                        if (!is_locked) {
                                            dropdownMenu.append(unAssignButton);
                                        }
                                    } else {
                                        dropdownMenu.append(editOrderButton);
                                        if (!is_locked) {
                                            dropdownMenu.append(unAssignButton);
                                        }
                                    }
                                    // Create the main dropdown element and append the button and menu

                                } else {
                                    if (!is_locked) {
                                        dropdownMenu.append(moveButton, editOrderButton, unAssignButton);
                                    } else {
                                        dropdownMenu.append(editOrderButton);
                                    }
                                }
                                html_button = $('<div>', {
                                    class: 'dropdown',
                                }).append(dropdownButton, dropdownMenu);

                                if (value1.tr_o_status == TRUCK_ORDER_STATUS.CANCELLED) {
                                    li_class = 'sorting-disabled';
                                    var html_button = '';
                                }
                            } else if (View_only == 2) {
                                var li_class = 'sorting-disabled';
                                html_button = $('<div>', {
                                    class: 'dropdown',
                                }).append(dropdownMenu);
                                switchClass = '';
                                switchText = '';
                                switchColor = '';
                                textOuter = '';
                                if (value1.order_status == ORDER_STATUS.CANCELLED) {
                                    if (value1.to_type == ROUTE_TYPE.Transfer) {
                                        switch (value1.tr_o_status) {
                                            case TRUCK_ORDER_STATUS.SCHEDULED:
                                                switchClass = 'badge btn-primary status_str';
                                                switchText = REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.SCHEDULED];
                                                break;
                                            case TRUCK_ORDER_STATUS.IN_TRANSIT:
                                                switchClass = 'badge btn-warning status_str';
                                                switchText = REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.IN_TRANSIT];
                                                break;
                                            case TRUCK_ORDER_STATUS.ARRIVED:
                                                switchClass = 'badge status_str';
                                                switchText = REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.ARRIVED];
                                                break;
                                            case TRUCK_ORDER_STATUS.UNLOADED:
                                                switchClass = 'status_str';
                                                switchText = REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.UNLOADED];
                                                switchColor = 'color:#cc0099';
                                                break;
                                            case TRUCK_ORDER_STATUS.LOADED:
                                                switchClass = 'status_str';
                                                switchText = REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.LOADED];
                                                switchColor = 'color:#cc0099';
                                                break;
                                            case TRUCK_ORDER_STATUS.FINISHED:
                                                switchClass = 'badge ' + class_status_str + ' status_str';
                                                switchText = REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.FINISHED];
                                                break;
                                            case constants.TRUCK_ORDER_STATUS.CANCELLED:
                                                switchClass = 'badge btn-danger status_str';
                                                switchText = REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.CANCELLED];
                                                break;
                                            case TRUCK_ORDER_STATUS.UNABLE_TO_COMPLETE:
                                                switchClass = 'badge btn-danger status_str';
                                                switchText = REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.UNLOADED];
                                                break;
                                            default:
                                                switchClass = 'badge btn-primary status_str';
                                                switchText = REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.SCHEDULED];
                                        }
                                    } else {
                                        switchClass = 'badge btn-danger status_str';
                                        switchText = REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.CANCELLED];
                                    }
                                } else {
                                    if (value1.order_status == ORDER_STATUS.DELIVERED) {
                                        var order_total_quantity = parseInt(value1.quantity);
                                        var total_deliverd_quant = parseInt(value1.total_item_delivered);
                                        if (total_deliverd_quant != order_total_quantity) {
                                            switchClass = 'badge btn-danger status_str';
                                            switchText = REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.FINISHED];
                                            textOuter = '(' + total_deliverd_quant + "/" + order_total_quantity + ')';
                                        } else {
                                            switchClass = 'badge btn-success status_str';
                                            switchText = REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.FINISHED];
                                        }
                                    } else {
                                        var status_str = "";
                                    }
                                }
                                status_str = $('<span>', { class: switchClass }).append($('<b>', { text: switchText }));
                                if (switchColor != '') {
                                    status_str.attr('style', switchColor)
                                }
                                if (textOuter != '') {
                                    status_str.text(textOuter);
                                }
                            } else {
                                var li_class = "sorting-disabled";
                                var html_button = "";
                            }
                            if (is_locked) {
                                var li_class = "sorting-disabled";
                            }
                            var order_notify = '';
                            if (value1.call_ahead_status == CALL_AHEAD_STATUS.CONFIRMED) {
                                order_notify = $('<p>', {
                                    class: 'toa-customer_status small text-success',
                                }).text('Order Notification : Confirmed ').append($('<i>', {
                                    class: 'fa fa-check',
                                }));
                            }
                            var act_win = "";
                            var late_by = "";
                            // html_str = html_str + '<li class="' + li_class + ' truck_ord_list " order_lat="' + a_lat + '" order_lng="' + a_lng + '" id="t_o_' + value1.t_o_id + type_head + transfer_id + '" truck_order_id="' + value1.truck_order_id + '" truck_tids="' + transfer_tids + '" truck_route_id="' + value1.truck_routes_id + '" data-pieces="' + value1.quantity + '" data-cubes-vol=' + value1.total_cubes + ' data-weight="' + value1.order_weight + '" data-loc="' + loc_name + '" class="truck_ord_list">' + html_button + '<p class="toa-order-by"><span class = "sr-no">' + (i) + '. </span><span class = "order_no">' + value1.t_o_id + '</span>' + '<span class="order-type">' + type_head + '</span>' + ' - <span class="order-company-name">' + customer_name + " " + img_str + ' ' + order_eye + '</span></p><p class="small"><b> ' + transfer_terms + '</b></p><p class="toa-order-address small text-muted">' + addr + '</p><p class="toa-order-time small text-muted" data-transfer = "' + transfer_id + '" data-remove-scanned-label="' + scanned_labels_in_order + '"data-label-in-order="' + total_labels_in_order + '">' + time_window + '</p>' + order_notify + status_str + '<input type="hidden" id="t_o_json_' + value1.t_o_id + type_head + transfer_id + '" data-transfer=' + value1.transfer_id + ' value="' + parsejson(value1) + '"map_info="' + value1.t_o_id + type_head + ' - ' + customer_name + '">';
                            var status_finished = TRUCK_ORDER_STATUS.FINISHED;
                            var status_arrived = TRUCK_ORDER_STATUS.ARRIVED;
                            var id_string = '#t_o_' + value1.t_o_id + type_head + transfer_id;
                            if (value.day_started_at != "") {
                                if (value1.tr_o_status != status_finished && value1.tr_o_status != status_arrived) {

                                    make_start_marker(a_lat, a_lng, false, i, value.t_color, value.t_name);
                                    li_id.push(id_string)
                                }
                            }
                            if (value1.tr_o_status == status_finished) {
                                if (type_head == "P") {
                                    if (value1.actual_pickup_window) {
                                        act_win = "Actual Win:<br>" + value1.actual_pickup_window;
                                    }
                                } else {
                                    if (type_head == "D") {
                                        if (value1.actual_delivery_window) {
                                            act_win = "Actual Win:<br>" + value1.actual_delivery_window;
                                        }
                                    }
                                }
                            }
                            // Create the span element for eta-text-arr
                            var etaTextArr = $('<span>', {
                                class: 'eta-text-arr small text-muted',
                            }).html(act_win);

                            // Create the span element for eta-text
                            var etaText = $('<span>', {
                                class: 'eta-text small text-muted',
                            });

                            // Create the span element for late-text
                            var lateText = $('<span>', {
                                class: 'late-text small text-muted',
                            }).text(late_by);

                            // Create the li element
                            var liElement = $('<li>', {
                                class: li_class + ' truck_ord_list truck_ord_list',
                                'order_lat': a_lat,
                                'order_lng': a_lng,
                                id: 't_o_' + value1.t_o_id + type_head + transfer_id,
                                'truck_order_id': value1.truck_order_id,
                                'truck_tids': transfer_tids,
                                'truck_route_id': value1.truck_routes_id,
                                'data-pieces': value1.quantity,
                                'data-cubes-vol': value1.total_cubes,
                                'data-weight': value1.order_weight,
                                'data-loc': loc_name,
                            });

                            // Create the first paragraph element
                            var firstParagraph = $('<p>', {
                                class: 'toa-order-by',
                            }).append(
                                $('<span>', {
                                    class: 'sr-no',
                                }).text(i + '. '),
                                $('<span>', {
                                    class: 'order_no',
                                }).text(value1.t_o_id),
                                $('<span>', {
                                    class: 'order-type',
                                }).text(type_head),
                                ' - ',
                                $('<span>', {
                                    class: 'order-company-name',
                                }).append(customer_name, " ", img_str, " ", order_eye)
                            );

                            // Create the second paragraph element
                            var secondParagraph = $('<p>', {
                                class: 'small',
                            }).append(
                                $('<b>').text(transfer_terms)
                            );

                            // Create the third paragraph element
                            var thirdParagraph = $('<p>', {
                                class: 'toa-order-address small text-muted',
                            }).text(addr);

                            // Create the fourth paragraph element
                            var fourthParagraph = $('<p>', {
                                class: 'toa-order-time small text-muted',
                                'data-transfer': transfer_id,
                                'data-remove-scanned-label': scanned_labels_in_order,
                                'data-label-in-order': total_labels_in_order,
                            }).text(time_window);

                            // Create the hidden input element
                            var hiddenInput = $('<input>', {
                                type: 'hidden',
                                id: 't_o_json_' + value1.t_o_id + type_head + transfer_id,
                                'data-transfer': value1.transfer_id,
                                value: parsejson(value1),
                                'map_info': value1.t_o_id + type_head + ' - ' + customer_name,
                            });

                            // Combine all the created elements
                            liElement.append(
                                html_button,
                                firstParagraph,
                                secondParagraph,
                                thirdParagraph,
                                fourthParagraph,
                                order_notify,
                                status_str,
                                hiddenInput,
                                etaTextArr,
                                etaText,
                                '<br>',
                                lateText
                            );
                            truckListElement.append(liElement);

                        });
                        panelBodyElement.append(truckListElement)
                        divTruck.append(panelBodyElement)
                        truck_route_number_polyline(value.trucks_id);
                        // $('.trucks_div').append(divTruck);
                        var t_lines_coords = {
                            'lines': auto_routes,
                            'color': color
                        }

                        $gl_line_coords.push(t_lines_coords);
                        trucks_orders_array_outer[value.trucks_id] = trucks_orders_array_inner;
                        trucks_orders_json = JSON.stringify(trucks_orders_array_outer);
                        original_trucks_json = JSON.stringify(trucks_orders_array_outer);
                        // trucks_json_truck_number = JSON.stringify(trucks_json_truck_number_array);
                        // html_str = html_str + '</ul></div></div>';
                        truck_route_number_polyline(value.trucks_id);
                        $('.trucks_div').append(divTruck);
                        var datep = $('#save_truck_date').val();
                        var Date_today = new Date();
                        var Date_obj = new Date(datep);
                        if (!dateInPast(Date_obj, Date_today)) {
                            $('.t_o_no_' + value.trucks_id).sortable({
                                connectWith: ".collapses.can_assign",
                                containment: "body",
                                dropOnEmpty: true,
                                scroll: false,
                                cancel: ".sorting-disabled",
                                update: function (event, ui) {
                                    change_trucks_orders(value.trucks_id);
                                    truck_route_number_polyline(value.trucks_id);
                                    console.log("CHeckty3");
                                    $('#changed').val(1)
                                }
                            });
                        }
                        get_user_status_d(value.enc_driver_id, value.trucks_id, 1);
                        get_user_status_d(value.enc_helper_id, value.trucks_id, 2);
                        var onUser_Online = ref($fbDatabase, 'userStatus/' + value.enc_driver_id);
                        onUser_Online.on('value', function (snapshot) {
                            get_user_status_d(value.enc_driver_id, value.trucks_id, 1);
                            get_user_status_d(value.enc_helper_id, value.trucks_id, 2);
                        });
                        class_str = '.t_no_' + value.trucks_id;
                        if (value.day_started_at != "") {
                            get_eta(class_str, li_id, value.is_ended);
                            li_id = [];
                        }
                    });
                    gl_make_lines_on_gmap();
                    var centerDiv = $('<center>').append($('<button>', {
                        class: "btn btn-sm btn-primary load_more",
                        text: "Load More"
                    }))
                    if (data.more_data) {
                        $('.load_more_div').append(centerDiv);
                    } else {
                        $('.load_more_div').html('');
                    }
                }
            }
        });
    }

    function change_trucks_orders(trucks_id) {
        var outer_array = [];
        var json = JSON.parse(trucks_orders_json);
        var total_weight = 0;
        var total_cubes = 0;
        var total_peices = 0;
        var total_labels_in_truck = 0;
        var total_scanned_labels_in_truck = 0;

        var t_order_service_time = $('.t_o_no_' + trucks_id).data("t_order_service_time");
        var t_start_time = $('.t_o_no_' + trucks_id).data("t_start_time");

        $.each($('.t_o_no_' + trucks_id).children('li'), function (key, value) {
            var inner_object = {};
            inner_object['id'] = ($(value).find('.toa-order-by').find('.order_no').html()).trim();
            inner_object['address'] = $(value).find('.toa-order-address').html();
            inner_object['window'] = $(value).find('.toa-order-time').html();
            inner_object['transfer_id'] = $(value).find('.toa-order-time').attr("data-transfer");

            var obj;

            inner_object['color'] = $(".t_no_" + trucks_id).children('div .panel-heading').attr('truck-color');
            var info_data = '';
            info_data += '<label>' + inner_object['id'] + ' ' + $(value).find('.order-type').html();


            var type = $(value).find('.order-type').html();
            var company_name = $(value).find('.order-company-name').html();
            var datep = $('#save_truck_date').val();
            var cubes = $('#t_o_' + inner_object['id'] + type + inner_object['transfer_id']).attr('data-cubes-vol');
            var weight = $('#t_o_' + inner_object['id'] + type + inner_object['transfer_id']).attr('data-weight');
            var pieces = $('#t_o_' + inner_object['id'] + type + inner_object['transfer_id']).attr('data-pieces');
            var scanned_labels_in_order = $(value).find('.toa-order-time').attr('data-remove-scanned-label');
            var total_labels_in_order = $(value).find('.toa-order-time').attr('data-label-in-order');
            scanned_labels_in_order = (scanned_labels_in_order != undefined) ? scanned_labels_in_order : 0;
            total_labels_in_order = (total_labels_in_order != undefined) ? total_labels_in_order : 0;

            total_weight = total_weight + parseInt(weight);
            total_cubes = total_cubes + parseInt(cubes);
            total_peices = total_peices + parseInt(pieces);
            var json = $('#t_o_json_' + (inner_object['id'] + type) + inner_object['transfer_id']).val();
            if (JSON.parse(json)) {
                var json = JSON.parse(json);
            }
            if (json.truck_number != undefined && json.truck_number == trucks_id) {
                total_scanned_labels_in_truck = total_scanned_labels_in_truck + parseInt(scanned_labels_in_order);
            }
            total_labels_in_truck = total_labels_in_truck + parseInt(total_labels_in_order);
            console.log(`total_labels_in_truck : ${total_labels_in_truck}`);
            inner_object['truck_order_id'] = json.truck_order_id;
            if (type == "D") {
                inner_object['type'] = "Delivery";
                var loc_name = json.dest_loc_name;
                info_data += ' - ' + json.dest_company_name + '</label><p>' + inner_object['address'] + '</p><p>' + json.dest_contact_phone + '</p>';
                obj = { lat: json.dest_lat, lng: json.dest_lng };
            } else if (type == "T") {
                inner_object['type'] = "Transfer";
                var loc_name = $('#t_o_' + inner_object['id'] + type).attr('data-loc');
                info_data += ' [' + loc_name + '] ';
                info_data += ' - ' + json.dest_warehouse_info[0].company_name + '</label><p>' + inner_object['address'] + '</p><p>' + json.dest_warehouse_info[0].contact_phone + '</p>';
                obj = { lat: json.dest_warehouse_info[0].lat, lng: json.dest_warehouse_info[0].lng };
            } else {
                inner_object['type'] = "Pickup";
                var loc_name = json.origin_loc_name;
                info_data += ' - ' + json.origin_company_name + '</label><p>' + inner_object['address'] + '</p><p>' + json.origin_contact_phone + '</p>';
                obj = { lat: json.origin_lat, lng: json.origin_lng };
            }
            inner_object['coordinates'] = obj;

            inner_object['info_window_data'] = info_data;
            inner_object['is_locked'] = $(".t_no_" + trucks_id).attr('data-is-locked');

            if (type != "T") { //only for pickup / delivery
                var time_window = inner_object['window'];
                if (time_window) {
                    time_window = value.scheduled_delivery_window;
                }
            }

            var Date_today = new Date();
            var Date_obj = new Date(datep);
            if (dateInPast(Date_obj, Date_today)) {
                var View_only = 1;
                var html_button = '<span class="dropdown dot-div dropleft lower-dot show"><a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><i class="fa fa-caret-down"></i></a><div class="dropdown-menu" aria-labelledby="dropdownMenuLink" x-placement="left-start" style="position: absolute; transform: translate3d(-162px, 1px, 0px); top:-20px; left: 0px; will-change: transform;"><a class="dropdown-item move_button" data-truck-number="' + trucks_id + '"  data-loc-name="' + loc_name + '" data-order-number="' + inner_object['id'] + type + '"  href="Javascript:void(0)">Move</a><a class="dropdown-item unassign_button" data-stop_num="' + key + '"  data-loc-name="' + loc_name + '" data-truck-number="' + trucks_id + '"  data-order-number="' + inner_object['id'] + type + '" href="Javascript:void(0)">Unassign</a><a class="dropdown-item edit_order_info" data-truck-number="' + trucks_id + '"  data-order-number="' + inner_object['id'] + type + '" href="Javascript:void(0)">Edit Order Info</a></div></span>';
            } else if (json.is_not_movable == 1) {
                var View_only = 2;
                var html_button = '<span class="dropdown dot-div dropleft lower-dot show"><a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><i class="fa fa-caret-down"></i></a><div class="dropdown-menu" aria-labelledby="dropdownMenuLink" x-placement="left-start" style="position: absolute; transform: translate3d(-162px, 1px, 0px); top:-5px; left: 0px; will-change: transform;"><a class="dropdown-item view_order_info" data-truck-number="' + trucks_id + '"  data-order-number="' + inner_object['id'] + type + '" href="Javascript:void(0)">View Order Info</a></div></span>';
            } else {
                var View_only = 0;
                var html_button = '<span class="dropdown dot-div dropleft lower-dot show"><a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><i class="fa fa-caret-down"></i></a><div class="dropdown-menu" aria-labelledby="dropdownMenuLink" x-placement="left-start" style="position: absolute; transform: translate3d(-162px, 1px, 0px); top:-20px; left: 0px; will-change: transform;"><a class="dropdown-item move_button" data-truck-number="' + trucks_id + '"  data-loc-name="' + loc_name + '" data-order-number="' + inner_object['id'] + type + '" href="Javascript:void(0)">Move</a><a class="dropdown-item unassign_button" data-stop_num="' + key + '" data-loc-name="' + loc_name + '" data-truck-number="' + trucks_id + '"  data-order-number="' + inner_object['id'] + type + '" href="Javascript:void(0)">Unassign</a><a class="dropdown-item edit_order_info" data-truck-number="' + trucks_id + '"  data-order-number="' + inner_object['id'] + type + '" href="Javascript:void(0)">Edit Order Info</a></div></span>';
            }
            $(value).find('.toa-order-by').html("<span class='sr-no'>" + (key + 1) + ". </span>" + "<span class='order_no'>" + inner_object['id'] + "</span> <span class='order-type'>" + type + '</span> - <span class="order-company-name">' + company_name + '</span>');
            $(value).find('.toa-order-time').html(inner_object['window']);
            outer_array.push(inner_object);
            $(value).find('.dropdown').find('.unassign_button').attr('data-truck-number', trucks_id);
        });
        if ($('.t_o_no_' + trucks_id).children().length == 0) {
            $('.t_no_' + trucks_id).remove();
        }
        $('.t_no_' + trucks_id + 'wt').html(parseInt(total_weight));
        $('.t_no_' + trucks_id + '_vol').html(parseInt(total_cubes));
        $('.t_no_' + trucks_id + '_pieces').html(parseInt(total_peices));
        // if (total_labels_in_truck > 0) {
            //     label_div = '<div class="label_scan main_div_label_' + trucks_id + '">Scanned transfer labels : <span class="label_heighlight"><span class="scanned_label_count_' + trucks_id + '">' + total_scanned_labels_in_truck + '</span>/<span class="label_count_' + trucks_id + '">' + total_labels_in_truck + '</span></div>';
        // } else {
            //     label_div = '';
        // }
        // $('.empty_label_div_' + trucks_id).html(label_div);
        json[trucks_id] = outer_array;
        trucks_orders_json = JSON.stringify(json);

    }

    function getTextColor(hexcolor) {
        hexcolor = hexcolor.replace("#", "");
        var r = parseInt(hexcolor.substr(0, 2), 16);
        var g = parseInt(hexcolor.substr(2, 2), 16);
        var b = parseInt(hexcolor.substr(4, 2), 16);
        var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? '000000' : 'FFFFFF';
    }
    function dateInPast(firstDate, secondDate) {
        // Convert the firstDate and secondDate strings to Date objects
        var first_time = new Date(firstDate).setHours(0, 0, 0, 0);
        var currDate = new Date(); // Get the current date and time as a Date object
        currDate.setHours(0, 0, 0, 0); // Set the time part to midnight (0 hours, 0 minutes, 0 seconds, 0 milliseconds)
        var second_time = currDate.getTime(); // Get the time in milliseconds for the current date

        if (first_time < second_time) {
            return true;
        }
        return false;
    }


    function save_order_info() {
        var myForm = document.getElementById('order_info_form');
        var formData = new FormData(myForm);
        var request_window_start = $('#requested_window_start').val();
        var request_window_end = $('#requested_window_end').val();
        if (request_window_start == request_window_end) {
            alert("Start Time and End Time cannot be same.");
            return false;
        }
        var request_window = request_window_start + " - " + request_window_end;
        formData.append('sch_date', $('#save_truck_date').val());
        if (request_window != '' && testTime(request_window)) {
            formData.append('requested_window', request_window);
        } else {
            if (request_window == '') {
                var request_window = "";
                formData.append('requested_window', request_window);
            } else {
                alert("Please Enter Valid Requested Time Window in the (HH:MM AM/PM-HH:MM AM/PM) format");
                return false;
            }
        }
        var actual_window = $('#actual_window').val();
        var trnsfer_id = $('#transfer_schedule_id').val();
        if (trnsfer_id) {
            formData.append('transfer_id', parseInt(trnsfer_id));
        }
        $.ajax({
            type: 'POST',
            url: saveOrderScheduleInfoUrl,
            processData: false,
            contentType: false,
            data: formData,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content'),
                'X-CSRF-TOKEN': $('input[name="_token"]').val()
            },
            success: function (result) {
                showFlashModal(result.status, result.message);
                if (result.status) {
                    var order_id = $('#order_id').val();
                    var id_selector_str = '#t_o_' + order_id;
                    var status_finished = TRUCK_ORDER_STATUS.FINISHED;
                    var status_cancelled = TRUCK_ORDER_STATUS.CANCELLED;
                    if ($('#order_type').val() == "Pickup") {
                        var json = JSON.parse($('#t_o_json_' + order_id + "P").val());
                        var status_tr_o = json['tr_o_status'];
                        $(id_selector_str + "P").find('.toa-order-time').html(result.time);
                        $(id_selector_str + "P").find('.eta-text-arr').html('');

                        if (status_tr_o == status_cancelled) {
                            $(id_selector_str + "P").find('.late-text').html('');
                        }

                        json.scheduled_pickup_window = result.time;
                        $('#t_o_json_' + order_id + "P").val(parsejson(json));
                    } else if ($('#order_type').val() == "Delivery") {
                        var json = JSON.parse($('#t_o_json_' + order_id + "D").val());
                        var status_tr_o = json['tr_o_status'];
                        $(id_selector_str + "D").find('.toa-order-time').html(result.time);
                        $(id_selector_str + "D").find('.eta-text-arr').html('');

                        if (status_tr_o == status_cancelled) {
                            $(id_selector_str + "D").find('.late-text').html('');
                        }

                        json.scheduled_delivery_window = result.time;
                        $('#t_o_json_' + order_id + "D").val(parsejson(json));
                    } else {
                        $(id_selector_str + "T" + trnsfer_id).find('.toa-order-time').html(result.time);
                        $(id_selector_str + "T" + trnsfer_id).find('.eta-text-arr').html('');
                    }
                    update_json(request_window);
                }

            },
            error: function (data) {
                console.log('error', data);
            }
        });
    }

    function update_json(new_window) {
        var new_json = JSON.parse(trucks_orders_json);
        var truck_id = $('#edit_info_truck_id').val();
        var truck_order_id = $('#edit_info_truck_order_id').val();
        for (k in new_json) {
            if (k == truck_id) {
                for (v in new_json[k]) {
                    if (new_json[k][v]['truck_order_id'] == truck_order_id) {
                        new_json[k][v]['window'] = new_window;
                    }
                }
            }
        }
        trucks_orders_json = JSON.stringify(new_json);

    }

    function testTime(time) {
        Time = time.split("-");
        if (Time.length == 2) {
            var match = (Time[0].trim()).match(/^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/);
            var match1 = (Time[1].trim()).match(/^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/);
            if (match != null && match1 != null) {
                return true;
            }
            return false;
        } else {
            return false;
        }
    }

    function get_user_status_once(user, truck_id, type = 1) {
        console.log("In get_user_status_once");
        var truck_name = $('.t_no_' + truck_id).find('.panel-title').text();
        if (user == '') {
            return false;
        }
        if (truck_id == '') {
            return false;
        }
        $.ajax({
            type: "GET",
            cache: false,
            async: false,
            url: getUserStatus + user,
            error: function (jqXHR, exception) {
                active_xhr = false;
            },
            success: function (data) {
                active_xhr = false;
                if (data.status) {
                    if (data.user_status != null && data.user_status.latitude != null && data.user_status.longitude != null) {
                        var datep = $('#save_truck_date').val();
                        var Date_today = new Date();
                        var Date_obj = new Date(datep);
                        if (!(dateInPast(Date_obj, Date_today)) && !(dateInFuture(Date_obj, Date_today))) {
                            if (type == 1) {
                                make_start_marker(data.user_status.latitude, data.user_status.longitude, true, null, null, truck_name);
                            }
                        }
                    }
                } else {
                    showFlashModal(data.status, data.message);
                }
            }
        });
    }

    function make_start_marker(lat, lng, start = false, order_number = "", color = "", id = "") {
        if (start == true) {
            var start_marker = google.maps.marker.AdvancedMarkerElement({
                id: "START",
                position: new google.maps.LatLng(lat, lng),
                icon: {
                    url: "http://chart.apis.google.com/chart?chst=d_bubble_text_small&chld=bbtl|START|6ed6a7|000000",
                    anchor: new google.maps.Point(0, -1)
                }
            });
            markers2.unshift(start_marker);
        }
        else {
            var order_markers = google.maps.marker.AdvancedMarkerElement({
                position: new google.maps.LatLng(lat, lng),
                id: order_number,
                icon: {
                    url: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + order_number + "|" + color.slice(1) + "|ffffff"
                }
            });
            markers2.push(order_markers);

        }
    }

    function get_user_status_d(user, truck_id, type = 1) {
        console.log('In get_user_status_d');
        var truck_name = $('.t_no_' + truck_id).find('.panel-title').text();
        var color = $('.t_no_' + truck_id).find('.panel-heading').attr('truck-color');
        var entity_id = $('.t_no_' + truck_id).attr('entity-id');
        if (user == '') {
            return false;
        }
        if (truck_id == '') {
            return false;
        }
        $.ajax({
            type: "GET",
            cache: false,
            url: getUserStatus + "/" + user,
            error: function (jqXHR, exception) {
                active_xhr = false;
            },
            success: function (data) {
                active_xhr = false;
                if (data.status) {
                    if (data.user_status) {

                        if (data.user_status.latitude != null && data.user_status.longitude != null) {
                            var datep = $('#save_truck_date').val();
                            var Date_today = new Date();
                            var Date_obj = new Date(datep);
                            if (!(dateInPast(Date_obj, Date_today)) && !(dateInFuture(Date_obj, Date_today))) {
                                if (type == 1) {
                                    makeTruckMarker(data.user_status.latitude, data.user_status.longitude, truck_name, entity_id, color);
                                }
                            }
                        }
                        if (data.user_status.status == "offline") {
                            if (type == 1) {
                                $('.driver_status_str_' + truck_id).html('<i class="fa fa-circle text offline-status"></i> &nbsp;');
                            } else {
                                $('.helper_status_str_' + truck_id).html('<i class="fa fa-circle text offline-status"></i> &nbsp;');
                            }
                        } else {
                            if (type == 1) {
                                $('.driver_status_str_' + truck_id).html('<i class="fa fa-circle text online-status"></i> &nbsp;');
                            } else {
                                $('.helper_status_str_' + truck_id).html('<i class="fa fa-circle text online-status"></i> &nbsp;');
                            }
                        }
                    } else {
                        if (type == 1) {
                            $('.driver_status_str_' + truck_id).html('<i class="fa fa-circle text offline-status"></i> &nbsp;');
                        } else {
                            $('.helper_status_str_' + truck_id).html('<i class="fa fa-circle text offline-status"></i> &nbsp;');
                        }
                    }
                } else {
                    showFlashModal(data.status, data.message);
                }
            }
        });
    }

    //Make markers for routed orders with polyline and stop number
    function truck_route_number_polyline(truck_id) {

        showLoading("dispatchDashboard_box", "#");
        //Delete old polyline and create new one.
        var deleteline = routed_truck_polyline[truck_id];
        if (deleteline)
            deleteline.setMap(null);
        $.each(route_markers[truck_id], function (key, value) {
            value.setMap(null);
        });
        route_markers[truck_id] = [];

        var truck_json = JSON.parse(trucks_orders_json);
        var truck_data = truck_json[truck_id];


        if (typeof truck_data == 'undefined' || truck_data.length == 0) {
            hideLoading("dispatchDashboard_box", "#");
            return false;
        }
        var color = truck_data[0].color;
        var pin_color = color.replace("#", "");
        var txt_color = getTextColor(color);
        var route_coords = [];
        $.each(truck_data, function (key, value) {
            const infowindow1 = new google.maps.InfoWindow({
                content: value.info_window_data,
            });
            var obj = { lat: value.coordinates['lat'], lng: value.coordinates['lng'] };
            route_coords.push(obj);
            var marker = google.maps.marker.AdvancedMarkerElement({
                position: new google.maps.LatLng(value.coordinates['lat'], value.coordinates['lng']),
                id: key,
                icon: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + (key + 1) + "|" + pin_color + "|" + txt_color,
                map: map
            });
            marker.customInfo = value.id + " " + value.type;
            marker.addListener("click", () => {
                clearTimeout(timeout);
                console.log('2');
                const isLockedElement = document.getElementsByClassName('t_no_' + truck_id);
                var isLocked = isLockedElement[0].getAttribute('data-is-locked');
                const targetLat = marker.getPosition().lat();
                const targetLng = marker.getPosition().lng();
                const targetLatlng = new google.maps.LatLng(targetLat, targetLng);
                const markers = route_markers[truck_id];
                var sidebar_num = "";
                var truck_number = "";
                var location = "";
                var addr = "";
                var warehouse_addr = "";
                var matchingMarkers = [];
                var matchingOrderCount = 0;
                const $checkboxall = $('<input type="checkbox" name="check-all-checkbox">');
                const $orderList = $('.order-list');
                $orderList.empty();
                markers.forEach((marker, key) => {
                    const markerLatlng = marker.getPosition();
                    const distance = google.maps.geometry.spherical.computeDistanceBetween(targetLatlng, markerLatlng);
                    if (distance <= 1000) { // 1 Km in meters. Radius in which
                        const latlng = `${markerLatlng.lat()},${markerLatlng.lng()}`;
                        let order_array = marker.customInfo.split(' ');
                        let order_array_clone = marker.customInfo.split(' ');
                        if (order_array[1] === 'Pickup') {
                            order_array[1] = 'P'
                        } else if (order_array[1] === 'Transfer') {
                            order_array[1] = 'T'
                        } else {
                            order_array[1] = 'D'
                        }
                        order_number = order_array.join(''); // Assign the value to the variable defined outside the loop
                        orderNumberInModal = order_array.join(' ');
                        const truck_json = document.getElementById('t_o_json_' + order_number);
                        var truckObj = truck_json.getAttribute('value');
                        var parsJsonTruck = JSON.parse(truckObj);
                        truck_number = truck_id;
                        location = `${parsJsonTruck.origin_loc_name}`;
                        sidebar_num = (num_sidebar_data[location] != undefined) ? num_sidebar_data[location] : null;
                        addr = `${parsJsonTruck.origin_addressline1}, ${parsJsonTruck.origin_loc_name}, ${parsJsonTruck.origin_state}, ${parsJsonTruck.origin_zip}`;
                        var checkboxLabel = `${orderNumberInModal} - ${parsJsonTruck.origin_company_name} ${addr}`;
                        const $checkbox = $('<input type="checkbox" name="order-checkbox">')
                            .attr('data-order-number', order_number)
                            .attr('data-side', sidebar_num)
                            .attr('data-truck-number', truck_number)
                            .attr('data-loc', location)
                            .attr('data-addr-unassign', addr)
                            .attr('data-warehouse_addr', '');
                        const $label = $('<label>').append($checkbox, checkboxLabel);
                        const $checkboxContainer = $('<div class="checkbox">').append($label);
                        $orderList.append($checkboxContainer);
                        matchingOrderCount += 1
                    }

                });
                if (isLocked == '0') {
                    if (matchingOrderCount > 1) {
                        $('#unAssignModal #warningMsg').hide();
                        $('input[name="check-all-checkbox"]').prop('checked', false);
                        $('#unAssignModal').modal('show');
                    } else if (matchingOrderCount == 1) {
                        if (confirm('Are you sure you want to unassign this order?')) {
                            unassign_orders(order_number, truck_number, true, sidebar_num, location, addr, warehouse_addr);
                            refresh_unassigned_order();
                        } else {
                            return false;
                        }
                    }
                } else {
                    showFlashModal(false, "The Route Is Locked. Kindly Unlock it to un-assign orders.");
                }
            });

            var timeout = '';
            marker.addListener("mouseover", () => {
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    infowindow1.open({
                        anchor: marker,
                        map,
                    });
                }, 500);
            });

            marker.addListener("mouseout", () => {
                clearTimeout(timeout);
                infowindow1.close();
            });
            route_markers[truck_id].push(marker);
        });

        //Make polyline to attach all truck orders

        var line = new google.maps.Polyline({
            path: route_coords,
            geodesic: true,
            strokeColor: color,
            strokeOpacity: 0.7,
            strokeWeight: 6
        });
        line.setMap(map);
        routed_truck_polyline[truck_id] = line;
        for (var key in ok_markers_routed) {
            if (assigned_markers.indexOf(ok_markers_routed[key]) === -1) {

                assigned_markers.push(ok_markers_routed[key]);
            }
        }
        hideLoading("dispatchDashboard_box", '#');
    }

    function change_trucks_orders(trucks_id) {
        var outer_array = [];
        var json = JSON.parse(trucks_orders_json);
        var total_weight = 0;
        var total_cubes = 0;
        var total_peices = 0;
        var total_labels_in_truck = 0;
        var total_scanned_labels_in_truck = 0;

        var t_order_service_time = $('.t_o_no_' + trucks_id).data("t_order_service_time");
        var t_start_time = $('.t_o_no_' + trucks_id).data("t_start_time");

        $.each($('.t_o_no_' + trucks_id).children('li'), function (key, value) {
            var inner_object = {};
            inner_object['id'] = ($(value).find('.toa-order-by').find('.order_no').html()).trim();
            inner_object['address'] = $(value).find('.toa-order-address').html();
            inner_object['window'] = $(value).find('.toa-order-time').html();
            inner_object['transfer_id'] = $(value).find('.toa-order-time').attr("data-transfer");

            var obj;

            inner_object['color'] = $(".t_no_" + trucks_id).children('div .panel-heading').attr('truck-color');
            var info_data = '';
            info_data += '<label>' + inner_object['id'] + ' ' + $(value).find('.order-type').html();


            var type = $(value).find('.order-type').html();
            var company_name = $(value).find('.order-company-name').html();
            var datep = $('#save_truck_date').val();
            var cubes = $('#t_o_' + inner_object['id'] + type + inner_object['transfer_id']).attr('data-cubes-vol');
            var weight = $('#t_o_' + inner_object['id'] + type + inner_object['transfer_id']).attr('data-weight');
            var pieces = $('#t_o_' + inner_object['id'] + type + inner_object['transfer_id']).attr('data-pieces');
            var scanned_labels_in_order = $(value).find('.toa-order-time').attr('data-remove-scanned-label');
            var total_labels_in_order = $(value).find('.toa-order-time').attr('data-label-in-order');
            scanned_labels_in_order = (scanned_labels_in_order != undefined) ? scanned_labels_in_order : 0;
            total_labels_in_order = (total_labels_in_order != undefined) ? total_labels_in_order : 0;

            total_weight = total_weight + parseInt(weight);
            total_cubes = total_cubes + parseInt(cubes);
            total_peices = total_peices + parseInt(pieces);
            var json = $('#t_o_json_' + (inner_object['id'] + type) + inner_object['transfer_id']).val();
            if (JSON.parse(json)) {
                var json = JSON.parse(json);
            }
            if (json.truck_number != undefined && json.truck_number == trucks_id) {
                total_scanned_labels_in_truck = total_scanned_labels_in_truck + parseInt(scanned_labels_in_order);
            }
            total_labels_in_truck = total_labels_in_truck + parseInt(total_labels_in_order);
            console.log(`total_labels_in_truck : ${total_labels_in_truck}`);
            inner_object['truck_order_id'] = json.truck_order_id;
            if (type == "D") {
                inner_object['type'] = "Delivery";
                var loc_name = json.dest_loc_name;
                info_data += ' - ' + json.dest_company_name + '</label><p>' + inner_object['address'] + '</p><p>' + json.dest_contact_phone + '</p>';
                obj = { lat: json.dest_lat, lng: json.dest_lng };
            } else if (type == "T") {
                inner_object['type'] = "Transfer";
                var loc_name = $('#t_o_' + inner_object['id'] + type).attr('data-loc');
                info_data += ' [' + loc_name + '] ';
                info_data += ' - ' + json.dest_warehouse_info[0].company_name + '</label><p>' + inner_object['address'] + '</p><p>' + json.dest_warehouse_info[0].contact_phone + '</p>';
                obj = { lat: json.dest_warehouse_info[0].lat, lng: json.dest_warehouse_info[0].lng };
            } else {
                inner_object['type'] = "Pickup";
                var loc_name = json.origin_loc_name;
                info_data += ' - ' + json.origin_company_name + '</label><p>' + inner_object['address'] + '</p><p>' + json.origin_contact_phone + '</p>';
                obj = { lat: json.origin_lat, lng: json.origin_lng };
            }
            inner_object['coordinates'] = obj;

            inner_object['info_window_data'] = info_data;
            inner_object['is_locked'] = $(".t_no_" + trucks_id).attr('data-is-locked');

            if (type != "T") { //only for pickup / delivery
                var time_window = inner_object['window'];
                if (time_window) {
                    time_window = value.scheduled_delivery_window;
                }
            }

            var Date_today = new Date();
            var Date_obj = new Date(datep);
            if (dateInPast(Date_obj, Date_today)) {
                var View_only = 1;
                var html_button = '<span class="dropdown dot-div dropleft lower-dot show"><a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><i class="fa fa-caret-down"></i></a><div class="dropdown-menu" aria-labelledby="dropdownMenuLink" x-placement="left-start" style="position: absolute; transform: translate3d(-162px, 1px, 0px); top:-20px; left: 0px; will-change: transform;"><a class="dropdown-item move_button" data-truck-number="' + trucks_id + '"  data-loc-name="' + loc_name + '" data-order-number="' + inner_object['id'] + type + '"  href="Javascript:void(0)">Move</a><a class="dropdown-item unassign_button" data-stop_num="' + key + '"  data-loc-name="' + loc_name + '" data-truck-number="' + trucks_id + '"  data-order-number="' + inner_object['id'] + type + '" href="Javascript:void(0)">Unassign</a><a class="dropdown-item edit_order_info" data-truck-number="' + trucks_id + '"  data-order-number="' + inner_object['id'] + type + '" href="Javascript:void(0)">Edit Order Info</a></div></span>';
            } else if (json.is_not_movable == 1) {
                var View_only = 2;
                var html_button = '<span class="dropdown dot-div dropleft lower-dot show"><a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><i class="fa fa-caret-down"></i></a><div class="dropdown-menu" aria-labelledby="dropdownMenuLink" x-placement="left-start" style="position: absolute; transform: translate3d(-162px, 1px, 0px); top:-5px; left: 0px; will-change: transform;"><a class="dropdown-item view_order_info" data-truck-number="' + trucks_id + '"  data-order-number="' + inner_object['id'] + type + '" href="Javascript:void(0)">View Order Info</a></div></span>';
            } else {
                var View_only = 0;
                var html_button = '<span class="dropdown dot-div dropleft lower-dot show"><a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><i class="fa fa-caret-down"></i></a><div class="dropdown-menu" aria-labelledby="dropdownMenuLink" x-placement="left-start" style="position: absolute; transform: translate3d(-162px, 1px, 0px); top:-20px; left: 0px; will-change: transform;"><a class="dropdown-item move_button" data-truck-number="' + trucks_id + '"  data-loc-name="' + loc_name + '" data-order-number="' + inner_object['id'] + type + '" href="Javascript:void(0)">Move</a><a class="dropdown-item unassign_button" data-stop_num="' + key + '" data-loc-name="' + loc_name + '" data-truck-number="' + trucks_id + '"  data-order-number="' + inner_object['id'] + type + '" href="Javascript:void(0)">Unassign</a><a class="dropdown-item edit_order_info" data-truck-number="' + trucks_id + '"  data-order-number="' + inner_object['id'] + type + '" href="Javascript:void(0)">Edit Order Info</a></div></span>';
            }
            $(value).find('.toa-order-by').html("<span class='sr-no'>" + (key + 1) + ". </span>" + "<span class='order_no'>" + inner_object['id'] + "</span> <span class='order-type'>" + type + '</span> - <span class="order-company-name">' + company_name + '</span>');
            $(value).find('.toa-order-time').html(inner_object['window']);
            outer_array.push(inner_object);
            $(value).find('.dropdown').find('.unassign_button').attr('data-truck-number', trucks_id);
        });
        if ($('.t_o_no_' + trucks_id).children().length == 0) {
            $('.t_no_' + trucks_id).remove();
        }
        $('.t_no_' + trucks_id + 'wt').html(parseInt(total_weight));
        $('.t_no_' + trucks_id + '_vol').html(parseInt(total_cubes));
        $('.t_no_' + trucks_id + '_pieces').html(parseInt(total_peices));
        // if (total_labels_in_truck > 0) {
            //     label_div = '<div class="label_scan main_div_label_' + trucks_id + '">Scanned transfer labels : <span class="label_heighlight"><span class="scanned_label_count_' + trucks_id + '">' + total_scanned_labels_in_truck + '</span>/<span class="label_count_' + trucks_id + '">' + total_labels_in_truck + '</span></div>';
        // } else {
            //     label_div = '';
        // }
        // $('.empty_label_div_' + trucks_id).html(label_div);
        json[trucks_id] = outer_array;
        trucks_orders_json = JSON.stringify(json);

    }
    function get_eta(truck_class, id, ended) {
        if (truck_start_marker_exists(markers2) == 0) {
            markers2 = [];
            return false;
        }

        var time = moment().format("h:mm a");;
        var day = moment().format("D-M-Y h:mm a");;
        var today_day = moment(day, 'DD-MM-YYYY hh:mm A').format('DD');
        var new_time = [];
        var request = {
            travelMode: google.maps.TravelMode.DRIVING
        };
        if (markers2.length <= 1) {
            markers2 = [];
            return false;
        }
        else {
            for (i = 0; i < markers2.length; i++) {
                if (i == 0) {
                    request.origin = markers2[i].getPosition();
                }
                else {
                    if (i == markers2.length - 1) {
                        request.destination = markers2[i].getPosition();
                    }
                    else {
                        if (!request.waypoints) {
                            request.waypoints = [];
                            request.waypoints.push({
                                location: markers2[i].getPosition(),
                                stopover: true
                            });
                        }
                        else {
                            request.waypoints.push({
                                location: markers2[i].getPosition(),
                                stopover: true
                            });
                        }
                    }
                }
            }
        }
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer({
            polylineOptions: {
                strokeColor: getRandomColor(),
                strokeWidth: 4
            }
        });

        directionsDisplay.setOptions({ suppressMarkers: true, preserveViewport: true });
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);

                for (i = 0; i < directionsDisplay.directions.routes[0].legs.length; i++) {
                    var time_value = directionsDisplay.directions.routes[0].legs[i].duration.value;

                    time = moment(time, 'hh:mm A').add(time_value, 'seconds');
                    day = moment(day, 'DD-MM-YYYY hh:mm A').add(time_value, 'seconds');
                    next_day = moment(day).format('DD');
                    time_new = moment(time).format('hh:mm A');
                    req_time = $(id[i]).find('.toa-order-time').text();
                    if (next_day > today_day) {
                        next_day_str = " (Next Day)";
                        time_difference = process_time_difference(req_time, time_new, true);
                    }
                    else {
                        next_day_str = "";
                        time_difference = process_time_difference_same_day(req_time, time_new, true)
                    }

                    var eta = "ETA: " + time_new + next_day_str;
                    $(id[i]).find('.eta-text').html(eta);

                    if (req_time) {
                        $(id[i]).find('.late-text').html(time_difference)
                    }
                    if (ended == 1) {
                        $(id[i]).find('.eta-text').hide();
                    }
                    status_str = $(id[i]).find('.status_str').text()
                    if (status_str == "Cancelled") {
                        $(id[i]).find('.late-text').html('')
                    }
                }
            }
        });
        markers2 = [];
    }

    function dateInFuture_backup(firstDate, secondDate) {
        var first_time = firstDate.setHours(0, 0, 0, 0);
        var currDate = moment().format("YYYY-MM-DD");
        var second_time = currDate.setHours(0, 0, 0, 0);
        if (first_time > second_time) {
            return true;
        }
        return false;
    };

    function dateInFuture(firstDate, secondDate) {
        var first_time = firstDate.setHours(0, 0, 0, 0);
    
        var currDate = new Date();
        currDate.setHours(0, 0, 0, 0);
        var second_time = currDate.getTime(); // Use getTime() to get the timestamp
    
        if (first_time > second_time) {
            return true;
        }
        return false;
    }
    
    function truck_start_marker_exists(markers2) {
        var exists = 0;
        for (i = 0; i < markers2.length; i++) {

            if (markers2[i].id == "START") {
                exists = 1;
            }
        }
        return exists
    }
    function process_time_difference(t1, t2, isEta = false)//argument 1 is the requested time and argument 2 is the actual time
    {
        if (t1 == '') {
            return "";
        }
        if (isEta) {
            t1 = t1.split('-')[1].trim();
        }
        else {
            t1 = t1.split('-')[1].trim();
            t2 = t2.split('-')[1].trim();
        }
        t1 = moment(t1, "hh:mm A").format("HH:mm");
        t2 = moment(t2, "hh:mm A").format("HH:mm");
        differenceInTime = difference_btw_time(t1, t2)
        if (differenceInTime) {
            return "Running Late: " + differenceInTime;
        }
        else {
            return "";
        }
    }

    function process_time_difference_same_day(t1, t2, isEta = false)//argument 1 is the requested time and argument 2 is the actual time
    {
        if (isEta) {
            t1 = t1.split('-')[1].trim();
        }
        else {
            t1 = t1.split('-')[1].trim();
            t2 = t2.split('-')[1].trim();
        }
        t1 = moment(t1, "hh:mm A").format("HH:mm");
        t2 = moment(t2, "hh:mm A").format("HH:mm");
        differenceInTime = difference_btw_time_same_day(t1, t2)
        if (differenceInTime) {
            return "Running Late: " + differenceInTime;
        }
        else {
            return "";
        }
    }

    function difference_btw_time(start, end) {
        start = start.split(":");
        end = end.split(":");
        var startDate = new Date(0, 0, 0, start[0], start[1], 0);
        var endDate = new Date(0, 0, 0, end[0], end[1], 0);
        var diff = endDate.getTime() - startDate.getTime();
        var hours = Math.floor(diff / 1000 / 60 / 60);
        diff -= hours * 1000 * 60 * 60;
        var minutes = Math.floor(diff / 1000 / 60);
        var display = ""
        if (hours < 0) {
            hours = hours + 24;
        }
        if (hours < 0) {
            return false;
        }
        else {
            if (hours > 0) {

                display += hours + "h "

            }

            if (minutes > 0) {

                display += minutes + "m "

            }
            return display;
        }

    }

    function difference_btw_time_same_day(start, end) {
        start = start.split(":");
        end = end.split(":");
        var startDate = new Date(0, 0, 0, start[0], start[1], 0);
        var endDate = new Date(0, 0, 0, end[0], end[1], 0);
        var diff = endDate.getTime() - startDate.getTime();
        var hours = Math.floor(diff / 1000 / 60 / 60);
        diff -= hours * 1000 * 60 * 60;
        var minutes = Math.floor(diff / 1000 / 60);
        var display = ""
        if (hours < 0) {
            return false;
        }
        else {
            if (hours > 0) {

                display += hours + "h "

            }

            if (minutes > 0) {

                display += minutes + "m "


            }
            return display;
        }

    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    async function show_truck_order_list(first_truck_number, second_truck_number) {
        var truck_json = JSON.parse(trucks_orders_json);
        var created_new = 0;
        console.log('show_truck_order_list');
        if (typeof (truck_json[second_truck_number]) == "undefined" || $('.t_no_' + second_truck_number).length == 0) {
            var date = $('#save_truck_date').val();
            var new_color = '';
            await $.ajax({
                type: "GET",
                cache: false,
                async: false,
                url: truckDetailsUrl + "/" + second_truck_number + "/" + date,
                success: function (data) {
                    created_new = 1;
                    var quantity = 0;
                    new_color = data.data.t_color;
                    var t_order_service_time = (data.data.t_order_service_time) ? data.data.t_order_service_time : 20;
                    var t_start_time = (data.data.t_start_time) ? data.data.t_start_time : "08:00:00";
                    t_start_time = t_start_time.split(":")[0] + ":" + t_start_time.split(":")[1];
                    if (data.data.is_ended) {
                        showFlashModal(false, "This route has ended. You Cannot add orders to an ended route!");
                        if ($('.trucks_div').children().length == 0) {
                            $('.No-trucks-div').show();
                            $('.trucks_div').hide();
                        }
                        set_status(0);
                        return false;
                    }
                    if (data.data.driver == "") {
                        var driver_str = "<a href='Javascript:void(0)' class='add-driver-to-truck' data-truck-number='" + data.data.t_id + "'><i class='fa fa-plus'></i></a>";
                    } else {
                        var driver_str = data.data.driver + " <a href='Javascript:void(0)' class='remove-driver' data-truck-number='" + data.data.t_id + "'><i class='fa fa-trash'></i></a>";
                        drivers_json[data.data.t_id] = data.data.driver_id;
                    }
                    if (data.data.helper == "") {
                        var helper_str = "<a href='Javascript:void(0)' class='add-helper-to-truck' data-truck-number='" + data.data.t_id + "'><i class='fa fa-plus'></i></a>";
                    } else {
                        var helper_str = data.data.helper + " <a href='Javascript:void(0)' class='remove-helper' data-truck-number='" + data.data.t_id + "'> <i class='fa fa-trash'></i></a>";
                        helpers_json[data.data.t_id] = data.data.helper_id;
                    }
                    if (data.data.is_ended) {
                        var ended = "<span class='text text-danger msg_ended'>(Ended)</span>"
                    } else {
                        var ended = "";
                    }

                    var truck_start_address = truck_end_address = truck_start_lat = truck_start_lng = "";

                    if (data.data.s_addressline1) {
                        truck_start_address += data.data.s_addressline1;
                    }
                    if (data.data.s_addressline2) {
                        truck_start_address += ', ' + data.data.s_addressline2;
                    }
                    if (data.data.s_city) {
                        truck_start_address += ', ' + data.data.s_city;
                    }
                    if (data.data.s_state) {
                        truck_start_address += ', ' + data.data.s_state;
                    }
                    if (data.data.s_zipcode) {
                        truck_start_address += ', ' + data.data.s_zipcode;
                    }
                    if (!(data.data.s_latitude == null || data.data.s_latitude == "null" || data.data.s_longitude == null || data.data.s_longitude == "null")) {
                        truck_start_lat = data.data.s_latitude;
                        truck_start_lng = data.data.s_longitude;
                    }
                    else {
                        geocoder = new google.maps.Geocoder();
                        geocoder.geocode({
                            'address': truck_start_address
                        }, function (results, status) {
                            truck_start_lat = results[0].geometry.location.lat();
                            truck_start_lng = results[0].geometry.location.lng();
                        });
                    }
                    var time_window = '';

                    var sort_btn = '<div class="toa-sort-orders" data-truck-number = "' + data.data.t_id + '"><small class="short-dist bg-info">Shortest Distance</small><small class="rev-route bg-info">Reverse Routes</small><small class="calc-time-truck bg-info" data-truck-id = "' + data.data.t_id + '">Calc. Time</small></div>';


                    var lock_str = '<i class=" fa fa-unlock fa-sm "></i>';


                    var save_single = '<i class=" fa fa-floppy fa-sm "></i>';
                    var swap_truck = '<i class="fa fa-exchange fa-sm"></i>';

                    var cubes1 = Number($(".t_no_" + first_truck_number + "_vol").html());
                    var weight1 = Number($(".t_no_" + first_truck_number + "wt").html());
                    var quantity = Number($(".t_no_" + first_truck_number + "_pieces").html());

                    var html_str = '<div class="panel panel-dark t_no_' + data.data.t_id + '" data-is-locked="0" data-is-ended="' + data.data.is_ended + '" data-is-started="' + data.data.day_started_at + '" data-start-lat = "' + truck_start_lat + '" data-start-lng = "' + truck_start_lng + '" data-start-address="' + truck_start_address + '" data-temp="1"><div class="panel-heading" truck-color="' + data.data.t_color + '" style="background-color:' + data.data.t_color + '"><h3 class="panel-title" style="font-weight:600" >' + data.data.t_name + " " + ended + '</h3><ul class="pull-right truck--actions--list"><li><span class="clickable"><i class="fa fa-chevron-down fa-sm"></i></span></li></ul></div><div class="panel-heading btn-actions" truck-color="' + data.data.t_color + '" style="background-color:#baba9b"><ul class="truck--actions--list" style="margin-left: auto;"><li><span class="clickable lock" style="display:none;"><i class="fa fa-lock fa-sm"></i></span></li><li><span class=""><a class="lock-truck" data-is-local="1" data-is-locked="0" data-truck-id = "' + data.data.t_id + '" title="Lock Truck" href="Javascript:void(0)">' + lock_str + '</a></span></li><li><span class=""><a class="save-single-route" title="Save This Route" data-truck-id = "' + data.data.t_id + '" href="Javascript:void(0)">' + save_single + '</a></span></li><li style="display:none;"><span class="clickable eye" ><i class="fa fa-eye fa-sm"></i></span></li><li style="display:none;"><span class="clickable log" ><i class="fa fa-file fa-sm"></i></span></li><li><span class=""><a class="swap-truck" title="Swap Truck Orders" data-truck-name="' + data.data.t_name + '" data-truck-id = "' + data.data.t_id + '" href="Javascript:void(0)">' + swap_truck + '</a></span></li></ul></div><div class="panel-body"><ul class="truck-stats-info"><li><span>Vol: <strong><span class="t_no_' + data.data.t_id + '_vol">' + parseInt(cubes1) + '</span>/<span class="t_no_' + data.data.t_id + '_max_vol">' + parseInt(data.data.max_volume) + '</span></strong></span></li><li><span>Weight: <strong><span class="t_no_' + data.data.t_id + 'wt">' + parseInt(weight1) + '</span>/<span class="t_no_' + data.data.t_id + '_max_wt">' + parseInt(data.data.max_weight) + '</span></strong></span></li><li><span>Pieces: <strong><span class="t_no_' + data.data.t_id + '_pieces">' + parseInt(quantity) + '</span></strong></span></li><li></li><li><span>Driver: <strong><a href="Javascript:void(0)"><i class="fa fa-user"></i> ' + driver_str + '</a></strong></span></li><li><span>Started: <strong>' + data.data.day_started_at + '</strong></span></li><li><span>Helper: <strong><a href="#">' + helper_str + '</a></strong></span></li><li><span>Ended at: <strong>' + data.data.day_ended_at + '</strong></span></li></ul>' + sort_btn + '<ul class="truck-orders-addresses collapses can_assign t_o_no_' + second_truck_number + '" data-t_order_service_time="' + t_order_service_time + '" data-t_start_time="' + t_start_time + '">'; // last 2  closing div
                    var orders = $('.unassigned_orders_box').html();
                    var img_str = "";
                    var order_eye = "";

                    html_str = html_str + '</ul></div></div>';
                    $('.trucks_div').append(html_str);


                    var datep = $('#save_truck_date').val();
                    var Date_today = new Date();
                    var Date_obj = new Date(datep);
                    if (!dateInPast(Date_obj, Date_today)) {
                        $('.t_o_no_' + second_truck_number).sortable({
                            connectWith: ".collapses.can_assign",
                            containment: "body",
                            dropOnEmpty: true,
                            scroll: false,
                            cancel: ".sorting-disabled",
                            stop: function (e) {
                                var order_list = e.target;
                                var truck_orders = $(order_list).children();
                                var stop = true;
                                $.each(truck_orders, function (k, v) {
                                    var order_no = $(v).attr('data-order-no');
                                    var pick_order_no = "#t_o_" + order_no + "P";
                                    var deli_order_no = "#t_o_" + order_no + "D";
                                    if ($(pick_order_no).length > 0 && $(deli_order_no).length > 0) {
                                        var pick_point = $(pick_order_no).index();
                                        var del_point = $(deli_order_no).index();
                                        if (pick_point > del_point) {
                                            stop = false;
                                        }
                                    }
                                });
                                if (stop == false) {
                                    return false;
                                }
                            },
                            update: function (event, ui) {
                                change_trucks_orders(second_truck_number);
                                truck_route_number_polyline(second_truck_number);
                                console.log("CHeckty2");
                                $('#changed').val(1)
                            }
                        });
                    }


                }
            });
        }

        $(".t_o_no_" + first_truck_number + " li.truck_ord_list .dropdown ul.dropdown-menu.dropdown-menu-right li a").attr('data-truck-number', second_truck_number);
        $(".t_o_no_" + second_truck_number + " li.truck_ord_list .dropdown ul.dropdown-menu.dropdown-menu-right li a").attr('data-truck-number', first_truck_number);

        var first_truck_li = $(".t_o_no_" + first_truck_number).html();
        var second_truck_li = $(".t_o_no_" + second_truck_number).html();
        $(".t_o_no_" + first_truck_number).html(second_truck_li);
        $(".t_o_no_" + second_truck_number).html(first_truck_li);

        var first_t_color = $('.t_no_' + first_truck_number).find('.panel-heading').attr('truck-color');
        var second_t_color = $('.t_no_' + second_truck_number).find('.panel-heading').attr('truck-color');

        var first_t_data = truck_json[first_truck_number];

        if (typeof first_t_data != 'undefined' && first_t_data.length > 0) {
            first_t_data.map(v => {
                v.color = first_t_color;
            });
        }

        truck_json[first_truck_number] = first_t_data;

        var second_t_data = truck_json[second_truck_number];

        if (typeof second_t_data != 'undefined' && second_t_data.length > 0) {
            second_t_data.map(v => {
                v.color = second_t_color;
            });
        }

        truck_json[second_truck_number] = second_t_data;

        trucks_orders_json = JSON.stringify(truck_json);

        truck_route_number_polyline(first_truck_number);
        truck_route_number_polyline(second_truck_number);
        if (($('.t_o_no_' + first_truck_number).children('li').length) == 0) {
            $('.t_no_' + first_truck_number).remove();
            delete drivers_json[first_truck_number];
            $('#drivers_json').val(JSON.stringify(drivers_json));
            delete helpers_json[first_truck_number];
            $('#helpers_json').val(JSON.stringify(helpers_json));
        }
        if (($('.t_o_no_' + second_truck_number).children('li').length) == 0) {
            $('.t_no_' + second_truck_number).remove();
            delete drivers_json[second_truck_number];
            $('#drivers_json').val(JSON.stringify(drivers_json));
            delete helpers_json[second_truck_number];
            $('#helpers_json').val(JSON.stringify(helpers_json));
        }

    }

    function make_list_of_orders_without_images() {
        $('.no_image_orders').html("");
        var formData = new FormData();
        formData.append('truck_id', $('#truck_id_del_end').val());
        formData.append('date', $('#save_truck_date').val());
        var $loadingText = '<i class="fa fa-refresh fa-spin"></i> Processing...';
        var $this = $('.server_err_msg');
        $.ajax({
            type: 'POST',
            url: orderWithoutImageUrl,
            processData: false,
            contentType: false,
            data: formData,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content'),
                'X-CSRF-TOKEN': $('input[name="_token"]').val()
            },
            beforeSend: function () {
                $this.html($loadingText);
            },
            success: function (result) {
                if (result.status) {
                    $this.html("");
                    $(result.data).each(function (key, value) {
                        var str = "<li style='margin:20px;'>" + value + "</li>";
                        $('.no_image_orders').append(str);
                    });
                } else {
                    $this.html(result.message);
                }
            },
            error: function (data) {
                console.log('error', data);
            }
        });
    }

    function show_upload_image_form(arg, order_id) {
        $('.files').html('');
        $("#err_msg").html('');
        $("#btn_done_dt_image").hide();
        $("#dispatch_type").val(arg);
        $("#dt_img_orders_id").val(order_id);
        var img_label = (arg == 'd') ? 'Upload Delivery DT Image(s)' : 'Upload Pick Up DT Image(s)';
        $("#uploadImageModalLabel").html(img_label);
        $("#upload_images_modal").modal('show');
    }

    function fruitSearch() {
        var input, filter, ul, li, a, i;
        input = $('#searchTruck').val();
        filter = input.toUpperCase();
        ul = document.getElementsByClassName('trucks_div');
        li = $(ul).find('.panel-dark');
        for (i = 0; i < li.length; i++) {
            a = li[i];
            if ($(a).find('.panel-title').html().trim().toUpperCase().indexOf(filter) > -1) {
                $(li[i]).show();
            } else {
                $(li[i]).hide();
            }
        }
    }

    function OrderSearch(e) {
        var input, filter, ul, li, a, i, get_order;
        input = $(e).val();
        filter = input.toUpperCase();
        ul = $(e).parent().next().next().next().next();
        console.log(ul);
        li = $(ul).find('li');
        for (i = 0; i < li.length; i++) {
            a = li[i];
            get_order = $(a).find('.ord_search').attr('data-order-id');
            if (get_order.trim().indexOf(filter) > -1) {
                $(li[i]).show();
                $(ul).prev().prev().show();
            } else {
                $(li[i]).hide();
                $(ul).prev().prev().hide();
            }
        }
    }

    $(document).on('click', '.marker_selected_truck_class', function () {
        var is_selected = $(this).hasClass('marker_truck_selected');
        $(".marker_selected_truck_class").removeClass('marker_truck_selected');
        if (is_selected) {
            $(this).removeClass('marker_truck_selected');
        }
        else {
            $(this).addClass('marker_truck_selected');
        }
    })

    function check_truck_order_status(get_truck_order_id, callback) {
        if (get_truck_order_id) {
            $.ajax({
                url: checkTruckOrderStatusUrl,
                type: "POST",
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content'),
                    'X-CSRF-TOKEN': $('input[name="_token"]').val()
                },
                data: {
                    truck_order_id: get_truck_order_id
                },
                success: function (s_dta) {
                    data = s_dta;
                    callback(data);
                },
            });
        }
    }

    function reverse_routing(truck_number, is_reversable = true) {
        var saved_truck_or_json = JSON.parse(trucks_orders_json);
        var reverse_array = [];
        if (is_reversable == false) {
            $($(saved_truck_or_json[truck_number]).get().reverse()).each(function (key, val) {
                reverse_array.push(val);
            });
        } else {
            $($(saved_truck_or_json[truck_number]).get().reverse()).each(function (key, val) {
                reverse_array.push(val);
            });
        }
        saved_truck_or_json[truck_number] = reverse_array;
        trucks_orders_json = JSON.stringify(saved_truck_or_json);
        rearrange_truck_orders(truck_number);
    }

    function calculate_shortest_path(truck_number, find_shortest = true) {
        var truck_order_json_by_truck = JSON.parse(trucks_orders_json);
        if (find_shortest == true) {
            var truck_start_address = $('.t_no_' + truck_number).attr('data-start-address');
            var truck_start_lat = $('.t_no_' + truck_number).attr('data-start-lat');
            var truck_start_lng = $('.t_no_' + truck_number).attr('data-start-lng');
            var current_pointer = {};
            if (truck_start_lat && truck_start_lng) {
                current_pointer.lat = truck_start_lat;
                current_pointer.lng = truck_start_lng;
            } else {
            }
            var new_shortest_distance = 0;
            var shortest_distance = 0;
            var largest_dist = 999999999999999;
            var pointer1 = '';
            var pointer2 = '';
            var compare_order_id = '';
            var skip_order_array = [];
            var skip_order_row_array = [];
            var route = [];
            var dist_Array = [];
            var i = 0;

            while (i < truck_order_json_by_truck[truck_number].length) {
                largest_dist = 9999999999999999;
                $.each(truck_order_json_by_truck[truck_number], function (key, val) {
                    if ($.inArray(truck_order_json_by_truck[truck_number][key], route) == -1) {
                        pointer1 = current_pointer;
                        pointer2 = truck_order_json_by_truck[truck_number][key].coordinates;
                        var dist = getDistance(pointer1, pointer2);
                        if (dist < largest_dist) {
                            route[i] = truck_order_json_by_truck[truck_number][key];
                            dist_Array[i] = dist;
                            largest_dist = dist;
                        }
                    }
                    else {
                        return true;
                    }
                });
                current_pointer = route[i].coordinates;
                i++;
            }
            truck_order_json_by_truck[truck_number] = route;
        } else {
            truck_order_json_by_truck = JSON.parse(trucks_orders_json);
        }
        trucks_orders_json = JSON.stringify(truck_order_json_by_truck);
        rearrange_truck_orders(truck_number);
    }

    function getDistance(from_pointer, to_pointer) {
        var rad = function (x) {
            return x * Math.PI / 180;
        };
        var radius = 6378137;
        var dLat = rad(to_pointer.lat - from_pointer.lat);
        var dLong = rad(to_pointer.lng - from_pointer.lng);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(from_pointer.lat)) * Math.cos(rad(to_pointer.lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = radius * c;
        return d;
    }

    function rearrange_truck_orders(truck_number) {
        var lis = document.querySelectorAll(".t_o_no_" + truck_number + " > li");
        var truck_json = JSON.parse(trucks_orders_json);
        var truck_data = truck_json[truck_number];
        var truck_data_arr = [];
        var count = 1;
        $.each(truck_data, function (key, value) {
            var order_id = "";
            if (value.type == "Delivery") {
                order_id = value.id + "D";
            }
            else if (value.type == "Pickup") {
                order_id = value.id + "P";
            }
            else {
                order_id = value.id + "T" + value.transfer_id;
            }
            $.each(lis, function (key, value) {
                if (value.id == "t_o_" + order_id) {
                    var removed_value = $('.t_o_no_' + truck_number)[0].removeChild(lis[key]);
                    removed_value.getElementsByTagName("span")[0].innerHTML = count + ".";
                    $(".t_o_no_" + truck_number).append(removed_value);
                    count++;
                    return;
                }
            });
        });
    }

    var oLHTable;
    oLHTable = $('#log_history_table').DataTable({
        dom: "<'row'<'col-sm-4'><'#filter_by_status_div.col-sm-4'><'col-sm-4'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-5'i><'col-sm-7'p>>",
        responsive: true,
        "scrollX": true,
        "scrollCollapse": true,
        "order": [], //By default, order by descending 1st column
        "processing": true,
        "serverSide": true,
        "ajax": {
            url: truckRouteLogHistoryUrl,
            data: function (d) {
                d.filter_by_status = '';
                d.entity_id = $('#view_order_log_entity_id').val();
            },
        },
        "fnDrawCallback": function (oSettings) {
        },
        "columns": [
            {
                "data": "subject"
            },
        ]
    });

    $(document).ready(function () {
        $('#swap_truck_selected').select2({
            width: '100%',
            allowClear: true,
            placeholder: '--Choose a Truck --',
            ajax: {
                url: truckListSelect2Url,
                error: function (jqXHR, exception) {
                    active_xhr = false;
                },
                data: function (params) {
                    var query = {
                        term: params.term,
                        page: params.page || 1,
                        size: 10,
                        exclude_trucks: ignore_trucks_id
                    }
                    return query;
                },
                processResults: function (data, params) {
                    return {
                        results: data.results,
                        pagination: {
                            more: data.pagination.more
                        }
                    };
                }
            }
        });
        $(document).on('click', '.action_type_radio', function () {
            var obj = $(this).find("input:first-child");
            var arr = obj.attr('id').split("_");
            var o_id = arr[arr.length - 1];
            if (obj.val() == 'change') {
                $("#item_detail_div" + o_id).show();
            } else {
                $("#item_detail_div" + o_id).hide();
            }
        })
        var truck_markers_load = 0;
        var prev_div = "";
        $(document).on('click', '.truck_name_title', function () {
            var datep = $('#save_truck_date').val();
            var Date_today = new Date();
            var Date_obj = new Date(datep);
            if (!(dateInPast(Date_obj, Date_today)) && !(dateInFuture(Date_obj, Date_today))) {
                if (truck_markers_load == 1 && this == prev_div) {
                    $(prev_div).css("color", "white");
                    map.setZoom(5)
                    var latLng = new google.maps.LatLng(34.0522, -118.2437);
                    map.panTo(latLng);
                    truck_markers_load = 0;
                }
                else {
                    if (prev_div != this) {
                        $(prev_div).css("color", "white");
                    }
                    prev_div = this;
                    $(this).css("color", "#23ff3b");
                    var entity = $(this).closest('.panel').attr('entity-id');
                    for (var i = 0; i < markers.length; i++) {
                        if (markers[i]?.id != null) {
                            if (markers[i]?.id == entity) {
                                map.panTo(markers[i].getPosition());
                                map.setZoom(18);
                            }
                        }
                    }
                    truck_markers_load = 1;
                }
            }
        });
        $(document).on('click', '#bs', function () {
            var has_ended = $(this).closest('.panel').attr('data-is-ended');
            var datep = $('#save_truck_date').val();
            var Date_today = new Date();
            var Date_obj = new Date(datep);
            if (dateInPast(Date_obj, Date_today) || has_ended == 1) {
                $('.date_depend_bf').hide();
            }
            else {
                $('.date_depend_bf').show();
            }
            $('.add_bs_class').attr('id', "addbs-btn");
            $('.add_bs_class').prop("disabled", false);
            return false;
        });
        $('#br_description').keyup(function () {
            var characterCount = $(this).val().length;
            if (characterCount > 255) {
                $('#br_description').next('.help-block').html('Only 255 characters allowed.');
                $(this).parent('.form-group').addClass('has-error');
            } else {
                $('#br_description').next('.help-block').html('');
                $(this).parent('.form-group').removeClass('has-error');
            }
        });
        $(document).on('change', '#select_orders1', function () {
            $('#select_orders1').parent('.form-group').removeClass('has-error');
            $('#select_orders1').next('.help-block').html('');
            $('.add_bs_class').prop("disabled", false);
            var get_truck_order_id = $(this).val();
            if (get_truck_order_id) {
                $.ajax({
                    url: checkTruckOrderStatusUrl,
                    type: "POST",
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content'),
                        'X-CSRF-TOKEN': $('input[name="_token"]').val()
                    },
                    data: {
                        truck_order_id: get_truck_order_id
                    },
                    success: function (s_dta) {
                        if (s_dta.status) {
                            // do nothing
                        } else {
                            $('#select_orders1').parent('.form-group').addClass('has-error');
                            $('#select_orders1').next('.help-block').html(s_dta.message);
                        }
                    },
                    error: function () {
                        showFlashModal(false, 'Your session has expired. Please login again.');
                        $(".close, .modal").click(function () {
                            window.location.reload();
                        });
                    }
                });
            } else {
                $('#select_orders1').parent('.form-group').addClass('has-error');
                $('#select_orders1').next('.help-block').html('Please choose one order.');
            }
        });
        $('#requested_window_start').select2({
            width: '100%',
        });
        $('#requested_window_end').select2({
            width: '100%',
        });
        var has_clicked = false
        var oldDiv = ''
        $(document).on('click', '.showMapMarkers', function () {
            if (has_clicked && oldDiv == this) {
                $(this).children().css("color", "white");
                initmap();
                has_clicked = false;
                if ($('#tab2button').parent('.route_type_order_list').hasClass('active') == true) {
                    if ($('#transfer-accordion').find('.check_order_number:checked').length == 0) {
                        $('#tab2button').trigger('click');
                    }
                }
                if ($('#tab1button').parent('.route_type_order_list').hasClass('active') == true) {
                    if ($('#orders-accordion').find('.check_order_number:checked').length == 0) {
                        $('#tab1button').trigger('click');
                    }
                }

            }
            else {
                initmap();
                if (oldDiv != this) {
                    $(oldDiv).children().css("color", "white");
                    $(this).children().css("color", "white");
                }
                $(this).children().css("color", "#23ff3b");
                var truck_panel = $(this).closest('.panel');
                var truck_no = $(truck_panel).attr('class');
                var get_truck_class = truck_no.split(' ')[2];
                var this_div = '.' + get_truck_class
                var truckColor = $(this_div).find('.panel-heading').attr("truck-color");
                var orders_count = $(this_div).find(".truck-orders-addresses > li").length
                showMarkerOnSave(truckColor, orders_count, this_div)
                has_clicked = true
                oldDiv = this
            }
        });
        $(document).on('click', '#bs', function () {
            $('#br_description').parent('.form-group').removeClass('has-error');
            $('#br_description').next('.help-block').html('');
            $('#select_orders1').parent('.form-group').removeClass('has-error');
            $('#select_orders1').next('.help-block').html('');
            $('#select_orders1').html("")
            $('#br_description').val('')
            $('#br_truck_route_id').val('')
            $('#br_truck_order_id').val('')
            $('#brief_ul').html('<li class="product-description" style="text-align:center;">Loading...</li>');
            var truck_panel = $(this).closest('.panel');
            var get_truck_route_id = $(this).data('tr_id');
            $('#select_orders1').append($('<option>', {
                value: '',
                text: '- Select Order -'
            }));
            $(truck_panel).find(".truck-orders-addresses > li").each(function () {
                var ordr_no = $(this).find('.order_no').html()
                var ordr_type = $(this).find('.order-type').html()
                var truck_order_id = $(this).attr('truck_order_id')
                var get_tid = $(this).attr('truck_tids')
                if (get_tid) {
                    get_tid = " (" + get_tid + ")";
                }
                $('#br_truck_route_id').val($(this).attr('truck_route_id'))
                $('#br_truck_order_id').val($(this).attr('truck_order_id'))
                $('#select_orders1').append($('<option>', {
                    value: truck_order_id,
                    text: ordr_no + ordr_type + get_tid,
                }));
            });
            $.ajax({
                type: 'POST',
                url: briefingSheetUrl,
                data: {
                    truck_routes_id: get_truck_route_id
                },
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content'),
                    'X-CSRF-TOKEN': $('input[name="_token"]').val()
                },
                success: function (result) {
                    if (result.status) {
                        var brief_li = '';
                        var briefDiv = '';
                        $.each(result.data, function (key, value) {
                            briefDiv = $('<li>', { class: 'item' }).append(
                                $('<div>', { class: 'product-info', 'style': 'margin-left:0px;' }).append(
                                    $('<a>', { class: 'product-title', href: 'javascript:void(0)', 'style': 'cursor:default;color:inherit;', html: value.is_completed_icn }),
                                    $('<span>', { class: 'product-description', 'style': 'white-space:unset', text: value.briefing_note })
                                )
                            )
                            brief_li += '<li class="item">';
                            brief_li += '<div class="product-info" style="margin-left:0px;">';
                            brief_li += '<a href="javascript:void(0)" style="cursor:default;color:inherit" class="product-title">' + parseInt(key + 1) + ". " + value.order_str;
                            brief_li += value.is_completed_icn + '</a>';
                            brief_li += '<span class="product-description" style="white-space:unset">';
                            brief_li += value.briefing_note;
                            brief_li += '</span>';
                            brief_li += '</div>';
                            brief_li += '</li>';
                        });
                    } else {
                        briefDiv = $('<li>', { class: 'product-description', 'style': 'text-align:center;', text: 'No Instructions Found!' });
                        var brief_li = '<li class="product-description" style="text-align:center;">No Instructions Found!</li>';
                    }
                    // $('#brief_ul').html(brief_li);
                    $('#brief_ul').html(briefDiv);
                },
                error: function (data) {
                    console.log('error', data);
                }
            });
        });
        $(document).on('click', '#tab2button', function () {
            has_clicked = false;
            if (orders_json != JSON.stringify("")) {
                $.each(orders_json, function (key_0, value_0) {
                    $.each(orders_json[key_0], function (key_1, value_1) {
                        value_1.is_last_label = false;
                    });
                });
            }
            $('.showMapMarkers').find('.fa-map-marker').css("color", "white");

            $('#orders-accordion').find('.check_order_number').attr('checked', false);
            $('#orders-accordion').find('.check_order_number').prop('checked', false);
            $('#select_all_transfer_location').prop('checked', false);
            $('#select_all_transfer_location').attr('checked', false);
            $('#transfer-accordion').find('.check_order_number').attr('checked', false);
            $('#transfer-accordion').find('.check_order_number').prop('checked', false);
            var loc_key = [];
            $.each($('#transfer-accordion').find('li'), function (key, val) {
                var location = $(val).find('.check_order_number').attr('data-loc-key');
                loc_key.push(location);
            });
            show_markers(loc_key);
            // console.log("In Individual - Transfer");
        });
        $(document).on('click', '#tab1button', function () {
            has_clicked = false;
            $('.showMapMarkers').find('.fa-map-marker').css("color", "white");

            $('#transfer-accordion').find('.check_order_number').attr('checked', false);
            $('#transfer-accordion').find('.check_order_number').prop('checked', false);
            $('#select_all_ord_location').prop('checked', false);
            $('#select_all_ord_location').attr('checked', false);
            $('#orders-accordion').find('.check_order_number').attr('checked', false);
            $('#orders-accordion').find('.check_order_number').prop('checked', false);

            var loc_key = [];
            $.each($('#orders-accordion').find('li'), function (key, val) {
                var location = $(val).find('.check_order_number').attr('data-loc-key');
                loc_key.push(location);
            });

            show_markers(loc_key);

        });
        $(document).on('click', '#addbs-btn', function () {
            $this = $(this);
            $this.attr('disabled', true);

            var characterCount = $('#br_description').val().length;
            if (characterCount > 255) {
                $('#br_description').next('.help-block').html('Only 255 characters allowed.');
                $('#br_description').parent('.form-group').addClass('has-error');
                return false;
            }
            var order_number = $('#select_orders1').val();
            var order_desc = $('#br_description').val();
            var truck_route_id = $('#br_truck_route_id').val();
            var truck_order_id = $('#select_orders1').val();
            var is_false = true;
            if (order_number != "" && order_desc != "") {
                is_false = true;
                var $loadingText = '<i class="fa fa-refresh fa-spin"></i> Processing...';
                check_truck_order_status(truck_order_id, function (d) {
                    if (d.status) {
                        var formData = new FormData();
                        formData.append('order_no', order_number);
                        formData.append('briefing_note', order_desc);
                        formData.append('truck_routes_id', truck_route_id);
                        formData.append('truck_orders_id', truck_order_id);
                        formData.append('is_completed', 0);
                        $.ajax({
                            type: 'POST',
                            url: briefingSheetAddUrl,
                            processData: false,
                            contentType: false,
                            data: formData,
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content'),
                                'X-CSRF-TOKEN': $('input[name="_token"]').val()
                            },
                            beforeSend: function () {
                                $this.html($loadingText);
                            },
                            success: function (result) {
                                $this.html('Submit');
                                showFlashModal(result.status, result.message);

                            },
                            error: function (data) {
                                console.log('error', data);
                            }
                        });
                    } else {
                        $('#select_orders1').parent('.form-group').addClass('has-error');
                        $('#select_orders1').next('.help-block').html(d.message);
                    }
                });
            }
            if (order_number == "") {
                is_false = false;
                $('#select_orders1').parent('.form-group').addClass('has-error');
                $('#select_orders1').next('.help-block').html('Please choose one order.');
                $this.removeAttr('disabled');
                $('.add_bs_class').attr('id', "addbs-btn");
            } else {
                is_false = false;
                $('#select_orders1').parent('.form-group').removeClass('has-error');
                $('#select_orders1').next('.help-block').html('');
            }

            if (order_desc == "") {
                is_false = false;
                $('#br_description').parent('.form-group').addClass('has-error');
                $('#br_description').next('.help-block').html('Please add some instructions.');
                $this.removeAttr('disabled');
                $('.add_bs_class').attr('id', "addbs-btn");
            } else {
                is_false = false;
                $('#br_description').parent('.form-group').removeClass('has-error');
                $('#br_description').next('.help-block').html('');
            }
            if (is_false == false) {
                return is_false;
            }
        });
        $(document).on('click', '.select_all_order', function () {
            var classes = $(this).attr('class');
            var get_class = classes.split(' ');
            var req_class = get_class[1];
            req_class = req_class.split('_');
            var count = req_class[req_class.length - 1];
            if ($(this).is(':checked') == false) {
                $('.sub_order_' + count).attr('checked', false);
                $('.sub_order_' + count).prop('checked', false);
                $('.selected_vol_' + count).text(0);
                $('.selected_wgt_' + count).text(0);
                $('.selected_pcs_' + count).text(0);
            } else {
                var v = w = p = 0;
                $('.sub_order_' + count).each(function (key, value) {
                    var isDisabled = $(this).prop('disabled');
                    console.log("isDisabled=" + key + " : " + isDisabled);
                    if (isDisabled == false) {

                        $(this).prop('checked', true);
                        v = parseInt(v) + parseInt($(this).attr('data-cubes'));
                        w = parseInt(w) + parseInt($(this).attr('data-weight'));
                        p = parseInt(p) + parseInt($(this).attr('data-peice'));
                        var disable = 0;
                        if (v > $('.total_vol_' + count).html()) {
                            $(".selected_vol_" + count).css("color", "red");
                            disable = 1;
                        }
                        if (w > $('.total_wgt_' + count).html()) {
                            $(".selected_wgt_" + count).css("color", "red");
                            disable = 1;
                        }
                        $('.assign_btn_' + count).attr('disabled', (disable == 1) ? true : false);
                    }
                });
                $('.selected_vol_' + count).text(v);
                $('.selected_wgt_' + count).text(w);
                $('.selected_pcs_' + count).text(p);
            }
        });
        $(document).on('click', '.one_at_time_accordion', function () {
            if ($(this).hasClass('collapsed') == false) {
                $('.check_collapse').removeClass('in');
            } else {
                console.log($(this).find('.sidebar_select_truck'));
            }
        });
        $(document).on('click', '.short-dist', function (e) {
            var current_target = e.target;
            var truck_number = $(current_target).parent().attr('data-truck-number');
            calculate_shortest_path(truck_number);
            truck_route_number_polyline(truck_number);

            $('#changed').val(1);
        });
        $(document).on('click', '.view_order_log', function () {
            var route_number = $(this).attr('data-route-number');
            $('#view_order_log_entity_id').val(route_number);
            oLHTable.draw();
            $('.view_route_logs').trigger('click');
        });
        $(document).on('keyup', '#searchTruck', function () {
            fruitSearch();
        });
        $(document).on('keyup', '.srch_ord', function () {
            OrderSearch(this);
        });
        $('#select_all_ord_location').prop('checked', false);
        $('#order_actual_date').datepicker({
            todayHighlight: true,
            format: 'mm/dd/yyyy',
            autoclose: true,
        });
        $(document).on('click', '.upload_image', function () {
            var type = $(this).attr('data-type');
            var order_id = $(this).attr('data-order-id');
            $("#end_route_del").modal("hide");
            show_upload_image_form(type, order_id);
        })
        $(document).on('click', '#btn_cnf_end_tod', function () {
            var is_valid_form = $("#end_tod_form").validationEngine('validate');
            if (!is_valid_form) {
                return false;
            }
            var formData = new FormData();
            formData.append('truck_id', $('#truck_id_del_end').val());
            formData.append('date', $('#save_truck_date').val());
            formData.append('reason', $('#finish_deliveies').val());
            formData.append('reason_code_id', $('#reason_codes_id_finish_deliveies').val());
            formData.append('orders_id', $('.order_number_end_day').html());
            formData.append('orders_type', $('.order_type_end_day').html());
            $.ajax({
                type: 'POST',
                url: endTodaysDeliveriesUrl,
                processData: false,
                contentType: false,
                data: formData,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content'),
                    'X-CSRF-TOKEN': $('input[name="_token"]').val()
                },
                success: function (result) {
                    showFlashModal(result.status, result.message);
                    if (result.status) {
                        $('.t_no_' + $('#truck_id_del_end').val()).find('.end-day-deliveries').remove();
                        $('.t_no_' + $('#truck_id_del_end').val()).attr('data-is-ended', 1);
                        $('.t_no_' + $('#truck_id_del_end').val()).find('.panel-title').append('<span class="text text-danger msg_ended">(Ended)</span>');
                        var remove_flag = $('.t_no_' + $('#truck_id_del_end').val()).find('.truck-stats-info').children()[7];
                        if (remove_flag) {
                            $(remove_flag).html(result.ended_at_str);
                        }
                        $('.t_o_no_' + $('#truck_id_del_end').val()).children().each(function (key, value) {
                            if ($(value).find('.status_str').text() != "Finished" && $(value).find('.status_str').text() != "Delivered") {
                                $(value).find('.status_str').removeClass('text-primary').removeClass('text-warning').removeClass('text-success').addClass('text-danger').html('<b>Undelivered</b>');
                            }
                        });
                    }
                },
                error: function (data) {
                    console.log('error', data);
                }
            });
        });
        $(document).on('click', '.end-day-deliveries', function () {
            $("#end_route_del").modal("show");
            var truck_number = $(this).attr('data-truck-number');
            $('#truck_id_del_end').val(truck_number);
            $('.unfinished_orders_list_for_end').html("");
            $('.order_number_end_day').html("");
            $('.order_type_end_day').html("");
            var formData = new FormData();
            formData.append('truck_id', truck_number);
            formData.append('date', $('#save_truck_date').val());
            var $loadingText = '<i class="fa fa-refresh fa-spin"></i> Processing...';
            // get_unfinished_orders_end_day
            $.ajax({
                type: 'POST',
                url: unfinishedOrdersEndDayUrl,
                processData: false,
                contentType: false,
                data: formData,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content'),
                    'X-CSRF-TOKEN': $('input[name="_token"]').val()
                },
                beforeSend: function () {
                    $('.unfinished_orders_list_for_end').html($loadingText);
                },
                success: function (result) {
                    if (result.status) {
                        var data = result.data;
                        var arr1 = [];
                        $(data).each(function (key, value) {
                            var order_id = value.id;
                            if (value.to_type == ROUTE_TYPE.Pickup)
                                var order_type = "P";
                            else if (value.to_type == ROUTE_TYPE.Delivery)
                                var order_type = "D";
                            else
                                var order_type = "T";
                            var str = order_id + " " + order_type;
                            arr1.push(str);
                        });
                        $('#truck_id_del_end').val(truck_number);
                        $('.unfinished_orders_list_for_end').html("");
                        $('.order_number_end_day').html("");
                        $('.order_type_end_day').html("");
                        $("#reason_category").val(REASON_CATEGORY.UNDELIVERED_ORDERS);
                        $('.t_o_no_' + truck_number).children().each(function (key, value) {
                            if ($(value).find('.status_str').text() != "Finished") {
                                var order_num = $(value).find('.toa-order-by').find('span').html();
                                var order_id = $(value).find('.toa-order-by').find('.order_no').html();
                                var order_type = $(value).find('.toa-order-by').find('.order-type').html();
                                var company_name = $(value).find('.toa-order-by').find('.order-company-name').html();
                                var str = "<li><b>" + order_num + order_id + " " + order_type + " " + company_name + "</b></li>";
                                var str1 = order_id + " ";
                                var str2 = order_type + " ";
                                if ($.inArray(order_id + " " + order_type, arr1) > -1) {
                                    $('.order_number_end_day').append(str1);
                                    $('.order_type_end_day').append(str2);
                                    $('.unfinished_orders_list_for_end').append(str);
                                }
                            }
                        });
                    }
                },
                error: function (data) {
                    console.log('error', data);
                }
            });

            make_list_of_orders_without_images();
        });
        $(document).on('click', '.save-order-info', function () {
            save_order_info();
        });
        $(document).on('click', ".edit_order_info", function () {
            $('.edit_order').trigger('click');
            $('#requested_window').val("");
            $('#order_actual_date').val("");
            $('#actual_window').val("");
            $('#order_sch_date').val("");
            var truck_id = $(this).data('truck-number');
            var truck_order_id = $(this).data('truck-order');
            var transfer_id = $(this).attr('data-transfer-id');
            var order_id = $(this).attr('data-order-number');
            var type = $('#t_o_' + order_id).find('.order-type').html();
            $('#edit_info_truck_order_id').val(truck_order_id);
            $('#edit_info_truck_id').val(truck_id);
            $.ajax({
                type: 'GET',
                url: orderScheduledInfoDashboardUrl + "/" + order_id,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content'),
                    'X-CSRF-TOKEN': $('input[name="_token"]').val()
                },
                success: function (result) {
                    $('#requested_window_start').html("");
                    $('#requested_window_end').html("");
                    var empty1 = '<option for="requested_window_start" value="">Start Time</option>';
                    var empty2 = '<option for="requested_window_end" value="">End Time</option>';
                    $('#requested_window_start').append(empty1);
                    $('#requested_window_end').append(empty2);


                    var start_time = moment("12:00 AM", "hh:mm A").format('hh:mm A');
                    do {
                        html_opt1 = '<option for="requested_window_start" value="' + start_time + '">' + start_time + '</option>';
                        $('#requested_window_start').append(html_opt1);
                        var end_time = moment(start_time, 'hh:mm A').add(30, 'minutes').format('hh:mm A');
                        start_time = end_time;
                        html_opt2 = '<option for="requested_window_end" value="' + end_time + '">' + end_time + '</option>';
                        $('#requested_window_end').append(html_opt2);
                    } while (start_time != "12:00 AM")

                    if (type == "D") {
                        $('#order_id').val(result.data.o_id);
                        $('#order_type').val("Delivery");
                        if (result.data.scheduled_delivery_date != null) {
                            var sch_date = moment(result.data.scheduled_delivery_date).format('MM/DD/YYYY');
                            $('#order_sch_date').html(sch_date);
                        }
                        if (result.data.scheduled_delivery_window != null) {
                            var window = result.data.scheduled_delivery_window;
                            var n_times = window.split("-");
                            var m_start_time = n_times[0].trim();
                            var m_end_time = n_times[1].trim();
                            $('#requested_window_start').val(m_start_time);
                            $('#requested_window_end').val(m_end_time);
                        }
                        if (result.data.actual_delivery_date) {
                            var sch_date = moment(result.data.actual_delivery_date).format('MM/DD/YYYY');
                            $('#order_actual_date').val(sch_date);
                        }
                        if (result.data.actual_delivery_window != null) {
                            var window = result.data.actual_delivery_window;
                            $('#actual_window').val(window);
                        }
                    } else if (type == "T") {
                        $('#order_id').val(parseInt(order_id));
                        $('#order_type').val("Transfer");
                        $('#truck_order_id').val(result.data.truck_order_id);
                        $('#transfer_schedule_id').val(transfer_id);
                        if (result.data.t_sch_window != null) {
                            var sch_date = moment(result.data.t_sch_window).format('MM/DD/YYYY');
                            $('#order_sch_date').html(sch_date);
                        }
                        var orders_date = $('.orders_date').html();
                        $('#order_sch_date').html(orders_date);
                        if (result.data.t_sch_window != null) {
                            var window = result.data.t_sch_window;
                            var n_times = window.split("-");
                            var m_start_time = n_times[0].trim();
                            var m_end_time = n_times[1].trim();
                            $('#requested_window_start').val(m_start_time);
                            $('#requested_window_end').val(m_end_time);
                        }
                        if (result.data.actual_pickup_date != null) {
                            var sch_date = moment(result.data.actual_pickup_date).format('MM/DD/YYYY');
                            $('#order_actual_date').val(sch_date);
                        }
                        if (result.data.actual_pickup_window != null) {
                            var window = result.data.actual_pickup_window;
                            $('#actual_window').val(window);
                        }
                    } else {
                        $('#order_id').val(result.data.o_id);
                        $('#order_type').val("Pickup");
                        if (result.data.scheduled_pickup_date != null) {
                            var sch_date = moment(result.data.scheduled_pickup_date).format('MM/DD/YYYY');
                            $('#order_sch_date').html(sch_date);
                        }
                        if (result.data.scheduled_pickup_window != null) {
                            var window = result.data.scheduled_pickup_window;
                            var n_times = window.split("-");
                            var m_start_time = n_times[0].trim();
                            var m_end_time = n_times[1].trim();
                            $('#requested_window_start').val(m_start_time);
                            $('#requested_window_end').val(m_end_time);
                        }
                        if (result.data.actual_pickup_date != null) {
                            var sch_date = moment(result.data.actual_pickup_date).format('MM/DD/YYYY');
                            $('#order_actual_date').val(sch_date);
                        }
                        if (result.data.actual_pickup_window != null) {
                            var window = result.data.actual_pickup_window;
                            $('#actual_window').val(window);
                        }
                    }
                },
                error: function (data) {
                    console.log('error', data);
                }
            });
        });
        $(document).on('click', ".unassign_button", function () {
            if (confirm("Are you sure you want to unassign this order?")) {
                var order_number = $(this).attr("data-order-number");
                var truck_number = $(this).attr("data-truck-number");
                var sidebar_num = $(this).attr("data-side");
                var location = $(this).attr('data-loc');
                var addr = $(this).attr('data-addr-unassign');
                var warehouse_addr = "";
                var remove_scanned_label = 0;
                if (order_number.includes("T")) {
                    warehouse_addr = $(this).attr('data-addr-unassign_warehouse');
                    remove_scanned_label = $(this).attr('data-remove-scanned-label');
                    // console.log(remove_scanned_label);
                }
                var order_type = order_number.charAt(order_number.length - 1);
                $('.sidebar_select_truck ').val(null).trigger('change');

                unassign_orders(order_number, truck_number, true, sidebar_num, location, addr, warehouse_addr, remove_scanned_label);
                if ($('#select_all_transfer_location').attr('checked') == "checked") {
                    $('#transfer-accordion').find('.check_order_number').prop('checked', true);
                    $('#transfer-accordion').find('.check_order_number').prop('checked', true);
                }
                if ($('#select_all_ord_location').attr('checked') == "checked") {
                    $('#orders-accordion').find('.check_order_number').prop('checked', true);
                    $('#orders-accordion').find('.check_order_number').prop('checked', true);
                }
            } else {
                return false;
            }
        });
        $(document).on('click', '.add-helper-to-truck', function () {
            $('#assign_helper_modal').modal('show');
            $('.unassigned_helpers').empty();
            $('.trucks-id-helpers').val($(this).attr('data-truck-number'));
        });
        $(document).on('click', '.remove-helper', function () {
            if (confirm("Are you sure you want to remove this helper?")) {
                var truck_number = $(this).attr('data-truck-number');
                delete helpers_json[truck_number];
                $('#helpers_json').val(JSON.stringify(helpers_json));
                $('.t_no_' + truck_number).find('.panel-body').find('.add-helper-to-truck').html("<a href='Javascript:void(0)' class='add-helper-to-truck' data-truck-number='" + truck_number + "'><i class='fa fa-plus'></i></a>");
                $('.t_no_' + truck_number).find('.panel-body').find('.send_d_h_sms.sms_helper').remove();
                if ($('.t_no_' + truck_number).find('.panel-body').find('.remove-helper').hasClass('remove-helper') == true) {
                    $('.t_no_' + truck_number).find('.panel-body').find('.remove-helper').hide();
                    $('.t_no_' + truck_number).find('.panel-body').find('.remove-helper').parent('strong').html("<a href='Javascript:void(0)' class='add-helper-to-truck' data-truck-number='" + truck_number + "'><i class='fa fa-plus'></i></a>");
                }
            }
        });
        $(document).on('click', '.remove-driver', function () {
            if (confirm("Are you sure you want to remove this driver?")) {
                var truck_number = $(this).attr('data-truck-number');
                delete drivers_json[truck_number];
                $('#drivers_json').val(JSON.stringify(drivers_json));
                $('.t_no_' + truck_number).find('.panel-body').find('.add-driver-to-truck').html("<a href='Javascript:void(0)' class='add-driver-to-truck' data-truck-number='" + truck_number + "'><i class='fa fa-plus'></i></a>");
                $('.t_no_' + truck_number).find('.panel-body').find('.send_d_h_sms.sms_driver').remove();
                if ($('.t_no_' + truck_number).find('.panel-body').find('.remove-driver').hasClass('remove-driver') == true) {
                    $('.t_no_' + truck_number).find('.panel-body').find('.remove-driver').hide();
                    $('.t_no_' + truck_number).find('.panel-body').find('.driver-info').html("<a href='Javascript:void(0)' class='add-driver-to-truck' data-truck-number='" + truck_number + "'><i class='fa fa-plus'></i></a>");
                }
            }
        });
        $(document).on('click', '.save-driver-info', function () {
            var truck_number = $('.trucks-id-drivers').val();
            var driver_id = $('.unassigned_drivers').val();
            var driver_text = $(".unassigned_drivers option:selected").html();
            var driver_name = driver_text.split("[")[0];

            $('.t_no_' + truck_number).find('.panel-body').find('.add-driver-to-truck').html(driver_name + " <a href='Javascript:void(0)' class='remove-driver' data-truck-number='" + truck_number + "'> <i class='fa fa-trash'></i></a>");

            drivers_json[truck_number] = driver_id;
            $('#drivers_json').val(JSON.stringify(drivers_json));
            console.log("Hello2");
        });
        $(document).on('click', '.send_d_h_sms', function () {
            var send_id = $(this).attr('data-send-id');
            var send_type = $(this).attr('data-send-type');
            var to_name = $(this).attr('data-d-h-name');
            if (send_id == "" || send_type == "" || to_name == "") {
                showFlashModal(false, "Missing Arguments!");
                return false;
            }
            if (send_type == 1) {
                $("#send_sms_info").html("Write message below for " + to_name + "(Driver)");
                $("#send_sms_number").html("Driver Number")
            }
            else {
                $("#send_sms_info").html("Write message below for " + to_name + "(Helper)");
                $("#send_sms_number").html("Helper Number")
            }


            $("#sms_send_message").val("");

            $("#send_sms_confirm").attr('data_send_id', send_id);
            $("#send_sms_confirm").attr('data_send_type', send_type);
            $("#send_sms_confirm").attr('data_to_name', to_name);

            $.ajax({
                type: "POST",
                url: getUserDetailsByIdUrl,
                data: {
                    'user_id': send_id,
                },
                headers: {
                    'X-CSRF-TOKEN': $('input[name="_token"]').val()
                },
                beforeSend: function () {
                },
                success: function (result) {
                    $("#send_d_h_number").val(result.data.phone1);
                    $("#send_sms_modal").modal('show');
                },
                error: function (data) {
                    console.log('Error:', data);
                }
            });
        });
        $(document).on('click', '#send_sms_confirm', function () {
            var message_data = $("#sms_send_message").val();
            var phone_num = $("#send_d_h_number").val();
            var send_id = $(this).attr('data_send_id');
            var send_type = $(this).attr('data_send_type');
            var to_name = $(this).attr('data_to_name');
            var this_btn = $(this);
            var btn_txt = this_btn.html();
            if (message_data.length == 0) {
                alert("Message cannot be empty");
                return false;
            }
            if (message_data.length > 255) {
                alert("Message length cannot be greater than 255 letters.");
                return false;
            }
            var validateMobNum = /^\d*(?:\.\d{1,2})?$/;
            if (validateMobNum.test(phone_num) && phone_num.length == 10) {
            }
            else {
                alert("Kindly Enter Valid Mobile Number");
                return false;
            }
            $.ajax({
                type: "POST",
                url: sendDHSmsUrl,
                data: {
                    'user_id': send_id,
                    'message_data': message_data,
                    'phone_number': phone_num,
                },
                headers: {
                    'X-CSRF-TOKEN': $('input[name="_token"]').val()
                },
                beforeSend: function () {
                    this_btn.html('<i class="fa fa-refresh  fa-spin"></i>');
                    this_btn.attr('disabled', true);
                },
                success: function (result) {
                    this_btn.attr('disabled', false);
                    this_btn.html(btn_txt); //Back To Save                    
                    $("#send_sms_modal").modal('hide');
                    showFlashModal(result.status, result.message);
                },
                error: function (data) {
                    active_xhr = false;
                    this_btn.html(btn_txt); //Back To Save
                    this_btn.attr('disabled', false);
                    $("#send_sms_modal").modal('hide');
                    showFlashModal(data.status, data.responseJSON.message);
                    console.log('Error:', data);
                }
            });
        });
        $(".save_trucks_and_orders").on('click', function () {
            // if (confirm('If you have moved an order from one truck to another and it\'s label was scanned then you will have to scan it again. Are you sure you want to save these changes?')) {
                var thi = $(".save_trucks_and_orders");
                $('#save_truck_json').val(trucks_orders_json);
                $.ajax({
                    type: "POST",
                    cache: false,
                    processData: false,
                    url: saveTruckOrderUrl,
                    data: $('#save_trucks_form').serialize(),
                    beforeSend: function () {
                        if (active_xhr) {
                            xhr.abort();
                        }
                        active_xhr = true;
                        if ($this_current_html !== $loadingText) {
                            thi.data('original-text', $this_current_html);
                            thi.html($loadingText);
                            thi.attr('disabled', true);
                        }
                    },
                    success: function (data) {
                        active_xhr = false;
                        thi.html(thi.data('original-text')); //Back To Save
                        thi.attr('disabled', false);
                        markers_assigned_to_trucks_local = [];
                        refresh_trucks($('#save_truck_date').val());
                        $('#changed').val(0);
                        showFlashModal(data.status, data.message);
                        refresh_list($('#save_truck_date').val());
                    },
                    error: function (data) {
                        active_xhr = false;
                        thi.html(thi.data('original-text')); //Back To Save
                        thi.attr('disabled', false);
                        showFlashModal(data.status, data.responseJSON.message);
                        console.log('Error:', data);
                    }
                });
            // }
        });
        $('.unassigned_drivers').select2({
            dropdownParent: $("#assign_driver_modal"),
            placeholder: "--Select a Driver--",
            ajax: {
                url: dashboardDriverListSelect2Url,
                error: function (jqXHR, exception) {
                    active_xhr = false;
                },
                data: function (params) {
                    var query = {
                        term: params.term,
                        page: params.page || 1,
                        size: 10,
                        date: $('#save_truck_date').val(),
                        exclude_users: drivers_json,
                        u_roles: [ROLES.DRIVER],
                        u_with_roles: false
                    }
                    return query;
                },
                processResults: function (data, params) {
                    return {
                        results: data.results,
                        pagination: {
                            more: data.pagination.more
                        }
                    };
                }
            }
        });
        $(document).on('click', '#order-selection-select-all', function () {
            var disabled = 0;
            $(".rem_wt").html($('.truck_max_weight').html());
            $(".rem_vol").html($('.truck_max_volume').html());
            $(".order-seleection-check").not(":disabled").each(function () {
                if ($('#order-selection-select-all').attr('checked') == "checked") {
                    var weight = $(this).attr('data-weight');
                    var volume = $(this).attr('data-cubes');
                    var rem_wt_after = parseInt($(".rem_wt").html());
                    var rem_vol_after = parseInt($(".rem_vol").html());
                    $(".rem_wt").html(parseInt($('.truck_max_weight').html()));
                    $(".rem_wt").css("color", "black");
                    $(".rem_vol").html(parseInt($('.truck_max_volume').html()));
                    $(".rem_vol").css("color", "black");
                    disabled = 0;
                    $(this).attr('checked', false);
                    $(this).prop('checked', false);

                } else {
                    var weight = $(this).attr('data-weight');
                    var volume = $(this).attr('data-cubes');
                    var rem_wt_after = parseInt($(".rem_wt").html());
                    var rem_vol_after = parseInt($(".rem_vol").html());
                    if (rem_vol_after - parseInt(volume) < 0) {
                        $(".rem_vol").html(rem_vol_after - parseInt(volume));
                        $(".rem_vol").css("color", "red");
                        disabled = 1;
                    } else {
                        $(".rem_vol").html(rem_vol_after - parseInt(volume));
                        $(".rem_vol").css("color", "black");
                    }
                    if (rem_wt_after - parseInt(weight) < 0) {
                        $(".rem_wt").html(rem_wt_after - parseInt(weight));
                        $(".rem_wt").css("color", "red");
                        disabled = 1;
                    } else {
                        $(".rem_wt").html(rem_wt_after - parseInt(weight));
                        $(".rem_wt").css("color", "black");
                    }
                    $(this).attr('checked', "checked");
                    $(this).prop('checked', "checked");
                }
            });
            if (disabled == 1) {
                $('#select_orders_button').attr('disabled', true);
            } else {
                $('#select_orders_button').attr('disabled', false);
            }
            if ($('#order-selection-select-all').attr('checked') == "checked") {
                $('#order-selection-select-all').attr("checked", false);
                $('#order-selection-select-all').prop("checked", false);
            } else {
                $('#order-selection-select-all').attr('checked', "checked");
                $('#order-selection-select-all').prop('checked', "checked");
            }
        });
        $('.assign-selected-order-to-truck').on('click', function () {
            $('.select-orders-content').hide();
            $('.unselect_alert').hide();
            $('#truck_details_assign').hide();
            $('#truck-options-assign').empty();
            $('#truck_loc_key').val("");
            $.each($(".check_order_number:checked"), function (key, value) {
                var abc = $(value).attr('data-loc-key');
                var O_no = $('#truck_loc_key').val();
                $('#truck_loc_key').val(O_no + "|" + abc);
            });
            if ($('#truck_loc_key').val() == "") {
                showFlashModal(false, "Please Select atleast one Location");
                return false;
            }
            $("#truck-options-assign-help").removeClass('text-red').html("");
            $('#assign_selected_order_button').trigger('click');
            return false;
        });
        $(document).on('mouseenter', 'li.list-group-item-o', function () {                       //,li.truck_ord_list
            $('.truck_name_title').css("color", "white");
            truck_markers_load = 0;

            var loc_key = $(this).find('.check_order_number').attr('data-loc-key');
            if (loc_key) {
                loc_key = loc_key;
            } else {
                loc_key = $(this).attr('data-loc');
            }

        });
        $(document).on('mouseleave', 'li.list-group-item-o', function () {                       //,li.truck_ord_list
            var loc_key = $(this).find('.check_order_number').attr('data-loc-key');
            if (loc_key) {
                loc_key = loc_key;
            } else {
                loc_key = $(this).attr('data-loc');
            }

        });


        $(document).on('click', 'li.inner_order_item', function () {
            var location = $(this).find('.address1').html();
            var new_id = $($(this).children().children());
            console.log(new_id[0].outerHTML);
            var m_id = new_id.data('order-id');
            if (m_id.indexOf("P") > -1) {
                var in1 = m_id.indexOf("P");
                var type = "Pickup";
            } else if (m_id.indexOf("D") > -1) {
                var in1 = m_id.indexOf("D");
                var type = "Delivery";
            } else {
                var in1 = m_id.indexOf("T");
                var type = "Transfer";
            }
            var order_id = m_id.slice(0, in1) + " " + type;
            in1 = $.inArray(order_id, all_order_id);
            geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'address': location
            }, function (results, status) {
                var new_lat = results[0].geometry.location.lat();
                var new_lng = results[0].geometry.location.lng();
                let lastMarker = markerStack.pop();
                if(lastMarker!=undefined){
                    google.maps.event.trigger(lastMarker, 'mouseout');
                }
                zoomBounce(new_lng, new_lat, in1);
                markerStack.push(individual_markers[in1]);
            });
        });
        function zoomBounce(lng, lat, m_id) {
            map.panTo(new google.maps.LatLng(lat, lng));
            map.setZoom(15);
            google.maps.event.trigger(individual_markers[m_id], 'mouseover');
        }



        $(document).on('mouseenter', 'li.list-group-item-t', function () {
            $('.truck_name_title').css("color", "white");
            truck_markers_load = 0;

            var loc_key = $(this).find('.check_transfer_number').attr('data-loc-key');

        });
        $(document).on('mouseleave', 'li.list-group-item-t', function () {
            var loc_key = $(this).find('.check_transfer_number').attr('data-loc-key');

        });
        function bounceMarker(index) {
            $.each(markers[index], function (key, value) {
                map.panTo(value.getPosition());
                value.setAnimation(google.maps.Animation.BOUNCE);
            });
            map.setZoom(8);
        }
        function stopBounceMarker(index) {
            $.each(markers[index], function (key, value) {
                value.setAnimation(null);
            });
        }
        $('.orders_div').find('#select_all_ord_location').on('click', function () {
            $('#orders-accordion').find(".check_order_number").each(function () {
                if ($('.orders_div').find('#select_all_ord_location').attr('checked') == "checked") {
                    $(this).attr('checked', false);
                    $(this).prop('checked', false);
                } else {
                    $(this).attr('checked', true);
                    $(this).prop('checked', true)
                }
            });
            if ($('.orders_div').find('#select_all_ord_location').attr('checked') == "checked") {
                $('.orders_div').find('#select_all_ord_location').attr("checked", false);
                $('.orders_div').find('#select_all_ord_location').prop("checked", false);
            } else {
                $('.orders_div').find('#select_all_ord_location').attr('checked', "checked");
                $('.orders_div').find('#select_all_ord_location').prop('checked', "checked");
            }
        });
        $('.t-orders_div').find('#select_all_transfer_location').on('click', function () {
            $('#transfer-accordion').find(".check_order_number").each(function () {
                if ($('.t-orders_div').find('#select_all_transfer_location').attr('checked') == "checked") {
                    $(this).attr('checked', false);
                    $(this).prop('checked', false);
                } else {
                    $(this).attr('checked', true);
                    $(this).prop('checked', true)
                }
            });
            if ($('.t-orders_div').find('#select_all_transfer_location').attr('checked') == "checked") {
                $('.t-orders_div').find('#select_all_transfer_location').attr("checked", false);
                $('.t-orders_div').find('#select_all_transfer_location').prop("checked", false);
            } else {
                $('.t-orders_div').find('#select_all_transfer_location').attr('checked', "checked");
                $('.t-orders_div').find('#select_all_transfer_location').prop('checked', "checked");
            }
        });
        function show_markers(loc_key = []) {
            showLoading("dispatchDashboard_box", '#');
            if (loc_key.length > 0) {
                initmap();
                $.each(loc_key, function (key, value) {
                    var location = [];
                    $.each(orders_json[value], function (key1, value1) {
                        geocoder = new google.maps.Geocoder();
                        if (value1.order_type == 'Pickup') {
                            var mlng = value1.origin_lng;
                            var mlat = value1.origin_lat;
                            var type_head = "P";
                            if (mlng == null || mlng == "" || mlat == null || mlat == "") {
                                var str = value1.origin_addressline1 + "," + value1.origin_addressline2 + "," + value1.origin_city + "," + value1.origin_state + "," + value1.origin_zip;
                                geocoder.geocode({
                                    'address': str
                                }, function (results, status) {
                                    if (status == google.maps.GeocoderStatus.OK) {
                                        request = $.ajax({
                                            type: "POST",
                                            url: updateDispatchMapCoordsUrl,
                                            data: {
                                                'orders_id': value1.o_id,
                                                'route_type': value1.route_type,
                                                'address': str,
                                                'lat': results[0].geometry.location.lat(),
                                                'lng': results[0].geometry.location.lng(),
                                            },
                                            headers: {
                                                'X-CSRF-TOKEN': $('input[name="_token"]').val()
                                            },
                                            success: function (result) {
                                            },
                                            error: function (data) {
                                                console.log('error', data);
                                            }
                                        });
                                        var new_lat = results[0].geometry.location.lat();
                                        var new_lng = results[0].geometry.location.lng();
                                        var marker = google.maps.marker.AdvancedMarkerElement({
                                            position: new google.maps.LatLng(new_lat, new_lng),
                                            map: map,
                                            label: "",
                                            icon: pinSymbolSmall("#FE6256")
                                        });
                                        location.push(marker);
                                    } else if (status == "OVER_QUERY_LIMIT") {
                                        console.log("OQL3");
                                    } else {
                                        alert("some problem in geocode (Marker) : " + status);
                                    }
                                });
                            } else {
                                var marker = google.maps.marker.AdvancedMarkerElement({
                                    position: new google.maps.LatLng(mlat, mlng),
                                    map: map,
                                    label: "",
                                    icon: pinSymbolSmall("#FE6256")
                                });
                                location.push(marker);
                            }
                        } else if (value1.order_type == 'Transfer') {
                            var dlng = value1.dest_lng;
                            var dlat = value1.dest_lat;
                            var to_terminal = value1.to_terminal;

                            if (dlng == null || dlng == "" || dlat == null || dlat == "") {
                                var str = value1.dest_warehouse_info[0].addressline1 + "," + value1.dest_warehouse_info[0].addressline2 + "," + value1.dest_warehouse_info[0].city + "," + value1.dest_warehouse_info[0].state + "," + value1.dest_warehouse_info[0].zipcode;
                                geocoder.geocode({
                                    'address': str
                                }, function (results, status) {
                                    if (status == google.maps.GeocoderStatus.OK) {
                                        var new_lat = results[0].geometry.location.lat();
                                        var new_lng = results[0].geometry.location.lng();
                                        var marker = google.maps.marker.AdvancedMarkerElement({
                                            position: new google.maps.LatLng(new_lat, new_lng),
                                            map: map,
                                            label: "",
                                            icon: pinSymbolSmall("#FE6256")
                                        });
                                        location.push(marker);
                                    } else if (status == "OVER_QUERY_LIMIT") {
                                        console.log("OQL3");
                                    } else {
                                        alert("some problem in geocode (Marker) : " + status);
                                    }
                                });
                            } else {
                                var marker = google.maps.marker.AdvancedMarkerElement({
                                    position: new google.maps.LatLng(dlat, dlng),
                                    map: map,
                                    label: "",
                                    icon: pinSymbolSmall("#FE6256")
                                });
                                location.push(marker);
                            }
                        } else {
                            var mlng = value1.dest_lng;
                            var mlat = value1.dest_lat;
                            var type_head = "D";
                            if (mlng == null || mlng == "" || mlat == null || mlat == "") {
                                var str = value1.dest_addressline1 + "," + value1.dest_addressline2 + "," + value1.dest_city + "," + value1.dest_state + "," + value1.dest_zip;
                                geocoder.geocode({
                                    'address': str
                                }, function (results, status) {
                                    if (status == google.maps.GeocoderStatus.OK) {
                                        request = $.ajax({
                                            type: "POST",
                                            url: updateDispatchMapCoordsUrl,
                                            data: {
                                                'orders_id': value1.o_id,
                                                'route_type': value1.route_type,
                                                'address': str,
                                                'lat': results[0].geometry.location.lat(),
                                                'lng': results[0].geometry.location.lng(),
                                            },
                                            headers: {
                                                'X-CSRF-TOKEN': $('input[name="_token"]').val()
                                            },
                                            success: function (result) {
                                            },
                                            error: function (data) {
                                                console.log('error', data);
                                            }
                                        });
                                        var new_lat = results[0].geometry.location.lat();
                                        var new_lng = results[0].geometry.location.lng();
                                        var marker = google.maps.marker.AdvancedMarkerElement({
                                            position: new google.maps.LatLng(new_lat, new_lng),
                                            map: map,
                                            label: "",
                                            icon: pinSymbolSmall("#FE6256")
                                        });
                                        location.push(marker);
                                    } else if (status == "OVER_QUERY_LIMIT") {
                                        console.log("OQL3");
                                    } else {
                                        alert("some problem in geocode (Marker) : " + status);
                                    }
                                });
                            } else {
                                var marker = google.maps.marker.AdvancedMarkerElement({
                                    position: new google.maps.LatLng(mlat, mlng),
                                    map: map,
                                    label: "",
                                    icon: pinSymbolSmall("#FE6256")
                                });
                                location.push(marker);
                            }
                        }
                    });
                    markers[value] = location;
                });
            } else {
                initmap();
                $.each(orders_json, function (key, value) {
                    var location = [];
                    $.each(orders_json[key], function (key1, value1) {
                        geocoder = new google.maps.Geocoder();
                        switch (value1.order_type) {
                            case ROUTE_TYPE.Pickup:
                                var mlng = value1.origin_lng;
                                var mlat = value1.origin_lat;
                                var type_head = "P";
                                if (mlng == null || mlng == "" || mlat == null || mlat == "") {
                                    var str = value1.origin_addressline1 + "," + value1.origin_addressline2 + "," + value1.origin_city + "," + value1.origin_state + "," + value1.origin_zip;
                                    geocoder.geocode({
                                        'address': str
                                    }, function (results, status) {
                                        if (status == google.maps.GeocoderStatus.OK) {
                                            request = $.ajax({
                                                type: "POST",
                                                url: updateDispatchMapCoordsUrl,
                                                data: {
                                                    'orders_id': value1.o_id,
                                                    'route_type': value1.route_type,
                                                    'address': str,
                                                    'lat': results[0].geometry.location.lat(),
                                                    'lng': results[0].geometry.location.lng(),
                                                },
                                                headers: {
                                                    'X-CSRF-TOKEN': $('input[name="_token"]').val()
                                                },
                                                success: function (result) {
                                                },
                                                error: function (data) {
                                                    console.log('error', data);
                                                }
                                            });
                                            var new_lat = results[0].geometry.location.lat();
                                            var new_lng = results[0].geometry.location.lng();
                                            var marker = google.maps.marker.AdvancedMarkerElement({
                                                position: new google.maps.LatLng(new_lat, new_lng),
                                                map: map,
                                                label: "",
                                                icon: pinSymbolSmall("#FE6256")
                                            });
                                            location.push(marker);
                                        } else if (status == "OVER_QUERY_LIMIT") {
                                            console.log("OQL3");
                                        } else {
                                            alert("some problem in geocode (Marker) : " + status);
                                        }
                                    });
                                } else {
                                    var marker = google.maps.marker.AdvancedMarkerElement({
                                        position: new google.maps.LatLng(mlat, mlng),
                                        map: map,
                                        label: "",
                                        icon: pinSymbolSmall("#FE6256")
                                    });
                                    location.push(marker);
                                }
                                break;
                            case ROUTE_TYPE.Transfer:
                                var dlng = value1.dest_lng;
                                var dlat = value1.dest_lat;
                                if (dlng == null || dlng == "" || dlat == null || dlat == "") {
                                    var str = value1.dest_warehouse_info[0].addressline1 + "," + value1.dest_warehouse_info[0].addressline2 + "," + value1.dest_warehouse_info[0].city + "," + value1.dest_warehouse_info[0].state + "," + value1.dest_warehouse_info[0].zipcode;

                                    geocoder.geocode({
                                        'address': str
                                    }, function (results, status) {
                                        if (status == google.maps.GeocoderStatus.OK) {
                                            request = $.ajax({
                                                type: "POST",
                                                url: updateDispatchMapCoordsUrl,
                                                data: {
                                                    'orders_id': value1.o_id,
                                                    'route_type': value1.route_type,
                                                    'address': str,
                                                    'lat': results[0].geometry.location.lat(),
                                                    'lng': results[0].geometry.location.lng(),
                                                },
                                                headers: {
                                                    'X-CSRF-TOKEN': $('input[name="_token"]').val()
                                                },
                                                success: function (result) {
                                                },
                                                error: function (data) {
                                                    console.log('error', data);
                                                }
                                            });
                                            var new_lat = results[0].geometry.location.lat();
                                            var new_lng = results[0].geometry.location.lng();
                                            var marker = google.maps.marker.AdvancedMarkerElement({
                                                position: new google.maps.LatLng(new_lat, new_lng),
                                                map: map,
                                                label: "",
                                                icon: pinSymbolSmall("#FE6256")
                                            });
                                            location.push(marker);
                                        } else if (status == "OVER_QUERY_LIMIT") {
                                            console.log("OQL3");
                                        } else {
                                            alert("some problem in geocode (Marker) : " + status);
                                        }
                                    });
                                } else {
                                    var marker = google.maps.marker.AdvancedMarkerElement({
                                        position: new google.maps.LatLng(dlat, dlng),
                                        map: map,
                                        label: "",
                                        icon: pinSymbolSmall("#FE6256")
                                    });
                                    location.push(marker);
                                }
                                break;
                            case ROUTE_TYPE.Delivery:
                                var mlng = value1.dest_lng;
                                var mlat = value1.dest_lat;
                                var type_head = "D";
                                if (mlng == null || mlng == "" || mlat == null || mlat == "") {
                                    var str = value1.dest_addressline1 + "," + value1.dest_addressline2 + "," + value1.dest_city + "," + value1.dest_state + "," + value1.dest_zip;
                                    geocoder.geocode({
                                        'address': str
                                    }, function (results, status) {
                                        if (status == google.maps.GeocoderStatus.OK) {
                                            request = $.ajax({
                                                type: "POST",
                                                url: updateDispatchMapCoordsUrl,
                                                data: {
                                                    'orders_id': value1.o_id,
                                                    'route_type': value1.route_type,
                                                    'address': str,
                                                    'lat': results[0].geometry.location.lat(),
                                                    'lng': results[0].geometry.location.lng(),
                                                },
                                                headers: {
                                                    'X-CSRF-TOKEN': $('input[name="_token"]').val()
                                                },
                                                success: function (result) {
                                                },
                                                error: function (data) {
                                                    console.log('error', data);
                                                }
                                            });
                                            var new_lat = results[0].geometry.location.lat();
                                            var new_lng = results[0].geometry.location.lng();
                                            var marker = google.maps.marker.AdvancedMarkerElement({
                                                position: new google.maps.LatLng(new_lat, new_lng),
                                                map: map,
                                                label: "",
                                                icon: pinSymbolSmall("#FE6256")
                                            });
                                            location.push(marker);
                                        } else if (status == "OVER_QUERY_LIMIT") {
                                            console.log("OQL3");
                                        } else {
                                            alert("some problem in geocode (Marker) : " + status);
                                        }
                                    });
                                } else {
                                    var marker = google.maps.marker.AdvancedMarkerElement({
                                        position: new google.maps.LatLng(mlat, mlng),
                                        map: map,
                                        label: "",
                                        icon: pinSymbolSmall("#FE6256")
                                    });
                                    location.push(marker);
                                }
                                break;
                        }
                    });
                    markers[key] = location;
                });
            }
            gl_make_lines_on_gmap();
            hideLoading("dispatchDashboard_box", '#');
        }
        $(document).on('click', '.check_order_number', function () {
            if ($(this).attr('checked') == "checked") {
                $(this).attr('checked', false);
                $(this).prop('checked', false);
                $('.orders_div').find('#select_all_ord_location').attr("checked", false);
                $('.orders_div').find('#select_all_ord_location').prop("checked", false);
            } else {
                $(this).attr('checked', "checked");
                $(this).prop('checked', "checked");
            }
            if ($('#tab2button').parent('.route_type_order_list').hasClass('active') == true) {
                if ($('#transfer-accordion').find('.check_order_number:checked').length == 0) {
                    $('#tab2button').trigger('click');
                }
            }
            if ($('#tab1button').parent('.route_type_order_list').hasClass('active') == true) {
                if ($('#orders-accordion').find('.check_order_number:checked').length == 0) {
                    $('#tab1button').trigger('click');
                }
            }
            marker_array = [];
            $('#orders-accordion').find(".check_order_number").each(function () {
                if ($(this).attr('checked') == "checked") {
                    marker_array.push($(this).attr('data-loc-key'));
                }
            });
            $('#transfer-accordion').find(".check_order_number").each(function () {
                if ($(this).attr('checked') == "checked") {
                    marker_array.push($(this).attr('data-loc-key'));
                }
            });
            show_markers(marker_array);
            if ($('#orders-accordion').find('.check_order_number').length == $('#orders-accordion').find('.check_order_number:checked').length) {
                $('.orders_div').find('#select_all_ord_location').attr("checked", true);
                $('.orders_div').find('#select_all_ord_location').prop("checked", true);
            } else {
                $('.orders_div').find('#select_all_ord_location').attr("checked", false);
                $('.orders_div').find('#select_all_ord_location').prop("checked", false);

            }
            if ($('#transfer-accordion').find('.check_order_number').length == $('#transfer-accordion').find('.check_order_number:checked').length) {
                $('.t-orders_div').find('#select_all_transfer_location').attr("checked", true);
                $('.t-orders_div').find('#select_all_transfer_location').prop("checked", true);
            } else {
                $('.t-orders_div').find('#select_all_transfer_location').attr("checked", false);
                $('.t-orders_div').find('#select_all_transfer_location').prop("checked", false);
            }
        });
        $(document).on('click', '#tab2button', function () {
            has_clicked = false;
            if (orders_json != JSON.stringify("")) {
                $.each(orders_json, function (key_0, value_0) {
                    $.each(orders_json[key_0], function (key_1, value_1) {
                        value_1.is_last_label = false;
                    });
                });
            }
            $('.showMapMarkers').find('.fa-map-marker').css("color", "white");

            $('#orders-accordion').find('.check_order_number').attr('checked', false);
            $('#orders-accordion').find('.check_order_number').prop('checked', false);
            $('#select_all_transfer_location').prop('checked', false);
            $('#select_all_transfer_location').attr('checked', false);
            $('#transfer-accordion').find('.check_order_number').attr('checked', false);
            $('#transfer-accordion').find('.check_order_number').prop('checked', false);
            var loc_key = [];
            $.each($('#transfer-accordion').find('li'), function (key, val) {
                var location = $(val).find('.check_order_number').attr('data-loc-key');
                loc_key.push(location);
            });
            show_markers(loc_key);
            // console.log("In Individual - Transfer");
        });
        $(document).on('click', '#tab1button', function () {
            has_clicked = false;
            $('.showMapMarkers').find('.fa-map-marker').css("color", "white");

            $('#transfer-accordion').find('.check_order_number').attr('checked', false);
            $('#transfer-accordion').find('.check_order_number').prop('checked', false);
            $('#select_all_ord_location').prop('checked', false);
            $('#select_all_ord_location').attr('checked', false);
            $('#orders-accordion').find('.check_order_number').attr('checked', false);
            $('#orders-accordion').find('.check_order_number').prop('checked', false);

            var loc_key = [];
            $.each($('#orders-accordion').find('li'), function (key, val) {
                var location = $(val).find('.check_order_number').attr('data-loc-key');
                loc_key.push(location);
            });

            show_markers(loc_key);

        });
        $('.orders_date_col').datepicker({
            format: 'mm/dd/yyyy',
            autoclose: true,
        }).on('changeDate', function (e) {
                $.ajax({
                    type: 'GET',
                    url: failedMissingOrderUrl + '/' + moment(e.date).format('YYYY-MM-DD'),
                    data: {
                    },
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content'),
                        'X-CSRF-TOKEN': $('input[name="_token"]').val()
                    },
                    success: function (result) {
                        if (result.length > 0) {
                            var str = '';
                            var strDiv = '';
                            for (i = 0; i < result.length; i++) {
                                if (result[i].date == moment(e.date).format('YYYY-MM-DD')) {
                                    strDiv = $('<a>', {href:'Javascript:void(0)', class:'undelived_orders_redirect text-danger', 'style':'decoration:none;', text:'We have found '+result[i].total_orders+' failed attempts for selected date, click here to complete or take appropriate action.'})
                                    str = '<a href="Javascript:void(0)" onclick="undelived_orders_redirect()" class="text-danger" style="decoration:none;">We have found ' + result[i].total_orders + ' failed attempts for selected date, click here to complete or take appropriate action.</a>';
                                    $("#undelivered_order_redirect").append(strDiv);
                                    break;
                                }
                                else {
                                    $("#undelivered_order_redirect").html("");
                                }
                            }
                            $(".marker_selected_truck_class.marker_truck_selected").removeClass("marker_truck_selected");

                        }
                        else {
                            $("#undelivered_order_redirect").html("");
                        }
                    },
                    error: function (data) {
                        console.log('error', data);
                    }
                });
                var sch_date = moment(e.date).format('YYYY-MM-DD');
                drivers_json = {};
                helpers_json = {};
                $('.orders_date').html(moment(e.date).format('MM/DD/YYYY'));
                $('#orders-accordion').html("");
                $('#trucks_div').html("");
                $("#date_switch_done").val(1);
                $('#tab1button').trigger('click');

                refresh_trucks(sch_date);
                $('#save_truck_date').val(moment(e.date).format('YYYY-MM-DD'));
                $('#save_single_truck_date').val(moment(e.date).format('YYYY-MM-DD'));
                trucks_orders_json = JSON.stringify("");
                history.pushState({}, null, dispatchDashboardUrl+'/'+ sch_date);
                var datep = $('#save_truck_date').val();
                var Date_today = new Date();
                var Date_obj = new Date(datep);
                if (dateInPast(Date_obj, Date_today)) {
                    var View_only = 1;
                    $('.save_trucks_and_orders').hide();
                    $('.t-orders_div').find('.actions-header').hide();
                    $('.orders_div').find('.actions-header').hide();
                } else {
                    var View_only = 0;
                    $('.save_trucks_and_orders').show();
                    $('.t-orders_div').find('.actions-header').show();
                    $('.orders_div').find('.actions-header').show();
                }
            });
        $('#truck-options-assign').select2({
            dropdownParent: $("#assign_Order"),
            placeholder: '-- Choose a Truck --',
            ajax: {
                url: truckListSelect2Url,
                error: function (jqXHR, exception) {
                    active_xhr = false;
                },
                data: function (params) {
                    var query = {
                        term: params.term,
                        page: params.page || 1,
                        size: 10
                    }
                    return query;
                },
                processResults: function (data, params) {
                    return {
                        results: data.results,
                        pagination: {
                            more: data.pagination.more
                        }
                    };
                }
            }
        });

        $(document).on('change', '#truck-options-assign', function () {
            if ($("#truck-options-assign").val() == '' || $("#truck-options-assign").val() == null) {
                $('#truck_details_assign').hide();
            } else {
                var id = $(this).children("option:selected").val();
                var date = $('#save_truck_date').val();
                $.ajax({
                    type: "GET",
                    cache: false,
                    url: truckDetailsUrl + "/" + id + "/" + date,
                    success: function (data) {
                        $("#truck-number-assign").html(data.data.t_name);
                        var used_vol = $('.t_no_' + id + '_vol').html();
                        if (typeof used_vol == 'undefined') {
                            used_vol = 0;
                        }
                        var pieces = $('.t_no_' + id + '_pieces').html();
                        if (typeof pieces == 'undefined') {
                            pieces = 0;
                        }
                        var weight = $('.t_no_' + id + 'wt').html();
                        if (typeof weight == 'undefined') {
                            weight = 0;
                        }
                        var location = $('#truck_loc_key').val();
                        var loc_weight = 0;
                        var loc_cubes = 0;
                        $.each($('#orders-accordion').children(), function (key, value) {
                            if ($(value).find('.assign-order-to-truck').attr('data-loc-key') == location) {
                                loc_weight = $(value).find('.assign-order-to-truck').attr('data-total-weight');
                                loc_cubes = $(value).find('.assign-order-to-truck').attr('data-total-cubes');
                                return false;
                            }
                        });
                        $.each($('#transfer-accordion').children(), function (key, value) {
                            if ($(value).find('.assign-order-to-truck').attr('data-loc-key') == location) {
                                loc_weight = $(value).find('.assign-order-to-truck').attr('data-total-weight');
                                loc_cubes = $(value).find('.assign-order-to-truck').attr('data-total-cubes');
                                return false;
                            }
                        });

                        OpenSelectionModal(location, data.data, loc_weight, loc_cubes, data.data.max_weight - weight, data.data.max_volume - used_vol);
                        $("#max-volume").parent().html(used_vol + "/<span id='max-volume'>" + data.data.max_volume + "</span>");
                        $("#max-weight").parent().html(weight + "/<span id='max-weight'>" + data.data.max_weight + "</span>");
                        $(".pieces").html(pieces);
                        $(".driver_name").html(data.data.driver);
                        $('#truck_details_assign').show();
                        if ($('.order-seleection-check').length == $('.order-seleection-check:checked').length) {
                            $('#order-selection-select-all').attr("checked", true);
                            $('#order-selection-select-all').prop("checked", true);
                        } else {
                            $('#order-selection-select-all').attr("checked", false);
                            $('#order-selection-select-all').prop("checked", false);
                        }
                    }
                });
            }
        });
        $(document).on('change', '.order-seleection-check', function (e) {
            if ($(this).attr('checked') == "checked") {
                $(this).attr('checked', false);
                $(this).prop('checked', false);
                $('#order-selection-select-all').attr("checked", false);
                $('#order-selection-select-all').prop("checked", false);
            } else {
                $(this).attr('checked', "checked");
                $(this).prop('checked', "checked");
            }
            if ($('.order-seleection-check').length == $('.order-seleection-check:checked').length) {
                $('#order-selection-select-all').attr("checked", true);
                $('#order-selection-select-all').prop("checked", true);
            }
            if ($(this).prop('checked')) {
                var weight = $(this).attr('data-weight');
                console.log(weight);
                var volume = $(this).attr('data-cubes');
                var rem_wt_after = parseInt($(".rem_wt").html());
                var rem_vol_after = parseInt($(".rem_vol").html());
                var disabled = 0;
                if (rem_vol_after - parseInt(volume) < 0) {
                    $(".rem_vol").html(rem_vol_after - parseInt(volume));
                    $(".rem_vol").css("color", "red");
                    var disabled = 1;
                } else {
                    $(".rem_vol").html(rem_vol_after - parseInt(volume));
                    $(".rem_vol").css("color", "black");
                }
                if (rem_wt_after - parseInt(weight) < 0) {
                    $(".rem_wt").html(rem_wt_after - parseInt(weight));
                    $(".rem_wt").css("color", "red");
                    var disabled = 1;
                } else {
                    $(".rem_wt").html(rem_wt_after - parseInt(weight));
                    $(".rem_wt").css("color", "black");
                }
            } else {
                var weight = $(this).attr('data-weight');
                var volume = $(this).attr('data-cubes');
                var rem_wt_after = parseInt($(".rem_wt").html());
                var rem_vol_after = parseInt($(".rem_vol").html());
                var disabled = 0;
                if (rem_vol_after + parseInt(volume) < 0) {
                    $(".rem_vol").html(rem_vol_after + parseInt(volume));
                    $(".rem_vol").css("color", "red");
                    var disabled = 1;
                } else {
                    $(".rem_vol").html(rem_vol_after + parseInt(volume));
                    $(".rem_vol").css("color", "black");
                }
                if (rem_wt_after + parseInt(weight) < 0) {
                    $(".rem_wt").html(rem_wt_after + parseInt(weight));
                    $(".rem_wt").css("color", "red");
                    var disabled = 1;
                } else {
                    $(".rem_wt").html(rem_wt_after + parseInt(weight));
                    $(".rem_wt").css("color", "black");
                }
            }
            if (disabled == 1) {
                $('#select_orders_button').attr('disabled', true);
            } else {
                $('#select_orders_button').attr('disabled', false);
            }
        });
        $(document).on('click', "#select_orders_button", function () {
            if ($('#select_all_transfer_location:checked').length > 0) {
                $('#select_all_transfer_location').trigger('click');
            }
            if ($('#select_all_ord_location:checked').length > 0) {
                $('#select_all_ord_location').trigger('click');
            }
            var selected_orders = [];
            var un_selected_orders = [];
            var location = $('#location_key_select_orders').val();
            var tnum = $('#truck_id_select_orders').val();
            if (tnum == "") {
                showFlashModal(false, "Please Select a Truck");
                return false;
            }
            var weight = 0;
            var volume = 0;
            var unselected_weight = 0;
            var unselected_volume = 0;
            var is_diff = $('#has_same_p_d_trucks').val();
            if (is_diff == 1) {
                if (!confirm("You are assigning some same day deliveries to a different trucks than the pickups. Are you sure you want to continue?")) {
                    $('#has_same_p_d_trucks').val(0);
                    return false;
                }
                else {
                    $('#has_same_p_d_trucks').val(0);
                }
            }
            if (location.indexOf("|") == -1) {
                $.each($('.order-seleection-check'), function (key, value) {
                    if ($(value).prop('checked')) {
                        $.each(orders_json[location], function (key1, value1) {
                            if (value1.transfer_id) {
                                value1.transfer_id = value1.transfer_id;
                            } else {
                                value1.transfer_id = "";
                            }
                            if (value1.order_type == "Pickup") {
                                var type = "P";
                            } else if (value1.order_type == "Transfer") {
                                var type = "T";
                            } else {
                                var type = "D";
                            }
                            if (value1.o_id + type + value1.transfer_id == $(value).attr('data-order-id')) {
                                selected_orders.push(value1);
                                weight = weight + parseInt(value1.order_weight);
                                volume = volume + parseInt(value1.total_cubes);
                            }
                        });
                    } else {
                        $.each(orders_json[location], function (key1, value1) {
                            if (value1.order_type == "Pickup") {
                                var type = "P";
                            } else if (value1.order_type == "Transfer") {
                                var type = "T";
                            } else {
                                var type = "D";
                            }
                            if (value1.o_id + type + value1.transfer_id == $(value).attr('data-order-id')) {
                                un_selected_orders.push(value1);
                                unselected_weight = unselected_weight + parseInt(value1.order_weight);
                                unselected_volume = unselected_volume + parseInt(value1.total_cubes);
                            }
                        });
                    }
                });
                if (selected_orders.length == 0) {
                    showFlashModal(false, "No Orders Selected!");
                    return false;
                }
                var proceed = true;
                $.each(selected_orders, function (index, row) {
                    if (row.is_same_day == 1 && row.order_type == "Delivery") {
                        // Check if Delivery is Scheduled or is being scheduled now.
                        if ($('#check' + row.orders_id + 'P').prop('checked')) {
                            //Delivery is being assigned now
                        } else {
                            // Pickup Not being assigned with this lot, check if Pickup has been asssigned already
                            var pick = $('#t_o_' + row.orders_id + 'P').attr('data-pieces');
                            if (typeof pick == "undefined") {
                                // Pickup Has not been assigned.
                                showFlashModal(false, "You cannot schedule Delivery without scheduling pickup");
                                proceed = false;
                            } else {
                                // Pickup assigned to another Truck.
                            }
                        }
                    }
                    if (row.order_type == "Transfer") {
                        check_transfer_completed(row.transfer_id).done(function (data) {
                            if (data.status) {
                                proceed = false;
                                showFlashModal(false, "Found some completed transfers. Refreshing...");
                                $(".close, .modal").click(function () {
                                    window.location.reload();
                                });
                                return false;
                            }
                        });
                    }
                });
                if (proceed == false) {
                    return false;
                }
                orders_json[location] = selected_orders;
                var iter = 0;
                $.each(orders_json[location], function (or_list, or_val) {
                    if (or_val.order_type == "Transfer") {
                        $.each($('#transfer-accordion').children(), function (key, value) {
                            if ($(value).find('.assign-order-to-truck').attr('data-loc-key') == location) {
                                $(value).find('.assign-order-to-truck').attr('data-total-weight', weight);
                                $(value).find('.assign-order-to-truck').attr('data-total-cubes', volume);
                                return false;
                            }
                        });

                        assign_order_to_truck(location, tnum);
                        if (++iter == selected_orders.length) { // when all selected will be assigned then iterate for unassigned orders.
                            if (get_status() == 1) {
                                orders_json[location] = un_selected_orders;
                            }
                            var i = $('#transfer-accordion').children().length;
                            if (un_selected_orders.length > 0) {
                                var term = get_active_warehouse(un_selected_orders[0].depot_id, 'terminal_name');
                                var checkbox = '<h6 class="panel-title"><input type="checkbox" class="check_order_number" data-loc-key="' + location + '">';
                                var html_str1 = checkbox + '<span class="Number">' + (i + 1) + '.</span><a data-toggle="collapse" data-parent="#accordion" href="#collapseOne">' + location + '<small class="text-muted">Orders:-  <span class="order_numbers">' + orders_json[location].length + '</span></small></span></a>';
                                var html_button = "<button type='button' class='btn btn-sm btn-info assign-order-to-truck' data-total-cubes=" + unselected_volume + " data-total-weight=" + unselected_weight + " data-loc-key='" + location + "'>Assign</button></h6>";
                                var html_new = html_str1 +
                                    html_button;
                                var color_counter = (i % 5 + 1);
                                $('#transfer-accordion').append(
                                    $('<li />')
                                        .attr('id', 'map-marker-' + i)
                                        .attr('data-marker-id', i)
                                        .attr('class', 'depot-result list-group-itemz list-group-item-o  loc_name_' + i + ' show_marker color' + color_counter)
                                        .html(html_new)
                                );
                                $('.t-orders_div').show();
                                $('.No-t-orders-div').hide();
                                $.each($('#transfer-accordion').children(), function (key, value) {
                                    if ($(value).find('.assign-order-to-truck').attr('data-loc-key') == location) {
                                        $(value).find('.assign-order-to-truck').attr('data-total-weight', unselected_weight);
                                        $(value).find('.assign-order-to-truck').attr('data-total-cubes', unselected_volume);
                                        return false;
                                    }
                                });
                            }
                        }
                    } else {
                        $.each($('#orders-accordion').children(), function (key, value) {
                            if ($(value).find('.assign-order-to-truck').attr('data-loc-key') == location) {
                                $(value).find('.assign-order-to-truck').attr('data-total-weight', weight);
                                $(value).find('.assign-order-to-truck').attr('data-total-cubes', volume);
                                return false;
                            }
                        });

                        assign_order_to_truck(location, tnum);
                        if (++iter == selected_orders.length) {
                            if (get_status() == 1) {
                                orders_json[location] = un_selected_orders;
                            }
                            var i = $('#orders-accordion').children().length;
                            if (un_selected_orders.length > 0) {
                                var has_same_day = 0;
                                var has_cc_internally_unpaid = 0;
                                $.each(un_selected_orders, function (orders, order_row) {
                                    if (order_row.is_same_day == 1) {
                                        has_same_day = 1;
                                    }
                                    if (order_row.hasOwnProperty('is_cc_internally_unpaid')) {
                                        if (order_row.is_cc_internally_unpaid == 1) {
                                            has_cc_internally_unpaid = 1;
                                        }
                                    }
                                });
                                console.log('has_sameday 5: ', un_selected_orders);
                                if (has_same_day > 0) {
                                    var img_str = "<img title='Has Same Day Delivery Orders' style='width:25px;' src='" + same_day_logo + "' >";
                                } else {
                                    var img_str = "";
                                }
                                if (has_cc_internally_unpaid == 1) {
                                    img_str += '<span class="text-red"><i class="fa fa-dollar"></i></span>';
                                }
                                var term = get_active_warehouse(un_selected_orders[0].depot_id, 'terminal_name');
                                var checkbox = '<h6 class="panel-title"><input type="checkbox" class="check_order_number" data-loc-key="' + location + '">';
                                var html_str1 = checkbox + '<span class="Number">' + (i + 1) + '.</span><a data-toggle="collapse" data-parent="#accordion" href="#collapseOne">' + location + ' (' + term + ') ' + img_str + '<small class="text-muted">Orders:-  <span class="order_numbers">' + orders_json[location].length + '</span></small></span></a>';
                                var html_button = "<button type='button' class='btn btn-info btn-sm assign-order-to-truck' data-total-cubes=" + unselected_volume + " data-total-weight=" + unselected_weight + " data-loc-key='" + location + "'>Assign</button></h6>";
                                var html_new = html_str1 +
                                    html_button;
                                var color_counter = (i % 5 + 1);
                                $('#orders-accordion').append(
                                    $('<li />')
                                        .attr('id', 'map-marker-' + i)
                                        .attr('data-marker-id', i)
                                        .attr('class', 'depot-result list-group-itemz list-group-item-o  loc_name_' + i + ' show_marker color' + color_counter)
                                        .html(html_new)
                                );
                                $('.orders_div').show();
                                $('.No-orders-div').hide();
                                $.each($('#orders-accordion').children(), function (key, value) {
                                    if ($(value).find('.assign-order-to-truck').attr('data-loc-key') == location) {
                                        $(value).find('.assign-order-to-truck').attr('data-total-weight', unselected_weight);
                                        $(value).find('.assign-order-to-truck').attr('data-total-cubes', unselected_volume);
                                        return false;
                                    }
                                });
                            }
                        }
                    }
                });
            } else {
                var array = location.split("|");
                var len = 0;
                $.each(array, function (key, value_loc) {
                    $.each($('.order-seleection-check'), function (key, value) {
                        if ($(value).prop('checked')) {
                            $.each(orders_json[value_loc], function (key1, value1) {
                                if (value1.transfer_id) {
                                    value1.transfer_id = value1.transfer_id;
                                } else {
                                    value1.transfer_id = "";
                                }
                                if (value1.order_type == REVERSAL_ROUTE_TYPE[ROUTE_TYPE.Pickup]) {
                                    var type = "P";
                                } else if (value1.order_type == REVERSAL_ROUTE_TYPE[ROUTE_TYPE.Transfer]) {
                                    var type = "T";
                                } else {
                                    var type = "D";
                                }
                                if (value1.o_id + type + value1.transfer_id == $(value).attr('data-order-id')) {
                                    len = len + 1;
                                }
                            });

                        }
                    });
                });
                if (len == 0) {
                    alert("Please choose at least 1 order");
                    return false;
                }
                $.each(array, function (key, value_loc) {
                    selected_orders = [];
                    un_selected_orders = [];
                    weight = 0;
                    volume = 0;
                    unselected_weight = 0;
                    unselected_volume = 0;
                    if (key == 0) {
                        return true;
                    }
                    $.each($('.order-seleection-check'), function (key, value) {
                        if ($(value).prop('checked') == true) {
                            $.each(orders_json[value_loc], function (key1, value1) {
                                if (value1.transfer_id) {
                                    value1.transfer_id = value1.transfer_id;
                                } else {
                                    value1.transfer_id = "";
                                }
                                if (value1.order_type == REVERSAL_ROUTE_TYPE[ROUTE_TYPE.Pickup]) {
                                    var type = "P";
                                } else if (value1.order_type == REVERSAL_ROUTE_TYPE[ROUTE_TYPE.Transfer]) {
                                    var type = "T";
                                } else {
                                    var type = "D";
                                }
                                if (value1.o_id + type + value1.transfer_id == $(value).attr('data-order-id')) {
                                    selected_orders.push(value1);
                                    weight = weight + parseInt(value1.order_weight);
                                    volume = volume + parseInt(value1.total_cubes);
                                }
                            });
                        } else {
                            $.each(orders_json[value_loc], function (key1, value1) {
                                if (value1.order_type == REVERSAL_ROUTE_TYPE[ROUTE_TYPE.Pickup]) {
                                    var type = "P";
                                } else if (value1.order_type == REVERSAL_ROUTE_TYPE[ROUTE_TYPE.Transfer]) {
                                    var type = "T";
                                } else {
                                    var type = "D";
                                }
                                if (value1.o_id + type + value1.transfer_id == $(value).attr('data-order-id')) {
                                    un_selected_orders.push(value1);
                                    unselected_weight = unselected_weight + parseInt(value1.order_weight);
                                    unselected_volume = unselected_volume + parseInt(value1.total_cubes);
                                }
                            });
                        }
                    });
                    if (selected_orders.length == 0) {
                        return false;
                    }
                    var is_transfer_completed = true;
                    $.each(selected_orders, function (selected_key, selected_val) {
                        if (selected_val.order_type == "Transfer") {
                            check_transfer_completed(selected_val.transfer_id).done(function (data) {
                                if (data.status) {
                                    is_transfer_completed = false;
                                    showFlashModal(false, "Found some completed transfers. Refreshing...");
                                    $(".close, .modal").click(function () {
                                        window.location.reload();
                                    });
                                    return false;
                                }
                            });
                        }
                    });
                    if (is_transfer_completed == false) {
                        return false;
                    }
                    orders_json[value_loc] = selected_orders;
                    var iter = 0;
                    $.each(orders_json[value_loc], function (key1, value1) {
                        if (value1.order_type == "Transfer") {
                            $.each($('#transfer-accordion').children(), function (key, value) {
                                if ($(value).find('.assign-order-to-truck').attr('data-loc-key') == value_loc) {
                                    $(value).find('.assign-order-to-truck').attr('data-total-weight', weight);
                                    $(value).find('.assign-order-to-truck').attr('data-total-cubes', volume);
                                    return false;
                                }
                            });

                            assign_order_to_truck(value_loc, tnum);
                            if (++iter == selected_orders.length) { // when all selected will be assigned then iterate for unassigned orders.
                                if (get_status() == 1) {
                                    orders_json[value_loc] = un_selected_orders;
                                }
                                var i = $('#transfer-accordion').children().length;
                                if (un_selected_orders.length > 0) {
                                }
                            }
                        } else {
                            $.each($('#orders-accordion').children(), function (key, value) {
                                if ($(value).find('.assign-order-to-truck').attr('data-loc-key') == value_loc) {
                                    $(value).find('.assign-order-to-truck').attr('data-total-weight', weight);
                                    $(value).find('.assign-order-to-truck').attr('data-total-cubes', volume);
                                    return false;
                                }
                            });

                            assign_order_to_truck(value_loc, tnum);
                            if (++iter == selected_orders.length) {
                                if (get_status() == 1) {
                                    orders_json[value_loc] = un_selected_orders;
                                }
                                var i = $('#orders-accordion').children().length;
                                if (un_selected_orders.length > 0) {
                                    var has_same_day = 0;
                                    var has_cc_internally_unpaid = 0;
                                    $.each(un_selected_orders, function (orders, order_row) {
                                        if (order_row.is_same_day == 1) {
                                            has_same_day = 1;
                                        }
                                        if (order_row.hasOwnProperty('is_cc_internally_unpaid')) {
                                            if (order_row.is_cc_internally_unpaid == 1) {
                                                has_cc_internally_unpaid = 1;
                                            }
                                        }
                                    });
                                    console.log('has_sameday 6: ', un_selected_orders);
                                    if (has_same_day > 0) {
                                        var img_str = "<img title='Has Same Day Delivery Orders' style='width:25px;' src='" + same_day_logo + "' >";
                                    } else {
                                        var img_str = "";
                                    }
                                    if (has_cc_internally_unpaid == 1) {
                                        img_str += '<span class="text-red"><i class="fa fa-dollar"></i></span>';
                                    }
                                    var term = get_active_warehouse(un_selected_orders[0].depot_id, 'terminal_name');
                                    var checkbox = '<h6 class="panel-title"><input type="checkbox" class="check_order_number" data-loc-key="' + location + '">';
                                    var html_str1 = checkbox + '<span class="Number">' + (i + 1) + '.</span><a data-toggle="collapse" data-parent="#accordion" href="#collapseOne">' + location + ' (' + term + ') ' + img_str + '<small class="text-muted">Orders:-  <span class="order_numbers">' + orders_json[value_loc].length + '</span></small></span></a>';
                                    var html_button = "<button type='button' class='btn btn-info btn-sm assign-order-to-truck' data-total-cubes=" + unselected_volume + " data-total-weight=" + unselected_weight + " data-loc-key='" + location + "'>Assign</button></h6>";
                                    var html_new = html_str1 +
                                        html_button;
                                    var color_counter = (i % 5 + 1);
                                    $('#orders-accordion').append(
                                        $('<li />')
                                            .attr('id', 'map-marker-' + i)
                                            .attr('data-marker-id', i)
                                            .attr('class', 'depot-result list-group-itemz list-group-item-o loc_name_' + i + ' show_marker color' + color_counter)
                                            .html(html_new)
                                    );
                                    $('.orders_div').show();
                                    $('.No-orders-div').hide();
                                    $.each($('#orders-accordion').children(), function (key, value) {
                                        if ($(value).find('.assign-order-to-truck').attr('data-loc-key') == value_loc) {
                                            $(value).find('.assign-order-to-truck').attr('data-total-weight', unselected_weight);
                                            $(value).find('.assign-order-to-truck').attr('data-total-cubes', unselected_volume);
                                            return false;
                                        }
                                    });
                                }
                            }
                        }
                    });
                });
            }
            $('#rec_present_modal_close').trigger('click');
        });
        $("#assign_button").on('click', function () {
            var order_loc_key = $('#truck_loc_key').val();
            var truck_number = $('#truck-options-assign').val();
            if (truck_number == "" || truck_number == null) {
                showFlashModal(false, "Please Select a Truck");
                return false;
            }
            if (order_loc_key.indexOf("|") == -1) {

                if (assign_order_to_truck(order_loc_key, truck_number)) {
                    $('#assign_Order').modal('hide');
                } else {
                    $("#truck-options-assign-help").addClass('text-red').html("Something went wrong!!");
                    return false;
                }
            } else {
                var array = order_loc_key.split("|");
                $.each(array, function (key, value) {
                    if (key == 0) {
                        return true;
                    }

                    assign_order_to_truck(value, truck_number)
                    if (get_status() == 1) {
                        // Nothing
                    } else {
                        $("#truck-options-assign-help").addClass('text-red').html("Something went wrong!!");
                        return false;
                    }
                });
                $('#assign_Order').modal('hide');
            }
            $('#select-all-check').attr("checked", false);
            $('#select-all-check').prop("checked", false);
        });
        $('.unassigned_helpers').select2({
            dropdownParent: $("#assign_helper_modal"),
            placeholder: "--Select a Helper--",
            ajax: {
                url: dashboardDriverListSelect2Url,
                error: function (jqXHR, exception) {
                    active_xhr = false;
                },
                data: function (params) {
                    var query = {
                        term: params.term,
                        page: params.page || 1,
                        size: 10,
                        date: $('#save_truck_date').val(),
                        exclude_users: helpers_json,
                        u_roles: [ROLES.HELPER],
                        u_with_roles: false
                    }
                    return query;
                },
                processResults: function (data, params) {
                    return {
                        results: data.results,
                        pagination: {
                            more: data.pagination.more
                        }
                    };
                }
            }
        });
        $(document).on('click', '.save-helper-info', function () {
            var truck_number = $('.trucks-id-helpers').val();
            var helper_id = $('.unassigned_helpers').val();
            var helper_text = $(".unassigned_helpers option:selected").html();
            var helper_name = helper_text.split("[")[0];
            $('.t_no_' + truck_number).find('.panel-body').find('.add-helper-to-truck').html(helper_name + " <a href='Javascript:void(0)' class='remove-helper' data-truck-number='" + truck_number + "'><i class='fa fa-trash'></i></a>");

            $('.t_no_' + truck_number).find('.panel-body').removeClass('.add-helper-to-truck');
            helpers_json[truck_number] = helper_id;
            $('#helpers_json').val(JSON.stringify(helpers_json));
        });
        $(document).on('click', '.move_button', function () {
            $('#truck_details_move').hide();
            $('#truck-options-move').empty();
            var scanned_label = $(this).attr("data-remove-scanned-label");
            var total_label = $(this).attr('data-label-in-order');
            scanned_label = (scanned_label != undefined) ? scanned_label : 0;
            total_label = (total_label != undefined) ? total_label : 0;
            $('#scanned_labels_in_order').val(scanned_label);
            $('#total_labels_in_order').val(total_label);
            $('#truck_order_number_move').val($(this).attr("data-order-number"));
            $('#old_truck_number_move').val($(this).attr("data-truck-number"));
            $('#order_location').val($(this).attr('data-loc'));
            $("#truck-options-move-help").removeClass("text-red").html("");
            $('#move_order_button').trigger('click');
        });
        $('#truck-options-move').select2({
            dropdownParent: $("#move_Order"),
            placeholder: '--Choose a Truck --',
            width: '100%',
            ajax: {
                url: truckListSelect2Url,
                error: function (jqXHR, exception) {
                    active_xhr = false;
                },
                data: function (params) {
                    var query = {
                        term: params.term,
                        page: params.page || 1,
                        size: 10
                    }
                    return query;
                },
                processResults: function (data, params) {
                    return {
                        results: data.results,
                        pagination: {
                            more: data.pagination.more
                        }
                    };
                }
            }
        });
        $(document).on('click', "#move_confirm_button", function () {
            var order_number = $('#truck_order_number_move').val();
            var old_truck_number = $('#old_truck_number_move').val();
            var new_truck_number = $('#truck-options-move').val();
            var location = $('#order_location').val();
            var scanned_labels_in_order = $('#truck_previous_scanned_label').val();
            var removed_total_label = $('#total_labels_in_order').val();
            if (new_truck_number == "" || new_truck_number == null) {
                $("#truck-options-move-help").addClass('text-red').html("Please choose a truck.");
                return false;
            }
            if (new_truck_number == old_truck_number) {
                $("#truck-options-move-help").addClass('text-red').html("Already assigned to this truck. Please choose a different truck.");
                return false;
            }
            var temp_array = orders_json[location];
            var json = $('#t_o_json_' + order_number).val();
            if (JSON.parse(json)) {
                json['scanned_labels_in_order'] = scanned_labels_in_order;
                json['total_labels_in_order'] = total_labels_in_order;
                var json = JSON.parse(json);
            }
            orders_json[location] = [json];
            if (unassign_orders(order_number, old_truck_number, false) == false) {
                return false;
            }
            if (json.order_type == "Transfer") {
                $.each($('#transfer-accordion').children(), function (key, value) {
                    if ($(value).find('.assign-order-to-truck').attr('data-loc-key') == location) {
                        $(value).find('.assign-order-to-truck').attr('data-total-weight', json.order_weight);
                        $(value).find('.assign-order-to-truck').attr('data-total-cubes', json.total_cubes);
                        return false;
                    }
                });
            } else {
                $.each($('#orders-accordion').children(), function (key, value) {
                    if ($(value).find('.assign-order-to-truck').attr('data-loc-key') == location) {
                        $(value).find('.assign-order-to-truck').attr('data-total-weight', json.order_weight);
                        $(value).find('.assign-order-to-truck').attr('data-total-cubes', json.total_cubes);
                        return false;
                    }
                });
            }

            assign_order_to_truck(location, new_truck_number);
            if (get_status() == 0) {

                assign_order_to_truck(location, old_truck_number);
            } else {
                orders_json[location] = temp_array;
            }
            unselected_weight = 0;
            unselected_volume = 0;
            $.each(temp_array, function (key, value) {
                unselected_weight = unselected_weight + parseInt(value.order_weight);
                unselected_volume = unselected_volume + parseInt(value.total_cubes);
            });
            if (json.order_type == "Transfer") {
                if (orders_json[location] == undefined || orders_json[location].length == 0) {
                    return false;
                } else {

                }
            } else {

            }
            $("#move_Order").modal("hide");
        });
        $(".reason_codes_id").select2({
            ajax: {
                url: reasonCodesListSelect2Url,
                dataType: 'json',
                data: function (params) {
                    return {
                        reason_category: $("#reason_category").val(),
                        term: params.term || '',
                        page: params.page || 1
                    }
                },
                processResults: function (data, params) {
                    // parse the results into the format expected by Select2
                    // since we are using custom formatting functions we do not need to
                    // alter the remote JSON data, except to indicate that infinite
                    // scrolling can be used
                    params.page = params.page || 1;

                    return {
                        results: data.results,
                        pagination: {
                            more: (params.page * 10) < data.total_count
                        }
                    };
                },
                cache: true
            },
            placeholder: '-Choose Reason Code-',
            width: '100%',
            allowClear: true
        })
            .on("change", function (e) {
                var reason_codes_id = $(this).val();
            })
            .on("select2:close", function (e) {
                var reason_codes_id = $(this).val();
            })
            .on("select2:open", function (e) {

                var reason_codes_id = $(this).val();
            })
            .on("select2:unselect", function (e) {

                var reason_codes_id = $(this).val();
            });
    });

    $(function () {
        // on page reload show/hide save button 
        var datep = $('#save_truck_date').val();
        var Date_today = new Date();
        var Date_obj = new Date(datep);
        if (dateInPast(Date_obj, Date_today)) {
            var View_only = 1;
            $('.save_trucks_and_orders').hide();
        } else {
            var View_only = 0;
            $('.save_trucks_and_orders').show();
        }
        initmap();
        // on page reload fetch list of unassigned trucks
        console.log('test 2')
        refresh_list(window.lsData['date']);
        // on page reload fetch list of trucks
        refresh_trucks(window.lsData['date']);
        window.onpopstate = function (e) {
            if (e.state) {
                document.getElementById("content").innerHTML = e.state.html;
                document.title = e.state.pageTitle;
            }
        };
        var datep = $('#save_truck_date').val();
        var Date_today = new Date();
        var Date_obj = new Date(datep);
        if (!dateInPast(Date_obj, Date_today)) {
            $('#orders-accordion').sortable({
                items: '> li',
                scroll: false,
                update: function (event, ui) {
                    var addressOrder = $(this).sortable('toArray');
                    var new_locations = [];
                    for (var j = 0; j < addressOrder.length; j++) {
                        $('#orders-accordion').find('#' + addressOrder[j]).find('.Number').html((j + 1) + ".");
                    }
                    $('#changed').val(1);
                }
            });
            $('#transfer-accordion').sortable({
                items: '> li',
                scroll: false,
                update: function (event, ui) {
                    var addressOrder = $(this).sortable('toArray');
                    var new_locations = [];
                    for (var j = 0; j < addressOrder.length; j++) {
                        $('#transfer-accordion').find('#' + addressOrder[j]).find('.Number').html((j + 1) + ".");
                    }
                    $('#changed').val(1);
                }
            });
        }
        $(window).bind('beforeunload', function () {
            if ($('#changed').val() == "1") {
                return "Do you want to exit this page?";
            }
        });
        $(document).on('click', '.load_more', function () {
            $('.load_more').remove();
            var trucks_batch = ($('.trucks_div>div').length / 10);
            var date = $('#save_truck_date').val()
            refresh_trucks(date, trucks_batch + 1);
        });


        $(document).on('click', '.swap-truck', function (e) {
            var truck_id = $(this).attr('data-truck-id');
            var truck_name = $(this).attr('data-truck-name');
            if (truck_id == '' || truck_id == 'undefined' || truck_id == null) {
                showFlashModal(false, "Missing Argurment(s)");
                return false;
            }
            if ($.inArray(Number(truck_id), locked_trucks_id) != -1) {
                showFlashModal(false, "Kindly Un-Lock the truck to continue.");
                return false;
            }
            ignore_trucks_id = [...locked_trucks_id];
            ignore_trucks_id.push(truck_id);
            $("#swap_truck_info").html("Select New Truck To Swap With \"" + truck_name + "\".")

            $('#swap_truck_selected').val(null).trigger('change');

            $("#swap_truck_confirm").attr('disabled', false);
            $("#swap_truck_confirm").attr('data-truck-id', truck_id);

            $("#swap_truck_modal").modal('show');
        });

        $(document).on('click', '#swap_truck_confirm', function (e) {
            $(this).attr('disabled', true);
            var old_truck = $(this).attr('data-truck-id');
            var new_truck = $('#swap_truck_selected').val();


            var truck_data1 = JSON.parse(trucks_orders_json);

            var old_truck_data = truck_data1[old_truck];
            var new_truck_data = truck_data1[new_truck];
            if (new_truck_data == 'undefined' || new_truck_data == null)
                new_truck_data = [];

            truck_data1[old_truck] = new_truck_data;
            truck_data1[new_truck] = old_truck_data;

            trucks_orders_json = JSON.stringify(truck_data1);
            show_truck_order_list(old_truck, new_truck);
            $('#changed').val(1)

            $("#swap_truck_modal").modal('hide');
            $(this).attr('disabled', false);
        });

        $(document).on('click', '.lock-truck', function (e) {
            e.preventDefault();
            var $_this = $(this);

            if ($(this).attr('data-is-local') && $(this).attr('data-is-local') == 1) {
                var lock_val = 0;
                if ($(this).attr('data-is-locked') == 1) {
                    $(this).attr('data-is-locked', 0);
                    lock_val = 0;
                    $(".t_no_" + $(this).attr('data-truck-id')).attr('data-is-locked', 0);
                    var lock_str = '<i class="text-success fa fa-unlock fa-sm "></i>';
                    $_badge = $_this.closest('.panel').find('.truck-orders-addresses li');
                    $_this.closest('.panel').find('.truck-orders-addresses').addClass('can_assign')
                    $_badge.find('.badge').each(function (i, obj) {
                        if ($(obj).hasClass('btn-success') == false) {
                            var id_li = '#' + $(obj).closest('li').attr('id');
                            $(id_li + " .dropdown .unassign_button").show();
                            $(id_li + " .dropdown .move_button").show();
                            $(id_li).removeClass('sorting-disabled');
                            $_this.closest('.panel').find('.panel-body').find('.toa-sort-orders').show();
                        }
                    });

                    var index = locked_trucks_id.indexOf(Number($_this.attr('data-truck-id')));
                    if (index != '' && index != 'undefined')
                        var x = locked_trucks_id.splice(index, 1);
                    showFlashModal(true, 'Route is Unlock.');
                }
                else {
                    $(this).attr('data-is-locked', 1);
                    lock_val = 1;
                    $(".t_no_" + $(this).attr('data-truck-id')).attr('data-is-locked', 1);
                    var lock_str = '<i class="text-danger fa fa-lock fa-sm "></i>';
                    $_badge = $_this.closest('.panel').find('.truck-orders-addresses li');
                    $_this.closest('.panel').find('.truck-orders-addresses').removeClass('can_assign')
                    $_badge.find('.badge').each(function (i, obj) {
                        if ($(obj).hasClass('btn-success') == false) {
                            var id_li = '#' + $(obj).closest('li').attr('id');
                            $(id_li + " .dropdown .unassign_button").hide();
                            $(id_li + " .dropdown .move_button").hide();
                            $(id_li).addClass('sorting-disabled');
                            $_this.closest('.panel').find('.panel-body').find('.toa-sort-orders').hide();
                        }
                    });

                    locked_trucks_id.push(Number($_this.data('truck-id')));
                    showFlashModal(true, 'Route is Locked.');
                }
                var truck_data1 = JSON.parse(trucks_orders_json);
                var truck_data = truck_data1[$(this).attr('data-truck-id')];
                truck_data.map(val => {
                    val.is_locked = lock_val;
                });
                truck_data1[$(this).attr('data-truck-id')] = truck_data;
                trucks_orders_json = JSON.stringify(truck_data1);
                $_this.html(lock_str);
            }
            else {
                $.ajax({
                    type: "GET",
                    cache: false,
                    url: $(this).attr("href"),
                    success: function (data) {
                        showFlashModal(data.status, data.message);
                        if (data.message == "Route is Locked.") {
                            lock_val = 1;
                            var lock_str = '<i class="text-danger fa fa-lock fa-sm "></i>';
                            $(".t_no_" + $_this.attr('data-truck-id')).attr('data-is-locked', 1);
                            $_badge = $_this.closest('.panel').find('.truck-orders-addresses li');
                            $_this.closest('.panel').find('.truck-orders-addresses').removeClass('can_assign')
                            $_badge.find('.badge').each(function (i, obj) {
                                if ($(obj).hasClass('btn-success') == false) {
                                    var id_li = '#' + $(obj).closest('li').attr('id');
                                    $(id_li + " .dropdown .unassign_button").hide();
                                    $(id_li + " .dropdown .move_button").hide();
                                    $(id_li).addClass('sorting-disabled');
                                    $_this.closest('.panel').find('.panel-body').find('.toa-sort-orders').hide();
                                }
                            });
                            locked_trucks_id.push(Number($_this.data('truck-id')));
                        } else {
                            lock_val = 0;
                            var lock_str = '<i class="text-success fa fa-unlock fa-sm "></i>';
                            $(".t_no_" + $_this.attr('data-truck-id')).attr('data-is-locked', 0);
                            $_badge = $_this.closest('.panel').find('.truck-orders-addresses li');
                            $_this.closest('.panel').find('.truck-orders-addresses').addClass('can_assign')
                            $_badge.find('.badge').each(function (i, obj) {
                                if ($(obj).hasClass('btn-success') == false) {

                                    var id_li = '#' + $(obj).closest('li').attr('id');
                                    $(id_li + " .dropdown .unassign_button").show();
                                    $(id_li + " .dropdown .move_button").show();
                                    $(id_li).removeClass('sorting-disabled');
                                    $_this.closest('.panel').find('.panel-body').find('.toa-sort-orders').show();
                                }
                            });

                            var index = locked_trucks_id.indexOf(Number($_this.attr('data-truck-id')));

                            if ((index != '' && index != 'undefined') || (index == 0)) {
                                var x = locked_trucks_id.splice(index, 1);
                            }
                        }
                        var truck_data1 = JSON.parse(trucks_orders_json);
                        var truck_data = truck_data1[$_this.attr('data-truck-id')];
                        truck_data.map(val => {
                            val.is_locked = lock_val;
                        });
                        truck_data1[$_this.attr('data-truck-id')] = truck_data;
                        trucks_orders_json = JSON.stringify(truck_data1);
                        $_this.html(lock_str);
                    }
                });
            }
        });

        function tConvert(time) {
            // Check correct time format and split into components
            time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

            if (time.length > 1) { // If time format correct
                time = time.slice(1);  // Remove full string match value
                time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
                time[0] = +time[0] % 12 || 12; // Adjust hours
                if (time[0] < 10)
                    time[0] = '0' + time[0];
            }
            return time.join(''); // return adjusted time or original string
        }

        $(document).on('click', '.calc-time-truck', function (e) {
            var truck_data_all = JSON.parse(trucks_orders_json);
            var truck_id = $(this).attr('data-truck-id');
            var truck_data = truck_data_all[truck_id];

            var btn = $(this);
            var btn_html = btn.html();

            var truck_coords = {};
            truck_coords['coordinates'] = {};
            truck_coords['coordinates']['lat'] = $(".t_no_" + truck_id).attr('data-start-lat');
            truck_coords['coordinates']['lng'] = $(".t_no_" + truck_id).attr('data-start-lng');
            var t_start_time = tConvert($(".t_o_no_" + truck_id).attr('data-t_start_time'))
            truck_coords['window'] = t_start_time + " - " + t_start_time;
            truck_data.unshift(truck_coords);

            $.ajax({
                type: "POST",
                cache: false,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content'),
                    'X-CSRF-TOKEN': $('input[name="_token"]').val()
                },
                data: {
                    'truck_data': truck_data,
                },
                url: calcTruckOrderTimeUrl,
                beforeSend: function () {
                    var $loadingText = '<i class="fa fa-refresh fa-spin"></i>';
                    btn.html($loadingText);
                },
                success: function (result) {
                    if (result.status) {
                        var time_data = result.data;
                        console.log(time_data);
                        var li_ele = $(".t_o_no_" + truck_id + " li.truck_ord_list");

                        var truck_order_data_all = JSON.parse(trucks_orders_json);
                        var truck_order_data = truck_order_data_all[truck_id];

                        for (var i = 0; i < li_ele.length; i++) {
                            $(li_ele[i]).children('p.toa-order-time').html(time_data[i + 1].new_window);
                            truck_order_data[i]['new_window'] = time_data[i + 1].new_window;
                        }
                        truck_order_data_all[truck_id] = truck_order_data;
                        trucks_orders_json = JSON.stringify(truck_order_data_all);
                    } else {
                        showFlashModal(result.status, result.message);
                    }
                    btn.html(btn_html);
                },
                error: function (data) {
                    console.log('error', data);
                    btn.html(btn_html);
                }
            });
        });

        $(document).on('click', ".save-single-route", function () {
            var truck_data_all = JSON.parse(trucks_orders_json);
            var driver_json_all = drivers_json;
            var helper_json_all = helpers_json;
            var truck_id = $(this).attr('data-truck-id');
            var truck_data = {};
            truck_data[truck_id] = truck_data_all[truck_id];
            var driver_data = {};
            driver_data[truck_id] = driver_json_all[truck_id];
            var helper_data = {};
            helper_data[truck_id] = helper_json_all[truck_id];

            $("#save_single_truck_json").val(JSON.stringify(truck_data));
            $("#single_drivers_json").val(JSON.stringify(driver_data));
            $("#single_helpers_json").val(JSON.stringify(helper_data));

            var btn = $(this);
            var btn_html = btn.html();

            $.ajax({
                type: "POST",
                cache: false,
                processData: false,
                url: saveTruckOrderUrl,
                data: $('#save_single_trucks_form').serialize(),
                beforeSend: function () {
                },
                success: function (data) {
                    show_single_truck(truck_id);
                    showFlashModal(data.status, data.message)
                },
                error: function (data) {
                    active_xhr = false;
                    showFlashModal(data.status, data.responseJSON.message);
                    console.log('Error:', data);
                }
            });

        });


        function show_single_truck(truck_id) {
            console.log('show_single_truck');
            $.ajax({
                type: "GET",
                cache: false,
                url: trucksListWithOrdersUrl + "/" + $('#save_truck_date').val() + '/' + 0,
                success: function (data) {
                    var value = data.truck_data.filter(t_data => { return t_data.trucks_id == truck_id });
                    value = value[0];
                    var truck_start_address = truck_end_address = truck_start_lat = truck_start_lng = "";
                    if (value.s_addressline1) {
                        truck_start_address += value.s_addressline1;
                    }
                    if (value.s_addressline2) {
                        truck_start_address += ', ' + value.s_addressline2;
                    }
                    if (value.s_city) {
                        truck_start_address += ', ' + value.s_city;
                    }
                    if (value.s_state) {
                        truck_start_address += ', ' + value.s_state;
                    }
                    if (value.s_zipcode) {
                        truck_start_address += ', ' + value.s_zipcode;
                    }
                    if (!(value.s_latitude == null || value.s_latitude == "null" || value.s_longitude == null || value.s_longitude == "null")) {
                        make_truck_order(data, value, truck_id);
                    }
                    else {
                        geocoder = new google.maps.Geocoder();
                        geocoder.geocode({
                            'address': truck_start_address
                        }, function (results, status) {
                            value.s_latitude = results[0].geometry.location.lat();
                            value.s_longitude = results[0].geometry.location.lng();
                            make_truck_order(data, value, truck_id);
                        });
                    }
                }
            });
        }
        function make_truck_order(data, value, truck_id) {

            var t_order_service_time = (value.t_order_service_time) ? value.t_order_service_time : 20;
            var t_start_time = (value.t_start_time) ? value.t_start_time : "08:00:00";
            t_start_time = t_start_time.split(":")[0] + ":" + t_start_time.split(":")[1];
            var trucks_orders_array_inner = [];
            var datep = $('#save_truck_date').val();
            var Date_today = new Date();
            var Date_obj = new Date(datep);
            if (dateInPast(Date_obj, Date_today)) {
                var View_only = 1;
            } else {
                var View_only = 0;
            }
            var truck_start_address = truck_end_address = truck_start_lat = truck_start_lng = "";
            if (value.s_addressline1) {
                truck_start_address += value.s_addressline1;
            }
            if (value.s_addressline2) {
                truck_start_address += ', ' + value.s_addressline2;
            }
            if (value.s_city) {
                truck_start_address += ', ' + value.s_city;
            }
            if (value.s_state) {
                truck_start_address += ', ' + value.s_state;
            }
            if (value.s_zipcode) {
                truck_start_address += ', ' + value.s_zipcode;
            }
            if (!(value.s_latitude == null || value.s_latitude == "null" || value.s_longitude == null || value.s_longitude == "null")) {
                truck_start_lat = value.s_latitude;
                truck_start_lng = value.s_longitude;
            }
            else {
                geocoder = new google.maps.Geocoder();

                geocoder.geocode({
                    'address': truck_start_address
                }, function (results, status) {
                    truck_start_lat = results[0].geometry.location.lat();
                    truck_start_lng = results[0].geometry.location.lng();
                    console.log(truck_start_lat, truck_start_lng);
                });

            }
            var time_window = '';
            var driverDetail = '';
            var helperDetail = '';
            var driverDiv = '';
            var helperDiv = '';
            if (value.driver == "") {
                if (View_only == 1) {
                    var driver_str = "";
                } else {
                    var driver_str = "<a href='Javascript:void(0)' class='add-driver-to-truck' data-truck-number='" + value.trucks_id + "'><i class='fa fa-plus'></i></a>";
                    var driverDiv = $('<a>', { class: 'add-driver-to-truck', href: 'Javascript:void(0)', 'data-truck-number': value.trucks_id }).append($('<i>', { class: 'fa fa-plus' }));
                }
            } else {
                if (View_only == 1) {
                    var driver_str = value.driver;
                    var driverDetail = value.driver;
                } else {
                    var driver_str = value.driver + " <span class='driver_status_str_" + value.trucks_id + "'></span><a href='Javascript:void(0)' class='remove-driver' data-truck-number='" + value.trucks_id + "'><i class='fa fa-trash'></i></a>";
                    driver_str += "<a href='Javascript:void(0)' class='send_d_h_sms sms_driver' data-d-h-name='" + value.driver + "' data-send-type='1' data-send-id='" + value.driver_id + "'><i class='fa fa-comment'></i></a>";
                }

            }
            if (value.helper == "") {
                if (View_only == 1) {
                    var helper_str = "";
                } else {
                    var helper_str = "<a href='Javascript:void(0)' class='add-helper-to-truck' data-truck-number='" + value.trucks_id + "'><i class='fa fa-plus'></i></a>";
                }
            } else {
                if (View_only == 1) {
                    var helper_str = value.helper;
                } else {
                    var helper_str = "<span class='helper_status_str_" + value.trucks_id + "'></span>" + value.helper + " <a href='Javascript:void(0)' class='remove-helper' data-truck-number='" + value.trucks_id + "'> <i class='fa fa-trash'></i></a>";
                    helper_str += "<a href='Javascript:void(0)' class='send_d_h_sms sms_helper' data-d-h-name='" + value.helper + "' data-send-type='2' data-send-id='" + value.helper_id + "'><i class='fa fa-comment'></i></a>";
                }

            }
            var lock_str = "";
            var is_locked = false;
            var sort_btn = "";
            var calc_time = "";
            var swap_truck = "";
            var save_single = '';
            if (!dateInPast(Date_obj, Date_today)) {
                if (value.r_is_lock == 0) {
                    var lock_str = '<i class=" fa fa-unlock fa-sm "></i>';
                    is_locked = false;
                    sort_btn = '<div class="toa-sort-orders" data-truck-number = "' + value.trucks_id + '"><small class="short-dist bg-info">Shortest Distance</small><small class="rev-route bg-info">Reverse Routes</small><small class="calc-time-truck bg-info" data-truck-id = "' + value.trucks_id + '">Calc. Time</small></div>';
                } else {
                    var lock_str = '<i class="text-danger fa fa-lock fa-sm "></i>';
                    is_locked = true;
                    locked_trucks_id.push(Number(value.trucks_id));
                    sort_btn = '<div class="toa-sort-orders" style="display: none;" data-truck-number = "' + value.trucks_id + '"><small class="short-dist bg-info">Shortest Distance</small><small class="rev-route bg-info">Reverse Routes</small><small class="calc-time-truck bg-info" data-truck-id = "' + value.trucks_id + '">Calc. Time</small></div>';
                }
                calc_time = '<i class="fa fa-clock fa-sm"></i>';
                swap_truck = '<i class="fa fa-exchange fa-sm"></i>';
                save_single = '<i class="fa fa-floppy fa-sm"></i>';
            }
            if (value.is_ended == 1) {
                var ended = '<span class="text text-danger msg_ended">(Ended)</span>';
            } else {
                var ended = "";
            }
            var current_date = moment().format('YYYY/MM/DD');
            var started_date = moment(value.started_date).format('YYYY/MM/DD');
            if (value.day_started_at != "" && value.is_ended != 1 && moment(started_date).isSame(current_date)) {
                var end_td_btn = '<a data-truck-number="' + value.trucks_id + '" class="end-day-deliveries"><i class="fa fa-power-off"></i> End todays Deliveries</a>';
            } else {
                var end_td_btn = '';
            }
            var can_assign = is_locked ? "" : "can_assign";
            var html_str = '<div class="panel panel-dark t_no_' + value.trucks_id + '" entity-id="' + value.id + '" data-is-locked="' + value.r_is_lock + '"  data-is-ended="' + value.is_ended + '" data-is-started="' + value.day_started_at + '" data-start-lat = "' + truck_start_lat + '" data-start-lng = "' + truck_start_lng + '" data-start-address = "' + truck_start_address + '"><div class="panel-heading" truck-color="' + value.t_color + '"style="background-color:' + value.t_color + '"><h3 class="panel-title truck_name_title" style="font-weight:600" >' + value.t_name + " " + ended + '</h3><ul class="pull-right truck--actions--list"><li><span class="clickable"><i class="fa fa-chevron-down fa-sm"></i></span></li></ul></div><div class="panel-heading btn-actions" truck-color="' + value.t_color + '"style="background-color:#baba9b"><ul class="truck--actions--list" style="margin-left: auto;"><li><span class=""><a class="lock-truck" title="Lock Truck" data-is-locked="' + value.r_is_lock + '" data-truck-id = "' + value.trucks_id + '" href="' + value.lock_link + '">' + lock_str + '</a></span></li><li><span class=""><a class="save-single-route" title="Save This Route" data-truck-id = "' + value.trucks_id + '" href="Javascript:void(0)">' + save_single + '</a></span></li><li style="display:none;"><span class="showMapMarkers"><i class="fa fa-map-marker" style="background: transparent; font-size: 18px; color: white;cursor:pointer;"></i></span></li><li><span class=""><a target="_blank" href="' + value.view_link + '"><i class="fa fa-eye fa-sm "></i></a></span></li><li><span style="cursor:pointer;" class="view_order_log" data-route-number="' + value.id + '" ><i class="fa fa-file fa-sm"></i></span></li><li><span class=""><a class="swap-truck" data-truck-name="' + value.t_name + '" title="Swap Truck Orders" data-truck-id = "' + value.trucks_id + '" href="Javascript:void(0)">' + swap_truck + '</a></span></li></ul></div><div class="panel-body"><ul class="truck-stats-info"><li><span>Vol: <strong><span class="t_no_' + value.trucks_id + '_vol">' + parseInt(value.Volume) + '</span>/<span class="t_no_' + value.trucks_id + '_max_vol">' + parseInt(value.max_volume) + '</span></strong></span></li><li><span>Weight: <strong><span class="t_no_' + value.trucks_id + 'wt">' + parseInt(value.weight) + '</span>/<span class="t_no_' + value.trucks_id + '_max_wt">' + parseInt(value.max_weight) + '</span></strong></span></li><li><span>Pieces: <strong><span class="t_no_' + value.trucks_id + '_pieces">' + value.pieces + '</span></strong></span></li><li></li><li><span>Driver: <strong><a class="driver-info" href="Javascript:void(0)"><i class="fa fa-user"></i> ' + driver_str + '</a></strong></span></li><li><span>Started: <strong>' + value.day_started_at + '</strong></span></li><li><span>Helper: <strong><a href="#">' + helper_str + '</a></strong></span></li><li><span>Ended at: <strong>' + value.day_ended_at + '</strong></span></li></ul><div style="display: flex;align-items: center;justify-content: space-around;" ><a id="bs" data-tr_id="' + value.tr_id + '" data-toggle="modal" data-target="#briefing_sheet_modal" class="bs-btns">Briefing Sheet</a><a style="display:none;" data-toggle="modal" data-target="#running_behind_modal" id="rb" class="bs-btns">Running Behind</a></div>' + end_td_btn + value.recent_act + sort_btn + '<ul class="truck-orders-addresses collapses ' + can_assign + ' t_o_no_' + value.trucks_id + '" data-t_order_service_time="' + t_order_service_time + '" data-t_start_time="' + t_start_time + '">';
            var i = 0;
            if (data.orders_data[truck_id].length == 0) {
                return;
            }
            var color = value.t_color;

            var auto_routes = [];
            var img_str = "";
            var order_eye = "";
            if (value.day_started_at != "") {
                get_user_status_once(value.enc_driver_id, value.trucks_id, 1);
            }
            $.each(data.orders_data[truck_id], function (key1, value1) {
                order_eye = "<a href='" + orderViewUrl + "/" + value1.o_id + "'><i class='fa fa-eye'></i></a>";
                if (value1.is_same_day > 0) {
                    img_str = "<img title='Has Same Day Delivery Orders' style='width:18px;' src='" + same_day_logo + "' >";
                } else {
                    img_str = "";
                }
                console.log('has_sameday 7: ', value1);
                if (value1.hasOwnProperty('is_cc_internally_unpaid')) {
                    if (value1.is_cc_internally_unpaid == 1) {
                        img_str += '<span class="text-red"><i class="fa fa-dollar"></i></span>';
                    }
                }
                i = i + 1;
                var customer_name = "";
                var from_terminal = to_terminal = transfer_tids = transfer_terms = "";
                var a_lat = a_lng = null;
                if (value1.order_type == "Delivery") {
                    if (!(typeof (value1.dest_company_name) == "undefined" || value1.dest_company_name == "null" || value1.dest_company_name == null || value1.dest_company_name == "")) {
                        customer_name = escapeHtmlAlternate(value1.dest_company_name);
                    }
                    var addr = '';
                    var time_window = '';
                    if (value1.dest_addressline1) {
                        addr += value1.dest_addressline1;
                    }
                    if (value1.dest_addressline2) {
                        addr += ', ' + value1.dest_addressline2;
                    }
                    if (value1.dest_city) {
                        addr += ', ' + value1.dest_city;
                    }
                    if (value1.dest_state) {
                        addr += ', ' + value1.dest_state;
                    }
                    if (value1.dest_zip) {
                        addr += ', ' + value1.dest_zip;
                    }
                    if (value1.scheduled_delivery_window) {
                        var time_window = value1.scheduled_delivery_window;
                    }

                    var type = "Delivery";
                    var type_head = "D";
                    var loc_name = value1.dest_loc_name;
                    var transfer_id = '';
                    var info_data = '';
                    info_data += '<label>' + value1.orders_id + ' ' + type_head + ' - ' + value1.dest_company_name + '</label><p>' + addr + '</p><p>' + value1.dest_contact_phone +/*'V-'+value_inner.total_cubes+' W-'+value_inner.order_weight+' P-'+value_inner.quantity+*/'</p>';
                    const infowindow1 = new google.maps.InfoWindow({
                        content: info_data,
                    });
                    if (!(value1.dest_lat == null || value1.dest_lat == "null" || value1.dest_lng == null || value1.dest_lng == "null")) {
                        a_lat = value1.dest_lat;
                        a_lng = value1.dest_lng;
                    }
                } else if (value1.order_type == "Transfer") {
                    if (!(typeof (value1.origin_company_name) == "undefined" || value1.origin_company_name == "null" || value1.origin_company_name == null || value1.origin_company_name == "")) {
                        customer_name = escapeHtmlAlternate(value1.origin_company_name);
                    }
                    var addr = '';
                    var addr1 = "";
                    var time_window = '';
                    var from_terminal = get_active_warehouse(value1.from_terminal, 'warehouse_initials');
                    var to_terminal = get_active_warehouse(value1.to_terminal, 'warehouse_initials');
                    var transfer_terms = "TID #" + value1.truck_o_t_id + " " + from_terminal + ' - ' + to_terminal;
                    var transfer_tids = "TID #" + value1.truck_o_t_id;
                    if (value1.dest_warehouse_info[0].addressline1) {
                        addr1 += value1.dest_warehouse_info[0].addressline1;
                    }
                    if (value1.dest_warehouse_info[0].addressline2) {
                        addr1 += ', ' + value1.dest_warehouse_info[0].addressline2;
                    }
                    if (value1.dest_warehouse_info[0].city) {
                        addr1 += ', ' + value1.dest_warehouse_info[0].city;
                    }
                    if (value1.dest_warehouse_info[0].state) {
                        addr1 += ', ' + value1.dest_warehouse_info[0].state;
                    }
                    if (value1.dest_warehouse_info[0].zipcode) {
                        addr1 += ', ' + value1.dest_warehouse_info[0].zipcode;
                    }
                    if (value1.dest_addressline1) {
                        addr += value1.dest_addressline1;
                    }
                    if (value1.dest_addressline2) {
                        addr += ', ' + value1.dest_addressline2;
                    }
                    if (value1.dest_city) {
                        addr += ', ' + value1.dest_city;
                    }
                    if (value1.dest_state) {
                        addr += ', ' + value1.dest_state;
                    }
                    if (value1.dest_zip) {
                        addr += ', ' + value1.dest_zip;
                    }
                    if (value1.t_sch_win) {
                        time_window = value1.t_sch_win;
                    }
                    var type = "Transfer";
                    var type_head = "T";
                    var loc_name = value1.term;
                    var transfer_id = value1.truck_o_t_id;
                    var info_data = '';
                    info_data += '<label>' + value1.orders_id + ' ' + type_head + ' [' + value1.term + '] ' + ' - ' + value1.dest_warehouse_info[0].company_name + '</label><p>' + addr1 + '</p><p>' + value1.dest_warehouse_info[0].contact_phone + '</p>';
                    const infowindow1 = new google.maps.InfoWindow({
                        content: info_data,
                    });
                    if (!(value1.dest_warehouse_info[0].lat == null || value1.dest_warehouse_info[0].lat == "null" || value1.dest_warehouse_info[0].lng == null || value1.dest_warehouse_info[0].lng == "null")) {
                        a_lat = value1.dest_warehouse_info[0].lat;
                        a_lng = value1.dest_warehouse_info[0].lng;
                    }
                } else {
                    if (!(typeof (value1.origin_company_name) == "undefined" || value1.origin_company_name == "null" || value1.origin_company_name == null || value1.origin_company_name == "")) {
                        customer_name = escapeHtmlAlternate(value1.origin_company_name);
                    }
                    var addr = '';
                    var time_window = '';
                    if (value1.origin_addressline1) {
                        addr += value1.origin_addressline1;
                    }
                    if (value1.origin_addressline2) {
                        addr += ', ' + value1.origin_addressline2;
                    }
                    if (value1.origin_city) {
                        addr += ', ' + value1.origin_city;
                    }
                    if (value1.origin_state) {
                        addr += ', ' + value1.origin_state;
                    }
                    if (value1.origin_zip) {
                        addr += ', ' + value1.origin_zip;
                    }
                    if (value1.scheduled_pickup_window) {
                        time_window = value1.scheduled_pickup_window;
                    }
                    var type = "Pickup";
                    var type_head = "P";
                    var loc_name = value1.origin_loc_name;
                    var transfer_id = '';
                    var info_data = '';
                    info_data += '<label>' + value1.orders_id + ' ' + type_head + ' - ' + value1.origin_company_name + '</label><p>' + addr + '</p><p>' + value1.origin_contact_phone + '</p>';
                    const infowindow1 = new google.maps.InfoWindow({
                        content: info_data,
                    });
                    if (!(value1.origin_lat == null || value1.origin_lat == "null" || value1.origin_lng == null || value1.origin_lng == "null")) {
                        a_lat = value1.origin_lat;
                        a_lng = value1.origin_lng;
                    }
                }
                var text_color = getTextColor(color);
                if (a_lat == null || a_lat == "null" || a_lng == null || a_lng == "null") {
                } else {
                    var lat = a_lat;
                    var lng = a_lng;
                    var obj = {
                        lat,
                        lng
                    };
                    auto_routes[value1.stop_num - 1] = (obj);
                }
                trucks_orders_array_inner.push({
                    'id': value1.orders_id,
                    'address': addr,
                    'window': time_window,
                    'type': type,
                    'transfer_id': transfer_id,
                    'truck_order_id': value1.truck_order_id,
                    'coordinates': obj,
                    'color': color,
                    'info_window_data': info_data,
                    'is_locked': value.r_is_lock,
                });
                var datep = $('#save_truck_date').val();
                var Date_today = new Date();
                var Date_obj = new Date(datep);
                var status_str = "";
                var no_move = 0;
                if (value.day_started_at != "") {
                    no_move = 1;
                }
                var delivered_qty = "";
                var tranfered_qty = "";
                var class_status_str = "btn-success";
                if (value1.qty_for_delivery != "" && value1.to_type != 3 && value1.qty_for_delivery != value1.quantity) {
                    delivered_qty = '(' + value1.qty_for_delivery + '/' + value1.quantity + ')';
                    class_status_str = 'btn-danger';
                }
                else if (value1.transferred_items != "" && value1.to_type == 3 && value1.transferred_items != value1.transfered_qty) {
                    tranfered_qty = '(' + value1.transferred_items + '/' + value1.transfered_qty + ')';
                    class_status_str = 'btn-danger';
                }
                switch (value1.tr_o_status) {
                    case TRUCK_ORDER_STATUS.SCHEDULED:
                        status_str = "<span class='badge btn-primary status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.SCHEDULED] + "</b></span>";
                        break;
                    case TRUCK_ORDER_STATUS.IN_TRANSIT:
                        status_str = "<span class='badge btn-warning status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.IN_TRANSIT] + "</b></span>";
                        break;
                    case TRUCK_ORDER_STATUS.ARRIVED:
                        status_str = "<span class='badge status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.ARRIVED] + "</b></span>";
                        break;
                    case TRUCK_ORDER_STATUS.UNLOADED:
                        status_str = "<span style='color:#cc0099' class='status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.UNLOADED] + "</b></span>";
                        break;
                    case TRUCK_ORDER_STATUS.LOADED:
                        status_str = "<span style='color:#cc0099' class='status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.LOADED] + "</b></span>";
                        break;
                    case TRUCK_ORDER_STATUS.FINISHED:
                        status_str = "<span class='badge " + class_status_str + " status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.FINISHED] + delivered_qty + tranfered_qty + "</b></span>";
                        break;
                    case TRUCK_ORDER_STATUS.CANCELLED:
                        status_str = "<span class='badge btn-danger status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.CANCELLED] + "</b></span>";
                        break;
                    case TRUCK_ORDER_STATUS.UNABLE_TO_COMPLETE:
                        status_str = "<span class='badge btn-danger status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.UNABLE_TO_COMPLETE] + "</b></span>";
                        break;
                    default:
                        status_str = "<span class='badge btn-primary status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.SCHEDULED] + "</b></span>";
                }
                if (value1.order_status == ORDER_STATUS.DELIVERED) {
                    var order_total_quantity = parseInt(value1.quantity);
                    var total_deliverd_quant = parseInt(value1.total_item_delivered);
                    if (total_deliverd_quant != order_total_quantity) {
                        status_str = "<span class='badge btn-danger status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.FINISHED] + "</b>(" + total_deliverd_quant + "/" + order_total_quantity + ")</span>";
                    } else {
                        status_str = "<span class='badge btn-success status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.FINISHED] + "</b></span>";
                    }
                }
                if (value1.order_status == TRUCK_ORDER_STATUS.CANCELLED) {
                    status_str = "<span class='badge btn-danger status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.CANCELLED] + "</b></span>";
                }
                if (dateInPast(Date_obj, Date_today)) {
                    var View_only = 1;
                } else if (value1.is_not_movable == 1) {
                    var View_only = 2;
                } else {
                    var View_only = 0;
                }

                if (View_only == 0) {
                    var li_class = "";
                    if (no_move == 1) {
                        var show_unassign = (is_locked) ? "none" : "";
                        if (value1.tr_o_status == TRUCK_ORDER_STATUS.FINISHED) {
                            var li_class = "sorting-disabled";
                            var html_button = '<div class="dropdown"><button class="btn btn-sm btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><i class="fa fa-ellipsis-h"></i></button><ul class="dropdown-menu dropdown-menu-right"><li><a class="edit_order_info" data-truck-number="' + value.trucks_id + '"  data-order-number="' + value1.t_o_id + type_head + transfer_id + '" data-transfer-id = "' + value1.transfer_id + '" data-truck-order = "' + value1.truck_order_id + '" href="Javascript:void(0)">Edit Order Info</a></li></ul></div>';
                        } else {
                            var html_button = '<div class="dropdown"><button class="btn btn-sm btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><i class="fa fa-ellipsis-h"></i></button><ul class="dropdown-menu dropdown-menu-right"><li><a class="edit_order_info" data-truck-number="' + value.trucks_id + '"  data-order-number="' + value1.t_o_id + type_head + transfer_id + '" data-transfer-id = "' + value1.transfer_id + '" data-truck-order = "' + value1.truck_order_id + '" href="Javascript:void(0)">Edit Order Info</a></li><li><a class="unassign_button" data-stop_num="' + key1 + '" style="display:' + show_unassign + '" data-truck-number="' + value.trucks_id + '" data-order-number="' + value1.t_o_id + type_head + transfer_id + '" data-loc="' + loc_name + '"  data-transfer-id = "' + value1.transfer_id + '" data-addr-unassign="' + addr + '" data-addr-unassign_warehouse="' + addr1 + '" href="Javascript:void(0)">Unassign</a></li></ul></div>';
                        }

                    } else {
                        var show_unassign = (is_locked) ? "none" : "";
                        var html_button = '<div class="dropdown"><button class="btn btn-sm btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><i class="fa fa-ellipsis-h"></i></button><ul class="dropdown-menu dropdown-menu-right"><li><a class="move_button" style="display:' + show_unassign + '" data-truck-number="' + value.trucks_id + '" data-order-number="' + value1.t_o_id + type_head + transfer_id + '" data-loc="' + loc_name + '" data-transfer-id = "' + value1.transfer_id + '" href="Javascript:void(0)">Move</a></li><li><a class="edit_order_info" data-truck-number="' + value.trucks_id + '"  data-order-number="' + value1.t_o_id + type_head + transfer_id + '" data-transfer-id = "' + value1.transfer_id + '" data-truck-order = "' + value1.truck_order_id + '" href="Javascript:void(0)">Edit Order Info</a></li><li><a class="unassign_button" data-stop_num="' + key1 + '" style="display:' + show_unassign + '" data-truck-number="' + value.trucks_id + '" data-order-number="' + value1.t_o_id + type_head + transfer_id + '"data-transfer-id = "' + value1.transfer_id + '" data-loc="' + loc_name + '" data-addr-unassign_warehouse="' + addr1 + '" data-addr-unassign="' + addr + '" href="Javascript:void(0)">Unassign</a></li></ul></div>';
                    }
                    if (value1.tr_o_status == TRUCK_ORDER_STATUS.CANCELLED) {
                        li_class = 'sorting-disabled';
                        var html_button = '';
                    }
                } else if (View_only == 2) {
                    var li_class = "sorting-disabled";
                    var html_button = '<div class="dropdown"><button class="btn btn-sm btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><i class="fa fa-ellipsis-h"></i></button><ul class="dropdown-menu dropdown-menu-right"><li><a class="view_order_info" data-truck-number="' + value.trucks_id + '"  data-order-number="' + value1.t_o_id + type_head + transfer_id + '" data-transfer-id = "' + value1.transfer_id + '" data-truck-order = "' + value1.truck_order_id + '" href="Javascript:void(0)">Edit Order Info</a></li></ul></div>';
                    if (value1.order_status == ORDER_STATUS.CANCELLED) {
                        if (value1.to_type == 3) {
                            switch (value1.tr_o_status) {
                                case TRUCK_ORDER_STATUS.SCHEDULED:
                                    status_str = "<span class='badge btn-primary status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.SCHEDULED] + "</b></span>";
                                    break;
                                case TRUCK_ORDER_STATUS.IN_TRANSIT:
                                    status_str = "<span class='badge btn-warning status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.IN_TRANSIT] + "</b></span>";
                                    break;
                                case TRUCK_ORDER_STATUS.ARRIVED:
                                    status_str = "<span class='badge status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.ARRIVED] + "</b></span>";
                                    break;
                                case TRUCK_ORDER_STATUS.UNLOADED:
                                    status_str = "<span style='color:#cc0099' class='status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.UNLOADED] + "</b></span>";
                                    break;
                                case TRUCK_ORDER_STATUS.LOADED:
                                    status_str = "<span style='color:#cc0099' class='status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.LOADED] + "</b></span>";
                                    break;
                                case TRUCK_ORDER_STATUS.FINISHED:
                                    status_str = "<span class='badge btn-success status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.FINISHED] + "</b></span>";
                                    break;
                                case TRUCK_ORDER_STATUS.CANCELLED:
                                    status_str = "<span class='badge btn-danger status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.CANCELLED] + "</b></span>";
                                    break;
                                case TRUCK_ORDER_STATUS.UNABLE_TO_COMPLETE:
                                    status_str = "<span class='badge btn-danger status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.UNABLE_TO_COMPLETE] + "</b></span>";
                                    break;
                                default:
                                    status_str = "<span class='badge btn-primary status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.SCHEDULED] + "</b></span>";
                            }
                        } else {
                            var status_str = "<span class='badge btn-danger status_str'><b>" + REVERSAL_TRUCK_ORDER_STATUS[TRUCK_ORDER_STATUS.CANCELLED] + "</b></span>";
                        }
                    } else {
                        if (value1.order_status == ORDER_STATUS.DELIVERED) {
                            var order_total_quantity = parseInt(value1.quantity);
                            var total_deliverd_quant = parseInt(value1.total_item_delivered);
                            if (total_deliverd_quant != order_total_quantity) {
                                status_str = "<span class='badge btn-danger status_str'><b>Finished </b>(" + total_deliverd_quant + "/" + order_total_quantity + ")</span>";
                            } else {
                                status_str = "<span class='badge btn-success status_str'><b>Finished</b></span>";
                            }
                        } else {
                            var status_str = "";
                        }
                    }
                } else {
                    var li_class = "sorting-disabled";
                    var html_button = "";
                }
                if (is_locked) {
                    var li_class = "sorting-disabled";
                }
                var order_notify = '';
                if (value1.call_ahead_status == CALL_AHEAD_STATUS.CONFIRMED) {
                    order_notify = '<p class="toa-customer_status small text-success">Order Notification : Confirmed <i class="fa fa-check"></i></p>';
                }
                var act_win = "";
                var late_by = "";
                html_str = html_str + '<li class="' + li_class + ' truck_ord_list " order_lat="' + a_lat + '" order_lng="' + a_lng + '" truck_o_' + value.trucks_id + ' truck_ord_list" id="t_o_' + value1.t_o_id + type_head + transfer_id + '" truck_order_id="' + value1.truck_order_id + '" truck_tids="' + transfer_tids + '" truck_route_id="' + value1.truck_routes_id + '" data-pieces="' + value1.quantity + '" data-cubes-vol=' + value1.total_cubes + ' data-weight="' + value1.order_weight + '" data-loc="' + loc_name + '" class="truck_ord_list">' + html_button + '<p class="toa-order-by"><span class = "sr-no">' + (i) + '. </span><span class = "order_no">' + value1.t_o_id + '</span>' + '<span class="order-type">' + type_head + '</span>' + ' - <span class="order-company-name">' + customer_name + " " + img_str + ' ' + order_eye + '</span></p><p class="small"><b> ' + transfer_terms + '</b></p><p class="toa-order-address small text-muted">' + addr + '</p><p class="toa-order-time small text-muted" data-transfer = "' + transfer_id + '">' + time_window + '</p>' + order_notify + status_str + '<input type="hidden" id="t_o_json_' + value1.t_o_id + type_head + transfer_id + '" data-transfer=' + value1.transfer_id + ' value=\'' + parsejson(value1) + '\'map_info="' + value1.t_o_id + type_head + ' - ' + customer_name + '">';
                var status_finished = TRUCK_ORDER_STATUS.FINISHED;
                var status_arrived = TRUCK_ORDER_STATUS.ARRIVED;
                var id_string = '#t_o_' + value1.t_o_id + type_head + transfer_id;
                if (value.day_started_at != "") {
                    if (value1.tr_o_status != status_finished && value1.tr_o_status != status_arrived) {
                        // console.log()
                        make_start_marker(a_lat, a_lng, false, i, value.t_color, value.t_name);
                        li_id.push(id_string)
                    }
                }
                if (value1.tr_o_status == status_finished) {
                    if (type_head == "P") {
                        if (value1.actual_pickup_window) {
                            act_win = "Actual Win:<br>" + value1.actual_pickup_window;
                        }
                    } else {
                        if (type_head == "D") {
                            if (value1.actual_delivery_window) {
                                act_win = "Actual Win:<br> " + value1.actual_delivery_window;
                            }
                        }
                    }
                }
                html_str += '<span class="eta-text-arr small text-muted">' + act_win + '</span><span class="eta-text small text-muted"></span><br><span class="late-text small text-muted">' + late_by + '</span></li>';
            });
            var t_lines_coords = {
                'lines': auto_routes,
                'color': color
            }
            $gl_line_coords.push(t_lines_coords);

            html_str = html_str + '</ul></div></div>';
            truck_route_number_polyline(truck_id);

            $('.t_no_' + truck_id).replaceWith(html_str);
            var datep = $('#save_truck_date').val();
            var Date_today = new Date();
            var Date_obj = new Date(datep);
            if (!dateInPast(Date_obj, Date_today)) {
                $('.t_o_no_' + truck_id).sortable({
                    connectWith: ".collapses.can_assign",
                    containment: "body",
                    dropOnEmpty: true,
                    scroll: false,
                    cancel: ".sorting-disabled",
                    update: function (event, ui) {
                        change_trucks_orders(truck_id);
                        truck_route_number_polyline(truck_id);
                        console.log("CHeck3");
                        $('#changed').val(1)
                    }
                });
            }
            get_user_status_d(value.enc_driver_id, truck_id, 1);
            get_user_status_d(value.enc_helper_id, truck_id, 2);
            var onUser_Online = ref($fbDatabase, 'userStatus/' + value.enc_driver_id);
            onUser_Online.on('value', function (snapshot) {
                get_user_status_d(value.enc_driver_id, truck_id, 1);
                get_user_status_d(value.enc_helper_id, truck_id, 2);
            });
            class_str = '.t_no_' + truck_id;

            if (value.day_started_at != "") {
                get_eta(class_str, li_id, value.is_ended);
                li_id = [];
            }

            gl_make_lines_on_gmap();
        }

        $(document).on('click', '.add-driver-to-truck', function () {
            $('#assign_driver_modal').modal('show');
            $('.unassigned_drivers').empty();
            $('.trucks-id-drivers').val($(this).attr('data-truck-number'));
        });
        $('.unassigned_drivers').select2({
            dropdownParent: $("#assign_driver_modal"),
            placeholder: "--Select a Driver--",
            ajax: {
                url: dashboardDriverListSelect2Url,
                error: function (jqXHR, exception) {
                    active_xhr = false;
                },
                data: function (params) {
                    var query = {
                        term: params.term,
                        page: params.page || 1,
                        size: 10,
                        date: $('#save_truck_date').val(),
                        exclude_users: drivers_json,
                        u_roles: [ROLES.DRIVER],
                        u_with_roles: false
                    }
                    return query;
                },
                processResults: function (data, params) {
                    return {
                        results: data.results,
                        pagination: {
                            more: data.pagination.more
                        }
                    };
                }
            }
        });
        $(document).on('click', ".view_order_info", function () {
            $('.view_order').trigger('click');
            $('#requested_window_view').val("");
            $('#order_actual_date_view').val("");
            $('#actual_window_view').val("");
            $('#order_sch_date_view').val("");
            var order_id = $(this).attr('data-order-number');
            var type = $('#t_o_' + order_id).find('.order-type').html();
            $.ajax({
                type: 'GET',
                url: orderScheduleInfoUrl + "/" + order_id,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content'),
                    'X-CSRF-TOKEN': $('input[name="_token"]').val()
                },
                success: function (result) {
                    if (type == "D") {
                        $('#order_id').val(result.data.o_id);
                        $('#order_type').val("Delivery");
                        if (result.data.scheduled_delivery_date != null) {
                            var sch_date = moment(result.data.scheduled_delivery_date).format('MM/DD/YYYY');
                            $('#order_sch_date_view').html(sch_date);
                        }
                        if (result.data.scheduled_delivery_window != null) {
                            var window = result.data.scheduled_delivery_window;
                            $('#requested_window_view').val(window);
                        }
                        if (result.data.actual_delivery_date) {
                            var sch_date = moment(result.data.actual_delivery_date).format('MM/DD/YYYY');
                            $('#order_actual_date_view').val(sch_date);
                        }
                        if (result.data.actual_delivery_window != null) {
                            var window = result.data.actual_delivery_window;
                            $('#actual_window_view').val(window);
                        }
                    } else {
                        $('#order_id').val(result.data.o_id);
                        $('#order_type').val("Pickup");
                        if (result.data.scheduled_pickup_date != null) {
                            var sch_date = moment(result.data.scheduled_pickup_date).format('MM/DD/YYYY');
                            $('#order_sch_date_view').html(sch_date);
                        }
                        if (result.data.scheduled_pickup_window != null) {
                            var window = result.data.scheduled_pickup_window;
                            $('#requested_window_view').val(window);
                        }
                        if (result.data.actual_pickup_date != null) {
                            var sch_date = moment(result.data.actual_pickup_date).format('MM/DD/YYYY');
                            $('#order_actual_date_view').val(sch_date);
                        }
                        if (result.data.actual_pickup_window != null) {
                            var window = result.data.actual_pickup_window;
                            $('#actual_window_view').val(window);
                        }
                    }
                },
                error: function (data) {
                    console.log('error', data);
                }
            });
        });
        $(document).on('click', '.remove_ended', function () {
            $("#route_ended").modal("show");
            $('#truck_id_rm_end').val($(this).attr('data-truck-number'));
            $('#route_id_rm_end').val($(this).attr('data-route-number'));
            $(this).find('.eta-text').show()
        });
        $(document).on('click', '.rev-route', function (e) {
            var current_target = e.target;
            var truck_number = $(current_target).parent().attr('data-truck-number');

            reverse_routing(truck_number);

            $('#changed').val(1)
            var truck_order_list = $('.t_o_no_' + truck_number).find('.truck_o_' + truck_number);
            $($(truck_order_list).get().reverse()).each(function (k, v) {
                var firstChild = $(v).find('.toa-order-by');
                $(v).find('.toa-order-by').find('.sr-no').html((k + 1) + ". ");
                $('.t_o_no_' + truck_number).append(v);
            });
            truck_order_list = $('.t_o_no_' + truck_number).find('.truck_o_' + truck_number);
            truck_route_number_polyline(truck_number);
        });
        var url = uploadDtImageUrl;
        var uploadButton = $('<button/>')
            .addClass('btn btn-primary')
            .prop('disabled', true)
            .text('Processing...')
            .on('click', function () {
                var $this = $(this),
                    data = $this.data();
                $this
                    .off('click')
                    .text('Abort')
                    .on('click', function () {
                        $this.remove();
                        data.abort();
                    });
                data.submit().always(function () {
                    $this.remove();
                });
            });
        $(document).on('click', '.close_image_modal', function () {
            $("#end_route_del").modal("show");
            make_list_of_orders_without_images();
        });
        $(document).on('click', '#btn_cnf_change', function () {
            var formData = new FormData();
            formData.append('route_id', $('#route_id_rm_end').val());
            var truck_id = $('#truck_id_rm_end').val();
            $.ajax({
                type: 'POST',
                url: removeEndedFlagUrl,
                processData: false,
                contentType: false,
                data: formData,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content'),
                    'X-CSRF-TOKEN': $('input[name="_token"]').val()
                },
                success: function (result) {
                    showFlashModal(result.status, result.message);
                    refresh_trucks(window.lsData['date']);
                },
                error: function (data) {
                    console.log('error', data);
                }
            });
        });
        $(document).on('click', ".unassign_button1", function () {
            var order_number = $(this).attr("data-order-number");
            if (confirm("Are you sure you want to unassign order " + order_number + "?")) {
                var order_number = $(this).attr("data-order-number");
                var truck_number = $(this).attr("data-truck-number")
                unassign_orders(order_number, truck_number);
                truck_number = $('#truck-options-assign').val();
                var date = $('#save_truck_date').val();
                $.ajax({
                    type: "GET",
                    cache: false,
                    async: false,
                    url: truckDetailsUrl + "/" + truck_number + "/" + date,
                    success: function (data) {
                        var div_length = $('.trucks_div').children('div').length;
                        var weight = 0;
                        var cubes = 0;
                        $.each(orders_json[order_number], function (key, value) {
                            weight = weight + parseInt(value.order_weight);
                            cubes = cubes + parseInt(value.total_cubes);
                        });
                        var location = $('#truck_loc_key').val();
                        var loc_weight = 0;
                        var loc_cubes = 0;
                        var used_vol = $('.t_no_' + truck_number + '_vol').html();
                        if (typeof used_vol == 'undefined') {
                            used_vol = 0;
                        }
                        $.each($('#orders-accordion').children(), function (key, value) {
                            if ($(value).find('.assign-order-to-truck').attr('data-loc-key') == location) {
                                loc_weight = $(value).find('.assign-order-to-truck').attr('data-total-weight');
                                loc_cubes = $(value).find('.assign-order-to-truck').attr('data-total-cubes');
                                return false;
                            }
                        });
                        OpenSelectionModal(location, data.data, loc_weight, loc_cubes, data.data.max_weight - weight, data.data.max_volume - used_vol);
                    }
                });
            } else {
                return false;
            }
        });
    });


    function containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i].lat === obj.lat && list[i].lng === obj.lng) {
                return i;
            }
        }
        return false;
    }

    function make_lines_on_gmap(route_coords = [], color = '0088FF') {
        coords_to_use = [];
        return false;
        for (var i = 0; i < route_coords.length; i++) {
            if (route_coords[i].lat == null || route_coords[i].lng == null) {
                continue;
            }
            coords_to_use.push(route_coords[i]);
            var text_color = getTextColor(color);
            var stop = i + 1;
            var marker = google.maps.marker.AdvancedMarkerElement({
                position: new google.maps.LatLng(route_coords[i].lat, route_coords[i].lng),
                map: map,
                label: {
                    color: "#" + text_color,
                    text: "" + (stop),
                    fontSize: "12px"
                },
                icon: pinSymbol(color)
            });
        }
        if (coords_to_use.length > 0) {
            var line = new google.maps.Polyline({
                path: coords_to_use,
                geodesic: true,
                strokeColor: color,
                strokeOpacity: 1.0,
                strokeWeight: 4
            });
            line.setMap(map);
        }
    }

    function gl_make_lines_on_gmap() {
        if ($gl_line_coords.length > 0) {
            for (var j = 0; j < $gl_line_coords.length; j++) {
                var l_obj = $gl_line_coords[j];
                var lines = l_obj.lines;
                var color = l_obj.color;
                make_lines_on_gmap(lines, color);
            }
        }
    }

    function check_transfer_completed(transfer_id) {
        return $.ajax({
            url: checkTransferCompletedUrl,
            type: "GET",
            async: false,
            data: {
                'transfer_id': transfer_id
            },
            success: function (e) {
            }
        });
    }


    async function check_drag_marker_ending(marker, finalLat, finalLng) {
        const finalPos = new google.maps.LatLng(finalLat, finalLng);
        var leastDist = 999999999999999;
        var t_id = null;
        var baseDistance = 30000;
        var currentZoom = map.getZoom();
        var baseZoom = 5;
        // const dynamicRadius = (baseDistance)*Math.sqrt(baseZoom/currentZoom);
        const dynamicRadius = 7 * 156543.03392 * Math.cos(34.0522 * Math.PI / 180) / Math.pow(2, currentZoom)
        // console.log(dynamicRadius);
        $.each(route_markers, function (k, v) {
            $.each(v, function (k1, v1) {
                const markerLatlng = v1.getPosition();
                const distance = google.maps.geometry.spherical.computeDistanceBetween(finalPos, markerLatlng);
                // console.log(`marker distance : ${distance} ,  dynamic radius ${dynamicRadius}`)
                if (distance <= dynamicRadius && distance < leastDist) { // dynamic radius in meters. Radius in which 
                    const latlng = `${markerLatlng.lat()},${markerLatlng.lng()}`;
                    leastDist = distance;
                    t_id = k;
                }
            });
        });

        if (t_id != null) {
            assign_marker_to_selected_truck(marker, t_id);
        }
    }

    async function assign_marker_to_selected_truck(marker, t_id = null) {
        showLoading("dispatchDashboard_box", '#');
        console.log('x1');
        $.each($('.assign_butns'), function (ke, va) {
            var cnt = $(va).attr('data-cnt');
            var city_key = $(va).attr('data-loc-key');
            if ($('#tab1button').parent('.route_type_order_list').hasClass('active') == true) {
                if (!cnt.includes("t")) {
                    num_sidebar_data[city_key] = cnt;
                }
            }
            else {
                if (cnt.includes("t")) {
                    num_sidebar_data[city_key] = cnt;
                }
            }
        });
        // jsonNum = JSON.stringify(num);
        var get_t_id = null;
        if (t_id != null)
            get_t_id = t_id;
        else
            get_t_id = $(".marker_selected_truck_class.marker_truck_selected").attr('data-t-id');
        // console.log(get_t_id);
        const isLockedElement = document.getElementsByClassName('t_no_' + get_t_id);
        if (isLockedElement[0] == undefined) {
            canAssign = true
        } else {
            var isLocked = isLockedElement[0].getAttribute('data-is-locked');
            canAssign = (isLocked === '1') ? false : true;
        }
        if (get_t_id && canAssign) {
            const targetLat = marker.getPosition().lat();
            const targetLng = marker.getPosition().lng();

            const targetLatlng = new google.maps.LatLng(targetLat, targetLng);

            const markers = individual_markers;
            var matchingMarkers = [];
            markers.forEach((marker, key) => {
                const markerLatlng = marker.getPosition();
                const distance = google.maps.geometry.spherical.computeDistanceBetween(targetLatlng, markerLatlng);

                if (distance <= 1000) { // 1 Km in meters. Radius in which 
                    const latlng = `${markerLatlng.lat()},${markerLatlng.lng()}`;
                    matchingMarkers = matchingMarkers || [];
                    matchingMarkers.push(marker);
                }
            });
            ok_markers_routed = [];

            $.each(matchingMarkers, function (k1, v1) {
                var index = Object.keys(individual_markers).findIndex(function (key) {
                    return individual_markers[key] === v1;
                });
                if (index != undefined)
                    ok_markers_routed.push(index.toString());
            });
            await assign_order_for_polyline(get_t_id);
        } else if (!get_t_id) {
            $("#truck_error_polyline").html("Please select truck to assign orders.");
            $(".polyline_assign_button").prop("disabled", true);
            showFlashModal(false, "Please select truck from above truck list to assign orders.");
        } else {
            showFlashModal(false, "Please select another truck from above truck list as this truck's route is locked.");
        }
        hideLoading("dispatchDashboard_box", '#');
    }

    function OpenSelectionModal(location, truck_data, order_weight, order_cubes, remaining_weight, remaining_cubes) {
        $('.select-orders-content').show();
        $('#select_orders_button').show();
        $('#assign_button').hide();
        $(".rem_vol").html(remaining_cubes);
        $(".rem_wt").html(remaining_weight);
        $(".selection-truck-name").html(truck_data.t_name);
        $('.location_name_select_orders').html(location);
        $('#location_key_select_orders').val(location);
        $('#truck_id_select_orders').val(truck_data.t_id);
        $('.truck_max_weight').html(truck_data.max_weight);
        $('.truck_max_volume').html(truck_data.max_volume);
        $('#has_same_p_d_trucks').val(0);
        var orders_str = "<div class='col-sm-12 col-xs-12'><input type='checkbox' id='order-selection-select-all' class='order-selection-select-all'> <label for='order-selection-select-all' ><b>Select All</b></label></div>";
        var checked_weight = 0;
        var checked_volume = 0;
        var all_clean = 1;
        if (location.indexOf("|") == -1) {
            $.each(orders_json[location], function (key, value) {
                var dateC = $('#save_truck_date').val();
                var account_name = "";
                if (!(typeof (value.u_name) == "undefined" || value.u_name == "null" || value.u_name == null || value.u_name == "")) {
                    account_name = value.u_name;
                }
                if (account_name) {
                    account_name = escapeHtmlAlternate(account_name);
                }
                var customer_name = account_name;
                if (value.order_type == "Pickup") {
                    var type = "P";
                    if (!(typeof (value.origin_company_name) == "undefined" || value.origin_company_name == "null" || value.origin_company_name == null || value.origin_company_name == "")) {
                        customer_name = escapeHtmlAlternate(value.origin_company_name);
                    }
                } else if (value.order_type == "Transfer") {
                    var type = "T";
                    if (!(typeof (value.origin_company_name) == "undefined" || value.origin_company_name == "null" || value.origin_company_name == null || value.origin_company_name == "")) {
                        customer_name = escapeHtmlAlternate(value.origin_company_name);
                    }
                } else {
                    var type = "D";
                    if (!(typeof (value.dest_company_name) == "undefined" || value.dest_company_name == "null" || value.dest_company_name == null || value.dest_company_name == "")) {
                        customer_name = escapeHtmlAlternate(value.dest_company_name);
                    }
                }
                var image_str = "";
                if (value.is_same_day == 1) {
                    image_str += "<img title='Is a Same Day Delivery Order' style='width:25px;' src='" + same_day_logo + "' >";
                }
                if (value.hasOwnProperty('is_cc_internally_unpaid')) {
                    if (value.is_cc_internally_unpaid == 1) {
                        image_str += '<span class="text-red"><i class="fa fa-dollar"></i></span>';
                    }
                }
                if (checked_weight + parseInt(value.order_weight) > remaining_weight || checked_volume + parseInt(value.total_cubes) > remaining_cubes) {
                    var checked = "";
                } else {
                    var checked = "checked";
                    checked_weight = checked_weight + parseInt(value.order_weight);
                    checked_volume = checked_volume + parseInt(value.total_cubes);
                    var rem_wt_after = parseInt($(".rem_wt").html());
                    var rem_vol_after = parseInt($(".rem_vol").html());
                    $(".rem_vol").html(rem_vol_after - parseInt(value.total_cubes));
                    $(".rem_wt").html(rem_wt_after - parseInt(value.order_weight));
                }
                var remove_pickup_str = "";
                if (type == "D") {
                    if (value.is_same_day == 1) {
                        // Find if the Pickup is assigned to the selected truck?
                        var jjs = $('#t_o_json_' + value.o_id + 'P').val();
                        if (typeof jjs != "undefined") {
                            var truck_id = $('#t_o_json_' + value.o_id + 'P').parent().find('.unassign_button').attr('data-truck-number');
                            var truck_name = $('#t_o_json_' + value.o_id + 'P').parent().parent().parent().parent().find('.panel-title').text();
                            if (typeof truck_id == 'undefined') {
                                var truck_id1 = $('#t_o_' + value.o_id + 'P').parent().parent().find(".toa-sort-orders").attr("data-truck-number");
                                if (truck_id1 != truck_data.t_id) {
                                    $('#has_same_p_d_trucks').val(1);
                                }
                            }
                            else if (truck_id != truck_data.t_id && typeof truck_id != 'undefined') {
                                remove_pickup_str = "<span class='text text-danger'>Pickup of This Truck assigned to: " + truck_name + " <a href='Javascript:void(0)' class='unassign_button1' data-truck-number='" + truck_id + "' data-order-number='" + value.o_id + 'P' + "'><i class='fa fa-trash'></i> Remove </a></span>";
                                $('#has_same_p_d_trucks').val(1);
                            }
                        }
                        // Find What truck the pickup is assigned to and create the string to unassign it from that 
                        // truck and show the checkbox to attached it with this order
                    }
                    if (value.not_deliverable_rows == 0 || value.is_same_day == 1) {
                        var disabled = "";
                        var is_same_day = 1;
                    } else {
                        var disabled = "disabled";
                        var is_same_day = 0;
                        checked = "";
                        checked_weight = checked_weight - parseInt(value.order_weight);
                        checked_volume = checked_volume - parseInt(value.total_cubes);
                        var rem_wt_after = parseInt($(".rem_wt").html());
                        var rem_vol_after = parseInt($(".rem_vol").html());
                        $(".rem_vol").html(rem_vol_after + parseInt(value.total_cubes));
                        $(".rem_wt").html(rem_wt_after + parseInt(value.order_weight));
                        all_clean = 0;
                    }
                } else {
                    if (value.not_pickupable_rows == 0 || value.is_same_day == 1) {
                        var disabled = "";
                        var is_same_day = 1;
                    } else {
                        var disabled = "disabled";
                        var is_same_day = 0;
                        checked = "";
                        checked_weight = checked_weight - parseInt(value.order_weight);
                        checked_volume = checked_volume - parseInt(value.total_cubes);
                        var rem_wt_after = parseInt($(".rem_wt").html());
                        var rem_vol_after = parseInt($(".rem_vol").html());
                        $(".rem_vol").html(rem_vol_after + parseInt(value.total_cubes));
                        $(".rem_wt").html(rem_wt_after + parseInt(value.order_weight));
                        all_clean = 0;
                    }
                }
                if (type == "T") {
                    var trnfr_id = value.transfer_id;
                    var transfer_html = "<span class='small' style='color:red'>TID #" + trnfr_id + "</span>";
                } else {
                    var trnfr_id = "";
                    var transfer_html = "";
                }
                orders_str = orders_str + "<div class='col-sm-6 col-xs-12'><input " + disabled + " type='checkbox' data-is-same-day='" + is_same_day + "' id='check" + value.o_id + type + trnfr_id + "' class='order-seleection-check' " + checked + " data-order-id='" + value.o_id + type + trnfr_id + "' data-cubes='" + value.total_cubes + "' data-weight='" + value.order_weight + "' data-loc='" + location + "' style='display:inline-block'> " + image_str + " <label for='check" + value.o_id + type + trnfr_id + "' style='display:contents'>" + value.o_id + " " + type + " - <b>" + customer_name + "</b> (Wgt.:" + value.order_weight + ", Vol.:" + value.total_cubes + ", Pcs.:" + value.quantity + ") " + transfer_html + "</label>" + remove_pickup_str + "</div>";
            });
        } else {
            var array = location.split("|");
            $.each(array, function (key, value_loc) {
                if (key == 0) {
                    return true;
                }
                $.each(orders_json[value_loc], function (key, value) {
                    var dateC = $('#save_truck_date').val();
                    var account_name = "";
                    if (!(typeof (value.u_name) == "undefined" || value.u_name == "null" || value.u_name == null || value.u_name == "")) {
                        account_name = value.u_name;
                    }
                    if (account_name) {
                        account_name = escapeHtmlAlternate(account_name);
                    }
                    var customer_name = account_name;
                    if (value.order_type == "Pickup") {
                        var type = "P";
                        if (!(typeof (value.origin_company_name) == "undefined" || value.origin_company_name == "null" || value.origin_company_name == null || value.origin_company_name == "")) {
                            customer_name = escapeHtmlAlternate(value.origin_company_name);
                        }
                    } else if (value.order_type == "Transfer") {
                        var type = "T";
                        if (!(typeof (value.origin_company_name) == "undefined" || value.origin_company_name == "null" || value.origin_company_name == null || value.origin_company_name == "")) {
                            customer_name = escapeHtmlAlternate(value.origin_company_name);
                        }
                    } else {
                        var type = "D";
                        if (!(typeof (value.dest_company_name) == "undefined" || value.dest_company_name == "null" || value.dest_company_name == null || value.dest_company_name == "")) {
                            customer_name = escapeHtmlAlternate(value.dest_company_name);
                        }
                    }
                    var image_str = "";
                    if (value.is_same_day == 1) {
                        image_str += "<img title='Is a Same Day Delivery Order' style='width:25px;' src='" + same_day_logo + "' >";
                    }
                    if (value.hasOwnProperty('is_cc_internally_unpaid')) {
                        if (value.is_cc_internally_unpaid == 1) {
                            image_str += '<span class="text-red"><i class="fa fa-dollar"></i></span>';
                        }
                    }
                    if (checked_weight + parseInt(value.order_weight) > remaining_weight || checked_volume + parseInt(value.total_cubes) > remaining_cubes) {
                        var checked = "";
                    } else {
                        var checked = "checked";
                        checked_weight = checked_weight + parseInt(value.order_weight);
                        checked_volume = checked_volume + parseInt(value.total_cubes);
                        var rem_wt_after = parseInt($(".rem_wt").html());
                        var rem_vol_after = parseInt($(".rem_vol").html());
                        $(".rem_vol").html(rem_vol_after - parseInt(value.total_cubes));
                        $(".rem_wt").html(rem_wt_after - parseInt(value.order_weight));
                    }
                    var remove_pickup_str = "";
                    if (type == "D") {
                        if (value.is_same_day == 1) {
                            // Find if the Pickup is assigned to the selected truck?
                            var jjs = $('#t_o_json_' + value.o_id + 'P').val();
                            if (typeof jjs != "undefined") {
                                var truck_id = $('#t_o_json_' + value.o_id + 'P').parent().find('.unassign_button').attr('data-truck-number');
                                var truck_name = $('#t_o_json_' + value.o_id + 'P').parent().parent().parent().parent().find('.panel-title').text();
                                if (typeof truck_id == 'undefined') {
                                    var truck_id1 = $('#t_o_' + value.o_id + 'P').parent().parent().find(".toa-sort-orders").attr("data-truck-number");
                                    if (truck_id1 != truck_data.t_id) {
                                        $('#has_same_p_d_trucks').val(1);
                                    }
                                }
                                else if (truck_id != truck_data.t_id && typeof truck_id != 'undefined') {
                                    remove_pickup_str = "<span class='text text-danger'>Pickup of This Truck assigned to: " + truck_name + " <a href='Javascript:void(0)' class='unassign_button1' data-truck-number='" + truck_id + "' data-order-number='" + value.o_id + 'P' + "'><i class='fa fa-trash'></i> Remove </a></span>";
                                    $('#has_same_p_d_trucks').val(1);
                                }
                            }
                            // Find What truck the pickup is assigned to and create the string to unassign it from that 
                            // truck and show the checkbox to attached it with this order
                        }
                        if (value.not_deliverable_rows == 0 || value.is_same_day == 1) {
                            var disabled = "";
                            var is_same_day = 1;
                        } else {
                            var disabled = "disabled";
                            var is_same_day = 0;
                            checked = "";
                            checked_weight = checked_weight - parseInt(value.order_weight);
                            checked_volume = checked_volume - parseInt(value.total_cubes);
                            var rem_wt_after = parseInt($(".rem_wt").html());
                            var rem_vol_after = parseInt($(".rem_vol").html());
                            $(".rem_vol").html(rem_vol_after + parseInt(value.total_cubes));
                            $(".rem_wt").html(rem_wt_after + parseInt(value.order_weight));
                            all_clean = 0;
                        }
                    } else {
                        if (value.not_pickupable_rows == 0 || value.is_same_day == 1) {
                            var disabled = "";
                            var is_same_day = 1;
                        } else {
                            var disabled = "disabled";
                            var is_same_day = 0;
                            checked = "";
                            checked_weight = checked_weight - parseInt(value.order_weight);
                            checked_volume = checked_volume - parseInt(value.total_cubes);
                            var rem_wt_after = parseInt($(".rem_wt").html());
                            var rem_vol_after = parseInt($(".rem_vol").html());
                            $(".rem_vol").html(rem_vol_after + parseInt(value.total_cubes));
                            $(".rem_wt").html(rem_wt_after + parseInt(value.order_weight));
                            all_clean = 0;
                        }
                    }
                    if (type == "T") {
                        var trnfr_id = value.transfer_id;
                        var transfer_html = "<span class='small' style='color:red'>TID #" + trnfr_id + "</span>";
                    } else {
                        var trnfr_id = "";
                        var transfer_html = "";
                    }
                    orders_str = orders_str + "<div class='col-sm-6 col-xs-12'> <input " + disabled + " type='checkbox' data-is-same-day='" + is_same_day + "' id='check" + value.o_id + type + trnfr_id + "' class='order-seleection-check' " + checked + " data-order-id='" + value.o_id + type + trnfr_id + "' data-cubes='" + value.total_cubes + "' data-weight='" + value.order_weight + "' data-loc='" + value_loc + "' style='display:inline-block'><label for='check" + value.o_id + type + trnfr_id + "'  style='display:contents'>" + image_str + "  " + value.o_id + " " + type + " - <b>" + customer_name + "</b> (Weight:" + value.order_weight + ", Volume:" + value.total_cubes + ", Total Pieces:" + value.quantity + ")(Location:- " + value_loc + ") " + transfer_html + "</label>" + remove_pickup_str + "</div>";
                });
            });
            var dup_array = array;
            dup_array.splice(0, 1);
            $('.location_name_select_orders').html(dup_array.join(' & '));
        }
        if (all_clean == 0) {
            $('.unselect_alert').show();
        } else {
            $('.unselect_alert').hide();
        }
        var rem_wt_after = parseInt($(".rem_wt").html());
        var rem_vol_after = parseInt($(".rem_vol").html());
        if (rem_wt_after < 0 || rem_vol_after < 0) {
            $('#select_orders_button').attr('disabled', true);
        } else {
            $('#select_orders_button').attr('disabled', false);
        }
        $('.order-selection-div').html(orders_str);
        $('#select_order_open').trigger('click');
    };

    function OpenSelectionModalDup(location, truck_data, order_weight, order_cubes, remaining_weight, remaining_cubes, number) {
        var checked_weight = 0;
        var checked_volume = 0;
        var pieces = 0;
        var addr = "";
        var all_clean = 1;
        var html_ul = "";
        $('#has_same_p_d_trucks').val(0);
        if (location.indexOf("|") == -1) {
            $.each(orders_json[location], function (key, value) {
                var order_state = "";
                addr = "";
                if (value.ors_type == ORDER_TYPE.PICKUP) {
                    var sum_order_quant = value.quantity;
                    var sum_order_quan_for_delivery = value.qty_for_delivery;
                    if (sum_order_quan_for_delivery == 0) {
                        order_state = "<span class='label label-danger'>Not Picked Yet</span>";
                    } else if (sum_order_quant != sum_order_quan_for_delivery) {
                        order_state = "<span class='label  label-warning'>Partially Picked</span>";
                    } else {
                        order_state = "<span class='label  label-success'>Picked</span>";
                    }
                } else {
                    var sum_order_quant = value.quantity;
                    var sum_order_quan_for_delivery = value.qty_for_delivery;
                    if (sum_order_quan_for_delivery == 0) {
                        order_state = "<span class='label label-danger'>Not Recieved Yet</span>";
                    } else if (sum_order_quant != sum_order_quan_for_delivery) {
                        order_state = "<span class='label  label-warning'>Partially Recieved</span>";
                    } else {
                        order_state = "<span class='label  label-success'>Recieved</span>";
                    }
                }
                var dateC = $('#save_truck_date').val();
                var account_name = "";
                if (!(typeof (value.u_name) == "undefined" || value.u_name == "null" || value.u_name == null || value.u_name == "")) {
                    account_name = value.u_name;
                }
                if (account_name) {
                    account_name = escapeHtmlAlternate(account_name);
                }
                var customer_name = account_name;
                if (value.order_type == "Pickup") {
                    var type = "P";
                    if (!(typeof (value.origin_company_name) == "undefined" || value.origin_company_name == "null" || value.origin_company_name == null || value.origin_company_name == "")) {
                        customer_name = escapeHtmlAlternate(value.origin_company_name);
                    }
                    if (value.origin_addressline1) {
                        addr += value.origin_addressline1;
                    }
                    if (value.origin_addressline2) {
                        addr += ', ' + value.origin_addressline2;
                    }
                    if (value.origin_city) {
                        addr += ', ' + value.origin_city;
                    }
                    if (value.origin_state) {
                        addr += ', ' + value.origin_state;
                    }
                    if (value.origin_zip) {
                        addr += ', ' + value.origin_zip;
                    }
                } else if (value.order_type == "Transfer") {
                    var type = "T";
                    if (!(typeof (value.origin_company_name) == "undefined" || value.origin_company_name == "null" || value.origin_company_name == null || value.origin_company_name == "")) {
                        customer_name = escapeHtmlAlternate(value.dest_warehouse_info[0].company_name);
                    }
                    if (value.dest_addressline1) {
                        addr += value.dest_addressline1;
                    }
                    if (value.dest_addressline2) {
                        addr += ', ' + value.dest_addressline2;
                    }
                    if (value.dest_city) {
                        addr += ', ' + value.dest_city;
                    }
                    if (value.dest_state) {
                        addr += ', ' + value.dest_state;
                    }
                    if (value.dest_zip) {
                        addr += ', ' + value.dest_zip;
                    }
                } else {
                    var type = "D";
                    if (!(typeof (value.dest_company_name) == "undefined" || value.dest_company_name == "null" || value.dest_company_name == null || value.dest_company_name == "")) {
                        customer_name = escapeHtmlAlternate(value.dest_company_name);
                    }
                    if (value.dest_addressline1) {
                        addr += value.dest_addressline1;
                    }
                    if (value.dest_addressline2) {
                        addr += ', ' + value.dest_addressline2;
                    }
                    if (value.dest_city) {
                        addr += ', ' + value.dest_city;
                    }
                    if (value.dest_state) {
                        addr += ', ' + value.dest_state;
                    }
                    if (value.dest_zip) {
                        addr += ', ' + value.dest_zip;
                    }
                }
                var image_str = "";
                if (value.is_same_day == 1) {
                    image_str += "<img title='Is a Same Day Delivery Order' style='width:18px;max-height:15px' src='" + same_day_logo + "' >";
                }
                if (value.hasOwnProperty('is_cc_internally_unpaid')) {
                    if (value.is_cc_internally_unpaid == 1) {
                        image_str += '<span class="text-red"><i class="fa fa-dollar"></i></span>';
                    }
                }
                if (checked_weight + parseInt(value.order_weight) > remaining_weight || checked_volume + parseInt(value.total_cubes) > remaining_cubes) {
                    var checked = "";
                } else {
                    var checked = "checked";
                    checked_weight = checked_weight + parseInt(value.order_weight);
                    checked_volume = checked_volume + parseInt(value.total_cubes);
                    pieces = pieces + parseInt(value.quantity);
                    var rem_wt_after = parseInt($(".selected_wgt_" + number).html());
                    var rem_vol_after = parseInt($(".selected_vol_" + number).html());
                    $(".selected_vol_" + number).html(checked_volume);
                    $(".selected_wgt_" + number).html(checked_weight);
                    $(".selected_pcs_" + number).html(pieces);
                }

                var remove_pickup_str = "";
                if (type == "D") {
                    if (value.is_same_day == 1) {
                        // Find if the Pickup is assigned to the selected truck?
                        var jjs = $('#t_o_json_' + value.o_id + 'P').val();
                        if (typeof jjs != "undefined") {
                            var truck_id = $('#t_o_json_' + value.o_id + 'P').parent().find('.unassign_button').attr('data-truck-number');
                            var truck_name = $('#t_o_json_' + value.o_id + 'P').parent().parent().parent().parent().find('.panel-title').text();
                            if (typeof truck_id == 'undefined') {
                                var truck_id1 = $('#t_o_' + value.o_id + 'P').parent().parent().find(".toa-sort-orders").attr("data-truck-number");
                                if (truck_id1 != truck_data.t_id) {
                                    $('#has_same_p_d_trucks').val(1);
                                }
                            }
                            else if (truck_id != truck_data.t_id && typeof truck_id != 'undefined') {
                                remove_pickup_str = "<span class='text text-danger'>Pickup of This Truck assigned to: " + truck_name + " <a href='Javascript:void(0)' class='unassign_button1' data-truck-number='" + truck_id + "' data-order-number='" + value.o_id + 'P' + "'><i class='fa fa-trash'></i> Remove </a></span>";
                                $('#has_same_p_d_trucks').val(1);
                            }
                        }
                        // Find What truck the pickup is assigned to and create the string to unassign it from that 
                        // truck and show the checkbox to attached it with this order
                    }
                    if (value.not_deliverable_rows >= 0 || value.is_same_day == 1) {
                        var disabled = "";
                        var is_same_day = 1;
                    } else {
                        var disabled = "disabled";
                        console.log("disabled1: " + disabled)
                        var is_same_day = 0;
                        checked = "";
                        checked_weight = checked_weight - parseInt(value.order_weight);
                        checked_volume = checked_volume - parseInt(value.total_cubes);
                        pieces = pieces - parseInt(value.quantity);
                        var rem_wt_after = parseInt($(".selected_wgt_" + number).html());
                        var rem_vol_after = parseInt($(".selected_vol_" + number).html());
                        $(".selected_vol_" + number).html(rem_vol_after - parseInt(value.total_cubes));
                        $(".selected_wgt_" + number).html(rem_wt_after - parseInt(value.order_weight));
                        $(".selected_pcs_" + number).html(pieces);
                        all_clean = 0;
                    }
                } else {
                    if (value.not_pickupable_rows == 0 || value.is_same_day == 1) {
                        var disabled = "";
                        var is_same_day = 1;
                    } else {
                        var disabled = "disabled";
                        var is_same_day = 0;
                        checked = "";
                        checked_weight = checked_weight - parseInt(value.order_weight);
                        checked_volume = checked_volume - parseInt(value.total_cubes);
                        pieces = pieces - parseInt(value.quantity);
                        var rem_wt_after = parseInt($(".selected_wgt_" + number).html());
                        var rem_vol_after = parseInt($(".selected_vol_" + number).html());
                        $(".selected_vol_" + number).html(rem_vol_after - parseInt(value.total_cubes));
                        $(".selected_wgt_" + number).html(rem_wt_after - parseInt(value.order_weight));
                        $(".selected_pcs_" + number).html(pieces);
                        all_clean = 0;
                    }
                }
                if (type == "T") {
                    var trnfr_id = value.transfer_id;
                    var transfer_html = "<span class='btn-danger btn-sm badge ml-auto'>TID #" + trnfr_id + "</span>";
                } else {
                    var trnfr_id = "";
                    var transfer_html = "";
                }
                html_ul += '<li class="inner_order_item">';
                html_ul += '<div class="sub-order-item">';
                if (type != "T") {
                    var truck_img = image_str;
                } else {
                    truck_img = '';
                }
                console.log("disabled3: " + disabled)
                html_ul += '<input ' + disabled + ' data-is-same-day="' + is_same_day + '" type="checkbox" value="" id="check' + value.o_id + type + trnfr_id + '" class="ord_search sub_order_' + number + '" ' + checked + '  data-order-id="' + value.o_id + type + trnfr_id + '" data-cubes="' + value.total_cubes + '" data-weight="' + value.order_weight + '" data-loc="' + key + '" data-peice="' + value.quantity + '">';
                html_ul += '<label for="check' + value.o_id + type + trnfr_id + '"><strong>' + value.o_id + ' ' + type + ' - ' + customer_name + ' ' + truck_img + '</strong><p class="address1">' + addr + '</p><small class="text-muted"><span class="uni_trk_detail">V-' + value.total_cubes + ' W-' + value.order_weight + ' P-' + value.quantity + '</span>' + order_state + transfer_html + '</small></label> ';
                html_ul += '</div>';
                html_ul += '</li>';
            });
        }

        var rem_wt_after = parseInt($(".selected_wgt_" + number).html());
        var rem_vol_after = parseInt($(".selected_vol_" + number).html());
        if (rem_wt_after < 0 || rem_vol_after < 0) {
            $('#select_orders_button').attr('disabled', true);
        } else {
            $('#select_orders_button').attr('disabled', false);
        }
        $('#sub_orders_' + number).html(html_ul);

        $('.sub_order_' + number).on('change', function () {

            if ($(this).is(':checked')) {
                var weight = $(this).attr('data-weight');
                var volume = $(this).attr('data-cubes');
                var pice = $(this).attr('data-peice');
                var rem_wt_after = parseInt($(".selected_wgt_" + number).html());
                var rem_vol_after = parseInt($(".selected_vol_" + number).html());
                var rem_piece = parseInt($(".selected_pcs_" + number).html());
                var truck_wgt = parseInt($('.total_wgt_' + number).html());
                var truck_vol = parseInt($('.total_vol_' + number).html());
                var disabled = 0;

                $(".selected_pcs_" + number).html(rem_piece + parseInt(pice));
                if (rem_vol_after + parseInt(volume) > truck_vol) {
                    $(".selected_vol_" + number).html(rem_vol_after + parseInt(volume));
                    $(".selected_vol_" + number).css("color", "red");
                    var disabled = 1;
                } else {
                    $(".selected_vol_" + number).html(rem_vol_after + parseInt(volume));
                    $(".selected_vol_" + number).css("color", "black");
                }
                if (rem_wt_after + parseInt(weight) > truck_wgt) {
                    $(".selected_wgt_" + number).html(rem_wt_after + parseInt(weight));
                    $(".selected_wgt_" + number).css("color", "red");
                    var disabled = 1;
                } else {
                    $(".selected_wgt_" + number).html(rem_wt_after + parseInt(weight));
                    $(".selected_wgt_" + number).css("color", "black");
                }
            } else {
                var weight = $(this).attr('data-weight');
                var volume = $(this).attr('data-cubes');
                var pice = $(this).attr('data-peice');
                var rem_wt_after = parseInt($(".selected_wgt_" + number).html());
                var rem_vol_after = parseInt($(".selected_vol_" + number).html());
                var rem_piece = parseInt($(".selected_pcs_" + number).html());
                var truck_wgt = parseInt($('.total_wgt_' + number).html());
                var truck_vol = parseInt($('.total_vol_' + number).html());
                $('.select_all_' + number).prop("checked", false);
                $('.select_all_' + number).attr("checked", false);
                var disabled = 0;

                $(".selected_pcs_" + number).html(rem_piece - parseInt(pice));
                if (rem_vol_after - parseInt(volume) > truck_vol) {
                    $(".selected_vol_" + number).html(rem_vol_after - parseInt(volume));
                    $(".selected_vol_" + number).css("color", "red");
                    var disabled = 1;
                } else {
                    $(".selected_vol_" + number).html(rem_vol_after - parseInt(volume));
                    $(".selected_vol_" + number).css("color", "black");
                }
                if (rem_wt_after - parseInt(weight) > truck_wgt) {
                    $(".selected_wgt_" + number).html(rem_wt_after - parseInt(weight));
                    $(".selected_wgt_" + number).css("color", "red");
                    var disabled = 1;
                } else {
                    $(".selected_wgt_" + number).html(rem_wt_after - parseInt(weight));
                    $(".selected_wgt_" + number).css("color", "black");
                }
            }
            if (disabled == 1) {
                $('.assign_btn_' + number).attr('disabled', true);
            } else {
                $('.assign_btn_' + number).attr('disabled', false);
            }

            var l = $('input:checkbox.sub_order_' + number + ':checked').length; //checked checkboxes
            var t = $('input:checkbox.sub_order_' + number).length; //total checkboxes
            if (l == 0) {
                $('.select_all_' + number).prop("checked", false);
                $('.select_all_' + number).attr("checked", false);
            } else if (l == t) {
                $('.select_all_' + number).prop("checked", true);
                $('.select_all_' + number).attr("checked", true);
            }
        });
    };

    function unassign_orders(order_number, truck_number, push = true, side_num, loc, addr = '', warehouse_addr = '') {
        truck_json = JSON.parse(trucks_orders_json);
        var same_day_delivery_available = 0;
        $('#changed').val(1);
        var truck_data = truck_json[truck_number];
        var orders = $('.unassigned_orders_box').html();
        $('.unassigned_orders_box').html(parseInt(orders) + 1);
        for (i = 0; i < truck_data.length; i++) {
            value = truck_data[i];
            var check_transfer = 0;
            if (value.type == "Pickup") {
                var type = "P";
            } else if (value.type == "Transfer") {
                var type = "T";
                check_transfer = 1;
            } else {
                var type = "D";
            }
            if ((value.id + type + value.transfer_id) == order_number) {
                var cubes = $('#t_o_' + order_number).attr('data-cubes-vol');
                var key1 = ($('#orders-accordion').find('li').length + 1);
                var present_cubes = $('.t_no_' + truck_number + '_vol').html();
                var weight = $('#t_o_' + order_number).attr('data-weight');
                var present_weight = $('.t_no_' + truck_number + 'wt').html();
                var present_pieces = parseInt($('.t_no_' + truck_number + '_pieces').html());
                var json = $('#t_o_json_' + order_number).val();
                if (JSON.parse(json)) {
                    var json = JSON.parse(json);
                }
                if (json.truck_number != undefined && json.truck_number == truck_number) {
                    var scanned_labels_in_order_removed = json.scanned_labels_in_order;
                } else {
                    scanned_labels_in_order_removed = 0;
                }
                if (json.total_labels_in_order != undefined) {
                    total_labels_in_order_removed = json.total_labels_in_order;
                } else {
                    total_labels_in_order_removed = 0;
                }
                var order_status = json.truck_order_status;
                if (json.is_same_day == 1 && type == "P") {
                    var jjs = $('#t_o_json_' + value.id + 'D').val();
                    if (typeof jjs != "undefined") {
                        var get_del_loc = JSON.parse(jjs);
                        var truck_id = $('#t_o_json_' + value.id + 'D').parent().find('.unassign_button').attr('data-truck-number');
                        if (confirm('Unassigning a Pickup of a same day delivery order will result in unassigning of the delivery too. Are you sure you want to continue?')) {
                            var addr1 = '';
                            var side_num_unassign = '';
                            $.each($('.unassign_button'), function (ke, va) {
                                if (value.id + "D" == $(va).attr('data-order-number')) {
                                    addr1 = $(va).attr('data-addr-unassign');
                                    side_num_unassign = $(va).attr("data-side");
                                    return false;
                                }
                            });
                            unassign_orders(value.id + "D", truck_id, true, side_num_unassign, get_del_loc.dest_loc_name, addr1);
                        } else {
                            return false;
                        }
                    }
                }
                if (order_status != TRUCK_ORDER_STATUS.SCHEDULED) {
                    if (!confirm("Driver is working on this order and if you unassign then you will lose all the changes made by driver. Do you really want to unassign it?")) {
                        return false;
                    }
                }
                if (check_transfer == 1) {
                    unassign_order_marker(order_number, truck_number, loc, addr, warehouse_addr);
                    var total_labels = parseInt($('.label_count_' + truck_number).text());
                    var total_scanned_label = parseInt($('.scanned_label_count_' + truck_number).text());
                }
                else
                    unassign_order_marker(order_number, truck_number, loc, addr);
                $('.t_no_' + truck_number + 'wt').html(parseInt(present_weight) - parseInt(weight));
                $('.t_no_' + truck_number + '_vol').html(present_cubes - cubes);
                var total_cubes = 0;
                var total_weight = 0;
                var dateC = $('#save_truck_date').val();
                if (json.order_type == "Delivery") {
                    var loc_name = json.dest_loc_name;
                } else if (json.order_type == "Transfer") {
                    var loc_name = $('#t_o_' + order_number).attr('data-loc');
                } else {
                    var loc_name = json.origin_loc_name;
                }
                var term = "";
                if (json.hasOwnProperty('depot_id')) {
                    term = get_active_warehouse(json.depot_id, 'terminal_name');
                }
                $.each(orders_json[loc_name], function (index, val) {
                    total_cubes = total_cubes + parseInt(val.total_cubes);
                    total_weight = total_weight + parseInt(val.order_weight);
                });
                var present = 0;
                var removed_pieces = parseInt(json.quantity);

                if (json.order_type == "Transfer") {
                    $.each($('#transfer-accordion').find('.check_order_number'), function (key1, value1) {
                        if ($(value1).attr('data-loc-key') == loc_name) {
                            present = 1;
                        }
                    });
                } else {
                    $.each($('#orders-accordion').find('.check_order_number'), function (key1, value1) {
                        if ($(value1).attr('data-loc-key') == loc_name) {
                            present = 1;
                        }
                    });
                }
                if (present == 1) {
                    var order_state = "";
                    if (json.ors_type == ORDER_TYPE.PICKUP) {
                        var sum_order_quant = json.quantity;
                        var sum_order_quan_for_delivery = json.qty_for_delivery;
                        if (sum_order_quan_for_delivery == 0) {
                            order_state = "<span class='label label-danger'>Not Picked Yet</span>";
                        } else if (sum_order_quant != sum_order_quan_for_delivery) {
                            order_state = "<span class='label label-warning'>Partially Picked</span>";
                        } else {
                            order_state = "<span class='label label-success'>Picked</span>";
                        }
                    } else {
                        var sum_order_quant = json.quantity;
                        var sum_order_quan_for_delivery = json.qty_for_delivery;
                        if (sum_order_quan_for_delivery == 0) {
                            order_state = "<span class='label label-danger'>Not Recieved Yet</span>";
                        } else if (sum_order_quant != sum_order_quan_for_delivery) {
                            order_state = "<span class='label label-warning'>Partially Recieved</span>";
                        } else {
                            order_state = "<span class='label label-success'>Recieved</small>";
                        }
                    }
                    var account_name = "";
                    if (!(typeof (json.u_name) == "undefined" || json.u_name == "null" || json.u_name == null || json.u_name == "")) {
                        account_name = json.u_name;
                    }
                    if (account_name) {
                        account_name = escapeHtmlAlternate(account_name);
                    }

                    var customer_name = account_name;
                    if (json.order_type == "Pickup") {
                        var type = "P";
                        if (!(typeof (json.origin_company_name) == "undefined" || json.origin_company_name == "null" || json.origin_company_name == null || json.origin_company_name == "")) {
                            customer_name = escapeHtmlAlternate(json.origin_company_name);
                        }
                    } else if (json.order_type == "Transfer") {
                        var type = "T";
                        if (!(typeof (json.dest_warehouse_info[0].company_name) == "undefined" || json.dest_warehouse_info[0].company_name == "null" || json.dest_warehouse_info[0].company_name == null || json.dest_warehouse_info[0].company_name == "")) {
                            customer_name = escapeHtmlAlternate(json.dest_warehouse_info[0].company_name);
                        }
                    } else {
                        var type = "D";
                        if (!(typeof (json.dest_company_name) == "undefined" || json.dest_company_name == "null" || json.dest_company_name == null || json.dest_company_name == "")) {
                            customer_name = escapeHtmlAlternate(json.dest_company_name);
                        }
                    }
                    var image_str = "";
                    if (json.is_same_day == 1) {
                        image_str += "<img title='Is a Same Day Delivery Order' style='width:18px; max-height:15px;' src='" + same_day_logo + "' >";
                    }
                    if (json.hasOwnProperty('is_cc_internally_unpaid')) {
                        if (json.is_cc_internally_unpaid == 1) {
                            image_str += '<span class="text-red"><i class="fa fa-dollar"></i></span>';
                        }
                    }

                    var remove_pickup_str = "";
                    if (type == "D") {
                        if (json.not_deliverable_rows == 0 || json.is_same_day == 1) {
                            var disabled = "";
                            var is_same_day = 1;
                        }
                    } else {
                        if (json.not_pickupable_rows == 0 || json.is_same_day == 1) {
                            var disabled = "";
                            var is_same_day = 1;
                        }
                    }
                    if (type == "T") {
                        var trnfr_id = json.transfer_id;
                        var transfer_html = "<span class='btn-danger btn-sm badge ml-auto'>TID #" + trnfr_id + "</span>";
                    } else {
                        var trnfr_id = "";
                        var transfer_html = "";
                    }
                    $.each($('.assign_butns'), function (ke, va) {
                        if (loc == $(va).attr('data-loc-key')) {
                            var get_side_num = $(this).parent().parent().parent().parent();
                            side_num = $(get_side_num).attr('data-marker-id');
                        }
                    });
                    var total_cubes = parseInt($('.assign_btn_' + side_num).attr('data-total-cubes')) + parseInt(json.total_cubes);
                    var total_weight = parseInt($('.assign_btn_' + side_num).attr('data-total-weight')) + parseInt(json.order_weight);
                    if ($('#sub_orders_' + side_num).length > 0) {
                        var li_html = '<li class="inner_order_item">';
                        li_html += '<div class="sub-order-item">';
                        if (type !== "T") {
                            var truck_img = image_str;
                        }
                        li_html += '<input ' + disabled + ' data-is-same-day="' + is_same_day + '" type="checkbox" value="" id="check' + json.o_id + type + trnfr_id + '" class="ord_search order-seleection-check sub_order_' + side_num + '" data-order-id="' + json.o_id + type + trnfr_id + '" data-cubes="' + json.total_cubes + '" data-weight="' + json.order_weight + '" data-loc = "' + loc_name + '" data-peice="' + json.quantity + '">';
                        li_html += '<label for="check' + json.o_id + type + trnfr_id + '"><strong>' + json.o_id + ' ' + type + ' - ' + customer_name + ' ' + truck_img + '</strong><p class="address1">' + addr + '</p><small class="text-muted"><span class="uni_trk_detail">V-' + json.total_cubes + ' W-' + json.order_weight + ' P-' + json.quantity + '</span>' + order_state + transfer_html + '</small> </label> ';
                        li_html += '</div>';
                        li_html += '</li>';
                        $('#sub_orders_' + side_num).append(li_html);
                    }
                    $.each($('.assign_btn_' + side_num), function (key1, value1) {
                        if ($(value1).attr('data-loc-key') == loc_name) {
                            var pres_orders = parseInt($('.order_numbers' + side_num).html());
                            $('.order_numbers' + side_num).html(pres_orders + 1);
                            $(value1).attr('data-total-cubes', total_cubes);
                            $(value1).attr('data-total-weight', total_weight);
                        }
                    });

                } else {

                    if (json.order_type == "Transfer" && push == true) {

                        var len1 = $('#transfer-accordion').find('.depot-result').length;
                        var len = sidebar_number_transfer++;

                        var accordion_id = 'transfer-accordion';
                        var total_cubes = 0;
                        var total_weight = 0;
                        total_cubes += parseInt(json.total_cubes);
                        total_weight += parseInt(json.order_weight);
                        var checkbox = '<h6 class="panel-title">';
                        checkbox += '<input type="hidden" class="check_order_number" data-loc-key="' + loc_name + '">';
                        checkbox += '<span class="Number">' + (len1 + 1) + '.</span>';
                        checkbox += '<a data-toggle="collapse" class="one_at_time_accordion collapsed" data-parent="#' + accordion_id + '" href="#collapse_t' + (len + 1) + '">';
                        checkbox += '<span>' + loc_name + '</span>';
                        checkbox += '<small class="text-muted">Orders: <span class="order_numberst' + (len + 1) + '">' + 1 + '</span></small>';
                        checkbox += '</a>';
                        checkbox += '</h6>';
                        var html_str1 = checkbox;

                        var assign_button = '<button class="btn btn-info btn-sm assign_butns assign_btn_t' + (len + 1) + '" disabled data-cnt=t' + (len + 1) + ' data-total-cubes="' + total_cubes + '" data-total-weight="' + total_weight + '" data-loc-key="' + loc_name + '">Assign</button>';

                        var html_button = '<div id="collapse_t' + (len + 1) + '" class="panel-collapse check_collapse collapse">';
                        html_button += '<div class="panel-body p-0">';
                        html_button += '<div class="p-col">';
                        html_button += '<select class="form-control sidebar_select_truck" id="truck_chose_t' + (len + 1) + '">';
                        html_button += '</select>';
                        html_button += assign_button;
                        html_button += '</div>';
                        html_button += '<small class="capacity-col truck_details_t' + (len + 1) + '"><span>V-<sp class="selected_vol_t' + (len + 1) + '">0</sp>/<sp class="total_vol_t' + (len + 1) + '">103</sp></span><span>W-<sp class="selected_wgt_t' + (len + 1) + '">0</sp>/<sp class="total_wgt_t' + (len + 1) + '">1200</sp></span><span>P-<sp class="selected_pcs_t' + (len + 1) + '">0</sp></span></small>';
                        html_button += '<ul class="list-sub-orders" id="sub_orders_t' + (len + 1) + '">';
                        var checked_weight = 0;
                        var order_state = "";
                        if (json.ors_type == ORDER_TYPE.PICKUP) {
                            var sum_order_quant = json.quantity;
                            var sum_order_quan_for_delivery = json.qty_for_delivery;
                            if (sum_order_quan_for_delivery == 0) {
                                order_state = "<span class='label label-danger'>Not Picked Yet</span>";
                            } else if (sum_order_quant != sum_order_quan_for_delivery) {
                                order_state = "<span class='label label-warning'>Partially Picked</span>";
                            } else {
                                order_state = "<span class='label label-success'>Picked</span>";
                            }
                        } else {
                            var sum_order_quant = json.quantity;
                            var sum_order_quan_for_delivery = json.qty_for_delivery;
                            if (sum_order_quan_for_delivery == 0) {
                                order_state = "<span class='label label-danger'>Not Recieved Yet</span>";
                            } else if (sum_order_quant != sum_order_quan_for_delivery) {
                                order_state = "<span class='label label-warning'>Partially Recieved</span>";
                            } else {
                                order_state = "<span class='label label-success'>Recieved</span>";
                            }
                        }
                        var account_name = "";
                        if (!(typeof (json.u_name) == "undefined" || json.u_name == "null" || json.u_name == null || json.u_name == "")) {
                            account_name = json.u_name;
                        }
                        if (account_name) {
                            account_name = escapeHtmlAlternate(account_name);
                        }

                        var customer_name = account_name;
                        if (json.order_type == "Pickup") {
                            var type = "P";
                            if (!(typeof (json.origin_company_name) == "undefined" || json.origin_company_name == "null" || json.origin_company_name == null || json.origin_company_name == "")) {
                                customer_name = escapeHtmlAlternate(json.origin_company_name);
                            }
                        } else if (json.order_type == "Transfer") {
                            var type = "T";
                            if (!(typeof (json.dest_warehouse_info[0].company_name) == "undefined" || json.dest_warehouse_info[0].company_name == "null" || json.dest_warehouse_info[0].company_name == null || json.dest_warehouse_info[0].company_name == "")) {
                                customer_name = escapeHtmlAlternate(json.dest_warehouse_info[0].company_name);
                            }
                        } else {
                            var type = "D";
                            if (!(typeof (json.dest_company_name) == "undefined" || json.dest_company_name == "null" || json.dest_company_name == null || json.dest_company_name == "")) {
                                customer_name = escapeHtmlAlternate(json.dest_company_name);
                            }
                        }

                        var image_str = "";
                        if (json.is_same_day == 1) {
                            image_str += "<img title='Is a Same Day Delivery Order' style='width:25px;' src='" + same_day_logo + "' >";
                        }
                        if (json.hasOwnProperty('is_cc_internally_unpaid')) {
                            if (json.is_cc_internally_unpaid == 1) {
                                image_str += '<span class="text-red"><i class="fa fa-dollar"></i></span>';
                            }
                        }

                        var remove_pickup_str = "";
                        if (type == "D") {
                            if (json.not_deliverable_rows == 0 || json.is_same_day == 1) {
                                var disabled = "";
                                var is_same_day = 1;
                            }
                        } else {
                            if (json.not_pickupable_rows == 0 || json.is_same_day == 1) {
                                var disabled = "";
                                var is_same_day = 1;
                            }
                        }
                        if (type == "T") {
                            var trnfr_id = json.transfer_id;
                            var transfer_html = "<span class='btn-danger btn-sm badge ml-auto'>TID #" + trnfr_id + "</span>";
                        } else {
                            var trnfr_id = "";
                            var transfer_html = "";
                        }
                        html_button += '<li class="inner_order_item">';
                        html_button += '<div class="sub-order-item">';
                        if (type != "T") {
                            html_button += image_str;
                        }
                        html_button += '<input ' + disabled + ' data-is-same-day="' + is_same_day + '" type="checkbox" value="" id="check' + json.o_id + type + trnfr_id + '" class="ord_search order-seleection-check sub_order_t' + (len + 1) + '"  data-order-id="' + json.o_id + type + trnfr_id + '" data-cubes="' + json.total_cubes + '" data-weight="' + json.order_weight + '" data-loc="' + loc_name + '" data-peice="' + json.quantity + '">';
                        html_button += '<label for="check' + json.o_id + type + trnfr_id + '"><strong>' + json.o_id + ' ' + type + ' - ' + customer_name + '</strong><p class="address1">' + addr + '</p><small class="text-muted"><span class="uni_trk_detail">V-' + json.total_cubes + ' W-' + json.order_weight + ' P-' + json.quantity + '</span>' + order_state + transfer_html + '</small></label> ';
                        html_button += '</div>';
                        html_button += '</li>';
                        html_button += '</ul>';
                        html_button += '</div>';
                        html_button += '</div>';
                        var html_new = html_str1 + html_button;
                        var color_counter = ((len) % 5 + 1);
                        var r_type = '';
                        $('#transfer-accordion').append(
                            $('<li />', {
                                class: 'depot-result list-group-itemz list-group-item-o loc_name_t' + (len + 1) + ' show_marker color' + color_counter,
                                id: 'map-marker-t' + (len + 1),
                                'data-marker-id': 't' + (len + 1),
                                html: html_new
                            })
                        );
                        if ($('#truck_chose_t' + (len + 1)).val() == null) {
                            $('.sub_order_t' + (len + 1)).prop('disabled', true);

                            $('.truck_details_t' + (len + 1)).hide();
                        } else {
                            $('.truck_details_t' + (len + 1)).show();
                        }
                        cnt = (len + 1);
                        $('#truck_chose_t' + cnt).select2({
                            width: '100%',
                            allowClear: true,
                            placeholder: '--Choose a Truck --',
                            ajax: {
                                url: truckListSelect2Url,
                                error: function (jqXHR, exception) {
                                    active_xhr = false;
                                },
                                data: function (params) {
                                    var query = {
                                        term: params.term,
                                        page: params.page || 1,
                                        size: 10
                                    }
                                    return query;
                                },
                                processResults: function (data, params) {
                                    return {
                                        results: data.results,
                                        pagination: {
                                            more: data.pagination.more
                                        }
                                    };
                                }
                            }
                        }).on("change", function (e) {
                            var select_val = e.currentTarget;
                            var cnt = select_val.id;
                            cnt = parseInt(cnt.replace("truck_chose_t", ""));
                            var id = $(select_val).val();
                            var date = $('#save_truck_date').val();
                            if (id == null) {
                                $('.sub_order_t' + cnt).prop('disabled', true);
                                $('.truck_details_t' + cnt).hide();
                                $.each($('.sub_order_t' + cnt), function (key, val) {
                                    $(val).attr("checked", false);
                                    $(val).prop("checked", false);
                                });
                            } else {
                                $('.sub_order_t' + cnt).prop('disabled', false);
                                $('.truck_details_t' + cnt).show();
                                $('.assign_btn_t' + cnt).prop('disabled', false);
                                $.ajax({
                                    type: "GET",
                                    cache: false,
                                    url: truckDetailsUrl + "/" + id + "/" + date,
                                    success: function (data) {
                                        var used_vol = parseInt($('.t_no_' + id + '_vol').html());
                                        if (used_vol) {
                                            used_vol = used_vol;
                                        } else {
                                            used_vol = 0;
                                        }
                                        var pieces = parseInt($('.t_no_' + id + '_pieces').html());
                                        if (pieces) {
                                            pieces = pieces;
                                        } else {
                                            pieces = 0;
                                        }
                                        var weight = parseInt($('.t_no_' + id + 'wt').html());
                                        if (weight) {
                                            weight = weight;
                                        } else {
                                            weight = 0;
                                        }
                                        var location = loc_name;
                                        var loc_weight = 0;
                                        var loc_cubes = 0;
                                        $('.total_vol_t' + cnt).html(parseInt(data.data.max_volume));
                                        $('.total_wgt_t' + cnt).html(parseInt(data.data.max_weight));

                                        $.each($('#orders-accordion').children(), function (key, value) {
                                            if ($(value).find('.assign-order-to-truck').attr('data-loc-key') == location) {
                                                loc_weight = $(value).find('.assign-order-to-truck').attr('data-total-weight');
                                                loc_cubes = $(value).find('.assign-order-to-truck').attr('data-total-cubes');
                                                return false;
                                            }
                                        });
                                        $.each($('#transfer-accordion').children(), function (key, value) {
                                            if ($(value).find('.assign-order-to-truck').attr('data-loc-key') == location) {
                                                loc_weight = $(value).find('.assign-order-to-truck').attr('data-total-weight');
                                                loc_cubes = $(value).find('.assign-order-to-truck').attr('data-total-cubes');
                                                return false;
                                            }
                                        });

                                        OpenSelectionModalDup(location, data.data, loc_weight, loc_cubes, data.data.max_weight - weight, data.data.max_volume - used_vol, cnt);

                                        $('.selected_wgt_t' + cnt).html(parseInt($('.selected_wgt_t' + cnt).html()) + parseInt(weight));
                                        $('.selected_vol_t' + cnt).html(parseInt($('.selected_vol_t' + cnt).html()) + parseInt(used_vol));
                                        $('.selected_pcs_t' + cnt).html(parseInt($('.selected_pcs_t' + cnt).html()) + parseInt(pieces));
                                        $(".pieces").html(pieces);
                                        $(".driver_name").html(data.data.driver);
                                        $('#truck_details_assign').show();

                                    }
                                });

                            }
                        });

                        $('.assign_btn_t' + cnt).on('click', function (e) {
                            var $loadingText = '<i class="fa fa-refresh  fa-spin"></i>';
                            var cnt = e.currentTarget.dataset.cnt;
                            $('.assign_btn_' + cnt).html($loadingText);
                            var truc_num = $('#truck_chose_' + cnt).val();
                            setTimeout(() => {
                                check_partial_items(loc_name, truc_num, cnt);
                            }, 600);

                            return false;
                        });

                    } else {
                        if (push) {
                            var term = get_active_warehouse(json.depot_id, 'terminal_name');
                            if (term != '') {
                                term = ' (' + term + ') ';
                            }
                            var image_str = "";
                            // console.log('same day 2: ', json);
                            if (json.is_same_day == 1) {
                                image_str += "<img title='Is a Same Day Delivery Order' style='width:18px;max-height:15px;' src='" + same_day_logo + "' >";
                            }
                            if (json.hasOwnProperty('is_cc_internally_unpaid')) {
                                if (json.is_cc_internally_unpaid == 1) {
                                    image_str += '<span class="text-red"><i class="fa fa-dollar"></i></span>';
                                }
                            }
                            var len1 = $('#orders-accordion').find('.depot-result').length;
                            var len = sidebar_number_orders++;
                            var accordion_id = 'orders-accordion';
                            var total_cubes = parseInt($('.assign_btn_' + side_num).attr('data-total-cubes')) + parseInt(json.total_cubes);
                            var total_weight = parseInt($('.assign_btn_' + side_num).attr('data-total-weight')) + parseInt(json.order_weight);

                            var checkbox = '<h6 class="panel-title">';
                            checkbox += '<input type="hidden" class="check_order_number" data-loc-key="' + loc_name + '">';
                            checkbox += '<span class="Number">' + (len1 + 1) + '.</span>';
                            checkbox += '<a data-toggle="collapse" class="collapsed" data-parent="#' + accordion_id + '" href="#collapse_' + (len + 1) + '">';
                            checkbox += '<span>' + loc_name + term + '</span>';
                            checkbox += '<small class="text-muted">Orders: <span class="order_numbers' + (len + 1) + '">' + 1 + '</span></small>';
                            checkbox += '</a>';
                            checkbox += '</h6>';
                            var html_str1 = checkbox;

                            var assign_button = '<button class="btn btn-info btn-sm assign_butns assign_btn_' + (len + 1) + '" disabled data-cnt=' + (len + 1) + ' data-total-cubes="' + total_cubes + '" data-total-weight="' + total_weight + '" data-loc-key="' + loc_name + '">Assign</button>';

                            var html_button = '<div id="collapse_' + (len + 1) + '" class="panel-collapse collapse">';
                            html_button += '<div class="panel-body p-0">';
                            html_button += '<div class="p-col">';
                            html_button += '<select class="form-control sidebar_select_truck" id="truck_chose_' + (len + 1) + '">';
                            html_button += '</select>';
                            html_button += assign_button;
                            html_button += '</div>';
                            html_button += '<small class="capacity-col truck_details_' + (len + 1) + '"><span>V-<sp class="selected_vol_' + (len + 1) + '">0</sp>/<sp class="total_vol_' + (len + 1) + '">103</sp></span><span>W-<sp class="selected_wgt_' + (len + 1) + '">0</sp>/<sp class="total_wgt_' + (len + 1) + '">1200</sp></span><span>P-<sp class="selected_pcs_' + (len + 1) + '">0</sp></span></small>';
                            html_button += '<ul class="list-sub-orders" id="sub_orders_' + (len + 1) + '">';
                            var checked_weight = 0;
                            var order_state = "";
                            if (json.ors_type == ORDER_TYPE.PICKUP) {
                                var sum_order_quant = json.quantity;
                                var sum_order_quan_for_delivery = json.qty_for_delivery;
                                if (sum_order_quan_for_delivery == 0) {
                                    order_state = "<span class='label label-danger'>Not Picked Yet</span>";
                                } else if (sum_order_quant != sum_order_quan_for_delivery) {
                                    order_state = "<span class='label  label-warning'>Partially Picked</span>";
                                } else {
                                    order_state = "<span class='label label-success'>Picked</span>";
                                }
                            } else {
                                var sum_order_quant = json.quantity;
                                var sum_order_quan_for_delivery = json.qty_for_delivery;
                                if (sum_order_quan_for_delivery == 0) {
                                    order_state = "<span class='label label-danger'>Not Recieved Yet</span>";
                                } else if (sum_order_quant != sum_order_quan_for_delivery) {
                                    order_state = "<span class='label  label-warning'>Partially Recieved</span>";
                                } else {
                                    order_state = "<span class='label label-success'>Recieved</span>";
                                }
                            }
                            var account_name = "";
                            if (!(typeof (json.u_name) == "undefined" || json.u_name == "null" || json.u_name == null || json.u_name == "")) {
                                account_name = json.u_name;
                            }
                            if (account_name) {
                                account_name = escapeHtmlAlternate(account_name);
                            }

                            var customer_name = account_name;
                            if (json.order_type == "Pickup") {
                                var type = "P";
                                if (!(typeof (json.origin_company_name) == "undefined" || json.origin_company_name == "null" || json.origin_company_name == null || json.origin_company_name == "")) {
                                    customer_name = escapeHtmlAlternate(json.origin_company_name);
                                }
                            } else if (json.order_type == "Transfer") {
                                var type = "T";
                                if (!(typeof (json.dest_warehouse_info[0].company_name) == "undefined" || json.dest_warehouse_info[0].company_name == "null" || json.dest_warehouse_info[0].company_name == null || json.dest_warehouse_info[0].company_name == "")) {
                                    customer_name = escapeHtmlAlternate(json.dest_warehouse_info[0].company_name);
                                }
                            } else {
                                var type = "D";
                                if (!(typeof (json.dest_company_name) == "undefined" || json.dest_company_name == "null" || json.dest_company_name == null || json.dest_company_name == "")) {
                                    customer_name = escapeHtmlAlternate(json.dest_company_name);
                                }
                            }

                            var remove_pickup_str = "";
                            if (type == "D") {
                                if (json.not_deliverable_rows == 0 || json.is_same_day == 1) {
                                    var disabled = "";
                                    var is_same_day = 1;
                                }
                            } else {
                                if (json.not_pickupable_rows == 0 || json.is_same_day == 1) {
                                    var disabled = "";
                                    var is_same_day = 1;
                                }
                            }
                            if (type == "T") {
                                var trnfr_id = json.transfer_id;
                                var transfer_html = "<span class='btn-danger btn-sm badge ml-auto'>TID #" + trnfr_id + "</span>";
                            } else {
                                var trnfr_id = "";
                                var transfer_html = "";
                            }
                            html_button += '<li class="inner_order_item">';
                            html_button += '<div class="sub-order-item">';
                            var truck_img = image_str;
                            html_button += '<input ' + disabled + ' data-is-same-day="' + is_same_day + '" type="checkbox" value="" id="check' + json.o_id + type + trnfr_id + '" class="ord_search order-seleection-check sub_order_' + (len + 1) + '"  data-order-id="' + json.o_id + type + trnfr_id + '" data-cubes="' + json.total_cubes + '" data-weight="' + json.order_weight + '" data-loc="' + loc_name + '" data-peice="' + json.quantity + '">';
                            html_button += '<label for="check' + json.o_id + type + trnfr_id + '"><strong>' + json.o_id + ' ' + type + ' - ' + customer_name + ' ' + truck_img + '</strong><p class="address1">' + addr + '</p><small class="text-muted"><span class="uni_trk_detail">V-' + json.total_cubes + ' W-' + json.order_weight + ' P-' + json.quantity + '</span>' + transfer_html + order_state + '</small></label> ';
                            html_button += '</div>';
                            html_button += '</li>';
                            html_button += '</ul>';
                            html_button += '</div>';
                            html_button += '</div>';
                            var html_new = html_str1 + html_button;
                            var color_counter = ((len + 1) % 5 + 1);
                            var r_type = '';
                            $('#orders-accordion').append(
                                $('<li />')
                                    .attr('id', 'map-marker-' + (len + 1))
                                    .attr('data-marker-id', (len + 1))
                                    .attr('class', 'depot-result list-group-itemz list-group-item-o loc_name_' + (len + 1) + ' show_marker color' + color_counter)
                                    .html(html_new)
                            );
                            if ($('#truck_chose_' + (len + 1)).val() == null) {
                                $('.sub_order_' + (len + 1)).prop('disabled', true);
                                $('.truck_details_' + (len + 1)).hide();
                            } else {
                                $('.truck_details_' + (len + 1)).show();
                            }
                            cnt = (len + 1);
                            $('#truck_chose_' + cnt).select2({
                                width: '100%',
                                allowClear: true,
                                placeholder: '--Choose a Truck --',
                                ajax: {
                                    url: truckListSelect2Url,
                                    error: function (jqXHR, exception) {
                                        active_xhr = false;
                                    },
                                    data: function (params) {
                                        var query = {
                                            term: params.term,
                                            page: params.page || 1,
                                            size: 10
                                        }
                                        return query;
                                    },
                                    processResults: function (data, params) {
                                        return {
                                            results: data.results,
                                            pagination: {
                                                more: data.pagination.more
                                            }
                                        };
                                    }
                                }
                            }).on("change", function (e) {
                                var select_val = e.currentTarget;
                                var cnt = select_val.id;
                                cnt = parseInt(cnt.replace("truck_chose_", ""));
                                var id = $(select_val).val();
                                var date = $('#save_truck_date').val();
                                if (id == null) {
                                    $('.sub_order_' + cnt).prop('disabled', true);
                                    $('.truck_details_' + cnt).hide();
                                    $.each($('.sub_order_' + cnt), function (key, val) {
                                        $(val).attr("checked", false);
                                        $(val).prop("checked", false);
                                    });

                                } else {
                                    $('.sub_order_' + cnt).prop('disabled', false);
                                    $('.truck_details_' + cnt).show();
                                    $('.assign_btn_' + cnt).prop('disabled', false);
                                    $.ajax({
                                        type: "GET",
                                        cache: false,
                                        url: truckDetailsUrl + "/" + id + "/" + date,
                                        success: function (data) {
                                            var used_vol = $('.t_no_' + id + '_vol').html();
                                            if (typeof used_vol == 'undefined') {
                                                used_vol = 0;
                                            }
                                            var pieces = $('.t_no_' + id + '_pieces').html();
                                            if (typeof pieces == 'undefined') {
                                                pieces = 0;
                                            }
                                            var weight = $('.t_no_' + id + 'wt').html();
                                            if (typeof weight == 'undefined') {
                                                weight = 0;
                                            }
                                            var location = loc_name;
                                            var loc_weight = 0;
                                            var loc_cubes = 0;
                                            $('.total_vol_' + cnt).html(parseInt(data.data.max_volume));
                                            $('.total_wgt_' + cnt).html(parseInt(data.data.max_weight));

                                            $.each($('#orders-accordion').children(), function (key, value) {
                                                if ($(value).find('.assign-order-to-truck').attr('data-loc-key') == location) {
                                                    loc_weight = $(value).find('.assign-order-to-truck').attr('data-total-weight');
                                                    loc_cubes = $(value).find('.assign-order-to-truck').attr('data-total-cubes');
                                                    return false;
                                                }
                                            });
                                            $.each($('#transfer-accordion').children(), function (key, value) {
                                                if ($(value).find('.assign-order-to-truck').attr('data-loc-key') == location) {
                                                    loc_weight = $(value).find('.assign-order-to-truck').attr('data-total-weight');
                                                    loc_cubes = $(value).find('.assign-order-to-truck').attr('data-total-cubes');
                                                    return false;
                                                }
                                            });
                                            OpenSelectionModalDup(location, data.data, loc_weight, loc_cubes, data.data.max_weight - weight, data.data.max_volume - used_vol, cnt);
                                            $('.selected_wgt_' + cnt).html(parseInt($('.selected_wgt_' + cnt).html()) + parseInt(weight));
                                            $('.selected_vol_' + cnt).html(parseInt($('.selected_vol_' + cnt).html()) + parseInt(used_vol));
                                            $('.selected_pcs_' + cnt).html(parseInt($('.selected_pcs_' + cnt).html()) + parseInt(pieces));
                                            $(".pieces").html(pieces);
                                            $(".driver_name").html(data.data.driver);
                                            $('#truck_details_assign').show();
                                        }
                                    });

                                }
                            });
                            $('.assign_btn_' + cnt).on('click', function (e) {
                                var cnt = e.currentTarget.dataset.cnt;
                                var truc_num = $('#truck_chose_' + cnt).val();
                                var $loadingText = '<i class="fa fa-refresh  fa-spin"></i>';
                                $('.assign_btn_' + cnt).html($loadingText);
                                setTimeout(() => {
                                    check_partial_items(loc_name, truc_num, cnt);
                                }, 600);

                                return false;
                            });
                        }
                    }

                }
                $('#t_o_' + order_number).remove();

                if (typeof orders_json[loc_name] == "undefined") {
                    if (push) {
                        orders_json[loc_name] = [json];
                    }
                } else {
                    if (push) {
                        var check_present = 0;
                        $.each(orders_json[loc_name], function (key, value) {
                            var transfer_id = "";
                            if (value.order_type.charAt(0) == "T")
                                transfer_id = value.transfer_id
                            if (value.o_id + value.order_type.charAt(0) + transfer_id == order_number) {
                                check_present = 1;
                            }
                        });
                        if (check_present == 0)
                            orders_json[loc_name].push(json);
                    }
                }
                var indexcheck = $.inArray(order_number, markers_assigned_to_trucks_local);
                if (indexcheck > -1)
                    markers_assigned_to_trucks_local.splice(indexcheck, 1);

            }
        }
        if (trucks_json_truck_number[truck_number] != undefined) {
            scanned_labels_in_truck_left = trucks_json_truck_number[truck_number].scanned_labels_in_truck - scanned_labels_in_order_removed;
            trucks_json_truck_number[truck_number].scanned_labels_in_truck = scanned_labels_in_truck_left;
            total_labels_in_truck_left = trucks_json_truck_number[truck_number].total_labels_in_truck - total_labels_in_order_removed;
            trucks_json_truck_number[truck_number].total_labels_in_truck = total_labels_in_truck_left;
        } else {
            scanned_labels_in_truck_left = 0;
            total_labels_in_truck_left = 0;
        }
        // if (total_labels_in_truck_left > 0) {
            //     label_div = '<div class="label_scan main_div_label_' + truck_number + '">Scanned transfer labels : <span class="label_heighlight"><span class="scanned_label_count_' + truck_number + '">' + scanned_labels_in_truck_left + '</span>/<span class="label_count_' + truck_number + '">' + total_labels_in_truck_left + '</span></div>';
            //     $('.empty_label_div_' + truck_number).html(label_div);
        // } else {
            //     $('.empty_label_div_' + truck_number).html('');
        // }
        if (($('.t_o_no_' + truck_number).children('li').length) == 0) {
            $('.t_no_' + truck_number).remove();
            var routes = $('.scheduled_routes_box').html();
            delete drivers_json[truck_number];
            $('#drivers_json').val(JSON.stringify(drivers_json));
            delete helpers_json[truck_number];
            $('#helpers_json').val(JSON.stringify(helpers_json));
            $('.scheduled_routes_box').html(parseInt(routes) - 1);
            if ($('.trucks_div').find('div.panel-dark').length == 0) {
                $('.No-trucks-div').show();
                $('.trucks_div').hide();
            }
        }
        if ($('#orders-accordion').find('li').length > 0) {
            $('.No-orders-div').hide();
            $('.orders_div').show();
        }
        if ($('#transfer-accordion').find('li').length > 0) {
            $('.No-t-orders-div').hide();
            $('.t-orders_div').show();
        }
        truck_json[truck_number] = truck_data;
        trucks_orders_json = JSON.stringify(truck_json);
        change_trucks_orders(truck_number);
        truck_route_number_polyline(truck_number);
        $('.t_no_' + truck_number + '_pieces').html(present_pieces - removed_pieces);
    }

})(jQuery)