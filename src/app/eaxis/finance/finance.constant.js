(function () {
    "use strict";
    var ACCOUNT_CONSTANT = {
        ocLazyLoadModules: [{
            name: "Finance",
            files: [
                "app/eaxis/finance/finance.controller.js",
                "app/eaxis/finance/finance-job/finance-config.factory.js",
                'app/mdm/warehouse/customize-table/customize-table.css',
                'app/mdm/warehouse/customize-table/customize-table.directive.js',
                'app/mdm/warehouse/custom/customfilter.js'
            ]
        }, {
            name: "FinanceAccountPayable",
            files: [
                "app/eaxis/finance/accounts-payable/accounts-payable.controller.js"
            ]
        }, {
            name: "FinanceAccountPayableMenu",
            files: [
                "app/eaxis/finance/accounts-payable/account-payable-menu/account-payable-menu.directive.js",
                "app/eaxis/finance/accounts-payable/account-payable-menu/account-payable-menu.controller.js"
            ]
        },{
            name:"FinanceAccountPayableGeneral",
            files:[
                "app/eaxis/finance/accounts-payable/account-payable-general/account-payable-general.directive.js",
                "app/eaxis/finance/accounts-payable/account-payable-general/account-payable-general.controller.js"
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
            name: "FinanceJobDashboard",
            files: [
                "app/eaxis/finance/finance-job/finance-job-dashboard/finance-job-dashboard.controller.js",
                "app/eaxis/finance/finance-job/finance-job-dashboard/finance-job-dashboard.css"
            ]
        }, {
            name: "FinanceJob",
            files: [
                "app/eaxis/finance/finance-job/finance-job.controller.js"
            ]
        }, {
            name: "FinanceJobGeneral",
            files: [
                "app/eaxis/finance/finance-job/finance-job-general/finance-job-general.directive.js",
                "app/eaxis/finance/finance-job/finance-job-general/finance-job-general.controller.js",
                "app/eaxis/finance/finance-job/finance-job-general/finance-job-general.css"
            ]
        }, {
            name: "FinanceJobMenu",
            files: [
                "app/eaxis/finance/finance-job/finance-job-menu/finance-job-menu.directive.js",
                "app/eaxis/finance/finance-job/finance-job-menu/finance-job-menu.controller.js",
            ]
        }, {
            name: "FinanceReports",
            files: [
                "app/eaxis/finance/reports-finance/reports-finance.controller.js"
            ]
        }]
    };

    angular.module("Application")
        .constant("ACCOUNT_CONSTANT", ACCOUNT_CONSTANT);
})();