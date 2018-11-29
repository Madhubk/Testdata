(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliverMaterialController", DeliverMaterialController);

    DeliverMaterialController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "dynamicLookupConfig", "outwardConfig"];

    function DeliverMaterialController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, dynamicLookupConfig, outwardConfig) {
        var DeliverMaterialCtrl = this;

        function Init() {
            DeliverMaterialCtrl.ePage = {
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
            DeliverMaterialCtrl.ePage.Masters.activeTabIndex = 0;
            DeliverMaterialCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            DeliverMaterialCtrl.ePage.Masters.emptyText = "-";
            if (DeliverMaterialCtrl.taskObj) {
                DeliverMaterialCtrl.ePage.Masters.TaskObj = DeliverMaterialCtrl.taskObj;
                GetEntityObj();
            } else {
                if (myTaskActivityConfig.Entities.TaskObj.EntityRefKey) {
                    apiService.get("eAxisAPI", appConfig.Entities.WmsOutwardList.API.GetById.Url + myTaskActivityConfig.Entities.TaskObj.EntityRefKey).then(function (response) {
                        if (response.data.Response) {
                            DeliverMaterialCtrl.ePage.Masters.Outward = response.data.Response;
                            getDeliveryList();
                            outwardConfig.GetTabDetails(response.data.Response.UIWmsOutwardHeader, false).then(function (response) {
                                angular.forEach(response, function (value, key) {
                                    if (value.label == DeliverMaterialCtrl.ePage.Masters.Outward.UIWmsOutwardHeader.WorkOrderID) {
                                        DeliverMaterialCtrl.ePage.Masters.TabList = value;
                                        DeliverMaterialCtrl.ePage.Meta.IsLoading = false;
                                    }
                                });
                            });
                        }
                    });
                }
                // DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData = myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data;
                GetDynamicLookupConfig();

                if (errorWarningService.Modules.MyTask)
                    DeliverMaterialCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Delivery.label];
            }

            DeliverMaterialCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            DeliverMaterialCtrl.ePage.Masters.DatePicker = {};
            DeliverMaterialCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            DeliverMaterialCtrl.ePage.Masters.DatePicker.isOpen = [];
            DeliverMaterialCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function getDeliveryList() {
            apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + DeliverMaterialCtrl.ePage.Masters.Outward.UIWmsOutwardHeader.WOD_Parent_FK).then(function (response) {
                if (response.data.Response) {
                    DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData = response.data.Response;
                    GeneralOperation();
                }
            });
        }

        function GeneralOperation() {
            // Client
            if (DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientCode == null)
                DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientCode = "";
            if (DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientName == null)
                DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientName = "";
            DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Client = DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientCode + ' - ' + DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientName;
            if (DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Client == " - ")
                DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Client = "";
            // Consignee
            if (DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeCode == null)
                DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeCode = "";
            if (DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeName == null)
                DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeName = "";
            DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Consignee = DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeCode + ' - ' + DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeName;
            if (DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Consignee == " - ")
                DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Consignee = "";
            // Warehouse
            if (DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseCode == null)
                DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseCode = "";
            if (DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseName == null)
                DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseName = "";
            DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Warehouse = DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseCode + ' - ' + DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseName;
            if (DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Warehouse == " - ")
                DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Warehouse = "";
        }

        function GetDynamicLookupConfig() {
            // Get DataEntryNameList 
            var _filter = {
                pageName: 'WarehouseOutward'
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
                EntityObject: DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            DeliverMaterialCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (DeliverMaterialCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.WmsOutwardList.API.GetById.Url + DeliverMaterialCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        DeliverMaterialCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();