(function () {
    'use strict';

    angular
        .module("Application")
        .config(Config);

    Config.$inject = ['$stateProvider', '$ocLazyLoadProvider', "DYNAMIC_DASHBOARD_CONSTANT"];

    function Config($stateProvider, $ocLazyLoadProvider, DYNAMIC_DASHBOARD_CONSTANT) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: false,
            serie: false,
            modules: DYNAMIC_DASHBOARD_CONSTANT.ocLazyLoadModules
        });

        $stateProvider
            .state('EA.WMS.dynamicDashboard', {
                url: '/dynamic-dashboard',
                templateUrl: 'app/eaxis/dynamic-dashboard/dynamic-dashboard.html',
                controller: "DynamicDashboardController as DynamicDashboardCtrl",
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
                        return $ocLazyLoad.load(["chromeTab", "confirmation", "compareDate", "dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid", "drogAndDrop", "oneLevelMapping", "Summernote", "IconColorList", "eAxisDynamicDashboard", "dynamicDashboard", "PreviewDashboard", "AsnReceivedWithStatus", "AsnTrend", "OpenSO", "PickWithShortfall", "PutawayStatus", "GrnStatus", "CycleCountJobs", "Notification"]);
                    }]
                }
            })
    }
})();
