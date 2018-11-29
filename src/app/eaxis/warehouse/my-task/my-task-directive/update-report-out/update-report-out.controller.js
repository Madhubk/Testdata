(function () {
    "use strict";

    angular
        .module("Application")
        .controller("UpdateReportController", UpdateReportController);

    UpdateReportController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "dynamicLookupConfig", "outwardConfig"];

    function UpdateReportController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, dynamicLookupConfig, outwardConfig) {
        var UpdateReportCtrl = this;

        function Init() {
            UpdateReportCtrl.ePage = {
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
            UpdateReportCtrl.ePage.Masters.activeTabIndex = 0;
            UpdateReportCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            UpdateReportCtrl.ePage.Masters.emptyText = "-";
            if (UpdateReportCtrl.taskObj) {
                UpdateReportCtrl.ePage.Masters.TaskObj = UpdateReportCtrl.taskObj;
                GetEntityObj();
            } else {
                if (myTaskActivityConfig.Entities.TaskObj.EntityRefKey) {
                    apiService.get("eAxisAPI", appConfig.Entities.WmsOutwardList.API.GetById.Url + myTaskActivityConfig.Entities.TaskObj.EntityRefKey).then(function (response) {
                        if (response.data.Response) {
                            UpdateReportCtrl.ePage.Masters.Outward = response.data.Response;
                            getDeliveryList();
                            outwardConfig.GetTabDetails(response.data.Response.UIWmsOutwardHeader, false).then(function (response) {
                                angular.forEach(response, function (value, key) {
                                    if (value.label == UpdateReportCtrl.ePage.Masters.Outward.UIWmsOutwardHeader.WorkOrderID) {
                                        UpdateReportCtrl.ePage.Masters.TabList = value;
                                        UpdateReportCtrl.ePage.Meta.IsLoading = false;
                                    }
                                });
                            });
                        }
                    });
                }
                // UpdateReportCtrl.ePage.Entities.Header.DeliveryData = myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data;
                GetDynamicLookupConfig();

                if (errorWarningService.Modules.MyTask)
                    UpdateReportCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Delivery.label];
            }

            UpdateReportCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            UpdateReportCtrl.ePage.Masters.DatePicker = {};
            UpdateReportCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            UpdateReportCtrl.ePage.Masters.DatePicker.isOpen = [];
            UpdateReportCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function getDeliveryList() {
            apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + UpdateReportCtrl.ePage.Masters.Outward.UIWmsOutwardHeader.WOD_Parent_FK).then(function (response) {
                if (response.data.Response) {
                    UpdateReportCtrl.ePage.Entities.Header.DeliveryData = response.data.Response;
                    GeneralOperation();
                }
            });
        }

        function GeneralOperation() {
            // Client
            if (UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientCode == null)
                UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientCode = "";
            if (UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientName == null)
                UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientName = "";
            UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Client = UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientCode + ' - ' + UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientName;
            if (UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Client == " - ")
                UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Client = "";
            // Consignee
            if (UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeCode == null)
                UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeCode = "";
            if (UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeName == null)
                UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeName = "";
            UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Consignee = UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeCode + ' - ' + UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeName;
            if (UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Consignee == " - ")
                UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Consignee = "";
            // Warehouse
            if (UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseCode == null)
                UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseCode = "";
            if (UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseName == null)
                UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseName = "";
            UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Warehouse = UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseCode + ' - ' + UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseName;
            if (UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Warehouse == " - ")
                UpdateReportCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Warehouse = "";
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
                EntityObject: UpdateReportCtrl.ePage.Entities.Header.DeliveryData,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            UpdateReportCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (UpdateReportCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.WmsOutwardList.API.GetById.Url + UpdateReportCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        UpdateReportCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();