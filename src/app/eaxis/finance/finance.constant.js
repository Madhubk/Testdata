(function () {
    "use strict";
    var ACCOUNT_CONSTANT = {
        ocLazyLoadModules: [{
            name: "Finance",
            files: [
                "app/eaxis/finance/finance.controller.js",
                "app/eaxis/finance/finance-config.factory.js"
            ]
        }, {
            name: "FinanceAccountPayable",
            files: [
                "app/eaxis/finance/accounts-payable/accounts-payable.controller.js"
            ]
        }, {
            name: "FinanceAdminCosts",
            files: [
                "app/eaxis/finance/admin-costs/admin-costs.controller.js"
            ]
        }, {
            name: "FinanceConsol",
            files: [
                "app/eaxis/finance/consol-finance/consol-finance.controller.js"
            ]
        }, {
            name: "FinanceJob",
            files: [
                "app/eaxis/finance/finance-job/finance-job.css",
                "app/eaxis/finance/finance-job/finance-job.controller.js"
            ]
        }, {
            name: "FinanceReports",
            files: [
                "app/eaxis/finance/reports-finance/reports-finance.controller.js"
            ]
        }, {
            name: "FinanceJobAccouting",
            files: [
                "app/eaxis/finance/shared/job-accounting/job-accounting.directive.js",
                "app/eaxis/finance/shared/job-accounting/job-accounting.controller.js",
                "app/eaxis/finance/shared/job-accounting/job-accounting.css",
            ]
        }]
    };

    angular.module("Application")
        .constant("ACCOUNT_CONSTANT", ACCOUNT_CONSTANT);
})();