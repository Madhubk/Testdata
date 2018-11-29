/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ImportContainerDetailsGlbController", ImportContainerDetailsGlbController);

    ImportContainerDetailsGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "authService", "APP_CONSTANT"];

    function ImportContainerDetailsGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, authService, APP_CONSTANT) {
        var ImportContainerDetailsGlbCtrl = this;

        function Init() {
            ImportContainerDetailsGlbCtrl.ePage = {
                "Title": "",
                "Prefix": "Shipment_Package",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            ImportContainerDetailsGlbCtrl.ePage.Masters.emptyText = "-";
            if (myTaskActivityConfig.Entities.Container) {
                ImportContainerDetailsGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Container[myTaskActivityConfig.Entities.Container.label].ePage.Entities.Header.Data;
                ImportContainerDetailsGlbCtrl.currentContainer = myTaskActivityConfig.Entities.Container;
            }

        }

        Init();
    }
})();