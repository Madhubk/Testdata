(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CycleCountJobsController", CycleCountJobsController);

    CycleCountJobsController.$inject = ["authService", "apiService", "appConfig", "helperService", "dynamicDashboardConfig"];

    function CycleCountJobsController(authService, apiService, appConfig, helperService, dynamicDashboardConfig) {

        var CycleCountJobsCtrl = this;

        function Init() {


            CycleCountJobsCtrl.ePage = {
                "Title": "",
                "Prefix": "Cycle_Count_Jobs",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": '',
            };

            if (CycleCountJobsCtrl.selectedComponent.DC_LoadByDefault) {
                GetCycleCountJobsDetails();
                CycleCountJobsCtrl.ePage.Masters.IsLoad = true;
            } else {
                CycleCountJobsCtrl.ePage.Masters.IsLoad = false;
            }
            CycleCountJobsCtrl.ePage.Masters.GetCycleCountJobsDetails = GetCycleCountJobsDetails;
        }

        function GetCycleCountJobsDetails() {
            CycleCountJobsCtrl.ePage.Masters.IsLoad = true;
            CycleCountJobsCtrl.ePage.Masters.IsLoading = true;
            var _filter = {
                "WarehouseName": CycleCountJobsCtrl.selectedWarehouse.WarehouseName,
                "ClientCode": CycleCountJobsCtrl.selectedClient.AccessCode
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": dynamicDashboardConfig.Entities.WmsCycleCount.API.CycleCountFindAll.FilterID
            };

            apiService.post("eAxisAPI", dynamicDashboardConfig.Entities.WmsCycleCount.API.CycleCountFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    CycleCountJobsCtrl.ePage.Masters.CycleCountJobsDetails = response.data.Response;
                    CycleCountJobsCtrl.ePage.Masters.IsLoading = false;
                    angular.forEach(CycleCountJobsCtrl.ePage.Masters.CycleCountJobsDetails, function (value, key) {
                        if (value.IsScheduledStockTake == true) {
                            value.IsScheduledStockTake = "Scheduled"
                        } else if (value.IsScheduledStockTake == false) {
                            value.IsScheduledStockTake = "UnScheduled"
                        }
                    });
                }
            });
        }

        Init();
    }

})();