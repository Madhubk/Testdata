(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SPMSReportController", SPMSReportController);

    SPMSReportController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "$timeout", "toastr", "appConfig", "$window", "dynamicLookupConfig", "$filter", "$state","$uibModal","$scope"];

    function SPMSReportController($location, APP_CONSTANT, authService, apiService, helperService, $timeout, toastr, appConfig, $window, dynamicLookupConfig, $filter, $state,$uibModal,$scope) {

        var SPMSReportCtrl = this;

        function Init() {

            SPMSReportCtrl.ePage = {
                "Title": "",
                "Prefix": "Report",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };
            // variable declaration

            SPMSReportCtrl.ePage.Masters.selectedRow = -1;
            SPMSReportCtrl.ePage.Masters.Title = "Warehouse Reports";

            // function call from UI
            SPMSReportCtrl.ePage.Masters.GetConfigDetails = GetConfigDetails;

            // function call
            checkCfxMenus();

        }

        // get config details
        function GetConfigDetails(item, index) {
            SPMSReportCtrl.ePage.Masters.selectedRow = index;
            SPMSReportCtrl.ePage.Masters.IsLoading = true;
            SPMSReportCtrl.ePage.Masters.dataEntryDetails = item;
            GridPageModel();
        }

        // CfxMenus
        function checkCfxMenus() {

            SPMSReportCtrl.ePage.Masters.ChildMenuList = [];
            var _filter = {
                "USR_TenantCode": authService.getUserInfo().TenantCode,
                "USR_SAP_FK": authService.getUserInfo().AppPK,
                "PageType": "Report",
                "ModuleCode": "WMS",
                "USR_UserName": authService.getUserInfo().UserId,
                "SubModuleCode":"SPMS"
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.MasterCascadeFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.MasterCascadeFindAll.Url, _input).then(function ApiCallback(response) {
                if (response.data.Response) {
                    SPMSReportCtrl.ePage.Masters.OtherConfigList = [];

                    SPMSReportCtrl.ePage.Masters.ParentMenuList = response.data.Response;

                    SPMSReportCtrl.ePage.Masters.ChildMenuList = $filter('orderBy')(response.data.Response[0].MenuList, 'DisplayOrder');
                    // console.log(SPMSReportCtrl.ePage.Masters.ChildMenuList);
                    if (SPMSReportCtrl.ePage.Masters.ChildMenuList.length > 0) {
                        angular.forEach(SPMSReportCtrl.ePage.Masters.ChildMenuList, function (value, key) {
                            value.OtherConfig = JSON.parse(value.OtherConfig);
                            SPMSReportCtrl.ePage.Masters.OtherConfigList.push(value.OtherConfig);
                            // console.log(SPMSReportCtrl.ePage.Masters.OtherConfigList);
                        });
                    }
                }
            });
        }

         // Model
         function GridPageModel() {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "dashboard-setting-edit right address",
                scope: $scope,
                templateUrl: "app/eaxis/warehouse/general-module/spms-report/report-grid/report-grid.html",
                controller: 'ReportGridController as ReportGridCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Entity": SPMSReportCtrl.ePage.Masters.dataEntryDetails,
                        };
                        return exports;
                    }
                }
            });
        }

        Init();

    }

})();