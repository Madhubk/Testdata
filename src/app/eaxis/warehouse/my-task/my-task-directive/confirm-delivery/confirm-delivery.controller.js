(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConfirmDeliveryController", ConfirmDeliveryController);

    ConfirmDeliveryController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "dynamicLookupConfig", "outwardConfig", "$injector", "$timeout"];

    function ConfirmDeliveryController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, dynamicLookupConfig, outwardConfig, $injector, $timeout) {
        var ConfirmDeliveryCtrl = this;
        var Config = $injector.get("releaseConfig");

        function Init() {
            ConfirmDeliveryCtrl.ePage = {
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
            ConfirmDeliveryCtrl.ePage.Masters.activeTabIndex = 0;
            ConfirmDeliveryCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ConfirmDeliveryCtrl.ePage.Masters.emptyText = "-";
            if (ConfirmDeliveryCtrl.taskObj) {
                ConfirmDeliveryCtrl.ePage.Masters.TaskObj = ConfirmDeliveryCtrl.taskObj;
                GetEntityObj();
            } else {
                ConfirmDeliveryCtrl.ePage.Masters.Config = myTaskActivityConfig;
                ConfirmDeliveryCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data;
                GetDynamicLookupConfig();
                getDeliveryList();
                outwardConfig.ValidationFindall();
                if (ConfirmDeliveryCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Fk)
                    GetManifestDetails();
                if (ConfirmDeliveryCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WPK_FK)
                    GetPickDetails();
                if (errorWarningService.Modules.MyTask)
                    ConfirmDeliveryCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Outward.label];
            }

            ConfirmDeliveryCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            ConfirmDeliveryCtrl.ePage.Masters.DatePicker = {};
            ConfirmDeliveryCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ConfirmDeliveryCtrl.ePage.Masters.DatePicker.isOpen = [];
            ConfirmDeliveryCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ConfirmDeliveryCtrl.ePage.Masters.ReloadOutwardDetails = ReloadOutwardDetails;
        }

        function ReloadOutwardDetails() {
            if (!ConfirmDeliveryCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.FinalisedDate) {
                $timeout(function () {
                    apiService.get("eAxisAPI", appConfig.Entities.WmsOutwardList.API.GetById.Url + ConfirmDeliveryCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PK).then(function (response) {
                        if (response.data.Response) {
                            response.data.Response.UIWmsOutwardHeader.Client = response.data.Response.UIWmsOutwardHeader.ClientCode + "-" + response.data.Response.UIWmsOutwardHeader.ClientName;
                            response.data.Response.UIWmsOutwardHeader.Warehouse = response.data.Response.UIWmsOutwardHeader.WarehouseCode + "-" + response.data.Response.UIWmsOutwardHeader.WarehouseName;
                            response.data.Response.UIWmsOutwardHeader.Consignee = response.data.Response.UIWmsOutwardHeader.ConsigneeCode + "-" + response.data.Response.UIWmsOutwardHeader.ConsigneeName;
                            myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data = response.data.Response;
                            myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.GlobalVariables.NonEditable = true;
                            ConfirmDeliveryCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data;
                        }
                    });
                }, 8000);
            }
        }

        function GetManifestDetails() {
            apiService.get("eAxisAPI", appConfig.Entities.TmsManifestList.API.GetById.Url + ConfirmDeliveryCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Fk).then(function (response) {
                if (response.data.Response) {
                    ConfirmDeliveryCtrl.ePage.Entities.Header.ManifestDetails = response.data.Response;
                    myTaskActivityConfig.Entities.ManifestData = ConfirmDeliveryCtrl.ePage.Entities.Header.ManifestDetails;
                }
            });
        }

        function GetPickDetails() {
            apiService.get("eAxisAPI", Config.Entities.Header.API.GetByID.Url + ConfirmDeliveryCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WPK_FK).then(function (response) {
                if (response.data.Response) {
                    ConfirmDeliveryCtrl.ePage.Entities.Header.PickData = response.data.Response;
                    myTaskActivityConfig.Entities.PickData = ConfirmDeliveryCtrl.ePage.Entities.Header.PickData;
                    Config.GetTabDetails(ConfirmDeliveryCtrl.ePage.Entities.Header.PickData.UIWmsPickHeader, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == ConfirmDeliveryCtrl.ePage.Entities.Header.PickData.UIWmsPickHeader.PickNo) {
                                ConfirmDeliveryCtrl.ePage.Masters.TabList = value;
                            }
                        });
                    });
                }
            });
        }

        function getDeliveryList() {
            apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + ConfirmDeliveryCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef2Fk).then(function (response) {
                if (response.data.Response) {
                    ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData = response.data.Response;
                    GeneralOperation();
                }
            });
        }

        function GeneralOperation() {
            // Client
            if (ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientCode == null)
                ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientCode = "";
            if (ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientName == null)
                ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientName = "";
            ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Client = ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientCode + ' - ' + ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientName;
            if (ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Client == " - ")
                ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Client = "";
            // Consignee
            if (ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeCode == null)
                ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeCode = "";
            if (ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeName == null)
                ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeName = "";
            ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Consignee = ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeCode + ' - ' + ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeName;
            if (ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Consignee == " - ")
                ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Consignee = "";
            // Warehouse
            if (ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseCode == null)
                ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseCode = "";
            if (ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseName == null)
                ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseName = "";
            ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Warehouse = ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseCode + ' - ' + ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseName;
            if (ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Warehouse == " - ")
                ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Warehouse = "";
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
                EntityObject: ConfirmDeliveryCtrl.ePage.Entities.Header.DeliveryData,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ConfirmDeliveryCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ConfirmDeliveryCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.WmsOutwardList.API.GetById.Url + ConfirmDeliveryCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ConfirmDeliveryCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();