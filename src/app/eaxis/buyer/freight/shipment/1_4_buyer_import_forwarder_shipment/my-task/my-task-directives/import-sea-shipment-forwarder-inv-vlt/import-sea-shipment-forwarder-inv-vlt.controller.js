/*
    Page :Si Filing
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ImportSeaShipmentForwarderInvoiceVltController", ImportSeaShipmentForwarderInvoiceVltController);

    ImportSeaShipmentForwarderInvoiceVltController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService", "errorWarningService", "freightApiConfig"];

    function ImportSeaShipmentForwarderInvoiceVltController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService, errorWarningService, freightApiConfig) {
        var ImportSeaShipmentForwarderInvoiceVltCtrl = this;

        function Init() {
            ImportSeaShipmentForwarderInvoiceVltCtrl.ePage = {
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

            ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.emptyText = "-";
            if (ImportSeaShipmentForwarderInvoiceVltCtrl.taskObj) {
                ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskObj = ImportSeaShipmentForwarderInvoiceVltCtrl.taskObj;
                GetEntityObj();
            } else {
                ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                // ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Shipment.label];
            }
            // DatePicker
            ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.DatePicker = {};
            ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.DatePicker.isOpen = [];
            ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.DropDownMasterList = {};
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", freightApiConfig.Entities["1_3"].API.listgetbyid.Url + ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();