(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CreatePickupChallanController", CreatePickupChallanController);

    CreatePickupChallanController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "dynamicLookupConfig", "inwardConfig", "toastr", "$timeout", "$uibModal", "warehouseConfig"];

    function CreatePickupChallanController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, dynamicLookupConfig, inwardConfig, toastr, $timeout, $uibModal, warehouseConfig) {
        var CreatePickupChallanCtrl = this;

        function Init() {
            CreatePickupChallanCtrl.ePage = {
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
            CreatePickupChallanCtrl.ePage.Masters.activeTabIndex = 0;
            CreatePickupChallanCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            CreatePickupChallanCtrl.ePage.Masters.emptyText = "-";
            if (CreatePickupChallanCtrl.taskObj) {
                CreatePickupChallanCtrl.ePage.Masters.TaskObj = CreatePickupChallanCtrl.taskObj;
                GetEntityObj();
            } else {
                CreatePickupChallanCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Pickup[myTaskActivityConfig.Entities.Pickup.label].ePage.Entities.Header.Data;
                inwardConfig.TabList = [];
                GeneralOperation();
                getInwardList();
                GetDynamicLookupConfig();
                if (errorWarningService.Modules.MyTask)
                    CreatePickupChallanCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Pickup.label];
            }

            CreatePickupChallanCtrl.ePage.Masters.Config = myTaskActivityConfig;

            CreatePickupChallanCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            CreatePickupChallanCtrl.ePage.Masters.DatePicker = {};
            CreatePickupChallanCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            CreatePickupChallanCtrl.ePage.Masters.DatePicker.isOpen = [];
            CreatePickupChallanCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            CreatePickupChallanCtrl.ePage.Masters.CreateInwardText = "Create Inward";
            CreatePickupChallanCtrl.ePage.Masters.AddToInwardText = "Add to Existing Inward";
            // CreatePickupChallanCtrl.ePage.Masters.CreateMaterialTransferText = "Create Material Transfer";
            CreatePickupChallanCtrl.ePage.Masters.CreateInward = CreateInward;
            CreatePickupChallanCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            CreatePickupChallanCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            CreatePickupChallanCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            CreatePickupChallanCtrl.ePage.Masters.CallIsReload = CallIsReload;

            CreatePickupChallanCtrl.ePage.Masters.AddToInward = AddToInward;
            CreatePickupChallanCtrl.ePage.Masters.CloseEditActivityModal = CloseEditActivityModal;
            CreatePickupChallanCtrl.ePage.Masters.setSelectedInwardRow = setSelectedInwardRow;
            CreatePickupChallanCtrl.ePage.Masters.AddPickupLineToInward = AddPickupLineToInward;
        }
        // #region - Add to Existing Inward
        function AddToInward() {
            var count = 0;
            angular.forEach(CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIvwWmsPickupLine, function (value, key) {
                if (value.SingleSelect) {
                    count = count + 1;
                    // value.SingleSelect = false;
                }
            });
            if (count > 0) {
                var SelectedLine = [];
                var _filter = {
                    "WOD_Parent_FK": CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.PK
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": warehouseConfig.Entities.WmsInward.API.FindAll.FilterID
                };
                apiService.post("eAxisAPI", warehouseConfig.Entities.WmsInward.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.length > 0) {
                            CreatePickupChallanCtrl.ePage.Masters.UnFinalizedOrders = [];
                            CreatePickupChallanCtrl.ePage.Masters.InwardList = response.data.Response;
                            CreatePickupChallanCtrl.ePage.Masters.UnFinalizedOrders = [];
                            angular.forEach(CreatePickupChallanCtrl.ePage.Masters.InwardList, function (v, k) {
                                if (v.WorkOrderStatus != "FIN") {
                                    CreatePickupChallanCtrl.ePage.Masters.UnFinalizedOrders.push(v);
                                }
                            });
                            if (CreatePickupChallanCtrl.ePage.Masters.UnFinalizedOrders.length > 0) {
                                CreatePickupChallanCtrl.ePage.Masters.TempSelectedPickupLine = [];
                                angular.forEach(CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIvwWmsPickupLine, function (value1, key1) {
                                    if (value1.SingleSelect == true) {
                                        SelectedLine.push(value1);
                                        if (value1.IL_PrdCode) {
                                            toastr.warning("This Pickup line " + value1.PL_AdditionalRef1Code + " already attached to inward " + value1.INW_WorkOrderId);
                                        } else {
                                            CreatePickupChallanCtrl.ePage.Masters.TempSelectedPickupLine.push(value1);
                                        }
                                    }
                                });

                                if (CreatePickupChallanCtrl.ePage.Masters.TempSelectedPickupLine.length == SelectedLine.length) {
                                    OpenModal();
                                }
                            } else {
                                toastr.warning("It can be added when the Order(s) is not Finalized.")
                            }
                        } else {
                            toastr.warning("Order not yet created.")
                        }
                    }
                });
            } else {
                toastr.warning("Select atleast one pickup line.");
            }
        }
        function AddPickupLineToInward() {
            CreatePickupChallanCtrl.ePage.Masters.modalInstance1.dismiss('cancel');
            if (CreatePickupChallanCtrl.ePage.Masters.selectedInwardRow >= 0) {
                CreatePickupChallanCtrl.ePage.Masters.Loading = true;
                apiService.get("eAxisAPI", warehouseConfig.Entities.WmsInwardList.API.GetById.Url + CreatePickupChallanCtrl.ePage.Masters.UnFinalizedOrders[CreatePickupChallanCtrl.ePage.Masters.selectedInwardRow].PK).then(function (response) {
                    if (response.data.Response) {
                        angular.forEach(CreatePickupChallanCtrl.ePage.Masters.TempSelectedPickupLine, function (value, key) {
                            value.IL_PrdCode = value.PL_Req_PrdCode;
                            value.SingleSelect = false;
                            var obj = {
                                "PK": "",
                                "Parent_FK": value.PL_PK,
                                "Client_FK": value.PIC_ClientFk,
                                "ORG_ClientCode": value.PIC_ClientCode,
                                "ORG_ClientName": value.PIC_ClientName,
                                "ProductCode": value.PL_Req_PrdCode,
                                "ProductDescription": value.PL_Req_PrdDesc,
                                "ProductCondition": value.PL_ProductCondition,
                                "POR_FK": value.PL_Req_PrdPk,
                                "Packs": value.PL_Packs,
                                "PAC_PackType": value.PL_PAC_PackType,
                                "Quantity": value.PL_Units,
                                "StockKeepingUnit": value.PL_StockKeepingUnit,
                                "PalletId": value.PL_PalletID,
                                "PartAttrib1": value.PL_PartAttrib1,
                                "PartAttrib2": value.PL_PartAttrib2,
                                "PartAttrib3": value.PL_PartAttrib3,
                                "PackingDate": value.PL_PackingDate,
                                "ExpiryDate": value.PL_ExpiryDate,
                                "AdditionalRef1Code": value.PL_AdditionalRef1Code,
                                "AdditionalRef1Type": "PickupLine",
                                "AdditionalRef1Fk": value.PL_PK,
                                "UseExpiryDate": value.PIC_UseExpiryDate,
                                "UsePackingDate": value.PIC_UsePackingDate,
                                "UsePartAttrib1": value.PIC_UsePartAttrib1,
                                "UsePartAttrib2": value.PIC_UsePartAttrib2,
                                "UsePartAttrib3": value.PIC_UsePartAttrib3
                            };
                            response.data.Response.UIWmsAsnLine.push(obj);
                        });
                        response.data.Response = filterObjectUpdate(response.data.Response, "IsModified");
                        apiService.post("eAxisAPI", warehouseConfig.Entities.WmsInwardList.API.Update.Url, response.data.Response).then(function (response) {
                            if (response.data.Status == 'Success') {
                                CreatePickupChallanCtrl.ePage.Masters.InwardDetails = response.data.Response;
                                toastr.success("Pickup Line added to the Order " + CreatePickupChallanCtrl.ePage.Masters.InwardDetails.UIWmsInwardHeader.WorkOrderID);
                                CreatePickupChallanCtrl.ePage.Masters.Loading = false;
                                inwardConfig.TabList = [];
                                angular.forEach(CreatePickupChallanCtrl.ePage.Masters.InwardList, function (value, key) {
                                    myTaskActivityConfig.CallEntity = true;
                                    AddTab(value, false);
                                });
                            }
                        });
                    }
                });
            } else {
                toastr.warning("Select the Order");
            }
            CreatePickupChallanCtrl.ePage.Masters.modalInstance1.dismiss('cancel');
        }
        function setSelectedInwardRow(index) {
            CreatePickupChallanCtrl.ePage.Masters.selectedInwardRow = index;
        }
        function OpenModal() {
            return CreatePickupChallanCtrl.ePage.Masters.modalInstance1 = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "success-popup1",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/warehouse/my-task/my-task-directive/create-pickup-challan/inward-details.html"
            });
        }
        function CloseEditActivityModal() {
            CreatePickupChallanCtrl.ePage.Masters.modalInstance1.dismiss('cancel');
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
        // #endregion
        // #region - checkbox selection
        function SelectAllCheckBox() {
            angular.forEach(CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIvwWmsPickupLine, function (value, key) {
                if (CreatePickupChallanCtrl.ePage.Masters.SelectAll) {
                    // Enable and disable based on page wise
                    value.SingleSelect = true;
                } else {
                    value.SingleSelect = false;
                }
            });
        }

        function SingleSelectCheckBox() {
            var Checked = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIvwWmsPickupLine.some(function (value, key) {
                // Enable and disable based on page wise
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                CreatePickupChallanCtrl.ePage.Masters.SelectAll = false;
            } else {
                CreatePickupChallanCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIvwWmsPickupLine.some(function (value, key) {
                return value.SingleSelect == true;
            });
        }
        // #endregion
        // #region - show the created inward
        function getInwardList() {
            var _filter = {
                "WOD_Parent_FK": CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": warehouseConfig.Entities.WmsInward.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", warehouseConfig.Entities.WmsInward.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    CreatePickupChallanCtrl.ePage.Masters.InwardList = response.data.Response;
                    inwardConfig.ValidationFindall();
                    angular.forEach(CreatePickupChallanCtrl.ePage.Masters.InwardList, function (value, key) {
                        AddTab(value, false);
                    });
                }
            });
        }
        // #endregion
        // #region - create inward
        function CreateInward() {
            inwardConfig.ValidationFindall();
            if (CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIvwWmsPickupLine.length > 0) {
                var count = 0;
                CreatePickupChallanCtrl.ePage.Masters.SelectedPickupLine = [];
                CreatePickupChallanCtrl.ePage.Masters.SelectAll = false;
                angular.forEach(CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIvwWmsPickupLine, function (value, key) {
                    if (value.SingleSelect) {
                        count = count + 1;
                        CreatePickupChallanCtrl.ePage.Masters.SelectedPickupLine.push(value);
                        value.SingleSelect = false;
                    }
                });
                if (count > 0) {
                    var temp = 0;
                    CreatePickupChallanCtrl.ePage.Masters.TempCSR = '';
                    angular.forEach(CreatePickupChallanCtrl.ePage.Masters.SelectedPickupLine, function (value, key) {
                        if (value.IL_PrdCode) {
                            temp = temp + 1;
                            CreatePickupChallanCtrl.ePage.Masters.TempCSR = CreatePickupChallanCtrl.ePage.Masters.TempCSR + value.PL_AdditionalRef1Code + ",";
                        }
                    });
                    CreatePickupChallanCtrl.ePage.Masters.TempCSR = CreatePickupChallanCtrl.ePage.Masters.TempCSR.slice(0, -1);
                    if (temp == 0) {
                        var _isExist = inwardConfig.TabList.some(function (value) {
                            if (value.label === "New")
                                return true;
                            else
                                return false;
                        });
                        if (!_isExist) {
                            CreatePickupChallanCtrl.ePage.Masters.CreateInwardText = "Please Wait..";
                            CreatePickupChallanCtrl.ePage.Masters.IsDisabled = true;
                            helperService.getFullObjectUsingGetById(warehouseConfig.Entities.WmsInwardList.API.GetById.Url, 'null').then(function (response) {
                                if (response.data.Response) {
                                    response.data.Response.Response.UIWmsInwardHeader.ClientCode = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientCode;
                                    response.data.Response.Response.UIWmsInwardHeader.ClientName = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientName;
                                    response.data.Response.Response.UIWmsInwardHeader.Client = CreatePickupChallanCtrl.ePage.Masters.Client;
                                    response.data.Response.Response.UIWmsInwardHeader.Supplier = CreatePickupChallanCtrl.ePage.Masters.Consignee;
                                    response.data.Response.Response.UIWmsInwardHeader.SupplierCode = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeCode;
                                    response.data.Response.Response.UIWmsInwardHeader.SupplierName = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeName;
                                    response.data.Response.Response.UIWmsInwardHeader.ORG_Client_FK = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ORG_Client_FK;
                                    response.data.Response.Response.UIWmsInwardHeader.ORG_Supplier_FK = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ORG_Consignee_FK;
                                    response.data.Response.Response.UIWmsInwardHeader.WAR_FK = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.WAR_FK;
                                    response.data.Response.Response.UIWmsInwardHeader.Warehouse = CreatePickupChallanCtrl.ePage.Masters.Warehouse;
                                    response.data.Response.Response.UIWmsInwardHeader.WarehouseCode = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseCode;
                                    response.data.Response.Response.UIWmsInwardHeader.WarehouseName = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseName;
                                    response.data.Response.Response.UIWmsInwardHeader.AdditionalRef2Fk = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.PK;
                                    response.data.Response.Response.UIWmsInwardHeader.WorkOrderType = "INW";
                                    response.data.Response.Response.UIWmsInwardHeader.WorkOrderSubType = "REC";
                                    response.data.Response.Response.UIWmsInwardHeader.WOD_Parent_FK = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.PK;

                                    response.data.Response.Response.UIOrgHeader = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIOrgHeader;
                                    response.data.Response.Response.UIJobAddress = angular.copy(CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIJobAddress);
                                    angular.forEach(response.data.Response.Response.UIJobAddress, function (value, key) {
                                        value.PK = "";
                                        if (value.AddressType == "CED")
                                            value.AddressType = "SUD";
                                    });
                                    angular.forEach(CreatePickupChallanCtrl.ePage.Masters.SelectedPickupLine, function (value, key) {
                                        value.IL_PrdCode = value.PL_Req_PrdCode;
                                        var obj = {
                                            "PK": "",
                                            "Parent_FK": value.PL_PK,
                                            "Client_FK": value.PIC_ClientFk,
                                            "ORG_ClientCode": value.PIC_ClientCode,
                                            "ORG_ClientName": value.PIC_ClientName,
                                            "ProductCode": value.PL_Req_PrdCode,
                                            "ProductDescription": value.PL_Req_PrdDesc,
                                            "ProductCondition": value.PL_ProductCondition,
                                            "POR_FK": value.PL_Req_PrdPk,
                                            "Packs": value.PL_Packs,
                                            "PAC_PackType": value.PL_PAC_PackType,
                                            "Quantity": value.PL_Units,
                                            "StockKeepingUnit": value.PL_StockKeepingUnit,
                                            "PalletId": value.PL_PalletID,
                                            "PartAttrib1": value.PL_PartAttrib1,
                                            "PartAttrib2": value.PL_PartAttrib2,
                                            "PartAttrib3": value.PL_PartAttrib3,
                                            "PackingDate": value.PL_PackingDate,
                                            "ExpiryDate": value.PL_ExpiryDate,
                                            "AdditionalRef1Code": value.PL_AdditionalRef1Code,
                                            "AdditionalRef1Type": "PickupLine",
                                            "AdditionalRef1Fk": value.PL_PK,
                                            "UseExpiryDate": value.PIC_UseExpiryDate,
                                            "UsePackingDate": value.PIC_UsePackingDate,
                                            "UsePartAttrib1": value.PIC_UsePartAttrib1,
                                            "UsePartAttrib2": value.PIC_UsePartAttrib2,
                                            "UsePartAttrib3": value.PIC_UsePartAttrib3
                                        };
                                        response.data.Response.Response.UIWmsAsnLine.push(obj);
                                    });

                                    var _obj = {
                                        entity: response.data.Response.Response.UIWmsInwardHeader,
                                        data: response.data.Response.Response,
                                        Validations: response.data.Response.Validations
                                    };
                                    myTaskActivityConfig.CallEntity = true;
                                    AddTab(_obj, true);
                                    CreatePickupChallanCtrl.ePage.Masters.CreateInwardText = "Create Inward";
                                    CreatePickupChallanCtrl.ePage.Masters.IsDisabled = false;
                                }
                            });
                        }
                    } else {
                        toastr.warning("Can not create Inward for this CSR No " + CreatePickupChallanCtrl.ePage.Masters.TempCSR);
                    }
                } else {
                    toastr.warning("Inward can be created by selecting atleast one pickup line");
                }
            } else {
                toastr.warning("Inward can be created when the pickup line is available");
            }
        }

        function AddTab(currentPickup, isNew) {
            CreatePickupChallanCtrl.ePage.Masters.currentPickup = undefined;

            var _isExist = inwardConfig.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentPickup.WorkOrderID)
                        return true;
                    else
                        return false;
                } else {
                    if (value.label === "New")
                        return true;
                    else
                        return false;
                }
            });

            if (!_isExist) {
                CreatePickupChallanCtrl.ePage.Masters.IsTabClick = true;
                var _currentPickup = undefined;
                if (!isNew) {
                    _currentPickup = currentPickup;
                } else {
                    _currentPickup = currentPickup;
                }

                inwardConfig.GetTabDetails(_currentPickup, isNew).then(function (response) {
                    CreatePickupChallanCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        CreatePickupChallanCtrl.ePage.Masters.activeTabIndex = CreatePickupChallanCtrl.ePage.Masters.TabList.length;
                        if (isNew)
                            CurrentActiveTab(currentPickup.entity.WorkOrderID);
                        else
                            CurrentActiveTab(currentPickup.WorkOrderID);
                        CreatePickupChallanCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Pickup already opened ');
            }
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            CreatePickupChallanCtrl.ePage.Masters.currentPickup = currentTab;
        }
        // #endregion
        // #region - General
        function GeneralOperation() {
            // Client
            if (CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientCode == null)
                CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientCode = "";
            if (CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientName == null)
                CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientName = "";
            CreatePickupChallanCtrl.ePage.Masters.Client = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientCode + ' - ' + CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientName;
            if (CreatePickupChallanCtrl.ePage.Masters.Client == " - ")
                CreatePickupChallanCtrl.ePage.Masters.Client = "";
            // Consignee
            if (CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeCode == null)
                CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeCode = "";
            if (CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeName == null)
                CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeName = "";
            CreatePickupChallanCtrl.ePage.Masters.Consignee = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeCode + ' - ' + CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeName;
            if (CreatePickupChallanCtrl.ePage.Masters.Consignee == " - ")
                CreatePickupChallanCtrl.ePage.Masters.Consignee = "";
            // Warehouse
            if (CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseCode == null)
                CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseCode = "";
            if (CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseName == null)
                CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseName = "";
            CreatePickupChallanCtrl.ePage.Masters.Warehouse = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseCode + ' - ' + CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseName;
            if (CreatePickupChallanCtrl.ePage.Masters.Warehouse == " - ")
                CreatePickupChallanCtrl.ePage.Masters.Warehouse = "";
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
                Code: [myTaskActivityConfig.Entities.Pickup.label],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "WMS",
                    SubModuleCode: "PIR",
                    // Code: "E0013"
                },
                EntityObject: CreatePickupChallanCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            CreatePickupChallanCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (CreatePickupChallanCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", warehouseConfig.Entities.WmsPickup.API.GetById.Url + CreatePickupChallanCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        CreatePickupChallanCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        function CallIsReload() {
            CreatePickupChallanCtrl.ePage.Masters.Config.IsReload = false;
            CreatePickupChallanCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Pickup[myTaskActivityConfig.Entities.Pickup.label].ePage.Entities.Header.Data;
        }
        // #endregion
        Init();
    }
})();