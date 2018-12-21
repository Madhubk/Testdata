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
                        return $ocLazyLoad.load(["trustCenter", "eAxisAdmin", "confirmation"]);
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
                template: `<div class="clearfix p-0"><div data-ng-include="'app/trust-center/user/user.html'"></div></div>`,
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
                        return $ocLazyLoad.load(["TCUser"]);
                    }]
                }
            })
            .state('EA.admin.userAccess', {
                url: '/user-list/:id',
                template: `<div class="clearfix p-0"><div data-ng-include="'app/trust-center/user-list/user-list.html'"></div></div>`,
                controller: "TCUserListController as TCUserListCtrl",
                ncyBreadcrumb: {
                    label: 'User'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/EA/admin/user-list").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        deferred.resolve();
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCUserList"]);
                    }]
                }
            })
            .state('EA.admin.userRoleAppTenant', {
                url: '/user-role-app-tenant/:id',
                template: `<div class="clearfix p-0"><div data-ng-include="'app/trust-center/mapping/user-role-app-tenant/user-role-app-tenant.html'"></div></div>`,
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
                        return $ocLazyLoad.load(["TCUserRoleAppTenant"]);
                    }]
                }
            })
            .state('EA.admin.userWarehouseAppTenant', {
                url: '/user-warehouse-app-tenant/:id',
                template: `<div class="clearfix p-0"><div data-ng-include="'app/trust-center/mapping/user-warehouse-app-tenant/user-warehouse-app-tenant.html'"></div></div>`,
                controller: "TCUserWarehouseAppTenantController as TCUserWarehouseAppTenantCtrl",
                ncyBreadcrumb: {
                    label: 'User Warehouse App Tenant Access'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/EA/admin/user-warehouse-app-tenant").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        deferred.resolve();
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCUserWarehouseAppTenant"]);
                    }]
                }
            })
            .state('EA.admin.userOrganizationAppTenant', {
                url: '/user-organization-app-tenant/:id',
                template: `<div class="clearfix p-0"><div data-ng-include="'app/trust-center/mapping/user-organization-app-tenant/user-organization-app-tenant.html'"></div></div>`,
                controller: "TCUserOrganizationAppTenantController as TCUserOrganizationAppTenantCtrl",
                ncyBreadcrumb: {
                    label: 'User Organization App Tenant Access'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        pageAccessService.CheckPageAccess("/EA/admin/user-organization-app-tenant").then(function (response) {
                            if (response == true) {
                                deferred.resolve();
                            }
                        });
                        deferred.resolve();
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["TCUserOrganizationAppTenant"]);
                    }]
                }
            });
    }
})();
