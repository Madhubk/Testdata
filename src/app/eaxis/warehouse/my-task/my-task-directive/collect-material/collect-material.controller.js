(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CollectMaterialController", CollectMaterialController);

    CollectMaterialController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "dynamicLookupConfig", "inwardConfig"];

    function CollectMaterialController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, dynamicLookupConfig, inwardConfig) {
        var CollectMaterialCtrl = this;

        function Init() {
            CollectMaterialCtrl.ePage = {
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
            CollectMaterialCtrl.ePage.Masters.activeTabIndex = 0;
            CollectMaterialCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            CollectMaterialCtrl.ePage.Masters.emptyText = "-";
            if (CollectMaterialCtrl.taskObj) {
                CollectMaterialCtrl.ePage.Masters.TaskObj = CollectMaterialCtrl.taskObj;
                GetEntityObj();
            } else {               
                CollectMaterialCtrl.ePage.Masters.Config = myTaskActivityConfig;
                CollectMaterialCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Inward[myTaskActivityConfig.Entities.Inward.label].ePage.Entities.Header.Data;
                GetDynamicLookupConfig();
                getPickupList();

                if (errorWarningService.Modules.MyTask)
                    CollectMaterialCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Inward.label];
            }

            CollectMaterialCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            CollectMaterialCtrl.ePage.Masters.DatePicker = {};
            CollectMaterialCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            CollectMaterialCtrl.ePage.Masters.DatePicker.isOpen = [];
            CollectMaterialCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function getPickupList() {
            apiService.get("eAxisAPI", appConfig.Entities.WmsPickupList.API.GetById.Url + CollectMaterialCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.AdditionalRef2Fk).then(function (response) {
                if (response.data.Response) {
                    CollectMaterialCtrl.ePage.Entities.Header.PickupData = response.data.Response;
                    myTaskActivityConfig.Entities.PickupData = CollectMaterialCtrl.ePage.Entities.Header.PickupData;
                    GeneralOperation();
                }
            });
        }

        function GeneralOperation() {
            // Client
            if (CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ClientCode == null)
                CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ClientCode = "";
            if (CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ClientName == null)
                CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ClientName = "";
            CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Client = CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ClientCode + ' - ' + CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ClientName;
            if (CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Client == " - ")
                CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Client = "";
            // Consignee
            if (CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ConsigneeCode == null)
                CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ConsigneeCode = "";
            if (CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ConsigneeName == null)
                CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ConsigneeName = "";
            CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Consignee = CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ConsigneeCode + ' - ' + CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ConsigneeName;
            if (CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Consignee == " - ")
                CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Consignee = "";
            // Warehouse
            if (CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.WarehouseCode == null)
                CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.WarehouseCode = "";
            if (CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.WarehouseName == null)
                CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.WarehouseName = "";
            CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Warehouse = CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.WarehouseCode + ' - ' + CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.WarehouseName;
            if (CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Warehouse == " - ")
                CollectMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Warehouse = "";
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
                    SubModuleCode: "PIR",
                    // Code: "E0013"
                },
                EntityObject: CollectMaterialCtrl.ePage.Entities.Header.PickupData,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            CollectMaterialCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (CollectMaterialCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.InwardList.API.GetById.Url + CollectMaterialCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        CollectMaterialCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();