(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OpenSOController", OpenSOController);

    OpenSOController.$inject = ["authService", "apiService", "appConfig", "helperService", "dynamicDashboardConfig"];

    function OpenSOController(authService, apiService, appConfig, helperService, dynamicDashboardConfig) {

        var OpenSOCtrl = this;

        function Init() {


            OpenSOCtrl.ePage = {
                "Title": "",
                "Prefix": "Open_SO",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": '',
            };

            if (OpenSOCtrl.selectedComponent.SetAsDefault) {
                GetOpenSODetails();
                OpenSOCtrl.ePage.Masters.IsLoad = true;
            } else {
                OpenSOCtrl.ePage.Masters.IsLoad = false;
            }
            OpenSOCtrl.ePage.Masters.GetOpenSODetails = GetOpenSODetails;
        }

        function GetOpenSODetails() {
            OpenSOCtrl.ePage.Masters.IsLoad = true;
            OpenSOCtrl.ePage.Masters.IsLoading = true;
            var _filter = {
                "WarehouseCode": OpenSOCtrl.selectedWarehouse.WarehouseCode,
                "ClientCode": OpenSOCtrl.selectedClient.AccessCode
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": dynamicDashboardConfig.Entities.WmsOutward.API.GetOutBoundDetails.FilterID
            };

            apiService.post("eAxisAPI", dynamicDashboardConfig.Entities.WmsOutward.API.GetOutBoundDetails.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OpenSOCtrl.ePage.Masters.OpenSODetails = response.data.Response;
                    OpenSOCtrl.ePage.Masters.IsLoading = false;
                }
            });
        }

        Init();
    }

})();