/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("StartPutawayController", StartPutawayController);

    StartPutawayController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService"];

    function StartPutawayController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService) {
        var StartPutawayCtrl = this;

        function Init() {
            StartPutawayCtrl.ePage = {
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
            StartPutawayCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            StartPutawayCtrl.ePage.Masters.emptyText = "-";
            if (StartPutawayCtrl.taskObj) {
                StartPutawayCtrl.ePage.Masters.TaskObj = StartPutawayCtrl.taskObj;
                GetEntityObj();
            } else {
                StartPutawayCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Inward[myTaskActivityConfig.Entities.Inward.label].ePage.Entities.Header.Data;
                if (errorWarningService.Modules.MyTask)
                    StartPutawayCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Inward.label];
            }

            StartPutawayCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            StartPutawayCtrl.ePage.Masters.DatePicker = {};
            StartPutawayCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            StartPutawayCtrl.ePage.Masters.DatePicker.isOpen = [];
            StartPutawayCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
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
                EntityObject: StartPutawayCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            StartPutawayCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (StartPutawayCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.InwardList.API.GetById.Url + StartPutawayCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        StartPutawayCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();