/*
    Page :Si Filing
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ImportSeaShipmentChecklistApprovalVltController", ImportSeaShipmentChecklistApprovalVltController);

    ImportSeaShipmentChecklistApprovalVltController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService", "errorWarningService"];

    function ImportSeaShipmentChecklistApprovalVltController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService, errorWarningService) {
        var ImportSeaShipmentChecklistApprovalVltCtrl = this;

        function Init() {
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage = {
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

            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.emptyText = "-";
            if (ImportSeaShipmentChecklistApprovalVltCtrl.taskObj) {
                ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.TaskObj = ImportSeaShipmentChecklistApprovalVltCtrl.taskObj;
                GetEntityObj();
            } else {
                ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                var _exports = {
                    "Entities": {
                        "Header": {
                            "Data": ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Entities.Header.Data
                        }
                    }
                };
                var obj = {
                    [ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo]: {
                        ePage: _exports
                    },
                    label: ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    code: ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    isNew: false
                };
                ImportSeaShipmentChecklistApprovalVltCtrl.currentShipment = obj;
                // ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Consol.label];
            }
            // DatePicker
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.DatePicker = {};
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.DatePicker.isOpen = [];
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.RefNumber = true;

            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.DropDownMasterList = {};

        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.EntityObj = response.data.Response;
                        console.log("Forwarders do release")
                        console.log(ImportSeaShipmentChecklistApprovalVltCtrl.ePage.Masters.EntityObj)
                    }
                });
            }
        }

        Init();
    }
})();