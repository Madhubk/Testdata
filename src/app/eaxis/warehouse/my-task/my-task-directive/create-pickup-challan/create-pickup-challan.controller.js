(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CreatePickupChallanController", CreatePickupChallanController);

    CreatePickupChallanController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "dynamicLookupConfig", "inwardConfig", "toastr", "$timeout"];

    function CreatePickupChallanController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, dynamicLookupConfig, inwardConfig, toastr, $timeout) {
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
            // CreatePickupChallanCtrl.ePage.Masters.CreateMaterialTransferText = "Create Material Transfer";
            CreatePickupChallanCtrl.ePage.Masters.CreateInward = CreateInward;
            CreatePickupChallanCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            CreatePickupChallanCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            CreatePickupChallanCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            CreatePickupChallanCtrl.ePage.Masters.CallIsReload = CallIsReload;
        }

        function CallIsReload() {
            CreatePickupChallanCtrl.ePage.Masters.Config.IsReload = false;
            CreatePickupChallanCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Pickup[myTaskActivityConfig.Entities.Pickup.label].ePage.Entities.Header.Data;
        }


        //#region checkbox selection
        function SelectAllCheckBox() {
            angular.forEach(CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickupLine, function (value, key) {
                if (CreatePickupChallanCtrl.ePage.Masters.SelectAll) {
                    // Enable and disable based on page wise
                    value.SingleSelect = true;
                } else {
                    value.SingleSelect = false;
                }
            });
        }

        function SingleSelectCheckBox() {
            var Checked = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickupLine.some(function (value, key) {
                // Enable and disable based on page wise
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                CreatePickupChallanCtrl.ePage.Masters.SelectAll = false;
            } else {
                CreatePickupChallanCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickupLine.some(function (value, key) {
                return value.SingleSelect == true;
            });
        }

        function getInwardList() {
            var _filter = {
                "WOD_Parent_FK": CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.InwardList.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.InwardList.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    CreatePickupChallanCtrl.ePage.Masters.InwardList = response.data.Response;
                    inwardConfig.ValidationFindall();
                    angular.forEach(CreatePickupChallanCtrl.ePage.Masters.InwardList, function (value, key) {
                        AddTab(value, false);
                    });
                }
            });
        }

        function CreateInward(type) {
            inwardConfig.ValidationFindall();
            if (CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickupLine.length > 0) {
                var count = 0;
                CreatePickupChallanCtrl.ePage.Masters.SelectedPickupLine = [];
                CreatePickupChallanCtrl.ePage.Masters.SelectAll = false;
                angular.forEach(CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickupLine, function (value, key) {
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
                        if (value.OUT_PrdCode || value.MTOUT_PrdCode) {
                            temp = temp + 1;
                            CreatePickupChallanCtrl.ePage.Masters.TempCSR = CreatePickupChallanCtrl.ePage.Masters.TempCSR + value.AdditionalRef1Code + ",";
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
                            if (type == "OUT")
                                CreatePickupChallanCtrl.ePage.Masters.CreateInwardText = "Please Wait..";
                            else if (type == "MTR")
                                CreatePickupChallanCtrl.ePage.Masters.CreateMaterialTransferText = "Please Wait..";
                            CreatePickupChallanCtrl.ePage.Masters.IsDisabled = true;
                            helperService.getFullObjectUsingGetById(appConfig.Entities.InwardList.API.GetById.Url, 'null').then(function (response) {
                                if (response.data.Response) {
                                    response.data.Response.Response.UIWmsInwardHeader.ClientCode = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientCode;
                                    response.data.Response.Response.UIWmsInwardHeader.ClientName = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientName;
                                    response.data.Response.Response.UIWmsInwardHeader.Client = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.Client;
                                    response.data.Response.Response.UIWmsInwardHeader.Consignee = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.Consignee;
                                    response.data.Response.Response.UIWmsInwardHeader.ConsigneeCode = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeCode;
                                    response.data.Response.Response.UIWmsInwardHeader.ConsigneeName = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeName;
                                    response.data.Response.Response.UIWmsInwardHeader.ORG_Client_FK = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ORG_Client_FK;
                                    response.data.Response.Response.UIWmsInwardHeader.ORG_Consignee_FK = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ORG_Consignee_FK;
                                    response.data.Response.Response.UIWmsInwardHeader.WAR_FK = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.WAR_FK;
                                    response.data.Response.Response.UIWmsInwardHeader.Warehouse = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.Warehouse;
                                    response.data.Response.Response.UIWmsInwardHeader.WarehouseCode = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseCode;
                                    response.data.Response.Response.UIWmsInwardHeader.WarehouseName = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseName;
                                    response.data.Response.Response.UIWmsInwardHeader.WorkOrderType = "INW";

                                    response.data.Response.Response.UIWmsInwardHeader.WOD_Parent_FK = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.PK;
                                    angular.forEach(CreatePickupChallanCtrl.ePage.Masters.SelectedPickupLine, function (value, key) {
                                        var obj = {
                                            "Parent_FK": value.PK,
                                            "PK": "",
                                            "WorkOrderType": "ORD",
                                            "WorkOrderLineType": "ORD",
                                            "WorkOrderID": response.data.Response.Response.UIWmsInwardHeader.WorkOrderID,
                                            "ExternalReference": response.data.Response.Response.UIWmsInwardHeader.WorkOrderID,
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
                                        entity: response.data.Response.Response.UIWmsInwardHeader,
                                        data: response.data.Response.Response,
                                        Validations: response.data.Response.Validations
                                    };
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


        function GeneralOperation() {
            // Client
            if (CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientCode == null)
                CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientCode = "";
            if (CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientName == null)
                CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientName = "";
            CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.Client = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientCode + ' - ' + CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientName;
            if (CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.Client == " - ")
                CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.Client = "";
            // Consignee
            if (CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeCode == null)
                CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeCode = "";
            if (CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeName == null)
                CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeName = "";
            CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.Consignee = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeCode + ' - ' + CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeName;
            if (CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.Consignee == " - ")
                CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.Consignee = "";
            // Warehouse
            if (CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseCode == null)
                CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseCode = "";
            if (CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseName == null)
                CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseName = "";
            CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.Warehouse = CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseCode + ' - ' + CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseName;
            if (CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.Warehouse == " - ")
                CreatePickupChallanCtrl.ePage.Entities.Header.Data.UIWmsPickup.Warehouse = "";
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
                    SubModuleCode: "PIC",
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
                apiService.get("eAxisAPI", appConfig.Entities.WmsPickupList.API.GetById.Url + CreatePickupChallanCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        CreatePickupChallanCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();