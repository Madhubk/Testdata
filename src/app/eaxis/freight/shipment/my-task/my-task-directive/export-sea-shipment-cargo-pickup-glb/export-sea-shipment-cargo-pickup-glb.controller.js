/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaShipmentCargoPickupGlbController", ExportSeaShipmentCargoPickupGlbController);

    ExportSeaShipmentCargoPickupGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService"];

    function ExportSeaShipmentCargoPickupGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService) {
        var ExportSeaShipmentCargoPickupGlbCtrl = this;

        function Init() {
            ExportSeaShipmentCargoPickupGlbCtrl.ePage = {
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
            ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.emptyText = "-";
            if (ExportSeaShipmentCargoPickupGlbCtrl.taskObj) {
                ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj = ExportSeaShipmentCargoPickupGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaShipmentCargoPickupGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Shipment.label];
            }

            ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.DatePicker = {};
            ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.DatePicker.isOpen = [];
            ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
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
                EntityObject: ExportSeaShipmentCargoPickupGlbCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaShipmentCargoPickupGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();