/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaShipmentAmendTaxInvGlbController", ExportSeaShipmentAmendTaxInvGlbController);

        ExportSeaShipmentAmendTaxInvGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig"];

    function ExportSeaShipmentAmendTaxInvGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig) {
        var ExportSeaShipmentAmendTaxInvGlbCtrl = this;
        function Init() {
            ExportSeaShipmentAmendTaxInvGlbCtrl.ePage = {
                "Title": "",
                "Prefix": "Details_Page",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            ExportSeaShipmentAmendTaxInvGlbCtrl.ePage.Masters.emptyText = "-";
            if (ExportSeaShipmentAmendTaxInvGlbCtrl.taskObj) {
                ExportSeaShipmentAmendTaxInvGlbCtrl.ePage.Masters.TaskObj = ExportSeaShipmentAmendTaxInvGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaShipmentAmendTaxInvGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
            }
        }

        function GetEntityObj() {
            if (ExportSeaShipmentAmendTaxInvGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ExportSeaShipmentAmendTaxInvGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaShipmentAmendTaxInvGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();