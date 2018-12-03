(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TransferMaterialController", TransferMaterialController);

    TransferMaterialController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "dynamicLookupConfig", "outwardConfig"];

    function TransferMaterialController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, dynamicLookupConfig, outwardConfig) {
        var TransferMaterialCtrl = this;

        function Init() {
            TransferMaterialCtrl.ePage = {
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
            TransferMaterialCtrl.ePage.Masters.activeTabIndex = 0;
            TransferMaterialCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            TransferMaterialCtrl.ePage.Masters.emptyText = "-";
            if (TransferMaterialCtrl.taskObj) {
                TransferMaterialCtrl.ePage.Masters.TaskObj = TransferMaterialCtrl.taskObj;
                GetEntityObj();
            } else {
                TransferMaterialCtrl.ePage.Masters.Config = myTaskActivityConfig;
                TransferMaterialCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data;
                GetDynamicLookupConfig();
                getDeliveryList();

                if (errorWarningService.Modules.MyTask)
                    TransferMaterialCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Outward.label];
            }

            TransferMaterialCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            TransferMaterialCtrl.ePage.Masters.DatePicker = {};
            TransferMaterialCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            TransferMaterialCtrl.ePage.Masters.DatePicker.isOpen = [];
            TransferMaterialCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function getDeliveryList() {
            apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + TransferMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WOD_Parent_FK).then(function (response) {
                if (response.data.Response) {
                    TransferMaterialCtrl.ePage.Entities.Header.DeliveryData = response.data.Response;
                    GeneralOperation();
                }
            });
        }

        function GeneralOperation() {
            // Client
            if (TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientCode == null)
                TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientCode = "";
            if (TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientName == null)
                TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientName = "";
            TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Client = TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientCode + ' - ' + TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientName;
            if (TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Client == " - ")
                TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Client = "";
            // Consignee
            if (TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeCode == null)
                TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeCode = "";
            if (TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeName == null)
                TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeName = "";
            TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Consignee = TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeCode + ' - ' + TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeName;
            if (TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Consignee == " - ")
                TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Consignee = "";
            // Warehouse
            if (TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseCode == null)
                TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseCode = "";
            if (TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseName == null)
                TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseName = "";
            TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Warehouse = TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseCode + ' - ' + TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseName;
            if (TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Warehouse == " - ")
                TransferMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Warehouse = "";
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
                Code: [myTaskActivityConfig.Entities.Outward.label],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "WMS",
                    SubModuleCode: "DEL",
                    // Code: "E0013"
                },
                EntityObject: TransferMaterialCtrl.ePage.Entities.Header.DeliveryData,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            TransferMaterialCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (TransferMaterialCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.WmsOutwardList.API.GetById.Url + TransferMaterialCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        TransferMaterialCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();