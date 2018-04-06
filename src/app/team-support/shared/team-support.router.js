(function () {
    'use strict';

    angular
        .module("Application")
        .config(Config);

    Config.$inject = ['$stateProvider', '$ocLazyLoadProvider', "TEAM_SUPPORT_CONSTANT"];

    function Config($stateProvider, $ocLazyLoadProvider, TEAM_SUPPORT_CONSTANT) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: false,
            serie: false,
            modules: TEAM_SUPPORT_CONSTANT.ocLazyLoadModules
        });

        $stateProvider
            .state('TS', {
                abstract: true,
                url: '/TS',
                templateUrl: 'app/team-support/shared/team-support.html',
                controller: "TeamSupportController as TeamSupportCtrl",
                ncyBreadcrumb: {
                    label: 'Team Support'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckAccess("/TS").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(['changePassword', 'TeamSupport']);
                    }]
                }
            })
            .state('TS.home', {
                url: '/home',
                templateUrl: 'app/team-support/home/home.html',
                controller: "TeamSupportHomeController as SupportCtrl",
                ncyBreadcrumb: {
                    label: 'Home'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckAccess("/TS/home").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["changePassword", "TSHome"]);
                    }]
                }
            })
            .state('TS.backlog', {
                url: '/backlog',
                templateUrl: 'app/team-support/backlog/backlog.html',
                controller: "BacklogController as BacklogCtrl",
                ncyBreadcrumb: {
                    label: 'Backlog'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckAccess("/TS/backlog").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(['changePassword', 'TSBacklog']);
                    }]
                }
            })
            .state('TS.sprint', {
                url: '/sprint',
                templateUrl: 'app/team-support/sprint/sprint.html',
                controller: "SprintController as SprintCtrl",
                ncyBreadcrumb: {
                    label: 'Sprint'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckAccess("/TS/sprint").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(['changePassword', 'dynamicTable', 'TSSprint']);
                    }]
                }
            })
            .state('TS.timeSheet', {
                url: '/time-sheet',
                templateUrl: 'app/team-support/time-sheet/time-sheet.html',
                controller: "TSTimeSheetController as TSTimeSheetCtrl",
                ncyBreadcrumb: {
                    label: 'Time Sheet'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckAccess("/TS/time-sheet").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(['dynamicGrid', 'TSTimeSheet']);
                    }]
                }
            });
    }
})();
