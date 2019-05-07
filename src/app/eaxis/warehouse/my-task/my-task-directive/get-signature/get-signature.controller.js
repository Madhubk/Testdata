(function () {
    "use strict";

    angular
        .module("Application")
        .controller("GetSignatureController", GetSignatureController);

    GetSignatureController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "dynamicLookupConfig", "inwardConfig"];

    function GetSignatureController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, dynamicLookupConfig, inwardConfig) {
        var GetSignatureCtrl = this;

        function Init() {
            GetSignatureCtrl.ePage = {
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
            GetSignatureCtrl.ePage.Masters.activeTabIndex = 0;
            GetSignatureCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            GetSignatureCtrl.ePage.Masters.emptyText = "-";
            if (GetSignatureCtrl.taskObj) {
                GetSignatureCtrl.ePage.Masters.TaskObj = GetSignatureCtrl.taskObj;
                GetEntityObj();
            } else {
                GetSignatureCtrl.ePage.Masters.Config = myTaskActivityConfig;
                GetSignatureCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Inward[myTaskActivityConfig.Entities.Inward.label].ePage.Entities.Header.Data;
                GetDynamicLookupConfig();
                getPickupList();
                inwardConfig.ValidationFindall();
                if (errorWarningService.Modules.MyTask)
                    GetSignatureCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Inward.label];
            }

            GetSignatureCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            GetSignatureCtrl.ePage.Masters.DatePicker = {};
            GetSignatureCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            GetSignatureCtrl.ePage.Masters.DatePicker.isOpen = [];
            GetSignatureCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function getPickupList() {
            apiService.get("eAxisAPI", appConfig.Entities.WmsPickupList.API.GetById.Url + GetSignatureCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.AdditionalRef2Fk).then(function (response) {
                if (response.data.Response) {
                    GetSignatureCtrl.ePage.Entities.Header.PickupData = response.data.Response;
                    myTaskActivityConfig.Entities.PickupData = GetSignatureCtrl.ePage.Entities.Header.PickupData;
                    GeneralOperation();
                }
            });
        }

        function GeneralOperation() {
            // Client
            if (GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ClientCode == null)
                GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ClientCode = "";
            if (GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ClientName == null)
                GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ClientName = "";
            GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Client = GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ClientCode + ' - ' + GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ClientName;
            if (GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Client == " - ")
                GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Client = "";
            // Consignee
            if (GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ConsigneeCode == null)
                GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ConsigneeCode = "";
            if (GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ConsigneeName == null)
                GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ConsigneeName = "";
            GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Consignee = GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ConsigneeCode + ' - ' + GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ConsigneeName;
            if (GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Consignee == " - ")
                GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Consignee = "";
            // Warehouse
            if (GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.WarehouseCode == null)
                GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.WarehouseCode = "";
            if (GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.WarehouseName == null)
                GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.WarehouseName = "";
            GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Warehouse = GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.WarehouseCode + ' - ' + GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.WarehouseName;
            if (GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Warehouse == " - ")
                GetSignatureCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Warehouse = "";
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
                EntityObject: GetSignatureCtrl.ePage.Entities.Header.PickupData,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            GetSignatureCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (GetSignatureCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.InwardList.API.GetById.Url + GetSignatureCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        GetSignatureCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();