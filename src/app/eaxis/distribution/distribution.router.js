(function () {
    'use strict';

    angular
        .module("Application")
        .config(Config);

    Config.$inject = ['$stateProvider', '$ocLazyLoadProvider', "DISTRIBUTION_CONSTANT"];

    function Config($stateProvider, $ocLazyLoadProvider, DISTRIBUTION_CONSTANT) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: false,
            serie: false,
            modules: DISTRIBUTION_CONSTANT.ocLazyLoadModules
        });

        $stateProvider
            .state('EA.DMS', {
                abstract: true,
                url: '/DMS',
                templateUrl: 'app/eaxis/distribution/distribution.html',
                controller: "DistributionController as DistributionCtrl",
                ncyBreadcrumb: {
                    label: 'Distribution'
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
                        return $ocLazyLoad.load(["eAxisDistribution"]);
                    }]
                }
            })
            .state('EA.DMS.initiateGatepass', {
                url: '/initiate-gatepass',
                templateUrl: 'app/eaxis/distribution/initiate-gatepass/initiate-gatepass.html',
                controller: "InitiateGatepassController as InitGateCtrl",
                ncyBreadcrumb: {
                    label: 'GatePass'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "eAxisDistribution", "initiateGatepass", "gatepassMenu", "gatepassGeneral", "manifestDetails", "createGatepass"]);
                    }]
                }
            })
            .state('EA.DMS.manifestList', {
                url: '/manifest-list',
                templateUrl: 'app/eaxis/distribution/manifest-list/manifest-list.html',
                controller: "DMSManifestController as DMSManifestCtrl",
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "EmailDirective", "Exception", "ExceptionModal", "eAxisDistribution", "DNDUITress", "drogAndDrop", "routePlanning", "tracking", "dmsManifestList", "GatepassList", "manifestTab", "dmsManifestMenu", "dmsManifestGeneral", "dmsManifestAddress", "dmsManifestOrders", "dmsManifestItem", "approveManifest", "confirmTransportBooking", "dockinVehicle", "loadItems", "dockoutVehicle", "issueExitGatepass", "completeManifest", "pickupDelivery", "startLoad", "CreateManifestView", "AttachOrdersView", "AddItemsView", "ConfirmBookingView", "createManifest","deliveryRunsheet","billablecost"]);
                    }]
                }
            })

            .state('EA.DMS.manifest', {
                url: '/manifest',
                templateUrl: 'app/eaxis/distribution/manifest-transaction/manifest-transaction.html',
                controller: "ManifestTransactionController as ManifestTransCtrl",
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "manifestTransaction", "dmsManifestList", "manifestTransactionMenu", "dmsManifestGeneral", "dmsManifestOrders", "dmsManifestItem", "dmsGatepass", "routePlanning", "tracking","billablecost"]);
                    }]
                }
            })
            // region Consignment screen in DMS
            .state('EA.DMS.consignment', {
                url: '/consignment',
                templateUrl: 'app/eaxis/distribution/consignment/consignment.html',
                controller: "DMSConsignmentController as DMSConsignmentCtrl",
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "dmsconsignment", "dmsconsignmentMenu","dmsconsignmentGeneral","dmsconsignmentaddress"]);
                    }]
                }
            })
            // end region
            .state('EA.DMS.Dashboard', {
                url: '/dashboard',
                templateUrl: 'app/eaxis/distribution/dashboard/dashboard.html',
                controller: "DashboardController as DashboardCtrl",
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "eAxisDistribution", "Dashboard"]);
                    }]
                }
            })

            .state('EA.DMS.createGatepass', {
                url: '/create-gatepass',
                templateUrl: 'app/eaxis/distribution/create-gatepass/create-gatepass.html',
                controller: "CreateGatepassController as CreateGatepassCtrl",
                ncyBreadcrumb: {
                    label: 'GatePass'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "eAxisDistribution", "createGatepass", "gatepassMenu", "gatepassGeneral", "initiateGatepass"]);
                    }]
                }
            })
            .state('EA.DMS.createManifest', {
                url: '/create-manifest',
                templateUrl: 'app/eaxis/distribution/create-manifest/create-manifest.html',
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "eAxisDistribution", "dmsManifestList", "GatepassList", "manifestTab", "dmsManifestMenu", "dmsManifestGeneral", "dmsManifestAddress", "dmsManifestOrders", "dmsManifestItem", "approveManifest", "confirmTransportBooking", "dockinVehicle", "loadItems", "dockoutVehicle", "issueExitGatepass", "completeManifest", "pickupDelivery", "createManifest", "startLoad","deliveryRunsheet","billablecost"]);
                    }]
                }
            })

            .state('EA.DMS.TrasnportsReports', {
                url: '/transports-report',
                templateUrl: 'app/eaxis/distribution/transports-reports/reports.html',
                controller: "TransportsReportController as ReportCtrl",
                ncyBreadcrumb: {
                    label: 'Transport Reports'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", 'transportsReport']);
                    }]
                }
            })

            .state('EA.DMS.Otp', {
                url: '/otp-list',
                templateUrl: 'app/eaxis/distribution/otp-list/otp-list.html',
                controller: "OtpController as OtpCtrl",
                ncyBreadcrumb: {
                    label: 'OTP List'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", 'otpList']);
                    }]
                }
            })
    }
})();
