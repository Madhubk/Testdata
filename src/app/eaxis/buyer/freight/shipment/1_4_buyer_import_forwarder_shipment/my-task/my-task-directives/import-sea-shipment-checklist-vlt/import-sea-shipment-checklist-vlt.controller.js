/*
    Page :Si Filing
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ImportSeaShipmentChecklistVltController", ImportSeaShipmentChecklistVltController);

    ImportSeaShipmentChecklistVltController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService", "errorWarningService"];

    function ImportSeaShipmentChecklistVltController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService, errorWarningService) {
        var ImportSeaShipmentChecklistVltCtrl = this;

        function Init() {
            ImportSeaShipmentChecklistVltCtrl.ePage = {
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

            ImportSeaShipmentChecklistVltCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ImportSeaShipmentChecklistVltCtrl.ePage.Masters.emptyText = "-";
            if (ImportSeaShipmentChecklistVltCtrl.taskObj) {
                ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskObj = ImportSeaShipmentChecklistVltCtrl.taskObj;
                GetEntityObj();
            } else {
                ImportSeaShipmentChecklistVltCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                var _exports = {
                    "Entities": {
                        "Header": {
                            "Data": ImportSeaShipmentChecklistVltCtrl.ePage.Entities.Header.Data
                        }
                    }
                };
                var obj = {
                    [ImportSeaShipmentChecklistVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo]: {
                        ePage: _exports
                    },
                    label: ImportSeaShipmentChecklistVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    code: ImportSeaShipmentChecklistVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    isNew: false
                };
                ImportSeaShipmentChecklistVltCtrl.currentShipment = obj;
                // ImportSeaShipmentChecklistVltCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Consol.label];
            }
            // DatePicker
            ImportSeaShipmentChecklistVltCtrl.ePage.Masters.DatePicker = {};
            ImportSeaShipmentChecklistVltCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ImportSeaShipmentChecklistVltCtrl.ePage.Masters.DatePicker.isOpen = [];
            ImportSeaShipmentChecklistVltCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ImportSeaShipmentChecklistVltCtrl.ePage.Masters.RefNumber = true;

            ImportSeaShipmentChecklistVltCtrl.ePage.Masters.DropDownMasterList = {};
           
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ImportSeaShipmentChecklistVltCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ImportSeaShipmentChecklistVltCtrl.ePage.Masters.EntityObj = response.data.Response;
                        console.log("Forwarders do release")
                        console.log(ImportSeaShipmentChecklistVltCtrl.ePage.Masters.EntityObj)
                    }
                });
            }
        }

        Init();
    }
})();