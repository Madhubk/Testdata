/*
    Page : Custom Filling
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaShipmentCustomsFillingGlbController", ExportSeaShipmentCustomsFillingGlbController);

    ExportSeaShipmentCustomsFillingGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig"];

    function ExportSeaShipmentCustomsFillingGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig) {
        
        var ExportSeaShipmentCustomsFillingGlbCtrl = this;

        function Init() {
            ExportSeaShipmentCustomsFillingGlbCtrl.ePage = {
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
            ExportSeaShipmentCustomsFillingGlbCtrl.ePage.Masters.emptyText = "-";
            
            if (ExportSeaShipmentCustomsFillingGlbCtrl.taskObj) {
                ExportSeaShipmentCustomsFillingGlbCtrl.ePage.Masters.TaskObj = ExportSeaShipmentCustomsFillingGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaShipmentCustomsFillingGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
            }
        }

        function GetEntityObj() {
            if (ExportSeaShipmentCustomsFillingGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ExportSeaShipmentCustomsFillingGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaShipmentCustomsFillingGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }
        

        Init();
    }
})();