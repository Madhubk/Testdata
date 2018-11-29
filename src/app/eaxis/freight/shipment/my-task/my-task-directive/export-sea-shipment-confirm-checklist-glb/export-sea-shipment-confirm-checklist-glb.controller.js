/*
    Page :CONFIRM CHECKLIST
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaShipmentConfirmChecklistGlbController", ExportSeaShipmentConfirmChecklistGlbController);

    ExportSeaShipmentConfirmChecklistGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig"];

    function ExportSeaShipmentConfirmChecklistGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig) {
        
        var ExportSeaShipmentConfirmChecklistGlbCtrl = this;

        function Init() {
            ExportSeaShipmentConfirmChecklistGlbCtrl.ePage = {
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
            ExportSeaShipmentConfirmChecklistGlbCtrl.ePage.Masters.emptyText = "-";
            
            if (ExportSeaShipmentConfirmChecklistGlbCtrl.taskObj) {
                ExportSeaShipmentConfirmChecklistGlbCtrl.ePage.Masters.TaskObj = ExportSeaShipmentConfirmChecklistGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaShipmentConfirmChecklistGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                ExportSeaShipmentConfirmChecklistGlbCtrl.ePage.Entities.Header.Data.UIShpExtendedInfo.IsConfirmCheckListRequired=false;
                ExportSeaShipmentConfirmChecklistGlbCtrl.ePage.Entities.Header.Data.UIShpExtendedInfo.IsCheckListConfirmed=false;
            }
        }

        function GetEntityObj() {
            if (ExportSeaShipmentConfirmChecklistGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ExportSeaShipmentConfirmChecklistGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaShipmentConfirmChecklistGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }
        

        Init();
    }
})();