(function () {
    "use strict";

    angular
        .module("Application")
        .controller("WarehouseReportController", WarehouseReportController);

    WarehouseReportController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "$timeout", "toastr", "appConfig", "$window", "dynamicLookupConfig", "$filter", "$state","$uibModal","$scope"];

    function WarehouseReportController($location, APP_CONSTANT, authService, apiService, helperService, $timeout, toastr, appConfig, $window, dynamicLookupConfig, $filter, $state,$uibModal,$scope) {

        var WarehouseReportCtrl = this;

        function Init() {

            WarehouseReportCtrl.ePage = {
                "Title": "",
                "Prefix": "Report",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };
            // variable declaration

            WarehouseReportCtrl.ePage.Masters.selectedRow = -1;
            WarehouseReportCtrl.ePage.Masters.Title = "Warehouse Reports";

            // function call from UI
            WarehouseReportCtrl.ePage.Masters.GetConfigDetails = GetConfigDetails;

            // function call
            checkCfxMenus();

        }

        // get config details
        function GetConfigDetails(item, index) {
            WarehouseReportCtrl.ePage.Masters.selectedRow = index;
            WarehouseReportCtrl.ePage.Masters.IsLoading = true;
            WarehouseReportCtrl.ePage.Masters.dataEntryDetails = item;
            GridPageModel();
        }

        // CfxMenus
        function checkCfxMenus() {

            WarehouseReportCtrl.ePage.Masters.ChildMenuList = [];
            var _filter = {
                "USR_TenantCode": authService.getUserInfo().TenantCode,
                "USR_SAP_FK": authService.getUserInfo().AppPK,
                "PageType": "Report",
                "ModuleCode": "WMS",
                "USR_UserName": authService.getUserInfo().UserId,
            };

            _filter.SubModuleCode = "GEN"

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.MasterCascadeFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.MasterCascadeFindAll.Url, _input).then(function ApiCallback(response) {
                if (response.data.Response) {
                    WarehouseReportCtrl.ePage.Masters.OtherConfigList = [];

                    WarehouseReportCtrl.ePage.Masters.ParentMenuList = response.data.Response;

                    WarehouseReportCtrl.ePage.Masters.ChildMenuList = $filter('orderBy')(response.data.Response[0].MenuList, 'DisplayOrder');

                    console.log(WarehouseReportCtrl.ePage.Masters.ChildMenuList);

                    if (WarehouseReportCtrl.ePage.Masters.ChildMenuList.length > 0) {
                        angular.forEach(WarehouseReportCtrl.ePage.Masters.ChildMenuList, function (value, key) {
                            value.OtherConfig = JSON.parse(value.OtherConfig);
                            WarehouseReportCtrl.ePage.Masters.OtherConfigList.push(value.OtherConfig);
                            // console.log(WarehouseReportCtrl.ePage.Masters.OtherConfigList);
                        });
                    }
                }
            });
        }

        // model

        function GridPageModel() {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "dashboard-setting-edit right address",
                scope: $scope,
                templateUrl: "app/eaxis/warehouse/general-module/warehouse-report/report-grid-page/report-grid-page.html",
                controller: 'ReportGridPageController as ReportGridPageCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Entity": WarehouseReportCtrl.ePage.Masters.dataEntryDetails,
                        };
                        return exports;
                    }
                }
            });
        }

        Init();
    }

})();