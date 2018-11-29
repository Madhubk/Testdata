/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConfirmInwardController", ConfirmInwardController);

    ConfirmInwardController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService"];

    function ConfirmInwardController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService) {
        var ConfirmInwardCtrl = this;

        function Init() {
            ConfirmInwardCtrl.ePage = {
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
            ConfirmInwardCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ConfirmInwardCtrl.ePage.Masters.emptyText = "-";
            if (ConfirmInwardCtrl.taskObj) {
                ConfirmInwardCtrl.ePage.Masters.TaskObj = ConfirmInwardCtrl.taskObj;
                GetEntityObj();
            } else {
                ConfirmInwardCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Inward[myTaskActivityConfig.Entities.Inward.label].ePage.Entities.Header.Data;
                if (errorWarningService.Modules.MyTask)
                    ConfirmInwardCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Inward.label];
            }

            ConfirmInwardCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            ConfirmInwardCtrl.ePage.Masters.DatePicker = {};
            ConfirmInwardCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ConfirmInwardCtrl.ePage.Masters.DatePicker.isOpen = [];
            ConfirmInwardCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
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
                EntityObject: ConfirmInwardCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ConfirmInwardCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ConfirmInwardCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.InwardList.API.GetById.Url + ConfirmInwardCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ConfirmInwardCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();