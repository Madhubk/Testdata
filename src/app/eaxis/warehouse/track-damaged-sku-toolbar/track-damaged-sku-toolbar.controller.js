(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DamagedSkuToolbarController", DamagedSkuToolbarController);

    DamagedSkuToolbarController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "helperService", "appConfig", "authService", "$state", "confirmation", "$uibModal", "$window", "$http", "toastr", "$location"];

    function DamagedSkuToolbarController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, helperService, appConfig, authService, $state, confirmation, $uibModal, $window, $http, toastr, $location) {

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
            DamagedSkuToolbarCtrl.ePage.Masters.MoveToSiteWarehouseBtnText = "Move To Site Warehouse";
            DamagedSkuToolbarCtrl.ePage.Masters.MoveToCentralWarehouseBtnText = "Move To Central Warehouse";
            DamagedSkuToolbarCtrl.ePage.Masters.UpdateInventoryBtnText = "Update Inventory";
            DamagedSkuToolbarCtrl.ePage.Masters.IsMoveToTestingWarehouseBtn = false;
            DamagedSkuToolbarCtrl.ePage.Masters.MoveToTestingWarehouse = MoveToTestingWarehouse;
            DamagedSkuToolbarCtrl.ePage.Masters.MoveToRepairWarehouse = MoveToRepairWarehouse;
            DamagedSkuToolbarCtrl.ePage.Masters.MoveToScrapWarehouse = MoveToScrapWarehouse;
            DamagedSkuToolbarCtrl.ePage.Masters.MoveToSiteWarehouse = MoveToSiteWarehouse;
            DamagedSkuToolbarCtrl.ePage.Masters.MoveToCentralWarehouse = MoveToCentralWarehouse;
            DamagedSkuToolbarCtrl.ePage.Masters.UpdateInventory = UpdateInventory;
            DamagedSkuToolbarCtrl.ePage.Masters.UpdateData = UpdateData;
            DamagedSkuToolbarCtrl.ePage.Masters.CloseEditActivityModal = CloseEditActivityModal;
            InitAction();
        }

        function InitAction() {
            DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList = [];
            var TempWarehouse = DamagedSkuToolbarCtrl.ePage.Masters.Input[0].WarehouseCode;
            var count = 0;
            angular.forEach(DamagedSkuToolbarCtrl.ePage.Masters.Input, function (value, key) {
                if (TempWarehouse == value.WarehouseCode) {
                    count = count + 1;
                    DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList.push(value);
                }
            });
            if (count == DamagedSkuToolbarCtrl.ePage.Masters.Input.length) {
            } else {
                toastr.warning("Selected Warehouse should be same.")
                DamagedSkuToolbarCtrl.ePage.Masters.IsMoveToTestingWarehouseBtn = true;
            }
            if (DamagedSkuToolbarCtrl.ePage.Masters.Input.length > 1) {
                DamagedSkuToolbarCtrl.ePage.Masters.IsUpdateInventoryBtn = true;
            }
        }

        function UpdateInventory() {
            DamagedSkuToolbarCtrl.ePage.Masters.UpdateInventoryBtnText = "Please Wait..."
            DamagedSkuToolbarCtrl.ePage.Masters.IsUpdateInventoryBtn = true;
            var count = 0;
            angular.forEach(DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList, function (value, key) {
                if (value.PickupLineStatus == "Stock at Testing Warehouse" || value.PickupLineStatus == "Stock at Repair Warehouse") {
                    count = count + 1;
                }
            });
            if (count == DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList.length) {
                GetDropDownList();
                DamagedSkuToolbarCtrl.ePage.Masters.DropDownMasterList = {};
                var warehouseCode = DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList[0].PickupLineStatus == "Stock at Testing Warehouse" ? "STCLAB" : "REPAIR"
                var FilterObj = {
                    "ORG_FK": DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList[0].Client_FK,
                    "WAR_WarehouseCode": warehouseCode,
                    "ProductCode": DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList[0].ProductCode,
                    "PartAttrib1": DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList[0].PIL_UDF1,
                    "PartAttrib2": DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList[0].PIL_UDF2,
                    "PartAttrib3": DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList[0].PIL_UDF3,
                    "PackingDate": DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList[0].PackingDate,
                    "ExpiryDate": DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList[0].ExpiryDate,
                    "SortColumn": "WOL_WAR_WarehouseCode",
                    "SortType": "ASC",
                    "PageNumber": 1,
                    "PageSize": 1000
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(FilterObj),
                    "FilterID": appConfig.Entities.WmsInventory.API.FindAll.FilterID
                };
                apiService.post("eAxisAPI", appConfig.Entities.WmsInventory.API.FindAll.Url, _input).then(function (response) {
                    DamagedSkuToolbarCtrl.ePage.Masters.Inventory = response.data.Response;
                    if (DamagedSkuToolbarCtrl.ePage.Masters.Inventory.length > 0) {
                        OpenModal();
                    } else {
                        toastr.warning("Inventory Not Available")
                        DamagedSkuToolbarCtrl.ePage.Masters.UpdateInventoryBtnText = "Update Inventory"
                        DamagedSkuToolbarCtrl.ePage.Masters.IsUpdateInventoryBtn = false;
                    }
                });
            } else {
                toastr.warning("Cannot update the Inventory for this Line(s)");
                DamagedSkuToolbarCtrl.ePage.Masters.UpdateInventoryBtnText = "Update Inventory"
                DamagedSkuToolbarCtrl.ePage.Masters.IsUpdateInventoryBtn = false;
            }
        }

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["ProductCondition"];
            var dynamicFindAllInput = [];

            typeCodeList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    typeCodeList.map(function (value, key) {
                        DamagedSkuToolbarCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        DamagedSkuToolbarCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function OpenModal() {
            return DamagedSkuToolbarCtrl.ePage.Masters.modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "success-popup",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/warehouse/track-damaged-sku-toolbar/update-inventory.html"
            });
        }

        function CloseEditActivityModal() {
            DamagedSkuToolbarCtrl.ePage.Masters.UpdateInventoryBtnText = "Update Inventory"
            DamagedSkuToolbarCtrl.ePage.Masters.IsUpdateInventoryBtn = false;
            DamagedSkuToolbarCtrl.ePage.Masters.modalInstance.dismiss('cancel');
        }

        function UpdateData() {
            DamagedSkuToolbarCtrl.ePage.Masters.UpdateInventoryBtnText = "Please Wait..."
            DamagedSkuToolbarCtrl.ePage.Masters.IsUpdateInventoryBtn = true;
            var Status = "";
            if (DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList[0].ProductCondition == 'DMG') {
                Status = "Damaged";
            } else {
                Status = "Good";
            }
            var _input = {
                "InventoryLine": DamagedSkuToolbarCtrl.ePage.Masters.Inventory[0],
                "AdjustedQty": 1,
                "Status": Status,
                "CreatedBy": authService.getUserInfo().UserEmail
            }
            CloseEditActivityModal();
            apiService.post("eAxisAPI", appConfig.Entities.WmsInventoryAdjustment.API.Insert.Url, _input).then(function (response) {
                if (response.data.Status == 'Success') {
                    toastr.success('Inventory Updated Successfully ');
                    apiService.get("eAxisAPI", appConfig.Entities.WmsPickupList.API.GetById.Url + DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList[0].PickupRequest_FK).then(function (response) {
                        if (response.data.Response) {
                            DamagedSkuToolbarCtrl.ePage.Masters.PickupData = response.data.Response;
                            angular.forEach(DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickupLine, function (value, key) {
                                if (value.AdditionalRef1Code == DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList[0].PickupLineRefNo) {
                                    value.ProductCondition = DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList[0].ProductCondition;
                                    value.UISPMSPickupReport.ProductCondition = DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList[0].ProductCondition;
                                }
                            });
                            DamagedSkuToolbarCtrl.ePage.Masters.PickupData = filterObjectUpdate(DamagedSkuToolbarCtrl.ePage.Masters.PickupData, "IsModified");
                            apiService.post("eAxisAPI", appConfig.Entities.WmsPickupList.API.Update.Url, DamagedSkuToolbarCtrl.ePage.Masters.PickupData).then(function (response) {
                                if (response.data.Response) {
                                    DamagedSkuToolbarCtrl.ePage.Masters.PickupData = response.data.Response;
                                    toastr.success("Pickup Saved Successfully");
                                    helperService.refreshGrid();
                                    DamagedSkuToolbarCtrl.ePage.Masters.UpdateInventoryBtnText = "Update Inventory"
                                    DamagedSkuToolbarCtrl.ePage.Masters.IsUpdateInventoryBtn = true;
                                    DamagedSkuToolbarCtrl.ePage.Masters.IsMoveToTestingWarehouseBtn = true;
                                }
                            });
                        } else {
                            DamagedSkuToolbarCtrl.ePage.Masters.UpdateInventoryBtnText = "Update Inventory"
                            DamagedSkuToolbarCtrl.ePage.Masters.IsUpdateInventoryBtn = false;
                        }
                    });
                } else {
                    toastr.error("Update Failed");
                    DamagedSkuToolbarCtrl.ePage.Masters.UpdateInventoryBtnText = "Update Inventory"
                    DamagedSkuToolbarCtrl.ePage.Masters.IsUpdateInventoryBtn = false;
                }
            });
        }

        function MoveToCentralWarehouse() {
            if (DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList.length > 0) {
                var count = 0;
                var count1 = 0;
                var count2 = 0;
                angular.forEach(DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList, function (value, key) {
                    if (value.PickupLineStatus == "Stock at Site Warehouse") {
                        count = count + 1;
                    }
                    if (value.PickupLineStatus == "Stock at Testing Warehouse") {
                        count1 = count1 + 1;
                    }
                    if (value.PickupLineStatus == "Stock at Repair Warehouse") {
                        count2 = count2 + 1;
                    }
                });
                if ((count == DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList.length) || (count1 == DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList.length) || (count2 == DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList.length)) {
                    if ((count1 == DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList.length) || (count2 == DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList.length)) {
                        var modalOptions = {
                            closeButtonText: 'No',
                            actionButtonText: 'YES',
                            headerText: 'Are You Sure?',
                            bodyText: 'Do You Want To Continue With This Product Condition?'
                        };
                        confirmation.showModal({}, modalOptions)
                            .then(function (result) {
                                getCentralWarehouse();
                            }, function () {
                                toastr.warning("Please update the Inventory");
                                console.log("Cancelled");
                            });
                    } else {
                        getCentralWarehouse();
                    }
                } else {
                    toastr.warning("This line(s) cannot be moved to Central warehouse");
                }
            }
        }

        function getCentralWarehouse() {
            DamagedSkuToolbarCtrl.ePage.Masters.IsMoveToTestingWarehouseBtn = true;
            DamagedSkuToolbarCtrl.ePage.Masters.MoveToCentralWarehouseBtnText = "Please Wait...";
            var _filter = {
                "WarehouseType": "CEN"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.WmsWarehouse.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.WmsWarehouse.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DamagedSkuToolbarCtrl.ePage.Masters.WarehouseList = response.data.Response;
                    CreateMaterialTransferOutward('CEN');
                }
            });
        }

        function MoveToTestingWarehouse() {
            if (DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList.length > 0) {
                var count = 0;
                angular.forEach(DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList, function (value, key) {
                    if (!value.TestingRefNo && value.PickupLineStatus == "Stock at Central Warehouse") {
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
                    toastr.warning("This line(s) cannot be moved to Testing warehouse");
                }
            }
        }

        function MoveToScrapWarehouse() {            
            if (DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList.length > 0) {
                var count = 0;
                var count1 = 0
                angular.forEach(DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList, function (value, key) {
                    if (value.TestingRefNo && value.PickupLineStatus == "Tested, Stock at Central Warehouse") {
                        count = count + 1;
                    }
                    if (value.PickupLineStatus == "Stock at Central Warehouse") {
                        count1 = count1 + 1;
                    }
                });
                if (count1 > 0) {
                    var modalOptions = {
                        closeButtonText: 'No',
                        actionButtonText: 'YES',
                        headerText: 'Are You Sure?',
                        bodyText: 'Do You Want To Continue Without going to Testing Warehouse?'
                    };
                    confirmation.showModal({}, modalOptions)
                        .then(function (result) {
                            if ((count + count1) == DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList.length) {
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
                                toastr.warning("This line(s) cannot be moved to Scrap warehouse");
                            }
                        }, function () {
                            console.log("Cancelled");
                        });
                } else {
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
                        toastr.warning("This line(s) cannot be moved to Scrap warehouse");
                    }
                }
            }
        }

        function MoveToRepairWarehouse() {            
            if (DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList.length > 0) {
                var count = 0;
                var count1 = 0;
                angular.forEach(DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList, function (value, key) {
                    if (value.TestingRefNo && value.PickupLineStatus == "Tested, Stock at Central Warehouse") {
                        count = count + 1;
                    }
                    if (value.PickupLineStatus == "Stock at Central Warehouse") {
                        count1 = count1 + 1;
                    }
                });
                if (count1 > 0) {
                    var modalOptions = {
                        closeButtonText: 'No',
                        actionButtonText: 'YES',
                        headerText: 'Are You Sure?',
                        bodyText: 'Do You Want To Continue Without going to Testing Warehouse?'
                    };
                    confirmation.showModal({}, modalOptions)
                        .then(function (result) {
                            if ((count + count1) == DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList.length) {
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
                                toastr.warning("This line(s) cannot be moved to Repair warehouse");
                            }
                        }, function () {
                            console.log("Cancelled");
                        });
                } else {
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
                        toastr.warning("This line(s) cannot be moved to Repair warehouse");
                    }
                }
            }
        }

        function MoveToSiteWarehouse() {
            if (DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList.length > 0) {
                var count = 0;
                angular.forEach(DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList, function (value, key) {
                    if (value.PickupLineStatus == "Repaired, Stock at Central Warehouse") {
                        count = count + 1;
                    }
                });
                if (count == DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList.length) {
                    DamagedSkuToolbarCtrl.ePage.Masters.IsMoveToTestingWarehouseBtn = true;
                    DamagedSkuToolbarCtrl.ePage.Masters.MoveToSiteWarehouseBtnText = "Please Wait...";
                    CreateMaterialTransferOutward('SIT');
                } else {
                    toastr.warning("This line(s) cannot be moved to Site warehouse");
                }
            }
        }

        function CreateMaterialTransferOutward(type) {
            apiService.get("eAxisAPI", appConfig.Entities.WmsPickupList.API.GetById.Url + DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList[0].PickupRequest_FK).then(function (response) {
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
                            if (type == "CEN") {
                                if (DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList[0].PickupLineStatus == "Stock at Site Warehouse") {
                                    response.data.Response.Response.UIWmsOutwardHeader.Warehouse = DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickup.WarehouseCode + "-" + DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickup.WarehouseName;
                                    response.data.Response.Response.UIWmsOutwardHeader.WarehouseCode = DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickup.WarehouseCode;
                                    response.data.Response.Response.UIWmsOutwardHeader.WarehouseName = DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickup.WarehouseName;
                                    response.data.Response.Response.UIWmsOutwardHeader.WAR_FK = DamagedSkuToolbarCtrl.ePage.Masters.PickupData.UIWmsPickup.WAR_FK;
                                } else if (DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList[0].PickupLineStatus == "Stock at Testing Warehouse") {
                                    response.data.Response.Response.UIWmsOutwardHeader.WarehouseCode = "STCLAB";
                                    response.data.Response.Response.UIWmsOutwardHeader.WarehouseName = "TESTING CENTER";
                                    response.data.Response.Response.UIWmsOutwardHeader.WAR_FK = "2dad2f10-63c4-4dc6-8055-e22c9eb83616";
                                } else if (DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList[0].PickupLineStatus == "Stock at Repair Warehouse") {
                                    response.data.Response.Response.UIWmsOutwardHeader.WarehouseCode = "REPAIR";
                                    response.data.Response.Response.UIWmsOutwardHeader.WarehouseName = "REPAIR WAREHOUSE";
                                    response.data.Response.Response.UIWmsOutwardHeader.WAR_FK = "ac7867ec-9d8f-4c61-9148-27d96d2d95a4";
                                }

                                response.data.Response.Response.UIWmsOutwardHeader.TransferTo_WAR_FK = DamagedSkuToolbarCtrl.ePage.Masters.WarehouseList[0].PK;
                                response.data.Response.Response.UIWmsOutwardHeader.TransferTo_WAR_Code = DamagedSkuToolbarCtrl.ePage.Masters.WarehouseList[0].WarehouseCode;
                                response.data.Response.Response.UIWmsOutwardHeader.TransferTo_WAR_Name = DamagedSkuToolbarCtrl.ePage.Masters.WarehouseList[0].WarehouseName;
                            } else if (type == "SCR" || type == "REP" || type == "TES") {
                                response.data.Response.Response.UIWmsOutwardHeader.WarehouseCode = "BDL001";
                                response.data.Response.Response.UIWmsOutwardHeader.WarehouseName = "L3 - 001BDL001 DHAKA BD";
                                response.data.Response.Response.UIWmsOutwardHeader.WAR_FK = "94ad225a-e966-48af-b7b2-1f9e1629addc";

                                response.data.Response.Response.UIWmsOutwardHeader.TransferTo_WAR_FK = DamagedSkuToolbarCtrl.ePage.Masters.WarehouseList[0].PK;
                                response.data.Response.Response.UIWmsOutwardHeader.TransferTo_WAR_Code = DamagedSkuToolbarCtrl.ePage.Masters.WarehouseList[0].WarehouseCode;
                                response.data.Response.Response.UIWmsOutwardHeader.TransferTo_WAR_Name = DamagedSkuToolbarCtrl.ePage.Masters.WarehouseList[0].WarehouseName;
                            } else if (type == "SIT") {
                                response.data.Response.Response.UIWmsOutwardHeader.WarehouseCode = "BDL001";
                                response.data.Response.Response.UIWmsOutwardHeader.WarehouseName = "L3 - 001BDL001 DHAKA BD";
                                response.data.Response.Response.UIWmsOutwardHeader.WAR_FK = "94ad225a-e966-48af-b7b2-1f9e1629addc";

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
                                    "Parent_FK": value.PickupLine_FK,
                                    "PK": "",
                                    "WorkOrderType": "ORD",
                                    "WorkOrderLineType": "ORD",
                                    "WorkOrderLineStatus": "",
                                    "WorkOrderID": response.data.Response.Response.UIWmsOutwardHeader.WorkOrderID,
                                    "ExternalReference": response.data.Response.Response.UIWmsOutwardHeader.WorkOrderID,
                                    "WOD_FK": response.data.Response.Response.PK,
                                    "ProductCode": value.ProductCode,
                                    "ProductDescription": value.ProductDescription,
                                    "PRO_FK": value.PIL_Product_Fk,
                                    "Commodity": "",
                                    "MCC_NKCommodityCode": "",
                                    "MCC_NKCommodityDesc": "",
                                    "ProductCondition": value.ProductCondition,
                                    "Packs": value.Packs,
                                    "PAC_PackType": value.PackType,
                                    "Units": value.Quantity,
                                    "StockKeepingUnit": value.UQ,
                                    "PartAttrib1": value.PIL_UDF1,
                                    "PartAttrib2": value.PIL_UDF2,
                                    "PartAttrib3": value.PIL_UDF3,
                                    "LineComment": value.PickupComment,
                                    "PackingDate": value.PackingDate,
                                    "ExpiryDate": value.ExpiryDate,
                                    "AdditionalRef1Code": value.PickupLineRefNo,
                                    "AdditionalRef1Type": "PickupLine",
                                    "AdditionalRef1Fk": value.PickupLine_FK,
                                    "UseExpiryDate": value.UseExpiryDate,
                                    "UsePackingDate": value.UsePackingDate,
                                    "UsePartAttrib1": value.UsePartAttrib1,
                                    "UsePartAttrib2": value.UsePartAttrib2,
                                    "UsePartAttrib3": value.UsePartAttrib3,
                                    "IsPartAttrib1ReleaseCaptured": value.IsPartAttrib1ReleaseCaptured,
                                    "IsPartAttrib2ReleaseCaptured": value.IsPartAttrib2ReleaseCaptured,
                                    "IsPartAttrib3ReleaseCaptured": value.IsPartAttrib3ReleaseCaptured,

                                    "IsDeleted": false,
                                    "ORG_ClientCode": value.ClientCode,
                                    "ORG_ClientName": value.ClientName,
                                    "Client_FK": value.Client_FK,

                                    "WAR_WarehouseCode": value.WarehouseCode,
                                    "WAR_WarehouseName": value.WarehouseName,
                                    "WAR_FK": value.Warehouse_FK,
                                };
                                response.data.Response.Response.UIWmsWorkOrderLine.push(obj);
                            });
                            MTRCreation(response.data.Response.Response, type);
                        } else {
                            console.log("Empty New Pickup response");
                        }
                    });
                }
            });
        }

        function MTRCreation(_outwardInput, type) {
            apiService.post("eAxisAPI", appConfig.Entities.WmsOutwardList.API.Insert.Url, _outwardInput).then(function (response) {
                if (response.data.Response) {
                    DamagedSkuToolbarCtrl.ePage.Masters.OutwardData = response.data.Response;
                    ChangePickupStatus(type);
                    toastr.success("Material Transfer is successfully created.. Material Transfer No : " + DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.WorkOrderID, {
                        tapToDismiss: false,
                        closeButton: true,
                        timeOut: 0
                    });
                    var _input = {
                        ProcessName: "WMS_MaterialTransfer",
                        InitBy: "PICKUP",

                        EntitySource: "PIC",
                        EntityRefCode: DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.WorkOrderID,
                        EntityRefKey: DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.PK,

                        SAP_FK: authService.getUserInfo().AppPK,
                        TenantCode: authService.getUserInfo().TenantCode,
                        IsModified: true
                    };

                    apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.InitiateProcess.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            var _filter = {
                                PSM_FK: "7f4e8926-0de1-45cc-83fc-bca074278920",
                                WSI_FK: "5b9b32eb-af0d-4169-a026-ff3ba64eb7d8",
                                UserStatus: "WITHIN_KPI_AVAILABLE",
                                EntityRefKey: DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.PK
                            };
                            $location.path("/EA/my-tasks").search({
                                filter: helperService.encryptData(_filter)
                            });
                        }
                    });
                    if (type == "TES") {
                        DamagedSkuToolbarCtrl.ePage.Masters.MoveToTestingWarehouseBtnText = "Move To Testing Warehouse";
                    } else if (type == "SCR") {
                        DamagedSkuToolbarCtrl.ePage.Masters.MoveToScrapWarehouseBtnText = "Move To Scrap Warehouse";
                    } else if (type == "REP") {
                        DamagedSkuToolbarCtrl.ePage.Masters.MoveToRepairWarehouseBtnText = "Move To Repair Warehouse";
                    } else if (type == "SIT") {
                        DamagedSkuToolbarCtrl.ePage.Masters.MoveToSiteWarehouseBtnText = "Move To Site Warehouse";
                    } else if (type == "CEN") {
                        DamagedSkuToolbarCtrl.ePage.Masters.MoveToCentralWarehouseBtnText = "Move To Central Warehouse";
                    }
                    DamagedSkuToolbarCtrl.ePage.Masters.IsMoveToTestingWarehouseBtn = true;
                    helperService.refreshGrid();
                    // });
                } else {
                    toastr.error("Outward Creation Failed. Please try again later");
                    DamagedSkuToolbarCtrl.ePage.Masters.IsMoveToTestingWarehouseBtn = false;
                    if (type == "TES") {
                        DamagedSkuToolbarCtrl.ePage.Masters.MoveToTestingWarehouseBtnText = "Move To Testing Warehouse";
                    } else if (type == "SCR") {
                        DamagedSkuToolbarCtrl.ePage.Masters.MoveToScrapWarehouseBtnText = "Move To Scrap Warehouse";
                    } else if (type == "REP") {
                        DamagedSkuToolbarCtrl.ePage.Masters.MoveToRepairWarehouseBtnText = "Move To Repair Warehouse";
                    } else if (type == "SIT") {
                        DamagedSkuToolbarCtrl.ePage.Masters.MoveToSiteWarehouseBtnText = "Move To Site Warehouse";
                    }
                }
            });
        }

        function ChangePickupStatus(type) {
            var count = 0;
            var TempPickupList = _.groupBy(DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList, 'PickupRequest_FK');
            var TempPickupListCount = _.keys(TempPickupList).length;
            angular.forEach(TempPickupList, function (value2, key2) {
                apiService.get("eAxisAPI", appConfig.Entities.WmsPickupList.API.GetById.Url + key2).then(function (response) {
                    if (response.data.Response) {
                        angular.forEach(value2, function (value, key) {
                            angular.forEach(response.data.Response.UIWmsPickupLine, function (value1, key1) {
                                if (value.PickupLine_FK == value1.PK) {
                                    if (type == "CEN") {
                                        if (value.PickupLineStatus == "Stock at Site Warehouse") {
                                            value1.WorkOrderLineStatus = "MCWS";
                                        } else if (value.PickupLineStatus == "Stock at Testing Warehouse") {
                                            value1.WorkOrderLineStatus = "MCWT";
                                        } else if (value.PickupLineStatus == "Stock at Repair Warehouse") {
                                            value1.WorkOrderLineStatus = "MCWR";
                                        }
                                    } else if (type == "TES") {
                                        // // Add STC Number
                                        // var _filter = {
                                        //     "Type": "STC"
                                        // };
                                        // var _input = {
                                        //     "searchInput": helperService.createToArrayOfObject(_filter),
                                        //     "FilterID": appConfig.Entities.WmsTestID.API.FindAll.FilterID
                                        // };
                                        // apiService.post("eAxisAPI", appConfig.Entities.WmsTestID.API.FindAll.Url, _input).then(function (response) {
                                        //     if (response.data.Response) {
                                        //         if (typeof response.data.Response[0].Value == "string") {
                                        //             response.data.Response[0].Value = JSON.parse(response.data.Response[0].Value);
                                        //         }
                                        //         value1.AdditionalRef2Code = response.data.Response[0].Prefix + response.data.Response[0].Value;
                                        //         value1.AdditionalRef2Type = "STCNo";
                                        //         response.data.Response[0].Value = response.data.Response[0].Value + 1;
                                        //         response.data.Response[0].IsModified = true;
                                        //         apiService.post("eAxisAPI", appConfig.Entities.AppCounter.API.Update.Url, response.data.Response[0]).then(function (response) {
                                        //             if (response.data.Response) {
                                        //             }
                                        //         });
                                        //     }
                                        // });
                                        value1.WorkOrderLineStatus = "MTW";
                                    } else if (type == "SCR") {
                                        value1.WorkOrderLineStatus = "MSW";
                                    } else if (type == "REP") {
                                        value1.WorkOrderLineStatus = "MRW";
                                    } else if (type == "SIT") {
                                        value1.WorkOrderLineStatus = "MSTW";
                                    }

                                }
                            });
                        });
                        $timeout(function () {
                            response.data.Response = filterObjectUpdate(response.data.Response, "IsModified");
                            apiService.post("eAxisAPI", appConfig.Entities.WmsPickupList.API.Update.Url, response.data.Response).then(function (response) {
                                if (response.data.Response) {
                                    toastr.success("Pickup Saved Successfully");
                                    count = count + 1;
                                    if (TempPickupListCount == count) {
                                        ChangesPickupLineStatus(type);
                                    }
                                }
                            });
                        }, 2000);
                    }
                });
            });
        }

        function ChangesPickupLineStatus(type) {
            angular.forEach(DamagedSkuToolbarCtrl.ePage.Masters.SelectedPickupList, function (value, key) {
                var _filter = {
                    "PickupLine_FK": value.PickupLine_FK
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.WmsPickupReport.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", appConfig.Entities.WmsPickupReport.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.length > 0) {
                            response.data.Response[0].IsModified = true;
                            if (type == "CEN") {
                                if (value.PickupLineStatus == "Stock at Site Warehouse") {
                                    response.data.Response[0].STC_FromWH_Code = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.WarehouseCode;
                                    response.data.Response[0].STC_FromWH_F = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.WAR_FK;
                                    response.data.Response[0].STC_FromWH_Name = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.WarehouseName;
                                    response.data.Response[0].STC_OUT_CustomerReference = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.CustomerReference;
                                    response.data.Response[0].STC_OUT_ExternalRefNumber = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.ExternalReference;
                                    response.data.Response[0].STC_OUT_Fk = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.PK;
                                    response.data.Response[0].STC_OUT_RefNo = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.WorkOrderID;
                                    response.data.Response[0].STC_ToWH_Code = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.TransferTo_WAR_Code;
                                    response.data.Response[0].STC_ToWH_Fk = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.TransferTo_WAR_FK;
                                    response.data.Response[0].STC_ToWH_Name = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.TransferTo_WAR_Name;
                                    response.data.Response[0].PickupLineStatus = "MTR Raised from Site to Central Warehouse";
                                } else if (value.PickupLineStatus == "Stock at Testing Warehouse") {
                                    response.data.Response[0].TTC_FromWH_Code = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.WarehouseCode;
                                    response.data.Response[0].TTC_FromWH_Fk = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.WAR_FK;
                                    response.data.Response[0].TTC_FromWH_Name = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.WarehouseName;
                                    response.data.Response[0].TTC_OUT_CustomerReference = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.CustomerReference;
                                    response.data.Response[0].TTC_OUT_ExternalRefNumber = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.ExternalReference;
                                    response.data.Response[0].TTC_OUT_Fk = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.PK;
                                    response.data.Response[0].TTC_OUT_RefNo = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.WorkOrderID;
                                    response.data.Response[0].TTC_ToWH_Code = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.TransferTo_WAR_Code;
                                    response.data.Response[0].TTC_ToWH_Fk = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.TransferTo_WAR_FK;
                                    response.data.Response[0].TTC_ToWH_Name = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.TransferTo_WAR_Name;
                                    response.data.Response[0].PickupLineStatus = "MTR Raised from Testing to Central Warehouse";
                                } else if (value.PickupLineStatus == "Stock at Repair Warehouse") {
                                    response.data.Response[0].RTC_FromWH_Code = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.WarehouseCode;
                                    response.data.Response[0].RTC_FromWH_Fk = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.WAR_FK;
                                    response.data.Response[0].RTC_FromWH_Name = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.WarehouseName;
                                    response.data.Response[0].RTC_CustomerReference = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.CustomerReference;
                                    response.data.Response[0].RTC_OUT_ExternalRefNumber = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.ExternalReference;
                                    response.data.Response[0].RTC_OUT_Fk = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.PK;
                                    response.data.Response[0].RTC_OUT_RefNo = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.WorkOrderID;
                                    response.data.Response[0].RTC_ToWH_Code = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.TransferTo_WAR_Code;
                                    response.data.Response[0].RTC_ToWH_Fk = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.TransferTo_WAR_FK;
                                    response.data.Response[0].RTC_ToWH_Name = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.TransferTo_WAR_Name;
                                    response.data.Response[0].PickupLineStatus = "MTR Raised from Repair to Central Warehouse";
                                }
                            } else if (type == "TES") {
                                response.data.Response[0].CTT_FromWH_Code = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.WarehouseCode;
                                response.data.Response[0].CTT_FromWH_Fk = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.WAR_FK;
                                response.data.Response[0].CTT_FromWH_Name = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.WarehouseName;
                                response.data.Response[0].CTT_OUT_CustomerReference = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.CustomerReference;
                                response.data.Response[0].CTT_OUT_ExternalRefNumber = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.ExternalReference;
                                response.data.Response[0].CTT_OUT_Fk = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.PK;
                                response.data.Response[0].CTT_OUT_RefNo = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.WorkOrderID;
                                response.data.Response[0].CTT_ToWH_Code = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.TransferTo_WAR_Code;
                                response.data.Response[0].CTT_ToWH_Fk = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.TransferTo_WAR_FK;
                                response.data.Response[0].CTT_ToWH_Name = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.TransferTo_WAR_Name;
                                response.data.Response[0].PickupLineStatus = "MTR Raised to Testing Warehouse";
                            } else if (type == "SCR" || type == "REP") {
                                if (type == "SCR")
                                    response.data.Response[0].IsScrapOrRepair = "Scrap";
                                else if (type == "REP")
                                    response.data.Response[0].IsScrapOrRepair = "Repair";
                                response.data.Response[0].CTR_FromWH_Code = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.WarehouseCode;
                                response.data.Response[0].CTR_FromWH_Fk = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.WAR_FK;
                                response.data.Response[0].CTR_FromWH_Name = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.WarehouseName;
                                response.data.Response[0].CTR_CustomerReference = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.CustomerReference;
                                response.data.Response[0].CTR_OUT_ExternalRefNumber = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.ExternalReference;
                                response.data.Response[0].CTR_OUT_Fk = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.PK;
                                response.data.Response[0].CTR_OUT_RefNo = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.WorkOrderID;
                                response.data.Response[0].CTR_ToWH_Code = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.TransferTo_WAR_Code;
                                response.data.Response[0].CTR_ToWH_Fk = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.TransferTo_WAR_FK;
                                response.data.Response[0].CTR_ToWH_Name = DamagedSkuToolbarCtrl.ePage.Masters.OutwardData.UIWmsOutwardHeader.TransferTo_WAR_Name;
                                if (type == "SCR")
                                    response.data.Response[0].PickupLineStatus = "MTR Raised to Scrap Warehouse";
                                else if (type == "REP")
                                    response.data.Response[0].PickupLineStatus = "MTR Raised to Repair Warehouse";
                            }
                            apiService.post("eAxisAPI", appConfig.Entities.WmsPickupReport.API.Update.Url, response.data.Response[0]).then(function (response) {
                                if (response.data.Response) {
                                    console.log("Pickup Report Updated for " + response.data.Response.PickupLineRefNo);
                                }
                            });
                        }
                    }
                });
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