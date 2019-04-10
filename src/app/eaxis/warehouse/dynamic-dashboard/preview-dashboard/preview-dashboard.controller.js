(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PreviewDashboardController", PreviewDashboardController);

    PreviewDashboardController.$inject = ["$scope", "helperService", "$filter", "dynamicDashboardConfig", "appConfig", "apiService", "authService", "$timeout", "param", "$uibModalInstance"];

    function PreviewDashboardController($scope, helperService, $filter, dynamicDashboardConfig, appConfig, apiService, authService, $timeout, param, $uibModalInstance) {

        var PreviewDashboardCtrl = this;

        function Init() {
            PreviewDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Preview_Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            dynamicDashboardConfig.LoadedDirectiveCount = 0;

            PreviewDashboardCtrl.ePage.Masters.SelectedDashboardDetails = angular.copy(param.Entity);
            PreviewDashboardCtrl.ePage.Masters.ClientDetails = angular.copy(param.ClientDetails);
            PreviewDashboardCtrl.ePage.Masters.WarehouseDetails = angular.copy(param.WarehouseDetails);
            PreviewDashboardCtrl.ePage.Masters.SelectedWarehouse = PreviewDashboardCtrl.ePage.Masters.WarehouseDetails[0];
            PreviewDashboardCtrl.ePage.Masters.SelectedClient = PreviewDashboardCtrl.ePage.Masters.ClientDetails[0];
            PreviewDashboardCtrl.ePage.Masters.TempComponentList = angular.copy(param.TempComponentList);
            PreviewDashboardCtrl.ePage.Masters.ComponentList = angular.copy(param.ComponentList);
            PreviewDashboardCtrl.ePage.Masters.SelectedDashboardComponentDetails = angular.copy(param.SelectedDashboardComponentDetails);

            PreviewDashboardCtrl.ePage.Masters.LoadMoreBtnTxt = "Load More";
            PreviewDashboardCtrl.ePage.Masters.LoadMore = LoadMore;
            PreviewDashboardCtrl.ePage.Masters.IsVisibleLoadMoreBtn = true;
            PreviewDashboardCtrl.ePage.Masters.ApplyBtnText = "Save";

            PreviewDashboardCtrl.ePage.Masters.WarehouseChanged = WarehouseChanged;
            PreviewDashboardCtrl.ePage.Masters.OnChangeClient = OnChangeClient;
            PreviewDashboardCtrl.ePage.Masters.Cancel = Cancel;
            PreviewDashboardCtrl.ePage.Masters.OnClickCustomizeButton = OnClickCustomizeButton;
            PreviewDashboardCtrl.ePage.Masters.Apply = Apply;
            PreviewDashboardCtrl.ePage.Masters.SavePreviewSetting = SavePreviewSetting;
            PreviewDashboardCtrl.ePage.Masters.dropCallback = dropCallback;
        }
        // #region - save 
        function SavePreviewSetting(item) {

        }
        // #endregion
        // #region - drag component
        function dropCallback(selectedComponent, ComponentList, index, external) {
            var _ComponentList = angular.copy(ComponentList)
            angular.forEach(_ComponentList, function (value, key) {
                if (value.Directive == selectedComponent.Directive && value.ComponentName == selectedComponent.ComponentName) {
                    var _obj = selectedComponent;
                    _ComponentList.splice(key, 1);
                    _ComponentList.splice(index - 1, 0, _obj);
                    dynamicDashboardConfig.LoadedDirectiveCount = 0;
                    PreviewDashboardCtrl.ePage.Masters.ComponentList = undefined;
                    $timeout(function () {
                        PreviewDashboardCtrl.ePage.Masters.ComponentList = _ComponentList;
                    }, 100);
                }
            });
            angular.forEach(_ComponentList, function (v, k) {
                v.SequenceNo = k + 1;
            });
        }
        // #endregion
        // #region - close the preview modal
        function Cancel() {
            $uibModalInstance.dismiss("cancel");
        }
        // #endregion
        // #region - On change warehouse
        function WarehouseChanged() {
            var _ComponentList = angular.copy(PreviewDashboardCtrl.ePage.Masters.ComponentList);
            var IsShowDetails = $filter('filter')(_ComponentList, { IsShow: true })
            dynamicDashboardConfig.LoadedDirectiveCount = 0;
            PreviewDashboardCtrl.ePage.Masters.ComponentList = undefined;
            $timeout(function () {
                PreviewDashboardCtrl.ePage.Masters.ComponentList = IsShowDetails;
            }, 100);
        }
        // #endregion
        // #region - On change client details
        function OnChangeClient() {
            var _ComponentList = angular.copy(PreviewDashboardCtrl.ePage.Masters.ComponentList);
            var IsShowDetails = $filter('filter')(_ComponentList, { IsShow: true })
            dynamicDashboardConfig.LoadedDirectiveCount = 0;
            PreviewDashboardCtrl.ePage.Masters.ComponentList = undefined;
            $timeout(function () {
                PreviewDashboardCtrl.ePage.Masters.ComponentList = IsShowDetails;
            }, 100);
        }
        // #endregion
        // #region - customize button
        function OnClickCustomizeButton() {
            $('#filterSideBar').toggleClass('open');
        }

        function Apply() {
            dynamicDashboardConfig.LoadedDirectiveCount = 0;
            PreviewDashboardCtrl.ePage.Masters.TempComponentList = $filter('orderBy')(PreviewDashboardCtrl.ePage.Masters.TempComponentList, '!IsLoadAsDefault');
            var _ComponentList = angular.copy(PreviewDashboardCtrl.ePage.Masters.TempComponentList);
            PreviewDashboardCtrl.ePage.Masters.IsShowDetails = $filter('filter')(_ComponentList, { IsShow: true })
            var LoadedAsDefaultDetails = $filter('filter')(PreviewDashboardCtrl.ePage.Masters.IsShowDetails, { IsLoadAsDefault: true })
            if (LoadedAsDefaultDetails.length >= 0) {
                dynamicDashboardConfig.LoadMoreCount = LoadedAsDefaultDetails.length;
            }
            PreviewDashboardCtrl.ePage.Masters.ComponentList = undefined;
            $timeout(function () {
                PreviewDashboardCtrl.ePage.Masters.ComponentList = LoadedAsDefaultDetails;
            }, 100);
            $('#filterSideBar').toggleClass('open');
        }
        // #endregion
        // #region - Load more button activity
        function LoadMore() {
            dynamicDashboardConfig.LoadMoreCount = dynamicDashboardConfig.LoadMoreCount + 4;
            PreviewDashboardCtrl.ePage.Masters.TempComponentList = $filter('orderBy')(PreviewDashboardCtrl.ePage.Masters.TempComponentList, '!IsLoadAsDefault');
            var _ComponentList = angular.copy(PreviewDashboardCtrl.ePage.Masters.TempComponentList);
            var IsShowDetails = $filter('filter')(_ComponentList, { IsShow: true })
            dynamicDashboardConfig.LoadedDirectiveCount = 0;
            PreviewDashboardCtrl.ePage.Masters.ComponentList = undefined;
            $timeout(function () {
                PreviewDashboardCtrl.ePage.Masters.ComponentList = IsShowDetails;
            }, 100);
        }
        // #endregion
        Init();

    }

})();