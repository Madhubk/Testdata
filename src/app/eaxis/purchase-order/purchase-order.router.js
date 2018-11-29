(function () {
    'use strict';

    angular
        .module("Application")
        .config(Config);

    Config.$inject = ['$stateProvider', '$ocLazyLoadProvider', "PURCHASE_ORDER_CONSTANT"];

    function Config($stateProvider, $ocLazyLoadProvider, PURCHASE_ORDER_CONSTANT) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: false,
            serie: false,
            modules: PURCHASE_ORDER_CONSTANT.ocLazyLoadModules
        });

        $stateProvider
            .state('EA.PO', {
                abstract: true,
                url: '/PO',
                templateUrl: 'app/eaxis/purchase-order/purchase-order.html',
                controller: "PurchaseOrderController as PurchaseOrderCtrl",
                ncyBreadcrumb: {
                    label: 'Purchase Order'
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
                        return $ocLazyLoad.load(['PurchaseOrder']);
                    }]
                }
            })
            .state('EA.PO.orderDashboard', {
                url: '/dashboard',
                templateUrl: 'app/eaxis/purchase-order/order-dashboard/order-dashboard.html',
                controller: "OrderDashController as OrderDashCtrl",
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
                        return $ocLazyLoad.load(["chart", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "orderDashboard"]);
                    }]
                }
            })
            .state('EA.PO.order', {
                url: '/order',
                templateUrl: 'app/eaxis/purchase-order/order/order.html',
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
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "Parties", "PartiesModal", "customToolbar", "order", "orderAction", "orderMenu", "orderGeneral", "orderLines", "prodSummary", "orderLinesFormDirective", "orderCargoReadiness", "orderShipmentPreAdvice", "orderShipment", "preAdvice", "orderSplit", "addressDirective", "addressWrapper", "addressModal", "sfuDirective", "sfuGridDirective", "sfuHistory", "orderVesselPlanning", "errorWarning", "Summernote", "pagination", "OrderCustomToolBar", "preAdviceDirective", "preAdviceBookingDirective", "preAdviceGirdDirective", "VesselPanningPreAdvice", "SendPreAdviceMailHistory", "ConfrimDirective", "ActiveCustomToolBar", "OrderConfirmationDirective", "CargoReadinessToolBarDirective", "CargoReadinessInLineEditDirective", "EditableTableDirective", "PreAdviceToolBarDirective", "PreAdviceInLineEditDirective"]);
                    }]
                }
            })
            .state('EA.PO.orderLines', {
                url: '/order-lines',
                templateUrl: 'app/eaxis/purchase-order/order-lines/order-lines.html',
                controller: "OrderLinesController as OrderLinesCtrl",
                ncyBreadcrumb: {
                    label: 'Order Lines'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "order", "orderLinesFiles", "orderLinesDirective", "orderLinesFormDirective"]);
                    }]
                }
            })
            .state('EA.PO.preAdvice', {
                url: '/pre-advice',
                templateUrl: 'app/eaxis/purchase-order/pre-advice/pre-advice.html',
                controller: "preAdviceController as PreAdviceCtrl",
                ncyBreadcrumb: {
                    label: 'Pre Advice'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "Email", "EmailModal", "EmailDirective", "preAdvice", "preAdviceDirective", "preAdviceModal", "preAdviceDetachModal", "preAdviceCancelModal", "preAdviceBookingDirective", "preAdviceGirdDirective", "VesselPanningPreAdvice", "SendPreAdviceMailHistory", "pagination", "Summernote", "errorWarning"]);
                    }]
                }
            })
            .state('EA.PO.poBatchUpload', {
                url: '/po-batch-upload',
                templateUrl: 'app/eaxis/purchase-order/po-batch-upload/po-batch-upload.html',
                controller: "POBatchUploadController as POBatchUploadCtrl",
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "JsonModal", "dynamicGrid", "poBatchUpload", "poBatchUploadDirective", "order", "orderAction", "orderMenu", "orderGeneral", "orderLines", "prodSummary", "orderLinesFormDirective", "orderCargoReadiness", "orderShipmentPreAdvice", "orderShipment", "preAdvice", "orderSplit", "addressDirective", "addressWrapper", "addressModal", "sfuDirective", "sfuGridDirective", "sfuHistory", "orderVesselPlanning", "CustomFileUpload"]);
                    }]
                }
            })
            .state('EA.PO.orderReport', {
                url: '/order-report',
                templateUrl: 'app/eaxis/purchase-order/order-report/order-report.html',
                controller: "orderReportController as OrderReportCtrl",
                ncyBreadcrumb: {
                    label: 'Order Report'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "orderReport"]);
                    }]
                }
            });
    }
})();