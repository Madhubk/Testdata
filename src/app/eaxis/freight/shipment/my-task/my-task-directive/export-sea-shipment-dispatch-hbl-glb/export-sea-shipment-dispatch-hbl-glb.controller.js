/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaShipmentDispatchHBLGlbController", ExportSeaShipmentDispatchHBLGlbController);

    ExportSeaShipmentDispatchHBLGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig"];

    function ExportSeaShipmentDispatchHBLGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig) {
        var ExportSeaShipmentDispatchHBLGlbCtrl = this;

        function Init() {
            ExportSeaShipmentDispatchHBLGlbCtrl.ePage = {
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
            ExportSeaShipmentDispatchHBLGlbCtrl.ePage.Masters.emptyText = "-";
            if (ExportSeaShipmentDispatchHBLGlbCtrl.taskObj) {
                ExportSeaShipmentDispatchHBLGlbCtrl.ePage.Masters.TaskObj = ExportSeaShipmentDispatchHBLGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaShipmentDispatchHBLGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                var _exports = {
                    "Entities": {
                        "Header": {
                            "Data": ExportSeaShipmentDispatchHBLGlbCtrl.ePage.Entities.Header.Data
                        }
                    }
                };
                var obj = {
                    [ExportSeaShipmentDispatchHBLGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo]: {
                        ePage: _exports
                    },
                    label: ExportSeaShipmentDispatchHBLGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    code: ExportSeaShipmentDispatchHBLGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    isNew: false
                };
                ExportSeaShipmentDispatchHBLGlbCtrl.currentShipment = obj;
            }
        }

        function GetEntityObj() {
            if (ExportSeaShipmentDispatchHBLGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ExportSeaShipmentDispatchHBLGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaShipmentDispatchHBLGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();