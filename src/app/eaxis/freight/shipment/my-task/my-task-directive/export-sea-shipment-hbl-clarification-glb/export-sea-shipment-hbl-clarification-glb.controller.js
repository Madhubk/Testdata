/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaShipmentHBLClarificationGlbController", ExportSeaShipmentHBLClarificationGlbController);

    ExportSeaShipmentHBLClarificationGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig"];

    function ExportSeaShipmentHBLClarificationGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig) {
        var ExportSeaShipmentHBLClarificationGlbCtrl = this;

        function Init() {
            ExportSeaShipmentHBLClarificationGlbCtrl.ePage = {
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
            ExportSeaShipmentHBLClarificationGlbCtrl.ePage.Masters.emptyText = "-";
            if (ExportSeaShipmentHBLClarificationGlbCtrl.taskObj) {
                ExportSeaShipmentHBLClarificationGlbCtrl.ePage.Masters.TaskObj = ExportSeaShipmentHBLClarificationGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaShipmentHBLClarificationGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                var _exports = {
                    "Entities": {
                        "Header": {
                            "Data": ExportSeaShipmentHBLClarificationGlbCtrl.ePage.Entities.Header.Data,
                        }
                    }
                };
                var obj = {
                    [ExportSeaShipmentHBLClarificationGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo]: {
                        ePage: _exports
                    },
                    label: ExportSeaShipmentHBLClarificationGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    code: ExportSeaShipmentHBLClarificationGlbCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    isNew: false
                };
                ExportSeaShipmentHBLClarificationGlbCtrl.currentShipment = obj;
                ExportSeaShipmentHBLClarificationGlbCtrl.ePage.Entities.Header.Data.UIShpExtendedInfo.IsHBLClarifyRequired=false;
            }
        }

        function GetEntityObj() {
            if (ExportSeaShipmentHBLClarificationGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ExportSeaShipmentHBLClarificationGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaShipmentHBLClarificationGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();