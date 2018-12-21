(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PodReturnController", PodReturnController);

    PodReturnController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "dynamicLookupConfig", "outwardConfig", "$injector"];

    function PodReturnController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, dynamicLookupConfig, outwardConfig, $injector) {
        var PodReturnCtrl = this;
        var Config = $injector.get("pickConfig");

        function Init() {
            PodReturnCtrl.ePage = {
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
            PodReturnCtrl.ePage.Masters.activeTabIndex = 0;
            PodReturnCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            PodReturnCtrl.ePage.Masters.emptyText = "-";
            if (PodReturnCtrl.taskObj) {
                PodReturnCtrl.ePage.Masters.TaskObj = PodReturnCtrl.taskObj;
                GetEntityObj();
            } else {
                PodReturnCtrl.ePage.Masters.Config = myTaskActivityConfig;
                PodReturnCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data;
                GetDynamicLookupConfig();
                outwardConfig.ValidationFindall();
                getDeliveryList();
                if (PodReturnCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Fk)
                    GetManifestDetails();
                if (PodReturnCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WPK_FK)
                    GetPickDetails();
                if (errorWarningService.Modules.MyTask)
                    PodReturnCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Outward.label];
            }

            PodReturnCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            PodReturnCtrl.ePage.Masters.DatePicker = {};
            PodReturnCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            PodReturnCtrl.ePage.Masters.DatePicker.isOpen = [];
            PodReturnCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function GetManifestDetails() {
            apiService.get("eAxisAPI", appConfig.Entities.TmsManifestList.API.GetById.Url + PodReturnCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Fk).then(function (response) {
                if (response.data.Response) {
                    PodReturnCtrl.ePage.Entities.Header.ManifestDetails = response.data.Response;
                    myTaskActivityConfig.Entities.ManifestData = PodReturnCtrl.ePage.Entities.Header.ManifestDetails;
                }
            });
        }

        function GetPickDetails() {
            apiService.get("eAxisAPI", Config.Entities.Header.API.GetByID.Url + PodReturnCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WPK_FK).then(function (response) {
                if (response.data.Response) {
                    PodReturnCtrl.ePage.Entities.Header.PickData = response.data.Response;
                    Config.GetTabDetails(PodReturnCtrl.ePage.Entities.Header.PickData.UIWmsPickHeader, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == PodReturnCtrl.ePage.Entities.Header.PickData.UIWmsPickHeader.PickNo) {
                                PodReturnCtrl.ePage.Masters.TabList = value;
                                myTaskActivityConfig.Entities.PickData = PodReturnCtrl.ePage.Masters.TabList;
                            }
                        });
                    });
                }
            });
        }

        function getDeliveryList() {
            apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + PodReturnCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef2Fk).then(function (response) {
                if (response.data.Response) {
                    PodReturnCtrl.ePage.Entities.Header.DeliveryData = response.data.Response;
                    myTaskActivityConfig.Entities.DeliveryData = PodReturnCtrl.ePage.Entities.Header.DeliveryData;
                    GeneralOperation();
                }
            });
        }

        function GeneralOperation() {
            // Client
            if (PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientCode == null)
                PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientCode = "";
            if (PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientName == null)
                PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientName = "";
            PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Client = PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientCode + ' - ' + PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientName;
            if (PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Client == " - ")
                PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Client = "";
            // Consignee
            if (PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeCode == null)
                PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeCode = "";
            if (PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeName == null)
                PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeName = "";
            PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Consignee = PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeCode + ' - ' + PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeName;
            if (PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Consignee == " - ")
                PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Consignee = "";
            // Warehouse
            if (PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseCode == null)
                PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseCode = "";
            if (PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseName == null)
                PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseName = "";
            PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Warehouse = PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseCode + ' - ' + PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseName;
            if (PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Warehouse == " - ")
                PodReturnCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Warehouse = "";
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
                Code: [myTaskActivityConfig.Entities.Outward.label],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "WMS",
                    SubModuleCode: "DEL",
                    // Code: "E0013"
                },
                EntityObject: PodReturnCtrl.ePage.Entities.Header.DeliveryData,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            PodReturnCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (PodReturnCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.WmsOutwardList.API.GetById.Url + PodReturnCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        PodReturnCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();