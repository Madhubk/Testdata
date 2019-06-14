(function () {
    'use strict';

    angular
        .module("Application")
        .config(Config);

    Config.$inject = ['$stateProvider', '$ocLazyLoadProvider', "SRV_CONSTANT"];

    function Config($stateProvider, $ocLazyLoadProvider, SRV_CONSTANT) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: false,
            serie: false,
            modules: SRV_CONSTANT.ocLazyLoadModules
        });

        $stateProvider
            .state('EA.singleRecordView', {
                abstract: true,
                url: '/single-record-view',
                templateUrl: 'app/eaxis/single-record-view/single-record-view.html',
                controller: "SingleRecordViewController as SingleRecordViewCtrl",
                ncyBreadcrumb: {
                    label: 'Single Record View'
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
                        return $ocLazyLoad.load(["singleRecordView"]);
                    }]
                }
            })
            .state('EA.singleRecordView.shipment', {
                url: '/shipment/:taskNo',
                templateUrl: 'app/eaxis/single-record-view/shipment/shipment.html',
                controller: "SRVShipmentController as SRVShipmentCtrl",
                ncyBreadcrumb: {
                    label: 'SRV - Shipment'
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
                        return $ocLazyLoad.load(["confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "SRVShipment", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "ActivityTab", "MyTaskConfig", "MyTaskDirective", "WorkItemListView", "ProcessInstanceWorkItemDetails", "TaskAssignStartComplete", "MyTaskDynamicDirective", "MyTaskDefaultEditDirective", "addressDirective", "addressWrapper", "addressModal", "shipment", "shipmentMenu", "shipmentGeneral", "shipmentOrder", "shipmentConsoleAndPacking", "shipmentServiceAndReference", "routing", "relatedShipment", "shipmentPickupAndDelivery", "shipmentBilling", "shipmentDocuments", "shipmentDynamicTable", "shipmentMyTask", "ShpGeneralFieldsDirective", "ShipmentDetailsDirective", "ContainerGrid", "ConsolGrid", "RoutingGridDirective", "EditableTableDirective", "PackingGridDirective"]);
                    }]
                }
            })
            .state('EA.singleRecordView.booking', {
                url: '/booking/:taskNo',
                templateUrl: 'app/eaxis/buyer/freight/booking/shared/single-record-view/booking/bookingSRV.html',
                controller: "BookingSRVController as BookingSRVCtrl",
                ncyBreadcrumb: {
                    label: 'SRV - Booking'
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
                        return $ocLazyLoad.load(["SRVBooking-vnm", "chromeTab", "dynamicTable", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "DynamicTabLeft", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "customToolbar", "addressDirective", "addressWrapper", "addressModal", "PackingGridDirective", "EditableTableDirective", "RoutingGridDirective", "ContainerEditableGridDirective", "3_BookingList",
                            // Buyer_Forwarder 
                            "1_3_BookingMenu", "1_3_BookingDirective", "1_3_BookingOrder", "1_3_BookingPlanning",
                            // Buyer_Supplier
                            "1_2_BookingMenu", "1_2_BookingDirective", "1_2_BookingOrder", "1_2_BookingPlanning",
                            //Track Shipment
                            "shipmentDetailsTrackingDirective",
                            //ASN Upload
                            "1_2_BookingASNUpload", "1_2_BookingASNUploadDirective", "doc-upload-modal"
                        ]);
                    }]
                }
            })
            .state('EA.singleRecordView.pickOrder', {
                url: '/pickorder/:workorderid',
                templateUrl: 'app/eaxis/single-record-view/pick-order/pick-order-page.html',
                controller: "SRVPickOrderController as SRVPickOrderCtrl",
                ncyBreadcrumb: {
                    label: 'SRV - Pick Order'
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
                        return $ocLazyLoad.load(["confirmation", "errorWarning", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "EAwarehouse", "SRVPickOrder", "inward", "outward", "outwardGeneral", "outwardMenu", "outwardPick", "outwardLine", "WmsReference", "WmsContainer", "WmsServices", "outwardDocument", "pick", "outwardDispatch"]);
                    }]
                }
            })
            .state('EA.singleRecordView.outwardPick', {
                url: '/outwardpick/:workorderid',
                templateUrl: 'app/eaxis/single-record-view/outward-pick/outward-pick.html',
                controller: "SRVOutwardPickController as SRVOutwardPickCtrl",
                ncyBreadcrumb: {
                    label: 'SRV - Outward Pick'
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

                        return $ocLazyLoad.load(["confirmation", "errorWarning", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "EAwarehouse", "SRVOutwardPick", "pick", "pickMenu", "pickGeneral", "pickSlip", "pickAllocation", "pickDocuments", "outward"]);
                    }]
                }
            })
            .state('EA.singleRecordView.transOrder', {
                url: '/transorder/:workorderid',
                templateUrl: 'app/eaxis/single-record-view/trans-order/trans-order-page.html',
                controller: "SRVTransOrderController as SRVTransOrderCtrl",
                ncyBreadcrumb: {
                    label: 'SRV - Trans Order'
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
                        return $ocLazyLoad.load(["SRVTransOrder", "EAwarehouse", "outward", "outwardGeneral", "outwardMenu", "outwardPick", "outwardLine", "reference", "container", "services", , "outwardDocument", "outwardDispatch"]);
                    }]
                }
            })
            .state('EA.singleRecordView.transinOrder', {
                url: '/transinorder/:workorderid',
                templateUrl: 'app/eaxis/single-record-view/trans-inorder/trans-inorder-page.html',
                controller: "SRVTransinOrderController as SRVTransinOrderCtrl",
                ncyBreadcrumb: {
                    label: 'SRV - Transin Order'
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
                        return $ocLazyLoad.load(["SRVTransinOrder", "EAwarehouse", "inward", "inwardMenu", "inwardGeneral", "inwardLines", "reference", "container", "services", "inwardmytask"]);
                    }]
                }
            })
            .state('EA.singleRecordView.order', {
                url: '/order/:orderId',
                templateUrl: 'app/eaxis/single-record-view/order/orderSRV.html',
                controller: "SRVOrderController as SRVOrderCtrl",
                ncyBreadcrumb: {
                    label: 'SRV - Order'
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
                        return $ocLazyLoad.load(["confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "oneLevelMapping", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "DataEvent", "DataEventModal", "EmailGroup", "EmailGroupModal", "EmailTemplateCreation", "EmailTemplateCreationModal", "Task", "TaskModal", "Keyword", "KeywordModal", "Parties", "PartiesModal", "customToolbar", "SRVOrder", "order", "orderAction", "orderMenu", "orderGeneral", "orderLines", "prodSummary", "orderLinesFormDirective", "orderCargoReadiness", "orderShipmentPreAdvice", "orderShipment", "preAdvice", "orderSplit", "addressDirective", "addressWrapper", "addressModal", "sfuDirective", "sfuGridDirective", "sfuHistory", "orderVesselPlanning", "errorWarning"]);
                    }]
                }
            })
            .state('EA.singleRecordView.poBatchUpload', {
                url: '/po-batch-upload/:taskNo',
                templateUrl: 'app/eaxis/single-record-view/po-upload/pouploadSRV.html',
                controller: "SRVPOUploadController as SRVPOUploadCtrl",
                ncyBreadcrumb: {
                    label: 'SRV - PO Batch Upload'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "SRVPoUpload", "poBatchUpload", "poBatchUploadDirective", "order", "orderAction", "orderMenu", "orderGeneral", "orderLines", "prodSummary", "orderLinesFormDirective", "orderCargoReadiness", "orderShipmentPreAdvice", "orderShipment", "preAdvice", "orderSplit", "addressDirective", "addressWrapper", "addressModal", "sfuDirective", "sfuGridDirective", "sfuHistory", "orderVesselPlanning", "errorWarning", "CustomFileUpload"]);
                    }]
                }
            })
            .state('EA.singleRecordView.uploadSli', {
                url: '/upload-sli/:obj',
                templateUrl: 'app/eaxis/single-record-view/upload-sli/upload-sli.html',
                controller: "UploadSLIController as UploadSLICtrl",
                ncyBreadcrumb: {
                    label: 'SRV - upload SLI'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "UploadSLI", "CustomFileUpload"]);
                    }]
                }
            })
            .state('EA.singleRecordView.outwardrelease', {
                url: '/outwardrelease/:workorderid',
                templateUrl: 'app/eaxis/single-record-view/outward-release/outward-release.html',
                controller: "SRVOutwardReleaseController as SRVOutwardReleaseCtrl",
                ncyBreadcrumb: {
                    label: 'SRV - Outward Release'
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
                        return $ocLazyLoad.load(["confirmation", "errorWarning", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "EAwarehouse", "SRVOutwardRelease", "whReleases", "whReleasesMenu", "whReleasesGeneral", "pick", "pickAllocation", "whReleasesDocuments", "whReleasesPickSlip","packingGeneral","packingHeader","pickPacking"]);
                    }]
                }
            })
            .state('EA.singleRecordView.consignment', {
                url: '/consignment/:ConsignmentNumber',
                templateUrl: 'app/eaxis/single-record-view/consignment/consignment.html',
                controller: "SRVConsignmentController as SRVConsignCtrl",
                ncyBreadcrumb: {
                    label: 'SRV - Consignment'
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
                        return $ocLazyLoad.load(["SRVConsignment", "consignment", "consignmentMenu", "consignmentGeneral", "eAxiseAxisTransports", "consignConsignmentItem", "consignmentManifest", "consignmentAddress", "consignmentReadOnly", "adminConsignment", "createConsignment"]);
                    }]
                }
            })
            .state('EA.singleRecordView.manifestItem', {
                url: '/manifestitem/:ItemCode',
                templateUrl: 'app/eaxis/single-record-view/manifest-item/manifest-item.html',
                controller: "SRVManifestItemController as SRVManifestItemCtrl",
                ncyBreadcrumb: {
                    label: 'SRV - Manifest Item'
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
                        return $ocLazyLoad.load(["SRVManifestItem", "item", "itemMenu", "itemAddress", "itemGeneral", "eAxisTransports", "itemConsignment", "itemManifest", "itemReadOnly"]);
                    }]
                }
            })
            .state('EA.singleRecordView.receiveLines', {
                url: '/receivelines/:ManifestNumber',
                templateUrl: 'app/eaxis/single-record-view/receive-lines/receive-lines.html',
                controller: "SRVReceiveLinesController as SRVReceiveLinesCtrl",
                ncyBreadcrumb: {
                    label: 'SRV - Receive Lines'
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
                        return $ocLazyLoad.load(["SRVReceiveLines", "manifest", "manifestMenu", "manifestGeneral", "eAxisTransports", "manifestConsignment", "manifestItem", "manifestAddress", "manifestReadOnly", "receiveItems", "adminManifest", "createManifest"]);
                    }]
                }
            })
            .state('EA.singleRecordView.consignmentItem', {
                url: '/consignmentitem/:ItemCode',
                templateUrl: 'app/eaxis/single-record-view/consignment-item/consignment-item.html',
                controller: "SRVConsignmentItemController as SRVConsignItemCtrl",
                ncyBreadcrumb: {
                    label: 'SRV - Consignment Item'
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
                        return $ocLazyLoad.load(["SRVConsignmentItem", "item", "itemMenu", "itemAddress", "itemGeneral", "eAxisTransports", "itemConsignment", "itemManifest", "itemReadOnly"]);
                    }]
                }
            })
            .state('EA.singleRecordView.manifest', {
                url: '/manifest/:ManifestNumber',
                templateUrl: 'app/eaxis/single-record-view/manifest/manifest.html',
                controller: "SRVManifestController as SRVManifestCtrl",
                ncyBreadcrumb: {
                    label: 'SRV - Manifest'
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
                        return $ocLazyLoad.load(["SRVManifest", "manifest", "manifestMenu", "manifestGeneral", "eAxisTransports", "manifestConsignment", "manifestItem", "manifestAddress", "manifestReadOnly", "adminManifest", "createManifest"]);
                    }]
                }
            })
            .state('EA.singleRecordView.manifestedit', {
                url: '/manifest/:ManifestNumber',
                templateUrl: 'app/eaxis/single-record-view/manifest-editable/manifest-editable.html',
                controller: "SRVManifestEditableCtrl as SRVManifestEditableCtrl",
                ncyBreadcrumb: {
                    label: 'SRV - Manifest Edit'
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
                        return $ocLazyLoad.load(["SRVManifest", "manifest", "manifestMenu", "manifestGeneral", "eAxisTransports", "manifestConsignment", "manifestItem", "manifestAddress", "manifestReadOnly", "SRVManifestEditable", "adminManifest", "createManifest"]);
                    }]
                }
            })
            .state('EA.singleRecordView.poOrder', {
                url: '/po-order/:taskNo',
                templateUrl: 'app/eaxis/single-record-view/po-order/po-orderSRV.html',
                controller: "SRVPOOrderController as SRVPOOrderCtrl",
                ncyBreadcrumb: {
                    label: 'SRV - PO Order'
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
                        return $ocLazyLoad.load(["SRVPoOrder", "chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "customToolbar", "oneLevelMapping", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "Parties", "PartiesModal", "Task", "TaskModal", "Summernote", "pagination", "addressDirective", "addressWrapper", "addressModal", "errorWarning", "ActivityTab", "MyTaskDirective", "WorkItemListView", "ProcessInstanceWorkItemDetails", "TaskAssignStartComplete", "MyTaskConfig", "MyTaskDynamicDirective", "MyTaskDefaultEditDirective", "1_order_list", "1_1_order-menu", "1_1_order-general", "1_1_orderLines", "1_1_orderLinesFormDirective", "1_1_prodSummary", "1_1_orderCargoReadiness", "1_1_orderShipmentPreAdvice", "1_1_orderVesselPlanning", "1_1_orderShipment", "1_1_orderSplit", "1_1_orderAction", "1_1_OrderCustomToolBar", "1_1_ActiveCustomToolBar", "1_1_OrderConfirmationDirective", "1_1_ConfrimDirective", "1_1_CargoReadinessToolBarDirective", "EditableTableDirective", "1_1_CargoReadinessInLineEditDirective", "1_1_PreAdviceToolBarDirective", "1_1_PreAdviceInLineEditDirective", "3_1_order-general", "1_2_view-template", "DynamicTabLeft", "1_1_my-task", "1_2_order-view-default-general", "1_2_order-view-default-shipment", "1_2_order-view-default-sub-po", "1_2_order-view-default-order-line", "1_3_order-menu", "1_3_order_general", "1_3_orderLines", "1_3_orderLinesFormDirective", "1_3_prodSummary", "1_3_orderCargoReadiness", "1_3_orderShipmentPreAdvice", "1_3_orderVesselPlanning", "1_3_orderShipment", "1_3_orderSplit", "1_3_orderAction", "1_3_my-task"]);
                        // return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "oneLevelMapping", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "Parties", "PartiesModal", "customToolbar", "customToolbar", "SRVPoOrder", "order", "orderAction", "orderMenu", "orderGeneral", "orderLines", "prodSummary", "orderLinesFormDirective", "orderCargoReadiness", "orderShipmentPreAdvice", "orderShipment", "preAdvice", "orderSplit", "addressDirective", "addressWrapper", "addressModal", "sfuDirective", "sfuGridDirective", "sfuHistory", "orderVesselPlanning", "errorWarning", "Summernote", "pagination", "OrderCustomToolBar", "preAdviceDirective", "preAdviceBookingDirective", "preAdviceGirdDirective", "VesselPanningPreAdvice", "SendPreAdviceMailHistory", "ConfrimDirective", "ActiveCustomToolBar", "OrderConfirmationDirective", "CargoReadinessToolBarDirective", "CargoReadinessInLineEditDirective", "EditableTableDirective", "PreAdviceToolBarDirective", "PreAdviceInLineEditDirective"]);
                    }]
                }
            })
            .state('EA.singleRecordView.consignmentOutward', {
                url: '/consignment-outward/:workorderid',
                templateUrl: 'app/eaxis/single-record-view/consignment-outward/consignment-outward.html',
                controller: "SRVConsignmentOutwardController as SRVConsignOutwardCtrl",
                ncyBreadcrumb: {
                    label: 'SRV - Outward'
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
                        return $ocLazyLoad.load(["confirmation", "errorWarning", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "EAwarehouse", "SRVConsignmentOutward", "inward", "outward", "outwardGeneral", "outwardMenu", "outwardPick", "outwardLine", "WmsReference", "WmsContainer", "WmsServices", "outwardDocument", "pick", "outwardDispatch"]);
                    }]
                }
            })
            .state('EA.singleRecordView.consolidation', {
                url: '/consolidation/:workorderid',
                templateUrl: 'app/eaxis/single-record-view/consolidation/consolidation.html',
                controller: "SRVConController as SRVConCtrl",
                ncyBreadcrumb: {
                    label: 'SRV - Consolidation'
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
                        return $ocLazyLoad.load(["chromeTab", "dynamicTable", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "DataEvent", "DataEventModal", "EmailGroup", "EmailGroupModal", "EmailTemplateCreation", "EmailTemplateCreationModal", "Task", "TaskModal", "Keyword", "KeywordModal", "Parties", "PartiesModal", "ActivityTab", "SRVConsolidation", "consolidation", "consolGeneral", "ConsolArrivalDeparture", "LinkedShipment", "consolContainer", "MyTaskDirective", "ContainerDirectives", "consolMenu", "routing", "RoutingGridDirective", "consolContainerPopup", "ConsolShipment", "ConsolPacking", "consolMyTask", "MyTaskDynamicDirective", "MyTaskDefaultEditDirective", "ConsolCommonFieldsDirective", "ConsolCommonDocsDirective", "ConsolDetailsDirective", "ConsolGrid", "EditableTableDirective", "relatedShipment", "ShipmentEntityDetailsDirective"]);
                    }]
                }
            })
            .state('EA.singleRecordView.orderView', {
                url: '/order-view/:taskNo',
                templateUrl: 'app/eaxis/buyer/purchase-order/shared/single-record-view/order-view/order-view.html',
                controller: "SRVOrderViewController as SRVOrderViewCtrl",
                ncyBreadcrumb: {
                    label: 'SRV - Order(s) view'
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
                        return $ocLazyLoad.load(["SRVOrderView", "chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "customToolbar", "oneLevelMapping", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "Event", "EventModal", "AuditLog", "AuditLogModal", "Parties", "PartiesModal", "Task", "TaskModal", "Summernote", "pagination", "addressDirective", "addressWrapper", "addressModal", "errorWarning", "ActivityTab", "MyTaskDirective", "WorkItemListView", "ProcessInstanceWorkItemDetails", "TaskAssignStartComplete", "MyTaskConfig", "MyTaskDynamicDirective", "MyTaskDefaultEditDirective", "1_order_list", "1_1_order-menu", "1_1_order-general", "1_1_orderLines", "1_1_orderLinesFormDirective", "1_1_prodSummary", "1_1_orderCargoReadiness", "1_1_orderShipmentPreAdvice", "1_1_orderVesselPlanning", "1_1_orderShipment", "1_1_orderSplit", "1_1_orderAction", "1_1_OrderCustomToolBar", "1_1_ActiveCustomToolBar", "1_1_OrderConfirmationDirective", "1_1_ConfrimDirective", "1_1_CargoReadinessToolBarDirective", "EditableTableDirective", "1_1_CargoReadinessInLineEditDirective", "1_1_PreAdviceToolBarDirective", "1_1_PreAdviceInLineEditDirective", "3_1_order-general", "1_2_view-template", "DynamicTabLeft", "1_1_my-task", "1_2_order-view-default-general", "1_2_order-view-default-shipment", "1_2_order-view-default-sub-po", "1_2_order-view-default-order-line", "1_3_order-menu", "1_3_order_general", "1_3_orderLines", "1_3_orderLinesFormDirective", "1_3_prodSummary", "1_3_orderCargoReadiness", "1_3_orderShipmentPreAdvice", "1_3_orderVesselPlanning", "1_3_orderShipment", "1_3_orderSplit", "1_3_orderAction", "1_3_my-task", "ord-buyer-view-template", "ord-buyer-view-general", "ord-buyer-view-order-line", "ord-buyer-view-shipment", "ord-buyer-view-sub-po"]);
                    }]
                }
            })
            .state('EA.singleRecordView.pendingPickup', {
                url: '/pendingpickup/:workorderid',
                templateUrl: 'app/eaxis/single-record-view/pending-pickup/pending-pickup.html',
                controller: "SRVPendingPickupController as SRVPendingPickupCtrl",
                ncyBreadcrumb: {
                    label: 'SRV - Pending Pickup'
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

                        return $ocLazyLoad.load(["confirmation", "errorWarning", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "EAwarehouse", "SRVPendingPickup", "pickupRequest", "pickupRequestMenu", "pickupRequestGeneral", "pickupRequestLine", "pickupOrders", "pickupDetails", "pickupMyTask", "ActivityTab", "MyTaskDirective", "WorkItemListView", "ProcessInstanceWorkItemDetails", "TaskAssignStartComplete", "MyTaskConfig", "MyTaskDynamicDirective", "MyTaskDefaultEditDirective", "ActivityTemplatePickup2", "ActivityFormTemplate1", "CreatePickupChallanDirective", "AcknowledgePickupRequestDirective", "inward", "outward", "inwardAddress", "inwardGeneral", "inwardMenu", "inwardAsnLines", "inwardLines", "inwardProductSummary", "inwardDocument", "WmsReference", "WmsContainer", "WmsServices", "LocationDashboardModal", "location"]);
                    }]
                }
            })
            .state('EA.singleRecordView.outwardManifest', {
                url: '/outwardmanifest/:manifestnumber',
                templateUrl: 'app/eaxis/single-record-view/outward-manifest/outward-manifest.html',
                controller: "SRVOutwardManifestController as SRVOutwardManifestCtrl",
                ncyBreadcrumb: {
                    label: 'SRV - Outward Manifest'
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

                        return $ocLazyLoad.load(["confirmation", "errorWarning", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "EAwarehouse", "SRVOutwardManifest", "DNDUITress", "drogAndDrop", "routePlanning", "tracking", "dmsManifestList", "GatepassList", "manifestTab", "dmsManifestMenu", "dmsManifestGeneral", "dmsManifestAddress", "dmsManifestOrders", "dmsManifestItem", "approveManifest", "confirmTransportBooking", "dockinVehicle", "loadItems", "dockoutVehicle", "issueExitGatepass", "completeManifest", "pickupDelivery", "startLoad", "CreateManifestView", "AttachOrdersView", "AddItemsView", "ConfirmBookingView", "createManifest"]);
                    }]
                }
            })
            .state('EA.singleRecordView.organization', {
                url: '/organization',
                templateUrl: 'app/eaxis/single-record-view/organization/organization.html',
                controller: "SRVOrganizationController as SRVOrganizationCtrl",
                ncyBreadcrumb: {
                    label: 'SRV - Organization'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "JsonModal", "errorWarning", "dynamicTable", "organization", "organizationMenu", "organizationGeneral", "organizationAddress", "organizationContact", "organizationCompany", "organizationEmployee", "organizationRelatedParties", "organizationRelatedPartiesModal", "organizationVisibility", "organizationConsignee", "organizationConsigneeModal", "organizationConsigneeDocModal", "organizationConsignor", "organizationConsignorModal", "organizationConsignorDocModal", "organizationWarehouse", "organizationGenRelatedPartiesModal", "organizationGenRelatedParties", "organizationReference",  "organizationAccessRights", "ExpressionFormatter", "ExpressionGroupFormatter", "NotificationFormatter", "NotificationTemplateFormatter", "TaskConfigFormatter", "PartyMapping", "MDM", "SRVOrganization"]);
                    }]
                }
            });
    }
})();
