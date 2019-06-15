/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AllocateLocationController", AllocateLocationController);

    AllocateLocationController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "inwardConfig", "dynamicLookupConfig", "warehouseConfig"];

    function AllocateLocationController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, inwardConfig, dynamicLookupConfig, warehouseConfig) {
        var AllocateLocationCtrl = this;

        function Init() {
            AllocateLocationCtrl.ePage = {
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
            AllocateLocationCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            AllocateLocationCtrl.ePage.Masters.emptyText = "-";
            if (AllocateLocationCtrl.taskObj) {
                AllocateLocationCtrl.ePage.Masters.TaskObj = AllocateLocationCtrl.taskObj;
                GetEntityObj();
            } else {
                AllocateLocationCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Inward[myTaskActivityConfig.Entities.Inward.label].ePage.Entities.Header.Data;
                inwardConfig.GetTabDetails(AllocateLocationCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader, false).then(function (response) {
                    angular.forEach(response, function (value, key) {
                        if (value.label == AllocateLocationCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderID) {
                            AllocateLocationCtrl.ePage.Masters.TabList = value;
                        }
                    });
                });
                GetDynamicLookupConfig();
                if (errorWarningService.Modules.MyTask)
                    AllocateLocationCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Inward.label];
            }

            AllocateLocationCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            AllocateLocationCtrl.ePage.Masters.DatePicker = {};
            AllocateLocationCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            AllocateLocationCtrl.ePage.Masters.DatePicker.isOpen = [];
            AllocateLocationCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
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
                EntityObject: AllocateLocationCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            AllocateLocationCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (AllocateLocationCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", warehouseConfig.Entities.WmsInwardList.API.GetById.Url + AllocateLocationCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        AllocateLocationCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        function GetDynamicLookupConfig() {
            // Get DataEntryNameList 
            var _filter = {
                pageName: 'WarehousePick'
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

        Init();
    }
})();