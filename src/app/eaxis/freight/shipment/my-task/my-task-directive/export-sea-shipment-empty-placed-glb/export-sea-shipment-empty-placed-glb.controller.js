/*
    Page : Empty Placed
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("exportSeaShipmentEmptyPlacedGlbController", ExportSeaShipmentEmptyPlacedGlbController);

    ExportSeaShipmentEmptyPlacedGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig","APP_CONSTANT","errorWarningService"];

    function ExportSeaShipmentEmptyPlacedGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig,APP_CONSTANT,errorWarningService) {
        
        var ExportSeaShipmentEmptyPlacedGlbCtrl = this;

        function Init() {
            ExportSeaShipmentEmptyPlacedGlbCtrl.ePage = {
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
            ExportSeaShipmentEmptyPlacedGlbCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ExportSeaShipmentEmptyPlacedGlbCtrl.ePage.Masters.emptyText = "-";
             // DatePicker
             ExportSeaShipmentEmptyPlacedGlbCtrl.ePage.Masters.DatePicker = {};
             ExportSeaShipmentEmptyPlacedGlbCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
             ExportSeaShipmentEmptyPlacedGlbCtrl.ePage.Masters.DatePicker.isOpen = [];
             ExportSeaShipmentEmptyPlacedGlbCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
             ExportSeaShipmentEmptyPlacedGlbCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            if (ExportSeaShipmentEmptyPlacedGlbCtrl.taskObj) {
                ExportSeaShipmentEmptyPlacedGlbCtrl.ePage.Masters.TaskObj = ExportSeaShipmentEmptyPlacedGlbCtrl.taskObj;
                GetEntityObj();
            } else {
//                 ExportSeaShipmentEmptyPlacedGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.TaskObj];
//                 ExportSeaShipmentEmptyPlacedGlbCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Shipment.label];
            }
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
                EntityObject: ExportSeaShipmentEmptyPlacedGlbCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            ExportSeaShipmentEmptyPlacedGlbCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        function GetEntityObj() {
            if (ExportSeaShipmentEmptyPlacedGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ExportSeaShipmentEmptyPlacedGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaShipmentEmptyPlacedGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }
        

        Init();
    }
})();