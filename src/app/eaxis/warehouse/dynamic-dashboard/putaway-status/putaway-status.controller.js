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

            GetPutawayStatusDetails();
        }

        function GetPutawayStatusDetails() {
            var _filter = {
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": dynamicDashboardConfig.Entities.WmsInward.API.PutAwayFindAll.FilterID
            };

            apiService.post("eAxisAPI", dynamicDashboardConfig.Entities.WmsInward.API.PutAwayFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PutawayStatusCtrl.ePage.Masters.PutawayStatusDetails = response.data.Response;
                }
            });
        }

        Init();
    }

})();