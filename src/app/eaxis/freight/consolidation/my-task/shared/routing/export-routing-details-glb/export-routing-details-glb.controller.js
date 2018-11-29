(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportRoutingDetailsGlbController", ExportRoutingDetailsGlbController);

    ExportRoutingDetailsGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService"];

    function ExportRoutingDetailsGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService) {
        var ExportRoutingDetailsGlbCtrl = this;

        function Init() {
            ExportRoutingDetailsGlbCtrl.ePage = {
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
            ExportRoutingDetailsGlbCtrl.ePage.Masters.emptyText = "-";
            if (myTaskActivityConfig.Entities.Consol) {
                ExportRoutingDetailsGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
                ExportRoutingDetailsGlbCtrl.currentConsol = myTaskActivityConfig.Entities.Consol;
            }
        }

        Init();
    }
})();