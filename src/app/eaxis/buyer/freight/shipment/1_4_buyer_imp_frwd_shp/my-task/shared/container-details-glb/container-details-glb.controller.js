/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ContainerDetailsGlbController", ContainerDetailsGlbController);

    ContainerDetailsGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig"];

    function ContainerDetailsGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig) {
        var ContainerDetailsGlbCtrl = this;

        function Init() {
            ContainerDetailsGlbCtrl.ePage = {
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
            ContainerDetailsGlbCtrl.ePage.Masters.emptyText = "-";
            if (myTaskActivityConfig.Entities.Consol) {
                ContainerDetailsGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
                ContainerDetailsGlbCtrl.currentConsol = myTaskActivityConfig.Entities.Consol;
            }
        }

        Init();
    }
})();