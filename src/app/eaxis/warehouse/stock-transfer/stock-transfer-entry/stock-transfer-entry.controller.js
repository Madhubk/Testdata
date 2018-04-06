(function () {
    "use strict";

    angular
        .module("Application")
        .controller("StocktransferEntryController", StocktransferEntryController);

    StocktransferEntryController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "stocktransferConfig", "appConfig", "toastr", "$document", "confirmation","$filter"];

    function StocktransferEntryController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, stocktransferConfig, appConfig, toastr, $document, confirmation,$filter) {
        /* jshint validthis: true */
        var StocktransferEntryCtrl = this;

        function Init() {
            var currentStockTransfer = StocktransferEntryCtrl.currentStockTransfer[StocktransferEntryCtrl.currentStockTransfer.label].ePage.Entities;
            StocktransferEntryCtrl.ePage = {
                "Title": "",
                "Prefix": "StockTransfer",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentStockTransfer
            };

            // DatePicker
            StocktransferEntryCtrl.ePage.Masters.DatePicker = {};
            StocktransferEntryCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            StocktransferEntryCtrl.ePage.Masters.DatePicker.isOpen = [];
            StocktransferEntryCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            StocktransferEntryCtrl.ePage.Masters.DropDownMasterList = {};
            StocktransferEntryCtrl.ePage.Masters.emptyText = '-'
            StocktransferEntryCtrl.ePage.Masters.selectedRow = -1;
            StocktransferEntryCtrl.ePage.Masters.Lineslist = true;
            StocktransferEntryCtrl.ePage.Masters.HeaderName = '';

            StocktransferEntryCtrl.ePage.Masters.Edit = Edit;
            StocktransferEntryCtrl.ePage.Masters.CopyRow = CopyRow;
            StocktransferEntryCtrl.ePage.Masters.AddNewRow = AddNewRow;
            StocktransferEntryCtrl.ePage.Masters.RemoveRow = RemoveRow;
            StocktransferEntryCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            StocktransferEntryCtrl.ePage.Masters.Back = Back;
            StocktransferEntryCtrl.ePage.Masters.Done = Done;
            StocktransferEntryCtrl.ePage.Masters.Config = stocktransferConfig;
            StocktransferEntryCtrl.ePage.Masters.OnChangeValues = OnChangeValues;


            StocktransferEntryCtrl.ePage.Masters.SelectedLookupClient = SelectedLookupClient;
            StocktransferEntryCtrl.ePage.Masters.SelectedLookupWarehouse = SelectedLookupWarehouse;
            StocktransferEntryCtrl.ePage.Masters.SelectedLocationSource = SelectedLocationSource;
            StocktransferEntryCtrl.ePage.Masters.SelectedLocationDestination = SelectedLocationDestination;
            StocktransferEntryCtrl.ePage.Masters.SelectedLookupProduct = SelectedLookupProduct;
            StocktransferEntryCtrl.ePage.Masters.FetchQuantity = FetchQuantity;
            StocktransferEntryCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            StocktransferEntryCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            StocktransferEntryCtrl.ePage.Masters.AddToLine = AddToLine;
            StocktransferEntryCtrl.ePage.Masters.CheckFutureDate = CheckFutureDate;
            StocktransferEntryCtrl.ePage.Masters.PartAttribute = PartAttribute;

            StocktransferEntryCtrl.ePage.Masters.GetFilterList = GetFilterList;
            StocktransferEntryCtrl.ePage.Masters.CloseFilterList = CloseFilterList;
            StocktransferEntryCtrl.ePage.Masters.Filter = Filter;

            StocktransferEntryCtrl.ePage.Masters.InventoryDetails = undefined;
            StocktransferEntryCtrl.ePage.Meta.IsLoading = false;

            //Order By
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine = $filter('orderBy')(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine, 'CreatedDateTime');

            GetDropDownList();
            getLineList();
            generalOperation();
            getConfigDetails();
            DefaultFilter();
            getPartAttributeDetails();
        }

        function CloseFilterList() {
            $('#filterSideBar' + "WarehouseInventory" + StocktransferEntryCtrl.currentStockTransfer.label).removeClass('open');
        }
        function GetFilterList() {
            $timeout(function () {
                $('#filterSideBar' + "WarehouseInventory" + StocktransferEntryCtrl.currentStockTransfer.label).toggleClass('open');
            });
        }
        function getConfigDetails() {
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
                    StocktransferEntryCtrl.ePage.Masters.DynamicControl = response.data.Response;


                    if (StocktransferEntryCtrl.ePage.Masters.defaultFilter !== undefined) {
                        StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities.map(function (value, key) {
                            value.Data = StocktransferEntryCtrl.ePage.Masters.defaultFilter;
                        });
                    }
                    StocktransferEntryCtrl.ePage.Masters.IsLoading = false;
                    StocktransferEntryCtrl.ePage.Masters.ViewType = 1;
                }
            });
        }

        function DefaultFilter() {
            if(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode && StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseCode){
                StocktransferEntryCtrl.ePage.Masters.defaultFilter = {
                    "ClientCode": StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode,
                    "WAR_WarehouseCode": StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseCode,
                    "OriginalInventoryStatus":"AVL"
                };
                StocktransferEntryCtrl.ePage.Masters.DynamicControl=undefined;
                getConfigDetails();
                getInventory();
            }
        }

        
        function getInventory() {
            var _filter = {
                "ORG_FK": StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ORG_Client_FK,
                "WAR_FK": StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WAR_FK,
                "OriginalInventoryStatus":"AVL"
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": StocktransferEntryCtrl.ePage.Entities.Header.API.GetInventoryList.FilterID,
            };
            apiService.post("eAxisAPI", StocktransferEntryCtrl.ePage.Entities.Header.API.GetInventoryList.Url, _input).then(function (response) {
                angular.forEach(response.data.Response, function (value, key) {
                    value.SingleSelect = false;
                });
                StocktransferEntryCtrl.ePage.Masters.InventoryDetails = response.data.Response;
            });
        }

        function Filter() {
            StocktransferEntryCtrl.ePage.Meta.IsLoading = true;
            $(".filter-sidebar-wrapper").toggleClass("open");

            var FilterObj = {
                "ClientCode": StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ClientCode,
                "WAR_WarehouseCode": StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities[0].Data.WAR_WarehouseCode,
                "AreaName": StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities[0].Data.AreaName,
                "CurrentInventoryStatusDesc": StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities[0].Data.CurrentInventoryStatusDesc,
                "ExternalReference": StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ExternalReference,
                "Location": StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities[0].Data.Location,
                "PalletID": StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PalletID,
                "ProductCode": StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ProductCode,
                "WOL_AdjustmentArrivalDate": StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities[0].Data.WOL_AdjustmentArrivalDate,
                "SortColumn": "WOL_WAR_WarehouseCode",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 500
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(FilterObj),
                "FilterID": StocktransferEntryCtrl.ePage.Entities.Header.API.GetInventoryList.FilterID,
            };
            apiService.post("eAxisAPI", StocktransferEntryCtrl.ePage.Entities.Header.API.GetInventoryList.Url, _input).then(function (response) {
                angular.forEach(response.data.Response, function (value, key) {
                    value.SingleSelect = false;
                });
                StocktransferEntryCtrl.ePage.Masters.InventoryDetails = response.data.Response;
                StocktransferEntryCtrl.ePage.Meta.IsLoading = false;
            });
        }

        function SingleSelectCheckBox() {
            var Checked = StocktransferEntryCtrl.ePage.Masters.InventoryDetails.some(function (value, key) {
                return value.SingleSelect == false;
            });
            if (Checked) {
                StocktransferEntryCtrl.ePage.Masters.SelectAll = false;
            } else {
                StocktransferEntryCtrl.ePage.Masters.SelectAll = true;
            }
        }

        function SelectAllCheckBox() {
            angular.forEach(StocktransferEntryCtrl.ePage.Masters.InventoryDetails, function (value, key) {
                if (StocktransferEntryCtrl.ePage.Masters.SelectAll)
                    value.SingleSelect = true;
                else
                    value.SingleSelect = false;
            });
        }

        function CheckFutureDate(fieldvalue, index) {
            var selectedDate = new Date(fieldvalue);
            var now = new Date();
            if (selectedDate > now) {
                OnChangeValues(null, 'E11016', true, index)
                OnChangeValues('value', 'E11015', true, index)
            } else {
                OnChangeValues('value', 'E11016', true, index)
                OnChangeValues('value', 'E11015', true, index)
            }
        }

        function GetOrgPartRelationValues() {
            if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.length > 0) {
                StocktransferEntryCtrl.ePage.Masters.OrgPartRelationBlur = true;
                var myData = _.groupBy(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine, "PRO_FK")
                for (var prop in myData) {
                    if (prop && prop != 'null') {
                        if (myData.hasOwnProperty(prop)) {
                            var _filter = {
                                "ORG_FK": StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ORG_Client_FK,
                                "OSP_FK": prop
                            };

                            var _input = {
                                "searchInput": helperService.createToArrayOfObject(_filter),
                                "FilterID": StocktransferEntryCtrl.ePage.Entities.Header.API.OrgPartRelation.FilterID
                            };

                            apiService.post("eAxisAPI", StocktransferEntryCtrl.ePage.Entities.Header.API.OrgPartRelation.Url, _input).then(function (response) {
                                if (response.data.Response) {
                                    angular.forEach(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine, function (value, key) {
                                        if (value.PRO_FK == response.data.Response[0].OSP_FK) {
                                            StocktransferEntryCtrl.ePage.Masters.OrgPartRelationCount++
                                            value.UseExpiryDate = response.data.Response[0].UseExpiryDate;
                                            value.UsePackingDate = response.data.Response[0].UsePackingDate;
                                            value.UsePartAttrib1 = response.data.Response[0].UsePartAttrib1;
                                            value.UsePartAttrib2 = response.data.Response[0].UsePartAttrib2;
                                            value.UsePartAttrib3 = response.data.Response[0].UsePartAttrib3;
                                            value.IsPartAttrib1ReleaseCaptured = response.data.Response[0].IsPartAttrib1ReleaseCaptured;
                                            value.IsPartAttrib2ReleaseCaptured = response.data.Response[0].IsPartAttrib2ReleaseCaptured;
                                            value.IsPartAttrib3ReleaseCaptured = response.data.Response[0].IsPartAttrib3ReleaseCaptured;
                                            if (StocktransferEntryCtrl.ePage.Masters.OrgPartRelationCount == StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.length) {
                                                StocktransferEntryCtrl.ePage.Masters.OrgPartRelationBlur = false;
                                            }
                                        }
                                    });
                                }
                            });
                        }
                        StocktransferEntryCtrl.ePage.Masters.OrgPartRelationCount=0;
                    }
                }
            }
        }
        
        function AddToLine() {
            angular.forEach(StocktransferEntryCtrl.ePage.Masters.InventoryDetails, function (value, key) {
                if (value.SingleSelect) {
                    var obj = {
                        "PK": "",
                        "ProductCode": value.ProductCode,
                        "ProductDescription": value.ProductName,
                        "Product": value.ProductCode + ' - ' + value.ProductName,
                        "PRO_FK": value.PRO_FK,
                        "MCC_NKCommodityCode": value.MCC_NKCommodityCode,
                        "MCC_NKCommodityDesc": value.MCC_NKCommodityDesc,
                        "Packs": value.AvailableToPick,
                        "PAC_PackType": value.StockKeepingUnit,
                        "Units": value.AvailableToPick,
                        "StockKeepingUnit": value.StockKeepingUnit,
                        "WorkOrderLineStatus": "",
                        "WorkOrderLineStatusDesc": "",
                        "OriginalInventoryStatus": "",
                        "OriginalInventoryStatusDesc": "",
                        "PalletID": value.PalletID,
                        "TransferFromPalletId": value.TransferFromPalletId,
                        "WLO_Location": "",
                        "WLO_FK": "",
                        "WLO_TransferFrom_FK": value.WLO_FK,
                        "WLO_TransferFrom": value.Location,
                        "AdjustmentArrivalDate": value.AdjustmentArrivalDate,
                        "PartAttrib1": value.PartAttrib1,
                        "PartAttrib2": value.PartAttrib2,
                        "PartAttrib3": value.PartAttrib3,
                        "PackingDate": value.PackingDate,
                        "ExpiryDate": value.ExpiryDate,
                        "LineComment": value.LineComment,
                        "IsDeleted": false,
                        "UseExpiryDate": false,
                        "UsePackingDate": false,
                        "UsePartAttrib1": false,
                        "UsePartAttrib2": false,
                        "UsePartAttrib3": false,
                        "IsPartAttrib1ReleaseCaptured": false,
                        "IsPartAttrib2ReleaseCaptured": false,
                        "IsPartAttrib3ReleaseCaptured": false,

                        "ORG_ClientCode": value.ORG_ClientCode,
                        "ORG_ClientName": value.ORG_ClientName,
                        "Client_FK": value.Client_FK,

                        "WAR_WarehouseCode": value.WAR_WarehouseCode,
                        "WAR_WarehouseName": value.WAR_WarehouseName,
                        "WAR_FK": value.WAR_FK,
                    }
                    if(obj.MCC_NKCommodityCode == null){
                        obj.MCC_NKCommodityCode = '';
                    }
                    if(obj.MCC_NKCommodityDesc == null){
                        obj.MCC_NKCommodityDesc = '';
                    }
                    obj.Commodity =  obj.MCC_NKCommodityCode+' - '+obj.MCC_NKCommodityDesc
                    StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.push(obj);
                }
                value.SingleSelect = false;
            });
            StocktransferEntryCtrl.ePage.Masters.SelectAll = false;
            GetOrgPartRelationValues();
        }

        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(StocktransferEntryCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (IsArray) {
                if (!fieldvalue) {
                    StocktransferEntryCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, StocktransferEntryCtrl.currentStockTransfer.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
                } else {
                    StocktransferEntryCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, StocktransferEntryCtrl.currentStockTransfer.label, IsArray, RowIndex, value.ColIndex);
                }
            } else {
                if (!fieldvalue) {
                    StocktransferEntryCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, StocktransferEntryCtrl.currentStockTransfer.label, false, undefined, undefined, undefined, undefined, undefined);
                } else {
                    StocktransferEntryCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, StocktransferEntryCtrl.currentStockTransfer.label);
                }
            }
        }

        function GetDropDownList() {
            var typeCodeList = ["StockTransferStatus", "StockTransferType", "INW_LINE_UQ", "WMSYESNO"];
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
                        StocktransferEntryCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        StocktransferEntryCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function generalOperation() {
            // warehouse
            if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseCode == null) {
                StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseCode = "";
            }
            if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseName == null) {
                StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseName = "";
            }
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Warehouse = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseCode + ' - ' + StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseName;
            if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Warehouse == ' - ')
                StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Warehouse = "";

            // Client
            if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode == null) {
                StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode = "";
            }
            if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientName == null) {
                StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientName = "";
            }
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode + ' - ' + StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientName;
            if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client == ' - ')
                StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client = "";
        }

        function getLineList() {
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine;
            angular.forEach(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine, function (value, key) {
                // Product
                if (value.ProductCode == null)
                    value.ProductCode = '';

                if (value.ProductDescription == null)
                    value.ProductDescription = '';

                if (value.MCC_NKCommodityCode == null)
                    value.MCC_NKCommodityCode = '';

                if (value.MCC_NKCommodityDesc == null)
                    value.MCC_NKCommodityDesc = '';

                value.Product = value.ProductCode + ' - ' + value.ProductDescription;
                value.Commodity = value.MCC_NKCommodityCode + ' - ' + value.MCC_NKCommodityDesc;

                if (value.Product == ' - ')
                    value.Product = '';

                if (value.Commodity == ' - ')
                    value.Commodity = '';

                value.ORG_ClientCode = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode;
                value.ORG_ClientName = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientName;
                value.Client_FK = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ORG_Client_FK;

                value.WAR_WarehouseCode = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseCode;
                value.WAR_WarehouseName = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseName;
                value.WAR_FK = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WAR_FK;

                if(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client){
                    value.Client = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode;
                    value.ClientRelationship = "OWN";
                }
            });
            GetOrgPartRelationValues();
        }

        function SelectedLookupClient(item) {
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client = item.Code + '-' + item.FullName;
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIOrgHeader = item;
            DefaultFilter();
            OnChangeValues(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client, 'E11011');
            getPartAttributeDetails();
        }

        function SelectedLookupWarehouse(item) {
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Warehouse = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseCode + ' - ' + StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseName;
            DefaultFilter();
            OnChangeValues(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Warehouse, 'E11012');
        }

        function SelectedLocationSource(item) {
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[StocktransferEntryCtrl.ePage.Masters.selectedRow].WLO_TransferFrom = item.Location;
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[StocktransferEntryCtrl.ePage.Masters.selectedRow].WLO_TransferFrom_FK = item.PK;

            OnChangeValues(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[StocktransferEntryCtrl.ePage.Masters.selectedRow].WLO_TransferFrom, "E11008", true, StocktransferEntryCtrl.ePage.Masters.selectedRow);
            if(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[StocktransferEntryCtrl.ePage.Masters.selectedRow].WLO_TransferFrom){
                if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[StocktransferEntryCtrl.ePage.Masters.selectedRow].WLO_TransferFrom == StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[StocktransferEntryCtrl.ePage.Masters.selectedRow].WLO_Location) {
                    OnChangeValues(null, "E11013", true, StocktransferEntryCtrl.ePage.Masters.selectedRow);
                    OnChangeValues(null, "E11014", true, StocktransferEntryCtrl.ePage.Masters.selectedRow);
                } else {
                    OnChangeValues('value', "E11013", true, StocktransferEntryCtrl.ePage.Masters.selectedRow);
                    OnChangeValues('value', "E11014", true, StocktransferEntryCtrl.ePage.Masters.selectedRow);
                }
            }
        }

        function SelectedLocationDestination(item) {
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[StocktransferEntryCtrl.ePage.Masters.selectedRow].WLO_Location = item.Location;
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[StocktransferEntryCtrl.ePage.Masters.selectedRow].WLO_FK = item.PK;

            OnChangeValues(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[StocktransferEntryCtrl.ePage.Masters.selectedRow].WLO_Location, "E11009", true, StocktransferEntryCtrl.ePage.Masters.selectedRow);
            if(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[StocktransferEntryCtrl.ePage.Masters.selectedRow].WLO_Location){
                if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[StocktransferEntryCtrl.ePage.Masters.selectedRow].WLO_TransferFrom == StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[StocktransferEntryCtrl.ePage.Masters.selectedRow].WLO_Location) {
                    OnChangeValues(null, "E11013", true, StocktransferEntryCtrl.ePage.Masters.selectedRow);
                    OnChangeValues(null, "E11014", true, StocktransferEntryCtrl.ePage.Masters.selectedRow);
                } else {
                    OnChangeValues('value', "E11013", true, StocktransferEntryCtrl.ePage.Masters.selectedRow);
                    OnChangeValues('value', "E11014", true, StocktransferEntryCtrl.ePage.Masters.selectedRow);
                }
            }
        }

        function SelectedLookupProduct(item) {
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[StocktransferEntryCtrl.ePage.Masters.selectedRow].Product = item.ProductCode + ' - ' + item.ProductDescription;
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[StocktransferEntryCtrl.ePage.Masters.selectedRow].PRO_FK = item.OSP_FK;

            if(item.MCC_NKCommodityCode==null)
            item.MCC_NKCommodityCode = '';

            if(item.MCC_NKCommodityDesc==null)
            item.MCC_NKCommodityDesc = '';

            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[StocktransferEntryCtrl.ePage.Masters.selectedRow].Commodity = item.MCC_NKCommodityCode+' - '+item.MCC_NKCommodityDesc;

            //To remove Attributes when copy row
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[StocktransferEntryCtrl.ePage.Masters.selectedRow].PartAttrib1='';
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[StocktransferEntryCtrl.ePage.Masters.selectedRow].PartAttrib2='';
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[StocktransferEntryCtrl.ePage.Masters.selectedRow].PartAttrib3='';
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[StocktransferEntryCtrl.ePage.Masters.selectedRow].PackingDate='';
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[StocktransferEntryCtrl.ePage.Masters.selectedRow].ExpiryDate='';
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[StocktransferEntryCtrl.ePage.Masters.selectedRow].Units = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[StocktransferEntryCtrl.ePage.Masters.selectedRow].Packs;
            
            OnChangeValues(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[StocktransferEntryCtrl.ePage.Masters.selectedRow].Product, 'E11004', true, StocktransferEntryCtrl.ePage.Masters.selectedRow);
            OnChangeValues(item.StockKeepingUnit, 'E11007', true, StocktransferEntryCtrl.ePage.Masters.selectedRow);
        }

        function FetchQuantity(item, index) {
            if ((StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib1Type == "SER" && item.UsePartAttrib1 && !item.IsPartAttrib1ReleaseCaptured) || (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib2Type == "SER" && item.UsePartAttrib2 && !item.IsPartAttrib2ReleaseCaptured) || (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib3Type == "SER" && item.UsePartAttrib3 && !item.IsPartAttrib3ReleaseCaptured)) {
                if (parseFloat(item.Units) > 1) {
                    OnChangeValues(null, "E11017", true, StocktransferEntryCtrl.ePage.Masters.selectedRow);
                } else {
                    OnChangeValues('value', "E11017", true, StocktransferEntryCtrl.ePage.Masters.selectedRow);
                }
            }
            if (item.PAC_PackType == item.StockKeepingUnit) {
                item.Units = item.Packs;
                OnChangeValues(item.Units, "E11006", true, index);
            } else {
                var _input = {
                    "OSP_FK": item.PRO_FK,
                    "FromPackType": item.PAC_PackType,
                    "ToPackType": item.StockKeepingUnit,
                    "Quantity": item.Packs
                };
                if (item.PRO_FK && item.PAC_PackType && item.StockKeepingUnit && item.Packs) {
                    apiService.post("eAxisAPI", StocktransferEntryCtrl.ePage.Entities.Header.API.FetchQuantity.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            item.Units = response.data.Response;
                            OnChangeValues(item.Units, "E11006", true, index);
                        }
                    });
                }
            }
        }
        
        
        
        
        function PartAttribute(item, index) {
            if (!item.IsPartAttrib1ReleaseCaptured && StocktransferEntryCtrl.ePage.Masters.Config.EnableFinaliseValidation==true) {
                if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib1Type == "SER" && item.UsePartAttrib1 || StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib1Type == "MAN" && item.UsePartAttrib1 || StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib1Type == "BAT" && item.UsePartAttrib1) {
                    if (!item.PartAttrib1)
                        OnChangeValues(null, 'E11018', true, index);
                    else
                        OnChangeValues('value', 'E11018', true, index);
                }
            }
            if (!item.IsPartAttrib2ReleaseCaptured && StocktransferEntryCtrl.ePage.Masters.Config.EnableFinaliseValidation==true) {
                if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib2Type == "SER" && item.UsePartAttrib2 || StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib2Type == "MAN" && item.UsePartAttrib2 || StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib2Type == "BAT" && item.UsePartAttrib2) {
                    if (!item.PartAttrib2)
                        OnChangeValues(null, 'E11019', true, index);
                    else
                        OnChangeValues('value', 'E11019', true, index);
                }
            }
            if (!item.IsPartAttrib3ReleaseCaptured && StocktransferEntryCtrl.ePage.Masters.Config.EnableFinaliseValidation==true) {
                if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib3Type == "SER" && item.UsePartAttrib3 || StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib3Type == "MAN" && item.UsePartAttrib3 || StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib3Type == "BAT" && item.UsePartAttrib3) {
                    if (!item.PartAttrib3)
                        OnChangeValues(null, 'E11020', true, index);
                    else
                        OnChangeValues('value', 'E11020', true, index);
                }
            }
            if (item.UsePackingDate && StocktransferEntryCtrl.ePage.Masters.Config.EnableFinaliseValidation==true) {
                if (!item.PackingDate)
                    OnChangeValues(null, 'E11021', true, index);
                else
                    OnChangeValues('value', 'E11021', true, index);
            }
            if (item.UseExpiryDate && StocktransferEntryCtrl.ePage.Masters.Config.EnableFinaliseValidation==true) {
                if (!item.ExpiryDate)
                    OnChangeValues(null, 'E11022', true, index);
                else
                    OnChangeValues('value', 'E11022', true, index);
            }

        }
        // DatePicker
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            StocktransferEntryCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function setSelectedRow(index) {
            StocktransferEntryCtrl.ePage.Masters.selectedRow = index;
        }

        function RemoveAllLineErrors() {
            for (var i = 0; i < StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.length; i++) {
                OnChangeValues('value', "E11004", true, i);
                OnChangeValues('value', "E11005", true, i);
                OnChangeValues('value', "E11006", true, i);
                OnChangeValues('value', "E11007", true, i);
                OnChangeValues('value', "E11008", true, i);
                OnChangeValues('value', "E11009", true, i);
                OnChangeValues('value', "E11010", true, i);
                OnChangeValues('value', "E11013", true, i);
                OnChangeValues('value', "E11014", true, i);
                OnChangeValues('value', "E11015", true, i);
                OnChangeValues('value', "E11016", true, i);
                OnChangeValues('value', "E11017", true, i);
                OnChangeValues('value', "E11018", true, i);
                OnChangeValues('value', "E11019", true, i);
                OnChangeValues('value', "E11020", true, i);
                OnChangeValues('value', "E11021", true, i);
                OnChangeValues('value', "E11022", true, i);
                OnChangeValues('value', "E11023", true, i);
                OnChangeValues('value', "E11024", true, i);
                OnChangeValues('value', "E11025", true, i);
            }
            return true;
        }

        function Back() {
            var ReturnValue = RemoveAllLineErrors();
            if (ReturnValue) {
                StocktransferEntryCtrl.ePage.Masters.Config.GeneralValidation(StocktransferEntryCtrl.currentStockTransfer);
            }
            StocktransferEntryCtrl.ePage.Masters.Lineslist = true;
            StocktransferEntryCtrl.ePage.Masters.Config.GeneralValidation(StocktransferEntryCtrl.currentStockTransfer);
        }

        function Done() {
            var ReturnValue = RemoveAllLineErrors();
            if (ReturnValue) {
                if (StocktransferEntryCtrl.ePage.Masters.HeaderName == 'New List') {
                    Validation(StocktransferEntryCtrl.currentStockTransfer);
                    $timeout(function () {
                        var objDiv = document.getElementById("StocktransferEntryCtrl.ePage.Masters.your_div");
                        objDiv.scrollTop = objDiv.scrollHeight;
                    }, 500);
                }
            }
            Validation(StocktransferEntryCtrl.currentStockTransfer);
            StocktransferEntryCtrl.ePage.Masters.Lineslist = true;
        }

        function Edit(index, name) {
            StocktransferEntryCtrl.ePage.Masters.selectedRow = index;
            StocktransferEntryCtrl.ePage.Masters.Lineslist = false;
            StocktransferEntryCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        $document.bind('keydown', function (e) {
            if (StocktransferEntryCtrl.ePage.Masters.selectedRow != -1) {
                if (StocktransferEntryCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (StocktransferEntryCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        StocktransferEntryCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (StocktransferEntryCtrl.ePage.Masters.selectedRow == StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.length - 1) {
                            return;
                        }
                        StocktransferEntryCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });


        function CopyRow() {
            if (!StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client || !StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Warehouse) {
                StocktransferEntryCtrl.ePage.Masters.Config.GeneralValidation(StocktransferEntryCtrl.currentStockTransfer);
            } else {
                var item = angular.copy(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[StocktransferEntryCtrl.ePage.Masters.selectedRow]);
                var obj = {
                    "PK": "",
                    "ProductCode": item.ProductCode,
                    "ProductDescription": item.ProductDescription,
                    "Product": item.Product,
                    "PRO_FK": item.PRO_FK,
                    "Commodity": item.Commodity,
                    "MCC_NKCommodityCode": item.MCC_NKCommodityCode,
                    "MCC_NKCommodityDesc": item.MCC_NKCommodityDesc,
                    "Packs": item.Packs,
                    "PAC_PackType": item.PAC_PackType,
                    "Units": item.Units,
                    "StockKeepingUnit": item.StockKeepingUnit,
            
                    "PalletID":item.PalletID,
                    "TransferFromPalletId": item.TransferFromPalletId,
                    "WLO_Location": item.WLO_Location,
                    "WLO_FK": item.WLO_FK,
                    "WLO_TransferFrom": item.WLO_TransferFrom,
                    "WLO_TransferFrom_FK":item.WLO_TransferFrom_FK,

                    "AdjustmentArrivalDate": item.AdjustmentArrivalDate,
                    "LineComment": item.LineComment,
                    "IsDeleted": false,

                    "ORG_ClientCode": StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode,
                    "ORG_ClientName": StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientName,
                    "Client_FK": StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ORG_Client_FK,

                    "WAR_WarehouseCode": StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseCode,
                    "WAR_WarehouseName": StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseName,
                    "WAR_FK": StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WAR_FK,

                    "PartAttrib1": item.PartAttrib1,
                    "PartAttrib2": item.PartAttrib2,
                    "PartAttrib3": item.PartAttrib3,
                    "PackingDate": item.PackingDate,
                    "ExpiryDate": item.ExpiryDate,
                    "UseExpiryDate": item.UseExpiryDate,
                    "UsePackingDate": item.UsePackingDate,
                    "UsePartAttrib1": item.UsePartAttrib1,
                    "UsePartAttrib2": item.UsePartAttrib2,
                    "UsePartAttrib3": item.UsePartAttrib3,
                    "IsPartAttrib1ReleaseCaptured": item.IsPartAttrib1ReleaseCaptured,
                    "IsPartAttrib2ReleaseCaptured": item.IsPartAttrib2ReleaseCaptured,
                    "IsPartAttrib3ReleaseCaptured": item.IsPartAttrib3ReleaseCaptured,

                    "WorkOrderLineStatus": "",
                    "WorkOrderLineStatusDesc": "",
                    "OriginalInventoryStatus": "",
                    "OriginalInventoryStatusDesc": "",
                };
                if(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client){
                    obj.Client = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode;
                    obj.ClientRelationship = "OWN";
                }
                StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.splice(StocktransferEntryCtrl.ePage.Masters.selectedRow + 1, 0, obj);
                StocktransferEntryCtrl.ePage.Masters.Edit(StocktransferEntryCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
            }
        }

        function RemoveRow() {
            var item = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[StocktransferEntryCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {

                    if (item.PK) {
                        apiService.get("eAxisAPI", StocktransferEntryCtrl.ePage.Entities.Header.API.LineDelete.Url + item.PK).then(function (response) {
                        });
                    }
                    var ReturnValue = RemoveAllLineErrors();
                    if (ReturnValue) {
                        StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.splice(StocktransferEntryCtrl.ePage.Masters.selectedRow, 1);
                        StocktransferEntryCtrl.ePage.Masters.Config.GeneralValidation(StocktransferEntryCtrl.currentStockTransfer);
                    }
                    toastr.success('Record Removed Successfully');
                    StocktransferEntryCtrl.ePage.Masters.Lineslist = true;
                    StocktransferEntryCtrl.ePage.Masters.selectedRow = StocktransferEntryCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function AddNewRow() {
            if (!StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client || !StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Warehouse) {
                StocktransferEntryCtrl.ePage.Masters.Config.GeneralValidation(StocktransferEntryCtrl.currentStockTransfer);
                StocktransferEntryCtrl.ePage.Masters.Config.ShowErrorWarningModal(StocktransferEntryCtrl.currentStockTransfer);
            } else {
                var obj = {
                    "PK": "",
                    "ProductCode": "",
                    "ProductDescription": "",
                    "Product": "",
                    "PRO_FK": "",
                    "Commodity": "",
                    "MCC_NKCommodityCode": "",
                    "MCC_NKCommodityDesc": "",
                    "Packs": "",
                    "PAC_PackType": "",
                    "Units": "",
                    "StockKeepingUnit": "",
                    "CommitedUnit": "",
                    "WorkOrderLineStatus": "",
                    "WorkOrderLineStatusDesc": "",
                    "OriginalInventoryStatus": "",
                    "OriginalInventoryStatusDesc": "",
                    "PalletID": "",
                    "TransferFromPalletId": "",
                    "WLO_Location": "",
                    "WLO_TransferFrom": "",
                    "WLO_FK": "",
                    "WLO_TransferFrom_FK": "",
                    "EMP_PutawayBy": "",
                    "WHC_NKOriginalInventoryHeldCode": "",
                    "PutawayTime": "",
                    "AdjustmentArrivalDate": "",
                    "PickedTime": "",
                    "ExpiryDate": "",
                    "LineComment": "",
                    "PickedBy": "",
                    "IsDeleted": false,
                    "UseExpiryDate": false,
                    "UsePackingDate": false,
                    "UsePartAttrib1": false,
                    "UsePartAttrib2": false,
                    "UsePartAttrib3": false,
                    "IsPartAttrib1ReleaseCaptured": false,
                    "IsPartAttrib2ReleaseCaptured": false,
                    "IsPartAttrib3ReleaseCaptured": false,

                    "ORG_ClientCode": StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode,
                    "ORG_ClientName": StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientName,
                    "Client_FK": StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ORG_Client_FK,

                    "WAR_WarehouseCode": StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseCode,
                    "WAR_WarehouseName": StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseName,
                    "WAR_FK": StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WAR_FK,
                };
                if(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client){
                    obj.Client = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode;
                    obj.ClientRelationship = "OWN";
                }
                StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.push(obj);
                StocktransferEntryCtrl.ePage.Masters.Edit(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.length - 1, 'New List');
            }
        };

        function getPartAttributeDetails(){
            if(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ORG_Client_FK){
                var _filter = {
                    "ORG_FK": StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ORG_Client_FK
                };
    
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": StocktransferEntryCtrl.ePage.Entities.Header.API.OrgMiscServ.FilterID
                };
    
                apiService.post("eAxisAPI", StocktransferEntryCtrl.ePage.Entities.Header.API.OrgMiscServ.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib1Name = response.data.Response[0].IMPartAttrib1Name;
                        StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib2Name = response.data.Response[0].IMPartAttrib2Name;
                        StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib3Name = response.data.Response[0].IMPartAttrib3Name;
                        StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib1Type = response.data.Response[0].IMPartAttrib1Type;
                        StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib2Type = response.data.Response[0].IMPartAttrib2Type;
                        StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib3Type = response.data.Response[0].IMPartAttrib3Type;
                    }
                });
            }
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            StocktransferEntryCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (StocktransferEntryCtrl.ePage.Entities.Header.Validations) {
                StocktransferEntryCtrl.ePage.Masters.Config.RemoveApiErrors(StocktransferEntryCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                StocktransferEntryCtrl.ePage.Masters.Config.EnableFinaliseValidation=false;
                SaveList($item);
            } else {
                StocktransferEntryCtrl.ePage.Masters.Config.ShowErrorWarningModal(StocktransferEntryCtrl.currentStockTransfer);
            }
        }
        function SaveList($item) {
            StocktransferEntryCtrl.ePage.Masters.IsLoadingToSave = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIWmsStockTransferHeader.PK = _input.PK;
                _input.UIWmsStockTransferHeader.CreatedDateTime = new Date();
                _input.UIWmsStockTransferHeader.WorkOrderType = 'TFR';
                _input.UIWmsStockTransferHeader.WorkOrderStatus = 'ENT';
                _input.UIWmsStockTransferHeader.WorkOrderStatusDesc = 'Entered';
                _input.UIWmsStockTransferHeader.ExternalReference = _input.UIWmsStockTransferHeader.WorkOrderID;
            }

            $item = filterObjectUpdate($item, "IsModified");

            helperService.SaveEntity($item, 'StockTransfer').then(function (response) {
                if (response.Status === "success") {

                    stocktransferConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderID) {
                                value.label = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderID;
                                value[StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderID] = value.New;
                                delete value.New;
                            }
                        }
                    });

                    var _index = stocktransferConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(StocktransferEntryCtrl.currentStockTransfer[StocktransferEntryCtrl.currentStockTransfer.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        stocktransferConfig.TabList[_index][stocktransferConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        stocktransferConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/stock-transfer") {
                            helperService.refreshGrid();
                        }
                        $timeout(function () {
                            StocktransferEntryCtrl.ePage.Masters.IsLoadingToSave = false;
                        }, 1000);

                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    StocktransferEntryCtrl.ePage.Masters.IsLoadingToSave = false;
                    console.log("Failed");
                    StocktransferEntryCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        StocktransferEntryCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, StocktransferEntryCtrl.currentStockTransfer.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (StocktransferEntryCtrl.ePage.Entities.Header.Validations != null) {
                        StocktransferEntryCtrl.ePage.Masters.Config.ShowErrorWarningModal(StocktransferEntryCtrl.currentStockTransfer);
                    }
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
