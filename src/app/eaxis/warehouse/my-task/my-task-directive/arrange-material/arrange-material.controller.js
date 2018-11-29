(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ArrangeMaterialController", ArrangeMaterialController);

    ArrangeMaterialController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "dynamicLookupConfig", "outwardConfig"];

    function ArrangeMaterialController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, dynamicLookupConfig, outwardConfig) {
        var ArrangeMaterialCtrl = this;

        function Init() {
            ArrangeMaterialCtrl.ePage = {
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
            ArrangeMaterialCtrl.ePage.Masters.activeTabIndex = 0;
            ArrangeMaterialCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ArrangeMaterialCtrl.ePage.Masters.emptyText = "-";
            if (ArrangeMaterialCtrl.taskObj) {
                ArrangeMaterialCtrl.ePage.Masters.TaskObj = ArrangeMaterialCtrl.taskObj;
                GetEntityObj();
            } else {
                if (myTaskActivityConfig.Entities.TaskObj.EntityRefKey) {
                    apiService.get("eAxisAPI", appConfig.Entities.WmsOutwardList.API.GetById.Url + myTaskActivityConfig.Entities.TaskObj.EntityRefKey).then(function (response) {
                        if (response.data.Response) {
                            ArrangeMaterialCtrl.ePage.Masters.Outward = response.data.Response;
                            getDeliveryList();
                            outwardConfig.GetTabDetails(response.data.Response.UIWmsOutwardHeader, false).then(function (response) {
                                angular.forEach(response, function (value, key) {
                                    if (value.label == ArrangeMaterialCtrl.ePage.Masters.Outward.UIWmsOutwardHeader.WorkOrderID) {
                                        ArrangeMaterialCtrl.ePage.Masters.TabList = value;
                                        ArrangeMaterialCtrl.ePage.Meta.IsLoading = false;
                                    }
                                });
                            });
                        }
                    });
                }
                // ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData = myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data;
                GetDynamicLookupConfig();

                if (errorWarningService.Modules.MyTask)
                    ArrangeMaterialCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Delivery.label];
            }

            ArrangeMaterialCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            ArrangeMaterialCtrl.ePage.Masters.DatePicker = {};
            ArrangeMaterialCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ArrangeMaterialCtrl.ePage.Masters.DatePicker.isOpen = [];
            ArrangeMaterialCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function getDeliveryList() {
            apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + ArrangeMaterialCtrl.ePage.Masters.Outward.UIWmsOutwardHeader.WOD_Parent_FK).then(function (response) {
                if (response.data.Response) {
                    ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData = response.data.Response;
                    GeneralOperation();
                }
            });
        }

        function GeneralOperation() {
            // Client
            if (ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientCode == null)
                ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientCode = "";
            if (ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientName == null)
                ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientName = "";
            ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Client = ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientCode + ' - ' + ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientName;
            if (ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Client == " - ")
                ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Client = "";
            // Consignee
            if (ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeCode == null)
                ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeCode = "";
            if (ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeName == null)
                ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeName = "";
            ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Consignee = ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeCode + ' - ' + ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeName;
            if (ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Consignee == " - ")
                ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Consignee = "";
            // Warehouse
            if (ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseCode == null)
                ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseCode = "";
            if (ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseName == null)
                ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseName = "";
            ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Warehouse = ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseCode + ' - ' + ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseName;
            if (ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Warehouse == " - ")
                ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Warehouse = "";
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
                EntityObject: ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ArrangeMaterialCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ArrangeMaterialCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.WmsOutwardList.API.GetById.Url + ArrangeMaterialCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ArrangeMaterialCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();