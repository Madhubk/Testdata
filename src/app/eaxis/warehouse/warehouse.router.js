(function () {
    'use strict';

    angular
        .module("Application")
        .config(Config);

    Config.$inject = ['$stateProvider', '$ocLazyLoadProvider', "WAREHOUSE_CONSTANT"];

    function Config($stateProvider, $ocLazyLoadProvider, WAREHOUSE_CONSTANT) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: false,
            serie: false,
            modules: WAREHOUSE_CONSTANT.ocLazyLoadModules
        });

        $stateProvider
            .state('EA.WMS', {
                abstract: true,
                url: '/WMS',
                templateUrl: 'app/eaxis/warehouse/warehouse.html',
                controller: "WarehouseController as WarehouseCtrl",
                ncyBreadcrumb: {
                    label: 'Warehouse'
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
                        return $ocLazyLoad.load(["EAwarehouse"]);
                    }]
                }
            })
            .state('EA.WMS.warehouseDashboard', {
                url: '/dashboard',
                templateUrl: 'app/eaxis/warehouse/dashboard/dashboard.html',
                controller: "WarehouseDashboardController as WarehouseDashboardCtrl",
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
                        return $ocLazyLoad.load(["chart", "dynamicMultiDashboard", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "inwardDashboard", "outwardDashboard", "locationDashboard", "warehouseDashboard"]);
                    }]
                }
            })
            .state('EA.WMS.inward', {
                url: '/inward',
                templateUrl: 'app/eaxis/warehouse/inward/inward.html',
                controller: "InwardController as InwardCtrl",
                ncyBreadcrumb: {
                    label: 'Inward'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "Event", "EventModal", "Task", "TaskModal", "inward", "outward", "inwardAddress", "inwardGeneral", "inwardMenu", "inwardAsnLines", "inwardLines", "inwardProductSummary", "inwardDocument", "inwardGatepass", "WmsReference", "WmsContainer", "WmsServices", "LocationDashboardModal", "location", "inwardMyTask", "ActivityTab", "MyTaskDirective", "WorkItemListView", "ProcessInstanceWorkItemDetails", "TaskAssignStartComplete", "MyTaskConfig", "MyTaskDynamicDirective", "ActivityTemplateInward", "ActivityFormTemplate1", "ReceiveMaterialDirective", "CollectMaterialDirective", "GetSignatureDirective", "Finance", "FinanceJobList", "FinanceJobGeneral", "FinanceJobMenu"]);
                    }]
                }
            })
            .state('EA.WMS.inwardDashboard', {
                url: '/inward-dashboard',
                templateUrl: 'app/eaxis/warehouse/inward/inward-dashboard/inward-dashboard.html',
                controller: "InwardDashboardController as InwardDashboardCtrl",
                ncyBreadcrumb: {
                    label: 'Inward'
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
                        return $ocLazyLoad.load(["chart", "inwardDashboard"]);
                    }]
                }
            })
            .state('EA.WMS.outward', {
                url: '/outward',
                templateUrl: 'app/eaxis/warehouse/outward/outward.html',
                controller: "OutwardController as OutwardCtrl",
                ncyBreadcrumb: {
                    label: 'Outward'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "Event", "EventModal", "Task", "TaskModal", "outwardAddress", "outwardBatchUpload", "outward", "inward", "outwardGeneral", "outwardMenu", "outwardPick", "outwardLine", "WmsReference", "WmsContainer", "WmsServices", "pick", "outwardDocument", "outwardDispatch", "outwardMyTask", "ActivityTab", "MyTaskDirective", "WorkItemListView", "ProcessInstanceWorkItemDetails", "TaskAssignStartComplete", "MyTaskConfig", "MyTaskDynamicDirective", "ActivityTemplateOutward2", "ActivityFormTemplate1", "ArrangeMaterialDirective", "DeliverMaterialDirective", "PodReturnOutDirective", "ConfirmDeliveryDirective", "TransferMaterialDirective", "Finance", "FinanceJobList", "FinanceJobGeneral", "FinanceJobMenu"]);
                    }]
                }
            })
            .state('EA.WMS.outwardDashboard', {
                url: '/outward-dashboard',
                templateUrl: 'app/eaxis/warehouse/outward/outward-dashboard/outward-dashboard.html',
                controller: "OutwardDashboardController as OutwardDashboardCtrl",
                ncyBreadcrumb: {
                    label: 'Outward'
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
                        return $ocLazyLoad.load(["chart", "outwardDashboard"]);
                    }]
                }
            })
            .state('EA.WMS.asnRequest', {
                url: '/asn-request',
                templateUrl: 'app/eaxis/warehouse/asn-request/asnrequest.html',
                controller: "AsnrequestController as AsnrequestCtrl",
                ncyBreadcrumb: {
                    label: 'ASN Request'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "inward", "asnRequest", "asnRequestGeneral", "asnRequestAddress"]);
                    }]
                }
            })
            .state('EA.WMS.pick', {
                url: '/pick',
                templateUrl: 'app/eaxis/warehouse/pick/pick.html',
                controller: "PickController as PickCtrl",
                ncyBreadcrumb: {
                    label: 'Pick'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "pick", "pickMenu", "pickGeneral", "pickSlip", "pickAllocation", "pickDocuments", "outward"]);
                    }]
                }
            })
            .state('EA.WMS.releases', {
                url: '/releases',
                templateUrl: 'app/eaxis/warehouse/wh-releases/wh-releases.html',
                controller: "ReleaseController as ReleaseCtrl",
                ncyBreadcrumb: {
                    label: 'Release'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "whReleases", "whReleasesMenu", "whReleasesGeneral", "pick", "pickAllocation", "whReleasesDocuments", "whReleasesPickSlip","packingGeneral","packingHeader","pickPacking"]);
                    }]
                }
            })
            .state('EA.WMS.transport', {
                url: '/transport',
                templateUrl: 'app/eaxis/warehouse/transport/transport.html',
                controller: "TransportController as TransportCtrl",
                ncyBreadcrumb: {
                    label: 'Transport'


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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop",
                            "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "transport", "transportmenu", "transportorders", "transportgeneral", "transportvehicle", "transportpickupanddelivery", "outward", "inward"
                        ]);
                    }]
                }
            })
            .state('EA.WMS.pickupAndDelivery', {
                url: '/pickup-and-delivery',
                templateUrl: 'app/eaxis/warehouse/PickupandDelivery/PickupandDelivery.html',
                controller: "PickupanddeliveryController as PickupanddeliveryCtrl",
                ncyBreadcrumb: {
                    label: 'Pickup And Delivery'
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
                        return $ocLazyLoad.load(["pickupandDelivery", "pickupandDeliverymenu", "pickupandDeliverygeneral", "pickupanddeliveryDetails"]);
                    }]
                }
            })
            .state('EA.WMS.inventory', {
                url: '/inventory',
                templateUrl: 'app/eaxis/warehouse/inventory/inventory.html',
                controller: "InventoryController as InventoryCtrl",
                ncyBreadcrumb: {
                    label: 'Inventory'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "inventory", "inventoryMenu", "inventoryGeneral"]);
                    }]
                }
            })
            .state('EA.WMS.adjustment', {
                url: '/adjustment',
                templateUrl: 'app/eaxis/warehouse/adjustment/adjustment.html',
                controller: "AdjustmentController as AdjustmentCtrl",
                ncyBreadcrumb: {
                    label: 'Adjustment'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "adjustment", "adjustmentMenu", "adjustmentGeneral", "LocationDashboardModal", "location"]);
                    }]
                }
            })
            .state('EA.WMS.cycleCount', {
                url: '/cycle-count',
                templateUrl: 'app/eaxis/warehouse/cycle-count/cycle-count.html',
                controller: "CycleCountController as CycleCountCtrl",
                ncyBreadcrumb: {
                    label: 'Cycle Count'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "cycleCount", "cycleCountMenu", "cycleCountGeneral", "cycleCountLine", "LocationDashboardModal", "location"]);
                    }]
                }
            })
            .state('EA.WMS.stockTransfer', {
                url: '/stock-transfer',
                templateUrl: 'app/eaxis/warehouse/stock-transfer/stock-transfer.html',
                controller: "StocktransferController as StocktransferCtrl",
                ncyBreadcrumb: {
                    label: 'Stock Transfer'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "stockTransfer", "stockTransferEntry", "stockTransferMenu", "LocationDashboardModal", "location"]);
                    }]
                }
            })



            .state('EA.WMS.generateBarcode', {
                url: '/generate-barcode',
                templateUrl: 'app/eaxis/warehouse/general-module/barcode/generate-barcode.html',
                controller: "GenerateBarcodeController as GenerateBarcodeCtrl",
                ncyBreadcrumb: {
                    label: 'Generate-Barcode'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "QRCode", "AngularPrint", "generateBarcode",]);
                    }]
                }
            })

            // customer inward view

            .state('EA.WMS.inwardView', {
                url: '/inward-view',
                templateUrl: 'app/eaxis/warehouse/customer-view/inward-customer-view/inward-view.html',
                controller: "InwardViewController as InwardViewCtrl",
                ncyBreadcrumb: {
                    label: 'Inward View'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "inwardView", "inwardViewDetail", "inwardViewDetailCustom1"]);
                    }]
                }
            })

            //customer outward view

            .state('EA.WMS.outwardView', {
                url: '/outward-view',
                templateUrl: 'app/eaxis/warehouse/customer-view/outward-customer-view/outward-view.html',
                controller: "OutwardViewController as OutwardViewCtrl",
                ncyBreadcrumb: {
                    label: 'Outward View'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "outwardView", "outwardViewDetail", "outwardViewDetailCustom1"]);
                    }]
                }
            })

            //customer adjustment view

            .state('EA.WMS.adjustmentView', {
                url: '/adjustment-view',
                templateUrl: 'app/eaxis/warehouse/customer-view/adjustment-customer-view/adjustment-view.html',
                controller: "AdjustmentViewController as AdjustmentViewCtrl",
                ncyBreadcrumb: {
                    label: 'Adjustment View'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "adjustmentView", "adjustmentViewDetail"]);
                    }]
                }
            })

            //customer stock Transfer view

            .state('EA.WMS.stockTransferView', {
                url: '/stock-transfer-view',
                templateUrl: 'app/eaxis/warehouse/customer-view/stock-transfer-customer-view/stock-transfer-view.html',
                controller: "StockTransferViewController as StockTransferViewCtrl",
                ncyBreadcrumb: {
                    label: 'Stock Transfer View'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "stockTransferView", "stockTransferViewDetail"]);
                    }]
                }
            })


            //customer Cycle Count view

            .state('EA.WMS.cycleCountView', {
                url: '/cycle-count-view',
                templateUrl: 'app/eaxis/warehouse/customer-view/cycle-count-customer-view/cycle-count-view.html',
                controller: "CycleCountViewController as CycleCountViewCtrl",
                ncyBreadcrumb: {
                    label: 'Cycle Count View'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "cycleCountView", "cycleCountViewDetail"]);
                    }]
                }
            })

            .state('EA.WMS.inwardLineDetails', {
                url: '/inward-line',
                templateUrl: 'app/eaxis/warehouse/customer-view/inward-line/inward-line.html',
                controller: "InwardLineController as InwardLineCtrl",
                ncyBreadcrumb: {
                    label: 'Inward Line'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "inwardLineDetails"]);
                    }]
                }
            })

            .state('EA.WMS.outwardLineDetails', {
                url: '/outward-line',
                templateUrl: 'app/eaxis/warehouse/customer-view/outward-line/outward-line.html',
                controller: "OutwardLineController as OutwardLineCtrl",
                ncyBreadcrumb: {
                    label: 'Outward Line'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "outwardLineDetails"]);
                    }]
                }
            })

            .state('EA.WMS.inventoryCustomer', {
                url: '/track-inventory',
                templateUrl: 'app/eaxis/warehouse/customer-view/inventory-customer-view/inventory.html',
                controller: "InventoryCustController as InventoryCustCtrl",
                ncyBreadcrumb: {
                    label: 'Inventory'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "inventoryCustomer", "inventoryMenuCustomer", "inventoryGeneralCustomer"]);
                    }]
                }
            })

            .state('EA.WMS.customerDashboard', {
                url: '/customer-dashboard',
                templateUrl: 'app/eaxis/warehouse/customer-view/dashboard/customer-dashboard.html',
                controller: "CustomerDashboardController as DashboardCtrl",
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "chart", "inward", "customerDashboard"]);
                    }]
                }
            })

            .state('EA.WMS.customerOutwardDashboard', {
                url: '/customer-outward-dashboard',
                templateUrl: 'app/eaxis/warehouse/customer-view/dashboard/outward/customer-outward-dashboard.html',
                controller: "CustomerDashboardController as DashboardCtrl",
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "chart", "outward", "customerOutwardDashboard"]);
                    }]
                }
            })

            .state('EA.WMS.commonDashboard', {
                url: '/common-dashboard',
                templateUrl: 'app/eaxis/warehouse/common-dashboard/dashboard.html',
                controller: "CommonDashboardController as DashboardCtrl",
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "commonDashboard"]);
                    }]
                }
            })

            .state('EA.WMS.batchupload', {
                url: '/batch-upload/:modulename',
                templateUrl: 'app/eaxis/warehouse/batch-upload-process/process.html',
                controller: "ProcessController as ProcessCtrl",
                ncyBreadcrumb: {
                    label: 'BatchUpload'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "batchUpload", "batchUploadDetails"]);
                    }]
                }
            })

            .state('EA.WMS.DeliveryRequest', {
                url: '/delivery-request',
                templateUrl: 'app/eaxis/warehouse/delivery-request/delivery-request.html',
                controller: "DeliveryController as DeliveryCtrl",
                ncyBreadcrumb: {
                    label: 'Delivery'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "customToolbar", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "Task", "TaskModal", "Event", "EventModal", "deliveryRequest", "deliveryRequestMenu", "deliveryRequestGeneral", "deliveryRequestLine", "deliveryOrders", "deliveryDetails", "deliveryMyTask", "deliveryDocument", "ActivityTab", "MyTaskDirective", "WorkItemListView", "ProcessInstanceWorkItemDetails", "TaskAssignStartComplete", "MyTaskConfig", "MyTaskDynamicDirective", "AcknowledgeCsrDirective", "CreateDeliveryChallanDirective", "ArrangeMaterialDirective", "DeliverMaterialDirective", "ActivityTemplateDelivery2", "ActivityFormTemplate1", "outward", "outwardMenu", "outwardGeneral", "outwardLine", "outwardPick", "outwardDispatch", "pick"]);
                    }]
                }
            })

            .state('EA.WMS.raisecsr', {
                url: '/raise-csr',
                templateUrl: 'app/eaxis/warehouse/raise-csr/raise-csr.html',
                controller: "RaiseCSRController as RaiseCSRCtrl",
                ncyBreadcrumb: {
                    label: 'Raise Delivery Request'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "Task", "TaskModal", "Event", "EventModal", "RaiseCSR", "deliveryRequest", "deliveryRequestGeneral", "deliveryRequestLine"]);
                    }]
                }
            })
            .state('EA.WMS.PickupRequest', {
                url: '/pickup-request',
                templateUrl: 'app/eaxis/warehouse/pickup-request/pickup-request.html',
                controller: "PickupController as PickupCtrl",
                ncyBreadcrumb: {
                    label: 'Pickup_Request'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "Task", "TaskModal", "Event", "EventModal", "pickupRequest", "pickupRequestMenu", "pickupRequestGeneral", "pickupRequestLine", "pickupOrders", "pickupDetails", "pickupMyTask", "ActivityTab", "MyTaskDirective", "WorkItemListView", "ProcessInstanceWorkItemDetails", "TaskAssignStartComplete", "MyTaskConfig", "MyTaskDynamicDirective", "ActivityTemplatePickup2", "ActivityFormTemplate1", "CreatePickupChallanDirective", "AcknowledgePickupRequestDirective", "inward", "outward", "inwardAddress", "inwardGeneral", "inwardMenu", "inwardAsnLines", "inwardLines", "inwardProductSummary", "inwardDocument", "WmsReference", "WmsContainer", "WmsServices", "LocationDashboardModal", "location"]);
                    }]
                }
            })
            
            .state('EA.WMS.PendingPickup', {
                url: '/pending-pickup',
                templateUrl: 'app/eaxis/warehouse/pending-pickup/pending-pickup.html',
                controller: "PendingPickupController as PendingPickupCtrl",
                ncyBreadcrumb: {
                    label: 'PendingPickup'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "customToolbar", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "pendingPickup", "pendingPickupToolbar"]);
                    }]
                }
            })
            .state('EA.WMS.DeliveryLine', {
                url: '/delivery-line',
                templateUrl: 'app/eaxis/warehouse/delivery-line/delivery-line.html',
                controller: "TrackDeliveryLineController as TrackDeliveryLineCtrl",
                ncyBreadcrumb: {
                    label: 'DeliveryLine'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "customToolbar", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "deliveryLine", "deliveryRequestToolbar", "deliveryLineMenu", "deliveryLineGeneral"]);
                    }]
                }
            })
            .state('EA.WMS.DamagedSKU', {
                url: '/track-damaged-sku',
                templateUrl: 'app/eaxis/warehouse/track-damaged-sku/track-damaged-sku.html',
                controller: "TrackdamagedSKUController as TrackdamagedSKUCtrl",
                ncyBreadcrumb: {
                    label: 'TrackDamagedSKU'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "customToolbar", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "damagedSKU", "damagedSkuToolbar", "damageMenu", "damageGeneral"]);
                    }]
                }
            })
            .state('EA.WMS.ownershipTransfer', {
                url: '/ownership-transfer',
                templateUrl: 'app/eaxis/warehouse/ownership-transfer/ownership-transfer.html',
                controller: "OwnershipTransferController as OwnerTransferCtrl",
                ncyBreadcrumb: {
                    label: 'Ownership Transfer'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "ownershipTransfer", "ownershipTransferGeneral", "ownershipTransferMenu", "LocationDashboardModal", "location"]);
                    }]
                }
            })


            .state('EA.WMS.InventoryView', {
                url: '/inventory-view',
                templateUrl: 'app/eaxis/warehouse/customer-view/inventory-customer-system-view/inventory-customer-system-view.html',
                controller: "InventoryViewController as InventoryViewCtrl",
                ncyBreadcrumb: {
                    label: 'Inventory View'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "inventoryCustomer", "inventoryView"]);
                    }]
                }
            })

            .state('EA.WMS.CUSTOMER_TRACK_ORDER', {
                url: '/track-delivery',
                templateUrl: 'app/eaxis/warehouse/customer-view/track-delivery/track-delivery.html',
                controller: "TrackDeliveryController as TrackDeliveryCtrl",
                ncyBreadcrumb: {
                    label: 'Track Delivery'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "TrackDelivery"]);
                    }]
                }
            })

            .state('EA.WMS.ConsolidatedDocument', {
                url: '/consolidated-document',
                templateUrl: 'app/eaxis/warehouse/consolidated-document/consolidated-document.html',
                controller: "ConsolidatedDocumentController as ConsolidatedDocumentCtrl",
                ncyBreadcrumb: {
                    label: 'All Documents'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "consolidatedDocument"]);
                    }]
                }
            })
    }
})();