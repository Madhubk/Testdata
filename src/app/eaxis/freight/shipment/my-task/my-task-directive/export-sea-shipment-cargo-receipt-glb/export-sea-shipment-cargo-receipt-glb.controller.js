/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaShipmentCargoReceiptGlbController", ExportSeaShipmentCargoReceiptGlbController);

    ExportSeaShipmentCargoReceiptGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService"];

    function ExportSeaShipmentCargoReceiptGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService) {
        var ExportSeaShipmentCargoReceiptGlbCtrl = this;

        function Init() {
            ExportSeaShipmentCargoReceiptGlbCtrl.ePage = {
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
            ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.emptyText = "-";

            ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            if (ExportSeaShipmentCargoReceiptGlbCtrl.taskObj) {
                ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj = ExportSeaShipmentCargoReceiptGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Shipment.label];
            }

            // DatePicker
            ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.DatePicker = {};
            ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.DatePicker.isOpen = [];
            ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: ["MyTask"],
                Code: [myTaskActivityConfig.Entities.Shipment.label],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP",
                    // Code: "E0013"
                },
                EntityObject: ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaShipmentCargoReceiptGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();