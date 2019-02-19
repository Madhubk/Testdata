(function () {
    'use strict';

    angular
        .module("Application")
        .config(Config);

    Config.$inject = ['$stateProvider', '$ocLazyLoadProvider', "ORDER_CONSTANT"];

    function Config($stateProvider, $ocLazyLoadProvider, ORDER_CONSTANT) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: false,
            serie: false,
            modules: ORDER_CONSTANT.ocLazyLoadModules
        });

        $stateProvider
            .state('EA.Buyer', {
                abstract: true,
                url: '/Buyer',
                templateUrl: 'app/eaxis/buyer/shared/purchase-order/order.html',
                controller: "OrderController as OrderCtrl",
                ncyBreadcrumb: {
                    label: 'Order'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(['Order']);
                    }]
                }
            })
            .state('EA.Buyer.order', {
                url: '/Order/order',
                templateUrl: 'app/eaxis/buyer/purchase-order/order-shared/1_order_list/1_order_list.html',
                controller: "one_order_listController as one_order_listCtrl",
                ncyBreadcrumb: {
                    label: 'Order'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "customToolbar", "oneLevelMapping", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "Parties", "PartiesModal", "Task", "TaskModal", "Summernote", "pagination", "addressDirective", "addressWrapper", "addressModal", "errorWarning", "ActivityTab", "MyTaskDirective", "WorkItemListView", "ProcessInstanceWorkItemDetails", "TaskAssignStartComplete", "MyTaskConfig", "MyTaskDynamicDirective", "MyTaskDefaultEditDirective", "1_order_list", "1_1_order-menu", "1_1_order-general", "1_1_orderLines", "1_1_orderLinesFormDirective", "1_1_prodSummary", "1_1_orderCargoReadiness", "1_1_orderShipmentPreAdvice", "1_1_orderVesselPlanning", "1_1_orderShipment", "1_1_orderSplit", "1_1_orderAction", "1_1_OrderCustomToolBar", "1_1_ActiveCustomToolBar", "1_1_OrderConfirmationDirective", "1_1_ConfrimDirective", "1_1_CargoReadinessToolBarDirective", "EditableTableDirective", "1_1_CargoReadinessInLineEditDirective", "1_1_PreAdviceToolBarDirective", "1_1_PreAdviceInLineEditDirective", "3_1_order-general", "1_2_view-template", "DynamicTabLeft", "1_1_my-task", "1_2_order-view-default-general", "1_2_order-view-default-shipment", "1_2_order-view-default-sub-po", "1_2_order-view-default-order-line", "1_3_order-menu", "1_3_order_general", "1_3_orderLines", "1_3_orderLinesFormDirective", "1_3_prodSummary", "1_3_orderCargoReadiness", "1_3_orderShipmentPreAdvice", "1_3_orderVesselPlanning", "1_3_orderShipment", "1_3_orderSplit", "1_3_orderAction", "1_3_my-task", "ord-buyer-view-template", "ord-buyer-view-general", "ord-buyer-view-order-line", "ord-buyer-view-shipment", "ord-buyer-view-sub-po"]);
                    }]
                }
            })
            .state('EA.Buyer.poBatchUpload', {
                url: '/Order/po-batch-upload',
                templateUrl: 'app/eaxis/buyer/batch-upload/order-batch-upload/order-batch-upload.html',
                controller: "one_one_POBatchUploadController as one_one_POBatchUploadCtrl",
                ncyBreadcrumb: {
                    label: 'PO Batch Upload'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "JsonModal", "dynamicGrid", "customToolbar", "Document", "DocumentModal", "1_1_poBatchUpload", "1_1_poBatchUploadDirective", "CustomFileUpload", "batch-upload-modal", "1_1_BatchCustomToolBar", "doc-upload-modal"]);
                    }]
                }
            })
            .state('EA.FORWARDER', {
                abstract: true,
                url: '/FORWARDER',
                templateUrl: 'app/eaxis/shared/purchase-order/order.html',
                controller: "OrderController as OrderCtrl",
                ncyBreadcrumb: {
                    label: 'Order'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(['Order']);
                    }]
                }
            })
            // Forwarder Portal
            .state('EA.FORWARDER.order', {
                url: '/Order/order',
                templateUrl: 'app/eaxis/forwarder/purchase-order/order-shared/3_order_list/3_order_list.html',
                controller: "three_order_listController as three_order_listCtrl",
                ncyBreadcrumb: {
                    label: 'Order'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "customToolbar", "oneLevelMapping", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "Parties", "PartiesModal", "Summernote", "pagination", "addressDirective", "addressWrapper", "addressModal", "errorWarning", "EditableTableDirective", "3_order_list", "3_3_order-menu", "3_3_order-general", "3_3_orderLines", "3_3_orderLinesFormDirective", "3_3_prodSummary", "3_3_orderCargoReadiness", "3_3_orderShipmentPreAdvice", "3_3_orderVesselPlanning", "3_3_orderShipment", "3_3_orderSplit", "3_3_orderAction", "3_3_OrderCustomToolBar", "3_3_ActiveCustomToolBar", "3_3_OrderConfirmationDirective", "3_3_ConfrimDirective", "3_3_CargoReadinessToolBarDirective", "3_3_CargoReadinessInLineEditDirective", "3_3_PreAdviceToolBarDirective", "3_3_PreAdviceInLineEditDirective", "1_3_order-general"]);
                    }]
                }
            })
            // 
            .state('EA.Buyer.trackOrders', {
                url: '/Order/track-orders',
                templateUrl: 'app/eaxis/buyer/purchase-order/order-shared/1_order_readonly_list/track-order.html',
                controller: "TrackOrderListController as TrackOrderListCtrl",
                ncyBreadcrumb: {
                    label: 'Track Orders'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal",
                            "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "customToolbar",
                            "oneLevelMapping", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document",
                            "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event",
                            "EventModal", "AuditLog", "AuditLogModal", "Parties", "PartiesModal", "Task", "TaskModal",
                            "Summernote", "pagination", "addressDirective", "addressWrapper", "addressModal", "errorWarning",
                            "ActivityTab", "MyTaskDirective", "WorkItemListView", "ProcessInstanceWorkItemDetails",
                            "TaskAssignStartComplete", "MyTaskConfig", "MyTaskDynamicDirective", "MyTaskDefaultEditDirective",
                            "DynamicTabLeft", "1_order_list", "track-order-list", "ord-buyer-view-template",
                            "ord-buyer-view-general", "ord-buyer-view-order-line", "ord-buyer-view-shipment",
                            "ord-buyer-view-sub-po", "ord-buyer-view-general-dhc", "ord-buyer-view-order-line-dhc", "ord-buyer-view-shipment-dhc",
                            "ord-buyer-view-sub-po-dhc"
                        ]);
                    }]
                }
            })
            .state('EA.Buyer.trackOrderLines', {
                url: '/Order/track-order-lines',
                templateUrl: 'app/eaxis/buyer/purchase-order/order-shared/1_order_readonly_list-lines/track-order-lines.html',
                controller: "trackOrderLineController as TrackOrderLineCtrl",
                ncyBreadcrumb: {
                    label: 'Track Order SKU'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal",
                            "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "customToolbar",
                            "oneLevelMapping", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document",
                            "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event",
                            "EventModal", "AuditLog", "AuditLogModal", "Parties", "PartiesModal", "Task", "TaskModal",
                            "Summernote", "pagination", "addressDirective", "addressWrapper", "addressModal", "errorWarning",
                            "ActivityTab", "MyTaskDirective", "WorkItemListView", "ProcessInstanceWorkItemDetails",
                            "TaskAssignStartComplete", "MyTaskConfig", "MyTaskDynamicDirective", "MyTaskDefaultEditDirective",
                            "DynamicTabLeft", "1_order_list", "track-order-list", "ord-buyer-view-template", "track-order-line-list",
                            "ord-buyer-view-general", "ord-buyer-view-order-line", "ord-buyer-view-shipment", "track-order-line-list-directive",
                            "ord-buyer-view-sub-po"
                        ]);
                    }]
                }
            })
            .state('EA.Buyer.trackDeliveryOrders', {
                url: '/Order/track-delivery-orders',
                templateUrl: 'app/eaxis/buyer/purchase-order/order-shared/1_delivery_order_readonly_list/track-delivery-order.html',
                controller: "TrackDeliveryOrderListController as TrackDeliveryOrderListCtrl",
                ncyBreadcrumb: {
                    label: 'Track Delivery Orders'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        if (pageAccessService.CheckAuthToken()) {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }],
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "customToolbar", "oneLevelMapping", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "Parties", "PartiesModal", "Task", "TaskModal", "Summernote", "pagination", "addressDirective", "addressWrapper", "addressModal", "errorWarning", "ActivityTab", "MyTaskDirective", "WorkItemListView", "ProcessInstanceWorkItemDetails", "TaskAssignStartComplete", "MyTaskConfig", "MyTaskDynamicDirective", "MyTaskDefaultEditDirective", "DynamicTabLeft", "1_order_list", "track-delivery-order-list", "delivery-ord-buyer-view-template", "delivery-ord-buyer-view-general", "delivery-ord-buyer-view-order-line", "ord-buyer-view-shipment", "ord-buyer-view-sub-po"]);
                    }]
                }
            });
    }
})();