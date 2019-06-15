/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConfirmArrivalController", ConfirmArrivalController);

    ConfirmArrivalController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "warehouseConfig"];

    function ConfirmArrivalController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, warehouseConfig) {
        var ConfirmArrivalCtrl = this;

        function Init() {
            ConfirmArrivalCtrl.ePage = {
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
            ConfirmArrivalCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ConfirmArrivalCtrl.ePage.Masters.emptyText = "-";
            if (ConfirmArrivalCtrl.taskObj) {
                ConfirmArrivalCtrl.ePage.Masters.TaskObj = ConfirmArrivalCtrl.taskObj;
                GetEntityObj();
            } else {
                ConfirmArrivalCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Inward[myTaskActivityConfig.Entities.Inward.label].ePage.Entities.Header.Data;
                if (errorWarningService.Modules.MyTask)
                    ConfirmArrivalCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Inward.label];
            }

            ConfirmArrivalCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            ConfirmArrivalCtrl.ePage.Masters.DatePicker = {};
            ConfirmArrivalCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ConfirmArrivalCtrl.ePage.Masters.DatePicker.isOpen = [];
            ConfirmArrivalCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: ["MyTask"],
                Code: [myTaskActivityConfig.Entities.Inward.label],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "WMS",
                    SubModuleCode: "INW",
                    // Code: "E0013"
                },
                EntityObject: ConfirmArrivalCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ConfirmArrivalCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ConfirmArrivalCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", warehouseConfig.Entities.WmsInwardList.API.GetById.Url + ConfirmArrivalCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ConfirmArrivalCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();