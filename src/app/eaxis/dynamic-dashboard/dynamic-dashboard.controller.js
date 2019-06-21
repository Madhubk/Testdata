(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DynamicDashboardController", DynamicDashboardController);

    DynamicDashboardController.$inject = ["$scope", "helperService", "$filter", "dynamicDashboardConfig", "appConfig", "apiService", "authService", "$timeout", "$uibModal", "warehouseConfig"];

    function DynamicDashboardController($scope, helperService, $filter, dynamicDashboardConfig, appConfig, apiService, authService, $timeout, $uibModal, warehouseConfig) {

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
            DynamicDashboardCtrl.ePage.Masters.OnChangeComponentSetting = OnChangeComponentSetting;
            DynamicDashboardCtrl.ePage.Masters.CreateNewDashboard = CreateNewDashboard;
            DynamicDashboardCtrl.ePage.Masters.CloseNewDashboardDetailsActivity = CloseNewDashboardDetailsActivity;
            DynamicDashboardCtrl.ePage.Masters.SaveNewDashboard = SaveNewDashboard;
            DynamicDashboardCtrl.ePage.Masters.Settings = Settings;
            DynamicDashboardCtrl.ePage.Masters.CloseEditActivity = CloseEditActivity;
            DynamicDashboardCtrl.ePage.Masters.Config = dynamicDashboardConfig;

            GetRoleList();
            GetSettingsButtonAccess();
            GetDashboardListBasedOnRole();
            GetComponentListDetails();
            GetTotalDashboardList();
        }
        // #endregion
        // #region - Create new dashboard
        function CreateNewDashboard() {
            DynamicDashboardCtrl.ePage.Masters.CreateDashboard = true;
            DynamicDashboardCtrl.ePage.Masters.IsNew = true;
            angular.forEach(DynamicDashboardCtrl.ePage.Masters.TotalComponentList, function (value, key) {
                value.IsLoadedInThisDashboard = false;
            });
            angular.forEach(DynamicDashboardCtrl.ePage.Masters.RoleList, function (value, key) {
                value.IsDashboardRole = false;
                value.SecMapping_FK = undefined;
            });
            apiService.get("eAxisAPI", dynamicDashboardConfig.Entities.DASDashBoardList.API.GetById.Url + "null").then(function (response) {
                if (response.data.Response) {
                    DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails = response.data.Response;
                    DynamicDashboardCtrl.ePage.Masters.CreateDashboard = false;
                    OpenNewDashboard().result.then(function (response) { }, function () { });
                }
            });
        }
        function OpenNewDashboard() {
            return DynamicDashboardCtrl.ePage.Masters.newDashboardModalInstances = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "dashboard-setting-component-details right address",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/dynamic-dashboard/create-dashboard.html"
            });
        }
        function CloseNewDashboardDetailsActivity() {
            DynamicDashboardCtrl.ePage.Masters.newDashboardModalInstances.dismiss('cancel');
        }
        function SaveNewDashboard() {
            if (DynamicDashboardCtrl.ePage.Masters.IsNew) {
                angular.forEach(DynamicDashboardCtrl.ePage.Masters.TotalComponentList, function (value, key) {
                    if (value.IsLoadedInThisDashboard) {
                        var _obj = {
                            DC_DSC_FK: value.PK,
                            DC_DSH_FK: DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails.PK,
                            DC_DisplayOrder: DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails.UIDASDashboardComponents.length + 1,
                            DC_IsActive: true,
                            DC_IsEnabled: false,
                            DC_LoadByDefault: false,
                            DC_OtherConfig: null,
                            DC_PK: "",
                            DC_ShowByDefault: false,
                            IsDeleted: false,
                            IsModified: false
                        }
                        DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails.UIDASDashboardComponents.push(_obj);
                    }
                });
                DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails.UIDASDashboardsHeader.PK = DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails.PK;
                apiService.post("eAxisAPI", dynamicDashboardConfig.Entities.DASDashBoardList.API.Insert.Url, DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails).then(function (response) {
                    if (response.data.Response) {
                        DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails = response.data.Response;
                        DynamicDashboardCtrl.ePage.Masters.newDashboardModalInstances.dismiss('cancel');
                        PreviewDashboardSetting(DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails.UIDASDashboardsHeader);
                        GetTotalDashboardList();
                        angular.forEach(DynamicDashboardCtrl.ePage.Masters.RoleList, function (value1, key1) {
                            if (value1.IsDashboardRole) {
                                var _obj = {
                                    "MappingCode": "DASH_ROLE_APP_TNT",
                                    "ItemName": "DASHBOARD",
                                    "Item_FK": DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails.PK,
                                    "ItemCode": DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails.UIDASDashboardsHeader.Name,
                                    "AccessTo": "ROLE",
                                    "Access_FK": value1.PK,
                                    "AccessCode": value1.RoleName,
                                    "SAP_FK": authService.getUserInfo().AppPK,
                                    "SAP_Code": authService.getUserInfo().AppCode,
                                };
                                apiService.post("authAPI", appConfig.Entities.SecMappings.API.Insert.Url, [_obj]).then(function (response) {
                                    if (response.data.Response) {
                                        DynamicDashboardCtrl.ePage.Masters.IsNew = false;
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
        // #endregion 
        // #region - Preview the dashboard setting
        function PreviewDashboardSetting(item) {
            DynamicDashboardCtrl.ePage.Masters.Loading = true;
            apiService.get("eAxisAPI", dynamicDashboardConfig.Entities.DASDashBoardList.API.GetById.Url + item.PK).then(function (response) {
                if (response.data.Response) {
                    DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails = response.data.Response;
                    DynamicDashboardCtrl.ePage.Masters.Loading = false;
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
            });
        }
        // #endregion 
        // #region - get role list based on party 
        function RoleAccesDashboardSetting(item) {
            DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails = item;
            angular.forEach(DynamicDashboardCtrl.ePage.Masters.RoleList, function (value, key) {
                value.IsDashboardRole = false;
                value.SecMapping_FK = undefined;
            });
            var _filter = {
                "Item_FK": item.PK,
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
                    "ItemCode": DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails.Name,
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
            DynamicDashboardCtrl.ePage.Masters.Loading = true;
            angular.forEach(DynamicDashboardCtrl.ePage.Masters.TotalComponentList, function (value, key) {
                value.IsLoadedInThisDashboard = false;
            });
            apiService.get("eAxisAPI", dynamicDashboardConfig.Entities.DASDashBoardList.API.GetById.Url + item.PK).then(function (response) {
                if (response.data.Response) {
                    DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails = response.data.Response;
                    angular.forEach(DynamicDashboardCtrl.ePage.Masters.TotalComponentList, function (value, key) {
                        angular.forEach(DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails.UIDASDashboardComponents, function (value1, key1) {
                            if (value.Name == value1.DC_DSC_Name) {
                                value.IsLoadedInThisDashboard = true;
                            }
                        });
                    });
                    DynamicDashboardCtrl.ePage.Masters.TotalComponentList = $filter('orderBy')(DynamicDashboardCtrl.ePage.Masters.TotalComponentList, '!IsLoadedInThisDashboard');
                    DynamicDashboardCtrl.ePage.Masters.Loading = false;
                    OpenComponentListDashboardSetting().result.then(function (response) { }, function () { });
                }
            });
        }
        function OpenComponentListDashboardSetting() {
            return DynamicDashboardCtrl.ePage.Masters.componentModalInstances = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "dashboard-setting-component-details right address",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/dynamic-dashboard/component-dashboard-settings.html"
            });
        }
        function CloseComponentSettingActivity() {
            DynamicDashboardCtrl.ePage.Masters.componentModalInstances.dismiss('cancel');
        }
        function OnChangeComponentSetting(item) {
            var Count = 0;
            if (item.IsLoadedInThisDashboard) {
                angular.forEach(DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails.UIDASDashboardComponents, function (value1, key1) {
                    if (value1.DC_DSC_FK == item.PK) {
                        value1.IsModified = true;
                        value1.IsDeleted = false;
                    } else {
                        Count = Count + 1;
                    }
                });
            } else {
                angular.forEach(DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails.UIDASDashboardComponents, function (value1, key1) {
                    if (value1.DC_DSC_FK == item.PK) {
                        value1.IsDeleted = true;
                    }
                });
            }
            if (Count == DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails.UIDASDashboardComponents.length) {
                var _obj = {
                    DC_DSC_FK: item.PK,
                    DC_DSH_FK: DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails.UIDASDashboardsHeader.PK,
                    DC_DisplayOrder: DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails.UIDASDashboardComponents.length + 1,
                    DC_IsActive: true,
                    DC_IsEnabled: false,
                    DC_LoadByDefault: false,
                    DC_OtherConfig: null,
                    DC_PK: "",
                    DC_ShowByDefault: false,
                    IsDeleted: false,
                    IsModified: false
                }
                DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails.UIDASDashboardComponents.push(_obj);
            }
        }
        function SaveCompDashboardSetting(item) {
            DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails.UIDASDashboardsHeader.IsModified = true;
            apiService.post("eAxisAPI", dynamicDashboardConfig.Entities.DASDashBoardList.API.Update.Url, DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails).then(function (response) {
                if (response.data.Response) {
                    DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails = response.data.Response;
                    DynamicDashboardCtrl.ePage.Masters.componentModalInstances.dismiss('cancel');
                    PreviewDashboardSetting(DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails.UIDASDashboardsHeader);
                    // DynamicDashboardCtrl.ePage.Masters.modalInstances.dismiss('cancel');
                    // Init();
                }
            });
        }
        // #endregion
        // #region - Edit Dashboard setting
        function Edit(item) {
            DynamicDashboardCtrl.ePage.Masters.Loading = true;
            apiService.get("eAxisAPI", dynamicDashboardConfig.Entities.DASDashBoardList.API.GetById.Url + item.PK).then(function (response) {
                if (response.data.Response) {
                    DynamicDashboardCtrl.ePage.Masters.Loading = false;
                    DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails = response.data.Response;
                    EditDashboardSetting().result.then(function (response) { }, function () { });
                }
            });
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
            DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails.UIDASDashboardsHeader.IsModified = true;
            apiService.post("eAxisAPI", dynamicDashboardConfig.Entities.DASDashBoardList.API.Update.Url, DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails).then(function (response) {
                if (response.data.Response) {
                    DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails = response.data.Response;
                    DynamicDashboardCtrl.ePage.Masters.editModalInstances.dismiss('cancel');
                    PreviewDashboardSetting(DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails.UIDASDashboardsHeader);
                    GetTotalDashboardList();
                    // DynamicDashboardCtrl.ePage.Masters.modalInstances.dismiss('cancel');
                    // Init();
                }
            });
        }
        function SelectedIconColor(item) {
            DynamicDashboardCtrl.ePage.Masters.SelectedDashboardSettingDetails.UIDASDashboardsHeader.DisplayIcon = item;
        }
        // #endregion 
        // #region - Get dashboard list based on Role
        function GetDashboardListBasedOnRole() {
            DynamicDashboardCtrl.ePage.Masters.LoadingValue = "Getting Dashboard List...";
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
                        DynamicDashboardCtrl.ePage.Masters.LoadingValue = "";
                        var _DashboardFK = "";
                        angular.forEach(response.data.Response, function (value, key) {
                            _DashboardFK = _DashboardFK + value.Item_FK + ",";
                        });
                        _DashboardFK = _DashboardFK.slice(0, -1);
                        var _filter = {
                            "PK_In": _DashboardFK
                        };
                        var _input = {
                            "searchInput": helperService.createToArrayOfObject(_filter),
                            "FilterID": dynamicDashboardConfig.Entities.Dashboards.API.FindAll.FilterID
                        };
                        apiService.post("eAxisAPI", dynamicDashboardConfig.Entities.Dashboards.API.FindAll.Url, _input).then(function (response) {
                            if (response.data.Response) {
                                DynamicDashboardCtrl.ePage.Masters.DashboardListBasedOnRole = response.data.Response;
                                DynamicDashboardCtrl.ePage.Masters.DashboardListBasedOnRole = $filter('orderBy')(DynamicDashboardCtrl.ePage.Masters.DashboardListBasedOnRole, 'DisplayOrder');
                                DynamicDashboardCtrl.ePage.Masters.SelectedDashboardDetails = DynamicDashboardCtrl.ePage.Masters.DashboardListBasedOnRole[0];
                                if (DynamicDashboardCtrl.ePage.Masters.SelectedDashboardDetails) {
                                    OnChangeDashboardList();
                                }
                            }
                        });
                    } else {
                        DynamicDashboardCtrl.ePage.Masters.LoadingValue = "No Dashboard Mapped for this User";
                    }
                }
            });
        }

        function OnChangeDashboardList() {
            DynamicDashboardCtrl.ePage.Masters.LoadingValue = "Getting Dashboard Details...";
            if (!DynamicDashboardCtrl.ePage.Masters.SelectedWarehouse && DynamicDashboardCtrl.ePage.Masters.SelectedDashboardDetails.IsWarehouseBased)
                GetWarehouseValues();
            else {
                if (!DynamicDashboardCtrl.ePage.Masters.SelectedWarehouse)
                    DynamicDashboardCtrl.ePage.Masters.SelectedWarehouse = {};
                else
                    DynamicDashboardCtrl.ePage.Masters.SelectedWarehouse = DynamicDashboardCtrl.ePage.Masters.SelectedWarehouse;

                if (!DynamicDashboardCtrl.ePage.Masters.SelectedClient && DynamicDashboardCtrl.ePage.Masters.SelectedDashboardDetails.IsOrganisationBased)
                    GetClientDetails();
                else {
                    if (!DynamicDashboardCtrl.ePage.Masters.SelectedClient)
                        DynamicDashboardCtrl.ePage.Masters.SelectedClient = {};
                    else
                        DynamicDashboardCtrl.ePage.Masters.SelectedClient = DynamicDashboardCtrl.ePage.Masters.SelectedClient;
                    if (DynamicDashboardCtrl.ePage.Masters.SelectedClient && DynamicDashboardCtrl.ePage.Masters.SelectedWarehouse) {
                        GetDashboardList();
                    }
                }
            }
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
                "FilterID": warehouseConfig.Entities.ComponentRole.API.FindAll.FilterID
            };

            apiService.post("authAPI", warehouseConfig.Entities.ComponentRole.API.FindAll.Url, _input).then(function (response) {
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
            Init();
        }
        // #endregion
        // #region - get Component list based on Dashboard list 
        function GetDashboardList() {
            DynamicDashboardCtrl.ePage.Masters.LoadingValue = "Getting Dashboard Component details...";
            var _filter = {
                "DSH_FK": DynamicDashboardCtrl.ePage.Masters.SelectedDashboardDetails.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": dynamicDashboardConfig.Entities.DASDashboardComponents.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", dynamicDashboardConfig.Entities.DASDashboardComponents.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DynamicDashboardCtrl.ePage.Masters.SelectedDashboardComponentDetails = angular.copy(response.data.Response);
                    if (DynamicDashboardCtrl.ePage.Masters.SelectedDashboardComponentDetails.length == 0) {
                        DynamicDashboardCtrl.ePage.Masters.LoadingValue = "No Component Mapped for this Dashboard";
                    } else {
                        DynamicDashboardCtrl.ePage.Masters.LoadingValue = "";
                    }
                    DynamicDashboardCtrl.ePage.Masters.TempComponentList = angular.copy(response.data.Response);
                    GetUserBasedComponentList();
                }
            });
        }
        function GetTotalDashboardList() {
            var _filter = {
                "SortType": "ASC",
                "SortColumn": "DSH_DisplayOrder",
                "PageNumber": 1,
                "PageSize": 100,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": dynamicDashboardConfig.Entities.Dashboards.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", dynamicDashboardConfig.Entities.Dashboards.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DynamicDashboardCtrl.ePage.Masters.DashboardList = response.data.Response;
                }
            });
        }
        // #endregion
        // #region - customize button
        function OnClickCustomizeButton() {
            $('#filterSideBar').toggleClass('open');
        }
        function Apply() {
            if (DynamicDashboardCtrl.ePage.Masters.UserHasValue) {
                var _input = DynamicDashboardCtrl.ePage.Masters.UserValue;
                _input.Value = JSON.stringify(DynamicDashboardCtrl.ePage.Masters.TempComponentList);
                _input.IsModified = true;
            } else {
                var _input = {
                    "SAP_FK": authService.getUserInfo().AppPK,
                    "AppCode": authService.getUserInfo().AppCode,
                    "TenantCode": authService.getUserInfo().TenantCode,
                    "SourceEntityRefKey": authService.getUserInfo().UserId,
                    "EntitySource": "DASHBOARD_COMPONENTS",
                    "Key": "Dashboard_Components",
                    "IsJSON": true,
                    "IsModified": true
                };
                _input.Value = JSON.stringify(DynamicDashboardCtrl.ePage.Masters.TempComponentList);
            }
            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                if (response.data.Response) {
                    DynamicDashboardCtrl.ePage.Masters.TempComponentList = response.data.Response[0];
                    Init();
                    $('#filterSideBar').toggleClass('open');
                }
            });
        }
        // #endregion
        // #region - Get warehouse details
        function GetWarehouseValues() {
            //Get Warehouse Details
            DynamicDashboardCtrl.ePage.Masters.LoadingValue = "Getting mapped Warehouse...";
            var _input = {
                "FilterID": warehouseConfig.Entities.WmsWarehouse.API.FindAll.FilterID,
                "SearchInput": []
            };

            apiService.post("eAxisAPI", warehouseConfig.Entities.WmsWarehouse.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        DynamicDashboardCtrl.ePage.Masters.WarehouseDetails = response.data.Response;
                        DynamicDashboardCtrl.ePage.Masters.SelectedWarehouse = DynamicDashboardCtrl.ePage.Masters.WarehouseDetails[0];
                        DynamicDashboardCtrl.ePage.Masters.LoadingValue = "";
                    } else {
                        DynamicDashboardCtrl.ePage.Masters.SelectedWarehouse = {};
                        DynamicDashboardCtrl.ePage.Masters.LoadingValue = "No Warehouse Mapped for this User";
                    }
                    if (DynamicDashboardCtrl.ePage.Masters.SelectedDashboardDetails.IsOrganisationBased)
                        GetClientDetails();
                    else {
                        DynamicDashboardCtrl.ePage.Masters.SelectedClient = {};
                    }
                    if (DynamicDashboardCtrl.ePage.Masters.SelectedClient && DynamicDashboardCtrl.ePage.Masters.SelectedWarehouse) {
                        GetDashboardList();
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
            DynamicDashboardCtrl.ePage.Masters.LoadingValue = "Getting mapped Organization...";
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
                        DynamicDashboardCtrl.ePage.Masters.ClientDetails = response.data.Response;
                        DynamicDashboardCtrl.ePage.Masters.SelectedClient = DynamicDashboardCtrl.ePage.Masters.ClientDetails[0];
                        DynamicDashboardCtrl.ePage.Masters.LoadingValue = "";
                    } else {
                        DynamicDashboardCtrl.ePage.Masters.LoadingValue = "No Organization Mapped for this User";
                        DynamicDashboardCtrl.ePage.Masters.SelectedClient = undefined;
                    }
                    if (DynamicDashboardCtrl.ePage.Masters.SelectedClient && DynamicDashboardCtrl.ePage.Masters.SelectedWarehouse) {
                        GetDashboardList();
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
            angular.forEach(DynamicDashboardCtrl.ePage.Masters.TempComponentList, function (value, key) {
                if (value.DC_DSC_DirectiveName == selectedComponent.DC_DSC_DirectiveName && value.DC_DSC_Name == selectedComponent.DC_DSC_Name) {
                    selectedComponent.DC_ShowByDefault = true;
                    var _obj = selectedComponent;
                    DynamicDashboardCtrl.ePage.Masters.TempComponentList.splice(key, 1);
                    DynamicDashboardCtrl.ePage.Masters.TempComponentList.splice(index - 1, 0, _obj);
                }
            });
            angular.forEach(DynamicDashboardCtrl.ePage.Masters.TempComponentList, function (v, k) {
                v.DC_DisplayOrder = k + 1;
            });

            if (DynamicDashboardCtrl.ePage.Masters.UserHasValue) {
                var _input = DynamicDashboardCtrl.ePage.Masters.UserValue;
                _input.Value = JSON.stringify(DynamicDashboardCtrl.ePage.Masters.TempComponentList);
                _input.IsModified = true;
            }
            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                if (response.data.Response) {
                    DynamicDashboardCtrl.ePage.Masters.TempComponentList = response.data.Response[0];
                    Init();
                }
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
            var _filter = {};
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
        }
        // #endregion
        // #region User Based Table Column
        function GetUserBasedComponentList() {
            DynamicDashboardCtrl.ePage.Masters.LoadingValue = "Getting User based Component List...";
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "DASHBOARD_COMPONENTS",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    DynamicDashboardCtrl.ePage.Masters.LoadingValue = "";
                    if (response.data.Response[0]) {
                        DynamicDashboardCtrl.ePage.Masters.UserValue = response.data.Response[0];
                        if (response.data.Response[0].Value != '') {
                            var obj = JSON.parse(response.data.Response[0].Value)
                            DynamicDashboardCtrl.ePage.Masters.UserBasedComponentList = obj;
                            DynamicDashboardCtrl.ePage.Masters.TempComponentList = $filter('filter')(DynamicDashboardCtrl.ePage.Masters.TempComponentList, { DC_IsEnabled: true })
                            angular.forEach(DynamicDashboardCtrl.ePage.Masters.UserBasedComponentList, function (value, key) {
                                angular.forEach(DynamicDashboardCtrl.ePage.Masters.TempComponentList, function (value1, key1) {
                                    if (value.DC_PK == value1.DC_PK) {
                                        value1.DC_DisplayOrder = value.DC_DisplayOrder;
                                        value1.DC_IsEnabled = value.DC_IsEnabled;
                                        value1.DC_LoadByDefault = value.DC_LoadByDefault;
                                        value1.DC_ShowByDefault = value.DC_ShowByDefault
                                    }
                                });
                            });
                            DynamicDashboardCtrl.ePage.Masters.UserHasValue = true;
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
                    } else {
                        DynamicDashboardCtrl.ePage.Masters.UserValue = undefined;
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
                }
            })
        }
        //#endregion
        Init();

    }

})();