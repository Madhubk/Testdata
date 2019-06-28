(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CreateDelChallanController", CreateDelChallanController);

    CreateDelChallanController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "dynamicLookupConfig", "outwardConfig", "toastr", "$timeout", "$uibModal", "$filter", "warehouseConfig"];

    function CreateDelChallanController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, dynamicLookupConfig, outwardConfig, toastr, $timeout, $uibModal, $filter, warehouseConfig) {
        var CreateDelChallanCtrl = this;

        function Init() {
            CreateDelChallanCtrl.ePage = {
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
            CreateDelChallanCtrl.ePage.Masters.activeTabIndex = 0;
            CreateDelChallanCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            CreateDelChallanCtrl.ePage.Masters.emptyText = "-";
            if (CreateDelChallanCtrl.taskObj) {
                CreateDelChallanCtrl.ePage.Masters.TaskObj = CreateDelChallanCtrl.taskObj;
                GetEntityObj();
            } else {
                CreateDelChallanCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data;
                outwardConfig.TabList = [];
                GeneralOperation();
                getOutwardList();
                GetDynamicLookupConfig();
                DefaultFilter();
                if (errorWarningService.Modules.MyTask)
                    CreateDelChallanCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Delivery.label];
            }

            CreateDelChallanCtrl.ePage.Masters.Config = myTaskActivityConfig;

            CreateDelChallanCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            CreateDelChallanCtrl.ePage.Masters.DatePicker = {};
            CreateDelChallanCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            CreateDelChallanCtrl.ePage.Masters.DatePicker.isOpen = [];
            CreateDelChallanCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            CreateDelChallanCtrl.ePage.Masters.CreateOutwardText = "Create Outward";
            CreateDelChallanCtrl.ePage.Masters.CreateMaterialTransferText = "Create Material Transfer";
            CreateDelChallanCtrl.ePage.Masters.AddToOutwardText = "Add to Existing Order";
            CreateDelChallanCtrl.ePage.Masters.CreateOutward = CreateOutward;
            CreateDelChallanCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            CreateDelChallanCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            CreateDelChallanCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            CreateDelChallanCtrl.ePage.Masters.CallIsReload = CallIsReload;
            CreateDelChallanCtrl.ePage.Masters.Close = Close;
            CreateDelChallanCtrl.ePage.Masters.SelectedLookupWarehouse = SelectedLookupWarehouse;
            CreateDelChallanCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            CreateDelChallanCtrl.ePage.Masters.CreateMaterial = CreateMaterial;
            CreateDelChallanCtrl.ePage.Masters.AddToOutward = AddToOutward;
            CreateDelChallanCtrl.ePage.Masters.CloseEditActivityModal = CloseEditActivityModal;
            CreateDelChallanCtrl.ePage.Masters.setSelectedOutwardRow = setSelectedOutwardRow;
            CreateDelChallanCtrl.ePage.Masters.AddDeliveryLineToOutward = AddDeliveryLineToOutward;
            // Filter
            CreateDelChallanCtrl.ePage.Masters.GetFilterList = GetFilterList;
            CreateDelChallanCtrl.ePage.Masters.CloseFilterList = CloseFilterList;
            CreateDelChallanCtrl.ePage.Masters.Filter = Filter;

        }

        // #region - Add to Existing Outward
        function AddToOutward() {
            var count = 0;
            angular.forEach(CreateDelChallanCtrl.ePage.Entities.Header.Data.UIvwWmsDeliveryList, function (value, key) {
                if (value.SingleSelect) {
                    count = count + 1;
                    // value.SingleSelect = false;
                }
            });
            if (count > 0) {
                var SelectedLine = [];
                var _filter = {
                    "WOD_Parent_FK": CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.PK
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": warehouseConfig.Entities.WmsOutward.API.FindAll.FilterID
                };
                apiService.post("eAxisAPI", warehouseConfig.Entities.WmsOutward.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.length > 0) {
                            CreateDelChallanCtrl.ePage.Masters.UnFinalizedOrders = [];
                            CreateDelChallanCtrl.ePage.Masters.OutwardList = response.data.Response;
                            CreateDelChallanCtrl.ePage.Masters.UnFinalizedOrders = [];
                            angular.forEach(CreateDelChallanCtrl.ePage.Masters.OutwardList, function (v, k) {
                                if (v.WorkOrderStatus != "FIN") {
                                    CreateDelChallanCtrl.ePage.Masters.UnFinalizedOrders.push(v);
                                }
                            });
                            if (CreateDelChallanCtrl.ePage.Masters.UnFinalizedOrders.length > 0) {
                                CreateDelChallanCtrl.ePage.Masters.SelectedDelLine = [];
                                angular.forEach(CreateDelChallanCtrl.ePage.Entities.Header.Data.UIvwWmsDeliveryList, function (value1, key1) {
                                    if (value1.SingleSelect == true) {
                                        SelectedLine.push(value1);
                                        if (value1.MOL_PrdCode || value1.OL_PrdCode) {
                                            var TempOutwardNo = value1.MOL_PrdCode ? value1.MOT_WorkOrderId : value1.OUT_WorkOrderId;
                                            toastr.warning("This Delivery line " + value1.DL_AdditionalRef1Code + " already attached to outward " + TempOutwardNo);
                                        } else {
                                            CreateDelChallanCtrl.ePage.Masters.SelectedDelLine.push(value1);
                                        }
                                    }
                                });

                                if (CreateDelChallanCtrl.ePage.Masters.SelectedDelLine.length == SelectedLine.length) {
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
                toastr.warning("Select atleast one delivery line.");
            }
        }
        function AddDeliveryLineToOutward() {
            CreateDelChallanCtrl.ePage.Masters.modalInstance1.dismiss('cancel');
            if (CreateDelChallanCtrl.ePage.Masters.selectedOutwardRow >= 0) {
                CreateDelChallanCtrl.ePage.Masters.Loading = true;
                apiService.get("eAxisAPI", warehouseConfig.Entities.WmsOutwardList.API.GetById.Url + CreateDelChallanCtrl.ePage.Masters.UnFinalizedOrders[CreateDelChallanCtrl.ePage.Masters.selectedOutwardRow].PK).then(function (response) {
                    if (response.data.Response) {
                        angular.forEach(CreateDelChallanCtrl.ePage.Masters.SelectedDelLine, function (value, key) {
                            if (CreateDelChallanCtrl.ePage.Masters.UnFinalizedOrders[CreateDelChallanCtrl.ePage.Masters.selectedOutwardRow].WorkOrderSubType == "MTR") {
                                value.MOL_PrdCode = value.DL_Req_PrdCode;
                            } else {
                                value.OL_PrdCode = value.DL_Req_PrdCode;
                            }
                            value.SingleSelect = false;
                            var obj = {
                                "Parent_FK": value.DL_PK,
                                "PK": "",
                                "WorkOrderType": "ORD",
                                "WorkOrderLineType": "ORD",
                                "WorkOrderID": response.data.Response.UIWmsOutwardHeader.WorkOrderID,
                                "ExternalReference": response.data.Response.UIWmsOutwardHeader.WorkOrderID,
                                "WOD_FK": response.data.Response.PK,
                                "ProductCode": value.DL_Req_PrdCode,
                                "ProductDescription": value.DL_Req_PrdDesc,
                                "PRO_FK": value.DL_Req_PrdPk,
                                "Commodity": value.Commodity,
                                "MCC_NKCommodityCode": value.DL_MCC_NKCommodityCode,
                                "MCC_NKCommodityDesc": value.DL_MCC_NKCommodityDesc,
                                "ProductCondition": "GDC",
                                "Packs": value.DL_Packs,
                                "PAC_PackType": value.DL_PAC_PackType,
                                "Units": value.DL_Units,
                                "StockKeepingUnit": value.DL_StockKeepingUnit,
                                "PartAttrib1": value.DL_PartAttrib1,
                                "PartAttrib2": value.DL_PartAttrib2,
                                "PartAttrib3": value.DL_PartAttrib3,
                                "LineComment": value.DL_LineComment,
                                "PackingDate": value.DL_PackingDate,
                                "ExpiryDate": value.DL_ExpiryDate,
                                "AdditionalRef1Code": value.DL_AdditionalRef1Code,
                                "AdditionalRef1Type": "DeliveryLine",
                                "AdditionalRef1Fk": value.DL_PK,
                                "UseExpiryDate": value.DL_UseExpiryDate,
                                "UsePackingDate": value.DL_UsePackingDate,
                                "UsePartAttrib1": value.DL_UsePartAttrib1,
                                "UsePartAttrib2": value.DL_UsePartAttrib2,
                                "UsePartAttrib3": value.DL_UsePartAttrib3,
                                "IsPartAttrib1ReleaseCaptured": value.DL_IsPartAttrib1ReleaseCaptured,
                                "IsPartAttrib2ReleaseCaptured": value.DL_IsPartAttrib2ReleaseCaptured,
                                "IsPartAttrib3ReleaseCaptured": value.DL_IsPartAttrib3ReleaseCaptured,

                                "IsDeleted": false,
                                "ORG_ClientCode": value.DEL_ClientCode,
                                "ORG_ClientName": value.DEL_ClientName,
                                "Client_FK": value.DEL_Client_FK,

                                "WAR_WarehouseCode": value.DEL_WAR_Code,
                                "WAR_WarehouseName": value.DEL_WAR_Name,
                                "WAR_FK": value.DEL_WAR_FK,
                            };
                            response.data.Response.UIWmsWorkOrderLine.push(obj);
                        });
                        response.data.Response = filterObjectUpdate(response.data.Response, "IsModified");
                        apiService.post("eAxisAPI", warehouseConfig.Entities.WmsOutwardList.API.Update.Url, response.data.Response).then(function (response) {
                            if (response.data.Status == 'Success') {
                                CreateDelChallanCtrl.ePage.Masters.OutwardDetails = response.data.Response;
                                toastr.success("Delivery Line added to the Order " + CreateDelChallanCtrl.ePage.Masters.OutwardDetails.UIWmsOutwardHeader.WorkOrderID);
                                CreateDelChallanCtrl.ePage.Masters.Loading = false;
                                outwardConfig.TabList = [];
                                angular.forEach(CreateDelChallanCtrl.ePage.Masters.OutwardList, function (value, key) {
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
            CreateDelChallanCtrl.ePage.Masters.modalInstance1.dismiss('cancel');
        }
        function setSelectedOutwardRow(index) {
            CreateDelChallanCtrl.ePage.Masters.selectedOutwardRow = index;
        }
        function OpenModal() {
            return CreateDelChallanCtrl.ePage.Masters.modalInstance1 = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "success-popup1",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/warehouse/my-task/my-task-directive/create-delivery-challan/outward-details.html"
            });
        }
        function CloseEditActivityModal() {
            CreateDelChallanCtrl.ePage.Masters.modalInstance1.dismiss('cancel');
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
        // #region - lookup 
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

        function SelectedLookupWarehouse(item) {
            CreateDelChallanCtrl.ePage.Masters.Warehouse = item.WarehouseCode + " - " + item.WarehouseName;
            CreateDelChallanCtrl.ePage.Masters.WarehouseCode = item.WarehouseCode;
            CreateDelChallanCtrl.ePage.Masters.WarehouseName = item.WarehouseName;
            CreateDelChallanCtrl.ePage.Masters.WAR_PK = item.PK;
        }

        function GeneralOperation() {
            // Client
            if (CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode == null)
                CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode = "";
            if (CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientName == null)
                CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientName = "";
            CreateDelChallanCtrl.ePage.Masters.Client = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode + ' - ' + CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientName;
            if (CreateDelChallanCtrl.ePage.Masters.Client == " - ")
                CreateDelChallanCtrl.ePage.Masters.Client = "";
            // Consignee
            if (CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeCode == null)
                CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeCode = "";
            if (CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeName == null)
                CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeName = "";
            CreateDelChallanCtrl.ePage.Masters.Consignee = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeCode + ' - ' + CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeName;
            if (CreateDelChallanCtrl.ePage.Masters.Consignee == " - ")
                CreateDelChallanCtrl.ePage.Masters.Consignee = "";
            // Warehouse
            if (CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode == null)
                CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode = "";
            if (CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseName == null)
                CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseName = "";
            CreateDelChallanCtrl.ePage.Masters.WarehouseCodeName = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode + ' - ' + CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseName;
            if (CreateDelChallanCtrl.ePage.Masters.WarehouseCodeName == " - ")
                CreateDelChallanCtrl.ePage.Masters.WarehouseCodeName = "";
        }
        // #endregion
        // #region checkbox selection
        function SelectAllCheckBox() {
            angular.forEach(CreateDelChallanCtrl.ePage.Entities.Header.Data.UIvwWmsDeliveryList, function (value, key) {
                if (CreateDelChallanCtrl.ePage.Masters.SelectAll) {
                    // Enable and disable based on page wise
                    value.SingleSelect = true;
                } else {
                    value.SingleSelect = false;
                }
            });
            setSelectedRow();
        }

        function SingleSelectCheckBox() {
            var Checked = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIvwWmsDeliveryList.some(function (value, key) {
                // Enable and disable based on page wise
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                CreateDelChallanCtrl.ePage.Masters.SelectAll = false;
            } else {
                CreateDelChallanCtrl.ePage.Masters.SelectAll = true;
            }
            setSelectedRow();
        }

        function setSelectedRow() {
            var SelectedDeliveryLine = [];
            angular.forEach(CreateDelChallanCtrl.ePage.Entities.Header.Data.UIvwWmsDeliveryList, function (value, key) {
                if (value.SingleSelect) {
                    SelectedDeliveryLine.push(value);
                }
            });
            var TempSelectedDeliveryLine = _.groupBy(SelectedDeliveryLine, 'DL_Req_PrdCode');
            var TempProduct = "";
            angular.forEach(TempSelectedDeliveryLine, function (value, key) {
                TempProduct = TempProduct + key + ",";
            });
            TempProduct = TempProduct.slice(0, -1);
            CreateDelChallanCtrl.ePage.Masters.SelectedInv = []
            angular.forEach(TempSelectedDeliveryLine, function (value, key) {
                CreateDelChallanCtrl.ePage.Masters.SelectedInv = CreateDelChallanCtrl.ePage.Masters.SelectedInv.concat($filter('filter')(CreateDelChallanCtrl.ePage.Masters.InventoryDetails, function (val1, key1) {
                    return val1.ProductCode == key
                }));
            });
            CreateDelChallanCtrl.ePage.Masters.MainInventory = CreateDelChallanCtrl.ePage.Masters.SelectedInv;
        }
        // #endregion
        // #region Create Outward or MTR
        function CreateMaterial() {
            if (CreateDelChallanCtrl.ePage.Masters.WarehouseCode) {
                if (CreateDelChallanCtrl.ePage.Masters.WarehouseCode == CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode) {
                    toastr.warning("Transfer From and To warehouse's are same. Select another warehouse");
                } else {
                    CreateDelChallanCtrl.ePage.Masters.modalInstance.close('MTR');
                }
            } else {
                toastr.warning("Please enter Transfer From Warehouse");
            }
        }

        function CreateOutward(type) {
            outwardConfig.ValidationFindall();
            if (CreateDelChallanCtrl.ePage.Entities.Header.Data.UIvwWmsDeliveryList.length > 0) {
                var count = 0;
                CreateDelChallanCtrl.ePage.Masters.SelectedDeliveryLine = [];
                CreateDelChallanCtrl.ePage.Masters.SelectAll = false;
                angular.forEach(CreateDelChallanCtrl.ePage.Entities.Header.Data.UIvwWmsDeliveryList, function (value, key) {
                    if (value.SingleSelect) {
                        count = count + 1;
                        CreateDelChallanCtrl.ePage.Masters.SelectedDeliveryLine.push(value);
                        // value.SingleSelect = false;
                    }
                });
                if (count > 0) {
                    var temp = 0;
                    CreateDelChallanCtrl.ePage.Masters.TempCSR = '';
                    angular.forEach(CreateDelChallanCtrl.ePage.Masters.SelectedDeliveryLine, function (value, key) {
                        if (value.OL_PrdCode || value.MOL_PrdCode) {
                            temp = temp + 1;
                            CreateDelChallanCtrl.ePage.Masters.TempCSR = CreateDelChallanCtrl.ePage.Masters.TempCSR + value.DL_AdditionalRef1Code + ",";
                        }
                    });
                    CreateDelChallanCtrl.ePage.Masters.TempCSR = CreateDelChallanCtrl.ePage.Masters.TempCSR.slice(0, -1);
                    if (temp == 0) {
                        CreateDelChallanCtrl.ePage.Masters.SelectedInventory = [];
                        CreateDelChallanCtrl.ePage.Masters.WarehouseInventory = [];
                        CreateDelChallanCtrl.ePage.Masters.NotWarehouseInventory = [];
                        var TempSelectedLine = _.groupBy(CreateDelChallanCtrl.ePage.Masters.SelectedDeliveryLine, 'DL_Req_PrdCode');
                        angular.forEach(TempSelectedLine, function (value, key) {
                            CreateDelChallanCtrl.ePage.Masters.SelectedInventory = CreateDelChallanCtrl.ePage.Masters.SelectedInventory.concat($filter('filter')(CreateDelChallanCtrl.ePage.Masters.InventoryDetails, function (val1, key1) {
                                return val1.ProductCode == key
                            }));
                            CreateDelChallanCtrl.ePage.Masters.WarehouseInventory = CreateDelChallanCtrl.ePage.Masters.WarehouseInventory.concat($filter('filter')(CreateDelChallanCtrl.ePage.Masters.SelectedInventory, function (val1, key1) {
                                return (val1.ProductCode == key && val1.WAR_WarehouseCode == CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode)
                            }));
                            CreateDelChallanCtrl.ePage.Masters.NotWarehouseInventory = CreateDelChallanCtrl.ePage.Masters.NotWarehouseInventory.concat($filter('filter')(CreateDelChallanCtrl.ePage.Masters.SelectedInventory, function (val1, key1) {
                                return ((val1.ProductCode == key) && (val1.WAR_WarehouseCode != CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode))
                            }));
                        });

                        if (type == "OUT") {
                            var TempWarInv = _.groupBy(CreateDelChallanCtrl.ePage.Masters.WarehouseInventory, 'ProductCode');
                            var TempWarInvCount = _.keys(TempWarInv).length;
                            var TempSelectedLineCount = _.keys(TempSelectedLine).length;
                            if (TempWarInvCount == TempSelectedLineCount) {
                                GoToOutwardCreation(type);
                            } else {
                                $uibModal.open({
                                    templateUrl: 'myModalInventoryContent.html',
                                    windowClass: "success-popup",
                                    controller: function ($scope, $uibModalInstance) {
                                        $scope.close = function () {
                                            $uibModalInstance.dismiss('cancel');
                                            toastr.warning("Inventory not available for this product(s)");
                                        };
                                        $scope.ok = function () {
                                            $uibModalInstance.dismiss('cancel');
                                            GoToOutwardCreation(type);
                                        }
                                    }
                                });
                            }
                        } else if (type == "MTR") {
                            var TempWar = _.groupBy(CreateDelChallanCtrl.ePage.Masters.WarehouseInventory, 'ProductCode');
                            var TempWarCount = _.keys(TempWar).length;
                            // if (TempWarCount == 0) {
                            var TempWarInv = _.groupBy(CreateDelChallanCtrl.ePage.Masters.NotWarehouseInventory, 'ProductCode');
                            var TempWarInvCount = _.keys(TempWarInv).length;
                            var TempSelectedLineCount = _.keys(TempSelectedLine).length;
                            if (TempWarInvCount == TempSelectedLineCount) {
                                var results = groupBy(CreateDelChallanCtrl.ePage.Masters.NotWarehouseInventory, function (item) {
                                    return [item.WAR_WarehouseCode, item.ProductCode];
                                });
                                var war = [];
                                angular.forEach(results, function (value, key) {
                                    var str;
                                    if (typeof key == "string") {
                                        str = JSON.parse(key);
                                    }
                                    war.push(str[0]);
                                });
                                var result = GetWarCount(war);
                                var WarehosueList = "";
                                angular.forEach(result, function (val, key) {
                                    if (val == TempSelectedLineCount) {
                                        WarehosueList = WarehosueList + key + ",";
                                    }
                                });
                                WarehosueList = WarehosueList.slice(0, -1);
                                if (WarehosueList) {
                                    CreateDelChallanCtrl.ePage.Entities.Header.Data.TempUIWmsDelivery = {};
                                    CreateDelChallanCtrl.ePage.Entities.Header.Data.TempUIWmsDelivery.TempWarehouse = WarehosueList;
                                    openModel().result.then(function (response) {
                                        if (response == "MTR") {
                                            GoToOutwardCreation(type);
                                        }
                                    }, function () {
                                        console.log("Cancelled");
                                    });
                                } else {
                                    toastr.warning("Inventory not available for this product(s) in same warehouse.")
                                }
                            } else {
                                toastr.warning("Inventory not available for this product(s)");
                            }
                            // } else {
                            //     toastr.warning("Inventory available in the Requested Warehouse. Click Create Outward to continue");
                            // }
                        }
                    } else {
                        if (type == "OUT")
                            toastr.warning("Can not create Outward for this CSR No " + CreateDelChallanCtrl.ePage.Masters.TempCSR);
                        else if (type == "MTR")
                            toastr.warning("Can not create Material Transfer for this CSR No " + CreateDelChallanCtrl.ePage.Masters.TempCSR);
                    }
                } else {
                    if (type == "OUT") {
                        toastr.warning("Outward can be created by selecting atleast one delivery line");
                    } else if (type == "MTR") {
                        toastr.warning("Material Transfer can be created by selecting atleast one delivery line");
                    }
                }
            } else {
                if (type == "OUT") {
                    toastr.warning("Outward can be created when the delivery line is available");
                } else if (type == "MTR") {
                    toastr.warning("Material Transfer can be created when the delivery line is available");
                }
            }
        }

        function GetWarCount(arr) {
            var counts = {};
            for (var i = 0; i < arr.length; i++) {
                var num = arr[i];
                counts[num] = counts[num] ? counts[num] + 1 : 1;
            }
            return counts;
        }

        function groupBy(array, f) {
            var groups = {};
            array.forEach(function (o) {
                var group = JSON.stringify(f(o));
                groups[group] = groups[group] || [];
                groups[group].push(o);
            });
            // return Object.keys(groups).map(function (group) {
            return groups;
            // })
        }

        function GoToOutwardCreation(type) {
            var _isExist = outwardConfig.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                if (type == "OUT")
                    CreateDelChallanCtrl.ePage.Masters.CreateOutwardText = "Please Wait..";
                else if (type == "MTR")
                    CreateDelChallanCtrl.ePage.Masters.CreateMaterialTransferText = "Please Wait..";
                CreateDelChallanCtrl.ePage.Masters.IsDisabled = true;
                helperService.getFullObjectUsingGetById(warehouseConfig.Entities.WmsOutwardList.API.GetById.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.Response.UIWmsOutwardHeader.ClientCode = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode;
                        response.data.Response.Response.UIWmsOutwardHeader.ClientName = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientName;
                        response.data.Response.Response.UIWmsOutwardHeader.Client = CreateDelChallanCtrl.ePage.Masters.Client;
                        response.data.Response.Response.UIWmsOutwardHeader.Consignee = CreateDelChallanCtrl.ePage.Masters.Consignee;
                        response.data.Response.Response.UIWmsOutwardHeader.ConsigneeCode = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeCode;
                        response.data.Response.Response.UIWmsOutwardHeader.ConsigneeName = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeName;
                        response.data.Response.Response.UIWmsOutwardHeader.ORG_Client_FK = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ORG_Client_FK;
                        response.data.Response.Response.UIWmsOutwardHeader.ORG_Consignee_FK = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ORG_Consignee_FK;

                        response.data.Response.Response.UIWmsOutwardHeader.WAR_ORG_FK = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WAR_ORG_FK;
                        response.data.Response.Response.UIWmsOutwardHeader.WAR_ORG_Code = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WAR_ORG_Code;
                        response.data.Response.Response.UIWmsOutwardHeader.WAR_ORG_FullName = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WAR_ORG_FullName;
                        if (type == "OUT") {
                            response.data.Response.Response.UIWmsOutwardHeader.WAR_FK = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WAR_FK;
                            response.data.Response.Response.UIWmsOutwardHeader.Warehouse = CreateDelChallanCtrl.ePage.Masters.WarehouseCodeName;
                            response.data.Response.Response.UIWmsOutwardHeader.WarehouseCode = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode;
                            response.data.Response.Response.UIWmsOutwardHeader.WarehouseName = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseName;
                            response.data.Response.Response.UIWmsOutwardHeader.Provider_ORG_FK = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Provider_ORG_FK;
                        } else if (type == "MTR") {
                            response.data.Response.Response.UIWmsOutwardHeader.Warehouse = CreateDelChallanCtrl.ePage.Masters.Warehouse;
                            response.data.Response.Response.UIWmsOutwardHeader.WarehouseCode = CreateDelChallanCtrl.ePage.Masters.WarehouseCode;
                            response.data.Response.Response.UIWmsOutwardHeader.WarehouseName = CreateDelChallanCtrl.ePage.Masters.WarehouseName;
                            response.data.Response.Response.UIWmsOutwardHeader.WAR_FK = CreateDelChallanCtrl.ePage.Masters.WAR_PK;
                            response.data.Response.Response.UIWmsOutwardHeader.Provider_ORG_FK = CreateDelChallanCtrl.ePage.Entities.Header.Data.TempUIWmsDelivery.Provider_ORG_FK;

                            response.data.Response.Response.UIWmsOutwardHeader.TransferTo_WAR_FK = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WAR_FK;
                            response.data.Response.Response.UIWmsOutwardHeader.TransferWarehouse = CreateDelChallanCtrl.ePage.Masters.WarehouseCodeName;
                            response.data.Response.Response.UIWmsOutwardHeader.TransferTo_WAR_Code = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode;
                            response.data.Response.Response.UIWmsOutwardHeader.TransferTo_WAR_Name = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseName;
                        }
                        response.data.Response.Response.UIWmsOutwardHeader.AdditionalRef2Fk = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.PK;
                        response.data.Response.Response.UIWmsOutwardHeader.AdditionalRef2Code = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID;
                        response.data.Response.Response.UIWmsOutwardHeader.AdditionalRef1Type = "Delivery";
                        response.data.Response.Response.UIWmsOutwardHeader.RequiredDate = new Date();
                        response.data.Response.Response.UIWmsOutwardHeader.WorkOrderType = "ORD";

                        response.data.Response.Response.UIOrgHeader = angular.copy(CreateDelChallanCtrl.ePage.Entities.Header.Data.UIOrgHeader);
                        response.data.Response.Response.UIJobAddress = angular.copy(CreateDelChallanCtrl.ePage.Entities.Header.Data.UIJobAddress);
                        angular.forEach(response.data.Response.Response.UIJobAddress, function (value, key) {
                            value.PK = "";
                            if (value.AddressType == "SUD") {
                                value.AddressType = "CED";
                            }
                        })
                        if (type == "MTR")
                            response.data.Response.Response.UIWmsOutwardHeader.WorkOrderSubType = "MTR";
                        response.data.Response.Response.UIWmsOutwardHeader.WOD_Parent_FK = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.PK;

                        angular.forEach(CreateDelChallanCtrl.ePage.Masters.SelectedDeliveryLine, function (value, key) {
                            if (type == "MTR") {
                                value.MOL_PrdCode = value.DL_Req_PrdCode;
                            } else if (type == "OUT") {
                                value.OL_PrdCode = value.DL_Req_PrdCode
                            }
                            value.SingleSelect = false;
                            var obj = {
                                "Parent_FK": value.DL_PK,
                                "PK": "",
                                "WorkOrderType": "ORD",
                                "WorkOrderLineType": "ORD",
                                "WorkOrderID": response.data.Response.Response.UIWmsOutwardHeader.WorkOrderID,
                                "ExternalReference": response.data.Response.Response.UIWmsOutwardHeader.WorkOrderID,
                                "WOD_FK": response.data.Response.Response.PK,
                                "ProductCode": value.DL_Req_PrdCode,
                                "ProductDescription": value.DL_Req_PrdDesc,
                                "PRO_FK": value.DL_Req_PrdPk,
                                "Commodity": value.Commodity,
                                "MCC_NKCommodityCode": value.DL_MCC_NKCommodityCode,
                                "MCC_NKCommodityDesc": value.DL_MCC_NKCommodityDesc,
                                "ProductCondition": "GDC",
                                "Packs": value.DL_Packs,
                                "PAC_PackType": value.DL_PAC_PackType,
                                "Units": value.DL_Units,
                                "StockKeepingUnit": value.DL_StockKeepingUnit,
                                "PartAttrib1": value.DL_PartAttrib1,
                                "PartAttrib2": value.DL_PartAttrib2,
                                "PartAttrib3": value.DL_PartAttrib3,
                                "LineComment": value.DL_LineComment,
                                "PackingDate": value.DL_PackingDate,
                                "ExpiryDate": value.DL_ExpiryDate,
                                "AdditionalRef1Code": value.DL_AdditionalRef1Code,
                                "AdditionalRef1Type": "DeliveryLine",
                                "AdditionalRef1Fk": value.DL_PK,
                                "UseExpiryDate": value.DL_UseExpiryDate,
                                "UsePackingDate": value.DL_UsePackingDate,
                                "UsePartAttrib1": value.DL_UsePartAttrib1,
                                "UsePartAttrib2": value.DL_UsePartAttrib2,
                                "UsePartAttrib3": value.DL_UsePartAttrib3,
                                "IsPartAttrib1ReleaseCaptured": value.DL_IsPartAttrib1ReleaseCaptured,
                                "IsPartAttrib2ReleaseCaptured": value.DL_IsPartAttrib2ReleaseCaptured,
                                "IsPartAttrib3ReleaseCaptured": value.DL_IsPartAttrib3ReleaseCaptured,

                                "IsDeleted": false,
                                "ORG_ClientCode": value.DEL_ClientCode,
                                "ORG_ClientName": value.DEL_ClientName,
                                "Client_FK": value.DEL_Client_FK,

                                "WAR_WarehouseCode": value.DEL_WAR_Code,
                                "WAR_WarehouseName": value.DEL_WAR_Name,
                                "WAR_FK": value.DEL_WAR_FK,
                            };
                            response.data.Response.Response.UIWmsWorkOrderLine.push(obj);
                        });

                        var _obj = {
                            entity: response.data.Response.Response.UIWmsOutwardHeader,
                            data: response.data.Response.Response,
                            Validations: response.data.Response.Validations
                        };
                        myTaskActivityConfig.CallEntity = true;
                        AddTab(_obj, true);
                        if (type == "OUT")
                            CreateDelChallanCtrl.ePage.Masters.CreateOutwardText = "Create Outward";
                        else if (type == "MTR")
                            CreateDelChallanCtrl.ePage.Masters.CreateMaterialTransferText = "Create Material Transfer";
                        CreateDelChallanCtrl.ePage.Masters.IsDisabled = false;
                    }
                });
            }
        }

        function openModel() {
            return CreateDelChallanCtrl.ePage.Masters.modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "success-popup",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/warehouse/my-task/my-task-directive/create-delivery-challan/warehouse-popup.html"
            });
        }

        function Close() {
            CreateDelChallanCtrl.ePage.Masters.selectedRow = -1;
            CreateDelChallanCtrl.ePage.Masters.modalInstance.close('close');
        }
        // #endregion
        // #region - Show the Created Outward Details
        function getOutwardList() {
            var _filter = {
                "WOD_Parent_FK": CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": warehouseConfig.Entities.WmsOutward.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", warehouseConfig.Entities.WmsOutward.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    CreateDelChallanCtrl.ePage.Masters.OutwardList = response.data.Response;
                    outwardConfig.ValidationFindall();
                    angular.forEach(CreateDelChallanCtrl.ePage.Masters.OutwardList, function (value, key) {
                        myTaskActivityConfig.CallEntity = true;
                        AddTab(value, false);
                    });
                }
            });
        }

        function AddTab(currentDelivery, isNew) {
            CreateDelChallanCtrl.ePage.Masters.currentDelivery = undefined;

            var _isExist = outwardConfig.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentDelivery.WorkOrderID)
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
                CreateDelChallanCtrl.ePage.Masters.IsTabClick = true;
                var _currentDelivery = undefined;
                if (!isNew) {
                    _currentDelivery = currentDelivery;
                } else {
                    _currentDelivery = currentDelivery;
                }

                outwardConfig.GetTabDetails(_currentDelivery, isNew).then(function (response) {
                    CreateDelChallanCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        CreateDelChallanCtrl.ePage.Masters.activeTabIndex = CreateDelChallanCtrl.ePage.Masters.TabList.length;
                        if (isNew)
                            CurrentActiveTab(currentDelivery.entity.WorkOrderID);
                        else
                            CurrentActiveTab(currentDelivery.WorkOrderID);
                        CreateDelChallanCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Delivery already opened ');
            }
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            CreateDelChallanCtrl.ePage.Masters.currentDelivery = currentTab;
        }
        // #endregion
        // #region Filter - Inventory Line Functionlities
        function CloseFilterList() {
            $('#filterSideBar' + "WarehouseInventory" + CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID).removeClass('open');
        }

        function GetFilterList() {
            $timeout(function () {
                $('#filterSideBar' + "WarehouseInventory" + CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID).toggleClass('open');
            });
        }

        function DefaultFilter() {
            if (CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode && CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode && CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine.length > 0) {
                CreateDelChallanCtrl.ePage.Masters.InventoryLoading = true;
                var TempDeliveryLine = _.groupBy(CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine, 'ProductCode');
                var TempProduct = "";
                angular.forEach(TempDeliveryLine, function (value, key) {
                    TempProduct = TempProduct + key + ",";
                });
                TempProduct = TempProduct.slice(0, -1);
                // except requested warehouse inventory
                CreateDelChallanCtrl.ePage.Masters.defaultFilter = {
                    "ClientCode": CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode,
                    "NotInWarehouseCode": CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode,
                    "InventoryStatusIn": "AVL",
                    "ProductIn": TempProduct,
                    "AvlToPickNotEquals": "0"
                };

                // for requested warehouse inventory
                var FilterObj = {
                    "ClientCode": CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode,
                    "WAR_WarehouseCode": CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode,
                    "InventoryStatusIn": "AVL",
                    "ProductIn": TempProduct,
                    "AvlToPickNotEquals": "0",
                    "SortColumn": "WOL_WAR_WarehouseCode",
                    "SortType": "ASC",
                    "PageNumber": 1,
                    "PageSize": 100
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(FilterObj),
                    "FilterID": warehouseConfig.Entities.WmsInventory.API.FindAll.FilterID
                };
                apiService.post("eAxisAPI", warehouseConfig.Entities.WmsInventory.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        CreateDelChallanCtrl.ePage.Masters.RequestedWarehouseInventory = response.data.Response;
                        CreateDelChallanCtrl.ePage.Masters.DynamicControl = undefined;
                        GetConfigDetails();
                    }
                });
            }
        }

        function GetConfigDetails() {
            // Get Dynamic filter controls
            var _filter = {
                DataEntryName: "WarehouseInventory"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(function (response) {
                var _isEmpty = angular.equals({}, response.data.Response);
                if (response.data.Response == null || !response.data.Response || _isEmpty) {
                    console.log("Dynamic control config Empty Response");
                } else {
                    CreateDelChallanCtrl.ePage.Masters.DynamicControl = response.data.Response;
                    if (CreateDelChallanCtrl.ePage.Masters.defaultFilter !== undefined) {
                        CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities.map(function (value, key) {
                            value.Data = CreateDelChallanCtrl.ePage.Masters.defaultFilter;

                            value.CSS = {};
                            value.ConfigData.map(function (value2, key2) {
                                if (value2.PropertyName == 'ClientCode' || value2.PropertyName == 'OriginalInventoryStatus') {
                                    value.CSS["Is" + value2.PropertyName + "Visible"] = true;
                                    value.CSS["Is" + value2.PropertyName + "Disable"] = true;
                                } else {
                                    value.CSS["Is" + value2.PropertyName + "Visible"] = false;
                                    value.CSS["Is" + value2.PropertyName + "Disable"] = false;
                                }
                            });
                        });
                    }
                    CreateDelChallanCtrl.ePage.Masters.ViewType = 1;
                    Filter();
                }
            });
        }

        function Filter() {
            // if searching input and original client same then only process
            if (CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ClientCode == CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode) {

                CreateDelChallanCtrl.ePage.Masters.MainInventory = [];
                CreateDelChallanCtrl.ePage.Masters.InventoryLoading = true;

                $(".filter-sidebar-wrapper").toggleClass("open");

                var FilterObj = {
                    "ClientCode": CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ClientCode,
                    "WAR_WarehouseCode": CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.WAR_WarehouseCode,
                    "AreaName": CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.AreaName,
                    "InventoryStatusIn": CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.InventoryStatusIn,
                    "ExternalReference": CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ExternalReference,
                    "Location": CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.Location,
                    "PalletID": CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PalletID,
                    "ProductCode": CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ProductCode,
                    "ProductIn": CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ProductCode ? undefined : CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ProductIn,
                    "AvlToPickNotEquals": CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.AvlToPickNotEquals,
                    "WOL_AdjustmentArrivalDate": CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.WOL_AdjustmentArrivalDate,
                    "PartAttrib1": CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PartAttrib1,
                    "PartAttrib2": CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PartAttrib2,
                    "PartAttrib3": CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PartAttrib3,
                    "PackingDate": CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PackingDate,
                    "ExpiryDate": CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ExpiryDate,
                    "NotInWarehouseCode": CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.WAR_WarehouseCode ? undefined : CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.NotInWarehouseCode,
                    "SortColumn": "WOL_WAR_WarehouseCode",
                    "SortType": "ASC",
                    "PageNumber": 1,
                    "PageSize": 50
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(FilterObj),
                    "FilterID": warehouseConfig.Entities.WmsInventory.API.FindAll.FilterID
                };
                apiService.post("eAxisAPI", warehouseConfig.Entities.WmsInventory.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        CreateDelChallanCtrl.ePage.Masters.MainInventory = angular.copy(response.data.Response);
                        if (!CreateDelChallanCtrl.ePage.Masters.IsFilter) {
                            CreateDelChallanCtrl.ePage.Masters.InventoryDetails = angular.copy(response.data.Response);
                            angular.forEach(CreateDelChallanCtrl.ePage.Masters.RequestedWarehouseInventory, function (value, key) {
                                CreateDelChallanCtrl.ePage.Masters.MainInventory.unshift(value);
                                CreateDelChallanCtrl.ePage.Masters.InventoryDetails.unshift(value);
                            });
                        } else {
                            CreateDelChallanCtrl.ePage.Masters.IsFilter = false;
                        }
                        CreateDelChallanCtrl.ePage.Masters.InventoryCount = response.data.Count;
                        CreateDelChallanCtrl.ePage.Masters.InventoryLoading = false;
                    }
                });
            } else {
                toastr.warning("Please Enter Chosen Client And Warehouse in Filter");
            }
        }
        // #endregion
        // #region - General
        function CallIsReload() {
            CreateDelChallanCtrl.ePage.Masters.Config.IsReload = false;
            CreateDelChallanCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data;
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
                EntityObject: CreateDelChallanCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            CreateDelChallanCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (CreateDelChallanCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", warehouseConfig.Entities.WmsDelivery.API.GetById.Url + CreateDelChallanCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        CreateDelChallanCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }
        // #endregion
        Init();
    }
})();