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

            DynamicDashboardCtrl.ePage.Masters.LoadMoreBtnTxt = "Load More";
            DynamicDashboardCtrl.ePage.Masters.LoadMore = LoadMore;
            DynamicDashboardCtrl.ePage.Masters.IsVisibleLoadMoreBtn = true;
            DynamicDashboardCtrl.ePage.Masters.ApplyBtnText = "Save";
            DynamicDashboardCtrl.ePage.Masters.SaveSettingBtnText = "Save";
            DynamicDashboardCtrl.ePage.Masters.IsApplyBtnDisable = false;

            DynamicDashboardCtrl.ePage.Masters.dropCallback = dropCallback;
            DynamicDashboardCtrl.ePage.Masters.WarehouseChanged = WarehouseChanged;
            DynamicDashboardCtrl.ePage.Masters.Apply = Apply;
            DynamicDashboardCtrl.ePage.Masters.OnChangeSingleSelect = OnChangeSingleSelect;
            DynamicDashboardCtrl.ePage.Masters.OnClickCustomizeButton = OnClickCustomizeButton;
            DynamicDashboardCtrl.ePage.Masters.OnChangeDashboardList = OnChangeDashboardList;

            DynamicDashboardCtrl.ePage.Masters.Settings = Settings;
            DynamicDashboardCtrl.ePage.Masters.CloseEditActivity = CloseEditActivity;

            DynamicDashboardCtrl.ePage.Masters.Config = dynamicDashboardConfig;
            GetRoleList();
            GetSettingsButtonAccess();
            GetDashboardList();
            GetDashboardListBasedOnRole();
        }
        // #region - Get dashboard list based on Role
        function GetDashboardListBasedOnRole() {
            var _DashboardListBasedOnRole = [{
                "Role": "DMS_DESK",
                "DashboardName": "Inward Dashboard",
                "Icon": "icon-inward",
                "IsWarehouseBased": true,
                "IsClientBased": false,
            }, {
                "Role": "DMS_DESK",
                "DashboardName": "DMS Dashboard",
                "Icon": "fa fa-truck ",
                "IsWarehouseBased": false,
                "IsClientBased": false,
            }, {
                "Role": "WH_USER",
                "DashboardName": "Inward Dashboard",
                "Icon": "icon-inward",
                "IsWarehouseBased": true,
                "IsClientBased": false,
            }, {
                "Role": "WH_USER",
                "DashboardName": "Outward Dashboard",
                "Icon": "icon-outward",
                "IsWarehouseBased": true,
                "IsClientBased": false,
            }, {
                "Role": "WH_USER",
                "DashboardName": "Location Dashboard",
                "Icon": "fa fa-map-marker",
                "IsWarehouseBased": true,
                "IsClientBased": false,
            }, {
                "Role": "EA_ADMIN",
                "DashboardName": "Inward Dashboard",
                "Icon": "icon-inward",
                "IsWarehouseBased": true,
                "IsClientBased": false,
            }, {
                "Role": "EA_ADMIN",
                "DashboardName": "Outward Dashboard",
                "Icon": "icon-outward",
                "IsWarehouseBased": true,
                "IsClientBased": false,
            }, {
                "Role": "EA_ADMIN",
                "DashboardName": "Location Dashboard",
                "Icon": "fa fa-map-marker",
                "IsWarehouseBased": true,
                "IsClientBased": false,
            }, {
                "Role": "EA_ADMIN",
                "DashboardName": "DMS Dashboard",
                "Icon": "fa fa-truck",
                "IsWarehouseBased": false,
                "IsClientBased": false,
            }];
            DynamicDashboardCtrl.ePage.Masters.DashboardListBasedOnRole = $filter('filter')(_DashboardListBasedOnRole, { Role: authService.getUserInfo().RoleCode })
            DynamicDashboardCtrl.ePage.Masters.SelectedDashboardDetails = DynamicDashboardCtrl.ePage.Masters.DashboardListBasedOnRole[0];
            OnChangeDashboardList();
        }

        function OnChangeDashboardList() {
            if (DynamicDashboardCtrl.ePage.Masters.SelectedDashboardDetails.IsWarehouseBased)
                GetWarehouseValues();
            if (DynamicDashboardCtrl.ePage.Masters.SelectedDashboardDetails.IsClientBased)
                GetClientDetails();
        }
        // #endregion
        // #region - Dashboard settings
        function GetSettingsButtonAccess() {
            var _Roles = "";
            angular.forEach(authService.getUserInfo().Roles, function (value, key) {
                _Roles = _Roles + value.Code + ",";
            });
            _Roles = _Roles.slice(0, -1);

            var _filter = {
                ItemCode: "Dashboard Settings",
                AccessCodes: _Roles
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
        // #region - get Dashboard list 
        function GetDashboardList() {
            var _DashboardList = [{
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
                    }]
            }, {
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
            if (LoadedAsDefaultDetails.length > 0) {
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
                    DynamicDashboardCtrl.ePage.Masters.WarehouseDetails = response.data.Response;
                    DynamicDashboardCtrl.ePage.Masters.SelectedWarehouse = DynamicDashboardCtrl.ePage.Masters.WarehouseDetails[0];
                    GetJson();
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
                "SortType": "DESC",
                "SortColumn": "ORG_Code",
                "PageNumber": 1,
                "PageSize": 25,
                "IsWarehouseClient": true,
            };
            var _input = {
                "FilterID": appConfig.Entities.OrgHeader.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_filter)
            }
            apiService.post("eAxisAPI", appConfig.Entities.OrgHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Status == "Success") {
                    DynamicDashboardCtrl.ePage.Masters.ClientDetails = response.data.Response;
                    DynamicDashboardCtrl.ePage.Masters.SelectedClient = DynamicDashboardCtrl.ePage.Masters.ClientDetails[0];
                }
            });
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
            DynamicDashboardCtrl.ePage.Masters.ComponentList = undefined;
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
                "ComponentName": "Asn Received Chart",
                "Directive": "asn-received-chart",
                "SequenceNo": 20,
                "IsShow": true,
                "SetAsDefault": true,
                "IsLoadAsDefault": true
            }];

            _obj = $filter('orderBy')(_obj, 'SequenceNo');
            DynamicDashboardCtrl.ePage.Masters.TempComponentList = angular.copy(_obj);
            DynamicDashboardCtrl.ePage.Masters.TempComponentList = $filter('orderBy')(DynamicDashboardCtrl.ePage.Masters.TempComponentList, '!IsLoadAsDefault');
            DynamicDashboardCtrl.ePage.Masters.IsShowDetails = $filter('filter')(_obj, { IsShow: true })
            var LoadedAsDefaultDetails = $filter('filter')(DynamicDashboardCtrl.ePage.Masters.IsShowDetails, { IsLoadAsDefault: true })
            if (LoadedAsDefaultDetails.length > 0) {
                dynamicDashboardConfig.LoadMoreCount = LoadedAsDefaultDetails.length;
            }
            dynamicDashboardConfig.LoadedDirectiveCount = 0;
            DynamicDashboardCtrl.ePage.Masters.ComponentList = angular.copy(LoadedAsDefaultDetails);
        }
        // #endregion
        // #region - get role list based on party 
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

        function OnChangeSingleSelect() {
            var Checked = DynamicDashboardCtrl.ePage.Masters.RoleList.some(function (value, key) {
                // Enable and disable based on page wise
                if (!value.SingleSelect)
                    return true;
            });
        }
        // #endregion
        Init();

    }

})();