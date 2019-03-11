(function () {
    "use strict";

    angular
        .module("Application")
        .controller("StocktransferEntryController", StocktransferEntryController);

    StocktransferEntryController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "stocktransferConfig", "appConfig", "toastr", "$document", "confirmation", "$filter","dynamicLookupConfig"];

    function StocktransferEntryController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, stocktransferConfig, appConfig, toastr, $document, confirmation, $filter,dynamicLookupConfig) {
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

            StocktransferEntryCtrl.ePage.Masters.Config = stocktransferConfig;

            //For table
            StocktransferEntryCtrl.ePage.Masters.SelectAll = false;
            StocktransferEntryCtrl.ePage.Masters.EnableDeleteButton = false;
            StocktransferEntryCtrl.ePage.Masters.EnableCopyButton = false;
            StocktransferEntryCtrl.ePage.Masters.Enable = true;
            StocktransferEntryCtrl.ePage.Masters.EnableInventory = true;
            StocktransferEntryCtrl.ePage.Masters.selectedRow = -1;
            StocktransferEntryCtrl.ePage.Masters.selectedRowInventory = -1;
            StocktransferEntryCtrl.ePage.Masters.emptyText = '-';
            StocktransferEntryCtrl.ePage.Masters.SearchTable = '';

            StocktransferEntryCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            StocktransferEntryCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            StocktransferEntryCtrl.ePage.Masters.SelectAllCheckBoxInventory = SelectAllCheckBoxInventory;
            StocktransferEntryCtrl.ePage.Masters.SingleSelectCheckBoxInventory = SingleSelectCheckBoxInventory;
            StocktransferEntryCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            StocktransferEntryCtrl.ePage.Masters.setSelectedRowInventory = setSelectedRowInventory;
            StocktransferEntryCtrl.ePage.Masters.AddNewRow = AddNewRow;
            StocktransferEntryCtrl.ePage.Masters.CopyRow = CopyRow;
            StocktransferEntryCtrl.ePage.Masters.RemoveRow = RemoveRow;

            StocktransferEntryCtrl.ePage.Masters.DropDownMasterList = {};
            StocktransferEntryCtrl.ePage.Masters.Inventory = [];

            StocktransferEntryCtrl.ePage.Masters.DatePicker = {};
            StocktransferEntryCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            StocktransferEntryCtrl.ePage.Masters.DatePicker.isOpen = [];
            StocktransferEntryCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            //PaginationForInventory
            StocktransferEntryCtrl.ePage.Masters.PaginationForInventory = {};
            StocktransferEntryCtrl.ePage.Masters.PaginationForInventory.CurrentPage = 1;
            StocktransferEntryCtrl.ePage.Masters.PaginationForInventory.MaxSize = 3;
            StocktransferEntryCtrl.ePage.Masters.PaginationForInventory.ItemsPerPage = 25;

            StocktransferEntryCtrl.ePage.Masters.SelectedLookupClient = SelectedLookupClient;
            StocktransferEntryCtrl.ePage.Masters.SelectedLookupWarehouse = SelectedLookupWarehouse;
            StocktransferEntryCtrl.ePage.Masters.SelectedLocationSource = SelectedLocationSource;
            StocktransferEntryCtrl.ePage.Masters.SelectedLocationDestination = SelectedLocationDestination;
            StocktransferEntryCtrl.ePage.Masters.SelectedLookupProduct = SelectedLookupProduct;
            StocktransferEntryCtrl.ePage.Masters.FetchQuantity = FetchQuantity;
            StocktransferEntryCtrl.ePage.Masters.AddToLine = AddToLine;
            StocktransferEntryCtrl.ePage.Masters.CheckFutureDate = CheckFutureDate;
            StocktransferEntryCtrl.ePage.Masters.UDF = UDF;
            StocktransferEntryCtrl.ePage.Masters.GetFilterList = GetFilterList;
            StocktransferEntryCtrl.ePage.Masters.CloseFilterList = CloseFilterList;
            StocktransferEntryCtrl.ePage.Masters.Filter = Filter;
            StocktransferEntryCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            //PaginationForStocktransferLine
            StocktransferEntryCtrl.ePage.Masters.PaginationForTfrLine = {};
            StocktransferEntryCtrl.ePage.Masters.PaginationForTfrLine.CurrentPage = 1;
            StocktransferEntryCtrl.ePage.Masters.PaginationForTfrLine.MaxSize = 3;
            StocktransferEntryCtrl.ePage.Masters.PaginationForTfrLine.ItemsPerPage = 25;
            StocktransferEntryCtrl.ePage.Masters.PaginationChangeForTfrLine = PaginationChangeForTfrLine;
            StocktransferEntryCtrl.ePage.Masters.LocalSearchLengthCalculation = LocalSearchLengthCalculation;
            StocktransferEntryCtrl.ePage.Masters.PaginationForTfrLine.LocalSearchLength = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.length;

            StocktransferEntryCtrl.ePage.Masters.CurrentPageStartingIndex = (StocktransferEntryCtrl.ePage.Masters.PaginationForTfrLine.ItemsPerPage) * (StocktransferEntryCtrl.ePage.Masters.PaginationForTfrLine.CurrentPage - 1)

             // Watch when Line length changes
             $scope.$watch('StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.length', function (val) {
                LocalSearchLengthCalculation();
            });

            GetUserBasedGridColumList();
            GetUserBasedGridColumListForInventory();
            GetDropDownList();
            GetLineList();
            GeneralOperation();
            DefaultFilter();
            GetUDFDetails();
            InitDocuments();
        }


        //#region User Based Table Column
        function GetUserBasedGridColumList() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_STOCKTRANSFERLINE",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response[0]) {
                    StocktransferEntryCtrl.ePage.Masters.UserValue = response.data.Response[0];
                    if (response.data.Response[0].Value != '') {
                        var obj = JSON.parse(response.data.Response[0].Value)
                        StocktransferEntryCtrl.ePage.Entities.Header.TableProperties.UIWmsStockTransferLine = obj;
                        StocktransferEntryCtrl.ePage.Masters.UserHasValue = true;
                    }
                } else {
                    StocktransferEntryCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }

        //#endregion
        function GetUserBasedGridColumListForInventory() {
            var _filter1 = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_STOCKTRANSFERINVENTORY",
            };
            var _input1 = {
                "searchInput": helperService.createToArrayOfObject(_filter1),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input1).then(function (response) {
                if (response.data.Response[0]) {
                    StocktransferEntryCtrl.ePage.Masters.UserValueForInventory = response.data.Response[0];
                    if (response.data.Response[0].Value != '') {
                        var obj = JSON.parse(response.data.Response[0].Value)
                        StocktransferEntryCtrl.ePage.Entities.Header.TableProperties.Inventory = obj;
                        StocktransferEntryCtrl.ePage.Masters.UserHasValueForInventory = true;
                    }
                } else {
                    StocktransferEntryCtrl.ePage.Masters.UserValueForInventory = undefined;
                }
            })
        }
        //#endregion   

        //#region Header Details

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            StocktransferEntryCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetDropDownList() {
            var typeCodeList = ["StockTransferStatus", "StockTransferType", "INW_LINE_UQ", "WMSYESNO","ProductCondition"];
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

        function GeneralOperation() {
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

            if(StocktransferEntryCtrl.currentStockTransfer.isNew)
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderSubType = 'TFR';
        }

        function SelectedLookupClient(item) { 
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client = item.Code + '-' + item.FullName;
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIOrgHeader = item;
            DefaultFilter();
            OnChangeValues(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client, 'E11011');
            GetUDFDetails();
        }

        function SelectedLookupWarehouse(item) {
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Warehouse = item.WarehouseCode + ' - ' + item.WarehouseName;
            DefaultFilter();
            OnChangeValues(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Warehouse, 'E11012');
        }

        function GetUDFDetails() {
            if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ORG_Client_FK) {
                var _filter = {
                    "ORG_FK": StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ORG_Client_FK
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.OrgMiscServ.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", appConfig.Entities.OrgMiscServ.API.FindAll.Url, _input).then(function (response) {
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
        //#endregion

        //#region Line Details

        //#region general

        function GetLineList() {
            var myData = true;
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine;
            angular.forEach(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine, function (value, key) {
                // Product
           

                if (value.MCC_NKCommodityCode == null)
                    value.MCC_NKCommodityCode = '';

                if (value.MCC_NKCommodityDesc == null)
                    value.MCC_NKCommodityDesc = '';

                value.Commodity = value.MCC_NKCommodityCode + ' - ' + value.MCC_NKCommodityDesc;


                if (value.Commodity == ' - ')
                    value.Commodity = '';

                value.ORG_ClientCode = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode;
                value.ORG_ClientName = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientName;
                value.Client_FK = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ORG_Client_FK;

                value.WAR_WarehouseCode = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseCode;
                value.WAR_WarehouseName = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseName;
                value.WAR_FK = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WAR_FK;

                if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client) {
                    value.Client = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode;
                    value.ClientRelationship = "OWN";
                }

                if (!value.PRO_FK && value.ProductCode) {
                    myData = false;
                }
            });

             //Order By
             StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine = $filter('orderBy')(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine, 'CreatedDateTime');


            if (myData == false) {
                StocktransferEntryCtrl.ePage.Masters.Config.GeneralValidation(StocktransferEntryCtrl.currentStockTransfer);
            }
        }

        //#endregion

        //#region  Bulk Upload
        function InitDocuments() {
            StocktransferEntryCtrl.ePage.Masters.Documents = {};
            StocktransferEntryCtrl.ePage.Masters.Documents.Autherization = authService.getUserInfo().AuthToken;
            StocktransferEntryCtrl.ePage.Masters.Documents.fileDetails = [];
            StocktransferEntryCtrl.ePage.Masters.Documents.fileSize = 10;
            StocktransferEntryCtrl.ePage.Entities.Entity = 'StocktransferLines';
            StocktransferEntryCtrl.ePage.Entities.EntityRefCode = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderID;

            var _additionalValue = {
                "Entity": StocktransferEntryCtrl.ePage.Entities.Entity,
                "Path": StocktransferEntryCtrl.ePage.Entities.Entity + "," + StocktransferEntryCtrl.ePage.Entities.EntityRefCode
            };

            StocktransferEntryCtrl.ePage.Masters.Documents.AdditionalValue = JSON.stringify(_additionalValue);
            StocktransferEntryCtrl.ePage.Masters.Documents.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.UploadExcel.Url;

            StocktransferEntryCtrl.ePage.Masters.Documents.GetUploadedFiles = GetUploadedFiles;
            StocktransferEntryCtrl.ePage.Masters.Documents.GetSelectedFiles = GetSelectedFiles;
            StocktransferEntryCtrl.ePage.Masters.Documents.DownloadReport = DownloadReport;
        }

        function GetUploadedFiles(Files, docType, mode) {
            if(Files){
                BulkUpload(Files);
            }
        }

        function GetSelectedFiles(Files, docType, mode, row) {
            StocktransferEntryCtrl.ePage.Masters.Loading = true;
        }

        function DownloadReport() {
            StocktransferEntryCtrl.ePage.Masters.Loading = true;
            apiService.get("eAxisAPI", appConfig.Entities.DMS.API.DownloadTemplate.Url + "/StockTransferLineBulkUpload").then(function (response) {
                StocktransferEntryCtrl.ePage.Masters.Loading = false;
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        var obj = {
                            "Base64str": response.data.Response,
                            "Name": 'StockLineBulkUpload.xlsx'
                        }
                        helperService.DownloadDocument(obj);
                    }
                } else {
                    console.log("Invalid response");
                }
            });
        }

        function BulkUpload(item) {
            if (item.length == 0) {
                StocktransferEntryCtrl.ePage.Masters.Loading = false;
                toastr.warning('Upload Excel With Product Details');
            } else {
                var obj = {
                    "LineType": "UIWmsWorkOrderLine",
                    "WmsWorkOrder": {
                        "WorkOrderID": StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderID,
                        "WarehouseCode": StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseCode,
                        "ClientCode": StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode
                    },
                    "WmsInsertLineRecordsList": ''
                }
                obj.WmsInsertLineRecordsList = item;

                apiService.post("eAxisAPI", StocktransferEntryCtrl.ePage.Entities.Header.API.InsertLine.Url, obj).then(function (response) {
                    StocktransferEntryCtrl.ePage.Masters.Loading = false;
                    if (response.data.Response) {
                        angular.forEach(response.data.Response, function (value, key) {
                            value.PK = '';
                            value.AdjustmentArrivalDate = new Date();
                            
                            value.PK='';
                            if(!value.Packs){
                                value.Packs = 1;
                                value.Units = 1;
                            }
                            if(!value.PAC_PackType){
                                value.PAC_PackType = value.StockKeepingUnit;
                            }
                            if(!value.ProductCondition){
                                value.ProductCondition = "GDC"
                            }
                            if(value.IsPartAttrib1ReleaseCaptured || !value.UsePartAttrib1){
                                value.PartAttrib1 = '';
                            }
                            if(value.IsPartAttrib2ReleaseCaptured || !value.UsePartAttrib2){
                                value.PartAttrib2 = '';
                            }
                            if(value.IsPartAttrib3ReleaseCaptured || !value.UsePartAttrib3){
                                value.PartAttrib3 = '';
                            }
                            if(!value.UsePackingDate){
                                value.PackingDate = '';
                            }
                            if(!value.UseExpiryDate){
                                value.ExpiryDate = '';
                            }

                            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.push(value);
                        });
                        GetLineList();
                    }else{
                        toastr.error("Upload Failed");
                    }
                });
            }
        }
        //#endregion

        //#region checkbox selection
        function SelectAllCheckBox(){
            angular.forEach(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine, function (value, key) {
                var startData = StocktransferEntryCtrl.ePage.Masters.CurrentPageStartingIndex
                var LastData = StocktransferEntryCtrl.ePage.Masters.CurrentPageStartingIndex + (StocktransferEntryCtrl.ePage.Masters.PaginationForTfrLine.ItemsPerPage);
                   
                if (StocktransferEntryCtrl.ePage.Masters.SelectAll){

                    // Enable and disable based on page wise
                    if((key>=startData) && (key<LastData)){
                        value.SingleSelect = true;
                    }
                }
                else{
                    if((key>=startData) && (key<LastData)){
                        value.SingleSelect = false;
                    }
                }
            });

            var Checked1 = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                StocktransferEntryCtrl.ePage.Masters.EnableDeleteButton = true;
                StocktransferEntryCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                StocktransferEntryCtrl.ePage.Masters.EnableDeleteButton = false;
                StocktransferEntryCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }

        function SingleSelectCheckBox() {
            var startData = StocktransferEntryCtrl.ePage.Masters.CurrentPageStartingIndex
            var LastData = StocktransferEntryCtrl.ePage.Masters.CurrentPageStartingIndex + (StocktransferEntryCtrl.ePage.Masters.PaginationForTfrLine.ItemsPerPage);
                   
            var Checked = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.some(function (value, key) {
              // Enable and disable based on page wise
                if((key>=startData) && (key<LastData)){
                    if(!value.SingleSelect)
                    return true;
                }
            });
            if (Checked) {
                StocktransferEntryCtrl.ePage.Masters.SelectAll = false;
            } else {
                StocktransferEntryCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                StocktransferEntryCtrl.ePage.Masters.EnableDeleteButton = true;
                StocktransferEntryCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                StocktransferEntryCtrl.ePage.Masters.EnableDeleteButton = false;
                StocktransferEntryCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }

        function PaginationChangeForTfrLine() {
            StocktransferEntryCtrl.ePage.Masters.CurrentPageStartingIndex = (StocktransferEntryCtrl.ePage.Masters.PaginationForTfrLine.ItemsPerPage) * (StocktransferEntryCtrl.ePage.Masters.PaginationForTfrLine.CurrentPage - 1)
            SingleSelectCheckBox();
        }

        //Required this function when pagination and local search both are used
        function LocalSearchLengthCalculation() {
            var myData = $filter('filter')(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine, StocktransferEntryCtrl.ePage.Masters.SearchTable);
            StocktransferEntryCtrl.ePage.Masters.PaginationForTfrLine.LocalSearchLength = myData.length;
        }
        //#endregion checkbox selection

        //#region Add,copy,delete row

        function setSelectedRow(index) {
            StocktransferEntryCtrl.ePage.Masters.selectedRow = index;
        }

        function setSelectedRowInventory(index) {
            StocktransferEntryCtrl.ePage.Masters.selectedRowInventory = index;
        }

        function AddNewRow() {
            if (!StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client || !StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Warehouse) {
                StocktransferEntryCtrl.ePage.Masters.Config.GeneralValidation(StocktransferEntryCtrl.currentStockTransfer);
                StocktransferEntryCtrl.ePage.Masters.Config.ShowErrorWarningModal(StocktransferEntryCtrl.currentStockTransfer);
            } else {
                StocktransferEntryCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                var obj = {
                    "PK": "",
                    "ProductCode": "",
                    "ProductDescription": "",
                    "PRO_FK": "",
                    "Commodity": "",
                    "MCC_NKCommodityCode": "",
                    "MCC_NKCommodityDesc": "",
                    "ProductCondition":"GDC",
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
                    "WLO_LocationStatus":"",
                    "WLO_LocationStatusDescription":"",
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
                if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client) {
                    obj.Client = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode
                    obj.ClientRelationship = "OWN";
                }
                StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.push(obj);
                StocktransferEntryCtrl.ePage.Masters.selectedRow = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.length - 1;

                $timeout(function () {
                    var objDiv = document.getElementById("StocktransferEntryCtrl.ePage.Masters.AddScroll");
                    objDiv.scrollTop = objDiv.scrollHeight;
                }, 50);
                StocktransferEntryCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
            }
        };

        function CopyRow() {
            StocktransferEntryCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            for (var i = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.length - 1; i >= 0; i--) {
                if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[i].SingleSelect) {
                    var item = angular.copy(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[i]);
                    var obj = {
                        "PK": "",
                        "ProductCode": item.ProductCode,
                        "ProductDescription": item.ProductDescription,
                        "PRO_FK": item.PRO_FK,
                        "Commodity": item.Commodity,
                        "MCC_NKCommodityCode": item.MCC_NKCommodityCode,
                        "MCC_NKCommodityDesc": item.MCC_NKCommodityDesc,
                        "ProductCondition":item.ProductCondition,
                        "Packs": item.Packs,
                        "PAC_PackType": item.PAC_PackType,
                        "Units": item.Units,
                        "StockKeepingUnit": item.StockKeepingUnit,

                        "PalletID": item.PalletID,
                        "TransferFromPalletId": item.TransferFromPalletId,
                        "WLO_Location": item.WLO_Location,
                        "WLO_FK": item.WLO_FK,
                        "WLO_TransferFrom": item.WLO_TransferFrom,
                        "WLO_TransferFrom_FK": item.WLO_TransferFrom_FK,
                        "WLO_LocationStatus":item.WLO_LocationStatus,
                        "WLO_LocationStatusDescription":item.WLO_LocationStatusDescription,

                        "AdjustmentArrivalDate": item.AdjustmentArrivalDate,
                        "LineComment": item.LineComment,
                        "IsDeleted": false,
                        "IsCopied": true,

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
                    if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client) {
                        obj.Client = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode
                        obj.ClientRelationship = "OWN";
                    }
                    StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.splice(i + 1, 0, obj);
                }
            }
            StocktransferEntryCtrl.ePage.Masters.selectedRow = -1;
            StocktransferEntryCtrl.ePage.Masters.SelectAll = false;
            StocktransferEntryCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
        }

        function RemoveRow() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    StocktransferEntryCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

                    angular.forEach(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine, function (value, key) {
                        if (value.SingleSelect == true && value.PK) {
                            apiService.get("eAxisAPI", StocktransferEntryCtrl.ePage.Entities.Header.API.LineDelete.Url + value.PK).then(function (response) {
                            });
                        }
                    });

                    var ReturnValue = RemoveAllLineErrors();
                    if (ReturnValue) {
                        for (var i = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.length - 1; i >= 0; i--) {
                            if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[i].SingleSelect == true)
                                StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.splice(i, 1);
                        }
                        StocktransferEntryCtrl.ePage.Masters.Config.GeneralValidation(StocktransferEntryCtrl.currentStockTransfer);
                    }
                    toastr.success('Record Removed Successfully');
                    StocktransferEntryCtrl.ePage.Masters.selectedRow = -1;
                    StocktransferEntryCtrl.ePage.Masters.SelectAll = false;
                    StocktransferEntryCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    StocktransferEntryCtrl.ePage.Masters.EnableDeleteButton = false;
                }, function () {
                    console.log("Cancelled");
                });
        }
        //#endregion Add,copy,delete row

        //#region Linefunctions
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

        function FetchQuantity(item, index) {
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
                    StocktransferEntryCtrl.ePage.Masters.Loading = true;
                    apiService.post("eAxisAPI", appConfig.Entities.PrdProductUnit.API.FetchQuantity.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            item.Units = response.data.Response;
                            StocktransferEntryCtrl.ePage.Masters.Loading = false;
                            OnChangeValues(item.Units, "E11006", true, index);
                        }
                    });
                }
            }
            if ((StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib1Type == "SER" && item.UsePartAttrib1 && !item.IsPartAttrib1ReleaseCaptured) || (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib2Type == "SER" && item.UsePartAttrib2 && !item.IsPartAttrib2ReleaseCaptured) || (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib3Type == "SER" && item.UsePartAttrib3 && !item.IsPartAttrib3ReleaseCaptured)) {
                if (parseFloat(item.Units) != 1) {
                    OnChangeValues(null, "E11017", true, StocktransferEntryCtrl.ePage.Masters.selectedRow);
                } else if (parseFloat(item.Units) == 1) {
                    OnChangeValues('value', "E11017", true, StocktransferEntryCtrl.ePage.Masters.selectedRow);
                }
            }

            if ((StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib1Type == "SER" &&(item.UsePartAttrib1 || item.IsPartAttrib1ReleaseCaptured)) || (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib2Type == "SER" &&(item.UsePartAttrib2 || item.IsPartAttrib2ReleaseCaptured)) || (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib3Type == "SER" &&(item.UsePartAttrib3 || item.IsPartAttrib3ReleaseCaptured))) {
                if ((parseFloat(item.Units)%1) != 0) {
                    OnChangeValues(null, "E11036", true, StocktransferEntryCtrl.ePage.Masters.selectedRow);
                } else  {
                    OnChangeValues('value', "E11036", true, StocktransferEntryCtrl.ePage.Masters.selectedRow);
                }
            }
        }

        //#endregion

        //#region  Selectedlookups

        function SelectedLocationSource(item, index) {
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].WLO_TransferFrom = item.Location;
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].WLO_TransferFrom_FK = item.PK;

            OnChangeValues(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].WLO_TransferFrom, "E11008", true, index);
            if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].WLO_TransferFrom) {
                if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].WLO_TransferFrom == StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].WLO_Location) {
                    OnChangeValues(null, "E11013", true, index);
                    OnChangeValues(null, "E11014", true, index);
                } else {
                    OnChangeValues('value', "E11013", true, index);
                    OnChangeValues('value', "E11014", true, index);
                }
            }
            OnChangeValues('value', 'E11029', true, index);
        }

        function SelectedLocationDestination(item, index) {
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].WLO_Location = item.Location;
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].WLO_LocationStatus = item.LocationStatus;
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].WLO_LocationStatusDescription = item.LocationStatusDescription;
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].WLO_FK = item.PK;

            OnChangeValues(StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].WLO_Location, "E11009", true, index);
            if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].WLO_Location) {
                if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].WLO_TransferFrom == StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].WLO_Location) {
                    OnChangeValues(null, "E11013", true, index);
                    OnChangeValues(null, "E11014", true, index);
                } else {
                    OnChangeValues('value', "E11013", true, index);
                    OnChangeValues('value', "E11014", true, index);
                }
            }
            OnChangeValues('value', 'E11028', true, index);
        }

        function SelectedLookupProduct(item, index) {
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].PRO_FK = item.OSP_FK;

            if (item.MCC_NKCommodityCode == null)
                item.MCC_NKCommodityCode = '';

            if (item.MCC_NKCommodityDesc == null)
                item.MCC_NKCommodityDesc = '';

            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].Commodity = item.MCC_NKCommodityCode + ' - ' + item.MCC_NKCommodityDesc;

            //To remove Attributes when copy row
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].PartAttrib1 = '';
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].PartAttrib2 = '';
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].PartAttrib3 = '';
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].PackingDate = '';
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].ExpiryDate = '';
            StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].Units = StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].Packs;

            OnChangeValues(item.ProductCode, 'E11004', true, index);
            OnChangeValues(item.StockKeepingUnit, 'E11007', true, index);
            OnChangeValues(item.PAC_PackType, 'E11010', true, index);
            OnChangeValues('value', 'E11027', true, index);
        }
        //#endregion

        //#endregion

        //#region Inventory Line Details

        function CloseFilterList() {
            $('#filterSideBar' + "WarehouseInventory" + StocktransferEntryCtrl.currentStockTransfer.label).removeClass('open');
        }

        function GetFilterList() {
            $timeout(function () {
                $('#filterSideBar' + "WarehouseInventory" + StocktransferEntryCtrl.currentStockTransfer.label).toggleClass('open');
            });
        }

        function DefaultFilter() {
            if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode && StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseCode) {
                StocktransferEntryCtrl.ePage.Masters.defaultFilter = {
                    "ClientCode": StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode,
                    "WAR_WarehouseCode": StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseCode,
                    "InventoryStatusIn": "AVL,HEL"
                };
                StocktransferEntryCtrl.ePage.Masters.DynamicControl = undefined;
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
                    StocktransferEntryCtrl.ePage.Masters.DynamicControl = response.data.Response;
                    dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response.LookUpList);

                    if (StocktransferEntryCtrl.ePage.Masters.defaultFilter !== undefined) {
                        StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities.map(function (value, key) {
                            value.Data = StocktransferEntryCtrl.ePage.Masters.defaultFilter;

                            value.CSS = {};
                            value.ConfigData.map(function (value2, key2) {
                                if(value2.PropertyName == 'ClientCode' || value2.PropertyName == 'WAR_WarehouseCode' || value2.PropertyName=='OriginalInventoryStatus'){
                                    value.CSS["Is" + value2.PropertyName + "Visible"] = true;
                                    value.CSS["Is" + value2.PropertyName + "Disable"] = true;
                                }else{
                                    value.CSS["Is" + value2.PropertyName + "Visible"] = false;
                                    value.CSS["Is" + value2.PropertyName + "Disable"] = false;
                                }
                            });
                        });
                    }
                    StocktransferEntryCtrl.ePage.Masters.ViewType = 1;
                    Filter();
                }
            });
        }


        function Filter() {

            // if searching input and original client and warehouse same then only process

            if((StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ClientCode == StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode)&& (StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities[0].Data.WAR_WarehouseCode==StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseCode)){

                StocktransferEntryCtrl.ePage.Masters.Inventory = [];
                StocktransferEntryCtrl.ePage.Masters.InventoryLoading = true;

                $(".filter-sidebar-wrapper").toggleClass("open");

                var FilterObj = {
                    "ClientCode": StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ClientCode,
                    "WAR_WarehouseCode": StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities[0].Data.WAR_WarehouseCode,
                    "AreaName": StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities[0].Data.AreaName,
                    "InventoryStatusIn": StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities[0].Data.InventoryStatusIn,
                    "ExternalReference": StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ExternalReference,
                    "Location": StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities[0].Data.Location,
                    "PalletID": StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PalletID,
                    "ProductCode": StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ProductCode,
                    "WOL_AdjustmentArrivalDate": StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities[0].Data.WOL_AdjustmentArrivalDate,
                    "PartAttrib1": StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PartAttrib1,
                    "PartAttrib2": StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PartAttrib2,
                    "PartAttrib3": StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PartAttrib3,
                    "PackingDate": StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PackingDate,
                    "ExpiryDate": StocktransferEntryCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ExpiryDate,
                    "SortColumn": "WOL_WAR_WarehouseCode",
                    "SortType": "ASC",
                    "PageNumber": StocktransferEntryCtrl.ePage.Masters.PaginationForInventory.CurrentPage,
                    "PageSize": StocktransferEntryCtrl.ePage.Masters.PaginationForInventory.ItemsPerPage
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(FilterObj),
                    "FilterID": StocktransferEntryCtrl.ePage.Entities.Header.API.GetInventoryList.FilterID,
                };
                apiService.post("eAxisAPI", StocktransferEntryCtrl.ePage.Entities.Header.API.GetInventoryList.Url, _input).then(function (response) {
                    StocktransferEntryCtrl.ePage.Masters.Inventory = response.data.Response;
                    StocktransferEntryCtrl.ePage.Masters.InventoryCount = response.data.Count;
                   StocktransferEntryCtrl.ePage.Masters.InventoryLoading = false;
                });
            }else{
                toastr.warning("Please Enter Chosen Client And Warehouse in Filter");
            }
        }

        function AddToLine() {
            angular.forEach(StocktransferEntryCtrl.ePage.Masters.Inventory, function (value, key) {
                if (value.SingleSelectInventory) {
                    var obj = {
                        "PK": "",
                        "ProductCode": value.ProductCode,
                        "ProductDescription": value.ProductName,
                        "PRO_FK": value.PRO_FK,
                        "MCC_NKCommodityCode": value.MCC_NKCommodityCode,
                        "MCC_NKCommodityDesc": value.MCC_NKCommodityDesc,
                        "Packs": value.InLocationQty,
                        "PAC_PackType": value.StockKeepingUnit,
                        "Units": value.InLocationQty,
                        "StockKeepingUnit": value.StockKeepingUnit,
                        "ProductCondition": value.ProductCondition,
                        "WorkOrderLineStatus": "",
                        "WorkOrderLineStatusDesc": "",
                        "OriginalInventoryStatus": "",
                        "OriginalInventoryStatusDesc": "",
                        "PalletID": "",
                        "TransferFromPalletId": value.PalletID,
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
                        "UseExpiryDate": value.UseExpiryDate,
                        "UsePackingDate": value.UsePackingDate,
                        "UsePartAttrib1": value.UsePartAttrib1,
                        "UsePartAttrib2": value.UsePartAttrib2,
                        "UsePartAttrib3": value.UsePartAttrib3,
                        "IsPartAttrib1ReleaseCaptured": value.IsPartAttrib1ReleaseCaptured,
                        "IsPartAttrib2ReleaseCaptured": value.IsPartAttrib2ReleaseCaptured,
                        "IsPartAttrib3ReleaseCaptured": value.IsPartAttrib3ReleaseCaptured,

                        "ORG_ClientCode": value.ORG_ClientCode,
                        "ORG_ClientName": value.ORG_ClientName,
                        "Client_FK": value.Client_FK,

                        "WAR_WarehouseCode": value.WAR_WarehouseCode,
                        "WAR_WarehouseName": value.WAR_WarehouseName,
                        "WAR_FK": value.WAR_FK,
                    }
                    if (obj.MCC_NKCommodityCode == null) {
                        obj.MCC_NKCommodityCode = '';
                    }
                    if (obj.MCC_NKCommodityDesc == null) {
                        obj.MCC_NKCommodityDesc = '';
                    }
                    obj.Commodity = obj.MCC_NKCommodityCode + ' - ' + obj.MCC_NKCommodityDesc
                    StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.push(obj);
                }
                value.SingleSelectInventory = false;
            });
            StocktransferEntryCtrl.ePage.Masters.SelectAllInventory = false;
        }

        //#region checkbox selection
        function SelectAllCheckBoxInventory() {
            angular.forEach(StocktransferEntryCtrl.ePage.Masters.Inventory, function (value, key) {
                if (StocktransferEntryCtrl.ePage.Masters.SelectAllInventory) {
                    if(parseFloat(value.InLocationQty)>0)
                    value.SingleSelectInventory = true;
                }
                else {
                    value.SingleSelectInventory = false;
                }
            });
        }

        function SingleSelectCheckBoxInventory() {
            var Checked = StocktransferEntryCtrl.ePage.Masters.Inventory.some(function (value, key) {
                if (!value.SingleSelectInventory)
                    return true;
            });
            if (Checked) {
                StocktransferEntryCtrl.ePage.Masters.SelectAllInventory = false;
            } else {
                StocktransferEntryCtrl.ePage.Masters.SelectAllInventory = true;
            }
        }
        //#endregion checkbox selection
        //#endregion

        //#region validation
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

        function UDF(item, index) {
            if (!item.IsPartAttrib1ReleaseCaptured && StocktransferEntryCtrl.ePage.Masters.Config.EnableFinaliseValidation == true) {
                if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib1Type == "SER" && item.UsePartAttrib1 || StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib1Type == "MAN" && item.UsePartAttrib1 || StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib1Type == "BAT" && item.UsePartAttrib1) {
                    if (!item.PartAttrib1)
                        OnChangeValues(null, 'E11018', true, index);
                    else
                        OnChangeValues('value', 'E11018', true, index);
                }
            }
            if (!item.IsPartAttrib2ReleaseCaptured && StocktransferEntryCtrl.ePage.Masters.Config.EnableFinaliseValidation == true) {
                if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib2Type == "SER" && item.UsePartAttrib2 || StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib2Type == "MAN" && item.UsePartAttrib2 || StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib2Type == "BAT" && item.UsePartAttrib2) {
                    if (!item.PartAttrib2)
                        OnChangeValues(null, 'E11019', true, index);
                    else
                        OnChangeValues('value', 'E11019', true, index);
                }
            }
            if (!item.IsPartAttrib3ReleaseCaptured && StocktransferEntryCtrl.ePage.Masters.Config.EnableFinaliseValidation == true) {
                if (StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib3Type == "SER" && item.UsePartAttrib3 || StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib3Type == "MAN" && item.UsePartAttrib3 || StocktransferEntryCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib3Type == "BAT" && item.UsePartAttrib3) {
                    if (!item.PartAttrib3)
                        OnChangeValues(null, 'E11020', true, index);
                    else
                        OnChangeValues('value', 'E11020', true, index);
                }
            }
            if (item.UsePackingDate && StocktransferEntryCtrl.ePage.Masters.Config.EnableFinaliseValidation == true) {
                if (!item.PackingDate)
                    OnChangeValues(null, 'E11021', true, index);
                else
                    OnChangeValues('value', 'E11021', true, index);
            }
            if (item.UseExpiryDate && StocktransferEntryCtrl.ePage.Masters.Config.EnableFinaliseValidation == true) {
                if (!item.ExpiryDate)
                    OnChangeValues(null, 'E11022', true, index);
                else
                    OnChangeValues('value', 'E11022', true, index);
            }

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
                OnChangeValues('value', "E11027", true, i);
                OnChangeValues('value', "E11028", true, i);
                OnChangeValues('value', "E11029", true, i);
                OnChangeValues('value', 'E11031', true, i);
                OnChangeValues('value', 'E11036', true, i);
            }
            return true;
        }
        //#endregion

        Init();
    }
})();
