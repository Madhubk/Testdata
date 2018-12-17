(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AcknowledgePickupReqController", AcknowledgePickupReqController);

    AcknowledgePickupReqController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "dynamicLookupConfig", "pickupConfig"];

    function AcknowledgePickupReqController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, dynamicLookupConfig, pickupConfig) {
        var AckPickupReqCtrl = this;

        function Init() {
            AckPickupReqCtrl.ePage = {
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
            AckPickupReqCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            AckPickupReqCtrl.ePage.Masters.emptyText = "-";
            if (AckPickupReqCtrl.taskObj) {
                AckPickupReqCtrl.ePage.Masters.TaskObj = AckPickupReqCtrl.taskObj;
                GetEntityObj();
            } else {
                AckPickupReqCtrl.ePage.Masters.Config = myTaskActivityConfig;
                AckPickupReqCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Pickup[myTaskActivityConfig.Entities.Pickup.label].ePage.Entities.Header.Data;
                GeneralOperation();
                GetDynamicLookupConfig();
                pickupConfig.ValidationFindall();
                if (errorWarningService.Modules.MyTask)
                    AckPickupReqCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Pickup.label];
            }

            AckPickupReqCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            AckPickupReqCtrl.ePage.Masters.DatePicker = {};
            AckPickupReqCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            AckPickupReqCtrl.ePage.Masters.DatePicker.isOpen = [];
            AckPickupReqCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function GeneralOperation() {
            // Client
            if (AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientCode == null)
                AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientCode = "";
            if (AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientName == null)
                AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientName = "";
            AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.Client = AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientCode + ' - ' + AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientName;
            if (AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.Client == " - ")
                AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.Client = "";
            // Consignee
            if (AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeCode == null)
                AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeCode = "";
            if (AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeName == null)
                AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeName = "";
            AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.Consignee = AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeCode + ' - ' + AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeName;
            if (AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.Consignee == " - ")
                AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.Consignee = "";
            // Warehouse
            if (AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseCode == null)
                AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseCode = "";
            if (AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseName == null)
                AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseName = "";
            AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.Warehouse = AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseCode + ' - ' + AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseName;
            if (AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.Warehouse == " - ")
                AckPickupReqCtrl.ePage.Entities.Header.Data.UIWmsPickup.Warehouse = "";
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
                Code: [myTaskActivityConfig.Entities.Pickup.label],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "WMS",
                    SubModuleCode: "PICR",
                    // Code: "E0013"
                },
                EntityObject: AckPickupReqCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            AckPickupReqCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (AckPickupReqCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.WmsPickupList.API.GetById.Url + AckPickupReqCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        AckPickupReqCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();