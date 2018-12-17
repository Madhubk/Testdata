(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CreateDelChallanController", CreateDelChallanController);

    CreateDelChallanController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "dynamicLookupConfig", "outwardConfig", "toastr", "$timeout", "$uibModal"];

    function CreateDelChallanController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, dynamicLookupConfig, outwardConfig, toastr, $timeout, $uibModal) {
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
            CreateDelChallanCtrl.ePage.Masters.CreateOutward = CreateOutward;
            CreateDelChallanCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            CreateDelChallanCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            CreateDelChallanCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            CreateDelChallanCtrl.ePage.Masters.CallIsReload = CallIsReload;
            CreateDelChallanCtrl.ePage.Masters.Close = Close;
            CreateDelChallanCtrl.ePage.Masters.SelectedLookupWarehouse = SelectedLookupWarehouse;
            CreateDelChallanCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            // Filter
            CreateDelChallanCtrl.ePage.Masters.GetFilterList = GetFilterList;
            CreateDelChallanCtrl.ePage.Masters.CloseFilterList = CloseFilterList;
            CreateDelChallanCtrl.ePage.Masters.Filter = Filter;

        }

        function SelectedLookupWarehouse(item) {
            CreateDelChallanCtrl.ePage.Masters.Warehouse = item.WarehouseCode + " - " + item.WarehouseName;
            CreateDelChallanCtrl.ePage.Masters.WarehouseCode = item.WarehouseCode;
            CreateDelChallanCtrl.ePage.Masters.WarehouseName = item.WarehouseName;
            CreateDelChallanCtrl.ePage.Masters.WAR_PK = item.PK;
            CreateDelChallanCtrl.ePage.Masters.modalInstance.close('close');
        }

        function CallIsReload() {
            CreateDelChallanCtrl.ePage.Masters.Config.IsReload = false;
            CreateDelChallanCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data;
        }

        //#region checkbox selection
        function SelectAllCheckBox() {
            angular.forEach(CreateDelChallanCtrl.ePage.Entities.Header.Data.UIvwWmsDeliveryList, function (value, key) {
                if (CreateDelChallanCtrl.ePage.Masters.SelectAll) {
                    // Enable and disable based on page wise
                    value.SingleSelect = true;
                } else {
                    value.SingleSelect = false;
                }
            });
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

            var Checked1 = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIvwWmsDeliveryList.some(function (value, key) {
                return value.SingleSelect == true;
            });
        }

        function getOutwardList() {
            var _filter = {
                "WOD_Parent_FK": CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.WmsOutwardList.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.WmsOutwardList.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    CreateDelChallanCtrl.ePage.Masters.OutwardList = response.data.Response;
                    outwardConfig.ValidationFindall();
                    angular.forEach(CreateDelChallanCtrl.ePage.Masters.OutwardList, function (value, key) {
                        AddTab(value, false);
                    });
                }
            });
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
                        value.SingleSelect = false;
                    }
                });
                if (count > 0) {
                    var temp = 0;
                    CreateDelChallanCtrl.ePage.Masters.TempCSR = '';
                    angular.forEach(CreateDelChallanCtrl.ePage.Masters.SelectedDeliveryLine, function (value, key) {
                        if (value.OUT_PrdCode || value.MTOUT_PrdCode) {
                            temp = temp + 1;
                            CreateDelChallanCtrl.ePage.Masters.TempCSR = CreateDelChallanCtrl.ePage.Masters.TempCSR + value.AdditionalRef1Code + ",";
                        }
                    });
                    CreateDelChallanCtrl.ePage.Masters.TempCSR = CreateDelChallanCtrl.ePage.Masters.TempCSR.slice(0, -1);
                    if (temp == 0) {
                        if (type == "OUT") {
                            GoToOutwardCreation(type);
                        } else if (type == "MTR") {
                            openModel().result.then(function (response) {
                                if (CreateDelChallanCtrl.ePage.Masters.WarehouseCode) {
                                    GoToOutwardCreation(type);
                                } else {
                                    toastr.warning("Please enter Transfer From Warehouse");
                                }
                            }, function () {
                                console.log("Cancelled");
                            });
                        }
                    } else {
                        if (type == "OUT")
                            toastr.warning("Can not create Outward for this CSR No " + CreateDelChallanCtrl.ePage.Masters.TempCSR);
                        else if (type == "MTR")
                            toastr.warning("Can not create Material Transfer for this CSR No " + CreateDelChallanCtrl.ePage.Masters.TempCSR);
                    }
                } else {
                    toastr.warning("Outward can be created by selecting atleast one delivery line");
                }
            } else {
                toastr.warning("Outward can be created when the delivery line is available");
            }
        }

        function Close() {
            CreateDelChallanCtrl.ePage.Masters.modalInstance.close('close');
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
                helperService.getFullObjectUsingGetById(appConfig.Entities.WmsOutwardList.API.GetById.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.Response.UIWmsOutwardHeader.ClientCode = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode;
                        response.data.Response.Response.UIWmsOutwardHeader.ClientName = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientName;
                        response.data.Response.Response.UIWmsOutwardHeader.Client = CreateDelChallanCtrl.ePage.Masters.Client;
                        response.data.Response.Response.UIWmsOutwardHeader.Consignee = CreateDelChallanCtrl.ePage.Masters.Consignee;
                        response.data.Response.Response.UIWmsOutwardHeader.ConsigneeCode = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeCode;
                        response.data.Response.Response.UIWmsOutwardHeader.ConsigneeName = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeName;
                        response.data.Response.Response.UIWmsOutwardHeader.ORG_Client_FK = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ORG_Client_FK;
                        response.data.Response.Response.UIWmsOutwardHeader.ORG_Consignee_FK = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ORG_Consignee_FK;
                        if (type == "OUT") {
                            response.data.Response.Response.UIWmsOutwardHeader.WAR_FK = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WAR_FK;
                            response.data.Response.Response.UIWmsOutwardHeader.Warehouse = CreateDelChallanCtrl.ePage.Masters.WarehouseCodeName;
                            response.data.Response.Response.UIWmsOutwardHeader.WarehouseCode = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode;
                            response.data.Response.Response.UIWmsOutwardHeader.WarehouseName = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseName;
                        } else if (type == "MTR") {
                            response.data.Response.Response.UIWmsOutwardHeader.Warehouse = CreateDelChallanCtrl.ePage.Masters.Warehouse;
                            response.data.Response.Response.UIWmsOutwardHeader.WarehouseCode = CreateDelChallanCtrl.ePage.Masters.WarehouseCode;
                            response.data.Response.Response.UIWmsOutwardHeader.WarehouseName = CreateDelChallanCtrl.ePage.Masters.WarehouseName;
                            response.data.Response.Response.UIWmsOutwardHeader.WAR_FK = CreateDelChallanCtrl.ePage.Masters.WAR_PK;

                            response.data.Response.Response.UIWmsOutwardHeader.TransferTo_WAR_FK = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WAR_FK;
                            response.data.Response.Response.UIWmsOutwardHeader.TransferWarehouse = CreateDelChallanCtrl.ePage.Masters.WarehouseCodeName;
                            response.data.Response.Response.UIWmsOutwardHeader.TransferTo_WAR_Code = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode;
                            response.data.Response.Response.UIWmsOutwardHeader.TransferTo_WAR_Name = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseName;
                        }
                        response.data.Response.Response.UIWmsOutwardHeader.AdditionalRef2Fk = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.PK;
                        response.data.Response.Response.UIWmsOutwardHeader.AdditionalRef2Code = CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID;
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
                            var obj = {
                                "Parent_FK": value.PK,
                                "PK": "",
                                "WorkOrderType": "ORD",
                                "WorkOrderLineType": "ORD",
                                "WorkOrderID": response.data.Response.Response.UIWmsOutwardHeader.WorkOrderID,
                                "ExternalReference": response.data.Response.Response.UIWmsOutwardHeader.WorkOrderID,
                                "WOD_FK": response.data.Response.Response.PK,
                                "ProductCode": value.DLPRD_Req_PrdCode,
                                "ProductDescription": value.DLPRD_Req_PrdDesc,
                                "PRO_FK": value.DLPRD_Req_PrdPk,
                                "Commodity": value.Commodity,
                                "MCC_NKCommodityCode": value.MCC_NKCommodityCode,
                                "MCC_NKCommodityDesc": value.MCC_NKCommodityDesc,
                                "ProductCondition": "GDC",
                                "Packs": value.Packs,
                                "PAC_PackType": value.PAC_PackType,
                                "Units": value.Units,
                                "StockKeepingUnit": value.StockKeepingUnit,
                                "PartAttrib1": value.PartAttrib1,
                                "PartAttrib2": value.PartAttrib2,
                                "PartAttrib3": value.PartAttrib3,
                                "LineComment": value.LineComment,
                                "PackingDate": value.PackingDate,
                                "ExpiryDate": value.ExpiryDate,
                                "AdditionalRef1Code": value.AdditionalRef1Code,
                                "UseExpiryDate": value.UseExpiryDate,
                                "UsePackingDate": value.UsePackingDate,
                                "UsePartAttrib1": value.UsePartAttrib1,
                                "UsePartAttrib2": value.UsePartAttrib2,
                                "UsePartAttrib3": value.UsePartAttrib3,
                                "IsPartAttrib1ReleaseCaptured": value.IsPartAttrib1ReleaseCaptured,
                                "IsPartAttrib2ReleaseCaptured": value.IsPartAttrib2ReleaseCaptured,
                                "IsPartAttrib3ReleaseCaptured": value.IsPartAttrib3ReleaseCaptured,

                                "IsDeleted": false,
                                "ORG_ClientCode": value.ORG_ClientCode,
                                "ORG_ClientName": value.ORG_ClientName,
                                "Client_FK": value.Client_FK,

                                "WAR_WarehouseCode": value.WAR_WarehouseCode,
                                "WAR_WarehouseName": value.WAR_WarehouseName,
                                "WAR_FK": value.WAR_FK,
                            };
                            response.data.Response.Response.UIWmsWorkOrderLine.push(obj);
                        });

                        var _obj = {
                            entity: response.data.Response.Response.UIWmsOutwardHeader,
                            data: response.data.Response.Response,
                            Validations: response.data.Response.Validations
                        };
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
                apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + CreateDelChallanCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        CreateDelChallanCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        function setSelectedRow(index, item) {
            CreateDelChallanCtrl.ePage.Masters.selectedRow = index;
            CreateDelChallanCtrl.ePage.Masters.defaultFilter = {
                "ClientCode": CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode,
                "WAR_WarehouseCode": CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode,
                "InventoryStatusIn": "AVL,HEL",
                "ProductCode": item.DLPRD_Req_PrdCode
            };
            CreateDelChallanCtrl.ePage.Masters.DynamicControl = undefined;
            GetConfigDetails();
        }

        //#region Inventory Line Functionlities
        function CloseFilterList() {
            $('#filterSideBar' + "WarehouseInventory" + CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID).removeClass('open');
        }

        function GetFilterList() {
            $timeout(function () {
                $('#filterSideBar' + "WarehouseInventory" + CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID).toggleClass('open');
            });
        }

        function DefaultFilter() {
            if (CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode && CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode) {
                CreateDelChallanCtrl.ePage.Masters.defaultFilter = {
                    "ClientCode": CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode,
                    "WAR_WarehouseCode": CreateDelChallanCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode,
                    "InventoryStatusIn": "AVL,HEL"
                };
                CreateDelChallanCtrl.ePage.Masters.DynamicControl = undefined;
                GetConfigDetails();
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

                CreateDelChallanCtrl.ePage.Masters.Inventory = [];
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
                    "WOL_AdjustmentArrivalDate": CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.WOL_AdjustmentArrivalDate,
                    "PartAttrib1": CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PartAttrib1,
                    "PartAttrib2": CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PartAttrib2,
                    "PartAttrib3": CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PartAttrib3,
                    "PackingDate": CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PackingDate,
                    "ExpiryDate": CreateDelChallanCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ExpiryDate,
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
                    CreateDelChallanCtrl.ePage.Masters.Inventory = response.data.Response;
                    CreateDelChallanCtrl.ePage.Masters.InventoryCount = response.data.Count;
                    CreateDelChallanCtrl.ePage.Masters.InventoryLoading = false;
                });
            } else {
                toastr.warning("Please Enter Chosen Client And Warehouse in Filter");
            }
        }

        Init();
    }
})();