(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PreviewDashboardController", PreviewDashboardController);

    PreviewDashboardController.$inject = ["$scope", "helperService", "$filter", "dynamicDashboardConfig", "appConfig", "apiService", "authService", "$timeout", "param", "$uibModalInstance", "warehouseConfig"];

    function PreviewDashboardController($scope, helperService, $filter, dynamicDashboardConfig, appConfig, apiService, authService, $timeout, param, $uibModalInstance, warehouseConfig) {

        var PreviewDashboardCtrl = this;

        function Init() {
            PreviewDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Preview_Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            PreviewDashboardCtrl.ePage.Masters.Config = dynamicDashboardConfig;
            PreviewDashboardCtrl.ePage.Masters.SelectedDashboardDetails = param.Entity;

            if (PreviewDashboardCtrl.ePage.Masters.SelectedDashboardDetails.UIDASDashboardsHeader.IsWarehouseBased)
                GetWarehouseValues();
            else {
                PreviewDashboardCtrl.ePage.Masters.SelectedWarehouse = {};
                if (PreviewDashboardCtrl.ePage.Masters.SelectedDashboardDetails.UIDASDashboardsHeader.IsOrganisationBased)
                    GetClientDetails();
                else
                    PreviewDashboardCtrl.ePage.Masters.SelectedClient = {};
            }

            PreviewDashboardCtrl.ePage.Masters.TempComponentList = PreviewDashboardCtrl.ePage.Masters.SelectedDashboardDetails.UIDASDashboardComponents;
            PreviewDashboardCtrl.ePage.Masters.TempComponentList = $filter('orderBy')(PreviewDashboardCtrl.ePage.Masters.TempComponentList, 'DC_DisplayOrder');
            PreviewDashboardCtrl.ePage.Masters.TempComponentList = $filter('orderBy')(PreviewDashboardCtrl.ePage.Masters.TempComponentList, '!DC_ShowByDefault');
            PreviewDashboardCtrl.ePage.Masters.IsShowDetails = $filter('filter')(PreviewDashboardCtrl.ePage.Masters.TempComponentList, { DC_IsEnabled: true })
            var LoadedAsDefaultDetails = $filter('filter')(PreviewDashboardCtrl.ePage.Masters.IsShowDetails, { DC_ShowByDefault: true })
            if (LoadedAsDefaultDetails.length >= 0) {
                dynamicDashboardConfig.LoadMoreCount = LoadedAsDefaultDetails.length;
            }
            dynamicDashboardConfig.LoadedDirectiveCount = 0;
            PreviewDashboardCtrl.ePage.Masters.ComponentList = angular.copy(LoadedAsDefaultDetails);

            PreviewDashboardCtrl.ePage.Masters.LoadMoreBtnTxt = "Load More";
            PreviewDashboardCtrl.ePage.Masters.LoadMore = LoadMore;
            PreviewDashboardCtrl.ePage.Masters.IsVisibleLoadMoreBtn = true;
            PreviewDashboardCtrl.ePage.Masters.ApplyBtnText = "Apply";

            PreviewDashboardCtrl.ePage.Masters.WarehouseChanged = WarehouseChanged;
            PreviewDashboardCtrl.ePage.Masters.OnChangeClient = OnChangeClient;
            PreviewDashboardCtrl.ePage.Masters.Cancel = Cancel;
            PreviewDashboardCtrl.ePage.Masters.OnClickCustomizeButton = OnClickCustomizeButton;
            PreviewDashboardCtrl.ePage.Masters.Apply = Apply;
            PreviewDashboardCtrl.ePage.Masters.dropCallback = dropCallback;
        }
        // #region - drag component
        function dropCallback(selectedComponent, index) {
            angular.forEach(PreviewDashboardCtrl.ePage.Masters.SelectedDashboardDetails.UIDASDashboardComponents, function (value, key) {
                if (value.DC_DSC_DirectiveName == selectedComponent.DC_DSC_DirectiveName && value.DC_DSC_Name == selectedComponent.DC_DSC_Name) {
                    selectedComponent.DC_ShowByDefault = true;
                    var _obj = selectedComponent;
                    PreviewDashboardCtrl.ePage.Masters.SelectedDashboardDetails.UIDASDashboardComponents.splice(key, 1);
                    PreviewDashboardCtrl.ePage.Masters.SelectedDashboardDetails.UIDASDashboardComponents.splice(index - 1, 0, _obj);
                }
            });
            angular.forEach(PreviewDashboardCtrl.ePage.Masters.SelectedDashboardDetails.UIDASDashboardComponents, function (v, k) {
                v.DC_DisplayOrder = k + 1;
            });
            PreviewDashboardCtrl.ePage.Masters.SelectedDashboardDetails = filterObjectUpdate(PreviewDashboardCtrl.ePage.Masters.SelectedDashboardDetails, "IsModified");
            apiService.post("eAxisAPI", dynamicDashboardConfig.Entities.DASDashBoardList.API.Update.Url, PreviewDashboardCtrl.ePage.Masters.SelectedDashboardDetails).then(function (response) {
                if (response.data.Response) {
                    PreviewDashboardCtrl.ePage.Masters.SelectedDashboardDetails = response.data.Response;
                    Init();
                }
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
            var IsShowDetails = $filter('filter')(_ComponentList, { DC_IsEnabled: true })
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
            var IsShowDetails = $filter('filter')(_ComponentList, { DC_IsEnabled: true })
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
            PreviewDashboardCtrl.ePage.Masters.SelectedDashboardDetails = filterObjectUpdate(PreviewDashboardCtrl.ePage.Masters.SelectedDashboardDetails, "IsModified");
            apiService.post("eAxisAPI", dynamicDashboardConfig.Entities.DASDashBoardList.API.Update.Url, PreviewDashboardCtrl.ePage.Masters.SelectedDashboardDetails).then(function (response) {
                if (response.data.Response) {
                    PreviewDashboardCtrl.ePage.Masters.SelectedDashboardDetails = response.data.Response;
                    Init();
                    $('#filterSideBar').toggleClass('open');
                }
            });
        }
        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }
        // #endregion
        // #region - Load more button activity
        function LoadMore() {
            dynamicDashboardConfig.LoadMoreCount = dynamicDashboardConfig.LoadMoreCount + 4;
            PreviewDashboardCtrl.ePage.Masters.TempComponentList = $filter('orderBy')(PreviewDashboardCtrl.ePage.Masters.TempComponentList, '!DC_ShowByDefault');
            var _ComponentList = angular.copy(PreviewDashboardCtrl.ePage.Masters.TempComponentList);
            PreviewDashboardCtrl.ePage.Masters.IsShowDetails = $filter('filter')(_ComponentList, { DC_IsEnabled: true })
            dynamicDashboardConfig.LoadedDirectiveCount = 0;
            PreviewDashboardCtrl.ePage.Masters.ComponentList = undefined;
            $timeout(function () {
                PreviewDashboardCtrl.ePage.Masters.ComponentList = PreviewDashboardCtrl.ePage.Masters.IsShowDetails;
            }, 100);
        }
        // #endregion
        // #region - Get warehouse details
        function GetWarehouseValues() {
            //Get Warehouse Details
            PreviewDashboardCtrl.ePage.Masters.LoadingValue = "Getting mapped Warehouse...";
            var _input = {
                "FilterID": warehouseConfig.Entities.WmsWarehouse.API.FindAll.FilterID,
                "SearchInput": []
            };

            apiService.post("eAxisAPI", warehouseConfig.Entities.WmsWarehouse.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        PreviewDashboardCtrl.ePage.Masters.WarehouseDetails = response.data.Response;
                        PreviewDashboardCtrl.ePage.Masters.SelectedWarehouse = PreviewDashboardCtrl.ePage.Masters.WarehouseDetails[0];
                        PreviewDashboardCtrl.ePage.Masters.LoadingValue = "";
                    } else {
                        PreviewDashboardCtrl.ePage.Masters.SelectedWarehouse = {};
                        PreviewDashboardCtrl.ePage.Masters.LoadingValue = "No Warehouse Mapped for this User";
                    }
                    if (PreviewDashboardCtrl.ePage.Masters.SelectedDashboardDetails.UIDASDashboardsHeader.IsOrganisationBased)
                        GetClientDetails();
                    else
                        PreviewDashboardCtrl.ePage.Masters.SelectedClient = {};
                }
            });
        }

        function WarehouseChanged() {
            var _ComponentList = angular.copy(PreviewDashboardCtrl.ePage.Masters.ComponentList);
            var IsShowDetails = $filter('filter')(_ComponentList, { DC_IsEnabled: true })
            dynamicDashboardConfig.LoadedDirectiveCount = 0;
            PreviewDashboardCtrl.ePage.Masters.ComponentList = undefined;
            $timeout(function () {
                PreviewDashboardCtrl.ePage.Masters.ComponentList = IsShowDetails;
            }, 100);
        }
        // #endregion
        // #region - Get Client Details
        function GetClientDetails() {
            PreviewDashboardCtrl.ePage.Masters.LoadingValue = "Getting mapped Organization...";
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "Item_FK": authService.getUserInfo().UserPK,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "FilterID": warehouseConfig.Entities.UserOrganisation.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_filter)
            }
            apiService.post("authAPI", warehouseConfig.Entities.UserOrganisation.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Status == "Success") {
                    if (response.data.Response.length > 0) {
                        PreviewDashboardCtrl.ePage.Masters.ClientDetails = response.data.Response;
                        PreviewDashboardCtrl.ePage.Masters.SelectedClient = PreviewDashboardCtrl.ePage.Masters.ClientDetails[0];
                        PreviewDashboardCtrl.ePage.Masters.LoadingValue = "";
                    } else {
                        PreviewDashboardCtrl.ePage.Masters.SelectedClient = undefined;
                        PreviewDashboardCtrl.ePage.Masters.LoadingValue = "No Organization Mapped for this User";
                    }
                }
            });
        }
        function OnChangeClient() {
            var _ComponentList = angular.copy(PreviewDashboardCtrl.ePage.Masters.ComponentList);
            var IsShowDetails = $filter('filter')(_ComponentList, { DC_IsEnabled: true })
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