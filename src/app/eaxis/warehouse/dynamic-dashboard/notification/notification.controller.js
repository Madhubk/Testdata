(function () {
    "use strict";

    angular
        .module("Application")
        .controller("NotificationController", NotificationController);

    NotificationController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "$filter", "$document", "confirmation", "warehouseConfig"];

    function NotificationController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, $filter, $document, confirmation, warehouseConfig) {

        var NotificationCtrl = this;

        function Init() {


            NotificationCtrl.ePage = {
                "Title": "",
                "Prefix": "Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": '',
            };

            NotificationCtrl.ePage.Masters.WarehouseChanged = WarehouseChanged;

            GetWarehouseValues();
            GetTaskDetails();
            GetExceptionDetails();
        }

        function GetWarehouseValues() {
            //Get Warehouse Details
            var _input = {
                "FilterID": appConfig.Entities.WmsWarehouse.API.FindAll.FilterID,
                "SearchInput": []
            };

            apiService.post("eAxisAPI", appConfig.Entities.WmsWarehouse.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    NotificationCtrl.ePage.Masters.WarehouseDetails = response.data.Response;
                    NotificationCtrl.ePage.Masters.userselected = NotificationCtrl.ePage.Masters.WarehouseDetails[0];
                    WarehouseChanged();
                }
            });
        }

        function WarehouseChanged() {
            GetNotificationValues();
            GetKPIValues();
        }

        function GetNotificationValues() {
            NotificationCtrl.ePage.Masters.NotificationDashboardDetails = [];
            var _input = {
                "SourceEntityRefKey": "WMSDashboardNotifications",
                "RelatedDetails": [{
                    "UIField": "TGP_War_WarehouseCode",
                    "DbField": "TGP_War_WarehouseCode",
                    "Value": NotificationCtrl.ePage.Masters.userselected.WarehouseCode
                }]
            };

            apiService.post("eAxisAPI", warehouseConfig.Entities.Header.API.FindAllCommonDashboard.Url, _input).then(function (response) {
                if (response.data.Response.QOutput) {
                    NotificationCtrl.ePage.Masters.NotificationDashboardDetails = response.data.Response.QOutput;
                }
            });

        }

        function GetKPIValues() {
            NotificationCtrl.ePage.Masters.KPIDashboardDetails = [];
            var _input = {
                "SourceEntityRefKey": "WMSDashboardKPI",
                "RelatedDetails": [{
                    "UIField": "TGP_War_WarehouseCode",
                    "DbField": "TGP_War_WarehouseCode",
                    "Value": NotificationCtrl.ePage.Masters.userselected.WarehouseCode
                }]
            };

            apiService.post("eAxisAPI", warehouseConfig.Entities.Header.API.FindAllCommonDashboard.Url, _input).then(function (response) {
                if (response.data.Response.QOutput) {
                    NotificationCtrl.ePage.Masters.KPIDashboardDetails = response.data.Response.QOutput;
                }
            });
        }



        function GetTaskDetails() {
            NotificationCtrl.ePage.Masters.WorkItemList = [];
            var _filter = {
                PivotCount: "0",
                TenantCode: authService.getUserInfo().TenantCode,
                Performer: authService.getUserInfo().UserId
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllStatusCount.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllStatusCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    NotificationCtrl.ePage.Masters.WorkItemList = response.data.Response;
                }

            });
        }

        function GetExceptionDetails() {
            NotificationCtrl.ePage.Masters.ExceptionList = [];
            var _filter = {
                "EntitySource": 'TMS'
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobException.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobException.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    NotificationCtrl.ePage.Masters.ExceptionList = response.data.Response;
                }
            });
        }

        Init();
    }

})();