(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PutawayStatusController", PutawayStatusController);

    PutawayStatusController.$inject = ["authService", "apiService", "appConfig", "helperService", "dynamicDashboardConfig"];

    function PutawayStatusController(authService, apiService, appConfig, helperService, dynamicDashboardConfig) {

        var PutawayStatusCtrl = this;

        function Init() {


            PutawayStatusCtrl.ePage = {
                "Title": "",
                "Prefix": "Putaway_Status",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": '',
            };

            if (PutawayStatusCtrl.selectedComponent.DC_LoadByDefault) {
                GetPutawayStatusDetails();
                PutawayStatusCtrl.ePage.Masters.IsLoad = true;
            } else {
                PutawayStatusCtrl.ePage.Masters.IsLoad = false;
            }
            PutawayStatusCtrl.ePage.Masters.GetPutawayStatusDetails = GetPutawayStatusDetails;
        }

        function GetPutawayStatusDetails() {
            PutawayStatusCtrl.ePage.Masters.IsLoad = true;
            PutawayStatusCtrl.ePage.Masters.IsLoading = true;
            var _filter = {
                "WarehouseCode": PutawayStatusCtrl.selectedWarehouse.WarehouseCode,
                "ClientCode": PutawayStatusCtrl.selectedClient.AccessCode
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": dynamicDashboardConfig.Entities.WmsInward.API.PutAwayFindAll.FilterID
            };

            apiService.post("eAxisAPI", dynamicDashboardConfig.Entities.WmsInward.API.PutAwayFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PutawayStatusCtrl.ePage.Masters.PutawayStatusDetails = response.data.Response;
                    PutawayStatusCtrl.ePage.Masters.IsLoading = false;
                }
            });
        }

        Init();
    }

})();