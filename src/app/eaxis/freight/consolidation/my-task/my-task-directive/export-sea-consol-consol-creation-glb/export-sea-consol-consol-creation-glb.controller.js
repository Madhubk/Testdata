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
        var ExportSeaConsolidationConsolCreationGlbCtrl = this;

        function Init() {
            ExportSeaConsolidationConsolCreationGlbCtrl.ePage = {
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
            ExportSeaConsolidationConsolCreationGlbCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ExportSeaConsolidationConsolCreationGlbCtrl.ePage.Masters.emptyText = "-";
            if (ExportSeaConsolidationConsolCreationGlbCtrl.taskObj) {
                ExportSeaConsolidationConsolCreationGlbCtrl.ePage.Masters.TaskObj = ExportSeaConsolidationConsolCreationGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaConsolidationConsolCreationGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                ExportSeaConsolidationConsolCreationGlbCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Shipment.label];
            }

            ExportSeaConsolidationConsolCreationGlbCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            ExportSeaConsolidationConsolCreationGlbCtrl.ePage.Masters.DatePicker = {};
            ExportSeaConsolidationConsolCreationGlbCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ExportSeaConsolidationConsolCreationGlbCtrl.ePage.Masters.DatePicker.isOpen = [];
            ExportSeaConsolidationConsolCreationGlbCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
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
                EntityObject: ExportSeaConsolidationConsolCreationGlbCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ExportSeaConsolidationConsolCreationGlbCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ExportSeaConsolidationConsolCreationGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ExportSeaConsolidationConsolCreationGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaConsolidationConsolCreationGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();