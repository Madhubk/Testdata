(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AcknowledgeCsrController", AcknowledgeCsrController);

    AcknowledgeCsrController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "deliveryConfig"];

    function AcknowledgeCsrController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, deliveryConfig) {
        var AcknowledgeCsrCtrl = this;

        function Init() {
            AcknowledgeCsrCtrl.ePage = {
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
            AcknowledgeCsrCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            AcknowledgeCsrCtrl.ePage.Masters.emptyText = "-";
            if (AcknowledgeCsrCtrl.taskObj) {
                AcknowledgeCsrCtrl.ePage.Masters.TaskObj = AcknowledgeCsrCtrl.taskObj;
                GetEntityObj();
            } else {
                AcknowledgeCsrCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data;                
                GeneralOperation();
                GetDynamicLookupConfig();
                if (errorWarningService.Modules.MyTask)
                    AcknowledgeCsrCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Delivery.label];
            }

            AcknowledgeCsrCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            AcknowledgeCsrCtrl.ePage.Masters.DatePicker = {};
            AcknowledgeCsrCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            AcknowledgeCsrCtrl.ePage.Masters.DatePicker.isOpen = [];
            AcknowledgeCsrCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function GeneralOperation() {
            // Client
            if (AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode == null)
                AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode = "";
            if (AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientName == null)
                AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientName = "";
            AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Client = AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode + ' - ' + AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientName;
            if (AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Client == " - ")
                AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Client = "";
            // Consignee
            if (AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeCode == null)
                AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeCode = "";
            if (AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeName == null)
                AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeName = "";
            AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Consignee = AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeCode + ' - ' + AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeName;
            if (AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Consignee == " - ")
                AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Consignee = "";
            // Warehouse
            if (AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode == null)
                AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode = "";
            if (AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseName == null)
                AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseName = "";
            AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Warehouse = AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode + ' - ' + AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseName;
            if (AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Warehouse == " - ")
                AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Warehouse = "";
        }

        function GetDynamicLookupConfig() {
            // Get DataEntryNameList 
            var _filter = {
                pageName: 'DeliveryRequest'
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
                Code: [myTaskActivityConfig.Entities.Delivery.label],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "WMS",
                    SubModuleCode: "DEL",
                    // Code: "E0013"
                },
                EntityObject: AcknowledgeCsrCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            AcknowledgeCsrCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (AcknowledgeCsrCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + AcknowledgeCsrCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        AcknowledgeCsrCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();