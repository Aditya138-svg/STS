<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\Accounting\PaymentsController;
use App\Http\Controllers\Admin\Accounting\TipManagementController;
use App\Http\Controllers\Admin\AdminSection\TasksController;
use App\Http\Controllers\Admin\AdminSection\UsersController;
use App\Http\Controllers\Admin\AdminSection\UserGroupsController;
use App\Http\Controllers\Admin\OrderManagement\OrdersController;
use App\Http\Controllers\Admin\OrderManagement\QuotesController;
use App\Http\Controllers\Admin\MySettings\MyProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function (): void {

        // dashboard
        Route::prefix('dashboard')
            ->name('dashboard.')
            ->group(function (): void {
                Route::get('/', [DashboardController::class, 'index'])->name('index');
            });

        // accounting
        Route::prefix('accounting')
            ->name('accounting.')
            ->group(function (): void {
                Route::get('/qb-status', fn () => Inertia::render('Admin/Accounting/QBStatus'))->name('qb_status');

                // payments
                Route::prefix('payments')
                    ->name('payments.')
                    ->group(function (): void {
                        Route::get('/all-orders', [PaymentsController::class, 'allOrders'])->name('all_orders');
                        Route::get('/billed-orders', [PaymentsController::class, 'billedOrders'])->name('billed_orders');
                        Route::get('/cancelled-orders', [PaymentsController::class, 'cancelledOrders'])->name('cancelled_orders');
                        Route::get('/completed-orders', [PaymentsController::class, 'completedOrders'])->name('completed_orders');
                        Route::get('/consolidated-invoice', [PaymentsController::class, 'consolidatedInvoice'])->name('consolidated_invoice');
                        Route::get('/paid-orders', [PaymentsController::class, 'paidOrders'])->name('paid_orders');
                        Route::get('/prepaid-orders', [PaymentsController::class, 'prePaidOrders'])->name('prepaid_orders');
                    });

                // scanned documents
                Route::prefix('scanned-documents')
                    ->name('scanned_documents.')
                    ->group(function (): void {
                        Route::get('/map-docs', fn () => Inertia::render('Admin/Accounting/ScannedDocuments/MapDocs'))->name('map_docs');
                        Route::get('/upload-docs', fn () => Inertia::render('Admin/Accounting/ScannedDocuments/UploadDocs'))->name('upload_docs');
                    });

                // tip management
                Route::prefix('tip-management')
                    ->name('tip_management.')
                    ->group(function (): void {
                        Route::get('/pending-tips', [TipManagementController::class, 'pendingTips'])->name('pending_tips');
                        Route::get('/tip-payout', [TipManagementController::class, 'tipPayout'])->name('tip_payout');
                        Route::get('/tip-report', [TipManagementController::class, 'tipReport'])->name('tip_report');
                    });
            });

        // admin section
        Route::prefix('admin-section')
            ->name('admin_section.')
            ->group(function (): void {
                Route::get('/associates', fn () => Inertia::render('Admin/AdminSection/Associates'))->name('associates');
                Route::get('/dnd-emails', fn () => Inertia::render('Admin/AdminSection/DNDEmails'))->name('dnd_emails');
                Route::get('/items', fn () => Inertia::render('Admin/AdminSection/Items'))->name('items');
                Route::get('/projects', fn () => Inertia::render('Admin/AdminSection/Projects'))->name('projects');
                Route::get('/reason-code', fn () => Inertia::render('Admin/AdminSection/ReasonCode'))->name('reason_code');
                Route::get('/service-layer', fn () => Inertia::render('Admin/AdminSection/ServiceLayer'))->name('service_layer');

                // accessorials
                Route::prefix('accessorials')
                    ->name('accessorials.')
                    ->group(function (): void {
                        Route::get('/default-accessorials', fn () => Inertia::render('Admin/AdminSection/Accessorials/DefaultAccessorials'))->name('default_accessorials');
                    });

                // tasks
                Route::prefix('tasks')
                    ->name('tasks.')
                    ->group(function (): void {
                        Route::get('/my-task', [TasksController::class, 'myTask'])->name('my_task');
                        Route::get('/overall-task', [TasksController::class, 'overallTask'])->name('overall_task');
                        Route::get('/private-notes', [TasksController::class, 'privateNotes'])->name('private_notes');
                        Route::get('/public-notes', [TasksController::class, 'publicNotes'])->name('public_notes');
                    });

                // users
                Route::prefix('users')
                    ->name('users.')
                    ->group(function (): void {
                        Route::prefix('group')->name('group.')->group(function (): void {
                            Route::get('/', [UserGroupsController::class, 'index'])->name('index');
                            Route::get('/get-users', [UserGroupsController::class, 'getGroupUsers'])->name('get_group_users');
                            Route::post('/bulk-delete', [UserGroupsController::class, 'bulkDelete'])->name('bulk_delete');
                        });
                        Route::get('/over-due-report', fn () => Inertia::render('Admin/AdminSection/Users/OverDueReport'))->name('over_due_report');
                        Route::get('/pricing', fn () => Inertia::render('Admin/AdminSection/Users/Pricing'))->name('pricing');
                        Route::get('/user/create', [UsersController::class, 'create'])->name('create');
                        Route::get('/user/{user}', [UsersController::class, 'show'])->name('show');
                        Route::get('/user/{user}/edit', [UsersController::class, 'edit'])->name('edit');
                        Route::post('/user/bulk-delete', [UsersController::class, 'bulkDestroy'])->name('bulk_delete');
                        Route::get('/user', [UsersController::class, 'index'])->name('index');
                    });
            });

        // dispatch scheduling
        Route::prefix('dispatch-scheduling')
            ->name('dispatch_scheduling.')
            ->group(function (): void {
                Route::get('/check-service-area', fn () => Inertia::render('Admin/DispatchScheduling/CheckServiceArea'))->name('check_service_area');
                Route::get('/survey-list', fn () => Inertia::render('Admin/DispatchScheduling/SurveyList'))->name('survey_list');
                Route::prefix('zipcode-management')->name('zipcode_management.')->group(function (): void {
                    Route::get('/', [App\Http\Controllers\Admin\DispatchScheduling\ZipcodeManagementController::class, 'index'])->name('index');
                    Route::post('/', [App\Http\Controllers\Admin\DispatchScheduling\ZipcodeManagementController::class, 'store'])->name('store');
                    Route::post('/delete', [App\Http\Controllers\Admin\DispatchScheduling\ZipcodeManagementController::class, 'destroy'])->name('destroy');
                    Route::post('/delete-single', [App\Http\Controllers\Admin\DispatchScheduling\ZipcodeManagementController::class, 'destroySingle'])->name('destroySingle');
                    Route::post('/get', [App\Http\Controllers\Admin\DispatchScheduling\ZipcodeManagementController::class, 'getZipcode'])->name('get');
                    Route::post('/location-zipcodes', [App\Http\Controllers\Admin\DispatchScheduling\ZipcodeManagementController::class, 'storeLocationZipcodes'])->name('storeLocationZipcodes');
                    Route::get('/tier', fn () => Inertia::render('Admin/DispatchScheduling/ZipCodeManagement/Tier'))->name('tier');
                    Route::get('/conflict-zipcode', fn () => Inertia::render('Admin/DispatchScheduling/ZipCodeManagement/ConflictZipcode'))->name('conflict_zipcode');
                });

                // dispatcher
                Route::prefix('dispatcher')
                    ->name('dispatcher.')
                    ->group(function (): void {
                        Route::get('/dashboard', fn () => Inertia::render('Admin/DispatchScheduling/Dispatcher/Dashboard'))->name('dashboard');
                        Route::get('/dynamic-forms', fn () => Inertia::render('Admin/DispatchScheduling/Dispatcher/DynamicForms'))->name('dynamic_forms');
                        Route::get('/notification', fn () => Inertia::render('Admin/DispatchScheduling/Dispatcher/Notification'))->name('notification');
                        Route::get('/routes', fn () => Inertia::render('Admin/DispatchScheduling/Dispatcher/Routes'))->name('routes');
                        Route::get('/transfer', fn () => Inertia::render('Admin/DispatchScheduling/Dispatcher/Transfer'))->name('transfer');
                        Route::get('/what-next', fn () => Inertia::render('Admin/DispatchScheduling/Dispatcher/WhatNext'))->name('what_next');

                        // one time setting
                        Route::prefix('one-time-setting')
                            ->name('one_time_setting.')
                            ->group(function (): void {
                                Route::get('/drivers', fn () => Inertia::render('Admin/DispatchScheduling/Dispatcher/OneTimeSetting/Drivers'))->name('drivers');
                                Route::get('/trucks', fn () => Inertia::render('Admin/DispatchScheduling/Dispatcher/OneTimeSetting/Trucks'))->name('trucks');
                            });

                        // undelivered orders
                        Route::prefix('undelivered-orders')
                            ->name('undelivered_orders.')
                            ->group(function (): void {
                                Route::get('/routed-orders', fn () => Inertia::render('Admin/DispatchScheduling/Dispatcher/UnDeliveredOrders/RoutedOrders'))->name('routed_orders');
                                Route::get('/unrouted-orders', fn () => Inertia::render('Admin/DispatchScheduling/Dispatcher/UnDeliveredOrders/UnRoutedOrders'))->name('unrouted_orders');
                            });
                    });

                // scheduling
                Route::prefix('scheduling')
                    ->name('scheduling.')
                    ->group(function (): void {
                        Route::get('/holiday-setting', fn () => Inertia::render('Admin/DispatchScheduling/Scheduling/HolidaySetting'))->name('holiday_setting');
                        Route::get('/order-avail-to-schedule', fn () => Inertia::render('Admin/DispatchScheduling/Scheduling/OrderAvailToSchedule'))->name('order_avail_to_schedule');
                        Route::get('/order-not-in-service-area', fn () => Inertia::render('Admin/DispatchScheduling/Scheduling/OrderNotInServiceArea'))->name('order_not_in_service_area');
                        Route::get('/order-responded', fn () => Inertia::render('Admin/DispatchScheduling/Scheduling/OrderResponded'))->name('order_responded');
                        Route::get('/order-reviewed', fn () => Inertia::render('Admin/DispatchScheduling/Scheduling/OrderReviewed'))->name('order_reviewed');
                        Route::get('/terttiory-setting', fn () => Inertia::render('Admin/DispatchScheduling/Scheduling/TerttiorySetting'))->name('terttiory_setting');
                        Route::get('/volume-setting', fn () => Inertia::render('Admin/DispatchScheduling/Scheduling/VolumeSetting'))->name('volume_setting');
                    });
            });

        // my settings
        Route::prefix('my-settings')
            ->name('my_settings.')
            ->group(function (): void {
                Route::get('/my-profile', [MyProfileController::class, 'edit'])->name('my_profile');
                Route::post('/my-profile', [MyProfileController::class, 'update'])->name('my_profile.update');
                Route::get('/remote-printing', fn () => Inertia::render('Admin/MySettings/RemotePrinting'))->name('remote_printing');
                Route::get('/setting', fn () => Inertia::render('Admin/MySettings/Setting'))->name('setting');
            });

        // order management
        Route::prefix('order-management')
            ->name('order_management.')
            ->group(function (): void {
                Route::get('/publish-survey-comment', fn () => Inertia::render('Admin/OrderManagement/PublishSurveyComment'))->name('publish_survey_comment');
                Route::get('/quotes', [QuotesController::class, 'index'])->name('quotes');
                Route::post('/quotes', [QuotesController::class, 'store'])->name('quotes.store');
                Route::get('/quotes/create', [QuotesController::class, 'create'])->name('quotes.create');
                Route::get('/quotes/verify-zip/{zip}', [QuotesController::class, 'verifyZip'])->name('quotes.verify_zip');
                Route::get('/quotes/{quote}', [QuotesController::class, 'show'])->name('quotes.show');
                Route::get('/quotes/{quote}/edit', [QuotesController::class, 'edit'])->name('quotes.edit');
                Route::post('/quotes/{quote}', [QuotesController::class, 'update'])->name('quotes.update');

                // addresses
                Route::prefix('addresses')
                    ->name('addresses.')
                    ->group(function (): void {
                        Route::get('/address-book', fn () => Inertia::render('Admin/OrderManagement/Addresses/AddressBook'))->name('address_book');
                        Route::get('/depot-address', fn () => Inertia::render('Admin/OrderManagement/Addresses/DepotAddress'))->name('depot_address');
                        Route::get('/duplicate-address', fn () => Inertia::render('Admin/OrderManagement/Addresses/DuplicateAddress'))->name('duplicate_address');
                        Route::get('/non-billable-address', fn () => Inertia::render('Admin/OrderManagement/Addresses/NonBillableAddress'))->name('non_billable_address');
                    });

                // orders
                Route::prefix('orders')
                    ->name('orders.')
                    ->group(function (): void {
                        Route::get('/all-orders', [OrdersController::class, 'allOrders'])->name('all_orders');
                        Route::get('/need-attention', [OrdersController::class, 'needAttention'])->name('need_attention');
                        Route::get('/new-orders', [OrdersController::class, 'newOrders'])->name('new_orders');
                        Route::post('/cancel', [OrdersController::class, 'cancel'])->name('cancel');
                        Route::post('/complete', [OrdersController::class, 'complete'])->name('complete');
                        Route::post('/send-notification', [OrdersController::class, 'sendNotification'])->name('send_notification');
                        Route::post('/bulk-push-pickups', [OrdersController::class, 'bulkPushPickups'])->name('bulk_push_pickups');
                        Route::post('/bulk-push-deliveries', [OrdersController::class, 'bulkPushDeliveries'])->name('bulk_push_deliveries');
                    });

                // warehouse
                Route::prefix('warehouse')
                    ->name('warehouse.')
                    ->group(function (): void {
                        Route::get('/racks', fn () => Inertia::render('Admin/OrderManagement/WareHouse/Racks'))->name('racks');
                        Route::get('/recieve-in-records', fn () => Inertia::render('Admin/OrderManagement/WareHouse/RecieveInRecords'))->name('recieve_in_records');
                        Route::get('/tickets', fn () => Inertia::render('Admin/OrderManagement/WareHouse/Tickets'))->name('tickets');
                    });
            });
    });
