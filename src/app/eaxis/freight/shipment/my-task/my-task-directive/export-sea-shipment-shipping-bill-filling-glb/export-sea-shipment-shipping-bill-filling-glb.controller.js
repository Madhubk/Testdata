/*
    Page : Shipping Bill Filling
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExportSeaShipmentShippingBillFillingGlbController", ExportSeaShipmentShippingBillFillingGlbController);

    ExportSeaShipmentShippingBillFillingGlbController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig","APP_CONSTANT","errorWarningService"];

    function ExportSeaShipmentShippingBillFillingGlbController($scope, apiService, helperService, appConfig, myTaskActivityConfig,APP_CONSTANT,errorWarningService) {
        
        var ExportSeaShipmentShippingBillFillingGlbCtrl = this;

        function Init() {
            ExportSeaShipmentShippingBillFillingGlbCtrl.ePage = {
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
            ExportSeaShipmentShippingBillFillingGlbCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ExportSeaShipmentShippingBillFillingGlbCtrl.ePage.Masters.emptyText = "-";
             // DatePicker
             ExportSeaShipmentShippingBillFillingGlbCtrl.ePage.Masters.DatePicker = {};
             ExportSeaShipmentShippingBillFillingGlbCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
             ExportSeaShipmentShippingBillFillingGlbCtrl.ePage.Masters.DatePicker.isOpen = [];
             ExportSeaShipmentShippingBillFillingGlbCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
             ExportSeaShipmentShippingBillFillingGlbCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            if (ExportSeaShipmentShippingBillFillingGlbCtrl.taskObj) {
                ExportSeaShipmentShippingBillFillingGlbCtrl.ePage.Masters.TaskObj = ExportSeaShipmentShippingBillFillingGlbCtrl.taskObj;
                GetEntityObj();
            } else {
                ExportSeaShipmentShippingBillFillingGlbCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                ExportSeaShipmentShippingBillFillingGlbCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Shipment.label];
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
                EntityObject: ExportSeaShipmentShippingBillFillingGlbCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            ExportSeaShipmentShippingBillFillingGlbCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        function GetEntityObj() {
            if (ExportSeaShipmentShippingBillFillingGlbCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ExportSeaShipmentShippingBillFillingGlbCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExportSeaShipmentShippingBillFillingGlbCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }
        

        Init();
    }
})();