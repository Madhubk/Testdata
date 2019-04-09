(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PreviewDashboardController", PreviewDashboardController);

    PreviewDashboardController.$inject = ["$scope", "helperService", "$filter", "dynamicDashboardConfig", "appConfig", "apiService", "authService", "$timeout", "$uibModal", "param"];

    function PreviewDashboardController($scope, helperService, $filter, dynamicDashboardConfig, appConfig, apiService, authService, $timeout, $uibModal, param) {

        var PreviewDashboardCtrl = this;

        function Init() {
            PreviewDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Preview_Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            PreviewDashboardCtrl.ePage.Masters.SelectedDashboardDetails = angular.copy(param.Entity);
            PreviewDashboardCtrl.ePage.Masters.ClientDetails = angular.copy(param.ClientDetails);
            PreviewDashboardCtrl.ePage.Masters.WarehouseDetails = angular.copy(param.WarehouseDetails);
            PreviewDashboardCtrl.ePage.Masters.TempComponentList = angular.copy(param.TempComponentList);
            PreviewDashboardCtrl.ePage.Masters.ComponentList = angular.copy(param.ComponentList);
            PreviewDashboardCtrl.ePage.Masters.SelectedWarehouse = angular.copy(param.SelectedWarehouse);
            PreviewDashboardCtrl.ePage.Masters.SelectedClient = angular.copy(param.SelectedClient);

            PreviewDashboardCtrl.ePage.Masters.WarehouseChanged = WarehouseChanged;
            PreviewDashboardCtrl.ePage.Masters.OnChangeClient = OnChangeClient;
        }

        function WarehouseChanged() {
            var _ComponentList = angular.copy(PreviewDashboardCtrl.ePage.Masters.ComponentList);
            var IsShowDetails = $filter('filter')(_ComponentList, { IsShow: true })
            dynamicDashboardConfig.LoadedDirectiveCount = 0;
            PreviewDashboardCtrl.ePage.Masters.ComponentList = undefined;
            $timeout(function () {
                PreviewDashboardCtrl.ePage.Masters.ComponentList = IsShowDetails;
            }, 100);
        }

        function OnChangeClient() {
            var _ComponentList = angular.copy(PreviewDashboardCtrl.ePage.Masters.ComponentList);
            var IsShowDetails = $filter('filter')(_ComponentList, { IsShow: true })
            dynamicDashboardConfig.LoadedDirectiveCount = 0;
            PreviewDashboardCtrl.ePage.Masters.ComponentList = undefined;
            $timeout(function () {
                PreviewDashboardCtrl.ePage.Masters.ComponentList = IsShowDetails;
            }, 100);
        }
        Init();

    }

})();