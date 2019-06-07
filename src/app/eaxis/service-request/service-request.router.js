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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "downtimeRequest", "downtimeRequestMenu", "downtimeRequestGeneral"]);
                    }]
                }
            })

            .state('EA.SRQ.serviceRequest', {
                url: '/service-request',
                templateUrl: 'app/eaxis/service-request/downtime-request/downtime-request.html',
                controller:"DowntimeRequestController as DowntimeRequestCtrl",
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
                        return $ocLazyLoad.load(["chromeTab", "errorWarning", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "CustomFileUpload", "standardMenu", "Comment", "CommentModal", "Document", "DocumentModal", "Email", "EmailModal", "Exception", "ExceptionModal", "downtimeRequest", "downtimeRequestMenu", "downtimeRequestGeneral"]);
                    }]
                }
            })
    }
})();