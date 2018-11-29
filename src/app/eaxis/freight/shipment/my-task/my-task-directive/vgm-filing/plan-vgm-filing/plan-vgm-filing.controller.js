/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PlanVgmFilingController", PlanVgmFilingController);

    PlanVgmFilingController.$inject = ["$scope", "apiService", "helperService", "appConfig"];

    function PlanVgmFilingController($scope, apiService, helperService, appConfig) {
        var PlanVgmFilingDirCtrl = this;

        function Init() {
            PlanVgmFilingDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Cargo_PickUp",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            PlanVgmFilingDirCtrl.ePage.Masters.emptyText = "-";
            PlanVgmFilingDirCtrl.ePage.Masters.TaskObj = PlanVgmFilingDirCtrl.taskObj;

            GetEntityObj();
        }

        function GetEntityObj() {
            if (PlanVgmFilingDirCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + PlanVgmFilingDirCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        PlanVgmFilingDirCtrl.ePage.Masters.EntityObj = response.data.Response;
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        Init();
    }
})();