(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ReceiveMaterialController", ReceiveMaterialController);

    ReceiveMaterialController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "inwardConfig", "dynamicLookupConfig"];

    function ReceiveMaterialController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, inwardConfig, dynamicLookupConfig) {
        var ReceiveMaterialCtrl = this;

        function Init() {
            ReceiveMaterialCtrl.ePage = {
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
            ReceiveMaterialCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ReceiveMaterialCtrl.ePage.Masters.emptyText = "-";
            if (ReceiveMaterialCtrl.taskObj) {
                ReceiveMaterialCtrl.ePage.Masters.TaskObj = ReceiveMaterialCtrl.taskObj;
                GetEntityObj();
            } else {
                ReceiveMaterialCtrl.ePage.Masters.Config = myTaskActivityConfig;
                ReceiveMaterialCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Inward[myTaskActivityConfig.Entities.Inward.label].ePage.Entities.Header.Data;
                inwardConfig.ValidationFindall();
                GetDynamicLookupConfig();
                if (errorWarningService.Modules.MyTask)
                    ReceiveMaterialCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Inward.label];
            }

            ReceiveMaterialCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            ReceiveMaterialCtrl.ePage.Masters.DatePicker = {};
            ReceiveMaterialCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ReceiveMaterialCtrl.ePage.Masters.DatePicker.isOpen = [];
            ReceiveMaterialCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function GetDynamicLookupConfig() {
            // Get DataEntryNameList 
            var _filter = {
                pageName: 'WarehouseInward'
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);

                    if (!_isEmpty) {
                        dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response);
                    }
                }
            });
        }

        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: ["MyTask"],
                Code: [myTaskActivityConfig.Entities.Inward.label],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "WMS",
                    SubModuleCode: "DEL",
                    // Code: "E0013"
                },
                EntityObject: ReceiveMaterialCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ReceiveMaterialCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ReceiveMaterialCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.InwardList.API.GetById.Url + ReceiveMaterialCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ReceiveMaterialCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();