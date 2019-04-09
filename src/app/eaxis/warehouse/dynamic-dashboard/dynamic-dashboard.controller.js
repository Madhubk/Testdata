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
            DynamicDashboardCtrl.ePage.Masters.SaveSettingBtnText = "Save";
            DynamicDashboardCtrl.ePage.Masters.IsApplyBtnDisable = false;

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
            GetJson();
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
                templateUrl: "app/eaxis/warehouse/dynamic-dashboard/preview-dashboard/preview-dashboard.html",
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
                            "SelectedWarehouse": DynamicDashboardCtrl.ePage.Masters.SelectedWarehouse,
                            "SelectedClient": DynamicDashboardCtrl.ePage.Masters.SelectedClient
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
            // OpenPreviewDashboardSetting().result.then(function (response) { }, function () { });
        }
        // function OpenPreviewDashboardSetting() {
        // return DynamicDashboardCtrl.ePage.Masters.previewModalInstances = $uibModal.open({
        //     animation: true,
        //     backdrop: "static",
        //     keyboard: false,
        //     windowClass: "dashboard-setting-edit right address",
        //     scope: $scope,
        //     size: "md",
        //     templateUrl: "app/eaxis/warehouse/dynamic-dashboard/preview-dashboard-settings.html"
        // });

        // }
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
                "ItemCode": item.DashboardName,
                "MappingCode": "DASH_ROLE_APP_TNT"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecMappings.API.FindAll.FilterID
            };
            apiService.post("authAPI", appConfig.Entities.SecMappings.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DynamicDashboardCtrl.ePage.Masters.DashboardRoleDetails = response.data.Response;
                    angular.forEach(DynamicDashboardCtrl.ePage.Masters.RoleList, function (value, key) {
                        angular.forEach(DynamicDashboardCtrl.ePage.Masters.DashboardRoleDetails, function (value1, key1) {
                            if (value.RoleName == value1.AccessCode) {
                                value.IsDashboardRole = true;
                            }
                        });
                    });
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
                templateUrl: "app/eaxis/warehouse/dynamic-dashboard/role-access-dashboard-settings.html"
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
                apiService.post("authAPI", appConfig.Entities.SecMappings.API.Insert.Url, _obj).then(function (response) {
                    if (response.data.Response) {
                    }
                });
            } else {

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
                templateUrl: "app/eaxis/warehouse/dynamic-dashboard/component-dashboard-settings.html"
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
            DynamicDashboardCtrl.ePage.Masters.TempComponentList = $filter('orderBy')(DynamicDashboardCtrl.ePage.Masters.TempComponentList, '!IsLoadAsDefault');
            DynamicDashboardCtrl.ePage.Masters.IsShowDetails = $filter('filter')(DynamicDashboardCtrl.ePage.Masters.TempComponentList, { IsShow: true })
            var LoadedAsDefaultDetails = $filter('filter')(DynamicDashboardCtrl.ePage.Masters.IsShowDetails, { IsLoadAsDefault: true })
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
                templateUrl: "app/eaxis/warehouse/dynamic-dashboard/edit-dashboard-settings.html"
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
            var _DashboardListBasedOnRole = [{
                "Role": "DMS_DESK",
                "Dashboard_FK": "d7ea3cd1-ed85-4da6-8ab6-3497b8dfab52",
                "DashboardName": "Inward Dashboard",
                "Icon": "icon-inward",
                "IsWarehouseBased": false,
                "IsClientBased": false,
            }, {
                "Role": "DMS_DESK",
                "Dashboard_FK": "db100bf9-467c-4217-85c8-2672deaf811d",
                "DashboardName": "DMS Dashboard",
                "Icon": "fa fa-truck ",
                "IsWarehouseBased": false,
                "IsClientBased": false,
            }, {
                "Role": "WH_USER",
                "Dashboard_FK": "d7ea3cd1-ed85-4da6-8ab6-3497b8dfab52",
                "DashboardName": "Inward Dashboard",
                "Icon": "icon-inward",
                "IsWarehouseBased": true,
                "IsClientBased": true,
            }, {
                "Role": "WH_USER",
                "Dashboard_FK": "17aca650-88c4-4cb4-997b-da5b85045e62",
                "DashboardName": "Outward Dashboard",
                "Icon": "icon-outward",
                "IsWarehouseBased": true,
                "IsClientBased": false,
            }, {
                "Role": "WH_USER",
                "Dashboard_FK": "e72d892a-ce24-4712-b279-74124740dd00",
                "DashboardName": "Location Dashboard",
                "Icon": "fa fa-map-marker",
                "IsWarehouseBased": true,
                "IsClientBased": false,
            }, {
                "Role": "WH_ADMIN",
                "Dashboard_FK": "d7ea3cd1-ed85-4da6-8ab6-3497b8dfab52",
                "DashboardName": "Inward Dashboard",
                "Icon": "icon-inward",
                "IsWarehouseBased": true,
                "IsClientBased": true,
            }, {
                "Role": "WH_ADMIN",
                "Dashboard_FK": "17aca650-88c4-4cb4-997b-da5b85045e62",
                "DashboardName": "Outward Dashboard",
                "Icon": "icon-outward",
                "IsWarehouseBased": true,
                "IsClientBased": false,
            }, {
                "Role": "WH_ADMIN",
                "Dashboard_FK": "e72d892a-ce24-4712-b279-74124740dd00",
                "DashboardName": "Location Dashboard",
                "Icon": "fa fa-map-marker",
                "IsWarehouseBased": true,
                "IsClientBased": false,
            }, {
                "Role": "WH_ADMIN",
                "Dashboard_FK": "db100bf9-467c-4217-85c8-2672deaf811d",
                "DashboardName": "DMS Dashboard",
                "Icon": "fa fa-truck",
                "IsWarehouseBased": false,
                "IsClientBased": false,
            }];
            DynamicDashboardCtrl.ePage.Masters._TempDashboardListBasedOnRole = _DashboardListBasedOnRole;
            DynamicDashboardCtrl.ePage.Masters.DashboardListBasedOnRole = $filter('filter')(_DashboardListBasedOnRole, { Role: authService.getUserInfo().RoleCode })
            DynamicDashboardCtrl.ePage.Masters.SelectedDashboardDetails = DynamicDashboardCtrl.ePage.Masters.DashboardListBasedOnRole[0];
            if (DynamicDashboardCtrl.ePage.Masters.SelectedDashboardDetails)
                OnChangeDashboardList();
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
                templateUrl: "app/eaxis/warehouse/dynamic-dashboard/dashboard-settings.html"
            });
        }

        function CloseEditActivity() {
            DynamicDashboardCtrl.ePage.Masters.modalInstances.dismiss('cancel');
        }
        // #endregion
        // #region - get Component list based on Dashboard list 
        function GetDashboardList() {
            var _DashboardList = [{
                "PK": "d7ea3cd1-ed85-4da6-8ab6-3497b8dfab52",
                "DashboardName": "Inward Dashboard",
                "Icon": "icon-inward",
                "IsWarehouseBased": true,
                "IsClientBased": true,
                "ComponentList": [
                    {
                        "ComponentName": "ASN Received With Status",
                        "Directive": "asn-received-status",
                        "SequenceNo": 1,
                        "IsShow": true,
                        "SetAsDefault": true,
                        "IsLoadAsDefault": true
                    }, {
                        "ComponentName": "New ASN Request",
                        "Directive": "asn-request-directive",
                        "SequenceNo": 4,
                        "IsShow": true,
                        "SetAsDefault": true,
                        "IsLoadAsDefault": true
                    }, {
                        "ComponentName": "New Inward",
                        "Directive": "new-inward-directive",
                        "SequenceNo": 5,
                        "IsShow": true,
                        "SetAsDefault": true,
                        "IsLoadAsDefault": true
                    }, {
                        "ComponentName": "Track Inward",
                        "Directive": "track-inward-directive",
                        "SequenceNo": 6,
                        "IsShow": true,
                        "SetAsDefault": true,
                        "IsLoadAsDefault": true
                    }, {
                        "ComponentName": "ASN Trend",
                        "Directive": "asn-trend",
                        "SequenceNo": 7,
                        "IsShow": true,
                        "SetAsDefault": false,
                        "IsLoadAsDefault": false
                    }, {
                        "ComponentName": "Putaway Status",
                        "Directive": "putaway-status",
                        "SequenceNo": 9,
                        "IsShow": true,
                        "SetAsDefault": true,
                        "IsLoadAsDefault": false
                    }, {
                        "ComponentName": "GRN Status",
                        "Directive": "grn-status",
                        "SequenceNo": 12,
                        "IsShow": true,
                        "SetAsDefault": true,
                        "IsLoadAsDefault": false
                    }, {
                        "ComponentName": "Cycle Count Jobs",
                        "Directive": "cycle-count-jobs",
                        "SequenceNo": 13,
                        "IsShow": true,
                        "SetAsDefault": false,
                        "IsLoadAsDefault": false
                    }]
            }, {
                "PK": "17aca650-88c4-4cb4-997b-da5b85045e62",
                "DashboardName": "Outward Dashboard",
                "Icon": "icon-outward",
                "IsWarehouseBased": true,
                "IsClientBased": false,
                "ComponentList": [
                    {
                        "ComponentName": "Open SO",
                        "Directive": "open-so",
                        "SequenceNo": 10,
                        "IsShow": true,
                        "SetAsDefault": false,
                        "IsLoadAsDefault": true
                    }, {
                        "ComponentName": "Pick With Shortfall",
                        "Directive": "pick-with-shortfall",
                        "SequenceNo": 11,
                        "IsShow": true,
                        "SetAsDefault": false,
                        "IsLoadAsDefault": false
                    }]
            }, {
                "PK": "e72d892a-ce24-4712-b279-74124740dd00",
                "DashboardName": "Location Dashboard",
                "Icon": "fa fa-map-marker",
                "IsWarehouseBased": true,
                "IsClientBased": false,
                "ComponentList": [
                    {
                        "ComponentName": "Cycle Count Jobs",
                        "Directive": "cycle-count-jobs",
                        "SequenceNo": 13,
                        "IsShow": true,
                        "SetAsDefault": false,
                        "IsLoadAsDefault": false
                    }]
            }, {
                "PK": "db100bf9-467c-4217-85c8-2672deaf811d",
                "DashboardName": "DMS Dashboard",
                "Icon": "fa fa-truck",
                "IsWarehouseBased": false,
                "IsClientBased": false,
                "ComponentList": [
                    {
                        "ComponentName": "KPI",
                        "Directive": "kpi-directive",
                        "SequenceNo": 8,
                        "IsShow": true,
                        "SetAsDefault": true,
                        "IsLoadAsDefault": false
                    }, {
                        "ComponentName": "My Task",
                        "Directive": "my-task-dashboard-directive",
                        "SequenceNo": 2,
                        "IsShow": true,
                        "SetAsDefault": true,
                        "IsLoadAsDefault": true
                    }, {
                        "ComponentName": "Notification",
                        "Directive": "notification",
                        "SequenceNo": 14,
                        "IsShow": false,
                        "SetAsDefault": false,
                        "IsLoadAsDefault": false
                    }, {
                        "ComponentName": "Exception",
                        "Directive": "exception-directive",
                        "SequenceNo": 15,
                        "IsShow": false,
                        "SetAsDefault": false,
                        "IsLoadAsDefault": false
                    }]
            }];
            DynamicDashboardCtrl.ePage.Masters.DashboardList = _DashboardList;

            DynamicDashboardCtrl.ePage.Masters.SelectedDashboardComponentDetails = $filter('filter')(DynamicDashboardCtrl.ePage.Masters.DashboardList, { PK: DynamicDashboardCtrl.ePage.Masters.SelectedDashboardDetails.Dashboard_FK })
            DynamicDashboardCtrl.ePage.Masters.TempComponentList = angular.copy(DynamicDashboardCtrl.ePage.Masters.SelectedDashboardComponentDetails[0].ComponentList);
            DynamicDashboardCtrl.ePage.Masters.TempComponentList = $filter('orderBy')(DynamicDashboardCtrl.ePage.Masters.TempComponentList, 'SequenceNo');
            DynamicDashboardCtrl.ePage.Masters.TempComponentList = $filter('orderBy')(DynamicDashboardCtrl.ePage.Masters.TempComponentList, '!IsLoadAsDefault');
            DynamicDashboardCtrl.ePage.Masters.IsShowDetails = $filter('filter')(DynamicDashboardCtrl.ePage.Masters.TempComponentList, { IsShow: true })
            var LoadedAsDefaultDetails = $filter('filter')(DynamicDashboardCtrl.ePage.Masters.IsShowDetails, { IsLoadAsDefault: true })
            if (LoadedAsDefaultDetails.length >= 0) {
                dynamicDashboardConfig.LoadMoreCount = LoadedAsDefaultDetails.length;
            }
            dynamicDashboardConfig.LoadedDirectiveCount = 0;
            DynamicDashboardCtrl.ePage.Masters.ComponentList = angular.copy(LoadedAsDefaultDetails);
        }
        // #endregion
        // #region - customize button
        function OnClickCustomizeButton() {
            $('#filterSideBar').toggleClass('open');
        }

        function Apply() {
            dynamicDashboardConfig.LoadedDirectiveCount = 0;
            DynamicDashboardCtrl.ePage.Masters.TempComponentList = $filter('orderBy')(DynamicDashboardCtrl.ePage.Masters.TempComponentList, '!IsLoadAsDefault');
            var _ComponentList = angular.copy(DynamicDashboardCtrl.ePage.Masters.TempComponentList);
            DynamicDashboardCtrl.ePage.Masters.IsShowDetails = $filter('filter')(_ComponentList, { IsShow: true })
            var LoadedAsDefaultDetails = $filter('filter')(DynamicDashboardCtrl.ePage.Masters.IsShowDetails, { IsLoadAsDefault: true })
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
            var IsShowDetails = $filter('filter')(_ComponentList, { IsShow: true })
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
            var IsShowDetails = $filter('filter')(_ComponentList, { IsShow: true })
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
            DynamicDashboardCtrl.ePage.Masters.TempComponentList = $filter('orderBy')(DynamicDashboardCtrl.ePage.Masters.TempComponentList, '!IsLoadAsDefault');
            var _ComponentList = angular.copy(DynamicDashboardCtrl.ePage.Masters.TempComponentList);
            var IsShowDetails = $filter('filter')(_ComponentList, { IsShow: true })
            dynamicDashboardConfig.LoadedDirectiveCount = 0;
            DynamicDashboardCtrl.ePage.Masters.ComponentList = undefined;
            $timeout(function () {
                DynamicDashboardCtrl.ePage.Masters.ComponentList = IsShowDetails;
            }, 100);
        }
        // #endregion
        // #region - get component details
        function GetJson() {
            var _obj = [{
                "ComponentName": "ASN Received With Status",
                "Directive": "asn-received-status",
                "SequenceNo": 1,
                "IsShow": true,
                "SetAsDefault": true,
                "IsLoadAsDefault": true
            }, {
                "ComponentName": "Raise Delivery Request",
                "Directive": "raise-csr-directive",
                "SequenceNo": 3,
                "IsShow": true,
                "SetAsDefault": true,
                "IsLoadAsDefault": true
            }, {
                "ComponentName": "New ASN Request",
                "Directive": "asn-request-directive",
                "SequenceNo": 4,
                "IsShow": true,
                "SetAsDefault": true,
                "IsLoadAsDefault": true
            }, {
                "ComponentName": "New Inward",
                "Directive": "new-inward-directive",
                "SequenceNo": 5,
                "IsShow": true,
                "SetAsDefault": true,
                "IsLoadAsDefault": true
            }, {
                "ComponentName": "Track Inward",
                "Directive": "track-inward-directive",
                "SequenceNo": 6,
                "IsShow": true,
                "SetAsDefault": true,
                "IsLoadAsDefault": true
            }, {
                "ComponentName": "ASN Trend",
                "Directive": "asn-trend",
                "SequenceNo": 7,
                "IsShow": true,
                "SetAsDefault": false,
                "IsLoadAsDefault": false
            }, {
                "ComponentName": "KPI",
                "Directive": "kpi-directive",
                "SequenceNo": 8,
                "IsShow": true,
                "SetAsDefault": true,
                "IsLoadAsDefault": false
            }, {
                "ComponentName": "My Task",
                "Directive": "my-task-dashboard-directive",
                "SequenceNo": 2,
                "IsShow": true,
                "SetAsDefault": true,
                "IsLoadAsDefault": true
            }, {
                "ComponentName": "Putaway Status",
                "Directive": "putaway-status",
                "SequenceNo": 9,
                "IsShow": true,
                "SetAsDefault": true,
                "IsLoadAsDefault": false
            }, {
                "ComponentName": "Open SO",
                "Directive": "open-so",
                "SequenceNo": 10,
                "IsShow": true,
                "SetAsDefault": false,
                "IsLoadAsDefault": true
            }, {
                "ComponentName": "Pick With Shortfall",
                "Directive": "pick-with-shortfall",
                "SequenceNo": 11,
                "IsShow": true,
                "SetAsDefault": false,
                "IsLoadAsDefault": false
            }, {
                "ComponentName": "GRN Status",
                "Directive": "grn-status",
                "SequenceNo": 12,
                "IsShow": true,
                "SetAsDefault": true,
                "IsLoadAsDefault": false
            }, {
                "ComponentName": "Cycle Count Jobs",
                "Directive": "cycle-count-jobs",
                "SequenceNo": 13,
                "IsShow": true,
                "SetAsDefault": false,
                "IsLoadAsDefault": false
            }, {
                "ComponentName": "Notification",
                "Directive": "notification",
                "SequenceNo": 14,
                "IsShow": false,
                "SetAsDefault": false,
                "IsLoadAsDefault": false
            }, {
                "ComponentName": "Exception",
                "Directive": "exception-directive",
                "SequenceNo": 15,
                "IsShow": false,
                "SetAsDefault": false,
                "IsLoadAsDefault": false
            }, {
                "ComponentName": "User",
                "Directive": "user-directive",
                "SequenceNo": 16,
                "IsShow": true,
                "SetAsDefault": false,
                "IsLoadAsDefault": false
            }, {
                "ComponentName": "Email",
                "Directive": "email-directive",
                "SequenceNo": 17,
                "IsShow": true,
                "SetAsDefault": false,
                "IsLoadAsDefault": false
            }, {
                "ComponentName": "Music",
                "Directive": "music-directive",
                "SequenceNo": 18,
                "IsShow": true,
                "SetAsDefault": false,
                "IsLoadAsDefault": false
            }, {
                "ComponentName": "Video",
                "Directive": "video-directive",
                "SequenceNo": 19,
                "IsShow": true,
                "SetAsDefault": false,
                "IsLoadAsDefault": false
            }, {
                "ComponentName": "Open SO Chart",
                "Directive": "open-so-chart",
                "SequenceNo": 20,
                "IsShow": true,
                "SetAsDefault": true,
                "IsLoadAsDefault": true
            }];

            _obj = $filter('orderBy')(_obj, 'SequenceNo');
            DynamicDashboardCtrl.ePage.Masters.TotalComponentList = angular.copy(_obj);
            DynamicDashboardCtrl.ePage.Masters.TotalComponentList = $filter('orderBy')(DynamicDashboardCtrl.ePage.Masters.TotalComponentList, '!IsLoadAsDefault');
        }
        // #endregion

        Init();

    }

})();