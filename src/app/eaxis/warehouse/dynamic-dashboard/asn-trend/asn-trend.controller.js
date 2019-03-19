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

            GetAsnTrendDetails();
        }

        function GetAsnTrendDetails() {            
            var _filter = {
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