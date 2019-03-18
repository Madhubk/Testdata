(function () {
    "use strict";

    angular.module("Application")
        .controller("FinanceJobDashboardController", FinanceJobDashboardController);

    FinanceJobDashboardController.$inject = ["$window", "helperService", "financeConfig"];

    function FinanceJobDashboardController($window, helperService, financeConfig) {
        var FinanceJobDashboardCtrl = this;

        function Init() {
            FinanceJobDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Finance_Job_Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": financeConfig.Entities
            };

            /* Function */
            FinanceJobDashboardCtrl.ePage.Masters.FinanceSelection = FinanceSelection;
        }

        function FinanceSelection(mode) {
            switch (mode) {
                case 'FF':
                    financeConfig.DataentryName = "FreightJobList";
                    financeConfig.DataentryTitle = "Freight Finance";
                    break;
                case 'WF':
                    financeConfig.DataentryName = "WarehouseJobList";
                    financeConfig.DataentryTitle = "Warehouse Finance";
                    break;
                case 'TF':
                    financeConfig.DataentryName = "TransportJobList";
                    financeConfig.DataentryTitle = "Transport Finance";
                    break
                default:
                    break;
            }
            $window.location.href = "#/EA/finance/finance-job"
        }

        Init();
    }
})();