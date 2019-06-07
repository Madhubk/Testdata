/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CompletePutawayController", CompletePutawayController);

    CompletePutawayController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "warehouseConfig"];

    function CompletePutawayController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, warehouseConfig) {
        var CompletePutawayCtrl = this;

        function Init() {
            CompletePutawayCtrl.ePage = {
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
            CompletePutawayCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            CompletePutawayCtrl.ePage.Masters.emptyText = "-";
            if (CompletePutawayCtrl.taskObj) {
                CompletePutawayCtrl.ePage.Masters.TaskObj = CompletePutawayCtrl.taskObj;
                GetEntityObj();
            } else {
                CompletePutawayCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Inward[myTaskActivityConfig.Entities.Inward.label].ePage.Entities.Header.Data;
                if (errorWarningService.Modules.MyTask)
                    CompletePutawayCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Inward.label];
            }

            CompletePutawayCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            CompletePutawayCtrl.ePage.Masters.DatePicker = {};
            CompletePutawayCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            CompletePutawayCtrl.ePage.Masters.DatePicker.isOpen = [];
            CompletePutawayCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
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
                EntityObject: CompletePutawayCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            CompletePutawayCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (CompletePutawayCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", warehouseConfig.Entities.WmsInwardList.API.GetById.Url + CompletePutawayCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        CompletePutawayCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();