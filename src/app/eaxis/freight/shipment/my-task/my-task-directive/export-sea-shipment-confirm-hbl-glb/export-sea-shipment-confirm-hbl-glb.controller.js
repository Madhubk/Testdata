/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaShipmentConfirmHBLGlbController", ExportSeaShipmentConfirmHBLGlbController);

    ExportSeaShipmentConfirmHBLGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig"];

    function ExportSeaShipmentConfirmHBLGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig) {
        var ExportSeaShipmentConfirmHBLGlbCtrl = this;

        function Init() {
            ExportSeaShipmentConfirmHBLGlbCtrl.ePage = {
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
            ExportSeaShipmentConfirmHBLGlbCtrl.ePage.Masters.emptyText = "-";
            if (ExportSeaShipmentConfirmHBLGlbCtrl.taskObj) {
                ExportSeaShipmentConfirmHBLGlbCtrl.ePage.Masters.TaskObj = ExportSeaShipmentConfirmHBLGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaShipmentConfirmHBLGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                var _exports = {
                    "Entities": {
                        "Header": {
                            "Data": ExportSeaShipmentConfirmHBLGlbCtrl.ePage.Entities.Header.Data
                        }
                    }
                };
                var obj = {
                    [ExportSeaShipmentConfirmHBLGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo]: {
                        ePage: _exports
                    },
                    label: ExportSeaShipmentConfirmHBLGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    code: ExportSeaShipmentConfirmHBLGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    isNew: false
                };
                ExportSeaShipmentConfirmHBLGlbCtrl.currentShipment = obj;
            }
        }

        function GetEntityObj() {
            if (ExportSeaShipmentConfirmHBLGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ExportSeaShipmentConfirmHBLGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaShipmentConfirmHBLGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                        
                    }
                });
            }
        }

        Init();
    }
})();