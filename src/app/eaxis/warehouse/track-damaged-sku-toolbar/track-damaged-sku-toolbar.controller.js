(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DamagedSkuToolbarController", DamagedSkuToolbarController);

    DamagedSkuToolbarController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "helperService", "appConfig", "authService", "$state", "confirmation", "$uibModal", "$window", "$http", "toastr"];

    function DamagedSkuToolbarController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, helperService, appConfig, authService, $state, confirmation, $uibModal, $window, $http, toastr) {

        var DamagedSkuToolbarCtrl = this;

        function Init() {


            DamagedSkuToolbarCtrl.ePage = {
                "Title": "",
                "Prefix": "Pending_Pickup_ToolBar",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {

                        }
                    }
                }

            };

            DamagedSkuToolbarCtrl.ePage.Masters.IsActiveMenu = DamagedSkuToolbarCtrl.activeMenu;

            DamagedSkuToolbarCtrl.ePage.Masters.Input = DamagedSkuToolbarCtrl.input;
            DamagedSkuToolbarCtrl.ePage.Masters.DataEntryObject = DamagedSkuToolbarCtrl.dataentryObject;

            DamagedSkuToolbarCtrl.ePage.Masters.MoveToTestingWarehouseBtnText = "Move To Testing Warehouse";
            DamagedSkuToolbarCtrl.ePage.Masters.MoveToRepairWarehouseBtnText = "Move To Repair Warehouse";
            DamagedSkuToolbarCtrl.ePage.Masters.MoveToScrapWarehouseBtnText = "Move To Scrap Warehouse";
            DamagedSkuToolbarCtrl.ePage.Masters.RepairAndReturnBtnText = "Return And Repair";
            DamagedSkuToolbarCtrl.ePage.Masters.IsMoveToTestingWarehouseBtn = false;
            DamagedSkuToolbarCtrl.ePage.Masters.MoveToTestingWarehouse = MoveToTestingWarehouse;
            DamagedSkuToolbarCtrl.ePage.Masters.MoveToRepairWarehouse = MoveToRepairWarehouse;
            DamagedSkuToolbarCtrl.ePage.Masters.MoveToScrapWarehouse = MoveToScrapWarehouse;
            DamagedSkuToolbarCtrl.ePage.Masters.RepairAndReturn = RepairAndReturn;
            InitAction();
        }

        function InitAction() {
            DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList = [];
            var TempWarehouse = DamagedSkuToolbarCtrl.ePage.Masters.Input[0].PIC_WAR_Code;
            var count = 0;
            angular.forEach(DamagedSkuToolbarCtrl.ePage.Masters.Input, function (value, key) {
                if (TempWarehouse == value.PIC_WAR_Code) {
                    count = count + 1;
                    DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList.push(value);
                }
            });
            if (count == DamagedSkuToolbarCtrl.ePage.Masters.Input.length) {
            } else {
                toastr.warning("Selected Warehouse should be same.")
                DamagedSkuToolbarCtrl.ePage.Masters.IsMoveToTestingWarehouseBtn = true;
            }
        }

        function MoveToTestingWarehouse() {
            if (DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList.length > 0) {
                var count = 0;
                angular.forEach(DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList, function (value, key) {
                    if (value.PIC_ReturnStatus == "Pickup In Progress") {
                        count = count + 1;
                    }
                });
                if (count == DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList.length) {
                    DamagedSkuToolbarCtrl.ePage.Masters.IsMoveToTestingWarehouseBtn = true;
                    DamagedSkuToolbarCtrl.ePage.Masters.MoveToTestingWarehouseBtnText = "Please Wait...";
                    var _filter = {
                        "WarehouseType": "TES"
                    };
                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": appConfig.Entities.WmsWarehouse.API.FindAll.FilterID
                    };
                    apiService.post("eAxisAPI", appConfig.Entities.WmsWarehouse.API.FindAll.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            DamagedSkuToolbarCtrl.ePage.Masters.WarehouseList = response.data.Response;
                            CreateMaterialTransferOutward('TES');
                        }
                    });
                } else {
                    toastr.warning("It can be moved to Testing Center when the Return status is in 'Pickup In Progress'");
                }
            }
        }

        function MoveToScrapWarehouse() {
            if (DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList.length > 0) {
                var count = 0;
                angular.forEach(DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList, function (value, key) {
                    if (value.PIC_ReturnStatus == "Testing Completed") {
                        count = count + 1;
                    }
                });
                if (count == DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList.length) {
                    DamagedSkuToolbarCtrl.ePage.Masters.IsMoveToTestingWarehouseBtn = true;
                    DamagedSkuToolbarCtrl.ePage.Masters.MoveToScrapWarehouseBtnText = "Please Wait...";
                    var _filter = {
                        "WarehouseType": "SCR"
                    };
                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": appConfig.Entities.WmsWarehouse.API.FindAll.FilterID
                    };
                    apiService.post("eAxisAPI", appConfig.Entities.WmsWarehouse.API.FindAll.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            DamagedSkuToolbarCtrl.ePage.Masters.WarehouseList = response.data.Response;
                            CreateMaterialTransferOutward('SCR');
                        }
                    });
                } else {
                    toastr.warning("It can be moved to Testing Center when the Return status is in 'Testing Completed'");
                }
            }
        }

        function MoveToRepairWarehouse() {
            if (DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList.length > 0) {
                var count = 0;
                angular.forEach(DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList, function (value, key) {
                    if (value.PIC_ReturnStatus == "Testing Completed") {
                        count = count + 1;
                    }
                });
                if (count == DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList.length) {
                    DamagedSkuToolbarCtrl.ePage.Masters.IsMoveToTestingWarehouseBtn = true;
                    DamagedSkuToolbarCtrl.ePage.Masters.MoveToRepairWarehouseBtnText = "Please Wait...";
                    var _filter = {
                        "WarehouseType": "REP"
                    };
                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": appConfig.Entities.WmsWarehouse.API.FindAll.FilterID
                    };
                    apiService.post("eAxisAPI", appConfig.Entities.WmsWarehouse.API.FindAll.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            DamagedSkuToolbarCtrl.ePage.Masters.WarehouseList = response.data.Response;
                            CreateMaterialTransferOutward('REP');
                        }
                    });
                } else {
                    toastr.warning("It can be moved to Testing Center when the Return status is in 'Testing Completed'");
                }
            }
        }

        function RepairAndReturn() {
            if (DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList.length > 0) {
                var count = 0;
                angular.forEach(DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList, function (value, key) {
                    if (value.PIC_ReturnStatus == "In Repair") {
                        count = count + 1;
                    }
                });
                if (count == DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList.length) {
                    DamagedSkuToolbarCtrl.ePage.Masters.IsMoveToTestingWarehouseBtn = true;
                    DamagedSkuToolbarCtrl.ePage.Masters.RepairAndReturnBtnText = "Please Wait...";
                    CreateMaterialTransferOutward('RAP');
                } else {
                    toastr.warning("It can be moved to Testing Center when the Return status is in 'In Repair'");
                }
            }
        }

        function CreateMaterialTransferOutward(type) {
            apiService.get("eAxisAPI", appConfig.Entities.WmsPickupList.API.GetById.Url + DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList[0].PIC_PK).then(function (response) {
                if (response.data.Response) {
                    DamagedSkuToolbarCtrl.ePage.Masters.PickupData = response.data.Response;
                    helperService.getFullObjectUsingGetById(appConfig.Entities.WmsOutwardList.API.GetById.Url, 'null').then(function (response) {
                        if (response.data.Response.Response) {
                            response.data.Response.Response.UIWmsOutwardHeader.PK = response.data.Response.Response.PK;
                            response.data.Response.Response.UIWmsOutwardHeader.ClientCode = DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickup.ClientCode;
                            response.data.Response.Response.UIWmsOutwardHeader.ClientName = DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickup.ClientName;
                            response.data.Response.Response.UIWmsOutwardHeader.ConsigneeCode = DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickup.ConsigneeCode;
                            response.data.Response.Response.UIWmsOutwardHeader.ConsigneeName = DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickup.ConsigneeName;
                            response.data.Response.Response.UIWmsOutwardHeader.ORG_Client_FK = DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickup.ORG_Client_FK;
                            response.data.Response.Response.UIWmsOutwardHeader.ORG_Consignee_FK = DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickup.ORG_Consignee_FK;
                            response.data.Response.Response.UIWmsOutwardHeader.RequiredDate = new Date();
                            response.data.Response.Response.UIWmsOutwardHeader.WorkOrderType = "ORD";
                            response.data.Response.Response.UIWmsOutwardHeader.WorkOrderSubType = "MTR";
                            if (type == "TES") {
                                response.data.Response.Response.UIWmsOutwardHeader.Warehouse = DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickup.WarehouseCode + "-" + DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickup.WarehouseName;
                                response.data.Response.Response.UIWmsOutwardHeader.WarehouseCode = DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickup.WarehouseCode;
                                response.data.Response.Response.UIWmsOutwardHeader.WarehouseName = DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickup.WarehouseName;
                                response.data.Response.Response.UIWmsOutwardHeader.WAR_FK = DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickup.WAR_FK;

                                response.data.Response.Response.UIWmsOutwardHeader.TransferTo_WAR_FK = DamagedSkuToolbarCtrl.ePage.Masters.WarehouseList[0].PK;
                                response.data.Response.Response.UIWmsOutwardHeader.TransferTo_WAR_Code = DamagedSkuToolbarCtrl.ePage.Masters.WarehouseList[0].WarehouseCode;
                                response.data.Response.Response.UIWmsOutwardHeader.TransferTo_WAR_Name = DamagedSkuToolbarCtrl.ePage.Masters.WarehouseList[0].WarehouseName;
                            } else if (type == "SCR" || type == "REP") {
                                response.data.Response.Response.UIWmsOutwardHeader.WarehouseCode = "STCLAB";
                                response.data.Response.Response.UIWmsOutwardHeader.WarehouseName = "TESTING CENTER";
                                response.data.Response.Response.UIWmsOutwardHeader.WAR_FK = "11e796e6-3c37-4853-bd8c-6d61d4ea2bf8";

                                response.data.Response.Response.UIWmsOutwardHeader.TransferTo_WAR_FK = DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickup.WAR_FK;
                                response.data.Response.Response.UIWmsOutwardHeader.TransferTo_WAR_Code = DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickup.WarehouseCode;
                                response.data.Response.Response.UIWmsOutwardHeader.TransferTo_WAR_Name = DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickup.WarehouseName;
                            } else {
                                response.data.Response.Response.UIWmsOutwardHeader.WarehouseCode = "REPAIR";
                                response.data.Response.Response.UIWmsOutwardHeader.WarehouseName = "REPAIR WAREHOUSE";
                                response.data.Response.Response.UIWmsOutwardHeader.WAR_FK = "ac7867ec-9d8f-4c61-9148-27d96d2d95a4";

                                response.data.Response.Response.UIWmsOutwardHeader.TransferTo_WAR_FK = DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickup.WAR_FK;
                                response.data.Response.Response.UIWmsOutwardHeader.TransferTo_WAR_Code = DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickup.WarehouseCode;
                                response.data.Response.Response.UIWmsOutwardHeader.TransferTo_WAR_Name = DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickup.WarehouseName;
                            }
                            response.data.Response.Response.UIWmsOutwardHeader.AdditionalRef2Fk = DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickup.PK;
                            response.data.Response.Response.UIWmsOutwardHeader.AdditionalRef2Code = DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickup.WorkOrderID;
                            response.data.Response.Response.UIWmsOutwardHeader.WOD_Parent_FK = DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickup.PK;

                            response.data.Response.Response.UIOrgHeader = angular.copy(DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIOrgHeader);
                            response.data.Response.Response.UIJobAddress = angular.copy(DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIJobAddress);
                            angular.forEach(response.data.Response.Response.UIJobAddress, function (value, key) {
                                value.PK = "";
                                if (value.AddressType == "SUD") {
                                    value.AddressType = "CED";
                                }
                            });

                            angular.forEach(DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList, function (value, key) {
                                var obj = {
                                    "Parent_FK": value.PL_PK,
                                    "PK": "",
                                    "WorkOrderType": "ORD",
                                    "WorkOrderLineType": "ORD",
                                    "WorkOrderID": response.data.Response.Response.UIWmsOutwardHeader.WorkOrderID,
                                    "ExternalReference": response.data.Response.Response.UIWmsOutwardHeader.WorkOrderID,
                                    "WOD_FK": response.data.Response.Response.PK,
                                    "ProductCode": value.PL_Req_PrdCode,
                                    "ProductDescription": value.PL_Req_PrdDesc,
                                    "PRO_FK": value.PL_Req_PrdPk,
                                    "Commodity": value.PL_Commodity,
                                    "MCC_NKCommodityCode": value.PL_MCC_NKCommodityCode,
                                    "MCC_NKCommodityDesc": value.PL_MCC_NKCommodityDesc,
                                    "ProductCondition": value.PL_ProductCondition,
                                    "Packs": value.PL_Packs,
                                    "PAC_PackType": value.PL_PAC_PackType,
                                    "Units": value.PL_Units,
                                    "StockKeepingUnit": value.PL_StockKeepingUnit,
                                    "PartAttrib1": value.PL_PartAttrib1,
                                    "PartAttrib2": value.PL_PartAttrib2,
                                    "PartAttrib3": value.PL_PartAttrib3,
                                    "LineComment": value.PL_LineComment,
                                    "PackingDate": value.PL_PackingDate,
                                    "ExpiryDate": value.PL_ExpiryDate,
                                    "AdditionalRef1Code": value.PL_AdditionalRef1Code,
                                    "UseExpiryDate": value.PL_UseExpiryDate,
                                    "UsePackingDate": value.PL_UsePackingDate,
                                    "UsePartAttrib1": value.PL_UsePartAttrib1,
                                    "UsePartAttrib2": value.PL_UsePartAttrib2,
                                    "UsePartAttrib3": value.PL_UsePartAttrib3,
                                    "IsPartAttrib1ReleaseCaptured": value.PL_IsPartAttrib1ReleaseCaptured,
                                    "IsPartAttrib2ReleaseCaptured": value.PL_IsPartAttrib2ReleaseCaptured,
                                    "IsPartAttrib3ReleaseCaptured": value.PL_IsPartAttrib3ReleaseCaptured,

                                    "IsDeleted": false,
                                    "ORG_ClientCode": value.PIC_ClientCode,
                                    "ORG_ClientName": value.PIC_ClientName,
                                    "Client_FK": value.PIC_ORG_Client_FK,

                                    "WAR_WarehouseCode": value.PIC_WAR_Code,
                                    "WAR_WarehouseName": value.PIC_WAR_Name,
                                    "WAR_FK": value.PIC_WAR_FK,
                                };
                                response.data.Response.Response.UIWmsWorkOrderLine.push(obj);
                            });

                            apiService.post("eAxisAPI", appConfig.Entities.WmsOutwardList.API.Insert.Url, response.data.Response.Response).then(function (response) {
                                if (response.data.Response) {
                                    toastr.success("Outward Created Successfully");
                                    var _input = {
                                        ProcessName: "WMS_MaterialTransfer",
                                        InitBy: "PICKUP",

                                        EntitySource: "PIC",
                                        EntityRefCode: response.data.Response.UIWmsOutwardHeader.WorkOrderID,
                                        EntityRefKey: response.data.Response.UIWmsOutwardHeader.PK,

                                        SAP_FK: authService.getUserInfo().AppPK,
                                        TenantCode: authService.getUserInfo().TenantCode,
                                        IsModified: true
                                    };

                                    apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.InitiateProcess.Url, _input).then(function (response) {
                                        if (response.data.Response) {
                                        }
                                    });
                                    if (type == "TES") {
                                        DamagedSkuToolbarCtrl.ePage.Masters.MoveToTestingWarehouseBtnText = "Move To Testing Warehouse";
                                    } else if (type == "SCR") {
                                        DamagedSkuToolbarCtrl.ePage.Masters.MoveToScrapWarehouseBtnText = "Move To Scrap Warehouse";
                                    } else if (type == "REP") {
                                        DamagedSkuToolbarCtrl.ePage.Masters.MoveToRepairWarehouseBtnText = "Move To Repair Warehouse";
                                    } else if (type == "RAR") {
                                        DamagedSkuToolbarCtrl.ePage.Masters.RepairAndReturnBtnText = "Repair And Return";
                                    }
                                    DamagedSkuToolbarCtrl.ePage.Masters.IsMoveToTestingWarehouseBtn = true;
                                    helperService.refreshGrid();
                                } else {
                                    toastr.error("Outward Creation Failed. Please try again later");
                                    DamagedSkuToolbarCtrl.ePage.Masters.IsMoveToTestingWarehouseBtn = false;
                                    if (type == "TES") {
                                        DamagedSkuToolbarCtrl.ePage.Masters.MoveToTestingWarehouseBtnText = "Move To Testing Warehouse";
                                    } else if (type == "SCR") {
                                        DamagedSkuToolbarCtrl.ePage.Masters.MoveToScrapWarehouseBtnText = "Move To Scrap Warehouse";
                                    } else if (type == "REP") {
                                        DamagedSkuToolbarCtrl.ePage.Masters.MoveToRepairWarehouseBtnText = "Move To Repair Warehouse";
                                    } else if (type == "RAR") {
                                        DamagedSkuToolbarCtrl.ePage.Masters.RepairAndReturnBtnText = "Repair And Return";
                                    }
                                }
                            });
                        } else {
                            console.log("Empty New Pickup response");
                        }
                    });
                }
            });
        }

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }

        Init();
    }
})();