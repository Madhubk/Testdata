(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OwnershipTransferGeneralController", OwnershipTransferGeneralController);

    OwnershipTransferGeneralController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "ownershipTransferConfig", "appConfig", "toastr", "$document", "confirmation", "$filter"];

    function OwnershipTransferGeneralController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, ownershipTransferConfig, appConfig, toastr, $document, confirmation, $filter) {
        /* jshint validthis: true */
        var OwnershipTransferGeneralCtrl = this;

        function Init() {
            var currentOwnerTransfer = OwnershipTransferGeneralCtrl.currentOwnerTransfer[OwnershipTransferGeneralCtrl.currentOwnerTransfer.label].ePage.Entities;
            OwnershipTransferGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Ownership_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOwnerTransfer
            };

            OwnershipTransferGeneralCtrl.ePage.Masters.Config = ownershipTransferConfig;

            //For table
            OwnershipTransferGeneralCtrl.ePage.Masters.SelectAll = false;
            OwnershipTransferGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
            OwnershipTransferGeneralCtrl.ePage.Masters.EnableCopyButton = false;
            OwnershipTransferGeneralCtrl.ePage.Masters.Enable = true;
            OwnershipTransferGeneralCtrl.ePage.Masters.EnableInventory = true;
            OwnershipTransferGeneralCtrl.ePage.Masters.selectedRow = -1;
            OwnershipTransferGeneralCtrl.ePage.Masters.selectedRowInventory = -1;
            OwnershipTransferGeneralCtrl.ePage.Masters.emptyText = '-';
            OwnershipTransferGeneralCtrl.ePage.Masters.SearchTable = '';

            OwnershipTransferGeneralCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            OwnershipTransferGeneralCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            OwnershipTransferGeneralCtrl.ePage.Masters.SelectAllCheckBoxInventory = SelectAllCheckBoxInventory;
            OwnershipTransferGeneralCtrl.ePage.Masters.SingleSelectCheckBoxInventory = SingleSelectCheckBoxInventory;
            OwnershipTransferGeneralCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            OwnershipTransferGeneralCtrl.ePage.Masters.setSelectedRowInventory = setSelectedRowInventory;
            OwnershipTransferGeneralCtrl.ePage.Masters.AddNewRow = AddNewRow;
            OwnershipTransferGeneralCtrl.ePage.Masters.CopyRow = CopyRow;
            OwnershipTransferGeneralCtrl.ePage.Masters.RemoveRow = RemoveRow;

            OwnershipTransferGeneralCtrl.ePage.Masters.DropDownMasterList = {};
            OwnershipTransferGeneralCtrl.ePage.Masters.Inventory = [];

            OwnershipTransferGeneralCtrl.ePage.Masters.DatePicker = {};
            OwnershipTransferGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            OwnershipTransferGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            OwnershipTransferGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            //Pagination
            OwnershipTransferGeneralCtrl.ePage.Masters.Pagination = {};
            OwnershipTransferGeneralCtrl.ePage.Masters.Pagination.CurrentPage = 1;
            OwnershipTransferGeneralCtrl.ePage.Masters.Pagination.MaxSize = 3;
            OwnershipTransferGeneralCtrl.ePage.Masters.Pagination.ItemsPerPage = 25;

            OwnershipTransferGeneralCtrl.ePage.Masters.SelectedLookupClient = SelectedLookupClient;
            OwnershipTransferGeneralCtrl.ePage.Masters.SelectedLookupWarehouse = SelectedLookupWarehouse;
            OwnershipTransferGeneralCtrl.ePage.Masters.SelectedLookupLocation = SelectedLookupLocation;
            OwnershipTransferGeneralCtrl.ePage.Masters.SelectedLookupProduct = SelectedLookupProduct;
            OwnershipTransferGeneralCtrl.ePage.Masters.SelectedLookupTransferFromClient = SelectedLookupTransferFromClient;

            OwnershipTransferGeneralCtrl.ePage.Masters.FetchQuantity = FetchQuantity;
            OwnershipTransferGeneralCtrl.ePage.Masters.AddToLine = AddToLine;
            OwnershipTransferGeneralCtrl.ePage.Masters.CheckFutureDate = CheckFutureDate;
            OwnershipTransferGeneralCtrl.ePage.Masters.UDF = UDF;
            OwnershipTransferGeneralCtrl.ePage.Masters.GetFilterList = GetFilterList;
            OwnershipTransferGeneralCtrl.ePage.Masters.CloseFilterList = CloseFilterList;
            OwnershipTransferGeneralCtrl.ePage.Masters.Filter = Filter;
            OwnershipTransferGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            GetUserBasedGridColumList();
            GetUserBasedGridColumListForInventory();
            GetDropDownList();
            GetLineList();
            GeneralOperation();
            DefaultFilter();
            GetUDFDetails();
            InitDocuments();
            GetNewAddress();
        }


        //#region User Based Table Column
        function GetUserBasedGridColumList() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_OWNERTRANSFERLINE",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response[0]) {
                    OwnershipTransferGeneralCtrl.ePage.Masters.UserValue = response.data.Response[0];
                    if (response.data.Response[0].Value != '') {
                        var obj = JSON.parse(response.data.Response[0].Value)
                        OwnershipTransferGeneralCtrl.ePage.Entities.Header.TableProperties.UIWmsStockTransferLine = obj;
                        OwnershipTransferGeneralCtrl.ePage.Masters.UserHasValue = true;
                    }
                } else {
                    OwnershipTransferGeneralCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }

        function GetUserBasedGridColumListForInventory() {
            var _filter1 = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_OWNERTRANSFERINVENTORY",
            };
            var _input1 = {
                "searchInput": helperService.createToArrayOfObject(_filter1),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input1).then(function (response) {
                if (response.data.Response[0]) {
                    OwnershipTransferGeneralCtrl.ePage.Masters.UserValueForInventory = response.data.Response[0];
                    if (response.data.Response[0].Value != '') {
                        var obj = JSON.parse(response.data.Response[0].Value)
                        OwnershipTransferGeneralCtrl.ePage.Entities.Header.TableProperties.Inventory = obj;
                        OwnershipTransferGeneralCtrl.ePage.Masters.UserHasValueForInventory = true;
                    }
                } else {
                    OwnershipTransferGeneralCtrl.ePage.Masters.UserValueForInventory = undefined;
                }
            })
        }
        //#endregion   

        //#region Header Details
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            OwnershipTransferGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetDropDownList() {
            var typeCodeList = ["StockTransferStatus","StockTransferType", "INW_LINE_UQ", "WMSYESNO", "ProductCondition"];
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
                        OwnershipTransferGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        OwnershipTransferGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function GeneralOperation() {
            // warehouse
            if (OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseCode == null) {
                OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseCode = "";
            }
            if (OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseName == null) {
                OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseName = "";
            }
            OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Warehouse = OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseCode + ' - ' + OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseName;
            if (OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Warehouse == ' - ')
                OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Warehouse = "";

            // Client
            if (OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode == null) {
                OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode = "";
            }
            if (OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientName == null) {
                OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientName = "";
            }
            OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client = OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode + ' - ' + OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientName;
            if (OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client == ' - ')
                OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client = "";
            
                //Transfer from Client
            if (OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.TransferFrom_ORG_Code == null) {
                OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.TransferFrom_ORG_Code = "";
            }
            if (OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.TransferFrom_ORG_FullName == null) {
                OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.TransferFrom_ORG_FullName = "";
            }
            OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.TransferFrom_Client = OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.TransferFrom_ORG_Code + ' - ' + OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.TransferFrom_ORG_FullName;
            if (OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.TransferFrom_Client == ' - ')
                OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.TransferFrom_Client = "";

            if(OwnershipTransferGeneralCtrl.currentOwnerTransfer.isNew)
            OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderSubType = 'OWN';
        }

        function GetNewAddress() {
            var myvalue = OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.some(function (value, key) {
                return value.AddressType == 'SND';
            });

            if (!myvalue) {
                var obj = {
                    "EntityRefKey": OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.PK,
                    "EntitySource": "OWN",
                    "AddressType": "SND",
                    "ORG_FK": "",
                    "OAD_Address_FK": "",
                    "Address1": "",
                    "Address2": "",
                    "City": "",
                    "State": "",
                    "JDA_RN_NKCountryCode": "",
                    "Postcode": "",
                    "Email": "",
                    "Mobile": "",
                    "Phone": "",
                    "Fax": "",
                };
                OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.push(obj);
            }
        }

        function SelectedLookupTransferFromClient(item) {
            OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.TransferFrom_Client = item.Code + "-" + item.FullName;
            OnChangeValues(OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.TransferFrom_Client, 'E11032');

            if(OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.TransferFrom_ORG_FK && OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ORG_Client_FK)
            if(OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.TransferFrom_ORG_FK == OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ORG_Client_FK){
                OnChangeValues(null, 'E11033');
            }else{
                OnChangeValues('value', 'E11033');
            }

            angular.forEach(OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress, function (value, key) {
                if (value.AddressType == "SND") {
                    value.ORG_FK = item.PK;
                    value.OAD_Address_FK = item.OAD_PK;
                    value.Address1 = item.OAD_Address1;
                    value.Address2 = item.OAD_Address2;
                    value.State = item.OAD_State;
                    value.PostCode = item.OAD_PostCode;
                    value.City = item.OAD_City;
                    value.Email = item.OAD_Email;
                    value.Mobile = item.OAD_Mobile;
                    value.Phone = item.OAD_Phone;
                    value.RN_NKCountryCode = item.OAD_CountryCode;
                    value.Fax = item.OAD_Fax;
                }
            });

            DefaultFilter();
        }

        function SelectedLookupClient(item) {
            OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client = item.Code + '-' + item.FullName;
            OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIOrgHeader = item;
            OnChangeValues(OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client, 'E11011');

            if(OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.TransferFrom_ORG_FK && OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ORG_Client_FK)
            if(OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.TransferFrom_ORG_FK == OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ORG_Client_FK){
                OnChangeValues(null, 'E11033');
            }else{
                OnChangeValues('value', 'E11033');
            }

            GetUDFDetails();
        }

        function SelectedLookupWarehouse(item) {
            OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Warehouse = item.WarehouseCode + ' - ' + item.WarehouseName;
            DefaultFilter();
            OnChangeValues(OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Warehouse, 'E11012');
        }

        function GetUDFDetails() {
            if (OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client) {
                var _filter = {
                    "ORG_FK": OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ORG_Client_FK
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.OrgMiscServ.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", appConfig.Entities.OrgMiscServ.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib1Name = response.data.Response[0].IMPartAttrib1Name;
                        OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib2Name = response.data.Response[0].IMPartAttrib2Name;
                        OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib3Name = response.data.Response[0].IMPartAttrib3Name;
                        OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib1Type = response.data.Response[0].IMPartAttrib1Type;
                        OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib2Type = response.data.Response[0].IMPartAttrib2Type;
                        OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib3Type = response.data.Response[0].IMPartAttrib3Type;
                    }
                });
            }
        }
        //#endregion

        //#region Line Details

        //#region general

        function GetLineList() {
            var myData = true;
            OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine = OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine;
            angular.forEach(OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine, function (value, key) {
                // Product


                if (value.MCC_NKCommodityCode == null)
                    value.MCC_NKCommodityCode = '';

                if (value.MCC_NKCommodityDesc == null)
                    value.MCC_NKCommodityDesc = '';

                value.Commodity = value.MCC_NKCommodityCode + ' - ' + value.MCC_NKCommodityDesc;


                if (value.Commodity == ' - ')
                    value.Commodity = '';

                value.ORG_ClientCode = OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode;
                value.ORG_ClientName = OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientName;
                value.Client_FK = OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ORG_Client_FK;

                value.WAR_WarehouseCode = OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseCode;
                value.WAR_WarehouseName = OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseName;
                value.WAR_FK = OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WAR_FK;

                if (OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client) {
                    value.Client = OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode;
                    value.ClientRelationship = "OWN";
                }

                if (!value.PRO_FK && value.ProductCode) {
                    myData = false;
                }
            });

            //Order By
            OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine = $filter('orderBy')(OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine, 'CreatedDateTime');


            if (myData == false) {
                OwnershipTransferGeneralCtrl.ePage.Masters.Config.GeneralValidation(OwnershipTransferGeneralCtrl.currentOwnerTransfer);
            }
        }

        //#endregion

        //#region  Bulk Upload
        function InitDocuments() {
            OwnershipTransferGeneralCtrl.ePage.Masters.Documents = {};
            OwnershipTransferGeneralCtrl.ePage.Masters.Documents.Autherization = authService.getUserInfo().AuthToken;
            OwnershipTransferGeneralCtrl.ePage.Masters.Documents.fileDetails = [];
            OwnershipTransferGeneralCtrl.ePage.Masters.Documents.fileSize = 10;
            OwnershipTransferGeneralCtrl.ePage.Entities.Entity = 'Own_TransferLines';
            OwnershipTransferGeneralCtrl.ePage.Entities.EntityRefCode = OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderID;

            var _additionalValue = {
                "Entity": OwnershipTransferGeneralCtrl.ePage.Entities.Entity,
                "Path": OwnershipTransferGeneralCtrl.ePage.Entities.Entity + "," + OwnershipTransferGeneralCtrl.ePage.Entities.EntityRefCode
            };

            OwnershipTransferGeneralCtrl.ePage.Masters.Documents.AdditionalValue = JSON.stringify(_additionalValue);
            OwnershipTransferGeneralCtrl.ePage.Masters.Documents.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.UploadExcel.Url;

            OwnershipTransferGeneralCtrl.ePage.Masters.Documents.GetUploadedFiles = GetUploadedFiles;
            OwnershipTransferGeneralCtrl.ePage.Masters.Documents.GetSelectedFiles = GetSelectedFiles;
            OwnershipTransferGeneralCtrl.ePage.Masters.Documents.DownloadReport = DownloadReport;
        }

        function GetUploadedFiles(Files, docType, mode) {
            if (Files) {
                BulkUpload(Files);
            }
        }

        function GetSelectedFiles(Files, docType, mode, row) {
            OwnershipTransferGeneralCtrl.ePage.Masters.Loading = true;
        }

        function DownloadReport() {
            OwnershipTransferGeneralCtrl.ePage.Masters.Loading = true;
            apiService.get("eAxisAPI", appConfig.Entities.DMS.API.DownloadTemplate.Url + "/ReceiveLineBulkUpload").then(function (response) {
                OwnershipTransferGeneralCtrl.ePage.Masters.Loading = false;
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
                OwnershipTransferGeneralCtrl.ePage.Masters.Loading = false;
                toastr.warning('Upload Excel With Product Details');
            } else {
                var obj = {
                    "LineType": "UIWmsWorkOrderLine",
                    "WmsWorkOrder": {
                        "WorkOrderID": OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderID,
                        "WarehouseCode": OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseCode,
                        "ClientCode": OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode
                    },
                    "WmsInsertLineRecordsList": ''
                }
                obj.WmsInsertLineRecordsList = item;

                apiService.post("eAxisAPI", OwnershipTransferGeneralCtrl.ePage.Entities.Header.API.InsertLine.Url, obj).then(function (response) {
                    OwnershipTransferGeneralCtrl.ePage.Masters.Loading = false;
                    if (response.data.Response) {
                        angular.forEach(response.data.Response, function (value, key) {
                            value.PK = '';
                            value.AdjustmentArrivalDate = new Date();

                            value.PK = '';
                            if (!value.Packs) {
                                value.Packs = 1;
                                value.Units = 1;
                            }
                            if (!value.PAC_PackType) {
                                value.PAC_PackType = value.StockKeepingUnit;
                            }
                            if (!value.ProductCondition) {
                                value.ProductCondition = "GDC"
                            }
                            if (value.IsPartAttrib1ReleaseCaptured || !value.UsePartAttrib1) {
                                value.PartAttrib1 = '';
                            }
                            if (value.IsPartAttrib2ReleaseCaptured || !value.UsePartAttrib2) {
                                value.PartAttrib2 = '';
                            }
                            if (value.IsPartAttrib3ReleaseCaptured || !value.UsePartAttrib3) {
                                value.PartAttrib3 = '';
                            }
                            if (!value.UsePackingDate) {
                                value.PackingDate = '';
                            }
                            if (!value.UseExpiryDate) {
                                value.ExpiryDate = '';
                            }

                            OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.push(value);
                        });
                        GetLineList();
                    } else {
                        toastr.error("Upload Failed");
                    }
                });
            }
        }
        //#endregion

        //#region checkbox selection
        function SelectAllCheckBox() {
            angular.forEach(OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine, function (value, key) {
                if (OwnershipTransferGeneralCtrl.ePage.Masters.SelectAll) {
                    value.SingleSelect = true;
                    OwnershipTransferGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
                    OwnershipTransferGeneralCtrl.ePage.Masters.EnableCopyButton = true;
                }
                else {
                    value.SingleSelect = false;
                    OwnershipTransferGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
                    OwnershipTransferGeneralCtrl.ePage.Masters.EnableCopyButton = false;
                }
            });
        }

        function SingleSelectCheckBox() {
            var Checked = OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.some(function (value, key) {
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                OwnershipTransferGeneralCtrl.ePage.Masters.SelectAll = false;
            } else {
                OwnershipTransferGeneralCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                OwnershipTransferGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
                OwnershipTransferGeneralCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                OwnershipTransferGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
                OwnershipTransferGeneralCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }
        //#endregion checkbox selection

        //#region Add,copy,delete row

        function setSelectedRow(index) {
            OwnershipTransferGeneralCtrl.ePage.Masters.selectedRow = index;
        }

        function setSelectedRowInventory(index) {
            OwnershipTransferGeneralCtrl.ePage.Masters.selectedRowInventory = index;
        }

        function AddNewRow() {
            if (!OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client || !OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.TransferFrom_Client || !OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Warehouse) {
                OwnershipTransferGeneralCtrl.ePage.Masters.Config.GeneralValidation(OwnershipTransferGeneralCtrl.currentOwnerTransfer);
                OwnershipTransferGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(OwnershipTransferGeneralCtrl.currentOwnerTransfer);
            } else {
                OwnershipTransferGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                var obj = {
                    "PK": "",
                    "ProductCode": "",
                    "ProductDescription": "",
                    "PRO_FK": "",
                    "Commodity": "",
                    "MCC_NKCommodityCode": "",
                    "MCC_NKCommodityDesc": "",
                    "ProductCondition": "GDC",
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
                    "WLO_Location": "",
                    "WLO_FK": "",
                    "WLO_LocationStatus": "",
                    "WLO_LocationStatusDescription": "",
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

                    "ORG_ClientCode": OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode,
                    "ORG_ClientName": OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientName,
                    "Client_FK": OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ORG_Client_FK,

                    "WAR_WarehouseCode": OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseCode,
                    "WAR_WarehouseName": OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseName,
                    "WAR_FK": OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WAR_FK,
                };
                if (OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client) {
                    obj.Client = OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode
                    obj.ClientRelationship = "OWN";
                }
                OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.push(obj);
                OwnershipTransferGeneralCtrl.ePage.Masters.selectedRow = OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.length - 1;

                $timeout(function () {
                    var objDiv = document.getElementById("OwnershipTransferGeneralCtrl.ePage.Masters.AddScroll");
                    objDiv.scrollTop = objDiv.scrollHeight;
                }, 50);
                OwnershipTransferGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
            }
        };

        function CopyRow() {
            OwnershipTransferGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            for (var i = OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.length - 1; i >= 0; i--) {
                if (OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[i].SingleSelect) {
                    var item = angular.copy(OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[i]);
                    var obj = {
                        "PK": "",
                        "ProductCode": item.ProductCode,
                        "ProductDescription": item.ProductDescription,
                        "PRO_FK": item.PRO_FK,
                        "Commodity": item.Commodity,
                        "MCC_NKCommodityCode": item.MCC_NKCommodityCode,
                        "MCC_NKCommodityDesc": item.MCC_NKCommodityDesc,
                        "ProductCondition": item.ProductCondition,
                        "Packs": item.Packs,
                        "PAC_PackType": item.PAC_PackType,
                        "Units": item.Units,
                        "StockKeepingUnit": item.StockKeepingUnit,

                        "PalletID": item.PalletID,
                        "WLO_Location": item.WLO_Location,
                        "WLO_FK": item.WLO_FK,
                        "WLO_LocationStatus": item.WLO_LocationStatus,
                        "WLO_LocationStatusDescription": item.WLO_LocationStatusDescription,

                        "AdjustmentArrivalDate": item.AdjustmentArrivalDate,
                        "LineComment": item.LineComment,
                        "IsDeleted": false,
                        "IsCopied": true,

                        "ORG_ClientCode": OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode,
                        "ORG_ClientName": OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientName,
                        "Client_FK": OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ORG_Client_FK,

                        "WAR_WarehouseCode": OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseCode,
                        "WAR_WarehouseName": OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseName,
                        "WAR_FK": OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WAR_FK,

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
                    if (OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.Client) {
                        obj.Client = OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ClientCode
                        obj.ClientRelationship = "OWN";
                    }
                    OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.splice(i + 1, 0, obj);
                }
            }
            OwnershipTransferGeneralCtrl.ePage.Masters.selectedRow = -1;
            OwnershipTransferGeneralCtrl.ePage.Masters.SelectAll = false;
            OwnershipTransferGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
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
                    OwnershipTransferGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

                    angular.forEach(OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine, function (value, key) {
                        if (value.SingleSelect == true && value.PK) {
                            apiService.get("eAxisAPI", OwnershipTransferGeneralCtrl.ePage.Entities.Header.API.LineDelete.Url + value.PK).then(function (response) {
                            });
                        }
                    });

                    var ReturnValue = RemoveAllLineErrors();
                    if (ReturnValue) {
                        for (var i = OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.length - 1; i >= 0; i--) {
                            if (OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[i].SingleSelect == true)
                                OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.splice(i, 1);
                        }
                        OwnershipTransferGeneralCtrl.ePage.Masters.Config.GeneralValidation(OwnershipTransferGeneralCtrl.currentOwnerTransfer);
                    }
                    toastr.success('Record Removed Successfully');
                    OwnershipTransferGeneralCtrl.ePage.Masters.selectedRow = -1;
                    OwnershipTransferGeneralCtrl.ePage.Masters.SelectAll = false;
                    OwnershipTransferGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    OwnershipTransferGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
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
                    OwnershipTransferGeneralCtrl.ePage.Masters.Loading = true;
                    apiService.post("eAxisAPI", appConfig.Entities.PrdProductUnit.API.FetchQuantity.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            item.Units = response.data.Response;
                            OwnershipTransferGeneralCtrl.ePage.Masters.Loading = false;
                            OnChangeValues(item.Units, "E11006", true, index);
                        }
                    });
                }
            }
            if ((OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib1Type == "SER" && item.UsePartAttrib1 && !item.IsPartAttrib1ReleaseCaptured) || (OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib2Type == "SER" && item.UsePartAttrib2 && !item.IsPartAttrib2ReleaseCaptured) || (OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib3Type == "SER" && item.UsePartAttrib3 && !item.IsPartAttrib3ReleaseCaptured)) {
                if (parseFloat(item.Units) != 1) {
                    OnChangeValues(null, "E11017", true, OwnershipTransferGeneralCtrl.ePage.Masters.selectedRow);
                } else if (parseFloat(item.Units) == 1) {
                    OnChangeValues('value', "E11017", true, OwnershipTransferGeneralCtrl.ePage.Masters.selectedRow);
                }
            }
        }

        //#endregion

        //#region  Selectedlookups

        function SelectedLookupLocation(item, index) {
            OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].WLO_Location = item.Location;
            OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].WLO_LocationStatus = item.LocationStatus;
            OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].WLO_LocationStatusDescription = item.LocationStatusDescription;
            OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].WLO_FK = item.PK;

            OnChangeValues(OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].WLO_Location, "E11009", true, index);

            OnChangeValues('value', 'E11028', true, index);
        }

        function SelectedLookupProduct(item, index) {
            OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].PRO_FK = item.OSP_FK;

            if (item.MCC_NKCommodityCode == null)
                item.MCC_NKCommodityCode = '';

            if (item.MCC_NKCommodityDesc == null)
                item.MCC_NKCommodityDesc = '';

            OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].Commodity = item.MCC_NKCommodityCode + ' - ' + item.MCC_NKCommodityDesc;

            //To remove Attributes when copy row
            OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].PartAttrib1 = '';
            OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].PartAttrib2 = '';
            OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].PartAttrib3 = '';
            OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].PackingDate = '';
            OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].ExpiryDate = '';
            OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].Units = OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine[index].Packs;

            OnChangeValues(item.ProductCode, 'E11004', true, index);
            OnChangeValues(item.StockKeepingUnit, 'E11007', true, index);
            OnChangeValues('value', 'E11027', true, index);
        }
        //#endregion

        //#endregion

        //#region Inventory Line Details

        function CloseFilterList() {
            $('#filterSideBar' + "OwnershipWarehouseInventory" + OwnershipTransferGeneralCtrl.currentOwnerTransfer.label).removeClass('open');
        }

        function GetFilterList() {
            $timeout(function () {
                $('#filterSideBar' + "OwnershipWarehouseInventory" + OwnershipTransferGeneralCtrl.currentOwnerTransfer.label).toggleClass('open');
            });
        }

        function DefaultFilter() {
            if (OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.TransferFrom_ORG_Code && OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseCode) {
                OwnershipTransferGeneralCtrl.ePage.Masters.defaultFilter = {
                    "TransferFrom_ORG_Code": OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.TransferFrom_ORG_Code,
                    "WAR_WarehouseCode": OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseCode,
                    "InventoryStatusIn": "AVL,HEL"
                };
                OwnershipTransferGeneralCtrl.ePage.Masters.DynamicControl = undefined;
                GetConfigDetails();
            }
        }

        function GetConfigDetails() {
            // Get Dynamic filter controls
            var _filter = {
                DataEntryName: "OwnershipWarehouseInventory"
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
                    OwnershipTransferGeneralCtrl.ePage.Masters.DynamicControl = response.data.Response;


                    if (OwnershipTransferGeneralCtrl.ePage.Masters.defaultFilter !== undefined) {
                        OwnershipTransferGeneralCtrl.ePage.Masters.DynamicControl.Entities.map(function (value, key) {
                            value.Data = OwnershipTransferGeneralCtrl.ePage.Masters.defaultFilter;

                            value.CSS = {};
                            value.ConfigData.map(function (value2, key2) {
                                if (value2.PropertyName == 'TransferFrom_ORG_Code' || value2.PropertyName == 'WAR_WarehouseCode' || value2.PropertyName == 'OriginalInventoryStatus') {
                                    value.CSS["Is" + value2.PropertyName + "Visible"] = true;
                                    value.CSS["Is" + value2.PropertyName + "Disable"] = true;
                                } else {
                                    value.CSS["Is" + value2.PropertyName + "Visible"] = false;
                                    value.CSS["Is" + value2.PropertyName + "Disable"] = false;
                                }
                            });
                        });
                    }
                    OwnershipTransferGeneralCtrl.ePage.Masters.ViewType = 1;
                    Filter();
                }
            });
        }

        function Filter() {

            // if searching input and original client and warehouse same then only process

            if ((OwnershipTransferGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.TransferFrom_ORG_Code == OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.TransferFrom_ORG_Code) && (OwnershipTransferGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.WAR_WarehouseCode == OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WarehouseCode)) {

                OwnershipTransferGeneralCtrl.ePage.Masters.Inventory = [];
                OwnershipTransferGeneralCtrl.ePage.Masters.InventoryLoading = true;

                $(".filter-sidebar-wrapper").toggleClass("open");

                var FilterObj = {
                    "ClientCode": OwnershipTransferGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.TransferFrom_ORG_Code,
                    "WAR_WarehouseCode": OwnershipTransferGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.WAR_WarehouseCode,
                    "AreaName": OwnershipTransferGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.AreaName,
                    "InventoryStatusIn": OwnershipTransferGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.InventoryStatusIn,
                    "ExternalReference": OwnershipTransferGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ExternalReference,
                    "Location": OwnershipTransferGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.Location,
                    "PalletID": OwnershipTransferGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PalletID,
                    "ProductCode": OwnershipTransferGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ProductCode,
                    "WOL_AdjustmentArrivalDate": OwnershipTransferGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.WOL_AdjustmentArrivalDate,
                    "PartAttrib1": OwnershipTransferGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PartAttrib1,
                    "PartAttrib2": OwnershipTransferGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PartAttrib2,
                    "PartAttrib3": OwnershipTransferGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PartAttrib3,
                    "PackingDate": OwnershipTransferGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PackingDate,
                    "ExpiryDate": OwnershipTransferGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ExpiryDate,
                    "SortColumn": "WOL_WAR_WarehouseCode",
                    "SortType": "ASC",
                    "PageNumber": OwnershipTransferGeneralCtrl.ePage.Masters.Pagination.CurrentPage,
                    "PageSize": OwnershipTransferGeneralCtrl.ePage.Masters.Pagination.ItemsPerPage
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(FilterObj),
                    "FilterID": OwnershipTransferGeneralCtrl.ePage.Entities.Header.API.GetInventoryList.FilterID,
                };
                apiService.post("eAxisAPI", OwnershipTransferGeneralCtrl.ePage.Entities.Header.API.GetInventoryList.Url, _input).then(function (response) {
                    OwnershipTransferGeneralCtrl.ePage.Masters.Inventory = response.data.Response;
                    OwnershipTransferGeneralCtrl.ePage.Masters.InventoryCount = response.data.Count;
                    OwnershipTransferGeneralCtrl.ePage.Masters.InventoryLoading = false;
                });
            } else {
                toastr.warning("Please Enter Chosen Client And Warehouse in Filter");
            }
        }

        function AddToLine() {
            angular.forEach(OwnershipTransferGeneralCtrl.ePage.Masters.Inventory, function (value, key) {
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
                        "PalletID": "value.PalletID,",
                        "WLO_Location": value.Location,
                        "WLO_FK": value.WLO_FK,
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

                        "ORG_ClientCode": value.ClientCode,
                        "ORG_ClientName": value.ClientName,
                        "Client_FK": value.ORG_FK,

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
                    OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.push(obj);
                }
                value.SingleSelectInventory = false;
            });
            OwnershipTransferGeneralCtrl.ePage.Masters.SelectAllInventory = false;
        }

        //#region checkbox selection
        function SelectAllCheckBoxInventory() {
            angular.forEach(OwnershipTransferGeneralCtrl.ePage.Masters.Inventory, function (value, key) {
                if (OwnershipTransferGeneralCtrl.ePage.Masters.SelectAllInventory) {
                    if (parseFloat(value.InLocationQty) > 0)
                        value.SingleSelectInventory = true;
                }
                else {
                    value.SingleSelectInventory = false;
                }
            });
        }

        function SingleSelectCheckBoxInventory() {
            var Checked = OwnershipTransferGeneralCtrl.ePage.Masters.Inventory.some(function (value, key) {
                if (!value.SingleSelectInventory)
                    return true;
            });
            if (Checked) {
                OwnershipTransferGeneralCtrl.ePage.Masters.SelectAllInventory = false;
            } else {
                OwnershipTransferGeneralCtrl.ePage.Masters.SelectAllInventory = true;
            }
        }
        //#endregion checkbox selection
        //#endregion

        //#region validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(OwnershipTransferGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (IsArray) {
                if (!fieldvalue) {
                    OwnershipTransferGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, OwnershipTransferGeneralCtrl.currentOwnerTransfer.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
                } else {
                    OwnershipTransferGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, OwnershipTransferGeneralCtrl.currentOwnerTransfer.label, IsArray, RowIndex, value.ColIndex);
                }
            } else {
                if (!fieldvalue) {
                    OwnershipTransferGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, OwnershipTransferGeneralCtrl.currentOwnerTransfer.label, false, undefined, undefined, undefined, undefined, undefined);
                } else {
                    OwnershipTransferGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, OwnershipTransferGeneralCtrl.currentOwnerTransfer.label);
                }
            }
        }

        function UDF(item, index) {
            if (!item.IsPartAttrib1ReleaseCaptured && OwnershipTransferGeneralCtrl.ePage.Masters.Config.EnableFinaliseValidation == true) {
                if (OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib1Type == "SER" && item.UsePartAttrib1 || OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib1Type == "MAN" && item.UsePartAttrib1 || OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib1Type == "BAT" && item.UsePartAttrib1) {
                    if (!item.PartAttrib1)
                        OnChangeValues(null, 'E11018', true, index);
                    else
                        OnChangeValues('value', 'E11018', true, index);
                }
            }
            if (!item.IsPartAttrib2ReleaseCaptured && OwnershipTransferGeneralCtrl.ePage.Masters.Config.EnableFinaliseValidation == true) {
                if (OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib2Type == "SER" && item.UsePartAttrib2 || OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib2Type == "MAN" && item.UsePartAttrib2 || OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib2Type == "BAT" && item.UsePartAttrib2) {
                    if (!item.PartAttrib2)
                        OnChangeValues(null, 'E11019', true, index);
                    else
                        OnChangeValues('value', 'E11019', true, index);
                }
            }
            if (!item.IsPartAttrib3ReleaseCaptured && OwnershipTransferGeneralCtrl.ePage.Masters.Config.EnableFinaliseValidation == true) {
                if (OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib3Type == "SER" && item.UsePartAttrib3 || OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib3Type == "MAN" && item.UsePartAttrib3 || OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib3Type == "BAT" && item.UsePartAttrib3) {
                    if (!item.PartAttrib3)
                        OnChangeValues(null, 'E11020', true, index);
                    else
                        OnChangeValues('value', 'E11020', true, index);
                }
            }
            if (item.UsePackingDate && OwnershipTransferGeneralCtrl.ePage.Masters.Config.EnableFinaliseValidation == true) {
                if (!item.PackingDate)
                    OnChangeValues(null, 'E11021', true, index);
                else
                    OnChangeValues('value', 'E11021', true, index);
            }
            if (item.UseExpiryDate && OwnershipTransferGeneralCtrl.ePage.Masters.Config.EnableFinaliseValidation == true) {
                if (!item.ExpiryDate)
                    OnChangeValues(null, 'E11022', true, index);
                else
                    OnChangeValues('value', 'E11022', true, index);
            }

        }

        function RemoveAllLineErrors() {
            for (var i = 0; i < OwnershipTransferGeneralCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.length; i++) {
                OnChangeValues('value', "E11004", true, i);
                OnChangeValues('value', "E11005", true, i);
                OnChangeValues('value', "E11006", true, i);
                OnChangeValues('value', "E11007", true, i);
                OnChangeValues('value', "E11008", true, i);
                OnChangeValues('value', "E11009", true, i);
                OnChangeValues('value', "E11010", true, i);
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
            }
            return true;
        }
        //#endregion

        Init();
    }
})();
