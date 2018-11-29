(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CycleCountLineController", CycleCountLineController);

    CycleCountLineController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "cycleCountConfig", "helperService", "toastr", "$document","confirmation","$filter"];

    function CycleCountLineController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, cycleCountConfig, helperService, toastr, $document,confirmation,$filter) {

        var CycleCountLineCtrl = this;

        function Init() {

            var currentCycleCount = CycleCountLineCtrl.currentCycleCount[CycleCountLineCtrl.currentCycleCount.label].ePage.Entities;

            CycleCountLineCtrl.ePage = {
                "Title": "",
                "Prefix": "CycleCount_Line",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentCycleCount,
            };
            
            //For table
            CycleCountLineCtrl.ePage.Masters.SelectAll = false;
            CycleCountLineCtrl.ePage.Masters.EnableDeleteButton = false;
            CycleCountLineCtrl.ePage.Masters.EnableCopyButton = false;
            CycleCountLineCtrl.ePage.Masters.Enable = true;
            CycleCountLineCtrl.ePage.Masters.selectedRow = -1;
            CycleCountLineCtrl.ePage.Masters.emptyText = '-';
            CycleCountLineCtrl.ePage.Masters.SearchTable = '';

            CycleCountLineCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            CycleCountLineCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            CycleCountLineCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            CycleCountLineCtrl.ePage.Masters.AddNewRow = AddNewRow;
            CycleCountLineCtrl.ePage.Masters.CopyRow = CopyRow;
            CycleCountLineCtrl.ePage.Masters.RemoveRow = RemoveRow;

            // DatePicker
            CycleCountLineCtrl.ePage.Masters.DatePicker = {};
            CycleCountLineCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            CycleCountLineCtrl.ePage.Masters.DatePicker.isOpen = [];
            CycleCountLineCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;


            CycleCountLineCtrl.ePage.Masters.DropDownMasterList = {};

            CycleCountLineCtrl.ePage.Masters.SelectedLookupProduct = SelectedLookupProduct;
            CycleCountLineCtrl.ePage.Masters.SelectedLookupDataClient = SelectedLookupDataClient;
            CycleCountLineCtrl.ePage.Masters.SelectedLookupLocation = SelectedLookupLocation;
            CycleCountLineCtrl.ePage.Masters.OrgPartRelationValues = OrgPartRelationValues;
            CycleCountLineCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            CycleCountLineCtrl.ePage.Masters.Config = cycleCountConfig;
            CycleCountLineCtrl.ePage.Masters.ChangeDateVerified = ChangeDateVerified;
            CycleCountLineCtrl.ePage.Masters.LocalSearchLengthCalculation = LocalSearchLengthCalculation;

            //Pagination
            CycleCountLineCtrl.ePage.Masters.Pagination = {};
            CycleCountLineCtrl.ePage.Masters.Pagination.CurrentPage = 1;
            CycleCountLineCtrl.ePage.Masters.Pagination.MaxSize = 3;
            CycleCountLineCtrl.ePage.Masters.Pagination.ItemsPerPage = 25;
            CycleCountLineCtrl.ePage.Masters.PaginationChange = PaginationChange;
            CycleCountLineCtrl.ePage.Masters.Pagination.LocalSearchLength = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.length;


            CycleCountLineCtrl.ePage.Masters.CurrentPageStartingIndex = (CycleCountLineCtrl.ePage.Masters.Pagination.ItemsPerPage)*(CycleCountLineCtrl.ePage.Masters.Pagination.CurrentPage-1)

            GetLineList();
            GetMastersList();
            GetUserBasedGridColumList();

            // Watch when Line length changes
            $scope.$watch('CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.length', function(val)
            { 
                LocalSearchLengthCalculation();
            });
        }
      
        
        function GetLineList(){
            angular.forEach(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine,function(value,key){
              
                if(value.ClientCode==null){
                    value.ClientCode = '';
                }
                if(value.ClientName==null){
                    value.ClientName = '';
                }
                value.ClientFullName = value.ClientCode+' - '+value.ClientName;

                value.WAR_WarehouseCode = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseCode;
                value.WAR_WarehouseName = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseName;
                value.WAR_FK = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WAR_FK;
                value.SingleSelect = false;
                
                if(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Client){
                    value.Client = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode;
                    value.ClientRelationship = "OWN";
                    
                }
            });
             //Order By
             CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine = $filter('orderBy')(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine, 'CreatedDateTime');

        }

        function ChangeDateVerified(item,index){
            if(parseFloat(item)>=0){
                CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].DateVerified = new Date(); 
            }else{
                CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].DateVerified = ""; 
            }
        }
         // DatePicker
         function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            CycleCountLineCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function SelectedLookupProduct(item,index){
            CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].OSP_FK = item.OSP_FK;
            OnChangeValues(item.ProductCode,'E13003',true,index);
        }

        function SelectedLookupDataClient(item,index){
            CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].ClientFullName = item.Code+' - '+item.FullName;
            CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].Client = item.Code;
            CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].ClientRelationship = 'OWN';
            OnChangeValues(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].ClientFullName,'E13002',true,index);
        }

        function SelectedLookupLocation(item,index){
            CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].Location = item.Location;
            CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].WLO_FK = item.PK;
            CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].AreaName = item.WAA_Name;
            CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].RowName = item.WRO_Name;
            OnChangeValues(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].Location,'E13004',true,index);
        }

        function OrgPartRelationValues(index){
            if(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].Client && CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].ProductCode ){
                CycleCountLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                var _filter = {
                    "ORG_FK": CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].ORG_FK,
                    "OSP_FK": CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].OSP_FK
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.PrdProductRelatedParty.API.FindAll.FilterID
                };
                apiService.post("eAxisAPI", appConfig.Entities.PrdProductRelatedParty.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].UseExpiryDate = response.data.Response[0].UseExpiryDate;
                        CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].UsePackingDate = response.data.Response[0].UsePackingDate;
                        CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].UsePartAttrib1 = response.data.Response[0].UsePartAttrib1;
                        CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].UsePartAttrib2 = response.data.Response[0].UsePartAttrib2;
                        CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].UsePartAttrib3 = response.data.Response[0].UsePartAttrib3;
                        CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].IsPartAttrib1ReleaseCaptured = response.data.Response[0].IsPartAttrib1ReleaseCaptured;
                        CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].IsPartAttrib2ReleaseCaptured = response.data.Response[0].IsPartAttrib2ReleaseCaptured;
                        CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].IsPartAttrib3ReleaseCaptured = response.data.Response[0].IsPartAttrib3ReleaseCaptured;
                        CycleCountLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    }
                });
            }
        }

         // ------- Error Validation While onchanges-----//
         function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(CycleCountLineCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                CycleCountLineCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, CycleCountLineCtrl.currentCycleCount.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
            } else {
                CycleCountLineCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, CycleCountLineCtrl.currentCycleCount.label, IsArray, RowIndex, value.ColIndex);
            }
        }
        

        
        function GetMastersList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["InventoryStatus","ProductCondition"];
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
                        CycleCountLineCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        CycleCountLineCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        //#region User Based Table Column
         function GetUserBasedGridColumList(){
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_CYCLECOUNTLINE",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };
    
            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function(response){
                if(response.data.Response[0]){
                    CycleCountLineCtrl.ePage.Masters.UserValue= response.data.Response[0];
                    if(response.data.Response[0].Value!=''){
                        var obj = JSON.parse(response.data.Response[0].Value)
                        CycleCountLineCtrl.ePage.Entities.Header.TableProperties.UIWmsCycleCountLine = obj;
                        CycleCountLineCtrl.ePage.Masters.UserHasValue =true;
                    }
                }else{
                    CycleCountLineCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }
        //#endregion
        
        //#region checkbox selection
        function SelectAllCheckBox(){
            angular.forEach(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine, function (value, key) {
                var startData = CycleCountLineCtrl.ePage.Masters.CurrentPageStartingIndex
                var LastData = CycleCountLineCtrl.ePage.Masters.CurrentPageStartingIndex + (CycleCountLineCtrl.ePage.Masters.Pagination.ItemsPerPage);
                   
                if (CycleCountLineCtrl.ePage.Masters.SelectAll){
                    // Enable and disable based on page wise
                    if((key>=startData) && (key<LastData)){
                        if(value.Status!='CLO'){
                            value.SingleSelect = true;
                        }
                    }
                }
                else{
                    if((key>=startData) && (key<LastData)){
                        value.SingleSelect = false;
                    }
                }
            });

            var Checked1 = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                CycleCountLineCtrl.ePage.Masters.EnableDeleteButton = true;
                CycleCountLineCtrl.ePage.Masters.EnableCopyButton = true;
                CycleCountLineCtrl.ePage.Masters.EnableCloseLineButton = true;
            } else {
                CycleCountLineCtrl.ePage.Masters.EnableDeleteButton = false;
                CycleCountLineCtrl.ePage.Masters.EnableCopyButton = false;
                CycleCountLineCtrl.ePage.Masters.EnableCloseLineButton = false;
            }
        }

        function SingleSelectCheckBox() {
            var startData = CycleCountLineCtrl.ePage.Masters.CurrentPageStartingIndex
            var LastData = CycleCountLineCtrl.ePage.Masters.CurrentPageStartingIndex + (CycleCountLineCtrl.ePage.Masters.Pagination.ItemsPerPage);
                   
            var Checked = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.some(function (value, key) {
              // Enable and disable based on page wise
                if((key>=startData) && (key<LastData)){
                    if(!value.SingleSelect)
                    return true;
                }
            });
            if (Checked) {
                CycleCountLineCtrl.ePage.Masters.SelectAll = false;
            } else {
                CycleCountLineCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                CycleCountLineCtrl.ePage.Masters.EnableDeleteButton = true;
                CycleCountLineCtrl.ePage.Masters.EnableCopyButton = true;
                CycleCountLineCtrl.ePage.Masters.EnableCloseLineButton = true;
            } else {
                CycleCountLineCtrl.ePage.Masters.EnableDeleteButton = false;
                CycleCountLineCtrl.ePage.Masters.EnableCopyButton = false;
                CycleCountLineCtrl.ePage.Masters.EnableCloseLineButton = false;
            }
        }
        
        function PaginationChange(){
            CycleCountLineCtrl.ePage.Masters.CurrentPageStartingIndex = (CycleCountLineCtrl.ePage.Masters.Pagination.ItemsPerPage)*(CycleCountLineCtrl.ePage.Masters.Pagination.CurrentPage-1)
            SingleSelectCheckBox();
        }

        //Required this function when pagination and local search both are used
        function LocalSearchLengthCalculation(){
            var myData = $filter('filter')(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine, CycleCountLineCtrl.ePage.Masters.SearchTable);
            CycleCountLineCtrl.ePage.Masters.Pagination.LocalSearchLength = myData.length;
        }

        //#endregion checkbox selection

        //#region Add,copy,delete row

        function setSelectedRow(index){
            CycleCountLineCtrl.ePage.Masters.selectedRow = index;
        }

        function AddNewRow() {
            CycleCountLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            var obj = {
                "PK":"",
                "ClientCode": "",
                "ClientName": "",
                "ClientFullName": "",
                "Client":"",
                "ClientRelationship":"",
                "ORG_FK":"",
                "ProductCode": "",
                "ProductDesc": "",
                "OSP_FK":"",
                "Commodity": "",
                "ProductCondition":"",
                "PalletID": "",
                "Location": "",
                "WLO_FK":"",
                "AreaName": "",
                "RowName": "",
                "SystemUnits": "",
                "LastCount": "",
                "CurrentCount":"",
                "DateVerified": "",
                "LineComment": "",
                "Status": "",
                "DateClosed": "",
                "PickMethod": "",
                "InventoryStatus": "AVL",
                "ExpiryDate": "",
                "PackingDate":"",
                "PartAttrib1":"",
                "PartAttrib2":"",
                "PartAttrib3":"",
                "UseExpiryDate": false,
                "UsePackingDate": false,
                "UsePartAttrib1": false,
                "UsePartAttrib2": false,
                "UsePartAttrib3": false,
                "IsPartAttrib1ReleaseCaptured": false,
                "IsPartAttrib2ReleaseCaptured": false,
                "IsPartAttrib3ReleaseCaptured": false,
                "IsDeleted": false,
                "IsManuallyAdded":true,
                "WAR_WarehouseCode":CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseCode,
                "WAR_WarehouseName":CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseName
            };
            if(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Client){
                obj.ClientFullName = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode+' - '+CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientName;
                obj.ClientCode = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode;
                obj.ClientName = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientName;
                obj.ORG_FK = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ORG_FK;
                obj.Client = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode;
                obj.ClientRelationship = "OWN";
            }

            if(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Location){
                obj.Location = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Location;
                obj.WLO_FK = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WLO_FK;
            }

            CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.push(obj);
            CycleCountLineCtrl.ePage.Masters.selectedRow = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.length-1;
        
            $timeout(function () {
                var objDiv = document.getElementById("CycleCountLineCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            CycleCountLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
        };

        function CopyRow() {
            CycleCountLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            for(var i = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.length -1; i >= 0; i--){
                if(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[i].SingleSelect){
                    var item = angular.copy(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[i]);
                    var obj = {
                        "ClientCode": item.ClientCode,
                        "ClientName": item.ClientName,
                        "ClientFullName": item.ClientFullName,
                        "Client":item.Client,
                        "ClientRelationship":item.ClientRelationship,
                        "ORG_FK":item.ORG_FK,
                        "ProductCode": item.ProductCode,
                        "ProductDesc":item.ProductDesc,
                        "OSP_FK":item.OSP_FK,
                        "Commodity": item.Commodity,
                        "ProductCondition":item.ProductCondition,
                        "PalletID": item.PalletID,
                        "Location": item.Location,
                        "WLO_FK":item.WLO_FK,
                        "AreaName": item.AreaName,
                        "RowName": item.RowName,
                        "SystemUnits": item.SystemUnits,
                        "LastCount": item.LastCount,
                        "CurrentCount":item.CurrentCount,
                        "DateVerified": item.DateVerified,
                        "LineComment": item.LineComment,
                        "Status": item.Status,
                        "DateClosed": item.DateClosed,
                        "PickMethod": item.PickMethod,
                        "InventoryStatus": item.InventoryStatus,
                        "ExpiryDate": item.ExpiryDate,
                        "PackingDate":item.PackingDate,
                        "PartAttrib1":item.PartAttrib1,
                        "PartAttrib2":item.PartAttrib2,
                        "PartAttrib3":item.PartAttrib3,
                        "UseExpiryDate": item.UseExpiryDate,
                        "UsePackingDate": item.UsePackingDate,
                        "UsePartAttrib1": item.UsePartAttrib1,
                        "UsePartAttrib2": item.UsePartAttrib2,
                        "UsePartAttrib3": item.UsePartAttrib3,
                        "IsPartAttrib1ReleaseCaptured": item.IsPartAttrib1ReleaseCaptured,
                        "IsPartAttrib2ReleaseCaptured": item.IsPartAttrib2ReleaseCaptured,
                        "IsPartAttrib3ReleaseCaptured": item.IsPartAttrib3ReleaseCaptured,
                        "IsDeleted": false,
                        "IsManuallyAdded":true,
                        "IsCopied":true,
                        "WAR_WarehouseCode":CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseCode,
                        "WAR_WarehouseName":CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseName
                    };
                    if(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Client){
                        obj.ClientFullName = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode+' - '+CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientName;
                        obj.ClientCode = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode;
                        obj.ClientName = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientName;
                        obj.ORG_FK = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ORG_FK;
                        obj.Client = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode;
                        obj.ClientRelationship = "OWN";
                    }
        
                    if(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Location){
                        obj.Location = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Location;
                        obj.WLO_FK = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WLO_FK;
                    }
                    CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.splice(i + 1, 0, obj);
                }
            }
            CycleCountLineCtrl.ePage.Masters.selectedRow = -1;
            CycleCountLineCtrl.ePage.Masters.SelectAll = false;
            CycleCountLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
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
                    CycleCountLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                    var LoopPromises = [];

                    angular.forEach(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine,function(value,key){
                        var def = $q.defer();
                        if(value.SingleSelect==true && value.PK){
                            LoopPromises.push(def.promise);
                            apiService.get("eAxisAPI", CycleCountLineCtrl.ePage.Entities.Header.API.LineDelete.Url + value.PK).then(function (response) {
                                if(response.data.Status=="Success"){
                                    def.resolve("Success");
                                }else{
                                    def.resolve("Failed");
                                }
                            });
                        }
                    });
            
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        for (var i = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.length -1; i >= 0; i--){
                            if(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[i].SingleSelect==true)
                            CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.splice(i,1);
                        }
                        CycleCountLineCtrl.ePage.Masters.Config.GeneralValidation(CycleCountLineCtrl.currentCycleCount);
                    }

                    // $q.all will invoke when all loopromises get resolved
                    $q.all(LoopPromises).then(function (response) {
                        if(response.length>0){
                            var myData = response.some(function(value,key){
                                return value=="Failed";
                            });
                        }

                        if(myData==false){
                            toastr.success('Record Removed Successfully'); 
                            CycleCountLineCtrl.ePage.Masters.selectedRow = -1;
                            CycleCountLineCtrl.ePage.Masters.SelectAll = false;
                            CycleCountLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                            CycleCountLineCtrl.ePage.Masters.EnableDeleteButton = false;
                            CycleCountLineCtrl.ePage.Masters.EnableCloseLineButton = false; 
                        }else if(myData==true){
                            // getByIdCall
                            apiService.get("eAxisAPI", cycleCountConfig.Entities.Header.API.GetByID.Url + CycleCountLineCtrl.ePage.Entities.Header.Data.PK).then(function(response){
                                CycleCountLineCtrl.ePage.Entities.Header.Data = response.data.Response;
                                toastr.error('Some Records are not deleted'); 
                                CycleCountLineCtrl.ePage.Masters.selectedRow = -1;
                                CycleCountLineCtrl.ePage.Masters.SelectAll = false;
                                CycleCountLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                                CycleCountLineCtrl.ePage.Masters.EnableDeleteButton = false;
                                CycleCountLineCtrl.ePage.Masters.EnableCloseLineButton = false;
                                AfterGetByIdCall();
                            });
                        }else{
                            //Call when records deleted not having PK
                            toastr.success('Record Removed Successfully'); 
                            CycleCountLineCtrl.ePage.Masters.selectedRow = -1;
                            CycleCountLineCtrl.ePage.Masters.SelectAll = false;
                            CycleCountLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                            CycleCountLineCtrl.ePage.Masters.EnableDeleteButton = false;
                            CycleCountLineCtrl.ePage.Masters.EnableCloseLineButton = false;
                        }
 
                    });
                    
                },function () {
                    console.log("Cancelled");
            });
        }

        function RemoveAllLineErrors() {
            for (var i = 0; i < CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.length; i++) {
                OnChangeValues('value', "E13002", true, i);
                OnChangeValues('value', "E13003", true, i);
                OnChangeValues('value', "E13004", true, i);
            }
            return true;
        }
        //#endregion Add,copy,delete row

        function AfterGetByIdCall(){

            // warehouse
            if (CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseCode == null) {
               CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseCode = "";
           }
           if (CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseName == null) {
               CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseName = "";
           }
           CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Warehouse = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseCode + ' - ' + CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseName;
           if (CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Warehouse == ' - ')
               CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Warehouse = "";
           // Client
           if (CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode == null) {
               CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode = "";
           }
           if (CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientName == null) {
               CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientName = "";
           }
           CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Client = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode + ' - ' + CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientName;
           if (CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Client == ' - ')
               CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Client = "";

               
           GetLineList();
       }

        Init();
    }
})();