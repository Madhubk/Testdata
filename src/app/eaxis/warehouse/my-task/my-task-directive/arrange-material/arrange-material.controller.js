(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ArrangeMaterialController", ArrangeMaterialController);

    ArrangeMaterialController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "dynamicLookupConfig", "outwardConfig", "$injector", "toastr"];

    function ArrangeMaterialController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, dynamicLookupConfig, outwardConfig, $injector, toastr) {
        var ArrangeMaterialCtrl = this;
        var Config = $injector.get("pickConfig");

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
                ArrangeMaterialCtrl.ePage.Masters.Config = myTaskActivityConfig;
                ArrangeMaterialCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data;
                if (ArrangeMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PickNo) {
                    GetPickDetails();
                }
                outwardConfig.ValidationFindall();
                GetDynamicLookupConfig();
                getDeliveryList();

                if (errorWarningService.Modules.MyTask)
                    ArrangeMaterialCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Outward.label];
            }

            ArrangeMaterialCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            ArrangeMaterialCtrl.ePage.Masters.DatePicker = {};
            ArrangeMaterialCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ArrangeMaterialCtrl.ePage.Masters.DatePicker.isOpen = [];
            ArrangeMaterialCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ArrangeMaterialCtrl.ePage.Masters.CreatePick = CreatePick;
            ArrangeMaterialCtrl.ePage.Masters.CreatePickText = "Create Pick";
            ArrangeMaterialCtrl.ePage.Masters.IsDisabled = false;
            ArrangeMaterialCtrl.ePage.Masters.Empty = "-";
        }

        function GetPickDetails() {
            apiService.get("eAxisAPI", Config.Entities.Header.API.GetByID.Url + ArrangeMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WPK_FK).then(function (response) {
                if (response.data.Response) {
                    ArrangeMaterialCtrl.ePage.Entities.Header.PickData = response.data.Response;
                    Config.GetTabDetails(ArrangeMaterialCtrl.ePage.Entities.Header.PickData.UIWmsPickHeader, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == ArrangeMaterialCtrl.ePage.Entities.Header.PickData.UIWmsPickHeader.PickNo) {
                                ArrangeMaterialCtrl.ePage.Masters.TabList = value;
                            }
                        });
                    });
                }
            });
        }

        function CreatePick() {
            ArrangeMaterialCtrl.ePage.Masters.LoadingValue = "Creating Pick..";
            ArrangeMaterialCtrl.ePage.Masters.IsDisabled = true;
            ArrangeMaterialCtrl.ePage.Masters.CreatePickText = "Please Wait...";
            helperService.getFullObjectUsingGetById(Config.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {

                    response.data.Response.Response.UIWmsPickHeader.PK = response.data.Response.Response.PK;
                    if (ArrangeMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PickOption) {
                        response.data.Response.Response.UIWmsPickHeader.PickOption = ArrangeMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PickOption;
                    } else {
                        response.data.Response.Response.UIWmsPickHeader.PickOption = "AUT";
                    }
                    response.data.Response.Response.UIWmsPickHeader.WarehouseCode = ArrangeMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseCode;
                    response.data.Response.Response.UIWmsPickHeader.WarehouseName = ArrangeMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseName;
                    response.data.Response.Response.UIWmsPickHeader.WAR_FK = ArrangeMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WAR_FK;
                    ArrangeMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PickNo = response.data.Response.Response.PickNo
                    ArrangeMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WPK_FK = response.data.Response.Response.PK;
                    ArrangeMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PickNo = response.data.Response.Response.UIWmsPickHeader.PickNo
                    ArrangeMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PutOrPickStartDateTime = new Date();
                    ArrangeMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderStatus = "OSP";
                    ArrangeMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderStatusDesc = "Pick Started";
                    ArrangeMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.IsModified = true;
                    response.data.Response.Response.UIWmsOutward.push(ArrangeMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader);

                    apiService.post("eAxisAPI", Config.Entities.Header.API.InsertPick.Url, response.data.Response.Response).then(function (response) {
                        if (response.data.Status == 'Success') {
                            ArrangeMaterialCtrl.ePage.Masters.PickDetails = response.data.Response;
                            ArrangeMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PickNo = response.data.Response.UIWmsPickHeader.PickNo;
                            Config.GetTabDetails(ArrangeMaterialCtrl.ePage.Masters.PickDetails.UIWmsPickHeader, false).then(function (response) {
                                angular.forEach(response, function (value, key) {
                                    if (value.label == ArrangeMaterialCtrl.ePage.Masters.PickDetails.UIWmsPickHeader.PickNo) {
                                        ArrangeMaterialCtrl.ePage.Masters.TabList = value;
                                        ArrangeMaterialCtrl.ePage.Masters.LoadingValue = "";
                                        ArrangeMaterialCtrl.ePage.Masters.CreatePickText = "Create Pick";
                                        toastr.success("Pick Created Successfully");
                                        ArrangeMaterialCtrl.ePage.Masters.IsDisabled = false;
                                    }
                                });
                            });
                        }
                    });
                } else {
                    ArrangeMaterialCtrl.ePage.Masters.LoadingValue = "";
                    toastr.error("Pick Creation Failed. Try again later.");
                    ArrangeMaterialCtrl.ePage.Masters.CreatePickText = "Create Pick";
                    ArrangeMaterialCtrl.ePage.Masters.IsDisabled = false;
                }
            });
        }

        function getDeliveryList() {
            if (ArrangeMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef2Fk) {
                apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + ArrangeMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef2Fk).then(function (response) {
                    if (response.data.Response) {
                        ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData = response.data.Response;
                        myTaskActivityConfig.Entities.DeliveryData = ArrangeMaterialCtrl.ePage.Entities.Header.DeliveryData;
                        GeneralOperation();
                    }
                });
            }
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
                Code: [myTaskActivityConfig.Entities.Outward.label],
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