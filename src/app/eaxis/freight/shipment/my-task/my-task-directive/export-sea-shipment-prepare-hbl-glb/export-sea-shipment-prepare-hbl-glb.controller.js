/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaShipmentPrepareHBLGlbController", ExportSeaShipmentPrepareHBLGlbController);

    ExportSeaShipmentPrepareHBLGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig"];

    function ExportSeaShipmentPrepareHBLGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig) {
        var ExportSeaShipmentPrepareHBLGlbCtrl = this;

        function Init() {
            ExportSeaShipmentPrepareHBLGlbCtrl.ePage = {
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
            ExportSeaShipmentPrepareHBLGlbCtrl.ePage.Masters.emptyText = "-";
            if (ExportSeaShipmentPrepareHBLGlbCtrl.taskObj) {
                ExportSeaShipmentPrepareHBLGlbCtrl.ePage.Masters.TaskObj = ExportSeaShipmentPrepareHBLGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaShipmentPrepareHBLGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                var _exports = {
                    "Entities": {
                        "Header": {
                            "Data": ExportSeaShipmentPrepareHBLGlbCtrl.ePage.Entities.Header.Data
                        }
                    }
                };
                var obj = {
                    [ExportSeaShipmentPrepareHBLGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo]: {
                        ePage: _exports
                    },
                    label: ExportSeaShipmentPrepareHBLGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    code: ExportSeaShipmentPrepareHBLGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    isNew: false
                };
                ExportSeaShipmentPrepareHBLGlbCtrl.currentShipment = obj; 
            }
        }

        function GetEntityObj() {
            if (ExportSeaShipmentPrepareHBLGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ExportSeaShipmentPrepareHBLGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaShipmentPrepareHBLGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();