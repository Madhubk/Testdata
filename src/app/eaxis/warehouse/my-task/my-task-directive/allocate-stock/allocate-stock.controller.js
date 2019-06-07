
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AllocateStockController", AllocateStockController);

    AllocateStockController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "pickConfig", "dynamicLookupConfig", "warehouseConfig"];

    function AllocateStockController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, pickConfig, dynamicLookupConfig, warehouseConfig) {
        var AllocateStockCtrl = this;

        function Init() {
            AllocateStockCtrl.ePage = {
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
            AllocateStockCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            AllocateStockCtrl.ePage.Masters.emptyText = "-";
            if (AllocateStockCtrl.taskObj) {
                AllocateStockCtrl.ePage.Masters.TaskObj = AllocateStockCtrl.taskObj;
                GetEntityObj();
            } else {
                AllocateStockCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Pick[myTaskActivityConfig.Entities.Pick.label].ePage.Entities.Header.Data;
                pickConfig.GetTabDetails(AllocateStockCtrl.ePage.Entities.Header.Data.UIWmsPickHeader, false).then(function (response) {
                    angular.forEach(response, function (value, key) {
                        if (value.label == AllocateStockCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickNo) {
                            AllocateStockCtrl.ePage.Masters.TabList = value;
                        }
                    });
                });
                GetDynamicLookupConfig();
                if (errorWarningService.Modules.MyTask)
                    AllocateStockCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Pick.label];
            }

            AllocateStockCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            AllocateStockCtrl.ePage.Masters.DatePicker = {};
            AllocateStockCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            AllocateStockCtrl.ePage.Masters.DatePicker.isOpen = [];
            AllocateStockCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: ["MyTask"],
                Code: [myTaskActivityConfig.Entities.Pick.label],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "WMS",
                    SubModuleCode: "WPK",
                    // Code: "E0013"
                },
                EntityObject: AllocateStockCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            AllocateStockCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (AllocateStockCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", warehouseConfig.Entities.WmsPickList.API.GetById.Url + AllocateStockCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        AllocateStockCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
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

        Init();
    }
})();