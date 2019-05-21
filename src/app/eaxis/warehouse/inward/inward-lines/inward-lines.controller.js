(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InwardLinesController", InwardLinesController);

    InwardLinesController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "inwardConfig", "helperService", "$uibModal", "$http", "$document", "appConfig", "authService", "$location", "toastr", "confirmation", "$state", "$q","$filter"];

    function InwardLinesController($scope, $timeout, APP_CONSTANT, apiService, inwardConfig, helperService, $uibModal, $http, $document, appConfig, authService, $location, toastr, confirmation, $state, $q, $filter) {

        var InwardLinesCtrl = this;
        function Init() {
            var currentInward = InwardLinesCtrl.currentInward[InwardLinesCtrl.currentInward.label].ePage.Entities;
            InwardLinesCtrl.ePage = {
                "Title": "",
                "Prefix": "Inward_Line",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentInward,
            };

            InwardLinesCtrl.ePage.Masters.Config = inwardConfig;
              //For table
            InwardLinesCtrl.ePage.Masters.SelectAll = false;
            InwardLinesCtrl.ePage.Masters.EnableDeleteButton = false;
            InwardLinesCtrl.ePage.Masters.EnableCopyButton = false;
            InwardLinesCtrl.ePage.Masters.Enable = true;
            InwardLinesCtrl.ePage.Masters.selectedRow = -1;
            InwardLinesCtrl.ePage.Masters.emptyText = '-';
            InwardLinesCtrl.ePage.Masters.SearchTable = '';

            InwardLinesCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            InwardLinesCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            InwardLinesCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            InwardLinesCtrl.ePage.Masters.AddNewRow = AddNewRow;
            InwardLinesCtrl.ePage.Masters.CopyRow = CopyRow;
            InwardLinesCtrl.ePage.Masters.RemoveRow = RemoveRow;

            InwardLinesCtrl.ePage.Masters.DropDownMasterList = {};
            InwardLinesCtrl.ePage.Masters.AllocateLocationText = "Allocate Location";
            InwardLinesCtrl.ePage.Masters.IsAllocate = true;

            // DatePicker
            InwardLinesCtrl.ePage.Masters.DatePicker = {};
            InwardLinesCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            InwardLinesCtrl.ePage.Masters.DatePicker.isOpen = [];
            InwardLinesCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            InwardLinesCtrl.ePage.Masters.AllocateLocation = AllocateLocation;
            InwardLinesCtrl.ePage.Masters.SelectedLookupProduct = SelectedLookupProduct;
            InwardLinesCtrl.ePage.Masters.SelectedLookupLocation = SelectedLookupLocation;
            InwardLinesCtrl.ePage.Masters.FetchQuantity = FetchQuantity;
            InwardLinesCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            InwardLinesCtrl.ePage.Masters.UDF = UDF;
            InwardLinesCtrl.ePage.Masters.GetPercentageValues = GetPercentageValues;
            InwardLinesCtrl.ePage.Masters.GetDocumentInputValues = GetDocumentInputValues;
            InwardLinesCtrl.ePage.Masters.LocalSearchLengthCalculation = LocalSearchLengthCalculation;

            //Pagination
            InwardLinesCtrl.ePage.Masters.Pagination = {};
            InwardLinesCtrl.ePage.Masters.Pagination.CurrentPage = 1;
            InwardLinesCtrl.ePage.Masters.Pagination.MaxSize = 3;
            InwardLinesCtrl.ePage.Masters.Pagination.ItemsPerPage = 25;
            InwardLinesCtrl.ePage.Masters.PaginationChange = PaginationChange;
            InwardLinesCtrl.ePage.Masters.Pagination.LocalSearchLength = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length;

            InwardLinesCtrl.ePage.Masters.CurrentPageStartingIndex = (InwardLinesCtrl.ePage.Masters.Pagination.ItemsPerPage)*(InwardLinesCtrl.ePage.Masters.Pagination.CurrentPage-1)

            GetUserBasedGridColumList();
            GetDropdownList();
            GetPercentageValues();
            GetAllDetails();
            InitDocuments();

            // Watch when Line length changes
            $scope.$watch('InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length', function(val)
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
                "EntitySource": "WMS_INWARDRECEIVELINE",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function(response){
                if(response.data.Response[0]){
                    InwardLinesCtrl.ePage.Masters.UserValue= response.data.Response[0];
                    if(response.data.Response[0].Value!=''){
                        var obj = JSON.parse(response.data.Response[0].Value)
                        InwardLinesCtrl.ePage.Entities.Header.TableProperties.UIWmsWorkOrderLine = obj;
                        InwardLinesCtrl.ePage.Masters.UserHasValue =true;
                    }
                }else{
                    InwardLinesCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }
        //#endregion
        
        //#region GetPercentage Values
        function GetPercentageValues() {
            InwardLinesCtrl.ePage.Masters.TotalLineUnits = 0;
            InwardLinesCtrl.ePage.Masters.TotalLinePackagesSent = 0;
            InwardLinesCtrl.ePage.Masters.TotalLinePallets = 0;
            InwardLinesCtrl.ePage.Masters.TotalLineWeight = 0;
            InwardLinesCtrl.ePage.Masters.TotalLineVolume = 0;
            InwardLinesCtrl.ePage.Masters.LineWeight = 0;
            InwardLinesCtrl.ePage.Masters.LineVolume = 0;

            angular.forEach(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, function (value, key) {
                InwardLinesCtrl.ePage.Masters.TotalLineUnits = InwardLinesCtrl.ePage.Masters.TotalLineUnits + parseFloat(value.Units);
                InwardLinesCtrl.ePage.Masters.TotalLinePackagesSent = InwardLinesCtrl.ePage.Masters.TotalLinePackagesSent + parseFloat(value.Packs);
                InwardLinesCtrl.ePage.Masters.LineWeight = parseFloat(value.Weight) * parseFloat(value.Units);
                InwardLinesCtrl.ePage.Masters.LineVolume = parseFloat(value.Volume) * parseFloat(value.Units);
                InwardLinesCtrl.ePage.Masters.TotalLineWeight = InwardLinesCtrl.ePage.Masters.TotalLineWeight + InwardLinesCtrl.ePage.Masters.LineWeight;
                InwardLinesCtrl.ePage.Masters.TotalLineVolume = InwardLinesCtrl.ePage.Masters.TotalLineVolume + InwardLinesCtrl.ePage.Masters.LineVolume;
            });

            //To find Percentage for Units
            if (parseFloat(InwardLinesCtrl.ePage.Masters.TotalLineUnits) > parseFloat(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalUnits)) {
                InwardLinesCtrl.ePage.Masters.TotalLineUnitsPercentage = 100;
                InwardLinesCtrl.ePage.Masters.TotalUnitsPercentage = ((parseFloat(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalUnits) / parseFloat(InwardLinesCtrl.ePage.Masters.TotalLineUnits)) * 100)
            }
            else if (parseFloat(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalUnits) > parseFloat(InwardLinesCtrl.ePage.Masters.TotalLineUnits)) {
                InwardLinesCtrl.ePage.Masters.TotalUnitsPercentage = 100;
                InwardLinesCtrl.ePage.Masters.TotalLineUnitsPercentage = ((parseFloat(InwardLinesCtrl.ePage.Masters.TotalLineUnits) / parseFloat(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalUnits)) * 100)
            }
            else if ((parseFloat(InwardLinesCtrl.ePage.Masters.TotalLineUnits) == parseFloat(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalUnits)) && parseFloat(InwardLinesCtrl.ePage.Masters.TotalLineUnits) != 0) {
                InwardLinesCtrl.ePage.Masters.TotalUnitsPercentage = 100;
                InwardLinesCtrl.ePage.Masters.TotalLineUnitsPercentage = 100;
            }
            else {
                InwardLinesCtrl.ePage.Masters.TotalUnitsPercentage = 0;
                InwardLinesCtrl.ePage.Masters.TotalLineUnitsPercentage = 0;
            }

            //To find Percentage for Packages
            if (parseFloat(InwardLinesCtrl.ePage.Masters.TotalLinePackagesSent) > parseFloat(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PackagesSent)) {
                InwardLinesCtrl.ePage.Masters.TotalLinePackagesSentPercentage = 100;
                InwardLinesCtrl.ePage.Masters.TotalPackagesSentPercentage = ((parseFloat(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PackagesSent) / parseFloat(InwardLinesCtrl.ePage.Masters.TotalLinePackagesSent)) * 100)
            }
            else if (parseFloat(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PackagesSent) > parseFloat(InwardLinesCtrl.ePage.Masters.TotalLinePackagesSent)) {
                InwardLinesCtrl.ePage.Masters.TotalPackagesSentPercentage = 100;
                InwardLinesCtrl.ePage.Masters.TotalLinePackagesSentPercentage = ((parseFloat(InwardLinesCtrl.ePage.Masters.TotalLinePackagesSent) / parseFloat(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PackagesSent)) * 100)
            }
            else if ((parseFloat(InwardLinesCtrl.ePage.Masters.TotalLinePackagesSent) == parseFloat(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PackagesSent)) && parseFloat(InwardLinesCtrl.ePage.Masters.TotalLinePackagesSent) != 0) {
                InwardLinesCtrl.ePage.Masters.TotalPackagesSentPercentage = 100;
                InwardLinesCtrl.ePage.Masters.TotalLinePackagesSentPercentage = 100;
            }
            else {
                InwardLinesCtrl.ePage.Masters.TotalPackagesSentPercentage = 0;
                InwardLinesCtrl.ePage.Masters.TotalLinePackagesSentPercentage = 0;
            }

            //To find Pallet percentage and value

            var PalletValue = _.groupBy(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, "PalletID")
            for (var prop in PalletValue) {
                if (prop && prop != 'null' && prop != 'undefined') {
                    if (PalletValue.hasOwnProperty(prop)) {
                        InwardLinesCtrl.ePage.Masters.TotalLinePallets++;
                    }
                }
            }

            if (parseFloat(InwardLinesCtrl.ePage.Masters.TotalLinePallets) > parseFloat(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalPallets)) {
                InwardLinesCtrl.ePage.Masters.TotalLinePalletsPercentage = 100;
                InwardLinesCtrl.ePage.Masters.TotalPalletsPercentage = ((parseFloat(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalPallets) / parseFloat(InwardLinesCtrl.ePage.Masters.TotalLinePallets)) * 100)
            }
            else if (parseFloat(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalPallets) > parseFloat(InwardLinesCtrl.ePage.Masters.TotalLinePallets)) {
                InwardLinesCtrl.ePage.Masters.TotalPalletsPercentage = 100;
                InwardLinesCtrl.ePage.Masters.TotalLinePalletsPercentage = ((parseFloat(InwardLinesCtrl.ePage.Masters.TotalLinePallets) / parseFloat(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalPallets)) * 100)
            }
            else if ((parseFloat(InwardLinesCtrl.ePage.Masters.TotalLinePallets) == parseFloat(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalPallets)) && parseFloat(InwardLinesCtrl.ePage.Masters.TotalLinePallets) != 0) {
                InwardLinesCtrl.ePage.Masters.TotalPalletsPercentage = 100;
                InwardLinesCtrl.ePage.Masters.TotalLinePalletsPercentage = 100;
            }
            else {
                InwardLinesCtrl.ePage.Masters.TotalPalletsPercentage = 0;
                InwardLinesCtrl.ePage.Masters.TotalLinePalletsPercentage = 0;
            }
            InwardLinesCtrl.ePage.Entities.Header.GlobalVariables.PercentageValues = false;
        }
        //#endregion

        //#region  General
        function GetAllDetails() {
            var myData = true;
            angular.forEach(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, function (value, key) {
                value.LocationType = 'DDA';

                if (value.MCC_NKCommodityCode == null)
                    value.MCC_NKCommodityCode = '';

                if (value.MCC_NKCommodityDesc == null)
                    value.MCC_NKCommodityDesc = '';

                value.Commodity = value.MCC_NKCommodityCode + ' - ' + value.MCC_NKCommodityDesc;

                if (value.Commodity == ' - ')
                    value.Commodity = '';

                value.ORG_ClientCode = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode;
                value.ORG_ClientName = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName;
                value.Client_FK = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK;

                value.WAR_WarehouseCode = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode;
                value.WAR_WarehouseName = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseName;
                value.WAR_FK = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WAR_FK;

                if (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client) {
                    value.Client = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode;
                    value.ClientRelationship = "OWN";
                }

                if(!value.PRO_FK && value.ProductCode){
                    myData = false;
                }
            }); 
            //Order By
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine = $filter('orderBy')(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, 'CreatedDateTime');
            
            if(myData==false){
                InwardLinesCtrl.ePage.Masters.Config.GeneralValidation(InwardLinesCtrl.currentInward);
            }
        }


        //#region  Bulk Upload
        function InitDocuments() {
            InwardLinesCtrl.ePage.Masters.Documents = {};
            InwardLinesCtrl.ePage.Masters.Documents.Autherization = authService.getUserInfo().AuthToken;
            InwardLinesCtrl.ePage.Masters.Documents.fileDetails = [];
            InwardLinesCtrl.ePage.Masters.Documents.fileSize = 10;
            InwardLinesCtrl.ePage.Entities.Entity = 'InwardReceiveLines';
            InwardLinesCtrl.ePage.Entities.EntityRefCode = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderID;

            var _additionalValue = {
                "Entity": InwardLinesCtrl.ePage.Entities.Entity,
                "Path": InwardLinesCtrl.ePage.Entities.Entity + "," + InwardLinesCtrl.ePage.Entities.EntityRefCode
            };

            InwardLinesCtrl.ePage.Masters.Documents.AdditionalValue = JSON.stringify(_additionalValue);
            InwardLinesCtrl.ePage.Masters.Documents.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.UploadExcel.Url;

            InwardLinesCtrl.ePage.Masters.Documents.GetUploadedFiles = GetUploadedFiles;
            InwardLinesCtrl.ePage.Masters.Documents.GetSelectedFiles = GetSelectedFiles;
            InwardLinesCtrl.ePage.Masters.Documents.DownloadReport = DownloadReport;
        }

        function GetUploadedFiles(Files, docType, mode) {
            if(Files){
                BulkUpload(Files);
            }
        }
        
        function GetSelectedFiles(Files, docType, mode, row){
            InwardLinesCtrl.ePage.Masters.Loading = true;
        }

        function DownloadReport(){
            InwardLinesCtrl.ePage.Masters.Loading = true;
            apiService.get("eAxisAPI", appConfig.Entities.DMS.API.DownloadTemplate.Url + "/ReceiveLineBulkUpload").then(function (response) {
                InwardLinesCtrl.ePage.Masters.Loading = false;
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        var obj={
                           "Base64str" :response.data.Response,
                           "Name":'ReceiveLineBulkUpload.xlsx'
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
                InwardLinesCtrl.ePage.Masters.Loading =false;
                toastr.warning('Upload Excel With Product Details');
            }else{
                var obj={
                    "LineType":"UIWmsWorkOrderLine",
                    "WmsWorkOrder":{
                        "WorkOrderID":InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderID,
                        "WarehouseCode":InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode,
                        "ClientCode":InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode
                    },
                    "WmsInsertLineRecordsList":''
                }
                obj.WmsInsertLineRecordsList = item;
    
                apiService.post("eAxisAPI", InwardLinesCtrl.ePage.Entities.Header.API.InsertReceiveLine.Url, obj).then(function (response){
                    InwardLinesCtrl.ePage.Masters.Loading = false;
                    if(response.data.Response){
                        angular.forEach(response.data.Response,function(value,key){
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
                            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.push(value);
                        });
                        
                        GetAllDetails();
                    }else{
                        toastr.error("Upload Failed");
                    }
                });
            }
        }
        //#endregion

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            InwardLinesCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetDropdownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["INW_LINE_HELDCODE", "INW_LINE_UQ", "ProductCondition"];
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
                        InwardLinesCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        InwardLinesCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        //#endregion

        //#region Selectedlookups
        function SelectedLookupProduct(item, index) {
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PRO_FK = item.OSP_FK;


            if (item.MCC_NKCommodityCode == null)
                item.MCC_NKCommodityCode = '';

            if (item.MCC_NKCommodityDesc == null)
                item.MCC_NKCommodityDesc = '';

            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].Commodity = item.MCC_NKCommodityCode + ' - ' + item.MCC_NKCommodityDesc;

            //To remove Attributes when copy row
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PartAttrib1='';
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PartAttrib2='';
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PartAttrib3='';
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PackingDate='';
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].ExpiryDate='';
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].Units = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].Packs;
            
            OnChangeValues(item.ProductCode, 'E3008', true, index);
            OnChangeValues(item.StockKeepingUnit, "E3033", true, index);
            OnChangeValues('value', "E3046", true, index);
        }

        function SelectedLookupLocation(item, index) {
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WLO_FK = item.PK;
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WRO_Name = item.WRO_Name;
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WLO_Level = item.Level;
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WLO_Column = item.Column;
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WLO_Location = item.Location;
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WAA_AreaType = item.WAA_AreaType;
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WAA_Name = item.WAA_Name;
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WLO_LocationStatus = item.LocationStatus;
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WLO_LocationStatusDescription = item.LocationStatusDescription;
            OnChangeValues('value', "E3047", true, index);
        }
        //#endregion

        //#region Validation

        function UDF(item, index) {
            if (!item.IsPartAttrib1ReleaseCaptured) {
                if (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib1Type == "SER" && item.UsePartAttrib1 || InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib1Type == "MAN" && item.UsePartAttrib1 || InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib1Type == "BAT" && item.UsePartAttrib1) {
                    if (!item.PartAttrib1)
                        OnChangeValues(null, 'E3018', true, index);
                    else
                        OnChangeValues('value', 'E3018', true, index);
                }
            }
            if (!item.IsPartAttrib2ReleaseCaptured) {
                if (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib2Type == "SER" && item.UsePartAttrib2 || InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib2Type == "MAN" && item.UsePartAttrib2 || InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib2Type == "BAT" && item.UsePartAttrib2) {
                    if (!item.PartAttrib2)
                        OnChangeValues(null, 'E3019', true, index);
                    else
                        OnChangeValues('value', 'E3019', true, index);
                }
            }
            if (!item.IsPartAttrib3ReleaseCaptured) {
                if (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib3Type == "SER" && item.UsePartAttrib3 || InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib3Type == "MAN" && item.UsePartAttrib3 || InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib3Type == "BAT" && item.UsePartAttrib3) {
                    if (!item.PartAttrib3)
                        OnChangeValues(null, 'E3020', true, index);
                    else
                        OnChangeValues('value', 'E3020', true, index);
                }
            }
            if (item.UsePackingDate) {
                if (!item.PackingDate)
                    OnChangeValues(null, 'E3035', true, index);
                else
                    OnChangeValues('value', 'E3035', true, index);
            }
            if (item.UseExpiryDate) {
                if (!item.ExpiryDate)
                    OnChangeValues(null, 'E3036', true, index);
                else
                    OnChangeValues('value', 'E3036', true, index);
            }

        }
        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(InwardLinesCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                InwardLinesCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, InwardLinesCtrl.currentInward.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                InwardLinesCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, InwardLinesCtrl.currentInward.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function RemoveAllLineErrors() {
            for (var i = 0; i < InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length; i++) {
                OnChangeValues('value', "E3008", true, i);
                OnChangeValues('value', "E3009", true, i);
                OnChangeValues('value', "E3010", true, i);
                OnChangeValues('value', "E3018", true, i);
                OnChangeValues('value', "E3019", true, i);
                OnChangeValues('value', "E3020", true, i);
                OnChangeValues('value', "E3021", true, i);
                OnChangeValues('value', "E3022", true, i);
                OnChangeValues('value', "E3023", true, i);
                OnChangeValues('value', "E3032", true, i);
                OnChangeValues('value', "E3033", true, i);
                OnChangeValues('value', "E3035", true, i);
                OnChangeValues('value', "E3036", true, i);
                OnChangeValues('value', "E3038", true, i);
                OnChangeValues('value', "E3046", true, i);
                OnChangeValues('value', "E3047", true, i);
                OnChangeValues('value', 'E3049', true, i);
                OnChangeValues('value', 'E3063', true, i);
            }
            return true;
        }
        //#endregion

        //#region checkbox selection
        function SelectAllCheckBox(){
            angular.forEach(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, function (value, key) {
                var startData = InwardLinesCtrl.ePage.Masters.CurrentPageStartingIndex
                var LastData = InwardLinesCtrl.ePage.Masters.CurrentPageStartingIndex + (InwardLinesCtrl.ePage.Masters.Pagination.ItemsPerPage);
                   
                if (InwardLinesCtrl.ePage.Masters.SelectAll){

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

            var Checked1 = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                InwardLinesCtrl.ePage.Masters.EnableDeleteButton = true;
                InwardLinesCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                InwardLinesCtrl.ePage.Masters.EnableDeleteButton = false;
                InwardLinesCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }

        function SingleSelectCheckBox() {
            var startData = InwardLinesCtrl.ePage.Masters.CurrentPageStartingIndex
            var LastData = InwardLinesCtrl.ePage.Masters.CurrentPageStartingIndex + (InwardLinesCtrl.ePage.Masters.Pagination.ItemsPerPage);
                   
            var Checked = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.some(function (value, key) {
              // Enable and disable based on page wise
                if((key>=startData) && (key<LastData)){
                    if(!value.SingleSelect)
                    return true;
                }
            });
            if (Checked) {
                InwardLinesCtrl.ePage.Masters.SelectAll = false;
            } else {
                InwardLinesCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                InwardLinesCtrl.ePage.Masters.EnableDeleteButton = true;
                InwardLinesCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                InwardLinesCtrl.ePage.Masters.EnableDeleteButton = false;
                InwardLinesCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }

        function PaginationChange(){
            InwardLinesCtrl.ePage.Masters.CurrentPageStartingIndex = (InwardLinesCtrl.ePage.Masters.Pagination.ItemsPerPage)*(InwardLinesCtrl.ePage.Masters.Pagination.CurrentPage-1)
            SingleSelectCheckBox();
        }

        //Required this function when pagination and local search both are used
        function LocalSearchLengthCalculation(){
            var myData = $filter('filter')(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, InwardLinesCtrl.ePage.Masters.SearchTable);
            InwardLinesCtrl.ePage.Masters.Pagination.LocalSearchLength = myData.length;
        }
        
        //#endregion checkbox selection

        //#region Add,copy,delete row

        function setSelectedRow(index){
            InwardLinesCtrl.ePage.Masters.selectedRow = index;
        }

        function AddNewRow() {
            if (!InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ArrivalDate){
                OnChangeValues(null, "E3034", false, undefined);
                InwardLinesCtrl.ePage.Masters.Config.ShowErrorWarningModal(InwardLinesCtrl.currentInward);
            }else{
                InwardLinesCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
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
                    "PartAttrib1": "",
                    "PartAttrib2": "",
                    "PartAttrib3": "",
                    "LocationType": "",
                    "PalletID": "",
                    "OriginalInventoryStatus": "",
                    "OriginalInventoryStatusDesc": "",
                    "PackingDate": "",
                    "ExpiryDate": "",
                    "AdditionalRef1Code":"",
                    "WRO_Name": "",
                    "WLO_Location": "",
                    "WLO_Column": "",
                    "WLO_Level": "",
                    "WAA_AreaType": "",
                    "WAA_Name": "",
                    "WLO_LocationStatus":"",
                    "WLO_LocationStatusDescription":"",
                    "TransferFromDockDoor": "",
                    "LineComment":"",
                    "UseExpiryDate": false,
                    "UsePackingDate": false,
                    "UsePartAttrib1": false,
                    "UsePartAttrib2": false,
                    "UsePartAttrib3": false,
                    "IsPartAttrib1ReleaseCaptured": false,
                    "IsPartAttrib2ReleaseCaptured": false,
                    "IsPartAttrib3ReleaseCaptured": false,
                    "IsModified": false,

                    "IsDeleted": false,
                    "ORG_ClientCode": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode,
                    "ORG_ClientName": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName,
                    "Client_FK": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK,

                    "WAR_WarehouseCode": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode,
                    "WAR_WarehouseName": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseName,
                    "WAR_FK": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WAR_FK,
                };

                if (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client) {
                    obj.Client = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode;
                    obj.ClientRelationship = "OWN";
                }
                InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.push(obj);
                InwardLinesCtrl.ePage.Masters.selectedRow = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length-1;
                OnChangeValues('value', "E3034", false, undefined);

                $timeout(function () {
                    var objDiv = document.getElementById("InwardLinesCtrl.ePage.Masters.AddScroll");
                    objDiv.scrollTop = objDiv.scrollHeight;
                }, 50);
                InwardLinesCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
            }
        };

        function CopyRow() {
            if (!InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ArrivalDate){
                OnChangeValues(null, "E3034", false, undefined);
                InwardLinesCtrl.ePage.Masters.Config.ShowErrorWarningModal(InwardLinesCtrl.currentInward);
            }else{
                InwardLinesCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                for(var i = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length -1; i >= 0; i--){
                    if(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[i].SingleSelect){
                        var item = angular.copy(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[i]);
                        var obj = {
                            "PK": "",
                            "ProductCode":item.ProductCode,
                            "ProductDescription": item.ProductDescription,
                            "PRO_FK": item.PRO_FK,
                            "Commodity": item.Commodity,
                            "MCC_NKCommodityCode": item.MCC_NKCommodityCode,
                            "MCC_NKCommodityDesc": item.MCC_NKCommodityDesc,
                            "Packs": item.Packs,
                            "PAC_PackType": item.PAC_PackType,
                            "Units": item.Units,
                            "StockKeepingUnit": item.StockKeepingUnit,
                            "ProductCondition": item.ProductCondition,
                            "PartAttrib1": item.PartAttrib1,
                            "PartAttrib2": item.PartAttrib2,
                            "PartAttrib3": item.PartAttrib3,
                            "LocationType": item.LocationType,
                            "PalletID": item.PalletID,
                            "LineComment":item.LineComment,
                        
                            "PackingDate": item.PackingDate,
                            "ExpiryDate": item.ExpiryDate,
                            "AdditionalRef1Code":item.AdditionalRef1Code,
                            "WRO_Name": item.WRO_Name,
                            "WLO_Location": item.WLO_Location,
                            "WLO_FK":item.WLO_FK,
                            "WLO_Column": item.WLO_Column,
                            "WLO_Level": item.WLO_Level,
                            "WAA_AreaType": item.WAA_AreaType,
                            "WAA_Name": item.WAA_Name,
                            "WLO_LocationStatus":item.WLO_LocationStatus,
                            "WLO_LocationStatusDescription":item.WLO_LocationStatusDescription,
                            "UseExpiryDate": item.UseExpiryDate,
                            "UsePackingDate": item.UsePackingDate,
                            "UsePartAttrib1": item.UsePartAttrib1,
                            "UsePartAttrib2": item.UsePartAttrib2,
                            "UsePartAttrib3": item.UsePartAttrib3,
                            "IsPartAttrib1ReleaseCaptured": item.IsPartAttrib1ReleaseCaptured,
                            "IsPartAttrib2ReleaseCaptured": item.IsPartAttrib2ReleaseCaptured,
                            "IsPartAttrib3ReleaseCaptured": item.IsPartAttrib3ReleaseCaptured,
        
                            "IsDeleted": false,
                            "IsCopied": true,
                            "ORG_ClientCode": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode,
                            "ORG_ClientName": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName,
                            "Client_FK": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK,
        
                            "WAR_WarehouseCode": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode,
                            "WAR_WarehouseName": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseName,
                            "WAR_FK": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WAR_FK,
                        };
        
                        if (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client) {
                            obj.Client = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode;
                            obj.ClientRelationship = "OWN";
                        }
                        InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.splice(i + 1, 0, obj);
                    }
                }
                OnChangeValues("value", "E3034", false, undefined);
                InwardLinesCtrl.ePage.Masters.selectedRow = -1;
                InwardLinesCtrl.ePage.Masters.SelectAll = false;
                InwardLinesCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
            }
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
                    InwardLinesCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

                    angular.forEach(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine,function(value,key){
                        if(value.SingleSelect==true && value.PK){
                            apiService.get("eAxisAPI", InwardLinesCtrl.ePage.Entities.Header.API.LineDelete.Url + value.PK).then(function (response) {
                            });
                        }
                    });
            
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        for (var i = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length -1; i >= 0; i--){
                            if(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[i].SingleSelect==true)
                            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.splice(i,1);
                        }
                        InwardLinesCtrl.ePage.Masters.Config.GeneralValidation(InwardLinesCtrl.currentInward);
                    }
                    toastr.success('Record Removed Successfully');
                    GetPercentageValues();
                    InwardLinesCtrl.ePage.Masters.selectedRow = -1;
                    InwardLinesCtrl.ePage.Masters.SelectAll = false;
                    InwardLinesCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    InwardLinesCtrl.ePage.Masters.EnableDeleteButton = false;
                }, function () {
                    console.log("Cancelled");
            });
        }
        //#endregion Add,copy,delete row

        //#region  General Functions
        function FetchQuantity(item, index) {
            if (item.PAC_PackType == item.StockKeepingUnit) {
                item.Units = item.Packs;
                OnChangeValues(item.Units, "E3032", true, index);
            } else {
                var _input = {
                    "OSP_FK": item.PRO_FK,
                    "FromPackType": item.PAC_PackType,
                    "ToPackType": item.StockKeepingUnit,
                    "Quantity": item.Packs
                };
                if (item.PRO_FK && item.PAC_PackType && item.StockKeepingUnit && item.Packs) {
                    InwardLinesCtrl.ePage.Masters.Loading = true;
                    apiService.post("eAxisAPI", appConfig.Entities.PrdProductUnit.API.FetchQuantity.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            item.Units = response.data.Response;
                            InwardLinesCtrl.ePage.Masters.Loading = false;
                            OnChangeValues(item.Units, "E3032", true, index);
                        }
                    });
                }
            }
            if ((InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib1Type == "SER" && item.UsePartAttrib1 && !item.IsPartAttrib1ReleaseCaptured) || (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib2Type == "SER" && item.UsePartAttrib2 && !item.IsPartAttrib2ReleaseCaptured) || (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib3Type == "SER" && item.UsePartAttrib3 && !item.IsPartAttrib3ReleaseCaptured)) {
                if (parseFloat(item.Units) != 1) {
                    OnChangeValues(null, "E3038", true, InwardLinesCtrl.ePage.Masters.selectedRow);
                } else if (parseFloat(item.Units) == 1) {
                    OnChangeValues('value', "E3038", true, InwardLinesCtrl.ePage.Masters.selectedRow);
                }
            }

            if ((InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib1Type == "SER" &&(item.UsePartAttrib1 || item.IsPartAttrib1ReleaseCaptured)) || (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib2Type == "SER" &&(item.UsePartAttrib2 || item.IsPartAttrib2ReleaseCaptured)) || (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib3Type == "SER" &&(item.UsePartAttrib3 || item.IsPartAttrib3ReleaseCaptured))) {
                if ((parseFloat(item.Units)%1) != 0) {
                    OnChangeValues(null, "E3063", true, InwardLinesCtrl.ePage.Masters.selectedRow);
                } else  {
                    OnChangeValues('value', "E3063", true, InwardLinesCtrl.ePage.Masters.selectedRow);
                }
            }
        }

        function GetDocumentInputValues(value){
            InwardLinesCtrl.ePage.Masters.DocumentInput = '';
            InwardLinesCtrl.ePage.Masters.DocumentInput = {
                // Entity
                "ParentEntityRefKey": value.PK,
                "ParentEntityRefCode": value.ProductCode,
                "ParentEntitySource": "WOL",
                // Parent Entity
                "EntityRefKey": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PK,
                "EntityRefCode": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderID,
                "EntitySource": "INW",
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "RowObj": undefined,
                "Config": undefined,
                "Entity": "WarehouseInward"
            };
        }

        function AllocateLocation() {
            var _input = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine;
            angular.forEach(_input, function (value, key) {
                if (value.PK) {
                    InwardLinesCtrl.ePage.Masters.IsAllocate = true;
                }
                else {
                    InwardLinesCtrl.ePage.Masters.IsAllocate = false;
                }
            });

            if (InwardLinesCtrl.ePage.Masters.IsAllocate == true) {
                if (_input.length != 0) {
                    InwardLinesCtrl.ePage.Masters.AllocateLocationText = "Allocating...";
                    InwardLinesCtrl.ePage.Masters.Loading = true;

                    apiService.post("eAxisAPI", InwardLinesCtrl.ePage.Entities.Header.API.AllocateLocation.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            InwardLinesCtrl.ePage.Masters.AllocateLocationText = "Allocate Location";

                            toastr.info(response.data.Messages[0].MessageDesc)

                            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderStatus = "IAL"
                            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PutOrPickSlipDateTime = new Date();
                            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderStatusDesc = 'Location Allocated';
                            OnChangeValues('value','E3041',false);

                            GetByIDCall();
                        } else {
                            toastr.error("Failed");
                            InwardLinesCtrl.ePage.Masters.Loading = false;
                            InwardLinesCtrl.ePage.Masters.AllocateLocationText = "Allocate Location";
                        }
                    });
                } else {
                    toastr.warning("Receive Line Is Empty");
                }
            } else {
                toastr.warning("Please Save Line Before Allocating Location");
            }
        }

        function GetByIDCall(){
            apiService.get("eAxisAPI", InwardLinesCtrl.ePage.Entities.Header.API.GetByID.Url + InwardLinesCtrl.ePage.Entities.Header.Data.PK).then(function (response) {
                if (response.data.Status == 'Success') {
                    InwardLinesCtrl.ePage.Masters.Loading = false;
                    InwardLinesCtrl.ePage.Entities.Header.Data = response.data.Response;
                    GeneralOperations();
                    GetBindValues();
                    AllocateUDF();
                    GetProductDetails();
                    GetPercentageValues();
                    GetAllDetails();
                    GetContainerlist();
                    GetReferencelist();
                    GetServiceList();
                }
            });
        }

        //#region After GetbyId need to change UI level changes
        function GeneralOperations() {
            //Remove Null Values from data

            if (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode == null) {
                InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode = "";
            }
            if (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseName == null) {
                InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseName = "";
            }
            if (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SER_ServiceLevel == null) {
                InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SER_ServiceLevel = "";
            }
            if (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SER_ServiceLevelDescription == null) {
                InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SER_ServiceLevelDescription = "";
            }
            if (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierCode == null) {
                InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierCode = "";
            }
            if (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierName == null) {
                InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierName = "";
            }

            if (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode == null) {
                InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode = "";
            }
            if (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName == null) {
                InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName = "";
            }

            if(!InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PackagesSent)
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PackagesSent = 0;

            if(!InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalUnits)
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalUnits = 0;

            if(!InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PackagesSent)
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalPallets = 0;

            if(InwardLinesCtrl.currentInward.isNew){
                InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ExternalReference = '';
            }
        }

        function GetBindValues() {

            //Binding of Two values together
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Warehouse = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode + ' - ' + InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseName;
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ServiceLevel = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SER_ServiceLevel + ' - ' + InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SER_ServiceLevelDescription;
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode + ' - ' + InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName;
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Supplier = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierCode + ' - ' + InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierName;
            Removehyphen();
        }

        function Removehyphen() {

            if (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Warehouse == ' - ')
                InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Warehouse = "";

            if (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ServiceLevel == ' - ')
                InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ServiceLevel = "";

            if (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client == ' - ')
                InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client = "";

            if (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Supplier == ' - ')
                InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Supplier = ""
        }

        function AllocateUDF() {
            if(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK){
                var _filter = {
                    "ORG_FK": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK
                };
    
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.OrgMiscServ.API.FindAll.FilterID
                };
    
                apiService.post("eAxisAPI", appConfig.Entities.OrgMiscServ.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib1Name = response.data.Response[0].IMPartAttrib1Name;
                        InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib2Name = response.data.Response[0].IMPartAttrib2Name;
                        InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib3Name = response.data.Response[0].IMPartAttrib3Name;
                        InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib1Type = response.data.Response[0].IMPartAttrib1Type;
                        InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib2Type = response.data.Response[0].IMPartAttrib2Type;
                        InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib3Type = response.data.Response[0].IMPartAttrib3Type;
                    }
                });
            }
        }

        function GetProductDetails() {
            //Get Product Details
            var myData = true;
            angular.forEach(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine, function(value, key) {
                if (value.MCC_NKCommodityCode == null)
                    value.MCC_NKCommodityCode = '';

                if (value.MCC_NKCommodityDesc == null)
                    value.MCC_NKCommodityDesc = '';

                value.Commodity = value.MCC_NKCommodityCode + ' - ' + value.MCC_NKCommodityDesc;

                if (value.Commodity == ' - ')
                    value.Commodity = '';

                value.ORG_ClientCode = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode;
                value.ORG_ClientName = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName;
                value.Client_FK = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK;

                if(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client){
                    value.Client = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode;
                    value.ClientRelationship = "OWN";
                }

                if(!value.POR_FK && value.ProductCode){
                    myData = false;
                }
            });
            //Order By
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine = $filter('orderBy')(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine, 'CreatedDateTime');
            if(myData==false){
                InwardLinesCtrl.ePage.Masters.Config.GeneralValidation(InwardLinesCtrl.currentInward);
            }
        }

        function GetContainerlist() {
            var _filter = {
                "WOD_FK": InwardLinesCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": InwardLinesCtrl.ePage.Entities.Header.API.Containers.FilterID
            };
            apiService.post("eAxisAPI", InwardLinesCtrl.ePage.Entities.Header.API.Containers.Url, _input).then(function (response) {
                if (response.data.Response) {
                    InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer = response.data.Response;

                    InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer = $filter('orderBy')(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer, 'CreatedDateTime');
                }
            });
        }

        function GetReferencelist() {
            var _filter = {
                "WOD_FK": InwardLinesCtrl.ePage.Entities.Header.Data.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": InwardLinesCtrl.ePage.Entities.Header.API.References.FilterID
            };

            apiService.post("eAxisAPI", InwardLinesCtrl.ePage.Entities.Header.API.References.Url, _input).then(function (response) {
                if (response.data.Response) {
                    InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference = response.data.Response;
                    InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference = $filter('orderBy')(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference, 'CreatedDateTime');
                }
            });
        }

        function GetServiceList() {

            var _filter = {
                "ParentID": InwardLinesCtrl.ePage.Entities.Header.Data.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobService.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobService.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    InwardLinesCtrl.ePage.Entities.Header.Data.UIJobServices = response.data.Response;
                    //Order By
                    InwardLinesCtrl.ePage.Entities.Header.Data.UIJobServices = $filter('orderBy')(InwardLinesCtrl.ePage.Entities.Header.Data.UIJobServices, 'CreatedDateTime');

                }
            });
        }

        //#endregion
        //#endregion
       
        Init();
    }

})();