/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ReceiveItemController", ReceiveItemController);

    ReceiveItemController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "inwardConfig", "dynamicLookupConfig"];

    function ReceiveItemController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, inwardConfig, dynamicLookupConfig) {
        var ReceiveItemCtrl = this;

        function Init() {
            ReceiveItemCtrl.ePage = {
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
            ReceiveItemCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ReceiveItemCtrl.ePage.Masters.emptyText = "-";
            if (ReceiveItemCtrl.taskObj) {
                ReceiveItemCtrl.ePage.Masters.TaskObj = ReceiveItemCtrl.taskObj;
                GetEntityObj();
            } else {
                ReceiveItemCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Inward[myTaskActivityConfig.Entities.Inward.label].ePage.Entities.Header.Data;
                inwardConfig.GetTabDetails(ReceiveItemCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader, false).then(function (response) {
                    angular.forEach(response, function (value, key) {
                        if (value.label == ReceiveItemCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderID) {
                            ReceiveItemCtrl.ePage.Masters.TabList = value;
                        }
                    });
                });
                GetDynamicLookupConfig();
                if (errorWarningService.Modules.MyTask)
                    ReceiveItemCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Inward.label];
            }

            ReceiveItemCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            ReceiveItemCtrl.ePage.Masters.DatePicker = {};
            ReceiveItemCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ReceiveItemCtrl.ePage.Masters.DatePicker.isOpen = [];
            ReceiveItemCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
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
                EntityObject: ReceiveItemCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ReceiveItemCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ReceiveItemCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.InwardList.API.GetById.Url + ReceiveItemCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ReceiveItemCtrl.ePage.Masters.EntityObj = response.data.Response;
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