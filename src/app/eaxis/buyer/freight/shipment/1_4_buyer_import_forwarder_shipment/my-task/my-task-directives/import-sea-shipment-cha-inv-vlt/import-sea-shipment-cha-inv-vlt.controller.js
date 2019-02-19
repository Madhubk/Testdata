/*
    Page :Si Filing
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ImportSeaShipmentChaInvoiceVltController", ImportSeaShipmentChaInvoiceVltController);

    ImportSeaShipmentChaInvoiceVltController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService", "errorWarningService", "freightApiConfig"];

    function ImportSeaShipmentChaInvoiceVltController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService, errorWarningService, freightApiConfig) {
        var ImportSeaShipmentChaInvoiceVltCtrl = this;

        function Init() {
            ImportSeaShipmentChaInvoiceVltCtrl.ePage = {
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

            ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.emptyText = "-";
            if (ImportSeaShipmentChaInvoiceVltCtrl.taskObj) {
                ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskObj = ImportSeaShipmentChaInvoiceVltCtrl.taskObj;
                GetEntityObj();
            } else {
                debugger;
                ImportSeaShipmentChaInvoiceVltCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                // ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Consol.label];
            }
            // DatePicker
            ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.DatePicker = {};
            ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.DatePicker.isOpen = [];
            ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", freightApiConfig.Entities.ConsolList_Forwarder.API.GetByID.Url + ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();