(function () {
    'use strict';

    angular
        .module("Application")
        .config(Config);

    Config.$inject = ['$stateProvider', '$ocLazyLoadProvider', "SERVICE_REQUEST_CONSTANT"];

    function Config($stateProvider, $ocLazyLoadProvider, SERVICE_REQUEST_CONSTANT) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: false,
            serie: false,
            modules: SERVICE_REQUEST_CONSTANT.ocLazyLoadModules
        });

        $stateProvider
            .state('EA.SRQ', {
                abstract: true,
                url: '/SRQ',
                templateUrl: 'app/eaxis/service-request/service-request.html',
                controller: "ServiceRequestController as ServiceRequestCtrl",
                ncyBreadcrumb: {
                    label: 'Service Request'
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
                        return $ocLazyLoad.load(["EAserviceRequest"]);
                    }]
                }
            })

            .state('EA.SRQ.serviceRequestDashboard', {
                url: '/dashboard',
                templateUrl: 'app/eaxis/service-request/dashboard/dashboard.html',
                controller: "ServiceRequestDashboardController as ServiceRequestDashboardCtrl",
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
                        return $ocLazyLoad.load(["chart", "dynamicMultiDashboard", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "inwardDashboard", "outwardDashboard", "locationDashboard", "serviceRequestDashboard"]);
                    }]
                }
            })

            .state('EA.SRQ.downtimeRequest', {
                url: '/downtime-request',
                templateUrl: 'app/eaxis/service-request/downtime-request/downtime-request.html',
                controller:"DowntimeRequestController as DowntimeRequestCtrl",
                ncyBreadcrumb: {
                    label: 'Downtime Request'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "downtimeRequest", "downtimeRequestMenu", "downtimeRequestGeneral"]);
                    }]
                }
            })

            .state('EA.SRQ.downtimeRequestGeneral', {
                url: '/downtime-request-general',
                templateUrl: 'app/eaxis/service-request/downtime-request/downtime-request-general/downtime-request-general.html',
                controller:"DowntimeRequestGeneralController as DowntimeRequestGeneralCtrl",
                ncyBreadcrumb: {
                    label: 'Downtime Request'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "downtimeRequest", "downtimeRequestMenu", "downtimeRequestGeneral", "myRequest"]);
                    }]
                }
            })

            .state('EA.SRQ.myRequest', {
                url: '/my-request',
                templateUrl: 'app/eaxis/service-request/my-request/my-request.html',
                controller:"MyRequestController as MyRequestCtrl",
                ncyBreadcrumb: {
                    label: 'My Request'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "myRequest","downtimeRequest", "downtimeRequestMenu","downtimeRequestGeneral","myRequestReadOnly"]);
                    }]
                }
            })

            .state('EA.SRQ.serviceRequestList', {
                url: '/service-request-list',
                templateUrl: 'app/eaxis/service-request/service-request-list/service-request-list.html',
                controller:"ServiceRequestListController as ServiceRequestListCtrl",
                ncyBreadcrumb: {
                    label: 'Service Request'
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "serviceRequestList", "serviceRequestListReadOnly"]);
                    }]
                }
            })  
            
            .state('EA.SRQ.serviceRequestReport', {
                url: '/service-request-report',
                templateUrl: 'app/eaxis/serviceRequest/general-module/serviceRequest-report/serviceRequest-report.html',
                controller: "WarehouseReportController as WarehouseReportCtrl",
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "serviceRequestReports", "reportGrid"]);
                    }]
                }
            })
    }
})();