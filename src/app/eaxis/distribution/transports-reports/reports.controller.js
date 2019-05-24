(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TransportsReportController", TransportsReportController);

    TransportsReportController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "$timeout", "toastr", "appConfig", "$window", "dynamicLookupConfig", "$filter","$uibModal","$scope"];

    function TransportsReportController($location, APP_CONSTANT, authService, apiService, helperService, $timeout, toastr, appConfig, $window, dynamicLookupConfig, $filter,$uibModal,$scope) {

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
            ReportCtrl.ePage.Masters.Title = "Transport Reports";

            // function call from UI
            ReportCtrl.ePage.Masters.GetConfigDetails = GetConfigDetails;

            // function call
            checkCfxMenus();
        }
        // CfxMenus
        function checkCfxMenus() {

            ReportCtrl.ePage.Masters.ChildMenuList = [];
            var _filter = {
                "USR_TenantCode": authService.getUserInfo().TenantCode,
                "USR_SAP_FK": authService.getUserInfo().AppPK,
                "PageType": "Report",
                "ModuleCode": "DMS",
                "USR_UserName": authService.getUserInfo().UserId,
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.MasterCascadeFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.MasterCascadeFindAll.Url, _input).then(function ApiCallback(response) {
                if (response.data.Response) {
                    ReportCtrl.ePage.Masters.OtherConfigList = [];

                    ReportCtrl.ePage.Masters.ParentMenuList = response.data.Response;

                    ReportCtrl.ePage.Masters.ChildMenuList = $filter('orderBy')(response.data.Response[0].MenuList, 'DisplayOrder');
                    // console.log(ReportCtrl.ePage.Masters.ChildMenuList);
                    if (ReportCtrl.ePage.Masters.ChildMenuList.length > 0) {
                        angular.forEach(ReportCtrl.ePage.Masters.ChildMenuList, function (value, key) {
                            value.OtherConfig = JSON.parse(value.OtherConfig);
                            ReportCtrl.ePage.Masters.OtherConfigList.push(value.OtherConfig);
                            // console.log(ReportCtrl.ePage.Masters.OtherConfigList);
                        });
                    }
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
                templateUrl: "app/eaxis/distribution/transports-reports/grid-page/grid-page.html",
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