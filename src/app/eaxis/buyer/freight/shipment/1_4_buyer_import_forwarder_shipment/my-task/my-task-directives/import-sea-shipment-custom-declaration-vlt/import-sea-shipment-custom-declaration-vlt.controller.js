/*
    Page :Si Filing
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ImportSeaShipmentCustomDeclarationVltController", ImportSeaShipmentCustomDeclarationVltController);

    ImportSeaShipmentCustomDeclarationVltController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService", "errorWarningService"];

    function ImportSeaShipmentCustomDeclarationVltController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService, errorWarningService) {
        var ImportSeaShipmentCustomDeclarationVltCtrl = this;

        function Init() {
            ImportSeaShipmentCustomDeclarationVltCtrl.ePage = {
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

            ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.emptyText = "-";
            if (ImportSeaShipmentCustomDeclarationVltCtrl.taskObj) {
                ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj = ImportSeaShipmentCustomDeclarationVltCtrl.taskObj;
                GetEntityObj();
            } else {
                ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                var _exports = {
                    "Entities": {
                        "Header": {
                            "Data": ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Entities.Header.Data
                        }
                    }
                };
                var obj = {
                    [ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo]: {
                        ePage: _exports
                    },
                    label: ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    code: ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    isNew: false
                };
                ImportSeaShipmentCustomDeclarationVltCtrl.currentShipment = obj;
                // ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Consol.label];

            }
            // DatePicker
            ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.DatePicker = {};
            ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.DatePicker.isOpen = [];
            ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.RefNumber = true;

            ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.DropDownMasterList = {};

        }
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.EntityObj = response.data.Response;
                        console.log("Shipment process")
                        console.log(ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.EntityObj)
                    }
                });
            }
        }

        Init();
    }
})();