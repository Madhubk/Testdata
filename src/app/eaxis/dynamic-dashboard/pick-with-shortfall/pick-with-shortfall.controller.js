(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickShortfallController", PickShortfallController);

    PickShortfallController.$inject = ["authService", "apiService", "appConfig", "helperService", "dynamicDashboardConfig"];

    function PickShortfallController(authService, apiService, appConfig, helperService, dynamicDashboardConfig) {

        var PickShortfallCtrl = this;

        function Init() {


            PickShortfallCtrl.ePage = {
                "Title": "",
                "Prefix": "ASN_Recived_with_Status",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": '',
            };

            if (PickShortfallCtrl.selectedComponent.DC_LoadByDefault) {
                GetPickWithShortfallDetails();
                PickShortfallCtrl.ePage.Masters.IsLoad = true;
            } else {
                PickShortfallCtrl.ePage.Masters.IsLoad = false;
            }
            PickShortfallCtrl.ePage.Masters.GetPickWithShortfallDetails = GetPickWithShortfallDetails;
        }

        function GetPickWithShortfallDetails() {
            PickShortfallCtrl.ePage.Masters.IsLoad = true;
            PickShortfallCtrl.ePage.Masters.IsLoading = true;
            var _filter = {
                "WarehouseCode": PickShortfallCtrl.selectedWarehouse.WarehouseCode,
                "ClientCode": PickShortfallCtrl.selectedClient.AccessCode
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": dynamicDashboardConfig.Entities.WmsOutwardWorkOrderLine.API.DashboardPickShortfall.FilterID
            };

            apiService.post("eAxisAPI", dynamicDashboardConfig.Entities.WmsOutwardWorkOrderLine.API.DashboardPickShortfall.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PickShortfallCtrl.ePage.Masters.PickWithShortfallDetails = response.data.Response;
                    PickShortfallCtrl.ePage.Masters.IsLoading = false;
                }
            });
        }

        Init();
    }

})();