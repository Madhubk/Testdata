(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AdjustmentGeneralController", AdjustmentGeneralController);

    AdjustmentGeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "adjustmentConfig", "helperService", "toastr", "$filter", "$document", "confirmation","dynamicLookupConfig"];

    function AdjustmentGeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, adjustmentConfig, helperService, toastr, $filter, $document, confirmation,dynamicLookupConfig) {

        var AdjustmentGeneralCtrl = this;

        function Init() {
 
            var currentAdjustment = AdjustmentGeneralCtrl.currentAdjustment[AdjustmentGeneralCtrl.currentAdjustment.label].ePage.Entities;

            AdjustmentGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Adjustment_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentAdjustment,
            };  

            AdjustmentGeneralCtrl.ePage.Masters.DataentryName = "WarehouseInventory";
            AdjustmentGeneralCtrl.ePage.Masters.TaskName = "InventorySummary";

            AdjustmentGeneralCtrl.ePage.Masters.Config = adjustmentConfig;

            //For table
            AdjustmentGeneralCtrl.ePage.Masters.SelectAll = false;
            AdjustmentGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
            AdjustmentGeneralCtrl.ePage.Masters.EnableCopyButton = false;
            AdjustmentGeneralCtrl.ePage.Masters.Enable = true;
            AdjustmentGeneralCtrl.ePage.Masters.EnableInventory = true;
            AdjustmentGeneralCtrl.ePage.Masters.selectedRow = -1;
            AdjustmentGeneralCtrl.ePage.Masters.selectedRowInventory = -1;
            AdjustmentGeneralCtrl.ePage.Masters.emptyText = '-';
            AdjustmentGeneralCtrl.ePage.Masters.SearchTable = '';

            AdjustmentGeneralCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            AdjustmentGeneralCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            AdjustmentGeneralCtrl.ePage.Masters.SelectAllCheckBoxInventory = SelectAllCheckBoxInventory;
            AdjustmentGeneralCtrl.ePage.Masters.SingleSelectCheckBoxInventory = SingleSelectCheckBoxInventory;
            AdjustmentGeneralCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            AdjustmentGeneralCtrl.ePage.Masters.setSelectedRowInventory = setSelectedRowInventory;
            AdjustmentGeneralCtrl.ePage.Masters.AddNewRow = AddNewRow;
            AdjustmentGeneralCtrl.ePage.Masters.CopyRow = CopyRow;
            AdjustmentGeneralCtrl.ePage.Masters.RemoveRow = RemoveRow;

            AdjustmentGeneralCtrl.ePage.Masters.DropDownMasterList = {};

            AdjustmentGeneralCtrl.ePage.Masters.DatePicker = {};
            AdjustmentGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            AdjustmentGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            AdjustmentGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            AdjustmentGeneralCtrl.ePage.Masters.OrgPartRelationCount = 0;

            AdjustmentGeneralCtrl.ePage.Masters.SelectedLookupClient = SelectedLookupClient;
            AdjustmentGeneralCtrl.ePage.Masters.SelectedLookupWarehouse = SelectedLookupWarehouse;
            AdjustmentGeneralCtrl.ePage.Masters.SelectedLookupProduct = SelectedLookupProduct;
            AdjustmentGeneralCtrl.ePage.Masters.SelectedLookupLocation = SelectedLookupLocation;
            AdjustmentGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            AdjustmentGeneralCtrl.ePage.Masters.FetchQuantity = FetchQuantity;
            AdjustmentGeneralCtrl.ePage.Masters.CheckFutureDate = CheckFutureDate;
            AdjustmentGeneralCtrl.ePage.Masters.UDF = UDF;

            AdjustmentGeneralCtrl.ePage.Masters.GetFilterList = GetFilterList;
            AdjustmentGeneralCtrl.ePage.Masters.CloseFilterList = CloseFilterList;
            AdjustmentGeneralCtrl.ePage.Masters.Filter = Filter;

            AdjustmentGeneralCtrl.ePage.Masters.AddToLine = AddToLine;
            AdjustmentGeneralCtrl.ePage.Masters.Inventory = [];

            //PaginationForInventory
            AdjustmentGeneralCtrl.ePage.Masters.PaginationForInventory = {};
            AdjustmentGeneralCtrl.ePage.Masters.PaginationForInventory.CurrentPage = 1;
            AdjustmentGeneralCtrl.ePage.Masters.PaginationForInventory.MaxSize = 3;
            AdjustmentGeneralCtrl.ePage.Masters.PaginationForInventory.ItemsPerPage = 25;

            //PaginationForAdjustmentLine
            AdjustmentGeneralCtrl.ePage.Masters.PaginationForAdjLine = {};
            AdjustmentGeneralCtrl.ePage.Masters.PaginationForAdjLine.CurrentPage = 1;
            AdjustmentGeneralCtrl.ePage.Masters.PaginationForAdjLine.MaxSize = 3;
            AdjustmentGeneralCtrl.ePage.Masters.PaginationForAdjLine.ItemsPerPage = 25;
            AdjustmentGeneralCtrl.ePage.Masters.PaginationChangeForAdjLine = PaginationChangeForAdjLine;
            AdjustmentGeneralCtrl.ePage.Masters.LocalSearchLengthCalculation = LocalSearchLengthCalculation;
            AdjustmentGeneralCtrl.ePage.Masters.PaginationForAdjLine.LocalSearchLength = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length;

            AdjustmentGeneralCtrl.ePage.Masters.CurrentPageStartingIndex = (AdjustmentGeneralCtrl.ePage.Masters.PaginationForAdjLine.ItemsPerPage) * (AdjustmentGeneralCtrl.ePage.Masters.PaginationForAdjLine.CurrentPage - 1)

             // Watch when Line length changes
             $scope.$watch('AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length', function (val) {
                LocalSearchLengthCalculation();
            });

            if(AdjustmentGeneralCtrl.currentAdjustment.isNew){
                AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ExternalReference = "New";    
            }

            GetUserBasedGridColumList();
            GetUserBasedGridColumListForInventory();
            DefaultFilter();
            GetDropdownList();
            GeneralOperations();
            GetBindValues();
            GetLinesList();
            GetClientAddress();
            GetUDFDetails();
            InitDocuments(); 
        }

        //#region User Based Table Column
        function GetUserBasedGridColumList(){
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_ADJUSTMENT",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };
    
            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function(response){
                if(response.data.Response[0]){
                    AdjustmentGeneralCtrl.ePage.Masters.UserValue= response.data.Response[0];
                    if(response.data.Response[0].Value!=''){
                        var obj = JSON.parse(response.data.Response[0].Value)
                        AdjustmentGeneralCtrl.ePage.Entities.Header.TableProperties.UIWmsWorkOrderLine = obj;
                        AdjustmentGeneralCtrl.ePage.Masters.UserHasValue =true;
                    }
                }else{
                    AdjustmentGeneralCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }

        function GetUserBasedGridColumListForInventory(){
            var _filter1 = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_ADJUSTMENTINVENTORY",
            };
            var _input1 = {
                "searchInput": helperService.createToArrayOfObject(_filter1),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };
    
            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input1).then(function(response){
                if(response.data.Response[0]){
                    AdjustmentGeneralCtrl.ePage.Masters.UserValueForInventory= response.data.Response[0];
                    if(response.data.Response[0].Value!=''){
                        var obj = JSON.parse(response.data.Response[0].Value)
                        AdjustmentGeneralCtrl.ePage.Entities.Header.TableProperties.Inventory = obj;
                        AdjustmentGeneralCtrl.ePage.Masters.UserHasValueForInventory =true;
                    }
                }else{
                    AdjustmentGeneralCtrl.ePage.Masters.UserValueForInventory = undefined;
                }
            })
        }
        //#endregion
            
        //#region Header Funcationlities
        
        //#region General
        function GetDropdownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["ProductCondition", "INW_LINE_UQ", "AdjustmentReason", "WMSYESNO"];
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
                        AdjustmentGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        AdjustmentGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function GeneralOperations() {

            if (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientCode == null) {
                AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientCode = "";
            }
            if (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientName == null) {
                AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientName = "";
            }
            if (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseCode == null) {
                AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseCode = "";
            }
            if (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseName == null) {
                AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseName = "";
            }
            
        }

        function GetBindValues() {
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Client = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientCode + ' - ' + AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientName;
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Warehouse = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseCode + ' - ' + AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseName;
            Removehyphen();
        }

        function Removehyphen() {
            if (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Client == ' - ')
                AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Client = "";

            if (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Warehouse == ' - ')
                AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Warehouse = "";
        }

        function GetClientAddress() {

            if (!AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIOrgHeader) {
                var obj = {
                    "PK": "",
                    "OAD_PK": "",
                    "OAD_Address1": "",
                    "OAD_Address2": "",
                    "OAD_State": "",
                    "OAD_PostCode": "",
                    "OAD_City": "",
                    "OAD_City": "",
                    "OAD_Fax": "",
                    "OAD_Phone": ""
                };
                AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIOrgHeader.push([obj]);
            }
        }

        function GetUDFDetails(){
            if(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ORG_Client_FK){
                var _filter = {
                    "ORG_FK": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ORG_Client_FK
                };
    
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.OrgMiscServ.API.FindAll.FilterID
                };
    
                apiService.post("eAxisAPI", appConfig.Entities.OrgMiscServ.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib1Name = response.data.Response[0].IMPartAttrib1Name;
                        AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib2Name = response.data.Response[0].IMPartAttrib2Name;
                        AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib3Name = response.data.Response[0].IMPartAttrib3Name;
                        AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib1Type = response.data.Response[0].IMPartAttrib1Type;
                        AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib2Type = response.data.Response[0].IMPartAttrib2Type;
                        AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib3Type = response.data.Response[0].IMPartAttrib3Type;
                    }
                });
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            AdjustmentGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        //#endregion

        //#region Selectedlookups
        function SelectedLookupClient(item) {
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ORG_Client_FK = item.PK;
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Client = item.Code + ' - ' + item.FullName;
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIOrgHeader = item;
            OnChangeValues(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Client, 'E10001');
            DefaultFilter();
            GetUDFDetails();
        }

        function SelectedLookupWarehouse(item) {
            AdjustmentGeneralCtrl.ePage.Masters.DataentryName = undefined;
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Warehouse = item.WarehouseCode + ' - ' + item.WarehouseName;
            OnChangeValues(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Warehouse, 'E10002')
            DefaultFilter();
        }
        //#endregion

        //#endregion 

        //#region Line Funcationlities
        
        //#region General
        function GetLinesList() {

            var myData = true;
            angular.forEach(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, function (value, key) {


                if (value.MCC_NKCommodityCode == null)
                    value.MCC_NKCommodityCode = '';

                if (value.MCC_NKCommodityDesc == null)
                    value.MCC_NKCommodityDesc = '';

                value.Commodity = value.MCC_NKCommodityCode + ' - ' + value.MCC_NKCommodityDesc;


                if (value.Commodity == ' - ')
                    value.Commodity = '';

                value.ORG_ClientCode = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientCode;
                value.ORG_ClientName = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientName;
                value.Client_FK = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ORG_Client_FK;

                value.WAR_WarehouseCode = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseCode;
                value.WAR_WarehouseName = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseName;
                value.WAR_FK = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WAR_FK;

                if(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Client){
                    value.Client = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientCode
                    value.ClientRelationship = "OWN";
                }

                if(!value.PRO_FK && value.ProductCode){
                    myData = false;
                }
            });

             //Order By
             AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine = $filter('orderBy')(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, 'CreatedDateTime');

            if(myData==false){
                AdjustmentGeneralCtrl.ePage.Masters.Config.GeneralValidation(AdjustmentGeneralCtrl.currentAdjustment);
            }
        }

        //#endregion
        
        //#region  Bulk Upload
         function InitDocuments() {
            AdjustmentGeneralCtrl.ePage.Masters.Documents = {};
            AdjustmentGeneralCtrl.ePage.Masters.Documents.Autherization = authService.getUserInfo().AuthToken;
            AdjustmentGeneralCtrl.ePage.Masters.Documents.fileDetails = [];
            AdjustmentGeneralCtrl.ePage.Masters.Documents.fileSize = 10;
            AdjustmentGeneralCtrl.ePage.Entities.Entity = 'AdjustmentLines';
            AdjustmentGeneralCtrl.ePage.Entities.EntityRefCode = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WorkOrderID;

            var _additionalValue = {
                "Entity": AdjustmentGeneralCtrl.ePage.Entities.Entity,
                "Path": AdjustmentGeneralCtrl.ePage.Entities.Entity + "," + AdjustmentGeneralCtrl.ePage.Entities.EntityRefCode
            };

            AdjustmentGeneralCtrl.ePage.Masters.Documents.AdditionalValue = JSON.stringify(_additionalValue);
            AdjustmentGeneralCtrl.ePage.Masters.Documents.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.UploadExcel.Url;

            AdjustmentGeneralCtrl.ePage.Masters.Documents.GetUploadedFiles = GetUploadedFiles;
            AdjustmentGeneralCtrl.ePage.Masters.Documents.GetSelectedFiles = GetSelectedFiles;
            AdjustmentGeneralCtrl.ePage.Masters.Documents.DownloadReport = DownloadReport;
        }

        function GetUploadedFiles(Files, docType, mode) {
            if(Files){
                BulkUpload(Files);
            }
        }
        
        function GetSelectedFiles(Files, docType, mode, row){
            AdjustmentGeneralCtrl.ePage.Masters.Loading = true;
        }

        function DownloadReport(){
            AdjustmentGeneralCtrl.ePage.Masters.Loading = true;
            apiService.get("eAxisAPI", appConfig.Entities.DMS.API.DownloadTemplate.Url + "/AdjustmentLineBulkUpload").then(function (response) {
                AdjustmentGeneralCtrl.ePage.Masters.Loading = false;
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        var obj={
                            "Base64str" :response.data.Response,
                            "Name":'AdjLineBulkUpload.xlsx'
                         }
                        helperService.DownloadDocument(obj);
                    }
                } else {
                    console.log("Invalid response");
                }
            });
        }

        function BulkUpload(item){
            if(item.length==0){
                AdjustmentGeneralCtrl.ePage.Masters.Loading =false;
                toastr.warning('Upload Excel With Product Details');
            }else{
                var obj={
                    "LineType":"UIWmsWorkOrderLine",
                    "WmsWorkOrder":{
                        "WorkOrderID":AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WorkOrderID,
                        "WarehouseCode":AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseCode,
                        "ClientCode":AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientCode
                    },
                    "WmsInsertLineRecordsList":''
                }
                obj.WmsInsertLineRecordsList = item;
    
                apiService.post("eAxisAPI", AdjustmentGeneralCtrl.ePage.Entities.Header.API.InsertLine.Url, obj).then(function (response){
                    AdjustmentGeneralCtrl.ePage.Masters.Loading =false;
                    if(response.data.Response){
                        angular.forEach(response.data.Response,function(value,key){
                            value.PK='';
                            value.ReasonCode = 'STA';
                            if(!value.AdjustmentArrivalDate){
                                value.AdjustmentArrivalDate = new Date();
                            }
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
                            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.push(value);
                        });
                        GetLinesList();
                    }else{
                        toastr.error("Upload Failed");
                    }
                });
            }
        }
        //#endregion


        //#region functions
        function CheckFutureDate(fieldvalue, key) {
            var selectedDate = new Date(fieldvalue);
            var now = new Date();
            if (selectedDate > now) {
                OnChangeValues(null, 'E10008', true, undefined)
                OnChangeValues('value', 'E10009', true, undefined)
            } else {
                OnChangeValues('value', 'E10008', true, undefined)
                OnChangeValues('value', 'E10009', true, undefined)
            }
        }

        function SelectedLookupProduct(item, index) {
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PRO_FK = item.OSP_FK;


            if(item.MCC_NKCommodityCode == null)
            item.MCC_NKCommodityCode = '';

            if(item.MCC_NKCommodityDesc == null)
            item.MCC_NKCommodityDesc = '';

            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].Commodity = item.MCC_NKCommodityCode +' - '+item.MCC_NKCommodityDesc;

            //To remove Attributes when copy row
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PartAttrib1='';
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PartAttrib2='';
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PartAttrib3='';
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PackingDate='';
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].ExpiryDate='';
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].Units = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].Packs;

            OnChangeValues(item.ProductCode, 'E10003', true, index);
            OnChangeValues(item.StockKeepingUnit, "E10007", true, index);
            OnChangeValues(item.PAC_PackType, "E10005", true, index);
            OnChangeValues('value', "E10026", true, index);
        }

        function SelectedLookupLocation(item, index) {
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WRO_Name = item.WRO_Name;
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WLO_Level = item.Level;
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WLO_Column = item.Column;
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WLO_Location = item.Location;
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WLO_LocationStatus = item.LocationStatus;
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WLO_LocationStatusDescription = item.LocationStatusDescription;
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WLO_FK = item.PK;
            OnChangeValues('value', "E10027", true, index);
        }

        function FetchQuantity(item, index) {
            
            if (item.PAC_PackType == item.StockKeepingUnit) {
                item.Units = item.Packs;
                OnChangeValues(item.Units, "E10006", true, index);
            } else {
                var _input = {
                    "OSP_FK": item.PRO_FK,
                    "FromPackType": item.PAC_PackType,
                    "ToPackType": item.StockKeepingUnit,
                    "Quantity": item.Packs
                };
                if (item.PRO_FK && item.PAC_PackType && item.StockKeepingUnit && item.Packs) {
                    AdjustmentGeneralCtrl.ePage.Masters.Loading = true;
                    apiService.post("eAxisAPI", appConfig.Entities.PrdProductUnit.API.FetchQuantity.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            item.Units = response.data.Response;
                            AdjustmentGeneralCtrl.ePage.Masters.Loading = false;
                            OnChangeValues(item.Units, "E10006", true, index);
                        }
                    });
                }
            }
            if ((AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib1Type == "SER" && item.UsePartAttrib1 && !item.IsPartAttrib1ReleaseCaptured) || (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib2Type == "SER" && item.UsePartAttrib2 && !item.IsPartAttrib2ReleaseCaptured) || (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib3Type == "SER" && item.UsePartAttrib3 && !item.IsPartAttrib3ReleaseCaptured)) {
                if (parseFloat(item.Units) == 1 || (parseFloat(item.Units) == -1)) {
                    OnChangeValues('value', "E10021", true, AdjustmentGeneralCtrl.ePage.Masters.selectedRow);
                } else{
                    OnChangeValues(null, "E10021", true, AdjustmentGeneralCtrl.ePage.Masters.selectedRow);
                }
            }

            if ((AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib1Type == "SER" &&(item.UsePartAttrib1 || item.IsPartAttrib1ReleaseCaptured)) || (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib2Type == "SER" &&(item.UsePartAttrib2 || item.IsPartAttrib2ReleaseCaptured)) || (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib3Type == "SER" &&(item.UsePartAttrib3 || item.IsPartAttrib3ReleaseCaptured))) {
                if ((parseFloat(item.Units)%1) != 0) {
                    OnChangeValues(null, "E10029", true, AdjustmentGeneralCtrl.ePage.Masters.selectedRow);
                } else  {
                    OnChangeValues('value', "E10029", true, AdjustmentGeneralCtrl.ePage.Masters.selectedRow);
                }
            }
        }

        //#endregion


        //#region checkbox selection
        function SelectAllCheckBox(){
            angular.forEach(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, function (value, key) {
                var startData = AdjustmentGeneralCtrl.ePage.Masters.CurrentPageStartingIndex
                var LastData = AdjustmentGeneralCtrl.ePage.Masters.CurrentPageStartingIndex + (AdjustmentGeneralCtrl.ePage.Masters.PaginationForAdjLine.ItemsPerPage);
                   
                if (AdjustmentGeneralCtrl.ePage.Masters.SelectAll){

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

            var Checked1 = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                AdjustmentGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
                AdjustmentGeneralCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                AdjustmentGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
                AdjustmentGeneralCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }

        function SingleSelectCheckBox() {
            var startData = AdjustmentGeneralCtrl.ePage.Masters.CurrentPageStartingIndex
            var LastData = AdjustmentGeneralCtrl.ePage.Masters.CurrentPageStartingIndex + (AdjustmentGeneralCtrl.ePage.Masters.PaginationForAdjLine.ItemsPerPage);
                   
            var Checked = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.some(function (value, key) {
              // Enable and disable based on page wise
                if((key>=startData) && (key<LastData)){
                    if(!value.SingleSelect)
                    return true;
                }
            });
            if (Checked) {
                AdjustmentGeneralCtrl.ePage.Masters.SelectAll = false;
            } else {
                AdjustmentGeneralCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                AdjustmentGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
                AdjustmentGeneralCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                AdjustmentGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
                AdjustmentGeneralCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }

        function PaginationChangeForAdjLine() {
            AdjustmentGeneralCtrl.ePage.Masters.CurrentPageStartingIndex = (AdjustmentGeneralCtrl.ePage.Masters.PaginationForAdjLine.ItemsPerPage) * (AdjustmentGeneralCtrl.ePage.Masters.PaginationForAdjLine.CurrentPage - 1)
            SingleSelectCheckBox();
        }

        //Required this function when pagination and local search both are used
        function LocalSearchLengthCalculation() {
            var myData = $filter('filter')(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, AdjustmentGeneralCtrl.ePage.Masters.SearchTable);
            AdjustmentGeneralCtrl.ePage.Masters.PaginationForAdjLine.LocalSearchLength = myData.length;
        }

        //#endregion checkbox selection

        //#region Add,copy,delete row

        function setSelectedRow(index){
            AdjustmentGeneralCtrl.ePage.Masters.selectedRow = index;
        }

        function setSelectedRowInventory(index){
            AdjustmentGeneralCtrl.ePage.Masters.selectedRowInventory = index;
        }

        function AddNewRow() {
            if (!AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Client || !AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Warehouse){
                AdjustmentGeneralCtrl.ePage.Masters.Config.GeneralValidation(AdjustmentGeneralCtrl.currentAdjustment);
                AdjustmentGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(AdjustmentGeneralCtrl.currentAdjustment);
            }else{
                AdjustmentGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                var obj = {
                "PK": "",
                "ProductCode": "",
                "ProductDescription": "",
                "PRO_FK": "",
                "Commodity": "",
                "MCC_NKCommodityCode": "",
                "MCC_NKCommodityDesc": "",
                "Packs": "",
                "PAC_PackType": "",
                "Units": "",
                "StockKeepingUnit": "",
                "ProductCondition":"GDC",
                "WRO_Name": "",
                "WLO_Location": "",
                "WLO_FK": "",
                "WLO_Column": "",
                "WLO_Level": "",
                "WAA_AreaType": "",
                "WAA_Name": "",
                "WLO_LocationStatus":"",
                "WLO_LocationStatusDescription":"",
                "AdjustmentArrivalDate": "",
                "LineComment": "",
                "PalletID": "",
                "ReasonCode": "",
                "Description": "",
                "CommitedUnit": "",
                "OriginalInventoryStatus": "",
                "OriginalInventoryStatusDesc": "",
                "PartAttrib1": "",
                "PartAttrib2": "",
                "PartAttrib3": "",
                "PackingDate": "",
                "ExpiryDate": "",
                "UseExpiryDate": false,
                "UsePackingDate": false,
                "UsePartAttrib1": false,
                "UsePartAttrib2": false,
                "UsePartAttrib3": false,
                "IsPartAttrib1ReleaseCaptured": false,
                "IsPartAttrib2ReleaseCaptured": false,
                "IsPartAttrib3ReleaseCaptured": false,

                "IsDeleted": false,
                "ORG_ClientCode": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientCode,
                "ORG_ClientName": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientName,
                "Client_FK": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ORG_Client_FK,

                "WAR_WarehouseCode": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseCode,
                "WAR_WarehouseName": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseName,
                "WAR_FK": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WAR_FK,
                };
                if(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Client){
                    obj.Client = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientCode
                    obj.ClientRelationship = "OWN";
                }
                AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.push(obj);
                AdjustmentGeneralCtrl.ePage.Masters.selectedRow = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length-1;
            
                $timeout(function () {
                    var objDiv = document.getElementById("AdjustmentGeneralCtrl.ePage.Masters.AddScroll");
                    objDiv.scrollTop = objDiv.scrollHeight;
                }, 50);
                AdjustmentGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
            }
        };

        function CopyRow() {
            AdjustmentGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            for(var i = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length -1; i >= 0; i--){
                if(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[i].SingleSelect){
                    var item = angular.copy(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[i]);
                    var obj = {
                        "PK": "",
                        "ProductCode": item.ProductCode,
                        "ProductDescription": item.ProductDescription,
                        "PRO_FK": item.PRO_FK,
                        "Commodity": item.Commodity,
                        "MCC_NKCommodityCode": item.MCC_NKCommodityCode,
                        "MCC_NKCommodityDesc": item.MCC_NKCommodityDesc,
                        "Packs": item.Packs,
                        "PAC_PackType": item.PAC_PackType,
                        "Units": item.Units,
                        "StockKeepingUnit": item.StockKeepingUnit,
                        "WRO_Name": item.WRO_Name,
                        "WLO_Location": item.WLO_Location,
                        "WLO_FK": item.WLO_FK,
                        "WLO_Column": item.WLO_Column,
                        "WLO_Level": item.WLO_Level,
                        "WAA_AreaType": item.WAA_AreaType,
                        "WAA_Name": item.WAA_Name,
                        "WLO_LocationStatus":item.WLO_LocationStatus,
                        "WLO_LocationStatusDescription":item.WLO_LocationStatusDescription,
                        "AdjustmentArrivalDate": item.AdjustmentArrivalDate,
                        "LineComment": item.LineComment,
                        "PalletID": item.PalletID,
                        "ReasonCode": item.ReasonCode,
                        "ProductCondition":item.ProductCondition,
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
        
                        "IsDeleted": false,
                        "IsCopied":true,
                        "ORG_ClientCode": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientCode,
                        "ORG_ClientName": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientName,
                        "Client_FK": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ORG_Client_FK,
        
                        "WAR_WarehouseCode": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseCode,
                        "WAR_WarehouseName": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseName,
                        "WAR_FK": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WAR_FK,
        
                        "WorkOrderLineStatus": "",
                        "WorkOrderLineStatusDesc": "",
                        "OriginalInventoryStatus": "",
                        "OriginalInventoryStatusDesc": "",
                    };
                    if(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Client){
                        obj.Client = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientCode
                        obj.ClientRelationship = "OWN";
                    }
                    AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.splice(i + 1, 0, obj);
                }
            }
            AdjustmentGeneralCtrl.ePage.Masters.selectedRow = -1;
            AdjustmentGeneralCtrl.ePage.Masters.SelectAll = false;
            AdjustmentGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
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
                    AdjustmentGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

                    angular.forEach(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine,function(value,key){
                        if(value.SingleSelect==true && value.PK){
                            apiService.get("eAxisAPI", AdjustmentGeneralCtrl.ePage.Entities.Header.API.LineDelete.Url + value.PK).then(function (response) {
                            });
                        }
                    });
            
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        for (var i = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length -1; i >= 0; i--){
                            if(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[i].SingleSelect==true)
                            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.splice(i,1);
                        }
                        AdjustmentGeneralCtrl.ePage.Masters.Config.GeneralValidation(AdjustmentGeneralCtrl.currentAdjustment);
                    }
                    toastr.success('Record Removed Successfully');
                    AdjustmentGeneralCtrl.ePage.Masters.selectedRow = -1;
                    AdjustmentGeneralCtrl.ePage.Masters.SelectAll = false;
                    AdjustmentGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    AdjustmentGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
                }, function () {
                    console.log("Cancelled");
            });
        }
        //#endregion Add,copy,delete row

        //#region Validation
        function UDF(item, index) {
            if (!item.IsPartAttrib1ReleaseCaptured) {
                if (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib1Type == "SER" && item.UsePartAttrib1 || AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib1Type == "MAN" && item.UsePartAttrib1 || AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib1Type == "BAT" && item.UsePartAttrib1) {
                    if (!item.PartAttrib1)
                        OnChangeValues(null, 'E10016', true, index);
                    else
                        OnChangeValues('value', 'E10016', true, index);
                }
            }
            if (!item.IsPartAttrib2ReleaseCaptured) {
                if (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib2Type == "SER" && item.UsePartAttrib2 || AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib2Type == "MAN" && item.UsePartAttrib2 || AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib2Type == "BAT" && item.UsePartAttrib2) {
                    if (!item.PartAttrib2)
                        OnChangeValues(null, 'E10017', true, index);
                    else
                        OnChangeValues('value', 'E10017', true, index);
                }
            }
            if (!item.IsPartAttrib3ReleaseCaptured) {
                if (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib3Type == "SER" && item.UsePartAttrib3 || AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib3Type == "MAN" && item.UsePartAttrib3 || AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib3Type == "BAT" && item.UsePartAttrib3) {
                    if (!item.PartAttrib3)
                        OnChangeValues(null, 'E10018', true, index);
                    else
                        OnChangeValues('value', 'E10018', true, index);
                }
            }
            if (item.UsePackingDate) {
                if (!item.PackingDate)
                    OnChangeValues(null, 'E10019', true, index);
                else
                    OnChangeValues('value', 'E10019', true, index);
            }
            if (item.UseExpiryDate) {
                if (!item.ExpiryDate)
                    OnChangeValues(null, 'E10020', true, index);
                else
                    OnChangeValues('value', 'E10020', true, index);
            }

        }

        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(AdjustmentGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (IsArray) {
                if (!fieldvalue) {
                    AdjustmentGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, AdjustmentGeneralCtrl.currentAdjustment.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
                } else {
                    AdjustmentGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, AdjustmentGeneralCtrl.currentAdjustment.label, IsArray, RowIndex, value.ColIndex);
                }
            } else {
                if (!fieldvalue) {
                    AdjustmentGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, AdjustmentGeneralCtrl.currentAdjustment.label, false, undefined, undefined, undefined, undefined, undefined);
                } else {
                    AdjustmentGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, AdjustmentGeneralCtrl.currentAdjustment.label);
                }
            }
        }


        function RemoveAllLineErrors(){
            for(var i=0;i<AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length;i++){
                OnChangeValues('value', "E10003", true, i);
                OnChangeValues('value', "E10004", true, i);
                OnChangeValues('value', "E10005", true, i);
                OnChangeValues('value', "E10006", true, i);
                OnChangeValues('value', "E10007", true, i);
                OnChangeValues('value', "E10009", true, i);
                OnChangeValues('value', "E10010", true, i);
                OnChangeValues('value', "E10011", true, i);
                OnChangeValues('value', "E10016", true, i);
                OnChangeValues('value', "E10017", true, i);
                OnChangeValues('value', "E10018", true, i);
                OnChangeValues('value', "E10019", true, i);
                OnChangeValues('value', "E10020", true, i);
                OnChangeValues('value', "E10021", true, i);
                OnChangeValues('value', "E10022", true, i);
                OnChangeValues('value', "E10023", true, i);
                OnChangeValues('value', "E10024", true, i);
                OnChangeValues('value', "E10026", true, i);
                OnChangeValues('value', "E10027", true, i);
                OnChangeValues('value', "E10028", true, i);
                OnChangeValues('value', "E10029", true, i);
            }
            return true;
        }

        //#endregion

        //#endregion
        
        //#region Inventory Line Functionlities

        function CloseFilterList() {
            $('#filterSideBar' + "WarehouseInventory" + AdjustmentGeneralCtrl.currentAdjustment.label).removeClass('open');
        }

        function GetFilterList() {
            $timeout(function () {
                $('#filterSideBar' + "WarehouseInventory" + AdjustmentGeneralCtrl.currentAdjustment.label).toggleClass('open');
            });
        }

        function DefaultFilter() {
            if (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientCode && AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseCode) {
                AdjustmentGeneralCtrl.ePage.Masters.defaultFilter = {
                    "ClientCode": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientCode,
                    "WAR_WarehouseCode": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseCode,
                    "InventoryStatusIn": "AVL,HEL"
                };
                AdjustmentGeneralCtrl.ePage.Masters.DynamicControl = undefined;
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
                    AdjustmentGeneralCtrl.ePage.Masters.DynamicControl = response.data.Response;

                    dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response.LookUpList);

                    if (AdjustmentGeneralCtrl.ePage.Masters.defaultFilter !== undefined) {
                        AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities.map(function (value, key) {
                            value.Data = AdjustmentGeneralCtrl.ePage.Masters.defaultFilter;

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
                    AdjustmentGeneralCtrl.ePage.Masters.ViewType = 1;
                    Filter();
                }
            });
        }

        function Filter() {

            // if searching input and original client and warehouse same then only process

            if((AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ClientCode == AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientCode)&& (AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.WAR_WarehouseCode==AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseCode)){

                AdjustmentGeneralCtrl.ePage.Masters.Inventory = [];
                AdjustmentGeneralCtrl.ePage.Masters.InventoryLoading = true;

                $(".filter-sidebar-wrapper").toggleClass("open");

                var FilterObj = {
                    "ClientCode": AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ClientCode,
                    "WAR_WarehouseCode": AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.WAR_WarehouseCode,
                    "AreaName": AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.AreaName,
                    "InventoryStatusIn": AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.InventoryStatusIn,
                    "ExternalReference": AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ExternalReference,
                    "Location": AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.Location,
                    "PalletID": AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PalletID,
                    "ProductCode": AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ProductCode,
                    "WOL_AdjustmentArrivalDate": AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.WOL_AdjustmentArrivalDate,
                    "PartAttrib1": AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PartAttrib1,
                    "PartAttrib2": AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PartAttrib2,
                    "PartAttrib3": AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PartAttrib3,
                    "PackingDate": AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PackingDate,
                    "ExpiryDate": AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ExpiryDate,
                    "SortColumn": "WOL_WAR_WarehouseCode",
                    "SortType": "ASC",
                    "PageNumber": AdjustmentGeneralCtrl.ePage.Masters.PaginationForInventory.CurrentPage,
                    "PageSize": AdjustmentGeneralCtrl.ePage.Masters.PaginationForInventory.ItemsPerPage
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(FilterObj),
                    "FilterID": adjustmentConfig.Entities.Header.API.Inventory.FilterID,
                };
                apiService.post("eAxisAPI", AdjustmentGeneralCtrl.ePage.Entities.Header.API.Inventory.Url, _input).then(function (response) {
                    AdjustmentGeneralCtrl.ePage.Masters.Inventory = response.data.Response;
                    AdjustmentGeneralCtrl.ePage.Masters.InventoryCount = response.data.Count;
                   AdjustmentGeneralCtrl.ePage.Masters.InventoryLoading = false;
                });
            }else{
                toastr.warning("Please Enter Chosen Client And Warehouse in Filter");
            }
        }

        function AddToLine() {
            angular.forEach(AdjustmentGeneralCtrl.ePage.Masters.Inventory, function (value, key) {
                if (value.SingleSelectInventory) {
                    var obj = {
                        "PK": "",
                        "ProductCode": value.ProductCode,
                        "ProductDescription": value.ProductName,
                        "PRO_FK": value.PRO_FK,
                        "MCC_NKCommodityCode": value.MCC_NKCommodityCode,
                        "MCC_NKCommodityDesc": value.MCC_NKCommodityDesc,
                        "Packs": "-" + value.InLocationQty,
                        "PAC_PackType": value.StockKeepingUnit,
                        "Units": "-" + value.InLocationQty,
                        "StockKeepingUnit": value.StockKeepingUnit,
                        "ProductCondition":value.ProductCondition,
                        "WRO_Name": "",
                        "WLO_Location": value.Location,
                        "WLO_FK": value.WLO_FK,
                        "WLO_Column": "",
                        "WLO_Level": "",
                        "WAA_AreaType": value.AreaType,
                        "WLO_LocationStatus" : value.LocationStatus,
                        "WLO_LocationStatusDescription" : value.LocationStatusDescription,
                        "WAA_Name": value.AreaName,
                        "AdjustmentArrivalDate": value.AdjustmentArrivalDate,
                        "LineComment": value.LineComment,
                        "PalletID": value.PalletID,
                        "ReasonCode": 'STA',
                        "Description": "",
                        "OriginalInventoryStatus": "",
                        "OriginalInventoryStatusDesc": "",
                        "PartAttrib1": value.PartAttrib1,
                        "PartAttrib2": value.PartAttrib2,
                        "PartAttrib3": value.PartAttrib3,
                        "PackingDate": value.PackingDate,
                        "ExpiryDate": value.ExpiryDate,
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
                    if(obj.MCC_NKCommodityCode == null){
                        obj.MCC_NKCommodityCode = '';
                    }
                    if(obj.MCC_NKCommodityDesc == null){
                        obj.MCC_NKCommodityDesc = '';
                    }
                    obj.Commodity =  obj.MCC_NKCommodityCode+' - '+obj.MCC_NKCommodityDesc
                    AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.push(obj);

                }
                value.SingleSelectInventory = false;
                AdjustmentGeneralCtrl.ePage.Masters.SelectAllInventory = false;
            });
        }

        //#region checkbox selection
        function SelectAllCheckBoxInventory(){
            angular.forEach(AdjustmentGeneralCtrl.ePage.Masters.Inventory, function (value, key) {
            if (AdjustmentGeneralCtrl.ePage.Masters.SelectAllInventory){
                if(parseFloat(value.InLocationQty)>0)
                value.SingleSelectInventory = true;
            }
            else{
                value.SingleSelectInventory = false;
            }
            });
        }

        function SingleSelectCheckBoxInventory() {
            var Checked = AdjustmentGeneralCtrl.ePage.Masters.Inventory.some(function (value, key) {
                if(!value.SingleSelectInventory)
                return true;
            });
            if (Checked) {
                AdjustmentGeneralCtrl.ePage.Masters.SelectAllInventory = false;
            } else {
                AdjustmentGeneralCtrl.ePage.Masters.SelectAllInventory = true;
            }
        }
        //#endregion checkbox selection
        //#endregion
        
        Init();

    }

})();