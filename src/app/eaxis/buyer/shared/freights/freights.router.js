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
            .state('EA.Freight', {
                abstract: true,
                url: '/Buyer/Freight',
                templateUrl: 'app/eaxis/buyer/shared/freights/freights.html',
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
            .state('EA.Freight.booking', {
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "errorWarning", "confirmation", "compareDate", 
                        "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", 
                        "oneLevelMapping", "Summernote", "CustomFileUpload", "DynamicTabLeft", "standardMenu", "Comment", 
                        "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", 
                        "ExceptionModal", "Event", "EventModal", "customToolbar", "addressDirective", "addressWrapper", 
                        "addressModal", "3_BookingList",
                            // Buyer_Forwarder 
                            "1_3_BookingMenu", "1_3_BookingDirective", "1_3_BookingOrder", "1_3_BookingPlanning",
                            // Buyer_Supplier
                            "1_2_BookingMenu", "1_2_BookingDirective", "1_2_BookingOrder", "1_2_BookingPlanning",
                            //Track Shipment
                            "shipmentDetailsTrackingDirective", "1_3_Ext_WHP_BookingMenu"
                        ]);
                    }]
                }
            })
            .state('EA.Freight.uploadbooking', {
                url: '/upload-booking',
                templateUrl: 'app/eaxis/buyer/freight/booking/upload-booking/upload-booking.html',
                controller: "UploadBookingController as UploadBookingCtrl",
                ncyBreadcrumb: {
                    label: 'Upload Booking'
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "errorWarning", "confirmation", "compareDate",
                         "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop",
                         "Document", "DocumentModal", "CustomFileUpload", "UploadBooking",
                            //ASN Upload
                            "1_2_BookingASNUpload", "1_2_EntityDocUploadDirective", "doc-upload-modal", "1_2_Bulk_Upload"
                        ]);
                    }]
                }
            })
            //End
            .state('EA.Freight.icm', {
                url: '/icm',
                templateUrl: 'app/eaxis/buyer/freight/container/1_2_icm-upload/1_3_icm_list/1_3_icm.html',
                controller: "one_three_IcmController as one_three_IcmCtrl",
                ncyBreadcrumb: {
                    label: 'Import Container Management'
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "errorWarning", "confirmation", "compareDate", 
                        "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", 
                        "oneLevelMapping", "Summernote", "CustomFileUpload", "DynamicTabLeft", "standardMenu", "Comment", 
                        "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", 
                        "ExceptionModal", "Event", "EventModal", "customToolbar", "addressDirective", "addressWrapper", 
                        "addressModal", "PackingGridDirective", "EditableTableDirective", "RoutingGridDirective", 
                        "cnt-buyer-view-template-list", "cnt-buyer-view-template", "cnt-buyer-view-general", 
                        "cnt-buyer-view-order", "cnt-buyer-view-shipment",
                            //ASN Upload
                            "1_2_EntityDocUploadDirective", "doc-upload-modal", "icm-request-delivery-toolbar", 
                            "icm-request-delivery-toolbar-modal", "1_3_ICM_List", "1_3_ICMUpload", "container-delivery-details"
                        ]);
                    }]
                }
            })
            .state('EA.Freight.shipment', {
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "errorWarning", "confirmation", "compareDate",
                         "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop",
                          "DynamicTabLeft","CustomFileUpload","standardMenu", "Comment", 
                          "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", 
                          "ExceptionModal", "Event", "EventModal", "customToolbar", "addressDirective", "addressWrapper", "addressModal", "3_ShipmentList", "1_3_shipmentMenu", "1_3_shipmentGeneral", "1_3_shipmentOrder",
                            "1_3_shipmentConsoleAndPacking",
                            "1_3_shipmentServiceAndReference", "1_3_relatedShipment",
                            "1_3_shipmentPickupAndDelivery",
                            "1_3_shipmentBilling", "RoutingGridDirective", "EditableTableDirective", "1_3_PackingGridDirective", "1_3_ContainerGrid", "1_3_ConsolGrid"
                        ]);
                    }]
                }
            }).state('EA.Freight.trackshipment', {
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "confirmation", "compareDate", 
                        "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", 
                        "DynamicTabLeft","CustomFileUpload","customToolbar", "addressDirective", 
                        "addressWrapper", "addressModal",
                            "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", 
                            "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", 
                            "AuditLogModal", "Parties", "PartiesModal", "Task", "TaskModal", "Summernote",
                            "shp-buyer-view-template-list", "shp-buyer-view-template", "shp-buyer-view-general", "shp-buyer-view-order", "shp-buyer-view-consol-packing", "Order"
                        ]);
                    }]
                }
            })
            .state('EA.Freight.trackcontainers', {
                url: '/track-containers',
                templateUrl: 'app/eaxis/buyer/freight/container/cnt_buyer-read-only/3_track-container.html',
                controller: "three_TrackContainerController as three_TrackContainerCtrl",
                ncyBreadcrumb: {
                    label: 'Track Container'
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "confirmation", "compareDate", 
                        "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", 
                        "drogAndDrop", "DynamicTabLeft","CustomFileUpload",
                            "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", 
                            "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", 
                            "AuditLog", "AuditLogModal", "Parties", "PartiesModal", "Task", "TaskModal", "Summernote",
                            "cnt-buyer-view-template-list", "cnt-buyer-view-template", "cnt-buyer-view-general", "cnt-buyer-view-order", "cnt-buyer-view-shipment"
                        ]);
                    }]
                }
            })
            .state('EA.Freight.consolidation', {
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "errorWarning", "confirmation", "compareDate",
                         "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop",
                          "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal",
                           "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", 
                           "Event", "EventModal", "AuditLog", "AuditLogModal", "DataEvent", "DataEventModal", "EmailGroup",
                            "EmailGroupModal", "EmailTemplateCreation", "EmailTemplateCreationModal", "Task", "TaskModal", 
                            "Keyword", "KeywordModal", "Parties", "PartiesModal", "ActivityTab", "MyTaskConfig", 
                            "MyTaskDynamicDirective", "MyTaskDefaultEditDirective", "UploadDocument", "AddComment", 
                            "ViewDocument", "ViewComment", "3_consol-list", "three-one-consolMenu", "three-one-consolMyTask", 
                            "three-one-QuickView", "three-one-consolGeneral", "three-one-ConsolArrivalDeparture", "three-one-ConsolShipment", "EditableTableDirective", "RoutingGridDirective", "PackingGridDirective", "three-one-consolContainer", "three-one-ContainerDirectives", "three-one-consolContainerPopup", "three-one-ConsolPacking", "addressDirective", "addressModal","MyTaskDirective"]);
                    }]
                }
            })
            .state('EA.Freight.container', {
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "errorWarning", "confirmation", "compareDate",
                         "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", 
                         "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", 
                         "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal",
                          "Event", "EventModal", "AuditLog", "AuditLogModal", "DataEvent", "DataEventModal", "EmailGroup", 
                          "EmailGroupModal", "EmailTemplateCreation", "EmailTemplateCreationModal", "Task", "TaskModal", 
                          "Keyword", "KeywordModal", "Parties", "PartiesModal", "ActivityTab", "3_container-list", 
                          "three-container-directive", "three-one-ContainerDirectives"]);
                    }]
                }
            })
            .state('EA.Freight.freightDashboard', {
                url: '/dashboard',
                templateUrl: 'app/eaxis/buyer/dashboard/dashboard.html',
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
                        return $ocLazyLoad.load(["dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", 
                        "dynamicGrid", "confirmation", "chart", "dynamic-dashboard", "dynamicMultiDashboard",
                         "dashboard-default", "buyer-dashboard", "supplier-dashboard", "exporter-dashboard", 
                         "importer-dashboard", "1_1_poBatchUpload", "1_1_poBatchUploadDirective", "CustomFileUpload", 
                         "batch-upload-modal", "1_1_BatchCustomToolBar"]);
                    }]
                }
            }).state('EA.Freight.freightDashboardCustom', {
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
                        return $ocLazyLoad.load(["dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl",
                         "dynamicGrid", "confirmation", "chart", "buyer-dashboard-custom", "dynamicMultiDashboard",
                          "buyer-dashboard-deeconnyc", "1_1_poBatchUpload", "1_1_poBatchUploadDirective", "CustomFileUpload",
                           "batch-upload-modal", "1_1_BatchCustomToolBar"]);
                    }]
                }
            })
            .state('EA.Freight.allDocuments', {
                url: '/all-documents',
                templateUrl: 'app/eaxis/buyer/documents/all-documents.html',
                controller: "FreightAllDocumentsController as FreightAllDocumentsCtrl",
                ncyBreadcrumb: {
                    label: 'Freight Document List'
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
                        return $ocLazyLoad.load(["dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", 
                        "dynamicGrid", "confirmation", "FreightDocList"]);
                    }]
                }
            });
    }
})();