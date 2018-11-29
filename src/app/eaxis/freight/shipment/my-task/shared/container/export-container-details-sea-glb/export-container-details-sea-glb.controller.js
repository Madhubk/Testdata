/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportContainerDetailsSeaGlbController", ExportContainerDetailsSeaGlbController);

    ExportContainerDetailsSeaGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig"];

    function ExportContainerDetailsSeaGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig) {
        var ExportContainerDetailsSeaGlbCtrl = this;

        function Init() {
            ExportContainerDetailsSeaGlbCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol_Routing",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            ExportContainerDetailsSeaGlbCtrl.ePage.Masters.emptyText = "-";
            if (myTaskActivityConfig.Entities.Consol) {
                ExportContainerDetailsSeaGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
                ExportContainerDetailsSeaGlbCtrl.currentConsol = myTaskActivityConfig.Entities.Consol;
            }
        }

        Init();
    }
})();