(function () {
    "use strict";

    angular
        .module("Application")
        .controller("GrnStatusController", GrnStatusController);

    GrnStatusController.$inject = ["authService", "apiService", "appConfig", "helperService", "dynamicDashboardConfig"];

    function GrnStatusController(authService, apiService, appConfig, helperService, dynamicDashboardConfig) {

        var GrnStatusCtrl = this;

        function Init() {


            GrnStatusCtrl.ePage = {
                "Title": "",
                "Prefix": "GRN_Status",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": '',
            };

            if (GrnStatusCtrl.selectedComponent.SetAsDefault) {
                GetGrnStatusDetails();
                GrnStatusCtrl.ePage.Masters.IsLoad = true;
            } else {
                GrnStatusCtrl.ePage.Masters.IsLoad = false;
            }
            GrnStatusCtrl.ePage.Masters.GetGrnStatusDetails = GetGrnStatusDetails;
        }

        function GetGrnStatusDetails() {
            GrnStatusCtrl.ePage.Masters.IsLoad = true;
            GrnStatusCtrl.ePage.Masters.IsLoading = true;
            var _filter = {
                "WarehouseCode": GrnStatusCtrl.selectedWarehouse.WarehouseCode,
                "ClientCode": GrnStatusCtrl.selectedClient.AccessCode
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": dynamicDashboardConfig.Entities.WmsInward.API.GRNFindAll.FilterID
            };

            apiService.post("eAxisAPI", dynamicDashboardConfig.Entities.WmsInward.API.GRNFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    GrnStatusCtrl.ePage.Masters.GrnStatusDetails = response.data.Response;
                    GrnStatusCtrl.ePage.Masters.IsLoading = false;
                }
            });
        }

        Init();
    }

})();