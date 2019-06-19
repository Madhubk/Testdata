(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ReportController", ReportController);

    ReportController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "$timeout", "toastr", "appConfig", "$window", "dynamicLookupConfig", "$filter", "$uibModal", "$scope", "$state"];

    function ReportController($location, APP_CONSTANT, authService, apiService, helperService, $timeout, toastr, appConfig, $window, dynamicLookupConfig, $filter, $uibModal, $scope, $state) {

        var ReportCtrl = this;

        function Init() {

            ReportCtrl.ePage = {
                "Title": "",
                "Prefix": "Report",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            // variable declaration
            ReportCtrl.ePage.Masters.selectedRow = -1;

            if ($state.current.url == "/spare-parts-report") {
                ReportCtrl.ePage.Masters.Title = "Spare Parts Reports";
            }
            else if ($state.current.url == "/warehouse-report") {
                ReportCtrl.ePage.Masters.Title = "Warehouse Reports";
            }
            else if ($state.current.url == "/transports-report") {
                ReportCtrl.ePage.Masters.Title = "Transport Reports";
            }

            // function call from UI
            ReportCtrl.ePage.Masters.GetConfigDetails = GetConfigDetails;

            ReportCtrl.ePage.Masters.SelectedValue = SelectedValue;

            // function call
            checkCfxMenus();
        }

        // Highlighting the Selected Value
        function SelectedValue(item, index) {
            angular.forEach(ReportCtrl.ePage.Masters.ParentMenuList, function (val, key) {
                val.IsSelectedValue = false;
                item.IsSelectedValue = true;
            });
        }

        // CfxMenus
        function checkCfxMenus() {

            ReportCtrl.ePage.Masters.ParentMenuList = [];
            ReportCtrl.ePage.Masters.ChildMenuList = [];

            var _filter = {
                "USR_TenantCode": authService.getUserInfo().TenantCode,
                "USR_SAP_FK": authService.getUserInfo().AppPK,
                "PageType": "Report",
                "USR_UserName": authService.getUserInfo().UserId,
            };

            if ($state.current.url == "/spare-parts-report") {
                _filter.ModuleCode = "WMS",
                    _filter.SubModuleCode = "SPMS"
            }
            else if ($state.current.url == "/warehouse-report") {
                _filter.ModuleCode = "WMS",
                    _filter.SubModuleCode = "GEN"
            }
            else if ($state.current.url == "/transports-report") {
                _filter.ModuleCode = "DMS"
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.MasterCascadeFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.MasterCascadeFindAll.Url, _input).then(function ApiCallback(response) {
                if (response.data.Response) {
                    ReportCtrl.ePage.Masters.OtherConfigList = [];

                    // parent menu looping
                    angular.forEach(response.data.Response, function (value, key) {
                        ReportCtrl.ePage.Masters.ParentMenuList.push(value);
                    });

                    ReportCtrl.ePage.Masters.ParentMenuList = $filter('orderBy')(ReportCtrl.ePage.Masters.ParentMenuList, 'DisplayOrder')

                    angular.forEach(ReportCtrl.ePage.Masters.ParentMenuList, function (val, key) {
                        ReportCtrl.ePage.Masters.ChildMenuList.push(val.MenuList);
                    });

                    // child menu looping
                    angular.forEach(ReportCtrl.ePage.Masters.ChildMenuList, function (value1, key1) {
                        angular.forEach(value1, function (value2, key2) {
                            value2.OtherConfig = JSON.parse(value2.OtherConfig);
                            ReportCtrl.ePage.Masters.OtherConfigList.push(value2.OtherConfig);
                        });
                    });

                    ReportCtrl.ePage.Masters.ParentMenuList[0].IsSelectedValue = true;
                }
            });
        }

        // get config details
        function GetConfigDetails(item, index) {
            ReportCtrl.ePage.Masters.selectedRow = index;
            ReportCtrl.ePage.Masters.IsLoading = true;
            ReportCtrl.ePage.Masters.dataEntryDetails = item;
            GridPageModel();
        }

        // model
        function GridPageModel() {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "dashboard-setting-edit right address",
                scope: $scope,
                templateUrl: "app/eaxis/general-reports/grid-page/grid-page.html",
                controller: 'GridPageController as GridPageCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Entity": ReportCtrl.ePage.Masters.dataEntryDetails,
                        };
                        return exports;
                    }
                }
            });
        }

        Init();

    }

})();