/*
    Page : Shipping Bill Filling
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaShipmentJobCostSheetGlbController", ExportSeaShipmentJobCostSheetGlbController);

    ExportSeaShipmentJobCostSheetGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig"];

    function ExportSeaShipmentJobCostSheetGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig) {
        
        var ExportSeaShipmentJobCostSheetGlbCtrl = this;

        function Init() {
            ExportSeaShipmentJobCostSheetGlbCtrl.ePage = {
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
            ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.emptyText = "-";
            
            if (ExportSeaShipmentJobCostSheetGlbCtrl.taskObj) {
                ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.TaskObj = ExportSeaShipmentJobCostSheetGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
            }
        }

        function GetEntityObj() {
            if (ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaShipmentJobCostSheetGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }
        

        Init();
    }
})();