(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OutwardLineController", OutwardLineController);

    OutwardLineController.$inject = ["$scope", "$state", "$timeout", "APP_CONSTANT", "apiService", "outwardConfig", "helperService", "$uibModal", "$http", "$document", "appConfig", "authService", "$location", "$injector", "$window", "toastr", "confirmation","$filter"];

    function OutwardLineController($scope, $state, $timeout, APP_CONSTANT, apiService, outwardConfig, helperService, $uibModal, $http, $document, appConfig, authService, $location, $injector, $window, toastr, confirmation,$filter) {

        var OutwardLineCtrl = this;

        function Init() {

            var currentOutward = OutwardLineCtrl.currentOutward[OutwardLineCtrl.currentOutward.label].ePage.Entities;
            OutwardLineCtrl.ePage = {
                "Title": "",
                "Prefix": "Outward_Line",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOutward,
            };

            OutwardLineCtrl.ePage.Masters.Config = outwardConfig;

            //For table
            OutwardLineCtrl.ePage.Masters.SelectAll = false;
            OutwardLineCtrl.ePage.Masters.EnableDeleteButton = false;
            OutwardLineCtrl.ePage.Masters.EnableCopyButton = false;
            OutwardLineCtrl.ePage.Masters.Enable = true;
            OutwardLineCtrl.ePage.Masters.selectedRow = -1;
            OutwardLineCtrl.ePage.Masters.emptyText = '-';
            OutwardLineCtrl.ePage.Masters.SearchTable = '';

            OutwardLineCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            OutwardLineCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            OutwardLineCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            OutwardLineCtrl.ePage.Masters.AddNewRow = AddNewRow;
            OutwardLineCtrl.ePage.Masters.CopyRow = CopyRow;
            OutwardLineCtrl.ePage.Masters.RemoveRow = RemoveRow;

            OutwardLineCtrl.ePage.Masters.DropDownMasterList = {};

            // DatePicker
            OutwardLineCtrl.ePage.Masters.DatePicker = {};
            OutwardLineCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            OutwardLineCtrl.ePage.Masters.DatePicker.isOpen = [];
            OutwardLineCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            OutwardLineCtrl.ePage.Masters.SelectedLookupProduct = SelectedLookupProduct;
            OutwardLineCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            OutwardLineCtrl.ePage.Masters.FetchQuantity = FetchQuantity;
            OutwardLineCtrl.ePage.Masters.GetPercentageValues = GetPercentageValues;
            OutwardLineCtrl.ePage.Masters.GetDocumentInputValues = GetDocumentInputValues;
            OutwardLineCtrl.ePage.Masters.LocalSearchLengthCalculation = LocalSearchLengthCalculation;

            OutwardLineCtrl.ePage.Masters.Pagination = {};
            OutwardLineCtrl.ePage.Masters.Pagination.CurrentPage = 1;
            OutwardLineCtrl.ePage.Masters.Pagination.MaxSize = 3;
            OutwardLineCtrl.ePage.Masters.Pagination.ItemsPerPage = 25;
            OutwardLineCtrl.ePage.Masters.PaginationChange = PaginationChange;
            OutwardLineCtrl.ePage.Masters.Pagination.LocalSearchLength = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length;

            OutwardLineCtrl.ePage.Masters.CurrentPageStartingIndex = (OutwardLineCtrl.ePage.Masters.Pagination.ItemsPerPage)*(OutwardLineCtrl.ePage.Masters.Pagination.CurrentPage-1)

            GetUserBasedGridColumList();
            GetDropdownList();
            GetLinesList();
            GetPercentageValues();
            InitDocuments();

            // Watch when Line length changes
            $scope.$watch('OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length', function(val)
            { 
                LocalSearchLengthCalculation();
            });
        }

        
        //#region User Based Table Column
        function GetUserBasedGridColumList(){
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_OUTWARDLINE",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };
    
            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function(response){
                if(response.data.Response[0]){
                    OutwardLineCtrl.ePage.Masters.UserValue= response.data.Response[0];
                    if(response.data.Response[0].Value!=''){
                        var obj = JSON.parse(response.data.Response[0].Value)
                        OutwardLineCtrl.ePage.Entities.Header.TableProperties.UIWmsWorkOrderLine = obj;
                        OutwardLineCtrl.ePage.Masters.UserHasValue =true;
                    }
                }else{
                    OutwardLineCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }
        //#endregion
         
        //#region PercentageValues
        function GetPercentageValues() {
            OutwardLineCtrl.ePage.Masters.TotalLineUnits = 0;
            OutwardLineCtrl.ePage.Masters.TotalLinePackagesSent = 0;
            OutwardLineCtrl.ePage.Masters.TotalLineWeight = 0;
            OutwardLineCtrl.ePage.Masters.TotalLineVolume = 0;
            OutwardLineCtrl.ePage.Masters.LineWeight = 0;
            OutwardLineCtrl.ePage.Masters.LineVolume = 0;

            angular.forEach(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, function (value, key) {
                OutwardLineCtrl.ePage.Masters.TotalLineUnits = OutwardLineCtrl.ePage.Masters.TotalLineUnits + parseFloat(value.Units);
                OutwardLineCtrl.ePage.Masters.TotalLinePackagesSent = OutwardLineCtrl.ePage.Masters.TotalLinePackagesSent + parseFloat(value.Packs);
                OutwardLineCtrl.ePage.Masters.LineWeight = parseFloat(value.Weight) * parseFloat(value.Units);
                OutwardLineCtrl.ePage.Masters.LineVolume = parseFloat(value.Volume) * parseFloat(value.Units);
                OutwardLineCtrl.ePage.Masters.TotalLineWeight = OutwardLineCtrl.ePage.Masters.TotalLineWeight + OutwardLineCtrl.ePage.Masters.LineWeight;
                OutwardLineCtrl.ePage.Masters.TotalLineVolume = OutwardLineCtrl.ePage.Masters.TotalLineVolume + OutwardLineCtrl.ePage.Masters.LineVolume;
            });
            //To find Percentage for Units
            if (parseFloat(OutwardLineCtrl.ePage.Masters.TotalLineUnits) > parseFloat(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.TotalUnits)) {
                OutwardLineCtrl.ePage.Masters.TotalLineUnitsPercentage = 100;
                OutwardLineCtrl.ePage.Masters.TotalUnitsPercentage = ((parseFloat(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.TotalUnits) / parseFloat(OutwardLineCtrl.ePage.Masters.TotalLineUnits)) * 100)
            }
            else if (parseFloat(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.TotalUnits) > parseFloat(OutwardLineCtrl.ePage.Masters.TotalLineUnits)) {
                OutwardLineCtrl.ePage.Masters.TotalUnitsPercentage = 100;
                OutwardLineCtrl.ePage.Masters.TotalLineUnitsPercentage = ((parseFloat(OutwardLineCtrl.ePage.Masters.TotalLineUnits) / parseFloat(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.TotalUnits)) * 100)
            }
            else if ((parseFloat(OutwardLineCtrl.ePage.Masters.TotalLineUnits) == parseFloat(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.TotalUnits)) && parseFloat(OutwardLineCtrl.ePage.Masters.TotalLineUnits) != 0) {
                OutwardLineCtrl.ePage.Masters.TotalUnitsPercentage = 100;
                OutwardLineCtrl.ePage.Masters.TotalLineUnitsPercentage = 100;
            }
            else {
                OutwardLineCtrl.ePage.Masters.TotalUnitsPercentage = 0;
                OutwardLineCtrl.ePage.Masters.TotalLineUnitsPercentage = 0;
            }

            //To find Percentage for Packages
            if (parseFloat(OutwardLineCtrl.ePage.Masters.TotalLinePackagesSent) > parseFloat(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PackagesSent)) {
                OutwardLineCtrl.ePage.Masters.TotalLinePackagesSentPercentage = 100;
                OutwardLineCtrl.ePage.Masters.TotalPackagesSentPercentage = ((parseFloat(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PackagesSent) / parseFloat(OutwardLineCtrl.ePage.Masters.TotalLinePackagesSent)) * 100)
            }
            else if (parseFloat(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PackagesSent) > parseFloat(OutwardLineCtrl.ePage.Masters.TotalLinePackagesSent)) {
                OutwardLineCtrl.ePage.Masters.TotalPackagesSentPercentage = 100;
                OutwardLineCtrl.ePage.Masters.TotalLinePackagesSentPercentage = ((parseFloat(OutwardLineCtrl.ePage.Masters.TotalLinePackagesSent) / parseFloat(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PackagesSent)) * 100)
            }
            else if ((parseFloat(OutwardLineCtrl.ePage.Masters.TotalLinePackagesSent) == parseFloat(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PackagesSent)) && parseFloat(OutwardLineCtrl.ePage.Masters.TotalLinePackagesSent) != 0) {
                OutwardLineCtrl.ePage.Masters.TotalPackagesSentPercentage = 100;
                OutwardLineCtrl.ePage.Masters.TotalLinePackagesSentPercentage = 100;
            }
            else {
                OutwardLineCtrl.ePage.Masters.TotalPackagesSentPercentage = 0;
                OutwardLineCtrl.ePage.Masters.TotalLinePackagesSentPercentage = 0;
            }

            OutwardLineCtrl.ePage.Entities.Header.GlobalVariables.PercentageValues = false;
        }
        //#endregion

        //#region General
        function GetLinesList() {
            var myData = true;
            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.TotalLineUnits = 0;
            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.TotalLinePallets = 0;
            angular.forEach(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, function (value, key) {
                OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.TotalLineUnits = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.TotalLineUnits + value.TotalUnits;
                OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.TotalLinePallets = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.TotalLinePallets + value.PalletID;

                if (value.MCC_NKCommodityCode == null)
                    value.MCC_NKCommodityCode = '';

                if (value.MCC_NKCommodityDesc == null)
                    value.MCC_NKCommodityDesc = '';

                value.Commodity = value.MCC_NKCommodityCode + ' - ' + value.MCC_NKCommodityDesc;

                if (value.Commodity == ' - ')
                    value.Commodity = '';

                value.ORG_ClientCode = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientCode;
                value.ORG_ClientName = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientName;
                value.Client_FK = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ORG_Client_FK;

                value.WAR_WarehouseCode = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseCode;
                value.WAR_WarehouseName = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseName;
                value.WAR_FK = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WAR_FK;

                if(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.Client){
                    value.Client = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientCode;
                    value.ClientRelationship = "OWN";
                }

                if(!value.PRO_FK && value.ProductCode){
                    myData = false;
                }
            });

            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine = $filter('orderBy')(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, 'CreatedDateTime');
            
            if(myData==false){
                OutwardLineCtrl.ePage.Masters.Config.GeneralValidation(OutwardLineCtrl.currentOutward);
            }
        }

        function GetDropdownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["INW_LINE_UQ", "WMSYESNO","ProductCondition"];
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
                        OutwardLineCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        OutwardLineCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            OutwardLineCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        //#endregion

        //#region  Bulk Upload
        function InitDocuments() {
            OutwardLineCtrl.ePage.Masters.Documents = {};
            OutwardLineCtrl.ePage.Masters.Documents.Autherization = authService.getUserInfo().AuthToken;
            OutwardLineCtrl.ePage.Masters.Documents.fileDetails = [];
            OutwardLineCtrl.ePage.Masters.Documents.fileSize = 10;
            OutwardLineCtrl.ePage.Entities.Entity = 'OutwardLines';
            OutwardLineCtrl.ePage.Entities.EntityRefCode = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderID;

            var _additionalValue = {
                "Entity": OutwardLineCtrl.ePage.Entities.Entity,
                "Path": OutwardLineCtrl.ePage.Entities.Entity + "," + OutwardLineCtrl.ePage.Entities.EntityRefCode
            };

            OutwardLineCtrl.ePage.Masters.Documents.AdditionalValue = JSON.stringify(_additionalValue);
            OutwardLineCtrl.ePage.Masters.Documents.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.UploadExcel.Url;

            OutwardLineCtrl.ePage.Masters.Documents.GetUploadedFiles = GetUploadedFiles;
            OutwardLineCtrl.ePage.Masters.Documents.GetSelectedFiles = GetSelectedFiles;
            OutwardLineCtrl.ePage.Masters.Documents.DownloadReport = DownloadReport;
        }

        function GetUploadedFiles(Files, docType, mode) {
            if(Files){
                BulkUpload(Files);
            }
        }
        
        function GetSelectedFiles(Files, docType, mode, row){
            OutwardLineCtrl.ePage.Masters.Loading = true;
        }

        function DownloadReport(){
            OutwardLineCtrl.ePage.Masters.Loading = true;
            apiService.get("eAxisAPI", appConfig.Entities.DMS.API.DownloadTemplate.Url + "/ReceiveLineBulkUpload").then(function (response) {
                OutwardLineCtrl.ePage.Masters.Loading = false;
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        var obj={
                            "Base64str" :response.data.Response,
                            "Name":'OutwardLineBulkUpload.xlsx'
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
                OutwardLineCtrl.ePage.Masters.Loading =false;
                toastr.warning('Upload Excel With Product Details');
            }else{
                var obj={
                    "LineType":"UIWmsWorkOrderLine",
                    "WmsWorkOrder":{
                        "WorkOrderID":OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderID,
                        "WarehouseCode":OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseCode,
                        "ClientCode":OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientCode
                    },
                    "WmsInsertLineRecordsList":''
                }
                obj.WmsInsertLineRecordsList = item;
    
                apiService.post("eAxisAPI", OutwardLineCtrl.ePage.Entities.Header.API.InsertLine.Url, obj).then(function (response){
                    OutwardLineCtrl.ePage.Masters.Loading = false;
                    if(response.data.Response){
                        var myData = false;
                        angular.forEach(response.data.Response,function(value,key){
                            
                            value.PK='';
                            if(!value.Packs){
                                value.Packs = 1;
                                value.Quantity = 1;
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
                            
                            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.push(value);
                        });
                        GetLinesList();
                    }else{
                        toastr.error("Upload Failed");
                    }
                });
            }
        }
        //#endregion

        //#region Selectedlookups
        function SelectedLookupProduct(item, index) {
            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PRO_FK = item.OSP_FK;

            if(item.MCC_NKCommodityCode==null)
            item.MCC_NKCommodityCode = '';

            if(item.MCC_NKCommodityDesc==null)
            item.MCC_NKCommodityDesc = '';

            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].Commodity = item.MCC_NKCommodityCode+' - '+item.MCC_NKCommodityDesc;

            //To remove Attributes when copy row
            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PartAttrib1='';
            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PartAttrib2='';
            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PartAttrib3='';
            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PackingDate='';
            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].ExpiryDate='';
            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].Units = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].Packs;
            
            OnChangeValues(item.ProductCode, 'E3504', true, index);
            OnChangeValues(item.StockKeepingUnit, 'E3521', true, index);
            OnChangeValues('value', "E3530", true, index);
        }
        //#endregion

        //#region checkbox selection
        function SelectAllCheckBox(){
            angular.forEach(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, function (value, key) {
                var startData = OutwardLineCtrl.ePage.Masters.CurrentPageStartingIndex
                var LastData = OutwardLineCtrl.ePage.Masters.CurrentPageStartingIndex + (OutwardLineCtrl.ePage.Masters.Pagination.ItemsPerPage);
                   
                if (OutwardLineCtrl.ePage.Masters.SelectAll){

                    // Enable and disable based on page wise
                    if((key>=startData) && (key<LastData)){
                        if(!value.AllocatedQty)
                        value.SingleSelect = true;
                    }
                }
                else{
                    if((key>=startData) && (key<LastData)){
                        value.SingleSelect = false;
                    }
                }
            });

            var Checked1 = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                OutwardLineCtrl.ePage.Masters.EnableDeleteButton = true;
                OutwardLineCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                OutwardLineCtrl.ePage.Masters.EnableDeleteButton = false;
                OutwardLineCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }

        function SingleSelectCheckBox() {
            var startData = OutwardLineCtrl.ePage.Masters.CurrentPageStartingIndex
            var LastData = OutwardLineCtrl.ePage.Masters.CurrentPageStartingIndex + (OutwardLineCtrl.ePage.Masters.Pagination.ItemsPerPage);
                   
            var Checked = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.some(function (value, key) {
              // Enable and disable based on page wise
                if((key>=startData) && (key<LastData)){
                    if(!value.SingleSelect)
                    return true;
                }
            });
            if (Checked) {
                OutwardLineCtrl.ePage.Masters.SelectAll = false;
            } else {
                OutwardLineCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                OutwardLineCtrl.ePage.Masters.EnableDeleteButton = true;
                OutwardLineCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                OutwardLineCtrl.ePage.Masters.EnableDeleteButton = false;
                OutwardLineCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }

        function PaginationChange(){
            OutwardLineCtrl.ePage.Masters.CurrentPageStartingIndex = (OutwardLineCtrl.ePage.Masters.Pagination.ItemsPerPage)*(OutwardLineCtrl.ePage.Masters.Pagination.CurrentPage-1)
            SingleSelectCheckBox();
        }

        //Required this function when pagination and local search both are used
        function LocalSearchLengthCalculation(){
            var myData = $filter('filter')(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, OutwardLineCtrl.ePage.Masters.SearchTable);
            OutwardLineCtrl.ePage.Masters.Pagination.LocalSearchLength = myData.length;
        }

        //#endregion checkbox selection

        //#region Add,copy,delete row

        function setSelectedRow(index){
            OutwardLineCtrl.ePage.Masters.selectedRow = index;
        }

        function AddNewRow() {
            OutwardLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
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
                "PartAttrib1": "",
                "PartAttrib2": "",
                "PartAttrib3": "",
                "QtyMet": "",
                "ReservedUnit": "",
                "ShortQty": "",
                "LineComment": "",
                "PackingDate": "",
                "ExpiryDate": "",
                "AdditionalRef1Code":"",
                "UseExpiryDate": false,
                "UsePackingDate": false,
                "UsePartAttrib1": false,
                "UsePartAttrib2": false,
                "UsePartAttrib3": false,
                "IsPartAttrib1ReleaseCaptured": false,
                "IsPartAttrib2ReleaseCaptured": false,
                "IsPartAttrib3ReleaseCaptured": false,

                "IsDeleted": false,
                "ORG_ClientCode": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientCode,
                "ORG_ClientName": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientName,
                "Client_FK": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ORG_Client_FK,

                "WAR_WarehouseCode": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseCode,
                "WAR_WarehouseName": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseName,
                "WAR_FK": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WAR_FK,
            };
            if(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.Client){
                obj.Client = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientCode;
                obj.ClientRelationship = "OWN";
            }
            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.push(obj);
            OutwardLineCtrl.ePage.Masters.selectedRow = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length-1;
        
            $timeout(function () {
                var objDiv = document.getElementById("OutwardLineCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            OutwardLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
        };

        function CopyRow() {
            OutwardLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            for(var i = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length -1; i >= 0; i--){
                if(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[i].SingleSelect){
                    var item = angular.copy(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[i]);
                    var obj = {
                        "PK": "",
                        "ProductCode":item.ProductCode,
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
                        "PartAttrib1": item.PartAttrib1,
                        "PartAttrib2": item.PartAttrib2,
                        "PartAttrib3": item.PartAttrib3,
                        "LineComment": item.LineComment,
                        "PackingDate": item.PackingDate,
                        "ExpiryDate": item.ExpiryDate,
                        "AdditionalRef1Code":item.AdditionalRef1Code,
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
                        "ORG_ClientCode": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientCode,
                        "ORG_ClientName": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientName,
                        "Client_FK": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ORG_Client_FK,
        
                        "WAR_WarehouseCode": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseCode,
                        "WAR_WarehouseName": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseName,
                        "WAR_FK": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WAR_FK,
                    };
                    if(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.Client){
                        obj.Client = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientCode;
                        obj.ClientRelationship = "OWN";
                    }
                    OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.splice(i + 1, 0, obj);
                }
            }
            OutwardLineCtrl.ePage.Masters.selectedRow = -1;
            OutwardLineCtrl.ePage.Masters.SelectAll = false;
            OutwardLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
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
                    OutwardLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

                    angular.forEach(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine,function(value,key){
                        if(value.SingleSelect==true && value.PK){
                            apiService.get("eAxisAPI", OutwardLineCtrl.ePage.Entities.Header.API.LineDelete.Url + value.PK).then(function (response) {
                            });
                        }
                    });
            
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        for (var i = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length -1; i >= 0; i--){
                            if(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[i].SingleSelect==true)
                            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.splice(i,1);
                        }
                        OutwardLineCtrl.ePage.Masters.Config.GeneralValidation(OutwardLineCtrl.currentOutward);
                    }
                    GetPercentageValues();
                    toastr.success('Record Removed Successfully');
                    OutwardLineCtrl.ePage.Masters.selectedRow = -1;
                    OutwardLineCtrl.ePage.Masters.SelectAll = false;
                    OutwardLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    OutwardLineCtrl.ePage.Masters.EnableDeleteButton = false;
                }, function () {
                    console.log("Cancelled");
            });
        }
        //#endregion Add,copy,delete row

        //#region General Functions
        function FetchQuantity(item, index) {
            if (item.PAC_PackType == item.StockKeepingUnit) {
                item.Units = item.Packs;
                OnChangeValues(item.Units, "E3520", true, index);
            } else {
                var _input = {
                    "OSP_FK": item.PRO_FK,
                    "FromPackType": item.PAC_PackType,
                    "ToPackType": item.StockKeepingUnit,
                    "Quantity": item.Packs
                };
                if (item.PRO_FK && item.PAC_PackType && item.StockKeepingUnit && item.Packs) {
                    OutwardLineCtrl.ePage.Masters.Loading = true;
                    apiService.post("eAxisAPI",appConfig.Entities.PrdProductUnit.API.FetchQuantity.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            item.Units = response.data.Response;
                            OutwardLineCtrl.ePage.Masters.Loading = false;
                            OnChangeValues(item.Units, "E3520", true, index);
                        }
                    });
                }
            }
        }
        //#endregion
        
        function GetDocumentInputValues(value){
            OutwardLineCtrl.ePage.Masters.DocumentInput = '';
            OutwardLineCtrl.ePage.Masters.DocumentInput = {
                // Entity
                "ParentEntityRefKey": value.PK,
                "ParentEntityRefCode": value.ProductCode,
                "ParentEntitySource": "WOL",
                // Parent Entity
                "EntityRefKey": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PK,
                "EntityRefCode": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderID,
                "EntitySource": "ORD",
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "RowObj": undefined,
                "Config": undefined,
                "Entity": "WarehouseOutward"
            };
        }
        
        //#region Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(OutwardLineCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                OutwardLineCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, OutwardLineCtrl.currentOutward.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                OutwardLineCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, OutwardLineCtrl.currentOutward.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function RemoveAllLineErrors(){
            for(var i=0;i<OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length;i++){
                OnChangeValues('value', "E3504", true, i);
                OnChangeValues('value', "E3505", true, i);
                OnChangeValues('value', "E3506", true, i);
                OnChangeValues('value', "E3520", true, i);
                OnChangeValues('value', "E3521", true, i);
                OnChangeValues('value', "E3530", true, i);
                OnChangeValues('value', 'E3531', true, i);
            }
            return true;
        }
        //#endregion

        Init();

    }

})();