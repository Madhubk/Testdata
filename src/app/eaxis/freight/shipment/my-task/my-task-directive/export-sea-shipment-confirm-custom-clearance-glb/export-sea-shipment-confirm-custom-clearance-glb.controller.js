/*
    Page : Confirm Custom Clearance
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaShipmentConfirmCustomClearanceGlbController", ExportSeaShipmentConfirmCustomClearanceGlbController);

    ExportSeaShipmentConfirmCustomClearanceGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig"];

    function ExportSeaShipmentConfirmCustomClearanceGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig) {
        
        var ExportSeaShipmentConfirmCustomClearanceGlbCtrl = this;

        function Init() {
            ExportSeaShipmentConfirmCustomClearanceGlbCtrl.ePage = {
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
            ExportSeaShipmentConfirmCustomClearanceGlbCtrl.ePage.Masters.emptyText = "-";
            
            if (ExportSeaShipmentConfirmCustomClearanceGlbCtrl.taskObj) {
                ExportSeaShipmentConfirmCustomClearanceGlbCtrl.ePage.Masters.TaskObj = ExportSeaShipmentConfirmCustomClearanceGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaShipmentConfirmCustomClearanceGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
            }
        }

        function GetEntityObj() {
            if (ExportSeaShipmentConfirmCustomClearanceGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ExportSeaShipmentConfirmCustomClearanceGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaShipmentConfirmCustomClearanceGlbCtrl.ePage.Entities.Header.Data = response.data.Response;
                    }
                });
            }
        }
        

        Init();
    }
})();