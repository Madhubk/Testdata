(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DynamicDashboardController", DynamicDashboardController);

    DynamicDashboardController.$inject = ["$scope", "helperService", "$filter", "dynamicDashboardConfig", "appConfig", "apiService", "authService", "$timeout", "$uibModal"];

    function DynamicDashboardController($scope, helperService, $filter, dynamicDashboardConfig, appConfig, apiService, authService, $timeout, $uibModal) {

        var DynamicDashboardCtrl = this;

        function Init() {
            DynamicDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "DynamicDashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitAction();
        }
        // #region - Funcation call and Variable Declaration
        function InitAction() {
            DynamicDashboardCtrl.ePage.Masters.LoadMoreBtnTxt = "Load More";
            DynamicDashboardCtrl.ePage.Masters.LoadMore = LoadMore;
            DynamicDashboardCtrl.ePage.Masters.IsVisibleLoadMoreBtn = true;
            DynamicDashboardCtrl.ePage.Masters.ApplyBtnText = "Save";
            DynamicDashboardCtrl.ePage.Masters.IsApplyBtnDisable = false;
            DynamicDashboardCtrl.ePage.Masters.SaveSettingBtnText = "Save";

            DynamicDashboardCtrl.ePage.Masters.dropCallback = dropCallback;
            DynamicDashboardCtrl.ePage.Masters.WarehouseChanged = WarehouseChanged;
            DynamicDashboardCtrl.ePage.Masters.OnChangeClient = OnChangeClient;
            DynamicDashboardCtrl.ePage.Masters.Apply = Apply;
            DynamicDashboardCtrl.ePage.Masters.OnChangeIsDashboardRole = OnChangeIsDashboardRole;
            DynamicDashboardCtrl.ePage.Masters.OnClickCustomizeButton = OnClickCustomizeButton;
            DynamicDashboardCtrl.ePage.Masters.OnChangeDashboardList = OnChangeDashboardList;
            DynamicDashboardCtrl.ePage.Masters.Edit = Edit;
            DynamicDashboardCtrl.ePage.Masters.SaveEditDashboardSetting = SaveEditDashboardSetting;
            DynamicDashboardCtrl.ePage.Masters.CloseEditDetailsActivity = CloseEditDetailsActivity;
            DynamicDashboardCtrl.ePage.Masters.SelectedIconColor = SelectedIconColor;
            DynamicDashboardCtrl.ePage.Masters.GetComponentListForDashboardSettings = GetComponentListForDashboardSettings;
            DynamicDashboardCtrl.ePage.Masters.CloseComponentSettingActivity = CloseComponentSettingActivity;
            DynamicDashboardCtrl.ePage.Masters.SaveCompDashboardSetting = SaveCompDashboardSetting;
            DynamicDashboardCtrl.ePage.Masters.RoleAccesDashboardSetting = RoleAccesDashboardSetting;
            DynamicDashboardCtrl.ePage.Masters.CloseRoleSettingActivity = CloseRoleSettingActivity;
            DynamicDashboardCtrl.ePage.Masters.PreviewDashboardSetting = PreviewDashboardSetting;
            DynamicDashboardCtrl.ePage.Masters.ClosePreviewDetailsActivity = ClosePreviewDetailsActivity;
            DynamicDashboardCtrl.ePage.Masters.SavePreviewActivity = SavePreviewActivity;

            DynamicDashboardCtrl.ePage.Masters.Settings = Settings;
            DynamicDashboardCtrl.ePage.Masters.CloseEditActivity = CloseEditActivity;

            DynamicDashboardCtrl.ePage.Masters.Config = dynamicDashboardConfig;
            GetRoleList();
            GetSettingsButtonAccess();
            GetDashboardListBasedOnRole();
            GetComponentListDetails();
        }
        // #endregion
        // #region - Preview the dashboard setting
        function PreviewDashboardSetting(item) {
            DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails = item;
            var previewModalInstances = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "dashboard-setting-edit right address",
                scope: $scope,
                templateUrl: "app/eaxis/dynamic-dashboard/preview-dashboard/preview-dashboard.html",
                controller: 'PreviewDashboardController as PreviewDashboardCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Entity": DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails,
                            "ClientDetails": DynamicDashboardCtrl.ePage.Masters.ClientDetails,
                            "WarehouseDetails": DynamicDashboardCtrl.ePage.Masters.WarehouseDetails,
                            "TempComponentList": DynamicDashboardCtrl.ePage.Masters.TempComponentList,
                            "ComponentList": DynamicDashboardCtrl.ePage.Masters.ComponentList,
                            "SelectedDashboardComponentDetails": DynamicDashboardCtrl.ePage.Masters.SelectedDashboardComponentDetails
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    if (response.data) {
                    }
                },
                function () {
                    console.log("Cancelled");
                }
            );
        }

        function ClosePreviewDetailsActivity() {
            DynamicDashboardCtrl.ePage.Masters.previewModalInstances.dismiss('cancel');
        }
        function SavePreviewActivity() {

        }
        // #endregion 
        // #region - get role list based on party 
        function RoleAccesDashboardSetting(item) {
            DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails = item;
            var _filter = {
                "ItemCode": item.Name,
                "MappingCode": "DASH_ROLE_APP_TNT"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecMappings.API.FindAll.FilterID
            };
            apiService.post("authAPI", appConfig.Entities.SecMappings.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DynamicDashboardCtrl.ePage.Masters.DashboardRoleDetails = response.data.Response;
                    if (DynamicDashboardCtrl.ePage.Masters.DashboardRoleDetails.length > 0) {
                        angular.forEach(DynamicDashboardCtrl.ePage.Masters.RoleList, function (value, key) {
                            angular.forEach(DynamicDashboardCtrl.ePage.Masters.DashboardRoleDetails, function (value1, key1) {
                                if (value.RoleName == value1.AccessCode) {
                                    value.IsDashboardRole = true;
                                    value.SecMapping_FK = value1.PK;
                                }
                            });
                        });
                    } else {
                        angular.forEach(DynamicDashboardCtrl.ePage.Masters.RoleList, function (value, key) {
                            value.IsDashboardRole = false;
                            value.SecMapping_FK = undefined;
                        });
                    }
                    OpenRoleAccessDashboardSetting().result.then(function (response) { }, function () { });
                }
            });
        }

        function OpenRoleAccessDashboardSetting() {
            return DynamicDashboardCtrl.ePage.Masters.roleModalInstances = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "dashboard-setting-edit-details right address",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/dynamic-dashboard/role-access-dashboard-settings.html"
            });
        }

        function CloseRoleSettingActivity() {
            DynamicDashboardCtrl.ePage.Masters.roleModalInstances.dismiss('cancel');
        }

        function GetRoleList() {
            var _filter = {
                SAP_FK: authService.getUserInfo().AppPK,
                TenantCode: authService.getUserInfo().TenantCode,
                Party_FK: authService.getUserInfo().PartyPK
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecRole.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.SecRole.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DynamicDashboardCtrl.ePage.Masters.RoleList = response.data.Response;
                }
            });
        }

        function OnChangeIsDashboardRole(item) {
            if (item.IsDashboardRole) {
                var _obj = {
                    "MappingCode": "DASH_ROLE_APP_TNT",
                    "ItemName": "DASHBOARD",
                    "Item_FK": DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails.PK,
                    "ItemCode": DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails.DashboardName,
                    "AccessTo": "ROLE",
                    "Access_FK": item.PK,
                    "AccessCode": item.RoleName,
                    "SAP_FK": authService.getUserInfo().AppPK,
                    "SAP_Code": authService.getUserInfo().AppCode,
                };
                apiService.post("authAPI", appConfig.Entities.SecMappings.API.Insert.Url, [_obj]).then(function (response) {
                    if (response.data.Response) {
                    }
                });
            } else {
                if (item.SecMapping_FK) {
                    apiService.get("authAPI", appConfig.Entities.SecMappings.API.Delete.Url + item.SecMapping_FK).then(function (response) {
                        if (response.data.Response) {
                        }
                    });
                }
            }
        }
        // #endregion
        // #region - Get component List for Selected Dashboard Setting
        function GetComponentListForDashboardSettings(item) {
            angular.forEach(DynamicDashboardCtrl.ePage.Masters.TotalComponentList, function (value, key) {
                angular.forEach(item.ComponentList, function (value1, key1) {
                    if (value.ComponentName == value1.ComponentName) {
                        value.IsLoadedInThisDashboard = true;
                    }
                });
            });
            DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails = item;
            OpenComponentListDashboardSetting().result.then(function (response) { }, function () { });
        }
        function OpenComponentListDashboardSetting() {
            return DynamicDashboardCtrl.ePage.Masters.componentModalInstances = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "dashboard-setting-edit-details right address",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/dynamic-dashboard/component-dashboard-settings.html"
            });
        }
        function CloseComponentSettingActivity() {
            DynamicDashboardCtrl.ePage.Masters.componentModalInstances.dismiss('cancel');
        }
        function SaveCompDashboardSetting(item) {            
            var _TempList = $filter('filter')(DynamicDashboardCtrl.ePage.Masters.TotalComponentList, { IsLoadedInThisDashboard: true })
            angular.forEach(DynamicDashboardCtrl.ePage.Masters.DashboardList, function (value, key) {
                if (value.PK == item.PK) {
                    value.ComponentList = _TempList;
                }
            });

            DynamicDashboardCtrl.ePage.Masters.TempComponentList = angular.copy(_TempList);
            DynamicDashboardCtrl.ePage.Masters.TempComponentList = $filter('orderBy')(DynamicDashboardCtrl.ePage.Masters.TempComponentList, 'SequenceNo');
            DynamicDashboardCtrl.ePage.Masters.TempComponentList = $filter('orderBy')(DynamicDashboardCtrl.ePage.Masters.TempComponentList, '!DC_ShowByDefault');
            DynamicDashboardCtrl.ePage.Masters.IsShowDetails = $filter('filter')(DynamicDashboardCtrl.ePage.Masters.TempComponentList, { DC_IsEnabled: true })
            var LoadedAsDefaultDetails = $filter('filter')(DynamicDashboardCtrl.ePage.Masters.IsShowDetails, { DC_ShowByDefault: true })
            if (LoadedAsDefaultDetails.length >= 0) {
                dynamicDashboardConfig.LoadMoreCount = LoadedAsDefaultDetails.length;
            }
            dynamicDashboardConfig.LoadedDirectiveCount = 0;
            DynamicDashboardCtrl.ePage.Masters.ComponentList = undefined;
            $timeout(function () {
                DynamicDashboardCtrl.ePage.Masters.ComponentList = angular.copy(LoadedAsDefaultDetails);
            }, 100);
            DynamicDashboardCtrl.ePage.Masters.componentModalInstances.dismiss('cancel');
        }
        // #endregion
        // #region - Edit Dashboard setting
        function Edit(item) {
            DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails = item;
            EditDashboardSetting().result.then(function (response) { }, function () { });
        }
        function EditDashboardSetting() {
            return DynamicDashboardCtrl.ePage.Masters.editModalInstances = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "dashboard-setting-edit-details right address",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/dynamic-dashboard/edit-dashboard-settings.html"
            });
        }
        function CloseEditDetailsActivity() {
            DynamicDashboardCtrl.ePage.Masters.editModalInstances.dismiss('cancel');
        }
        function SaveEditDashboardSetting(item) {
            angular.forEach(DynamicDashboardCtrl.ePage.Masters.DashboardList, function (value, key) {
                if (value.PK == item.PK) {
                    value = item;
                }
            });
            angular.forEach(DynamicDashboardCtrl.ePage.Masters._TempDashboardListBasedOnRole, function (value, key) {
                if (value.Dashboard_FK == item.PK) {
                    value.DashboardName = item.DashboardName;
                    value.Icon = item.Icon;
                    value.IsWarehouseBased = item.IsWarehouseBased;
                    value.IsClientBased = item.IsClientBased;
                }
            });
            DynamicDashboardCtrl.ePage.Masters.editModalInstances.dismiss('cancel');
            if (item.IsWarehouseBased)
                GetWarehouseValues();
            else
                DynamicDashboardCtrl.ePage.Masters.SelectedWarehouse = {};
            if (item.IsClientBased)
                GetClientDetails();
            else
                DynamicDashboardCtrl.ePage.Masters.SelectedClient = {};
            var IsShowDetails = angular.copy(DynamicDashboardCtrl.ePage.Masters.ComponentList);
            dynamicDashboardConfig.LoadedDirectiveCount = 0;
            DynamicDashboardCtrl.ePage.Masters.ComponentList = undefined;
            $timeout(function () {
                DynamicDashboardCtrl.ePage.Masters.ComponentList = IsShowDetails;
            }, 100);
        }
        function SelectedIconColor(item) {
            DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails.Icon = item;
        }
        // #endregion 
        // #region - Get dashboard list based on Role
        function GetDashboardListBasedOnRole() {
            var _filter = {
                "AccessCode": authService.getUserInfo().RoleCode,
                "MappingCode": "DASH_ROLE_APP_TNT"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecMappings.API.FindAll.FilterID
            };
            apiService.post("authAPI", appConfig.Entities.SecMappings.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _DashboardName = "";
                        angular.forEach(response.data.Response, function (value, key) {
                            _DashboardName = _DashboardName + value.ItemCode + ",";
                        });
                        _DashboardName = _DashboardName.slice(0, -1);
                        var _filter = {
                            "NameIn": _DashboardName
                        };
                        var _input = {
                            "searchInput": helperService.createToArrayOfObject(_filter),
                            "FilterID": dynamicDashboardConfig.Entities.Dashboards.API.FindAll.FilterID
                        };
                        apiService.post("eAxisAPI", dynamicDashboardConfig.Entities.Dashboards.API.FindAll.Url, _input).then(function (response) {
                            if (response.data.Response) {
                                DynamicDashboardCtrl.ePage.Masters.DashboardListBasedOnRole = response.data.Response;
                                DynamicDashboardCtrl.ePage.Masters.SelectedDashboardDetails = DynamicDashboardCtrl.ePage.Masters.DashboardListBasedOnRole[0];
                                if (DynamicDashboardCtrl.ePage.Masters.SelectedDashboardDetails)
                                    OnChangeDashboardList();
                            }
                        });
                    }
                }
            });
        }

        function OnChangeDashboardList() {
            if (DynamicDashboardCtrl.ePage.Masters.SelectedDashboardDetails.IsWarehouseBased)
                GetWarehouseValues();
            else
                DynamicDashboardCtrl.ePage.Masters.SelectedWarehouse = {};
            if (DynamicDashboardCtrl.ePage.Masters.SelectedDashboardDetails.IsClientBased)
                GetClientDetails();
            else
                DynamicDashboardCtrl.ePage.Masters.SelectedClient = {};
            GetDashboardList();
        }
        // #endregion
        // #region - Dashboard settings
        function GetSettingsButtonAccess() {
            var _filter = {
                ItemCode: "Dashboard Settings",
                AccessCode: authService.getUserInfo().RoleCode
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ComponentRole.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.ComponentRole.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DynamicDashboardCtrl.ePage.Masters.ComponentRoleDetails = response.data.Response;
                }
            });
        }

        function Settings() {
            openDashboardSetting().result.then(function (response) { }, function () { });
        }

        function openDashboardSetting() {
            return DynamicDashboardCtrl.ePage.Masters.modalInstances = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "dashboard-setting-edit right address",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/dynamic-dashboard/dashboard-settings.html"
            });
        }

        function CloseEditActivity() {
            DynamicDashboardCtrl.ePage.Masters.modalInstances.dismiss('cancel');
        }
        // #endregion
        // #region - get Component list based on Dashboard list 
        function GetDashboardList() {
            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": dynamicDashboardConfig.Entities.Dashboards.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", dynamicDashboardConfig.Entities.Dashboards.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DynamicDashboardCtrl.ePage.Masters.DashboardList = response.data.Response;
                }
            });

            var _filter = {
                "DSH_FK": DynamicDashboardCtrl.ePage.Masters.SelectedDashboardDetails.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": dynamicDashboardConfig.Entities.DASDashBoardList.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", dynamicDashboardConfig.Entities.DASDashBoardList.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DynamicDashboardCtrl.ePage.Masters.SelectedDashboardComponentDetails = angular.copy(response.data.Response);
                    DynamicDashboardCtrl.ePage.Masters.TempComponentList = angular.copy(response.data.Response);
                    DynamicDashboardCtrl.ePage.Masters.TempComponentList = $filter('orderBy')(DynamicDashboardCtrl.ePage.Masters.TempComponentList, 'DC_DisplayOrder');
                    DynamicDashboardCtrl.ePage.Masters.TempComponentList = $filter('orderBy')(DynamicDashboardCtrl.ePage.Masters.TempComponentList, '!DC_ShowByDefault');
                    DynamicDashboardCtrl.ePage.Masters.IsShowDetails = $filter('filter')(DynamicDashboardCtrl.ePage.Masters.TempComponentList, { DC_IsEnabled: true })
                    var LoadedAsDefaultDetails = $filter('filter')(DynamicDashboardCtrl.ePage.Masters.IsShowDetails, { DC_ShowByDefault: true })
                    if (LoadedAsDefaultDetails.length >= 0) {
                        dynamicDashboardConfig.LoadMoreCount = LoadedAsDefaultDetails.length;
                    }
                    dynamicDashboardConfig.LoadedDirectiveCount = 0;
                    DynamicDashboardCtrl.ePage.Masters.ComponentList = angular.copy(LoadedAsDefaultDetails);
                }
            });
        }
        // #endregion
        // #region - customize button
        function OnClickCustomizeButton() {
            $('#filterSideBar').toggleClass('open');
        }

        function Apply() {
            dynamicDashboardConfig.LoadedDirectiveCount = 0;
            DynamicDashboardCtrl.ePage.Masters.TempComponentList = $filter('orderBy')(DynamicDashboardCtrl.ePage.Masters.TempComponentList, '!DC_ShowByDefault');
            var _ComponentList = angular.copy(DynamicDashboardCtrl.ePage.Masters.TempComponentList);
            DynamicDashboardCtrl.ePage.Masters.IsShowDetails = $filter('filter')(_ComponentList, { DC_IsEnabled: true })
            var LoadedAsDefaultDetails = $filter('filter')(DynamicDashboardCtrl.ePage.Masters.IsShowDetails, { DC_ShowByDefault: true })
            if (LoadedAsDefaultDetails.length >= 0) {
                dynamicDashboardConfig.LoadMoreCount = LoadedAsDefaultDetails.length;
            }
            DynamicDashboardCtrl.ePage.Masters.ComponentList = undefined;
            $timeout(function () {
                DynamicDashboardCtrl.ePage.Masters.ComponentList = LoadedAsDefaultDetails;
            }, 100);
            $('#filterSideBar').toggleClass('open');
        }
        // #endregion
        // #region - Get warehouse details
        function GetWarehouseValues() {
            //Get Warehouse Details
            var _input = {
                "FilterID": appConfig.Entities.WmsWarehouse.API.FindAll.FilterID,
                "SearchInput": []
            };

            apiService.post("eAxisAPI", appConfig.Entities.WmsWarehouse.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        DynamicDashboardCtrl.ePage.Masters.WarehouseDetails = response.data.Response;
                        DynamicDashboardCtrl.ePage.Masters.SelectedWarehouse = DynamicDashboardCtrl.ePage.Masters.WarehouseDetails[0];
                    } else {
                        DynamicDashboardCtrl.ePage.Masters.SelectedWarehouse = {};
                    }
                }
            });
        }

        function WarehouseChanged() {
            var _ComponentList = angular.copy(DynamicDashboardCtrl.ePage.Masters.ComponentList);
            var IsShowDetails = $filter('filter')(_ComponentList, { DC_IsEnabled: true })
            dynamicDashboardConfig.LoadedDirectiveCount = 0;
            DynamicDashboardCtrl.ePage.Masters.ComponentList = undefined;
            $timeout(function () {
                DynamicDashboardCtrl.ePage.Masters.ComponentList = IsShowDetails;
            }, 100);
        }
        // #endregion
        // #region - Get Client Details
        function GetClientDetails() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "Item_FK": authService.getUserInfo().UserPK,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "FilterID": appConfig.Entities.UserOrganisation.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_filter)
            }
            apiService.post("authAPI", appConfig.Entities.UserOrganisation.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Status == "Success") {
                    if (response.data.Response.length > 0) {
                        DynamicDashboardCtrl.ePage.Masters.ClientDetails = response.data.Response;
                        DynamicDashboardCtrl.ePage.Masters.SelectedClient = DynamicDashboardCtrl.ePage.Masters.ClientDetails[0];
                    } else {
                        DynamicDashboardCtrl.ePage.Masters.SelectedClient = undefined;
                    }
                }
            });
        }
        function OnChangeClient() {
            var _ComponentList = angular.copy(DynamicDashboardCtrl.ePage.Masters.ComponentList);
            var IsShowDetails = $filter('filter')(_ComponentList, { DC_IsEnabled: true })
            dynamicDashboardConfig.LoadedDirectiveCount = 0;
            DynamicDashboardCtrl.ePage.Masters.ComponentList = undefined;
            $timeout(function () {
                DynamicDashboardCtrl.ePage.Masters.ComponentList = IsShowDetails;
            }, 100);
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
                    DynamicDashboardCtrl.ePage.Masters.ComponentList = undefined;
                    $timeout(function () {
                        DynamicDashboardCtrl.ePage.Masters.ComponentList = _ComponentList;
                    }, 100);
                }
            });
            angular.forEach(_ComponentList, function (v, k) {
                v.SequenceNo = k + 1;
            });
        }
        // #endregion
        // #region - Load more button activity
        function LoadMore() {            
            dynamicDashboardConfig.LoadMoreCount = dynamicDashboardConfig.LoadMoreCount + 4;
            DynamicDashboardCtrl.ePage.Masters.TempComponentList = $filter('orderBy')(DynamicDashboardCtrl.ePage.Masters.TempComponentList, '!DC_ShowByDefault');
            var _ComponentList = angular.copy(DynamicDashboardCtrl.ePage.Masters.TempComponentList);
            var IsShowDetails = $filter('filter')(_ComponentList, { DC_IsEnabled: true })
            dynamicDashboardConfig.LoadedDirectiveCount = 0;
            DynamicDashboardCtrl.ePage.Masters.ComponentList = undefined;
            $timeout(function () {
                DynamicDashboardCtrl.ePage.Masters.ComponentList = IsShowDetails;
            }, 100);
        }
        // #endregion
        // #region - get component details
        function GetComponentListDetails() {
            var _filter = {

            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": dynamicDashboardConfig.Entities.DASComponents.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", dynamicDashboardConfig.Entities.DASComponents.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    response.data.Response = $filter('orderBy')(response.data.Response, 'DisplayOrder');
                    DynamicDashboardCtrl.ePage.Masters.TotalComponentList = angular.copy(response.data.Response);
                }
            });
            // _obj = $filter('orderBy')(_obj, 'SequenceNo');
            // DynamicDashboardCtrl.ePage.Masters.TotalComponentList = angular.copy(_obj);
            // DynamicDashboardCtrl.ePage.Masters.TotalComponentList = $filter('orderBy')(DynamicDashboardCtrl.ePage.Masters.TotalComponentList, '!ShowByDefault');
        }
        // #endregion

        Init();

    }

})();