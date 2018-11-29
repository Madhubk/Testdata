/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaShipmentPrepareTaxInvoiceGlbController", ExportSeaShipmentPrepareTaxInvoiceGlbController);

        ExportSeaShipmentPrepareTaxInvoiceGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig"];

    function ExportSeaShipmentPrepareTaxInvoiceGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig) {
        var ExportSeaShipmentPrepareTaxInvoiceGlbCtrl = this;
        function Init() {
            ExportSeaShipmentPrepareTaxInvoiceGlbCtrl.ePage = {
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
            ExportSeaShipmentPrepareTaxInvoiceGlbCtrl.ePage.Masters.emptyText = "-";
            if (ExportSeaShipmentPrepareTaxInvoiceGlbCtrl.taskObj) {
                ExportSeaShipmentPrepareTaxInvoiceGlbCtrl.ePage.Masters.TaskObj = ExportSeaShipmentPrepareTaxInvoiceGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaShipmentPrepareTaxInvoiceGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                
            }
        }

        function GetEntityObj() {
            if (ExportSeaShipmentPrepareTaxInvoiceGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ExportSeaShipmentPrepareTaxInvoiceGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaShipmentPrepareTaxInvoiceGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();