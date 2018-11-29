/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaShipmentWaitingforlinerorCFSGlbController", ExportSeaShipmentWaitingforlinerorCFSGlbController);

        ExportSeaShipmentWaitingforlinerorCFSGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig"];

    function ExportSeaShipmentWaitingforlinerorCFSGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig) {
        var ExportSeaShipmentWaitingforlinerorCFSGlbCtrl = this;
        function Init() {
            ExportSeaShipmentWaitingforlinerorCFSGlbCtrl.ePage = {
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

            ExportSeaShipmentWaitingforlinerorCFSGlbCtrl.ePage.Masters.emptyText = "-";
            if (ExportSeaShipmentWaitingforlinerorCFSGlbCtrl.taskObj) {
                ExportSeaShipmentWaitingforlinerorCFSGlbCtrl.ePage.Masters.TaskObj = ExportSeaShipmentWaitingforlinerorCFSGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaShipmentWaitingforlinerorCFSGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
            }
        }

        function GetEntityObj() {
            if (ExportSeaShipmentWaitingforlinerorCFSGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ExportSeaShipmentWaitingforlinerorCFSGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaShipmentWaitingforlinerorCFSGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();