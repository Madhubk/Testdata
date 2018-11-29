/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaShipmentVerifyTaxInvGlbController", ExportSeaShipmentVerifyTaxInvGlbController);

        ExportSeaShipmentVerifyTaxInvGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig"];

    function ExportSeaShipmentVerifyTaxInvGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig) {
        var ExportSeaShipmentVerifyTaxInvGlbCtrl = this;
        function Init() {
            ExportSeaShipmentVerifyTaxInvGlbCtrl.ePage = {
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

            ExportSeaShipmentVerifyTaxInvGlbCtrl.ePage.Masters.emptyText = "-";
            if (ExportSeaShipmentVerifyTaxInvGlbCtrl.taskObj) {
                ExportSeaShipmentVerifyTaxInvGlbCtrl.ePage.Masters.TaskObj = ExportSeaShipmentVerifyTaxInvGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaShipmentVerifyTaxInvGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
            }
        }

        function GetEntityObj() {
            if (ExportSeaShipmentVerifyTaxInvGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ExportSeaShipmentVerifyTaxInvGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaShipmentVerifyTaxInvGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();