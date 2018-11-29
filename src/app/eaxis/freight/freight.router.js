(function () {
    'use strict';

    angular
        .module("Application")
        .config(Config);

    Config.$inject = ['$stateProvider', '$ocLazyLoadProvider', "FREIGHT_CONSTANT"];

    function Config($stateProvider, $ocLazyLoadProvider, FREIGHT_CONSTANT) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: false,
            serie: false,
            modules: FREIGHT_CONSTANT.ocLazyLoadModules
        });

        $stateProvider
            .state('EA.freight', {
                abstract: true,
                url: '/freight',
                templateUrl: 'app/eaxis/freight/freight.html',
                controller: "FreightController as FreightCtrl",
                ncyBreadcrumb: {
                    label: 'Freight'
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
                        return $ocLazyLoad.load(["Freight"]);
                    }]
                }
            })
            .state('EA.freight.freightDashboard', {
                url: '/dashboard',
                templateUrl: 'app/eaxis/freight/dashboard/dashboard.html',
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
                        return $ocLazyLoad.load(["chart", "FreightDashboard", "dynamicMultiDashboard", "BuyerDashboard", "SupplierDashboard", "ExporterDashboard", "ImporterDashboard"]);
                    }]
                }
            })
            .state('EA.freight.shipment', {
                url: '/shipment',
                templateUrl: 'app/eaxis/freight/shipment/shipment.html',
                controller: "ShipmentController as ShipmentCtrl",
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "errorWarning", "FreightConfirmation", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "DataEvent", "DataEventModal", "EmailGroup", "EmailGroupModal", "EmailTemplateCreation", "EmailTemplateCreationModal", "Task", "TaskModal", "Keyword", "KeywordModal", "Parties", "PartiesModal", "customToolbar", "ActivityTab", "MyTaskDirective", "WorkItemListView", "ProcessInstanceWorkItemDetails", "TaskAssignStartComplete", "MyTaskConfig", "MyTaskDynamicDirective", "MyTaskDefaultEditDirective", "UploadDocument", "AddComment", "ViewDocument", "ViewComment", "addressDirective", "addressWrapper", "addressModal", "shipment", "shipmentMenu", "shipmentGeneral", "shipmentOrder", "shipmentConsoleAndPacking", "shipmentServiceAndReference", "routing", "relatedShipment", "shipmentPickupAndDelivery", "shipmentBilling", "shipmentDocuments", "shipmentDynamicTable", "shipmentMyTask", "ShpGeneralFieldsDirective", "ShipmentEntityDetailsDirective", "VgmFilingDirective", "VgmFilingEditDirective", "PartiesDetailsDirective", "RoutingGridDirective", "EditableTableDirective", "ShipmentDetailsDirective", "PackingGridDirective", "ShipmentActivityDetailsDirective", "ShipmentHouseBillDetailsDirective", "ShipmentActiveCustomToolBar", "ShipmentCustomToolBar", "shipmentAction", "ShipmentSLIUpload", "ShipmentSLIUploadDirective", "ContainerGrid", "ConsolGrid", "shipmentNewOrder", "FreightShpConfirmation", "ShpModeEventDirective", "ShpIncotermEventDirective", "ShpBkgCuttOffDateEventDirective", "ShpCargoCuttOffDateEventDirective", "ShpDocCuttOffDateEventDirective", "ShpCreationDirective", "BookingApprovalEventDirective", "OverrideKPI", "DelayReasonModal"]);
                    }]
                }
            })
            .state('EA.freight.booking', {
                url: '/booking',
                templateUrl: 'app/eaxis/freight/booking/booking.html',
                controller: "BookingController as BookingCtrl",
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "customToolbar", "addressDirective", "addressWrapper", "addressModal", "Booking", "BookingMenu", "BookingDirective", "BookingPlanning", "BookingOrder", "BookingServiceAndReference", "BookingPickupAndDelivery", "BookingAction", "Booking", "BookingAction"]);
                    }]
                }
            })
            .state('EA.freight.bookingBranch', {
                url: '/booking-branch',
                templateUrl: 'app/eaxis/freight/booking-branch/booking-branch.html',
                controller: "BookingBranchController as BookingBranchCtrl",
                ncyBreadcrumb: {
                    label: 'Booking Branch'
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "customToolbar", "addressDirective", "addressWrapper", "addressModal", "BookingBranch", "BookingBranchDirective", "BookingVesselPlanning", "shipmentDetailsTrackingDirective", "PackingGridDirective", "EditableTableDirective", "RoutingGridDirective", "ContainerEditableGridDirective", "Booking"]);
                    }]
                }
            })
            .state('EA.freight.bookingSupplier', {
                url: '/booking-supplier',
                templateUrl: 'app/eaxis/freight/booking-supplier/booking-supplier.html',
                controller: "BookingSupplierController as BookingSupplierCtrl",
                ncyBreadcrumb: {
                    label: 'Booking Supplier'
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "customToolbar", "addressDirective", "addressWrapper", "addressModal", "BookingSupplier", "BookingSupplierDirective", "shipmentDetailsTrackingDirective", "PackingGridDirective", "EditableTableDirective", "RoutingGridDirective", "ContainerEditableGridDirective", "Booking", "BookingAction", "BookingCancellationDirective", "BookingCancellationEditDirective"]);
                    }]
                }
            })
            .state('EA.freight.consolidation', {
                url: '/consolidation',
                templateUrl: 'app/eaxis/freight/consolidation/consolidation.html',
                controller: "ConsolidationController as ConsolidationCtrl",
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "DataEvent", "DataEventModal", "EmailGroup", "EmailGroupModal", "EmailTemplateCreation", "EmailTemplateCreationModal", "Task", "TaskModal", "Keyword", "KeywordModal", "Parties", "PartiesModal", "addressDirective", "addressModal", "addressWrapper", "ActivityTab", "MyTaskConfig", "MyTaskDynamicDirective", "MyTaskDefaultEditDirective", "UploadDocument", "AddComment", "ViewDocument", "ViewComment", "consolidation", "consolGeneral", "ConsolArrivalDeparture", "consolContainer", "ContainerDirectives", "consolMenu", "routing", "consolContainerPopup", "ConsolShipment", "ConsolPacking", "consolMyTask", "ConsolCommonFieldsDirective", "ConsolCommonDocsDirective", "ConsolDetailsDirective", "ContainerEditableGridDirective", "EditableTableDirective", "RoutingGridDirective", "PackingGridDirective", "relatedShipment", "ConsolActivityDetailsDirective", "ConsolOrganizationDetailsDirective", "LinkedShipment", "ContainerDetails", "consolNewshipment", "MyTaskDirective", "OverrideKPI", "DelayReasonModal"]);
                    }]
                }
            })
            .state('EA.freight.container', {
                url: '/container',
                templateUrl: 'app/eaxis/freight/container/container.html',
                controller: "ContainerController as ContainerCtrl",
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "DataEvent", "DataEventModal", "EmailGroup", "EmailGroupModal", "EmailTemplateCreation", "EmailTemplateCreationModal", "Task", "TaskModal", "Keyword", "KeywordModal", "Parties", "PartiesModal", "ActivityTab", "containerFiles", "containerFilesDirective", "ContainerDirectives", "ContainerDetails"]);
                    }]
                }
            })
            .state('EA.freight.reports', {
                url: '/reports',
                templateUrl: 'app/eaxis/freight/freight-report/freight-report.html',
                controller: "FreightReportController as FreightReportCtrl",
                ncyBreadcrumb: {
                    label: 'Freight Report'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "FreightReport"]);
                    }]
                }
            })
            .state('EA.freight.sliUpload', {
                url: '/sli-upload',
                templateUrl: 'app/eaxis/freight/sli-upload/sli-upload.html',
                controller: "SLIUploadController as SLIUploadCtrl",
                ncyBreadcrumb: {
                    label: 'SLI Upload'
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "customToolbar", "addressDirective", "addressWrapper", "addressModal", "SLIUpload", "SLIUploadDirective"]);
                    }]
                }
            });
    }
})();
