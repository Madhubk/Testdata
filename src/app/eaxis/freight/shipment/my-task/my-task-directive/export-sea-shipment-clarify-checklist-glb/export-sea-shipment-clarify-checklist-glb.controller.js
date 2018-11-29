/*
    Page : Shipping Bill Filling
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaShipmentClarifyChecklistGlbController", ExportSeaShipmentClarifyChecklistGlbController);

    ExportSeaShipmentClarifyChecklistGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig","APP_CONSTANT","errorWarningService"];

    function ExportSeaShipmentClarifyChecklistGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig,APP_CONSTANT,errorWarningService) {
        
        var ExportSeaShipmentClarifyChecklistGlbCtrl = this;

        function Init() {
            ExportSeaShipmentClarifyChecklistGlbCtrl.ePage = {
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
            ExportSeaShipmentClarifyChecklistGlbCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ExportSeaShipmentClarifyChecklistGlbCtrl.ePage.Masters.emptyText = "-";
             // DatePicker
             ExportSeaShipmentClarifyChecklistGlbCtrl.ePage.Masters.DatePicker = {};
             ExportSeaShipmentClarifyChecklistGlbCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
             ExportSeaShipmentClarifyChecklistGlbCtrl.ePage.Masters.DatePicker.isOpen = [];
             ExportSeaShipmentClarifyChecklistGlbCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
             ExportSeaShipmentClarifyChecklistGlbCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            if (ExportSeaShipmentClarifyChecklistGlbCtrl.taskObj) {
                ExportSeaShipmentClarifyChecklistGlbCtrl.ePage.Masters.TaskObj = ExportSeaShipmentClarifyChecklistGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaShipmentClarifyChecklistGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                ExportSeaShipmentClarifyChecklistGlbCtrl.ePage.Entities.Header.Data.UIShpExtendedInfo.IsShippingBillClarifyRequired=false;
                ExportSeaShipmentClarifyChecklistGlbCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Shipment.label];
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
                EntityObject: ExportSeaShipmentClarifyChecklistGlbCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            ExportSeaShipmentClarifyChecklistGlbCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        function GetEntityObj() {
            if (ExportSeaShipmentClarifyChecklistGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ExportSeaShipmentClarifyChecklistGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaShipmentClarifyChecklistGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }
        

        Init();
    }
})();