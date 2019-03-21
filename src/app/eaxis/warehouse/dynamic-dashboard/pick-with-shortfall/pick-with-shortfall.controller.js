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

            GetPickWithShortfallDetails();
        }

        function GetPickWithShortfallDetails() {
            var _filter = {
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": dynamicDashboardConfig.Entities.WmsOutwardWorkOrderLine.API.DashboardPickShortfall.FilterID
            };

            apiService.post("eAxisAPI", dynamicDashboardConfig.Entities.WmsOutwardWorkOrderLine.API.DashboardPickShortfall.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PickShortfallCtrl.ePage.Masters.PickWithShortfallDetails = response.data.Response;
                }
            });
        }

        Init();
    }

})();