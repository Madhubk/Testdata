(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ServiceRequestReportController", ServiceRequestReportController);

    ServiceRequestReportController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "$timeout", "toastr", "appConfig", "$window", "dynamicLookupConfig", "$filter", "$state","$uibModal","$scope"];

    function ServiceRequestReportController($location, APP_CONSTANT, authService, apiService, helperService, $timeout, toastr, appConfig, $window, dynamicLookupConfig, $filter, $state,$uibModal,$scope) {

        var ServiceRequestReportCtrl = this;

        function Init() {

            ServiceRequestReportCtrl.ePage = {
                "Title": "",
                "Prefix": "Report",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };
            // variable declaration

            ServiceRequestReportCtrl.ePage.Masters.selectedRow = -1;
            ServiceRequestReportCtrl.ePage.Masters.Title = "Service Request Reports";

            // function call from UI
            ServiceRequestReportCtrl.ePage.Masters.GetConfigDetails = GetConfigDetails;

            // function call
            checkCfxMenus();

        }

        // get config details
        function GetConfigDetails(item, index) {
            ServiceRequestReportCtrl.ePage.Masters.selectedRow = index;
            ServiceRequestReportCtrl.ePage.Masters.IsLoading = true;
            ServiceRequestReportCtrl.ePage.Masters.dataEntryDetails = item;
            GridPageModel();
        }

        // CfxMenus
        function checkCfxMenus() {

            ServiceRequestReportCtrl.ePage.Masters.ChildMenuList = [];
            var _filter = {
                "USR_TenantCode": authService.getUserInfo().TenantCode,
                "USR_SAP_FK": authService.getUserInfo().AppPK,
                "PageType": "Report",
                "ModuleCode": "SRQ",
                "USR_UserName": authService.getUserInfo().UserId,
                "SubModuleCode":"GEN"
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.MasterCascadeFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.MasterCascadeFindAll.Url, _input).then(function ApiCallback(response) {
                if (response.data.Response) {
                    ServiceRequestReportCtrl.ePage.Masters.OtherConfigList = [];

                    ServiceRequestReportCtrl.ePage.Masters.ParentMenuList = response.data.Response;

                    ServiceRequestReportCtrl.ePage.Masters.ChildMenuList = $filter('orderBy')(response.data.Response[0].MenuList, 'DisplayOrder');
                    // console.log(ServiceRequestReportCtrl.ePage.Masters.ChildMenuList);
                    if (ServiceRequestReportCtrl.ePage.Masters.ChildMenuList.length > 0) {
                        angular.forEach(ServiceRequestReportCtrl.ePage.Masters.ChildMenuList, function (value, key) {
                            value.OtherConfig = JSON.parse(value.OtherConfig);
                            ServiceRequestReportCtrl.ePage.Masters.OtherConfigList.push(value.OtherConfig);
                            // console.log(ServiceRequestReportCtrl.ePage.Masters.OtherConfigList);
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
                templateUrl: "app/eaxis/service-request/general-module/service-request-report/report-grid-page/report-grid-page.html",
                controller: 'ReportGridPageController as ReportGridPageCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Entity": ServiceRequestReportCtrl.ePage.Masters.dataEntryDetails,
                        };
                        return exports;
                    }
                }
            });
        }

        Init();
    }

})();