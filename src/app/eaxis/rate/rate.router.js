(function () {
    'use strict';

    angular
        .module("Application")
        .config(Config);

    Config.$inject = ['$stateProvider', '$ocLazyLoadProvider', "RATE_CONSTANT"];

    function Config($stateProvider, $ocLazyLoadProvider, RATE_CONSTANT) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: false,
            serie: false,
            modules: RATE_CONSTANT.ocLazyLoadModules
        });

        $stateProvider
            .state('EA.RAT', {
                abstract: true,
                url: '/RAT',
                templateUrl: 'app/eaxis/rate/rate.html',
                controller: "RateController as RateCtrl",
                ncyBreadcrumb: {
                    label: 'Rate'
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
                        return $ocLazyLoad.load(["EArate"]);
                    }]
                }
            })
            .state('EA.RAT.rateHeader', {
                url: '/Rate-Header',
                templateUrl: 'app/eaxis/rate/rate-header/rate-header.html',
                controller: "RateHeaderController as RateHeaderCtrl",
                ncyBreadcrumb: {
                    label: 'Rate'
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
                        return $ocLazyLoad.load(["chromeTab","errorWarning","confirmation","compareDate","dynamicListModal", "dynamicList", "dynamicLookup", "dynamicControl", "dynamicGrid","rateHeader","rateHeaderMenu"]);
                    }]
                }
            })
    }
})();