(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AsnReceivedController", AsnReceivedController);

    AsnReceivedController.$inject = ["authService", "apiService", "appConfig", "helperService", "dynamicDashboardConfig"];

    function AsnReceivedController(authService, apiService, appConfig, helperService, dynamicDashboardConfig) {

        var AsnReceivedCtrl = this;

        function Init() {


            AsnReceivedCtrl.ePage = {
                "Title": "",
                "Prefix": "ASN_Recived_with_Status",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": '',
            };

            GetAsnReceivedWithStatusDetails();
        }

        function GetAsnReceivedWithStatusDetails() {            
            var _filter = {
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": dynamicDashboardConfig.Entities.WmsAsnLine.API.DashboardFindAll.FilterID
            };

            apiService.post("eAxisAPI", dynamicDashboardConfig.Entities.WmsAsnLine.API.DashboardFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    AsnReceivedCtrl.ePage.Masters.AsnReceivedWithStatusDetails = response.data.Response;
                }
            });
        }

        Init();
    }

})();