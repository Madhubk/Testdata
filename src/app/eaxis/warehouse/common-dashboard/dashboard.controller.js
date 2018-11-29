(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CommonDashboardController", CommonDashboardController);

    CommonDashboardController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig",  "helperService", "toastr", "$filter", "$document", "confirmation","warehouseConfig"];

    function CommonDashboardController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig,  helperService, toastr, $filter, $document, confirmation,warehouseConfig) {

        var DashboardCtrl = this;

        function Init() {
 

            DashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": '',
            };  
            
            DashboardCtrl.ePage.Masters.WarehouseChanged = WarehouseChanged;

            GetWarehouseValues();
            GetTaskDetails();
        }

        function GetWarehouseValues() {
            //Get Warehouse Details
            var _input = {
                "FilterID": appConfig.Entities.WmsWarehouse.API.FindAll.FilterID,
                "SearchInput": []
            };

            apiService.post("eAxisAPI", appConfig.Entities.WmsWarehouse.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DashboardCtrl.ePage.Masters.WarehouseDetails = response.data.Response;
                    DashboardCtrl.ePage.Masters.userselected = DashboardCtrl.ePage.Masters.WarehouseDetails[0];
                    WarehouseChanged();
                }
            });
        }

        function WarehouseChanged(){
            GetNotificationValues();
            GetKPIValues();
        }

        function GetNotificationValues() {
            DashboardCtrl.ePage.Masters.NotificationDashboardDetails = [];
            // var _input = {
            //     "SourceEntityRefKey":"WMSDashboardNotifications",
            //     "RelatedDetails": [{"UIField":"TGP_War_WarehouseCode",
            //         "DbField":"TGP_War_WarehouseCode",
            //         "Value":DashboardCtrl.ePage.Masters.userselected.WarehouseCode}]
            // };

            // apiService.post("eAxisAPI", warehouseConfig.Entities.Header.API.FindAllCommonDashboard.Url, _input).then(function (response) {
            //     if (response.data.Response.QOutput) {
            //         DashboardCtrl.ePage.Masters.NotificationDashboardDetails = response.data.Response.QOutput;
            //     }
            // });

        }

        function GetKPIValues() {
            DashboardCtrl.ePage.Masters.KPIDashboardDetails = [];
            var _input = {
                "SourceEntityRefKey":"WMSDashboardKPI",
                "RelatedDetails": [{"UIField":"TGP_War_WarehouseCode",
                    "DbField":"TGP_War_WarehouseCode",
                    "Value":DashboardCtrl.ePage.Masters.userselected.WarehouseCode}]
            };

            apiService.post("eAxisAPI", warehouseConfig.Entities.Header.API.FindAllCommonDashboard.Url, _input).then(function (response) {
                if (response.data.Response.QOutput) {
                    DashboardCtrl.ePage.Masters.KPIDashboardDetails = response.data.Response.QOutput;
                }
            });
        }



        function GetTaskDetails(){
            DashboardCtrl.ePage.Masters.WorkItemList = [];
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
                    DashboardCtrl.ePage.Masters.WorkItemList = response.data.Response;
                } else {
                    DashboardCtrl.ePage.Masters.WorkItemList = [];
                }

            });
        }

        Init();
    }

})();