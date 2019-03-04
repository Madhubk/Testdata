(function () {
    'use strict';

    angular
        .module("Application")
        .config(Config);

    Config.$inject = ['$stateProvider', '$ocLazyLoadProvider', "FREIGHTS_CONSTANT"];

    function Config($stateProvider, $ocLazyLoadProvider, FREIGHTS_CONSTANT) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: false,
            serie: false,
            modules: FREIGHTS_CONSTANT.ocLazyLoadModules
        });

        $stateProvider
            .state('EA.FREIGHTS', {
                abstract: true,
                url: '/FREIGHTS',
                templateUrl: 'app/eaxis/shared/freights/freights.html',
                controller: "FreightsController as FreightsCtrl",
                ncyBreadcrumb: {
                    label: 'Freights'
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
                        return $ocLazyLoad.load(['Freights']);
                    }]
                }
            })
            .state('EA.FREIGHTS.booking', {
                url: '/booking',
                templateUrl: 'app/eaxis/buyer/freight/booking/shared/3_booking_list/3_booking.html',
                controller: "three_BookingController as three_BookingCtrl",
                ncyBreadcrumb: {
                    label: 'Booking'
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "DynamicTabLeft", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "customToolbar", "addressDirective", "addressWrapper", "addressModal", "PackingGridDirective", "EditableTableDirective", "RoutingGridDirective", "ContainerEditableGridDirective", "3_BookingList",
                            // Buyer_Forwarder 
                            "1_3_BookingMenu", "1_3_BookingDirective", "1_3_BookingOrder", "1_3_BookingPlanning",
                            // Buyer_Supplier
                            "1_2_BookingMenu", "1_2_BookingDirective", "1_2_BookingOrder", "1_2_BookingPlanning",
                            //Track Shipment
                            "shipmentDetailsTrackingDirective",
                            //ASN Upload
                            "1_2_BookingASNUpload", "1_2_EntityDocUploadDirective", "doc-upload-modal"
                        ]);
                    }]
                }
            })
             //Created by Aniss
             .state('EA.FREIGHTS.BulkUpload', {
                url: '/bulkupload',
                templateUrl: 'app/eaxis/buyer/freight/booking/1_2_bulk-upload/1_3_booking_list/1_3_booking.html',
                controller: "one_three_BookingController as one_three_BookingCtrl",
                ncyBreadcrumb: {
                    label: 'Bulk Upload'
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "DynamicTabLeft", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "customToolbar", "addressDirective", "addressWrapper", "addressModal", "PackingGridDirective", "EditableTableDirective", "RoutingGridDirective", "ContainerEditableGridDirective", "1_3_BookingList",
                            // Buyer_Forwarder 
                            "1_3_BookingMenu", "1_3_BookingDirective", "1_3_BookingOrder", "1_3_BookingPlanning",
                            // Buyer_Supplier
                            "1_2_BookingMenu", "1_2_BookingDirective", "1_2_BookingOrder", "1_2_BookingPlanning",
                            //Track Shipment
                            "shipmentDetailsTrackingDirective",
                            //ASN Upload
                            "1_2_BulkUpload", "1_2_EntityDocUploadDirective","doc-upload-modal"
                        ]);
                    }]
                }
            })
            //End
            .state('EA.FREIGHTS.shipment', {
                url: '/shipment',
                templateUrl: 'app/eaxis/buyer/freight/shipment/shared/3_shipment_list/3_shipment.html',
                controller: "three_ShipmentController as three_ShipmentCtrl",
                ncyBreadcrumb: {
                    label: 'Shipment'
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "DynamicTabLeft",
                            "addressDirective", "addressWrapper", "addressModal", "3_ShipmentList", "1_3_shipmentMenu", "1_3_shipmentGeneral", "1_3_shipmentOrder",
                            "1_3_shipmentConsoleAndPacking",
                            "1_3_shipmentServiceAndReference", "1_3_relatedShipment",
                            "1_3_shipmentPickupAndDelivery",
                            "1_3_shipmentBilling", "RoutingGridDirective", "EditableTableDirective", "1_3_PackingGridDirective", "1_3_ContainerGrid", "1_3_ConsolGrid"
                        ]);
                    }]
                }
            }).state('EA.FREIGHTS.trackshipment', {
                url: '/track-shipment',
                templateUrl: 'app/eaxis/buyer/freight/shipment/shp-buyer-read-only/3_track-shipment.html',
                controller: "three_TrackShipmentController as three_TrackShipmentCtrl",
                ncyBreadcrumb: {
                    label: 'Track Shipment'
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "DynamicTabLeft",
                            "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "Parties", "PartiesModal", "Task", "TaskModal", "Summernote",
                            "shp-buyer-view-template-list", "shp-buyer-view-template", "shp-buyer-view-general", "shp-buyer-view-order", "shp-buyer-view-consol-packing"
                        ]);
                    }]
                }
            })
            .state('EA.FREIGHTS.consolidation', {
                url: '/consolidation',
                templateUrl: 'app/eaxis/buyer/freight/consolidation/shared/3_consol_list/3_consol_list.html',
                controller: "three_ConsolidationController as three_ConsolidationCtrl",
                ncyBreadcrumb: {
                    label: 'Consolidation'
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "DataEvent", "DataEventModal", "EmailGroup", "EmailGroupModal", "EmailTemplateCreation", "EmailTemplateCreationModal", "Task", "TaskModal", "Keyword", "KeywordModal", "Parties", "PartiesModal", "ActivityTab", "MyTaskConfig", "MyTaskDynamicDirective", "MyTaskDefaultEditDirective", "UploadDocument", "AddComment", "ViewDocument", "ViewComment", "3_consol-list", "three-one-consolMenu", "three-one-consolMyTask", "three-one-QuickView", "three-one-consolGeneral", "three-one-ConsolArrivalDeparture", "three-one-ConsolShipment", "EditableTableDirective", "RoutingGridDirective", "PackingGridDirective", "three-one-consolContainer", "three-one-ContainerDirectives", "three-one-consolContainerPopup", "three-one-ConsolPacking", "addressDirective", "addressModal"]);
                    }]
                }
            })
            .state('EA.FREIGHTS.container', {
                url: '/container',
                templateUrl: 'app/eaxis/buyer/freight/container/shared/3_container-list/3_container-list.html',
                controller: "ThreeContainerController as ThreeContainerCtrl",
                ncyBreadcrumb: {
                    label: 'Container'
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "DataEvent", "DataEventModal", "EmailGroup", "EmailGroupModal", "EmailTemplateCreation", "EmailTemplateCreationModal", "Task", "TaskModal", "Keyword", "KeywordModal", "Parties", "PartiesModal", "ActivityTab", "3_container-list", "three-container-directive", "three-one-ContainerDirectives"]);
                    }]
                }
            })
            .state('EA.FREIGHTS.freightDashboard', {
                url: '/dashboard',
                templateUrl: 'app/eaxis/buyer/freight/dashboard/dashboard.html',
                controller: "FreightDashboardController as FreightDashboardCtrl",
                ncyBreadcrumb: {
                    label: 'Dashboard'
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
                        return $ocLazyLoad.load(["dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "confirmation", "chart", "freight-dashboard", "dynamicMultiDashboard", "buyer-dashboard", "supplier-dashboard", "exporter-dashboard", "importer-dashboard", "1_1_poBatchUpload", "1_1_poBatchUploadDirective", "CustomFileUpload", "batch-upload-modal", "1_1_BatchCustomToolBar"]);
                    }]
                }
            }).state('EA.FREIGHTS.freightDashboardCustom', {
                url: '/dashboard_custom',
                templateUrl: 'app/eaxis/buyer/freight/dashboard/dashboard-custom.html',
                controller: "BuyerCustomDashboardController as BuyerCustomDashboardCtrl",
                ncyBreadcrumb: {
                    label: 'Dashboard'
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
                        return $ocLazyLoad.load(["dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "confirmation", "chart", "buyer-dashboard-custom", "dynamicMultiDashboard", "buyer-dashboard-deeconnyc", "1_1_poBatchUpload", "1_1_poBatchUploadDirective", "CustomFileUpload", "batch-upload-modal", "1_1_BatchCustomToolBar"]);
                    }]
                }
            });
    }
})();