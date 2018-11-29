(function () {
    'use strict';

    angular
        .module("Application")
        .config(Config);

    Config.$inject = ['$stateProvider', '$ocLazyLoadProvider', "TRANSPORT_CONSTANT"];

    function Config($stateProvider, $ocLazyLoadProvider, TRANSPORT_CONSTANT) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: false,
            serie: false,
            modules: TRANSPORT_CONSTANT.ocLazyLoadModules
        });

        $stateProvider
            .state('EA.TMS', {
                abstract: true,
                url: '/TMS',
                templateUrl: 'app/eaxis/transports/transports.html',
                controller: "TransportsController as TransportsCtrl",
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
                        return $ocLazyLoad.load(["eAxisTransports"]);
                    }]
                }
            })
            .state('EA.TMS.transportsDashboard', {
                url: '/dashboard',
                templateUrl: 'app/eaxis/transports/dashboard/dashboard.html',
                controller: "DcDashboardController as DcDashboardCtrl",
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
                        return $ocLazyLoad.load(["confirmation", "D3Js", "chart", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "eAxisTransports", "nationalDepot", "levelLoad", "levelLoadEdit", "TMSDashboard", "loadPlanning", "loadPlanningEdit","DNDUITress", "drogAndDrop", "depotContact"]);
                    }]
                }
            })
            .state('EA.TMS.scanItem', {
                url: '/scan-item',
                templateUrl: 'app/eaxis/transports/scan-item/scan-item.html',
                controller: "ScanItemController as ScanItemCtrl",
                ncyBreadcrumb: {
                    label: 'Scan Item'
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
                        return $ocLazyLoad.load(["confirmation", "scanItem", "eAxisTransports", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop"]);
                    }]
                }
            })
            .state('EA.TMS.transportsReports', {
                url: '/transports-reports',
                templateUrl: 'app/eaxis/transports/transports-reports/report.html',
                controller: "TransportsReportController as TransportsReportCtrl",
                ncyBreadcrumb: {
                    label: 'Report'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "transportsReport", "eAxisTransports"]);
                    }]
                }
            })
            .state('EA.TMS.trackManifest', {
                url: '/track-manifest',
                templateUrl: 'app/eaxis/transports/track-manifest/manifest.html',
                controller: "ManifestController as ManifestCtrl",
                ncyBreadcrumb: {
                    label: 'Manifest'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "errorWarning", "customToolbar", "manifestCustomToolBar", "createManifest", "manifestMenu", "manifestGeneral", "eAxisTransports", "manifestConsignment", "manifestItem", "manifestAddress", "manifestReadOnly", "receiveItems", "adminManifest", "manifest"]);
                    }]
                }
            })
            .state('EA.TMS.trackConsignment', {
                url: '/track-consignment',
                templateUrl: 'app/eaxis/transports/track-consignment/consignment.html',
                controller: "ConsignmentController as ConsignmentCtrl",
                ncyBreadcrumb: {
                    label: 'Consignment'
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
                            "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "consignment", "consignmentMenu", "consignmentGeneral", "eAxisTransports", "consignConsignmentItem", "consignmentManifest", "consignmentAddress", "consignmentReadOnly", "adminConsignment", "createConsignment", "consignmentOrder"]);
                    }]
                }
            })
            .state('EA.TMS.trackItem', {
                url: '/track-item',
                templateUrl: 'app/eaxis/transports/track-item/item.html',
                controller: "ItemController as ItemCtrl",
                ncyBreadcrumb: {
                    label: 'item'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop",
                            "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "item", "itemMenu", "itemAddress", "itemGeneral", "eAxisTransports", "itemConsignment", "itemManifest", "itemReadOnly"]);
                    }]
                }
            })
            .state('EA.TMS.manifest', {
                url: '/manifest',
                templateUrl: 'app/eaxis/transports/manifest/manifest.html',
                controller: "AdminManifestController as AdminManifestCtrl",
                ncyBreadcrumb: {
                    label: 'Manifest'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "errorWarning", "customToolbar", "manifestCustomToolBar", "createManifest", "manifest", "adminManifestMenu", "manifestGeneral", "eAxisTransports", "manifestConsignment", "manifestItem", "manifestAddress", "manifestReadOnly", "receiveItems", "adminManifest"]);
                    }]
                }
            })
            .state('EA.TMS.consignment', {
                url: '/consignment',
                templateUrl: 'app/eaxis/transports/consignment/consignment.html',
                controller: "AdminConsignmentController as AdminConsignmentCtrl",
                ncyBreadcrumb: {
                    label: 'Consignment'
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
                            "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "adminConsignment", "adminConsignmentMenu", "consignment", "consignmentGeneral", "eAxisTransports", "consignConsignmentItem", "consignmentManifest", "consignmentAddress", "createConsignment", "consignmentOrder"]);
                    }]
                }
            })
            .state('EA.TMS.item', {
                url: '/item',
                templateUrl: 'app/eaxis/transports/item/item.html',
                controller: "AdminItemController as AdminItemCtrl",
                ncyBreadcrumb: {
                    label: 'item'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop",
                            "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "adminItem", "adminItemMenu", "item", "itemAddress", "itemGeneral", "eAxisTransports", "itemConsignment", "itemManifest"]);
                    }]
                }
            })
            .state('EA.TMS.createManifest', {
                url: '/create-manifest',
                templateUrl: 'app/eaxis/transports/create-manifest/create-manifest.html',
                controller: "CreateManifestController as CreateManifestCtrl",
                ncyBreadcrumb: {
                    label: 'Manifest'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "errorWarning", "eAxisTransports", "createManifest", "createManifestGeneral", "manifest", "manifestMenu", "manifestGeneral", "manifestAddress", "manifestReadOnly", "TMSDashboard", "adminManifest"]);
                    }]
                }
            })
            .state('EA.TMS.createConsignment', {
                url: '/create-consignment',
                templateUrl: 'app/eaxis/transports/create-consignment/create-consign.html',
                controller: "CreateConsignController as CreateConsignCtrl",
                ncyBreadcrumb: {
                    label: 'Consignment'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "errorWarning", "createConsignment", "createConsignmentGeneral", "consignment", "consignmentMenu", "consignmentGeneral", "eAxisTransports", "consignmentAddress", "adminConsignment"]);
                    }]
                }
            })
            .state('EA.TMS.pickupManifest', {
                url: '/pickup-manifest',
                templateUrl: 'app/eaxis/transports/pickup-manifest/pickup-manifest.html',
                controller: "PickupManifestController as PickupManifestCtrl",
                ncyBreadcrumb: {
                    label: 'Pickup-Manifest'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "errorWarning", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "customToolbar", "pickupManifestCustomToolbar", "eAxisTransports", "pickupManifest", "pickupManifestMenu", "manifest", "manifestReadOnly"]);
                    }]
                }
            })
            .state('EA.TMS.deliveryManifest', {
                url: '/delivery-manifest',
                templateUrl: 'app/eaxis/transports/delivery-manifest/delivery-manifest.html',
                controller: "DeliveryManifestController as DeliveryManifestCtrl",
                ncyBreadcrumb: {
                    label: 'Delivery-Manifest'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "errorWarning", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "customToolbar", "deliveryManifestCustomToolbar", "eAxisTransports", "deliveryManifest", "manifestReadOnly", "manifest", "deliveryManifestMenu"]);
                    }]
                }
            })
            .state('EA.TMS.pickupConsignment', {
                url: '/pickup-consignment',
                templateUrl: 'app/eaxis/transports/pickup-consignment/pickup-consignment.html',
                controller: "PickupConsignmentController as PickupConsignmentCtrl",
                ncyBreadcrumb: {
                    label: 'Pickup-consignment'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "errorWarning", "customToolbar", "pickupConsignmentCustomToolbar", "eAxisTransports", "pickupConsignment", "pickupConsignmentMenu", "consignment", "consignmentReadOnly"]);
                    }]
                }
            })
            .state('EA.TMS.deliveryConsignment', {
                url: '/delivery-consignment',
                templateUrl: 'app/eaxis/transports/delivery-consignment/delivery-consignment.html',
                controller: "DeliveryConsignmentController as DeliveryConsignmentCtrl",
                ncyBreadcrumb: {
                    label: 'Delivery-Consignment'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "errorWarning", "customToolbar", "deliveryConsignmentCustomToolbar", "eAxisTransports", "deliveryConsignment", "consignmentReadOnly", "consignment", "deliveryConsignmentMenu"]);
                    }]
                }
            })
            .state('EA.TMS.supplier', {
                url: '/supplier',
                templateUrl: 'app/eaxis/transports/supplier/supplier.html',
                controller: "SupplierController as SupplierCtrl",
                ncyBreadcrumb: {
                    label: 'Supplier'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "errorWarning", "customToolbar", "supplier", "supplierMenu", "supplierGeneral", "consignment", "adminConsignment", "createConsignment", "consignmentAddress", "consignmentReadOnly", "consignConsignmentItem"]);
                    }]
                }
            })
            .state('EA.TMS.depotContact', {
                url: '/depot-contact',
                templateUrl: 'app/eaxis/transports/depot-contact/depot-contact.html',
                controller: "DepotContactController as DepotContactCtrl",
                ncyBreadcrumb: {
                    label: 'Depot Contact'
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
                        return $ocLazyLoad.load(["confirmation", "eAxisTransports", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "depotContact"]);
                    }]
                }
            })
            .state('EA.TMS.dateRevisionConsignment', {
                url: '/date-revision-consignment',
                templateUrl: 'app/eaxis/transports/date-revision-consignment/date-revision.html',
                controller: "DateRevisionConsignmentController as DateRevisionConsignmentCtrl",
                ncyBreadcrumb: {
                    label: 'DateRevision-consignment'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "errorWarning","eAxisTransports", "dateRevisionConsignment", "consignmentReadOnly", "consignment"]);
                    }]
                }
            })
            
            .state('EA.TMS.dateRevisionManifest', {
                url: '/date-revision-manifest',
                templateUrl: 'app/eaxis/transports/date-revision-manifest/date-revision.html',
                controller: "DateRevisionController as DateRevisionCtrl",
                ncyBreadcrumb: {
                    label: 'DateRevision-Manifest'
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "errorWarning", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "eAxisTransports", "dateRevision"]);
                    }]
                }
            })
    }
})();
