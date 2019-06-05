(function () {
    "use strict";

    angular.module("Application")
        .config(Config);

    Config.$inject = ["$stateProvider", "$ocLazyLoadProvider", "ACCOUNT_CONSTANT"];

    function Config($stateProvider, $ocLazyLoadProvider, ACCOUNT_CONSTANT) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: false,
            serie: false,
            modules: ACCOUNT_CONSTANT.ocLazyLoadModules
        });

        $stateProvider
            .state("EA.finance", {
                abstract: true,
                url: "/finance",
                templateUrl: "app/eaxis/finance/finance.html",
                controller: "FinanceController as FinanceCtrl",
                ncyBreadcrumb: {
                    label: 'Finance'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["Finance"]);
                    }]
                }
            })
            .state('EA.finance.adminCosts', {
                url: '/admin-costs',
                templateUrl: 'app/eaxis/finance/admin-costs/admin-costs.html',
                controller: "FinanceAdminCostsController as FinanceAdminCostsCtrl",
                ncyBreadcrumb: {
                    label: 'Admin Costs'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    }],
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["FinanceAdminCosts"]);
                    }]
                }
            })
            .state("EA.finance.financeJobDashboard", {
                url: "/finance-job-dashboard",
                templateUrl: "app/eaxis/finance/finance-job/finance-job-dashboard/finance-job-dashboard.html",
                controller: "FinanceJobDashboardController as FinanceJobDashboardCtrl",
                ncyBrandCrumb: {
                    label: "Finance Job Dashboard"
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["FinanceJobDashboard"]);
                    }]
                }
            })
            .state("EA.finance.financeJob", {
                url: "/finance-job",
                templateUrl: "app/eaxis/finance/finance-job/finance-job.html",
                controller: "FinanceJobController as FinanceJobCtrl",
                ncyBrandCrumb: {
                    label: "Finance Job"
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["FinanceJob", "dynamicLookup", "dynamicListModal", "dynamicList", "dynamicGrid", "dynamicControl", "compareDate", "customToolbar", "confirmation", "chromeTab", "FinanceJobGeneral", "FinanceJobMenu", "errorWarning"]);
                    }]
                }
            })
            .state('EA.finance.accountPayable', {
                url: '/account-payable',
                templateUrl: "app/eaxis/finance/accounts-payable/accounts-payable.html",
                controller: "FinanceAccountPayableController as FinanceAccountPayableCtrl",
                ncyBreadcrumb: {
                    label: 'Accounts Payable'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    }],
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["FinanceAccountPayable", "dynamicLookup", "dynamicListModal", "dynamicList", "dynamicGrid", "dynamicControl", "compareDate", "customToolbar", "confirmation", "chromeTab", "errorWarning", "FinanceAccountPayableMenu", "FinanceAccountPayableGeneral"]);
                    }]
                }
            })
            .state('EA.finance.consolFinance', {
                url: "/consol-finance",
                templateUrl: "app/eaxis/finance/consol-finance/consol-finance.html",
                controller: "ConsoleFinanceController as ConsoleFinanceCtrl",
                ncyBrandCrumb: {
                    label: "Consol Finance"
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    }],
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["FinanceConsol"]);
                    }]
                }
            })
            .state('EA.finance.reportsFinance', {
                url: '/reports-finance',
                templateUrl: "app/eaxis/finance/reports-finance/reports-finance.html",
                controller: "ReportsFinanceController as ReportsFinanceCtrl",
                ncyBrandCrumb: {
                    label: "Reports"
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    }],
                    loadMyCtrl: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["FinanceReports"]);
                    }]
                }
            })
    }
})();