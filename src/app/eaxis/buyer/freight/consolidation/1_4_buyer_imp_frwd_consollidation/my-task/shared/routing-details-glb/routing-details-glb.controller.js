(function () {
    "use strict";

    angular
        .module("Application")
        .controller("RoutingDetailsGlbController", RoutingDetailsGlbController);

    RoutingDetailsGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService"];

    function RoutingDetailsGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService) {
        var RoutingDetailsGlbCtrl = this;

        function Init() {
            RoutingDetailsGlbCtrl.ePage = {
                "Title": "",
                "Prefix": "Routing",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            RoutingDetailsGlbCtrl.ePage.Masters.emptyText = "-";
            if (myTaskActivityConfig.Entities.Consol) {
                RoutingDetailsGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
                RoutingDetailsGlbCtrl.currentConsol = myTaskActivityConfig.Entities.Consol;
            }
        }

        Init();
    }
})();