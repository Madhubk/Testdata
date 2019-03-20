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

            GetOpenSODetails();
        }

        function GetOpenSODetails() {
            var _filter = {
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": dynamicDashboardConfig.Entities.WmsOutward.API.GetOutBoundDetails.FilterID
            };            
            
            apiService.post("eAxisAPI", dynamicDashboardConfig.Entities.WmsOutward.API.GetOutBoundDetails.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OpenSOCtrl.ePage.Masters.OpenSODetails = response.data.Response;
                }
            });
        }

        Init();
    }

})();