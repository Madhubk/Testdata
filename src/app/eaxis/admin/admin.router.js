(function () {
    'use strict';

    angular
        .module("Application")
        .config(Config);

    Config.$inject = ['$stateProvider', '$ocLazyLoadProvider', "EA_ADMIN_CONSTANT"];

    function Config($stateProvider, $ocLazyLoadProvider, EA_ADMIN_CONSTANT) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: false,
            serie: false,
            modules: EA_ADMIN_CONSTANT.ocLazyLoadModules
        });

        $stateProvider
            .state('EA.admin', {
                abstract: true,
                url: '/admin',
                templateUrl: 'app/eaxis/admin/admin.html',
                controller: "EAxisAdminController as EAxisAdminCtrl",
                ncyBreadcrumb: {
                    label: 'Admin'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["eAxisAdmin", "confirmation"]);
                    }]
                }
            })
            .state('EA.admin.home', {
                url: '/home',
                templateUrl: 'app/eaxis/admin/home/home.html',
                controller: "EAAdminHomeController as EAAdminHomeCtrl",
                ncyBreadcrumb: {
                    label: 'Home'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        // if (pageAccessService.CheckAuthToken()) {
                        //     deferred.resolve();
                        // }
                        pageAccessService.CheckPageAccess("/EA/admin/home").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["EAAdminHome"]);
                    }]
                }
            })
            .state('EA.admin.user', {
                url: '/user',
                templateUrl: 'app/eaxis/admin/user/user.html',
                controller: "TCUserController as TCUserCtrl",
                ncyBreadcrumb: {
                    label: 'User'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/EA/admin/user").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["EAUser"]);
                    }]
                }
            })
            .state('EA.admin.userRoleAppTenant', {
                url: '/user-role-app-tenant/:id',
                templateUrl: 'app/eaxis/admin/user-role-app-tenant/user-role-app-tenant.html',
                controller: "TCUserRoleAppTenantController as TCUserRoleAppTenantCtrl",
                ncyBreadcrumb: {
                    label: 'User Role Access'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/EA/admin/user-role-app-tenant").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["EAUserRoleAppTenant"]);
                    }]
                }
            })
            .state('EA.admin.mapping', {
                url: '/mapping/:id',
                templateUrl: 'app/eaxis/admin/mapping/mapping.html',
                controller: "MappingVerticalController as MappingVerticalCtrl",
                ncyBreadcrumb: {
                    label: 'Mapping'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/EA/admin/mapping").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["EAMapping"]);
                    }]
                }
            })
            .state('EA.admin.userAccess', {
                url: '/user-list/:id',
                templateUrl: 'app/eaxis/admin/user-list/user-list.html',
                controller: "TCUserListController as TCUserListCtrl",
                ncyBreadcrumb: {
                    label: 'User'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        // pageAccessService.CheckPageAccess("/EA/admin/user-list").then(function (response) {
                        //     if (response == true) {
                        //         deferred.resolve();
                        //     }
                        // });
                        deferred.resolve();
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["EAUserAccess"]);
                    }]
                }
            });
    }
})();
