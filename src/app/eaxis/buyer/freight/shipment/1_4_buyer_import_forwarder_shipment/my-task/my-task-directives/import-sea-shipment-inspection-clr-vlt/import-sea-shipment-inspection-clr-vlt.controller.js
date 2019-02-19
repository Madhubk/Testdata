/*
    Page :Si Filing
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ImportSeaShipmentCustomInspectionVltController", ImportSeaShipmentCustomInspectionVltController);

    ImportSeaShipmentCustomInspectionVltController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService", "errorWarningService"];

    function ImportSeaShipmentCustomInspectionVltController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService, errorWarningService) {
        var ImportSeaShipmentCustomInspectionVltCtrl = this;

        function Init() {
            ImportSeaShipmentCustomInspectionVltCtrl.ePage = {
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

            ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.emptyText = "-";
            if (ImportSeaShipmentCustomInspectionVltCtrl.taskObj) {
                ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskObj = ImportSeaShipmentCustomInspectionVltCtrl.taskObj;
                GetEntityObj();
            } else {
                ImportSeaShipmentCustomInspectionVltCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                var _exports = {
                    "Entities": {
                        "Header": {
                            "Data": ImportSeaShipmentCustomInspectionVltCtrl.ePage.Entities.Header.Data
                        }
                    }
                };
                var obj = {
                    [ImportSeaShipmentCustomInspectionVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo]: {
                        ePage: _exports
                    },
                    label: ImportSeaShipmentCustomInspectionVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    code: ImportSeaShipmentCustomInspectionVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    isNew: false
                };
                ImportSeaShipmentCustomInspectionVltCtrl.currentShipment = obj;
                // ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Consol.label];

            }
            // DatePicker
            ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.DatePicker = {};
            ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.DatePicker.isOpen = [];
            ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.RefNumber = true;

            ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.DropDownMasterList = {};

        }
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.EntityObj = response.data.Response;
                        console.log("Shipment process")
                        console.log(ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.EntityObj)
                    }
                });
            }
        }

        Init();
    }
})();