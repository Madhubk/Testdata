(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AsnTrendController", AsnTrendController);

    AsnTrendController.$inject = ["authService", "apiService", "appConfig", "helperService", "dynamicDashboardConfig"];

    function AsnTrendController(authService, apiService, appConfig, helperService, dynamicDashboardConfig) {

        var AsnTrendCtrl = this;

        function Init() {


            AsnTrendCtrl.ePage = {
                "Title": "",
                "Prefix": "ASN_Recived_with_Status",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": '',
            };

            if (AsnTrendCtrl.selectedComponent.SetAsDefault) {
                GetAsnTrendDetails();
                AsnTrendCtrl.ePage.Masters.IsLoad = true;
            } else {
                AsnTrendCtrl.ePage.Masters.IsLoad = false;
            }
            AsnTrendCtrl.ePage.Masters.GetAsnTrendDetails = GetAsnTrendDetails;
        }

        function GetAsnTrendDetails() {
            AsnTrendCtrl.ePage.Masters.IsLoad = true;
            var _filter = {
                "WarehouseCode": AsnTrendCtrl.selectedWarehouse.WarehouseCode
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": dynamicDashboardConfig.Entities.WmsAsnLine.API.ASNTrendFindAll.FilterID
            };

            apiService.post("eAxisAPI", dynamicDashboardConfig.Entities.WmsAsnLine.API.ASNTrendFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    AsnTrendCtrl.ePage.Masters.AsnTrendDetails = response.data.Response;
                }
            });
        }

        Init();
    }

})();