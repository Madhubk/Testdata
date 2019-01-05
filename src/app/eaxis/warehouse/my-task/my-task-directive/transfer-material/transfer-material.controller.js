(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TransferMaterialController", TransferMaterialController);

    TransferMaterialController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "dynamicLookupConfig", "outwardConfig", "$injector", "toastr", "$timeout"];

    function TransferMaterialController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, dynamicLookupConfig, outwardConfig, $injector, toastr, $timeout) {
        var TransferMaterialCtrl = this;
        var Config = $injector.get("releaseConfig");

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
                outwardConfig.ValidationFindall();
                GetDynamicLookupConfig();
                getDeliveryList();
                if (TransferMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PickNo) {
                    GetPickDetails();
                }
                if (errorWarningService.Modules.MyTask)
                    TransferMaterialCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Outward.label];
            }

            TransferMaterialCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            TransferMaterialCtrl.ePage.Masters.DatePicker = {};
            TransferMaterialCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            TransferMaterialCtrl.ePage.Masters.DatePicker.isOpen = [];
            TransferMaterialCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            TransferMaterialCtrl.ePage.Masters.CreatePick = CreatePick;
            TransferMaterialCtrl.ePage.Masters.CreatePickText = "Create Pick";
            TransferMaterialCtrl.ePage.Masters.ReloadOutwardDetails = ReloadOutwardDetails;
        }

        function ReloadOutwardDetails() {
            if (!TransferMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.FinalisedDate) {
                $timeout(function () {
                    apiService.get("eAxisAPI", appConfig.Entities.WmsOutwardList.API.GetById.Url + TransferMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PK).then(function (response) {
                        if (response.data.Response) {
                            response.data.Response.UIWmsOutwardHeader.Client = response.data.Response.UIWmsOutwardHeader.ClientCode + "-" + response.data.Response.UIWmsOutwardHeader.ClientName;
                            response.data.Response.UIWmsOutwardHeader.Warehouse = response.data.Response.UIWmsOutwardHeader.WarehouseCode + "-" + response.data.Response.UIWmsOutwardHeader.WarehouseName;
                            response.data.Response.UIWmsOutwardHeader.Consignee = response.data.Response.UIWmsOutwardHeader.ConsigneeCode + "-" + response.data.Response.UIWmsOutwardHeader.ConsigneeName;
                            myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data = response.data.Response;
                            myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.GlobalVariables.NonEditable = true;
                            TransferMaterialCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data;
                        }
                    });
                }, 8000);
            }
        }

        function GetPickDetails() {
            apiService.get("eAxisAPI", Config.Entities.Header.API.GetByID.Url + TransferMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WPK_FK).then(function (response) {
                if (response.data.Response) {
                    TransferMaterialCtrl.ePage.Entities.Header.PickData = response.data.Response;
                    Config.GetTabDetails(TransferMaterialCtrl.ePage.Entities.Header.PickData.UIWmsPickHeader, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == TransferMaterialCtrl.ePage.Entities.Header.PickData.UIWmsPickHeader.PickNo) {
                                TransferMaterialCtrl.ePage.Masters.TabList = value;
                                myTaskActivityConfig.Entities.PickData = TransferMaterialCtrl.ePage.Masters.TabList;
                            }
                        });
                    });
                }
            });
        }

        function CreatePick() {
            TransferMaterialCtrl.ePage.Masters.LoadingValue = "Creating Pick..";
            TransferMaterialCtrl.ePage.Masters.IsDisabled = true;
            TransferMaterialCtrl.ePage.Masters.CreatePickText = "Please Wait...";
            helperService.getFullObjectUsingGetById(Config.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    response.data.Response.Response.UIWmsPickHeader.PK = response.data.Response.Response.PK;
                    if (TransferMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PickOption) {
                        response.data.Response.Response.UIWmsPickHeader.PickOption = TransferMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PickOption;
                    } else {
                        response.data.Response.Response.UIWmsPickHeader.PickOption = "AUT";
                    }
                    response.data.Response.Response.UIWmsPickHeader.WarehouseCode = TransferMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseCode;
                    response.data.Response.Response.UIWmsPickHeader.WarehouseName = TransferMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseName;
                    response.data.Response.Response.UIWmsPickHeader.WAR_FK = TransferMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WAR_FK;
                    TransferMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WPK_FK = response.data.Response.Response.PK;
                    TransferMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PutOrPickStartDateTime = new Date();
                    TransferMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderStatus = "OSP";
                    TransferMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderStatusDesc = "Pick Started";
                    TransferMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.IsModified = true;
                    response.data.Response.Response.UIWmsOutward.push(TransferMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader);

                    apiService.post("eAxisAPI", Config.Entities.Header.API.InsertPick.Url, response.data.Response.Response).then(function (response) {
                        if (response.data.Status == 'Success') {
                            TransferMaterialCtrl.ePage.Masters.PickDetails = response.data.Response;
                            TransferMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PickNo = response.data.Response.UIWmsPickHeader.PickNo;
                            Config.GetTabDetails(TransferMaterialCtrl.ePage.Masters.PickDetails.UIWmsPickHeader, false).then(function (response) {
                                angular.forEach(response, function (value, key) {
                                    if (value.label == TransferMaterialCtrl.ePage.Masters.PickDetails.UIWmsPickHeader.PickNo) {
                                        TransferMaterialCtrl.ePage.Masters.TabList = value;
                                        myTaskActivityConfig.Entities.PickData = TransferMaterialCtrl.ePage.Masters.TabList;
                                        TransferMaterialCtrl.ePage.Masters.LoadingValue = "";
                                        toastr.success("Pick Created Successfully");
                                    }
                                });
                            });
                        } else {
                            TransferMaterialCtrl.ePage.Masters.LoadingValue = "";
                            toastr.error("Pick Creation Failed. Try again later.");
                            TransferMaterialCtrl.ePage.Masters.CreatePickText = "Create Pick";
                            TransferMaterialCtrl.ePage.Masters.IsDisabled = false;
                        }
                    });
                } else {
                    TransferMaterialCtrl.ePage.Masters.LoadingValue = "";
                    toastr.error("Pick Creation Failed. Try again later.");
                    TransferMaterialCtrl.ePage.Masters.CreatePickText = "Create Pick";
                    TransferMaterialCtrl.ePage.Masters.IsDisabled = false;
                }
            });
        }

        function getDeliveryList() {            
            var _filter = {
                "PK": TransferMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WOD_Parent_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.WmsWorkOrder.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.WmsWorkOrder.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TransferMaterialCtrl.ePage.Masters.WorkOrderList = response.data.Response[0];
                    if (TransferMaterialCtrl.ePage.Masters.WorkOrderList.WorkOrderType == "PIC") {
                        apiService.get("eAxisAPI", appConfig.Entities.WmsPickupList.API.GetById.Url + TransferMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WOD_Parent_FK).then(function (response) {
                            if (response.data.Response) {
                                TransferMaterialCtrl.ePage.Entities.Header.PickupData = response.data.Response;
                                myTaskActivityConfig.Entities.PickupData = TransferMaterialCtrl.ePage.Entities.Header.PickupData;
                                GeneralOperation();
                            }
                        });
                    } else {
                        apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + TransferMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WOD_Parent_FK).then(function (response) {
                            if (response.data.Response) {
                                TransferMaterialCtrl.ePage.Entities.Header.DeliveryData = response.data.Response;
                                myTaskActivityConfig.Entities.DeliveryData = TransferMaterialCtrl.ePage.Entities.Header.DeliveryData;
                                GeneralOperation();
                            }
                        });
                    }
                }
            });
        }

        function GeneralOperation() {
            if (TransferMaterialCtrl.ePage.Entities.Header.DeliveryData) {
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
            if (TransferMaterialCtrl.ePage.Entities.Header.PickupData) {
                // Client
                if (TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ClientCode == null)
                    TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ClientCode = "";
                if (TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ClientName == null)
                    TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ClientName = "";
                TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Client = TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ClientCode + ' - ' + TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ClientName;
                if (TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Client == " - ")
                    TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Client = "";
                // Consignee
                if (TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ConsigneeCode == null)
                    TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ConsigneeCode = "";
                if (TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ConsigneeName == null)
                    TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ConsigneeName = "";
                TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Consignee = TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ConsigneeCode + ' - ' + TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.ConsigneeName;
                if (TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Consignee == " - ")
                    TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Consignee = "";
                // Warehouse
                if (TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.WarehouseCode == null)
                    TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.WarehouseCode = "";
                if (TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.WarehouseName == null)
                    TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.WarehouseName = "";
                TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Warehouse = TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.WarehouseCode + ' - ' + TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.WarehouseName;
                if (TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Warehouse == " - ")
                    TransferMaterialCtrl.ePage.Entities.Header.PickupData.UIWmsPickup.Warehouse = "";
            }
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
            var Data;
            if (TransferMaterialCtrl.ePage.Entities.Header.DeliveryData)
                Data = TransferMaterialCtrl.ePage.Entities.Header.DeliveryData;
            else if (TransferMaterialCtrl.ePage.Entities.Header.PickupData)
                Data = TransferMaterialCtrl.ePage.Entities.Header.DeliveryData;
            var _obj = {
                ModuleName: ["MyTask"],
                Code: [myTaskActivityConfig.Entities.Outward.label],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "WMS",
                    SubModuleCode: "DEL",
                    // Code: "E0013"
                },
                EntityObject: Data,
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