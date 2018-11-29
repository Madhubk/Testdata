/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("VgmFilingController", VgmFilingController);

    VgmFilingController.$inject = ["$scope", "apiService", "helperService", "appConfig"];

    function VgmFilingController($scope, apiService, helperService, appConfig) {
        var VgmFilingDirCtrl = this;

        function Init() {
            VgmFilingDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Cargo_PickUp",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            VgmFilingDirCtrl.ePage.Masters.emptyText = "-";
            VgmFilingDirCtrl.ePage.Masters.TaskObj = VgmFilingDirCtrl.taskObj;

            GetEntityObj();
        }

        function GetEntityObj() {
            if (VgmFilingDirCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + VgmFilingDirCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        VgmFilingDirCtrl.ePage.Masters.EntityObj = response.data.Response;
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        Init();
    }
})();