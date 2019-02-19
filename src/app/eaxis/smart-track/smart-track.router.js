(function () {
    'use strict';

    angular
        .module("Application")
        .config(Config);

    Config.$inject = ['$stateProvider', '$ocLazyLoadProvider', "SMART_TRACK_CONSTANT"];

    function Config($stateProvider, $ocLazyLoadProvider, SMART_TRACK_CONSTANT) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: false,
            serie: false,
            modules: SMART_TRACK_CONSTANT.ocLazyLoadModules
        });

        $stateProvider
            .state('EA.smartTrack', {
                abstract: true,
                url: '/smart-track',
                templateUrl: 'app/eaxis/smart-track/smart-track.html',
                controller: "SmartTrackController as SmartTrackCtrl",
                ncyBreadcrumb: {
                    label: 'Smart Track'
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
                        return $ocLazyLoad.load(['smartTrack']);
                    }]
                }
            })
            .state('EA.smartTrack.trackOrders', {
                url: '/track-orders',
                templateUrl: 'app/eaxis/smart-track/track-orders/track-orders.html',
                controller: "TrackOrderController as TrackOrderCtrl",
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "customToolbar", "oneLevelMapping", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "Parties", "PartiesModal", "Task", "TaskModal", "Summernote", "pagination", "addressDirective", "addressWrapper", "addressModal", "errorWarning", "ActivityTab", "MyTaskDirective", "WorkItemListView", "ProcessInstanceWorkItemDetails", "TaskAssignStartComplete", "MyTaskConfig", "MyTaskDynamicDirective", "MyTaskDefaultEditDirective", "DynamicTabLeft", "1_order_list", "orderTracking", "ord-buyer-view-template", "ord-buyer-view-general", "ord-buyer-view-order-line", "ord-buyer-view-shipment", "ord-buyer-view-sub-po"]);
                    }]
                }
            })
            .state('EA.smartTrack.trackOrderLines', {
                url: '/track-order-lines',
                templateUrl: 'app/eaxis/smart-track/track-order-lines/track-order-lines.html',
                controller: "trackOrderLineController as TrackOrderLineCtrl",
                ncyBreadcrumb: {
                    label: 'Track OrderLines'
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "confirmation", "compareDate", 
                        "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid",
                         "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", 
                         "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", 
                         "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", 
                         "AuditLogModal", "DataEvent", "DataEventModal", "EmailGroup", "EmailGroupModal", 
                         "EmailTemplateCreation", "EmailTemplateCreationModal", "Task", "TaskModal", 
                         "Keyword", "KeywordModal", "Parties", "PartiesModal", "ActivityTab", 
                         "orderLinesTracking", "orderLinesTrackingDirective", "orderLinesFiles"]);
                    }]
                }
            })
            .state('EA.smartTrack.trackShipments', {
                url: '/track-shipments',
                templateUrl: 'app/eaxis/smart-track/track-shipments/track-shipments.html',
                controller: "trackShipmentController as TrackShipmentCtrl",
                ncyBreadcrumb: {
                    label: 'Track Shipments'
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "DataEvent", "DataEventModal", "EmailGroup", "EmailGroupModal", "EmailTemplateCreation", "EmailTemplateCreationModal", "Task", "TaskModal", "Keyword", "KeywordModal", "Parties", "PartiesModal", "ActivityTab", "shipmentTracking", "shipment", "shipmentTrackingDirective"]);
                    }]
                }
            })
            .state('EA.smartTrack.trackContainers', {
                url: '/track-containers',
                templateUrl: 'app/eaxis/smart-track/track-containers/track-containers.html',
                controller: "trackContainerController as TrackContainerCtrl",
                ncyBreadcrumb: {
                    label: 'Track Containers'
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "DataEvent", "DataEventModal", "EmailGroup", "EmailGroupModal", "EmailTemplateCreation", "EmailTemplateCreationModal", "Task", "TaskModal", "Keyword", "KeywordModal", "Parties", "PartiesModal", "ActivityTab", "containerTracking", "containerTrackingDirective"]);
                    }]
                }
            })
            .state('EA.smartTrack.trackShipmentsdetails', {
                url: '/track-shipments-details',
                templateUrl: 'app/eaxis/smart-track/track-shipments-details/track-shipments-details.html',
                controller: "trackShipmentDetailsController as TrackShipmentDetailsCtrl",
                ncyBreadcrumb: {
                    label: 'Track Shipments Details'
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "DataEvent", "DataEventModal", "EmailGroup", "EmailGroupModal", "EmailTemplateCreation", "EmailTemplateCreationModal", "Task", "TaskModal", "Keyword", "KeywordModal", "Parties", "PartiesModal", "ActivityTab", "MyTaskDynamicDirective", "QuickBookingApprovalEditDirective", "VerifyBookingEditDirective", "VerifyBookingVesselPlanning", "QuickBookingApprovalNotifyEditDirective", "QuickBookingRejectEditDirective", "shipmentDetailsTracking", "shipment", "shipmentDetailsTrackingDirective", "HBLEditDirective", "ShippingBillEditDirective", "CargoPickUpEditDirective", "TaxInvoiceEditDirective", "JobCostSheetEditDirective", "ShpGeneralFieldsDirective", "ShipmentEntityDetailsDirective", "VgmFilingEditDirective", "PartiesDetailsDirective", "RoutingGridDirective", "EditableTableDirective", "ShipmentDetailsDirective", "PackingGridDirective", "ContainerEditableGridDirective1"]);
                    }]
                }
            })
    }
})();