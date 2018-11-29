(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CycleCountGeneralController", CycleCountGeneralController);

    CycleCountGeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "cycleCountConfig", "helperService", "toastr", "$injector", "$window", "confirmation"];

    function CycleCountGeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, cycleCountConfig, helperService, toastr, $injector, $window, confirmation) {

        var CycleCountGeneralCtrl = this;

        function Init() {

            var currentCycleCount = CycleCountGeneralCtrl.currentCycleCount[CycleCountGeneralCtrl.currentCycleCount.label].ePage.Entities;

            CycleCountGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "CycleCount_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentCycleCount,
            };

            // DatePicker
            CycleCountGeneralCtrl.ePage.Masters.DatePicker = {};
            CycleCountGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            CycleCountGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            CycleCountGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            CycleCountGeneralCtrl.ePage.Masters.DropDownMasterList = {};
            CycleCountGeneralCtrl.ePage.Masters.TouchCount = false;
            CycleCountGeneralCtrl.ePage.Masters.setselectedRow = setSelectedRow;
            CycleCountGeneralCtrl.ePage.Masters.selectedRow = -1;

            CycleCountGeneralCtrl.ePage.Masters.SelectedLookupDataWarCode = SelectedLookupDataWarCode;
            CycleCountGeneralCtrl.ePage.Masters.SelectedLookupDataClient = SelectedLookupDataClient;
            CycleCountGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            CycleCountGeneralCtrl.ePage.Masters.Config = cycleCountConfig;
            CycleCountGeneralCtrl.ePage.Masters.SelectedLookupDataLocation = SelectedLookupDataLocation;
            CycleCountGeneralCtrl.ePage.Masters.AttachProduct = AttachProduct;
            CycleCountGeneralCtrl.ePage.Masters.DeleteProduct = DeleteProduct;

            GeneralOperations();
            GetDropDownList();
            AllocateUDF();

        }
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            CycleCountGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        // Get CFXType Dropdown list
        function GetDropDownList() {
            var typeCodeList = ["EmptyLocation","CycleCountType", "ABCCategory","PickMethod"];
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
                        CycleCountGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        CycleCountGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        // generalOperations
        function GeneralOperations() {
            // warehouse
            CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WAR_WarehouseCode = CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseCode
            CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WAR_WarehouseName = CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseName
          
            if (CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseCode == null) {
                CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseCode = "";
            }
            if (CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseName == null) {
                CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseName = "";
            }
            CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Warehouse = CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseCode + ' - ' + CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseName;
            if (CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Warehouse == ' - ')
                CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Warehouse = "";
            // Client
            if (CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode == null) {
                CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode = "";
            }
            if (CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientName == null) {
                CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientName = "";
            }
            CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Client = CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode + ' - ' + CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientName;
            if (CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Client == ' - ')
                CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Client = "";

            if(CycleCountGeneralCtrl.currentCycleCount.isNew){
                CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.StocktakeDate = new Date();
                CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.CountEmptyLocationsCategory = "EMT";
                CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.StocktakeType = 'STD';
            }
            CycleCountGeneralCtrl.ePage.Masters.DefaultFilter = {
                "ORG_FK" : CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ORG_FK,
                "ClientCode" : CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode,
            }

            SplitAndCreatingObject();
        }

        function setSelectedRow(index){
            CycleCountGeneralCtrl.ePage.Masters.selectedRow = index;
        }
        
        function AttachProduct($item){
            $item.map(function(value,key){
                var MyData = CycleCountGeneralCtrl.ePage.Masters.ProductDetails.some(function(val,k){
                    return value.ProductCode==val.ProductCode;
                });

                if(!MyData){
                    if(!CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ProductCode){
                        CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ProductCode ="";
                        CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ProductDescription ="";
                    }
                    CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ProductCode = CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ProductCode+value.ProductCode+"|";
                    CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ProductDescription = CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ProductDescription+value.ProductName+"|"; 
                }else{
                    toastr.info("Product Already Attached");
                }
            });

            SplitAndCreatingObject();
        }

        function DeleteProduct($item){
            CycleCountGeneralCtrl.ePage.Masters.selectedRow = -1;
            
            var separator = "|";
            var ProductCodeArray = CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ProductCode.split(separator);
            var ProductDescriptionArray = CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ProductDescription.split(separator);

            for(var i = 0 ; i < ProductCodeArray.length ; i++) {
              if(ProductCodeArray[i] == $item.ProductCode) {
                ProductCodeArray.splice(i, 1);
                ProductDescriptionArray.splice(i, 1);
                var a = ProductCodeArray.join(separator);
                var b = ProductDescriptionArray.join(separator);
              }
            }

            CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ProductCode = a;
            CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ProductDescription = b;
            SplitAndCreatingObject();
        }

        function SplitAndCreatingObject(){
            CycleCountGeneralCtrl.ePage.Masters.ProductDetails = [];

            if(CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ProductCode){
                var ProductCodeArray = CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ProductCode.split('|');
                var ProductDescriptionArray = CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ProductDescription.split('|');
    
                ProductCodeArray.map(function(value,key){
                    if(value){
                        var obj={
                            "ProductCode": value,
                            "ProductDescription":""
                        }
                        CycleCountGeneralCtrl.ePage.Masters.ProductDetails.push(obj);
                    }
                });
    
                ProductDescriptionArray.map(function(value,key){
                    CycleCountGeneralCtrl.ePage.Masters.ProductDetails.map(function(val,k){
                        if(key==k){
                            val.ProductDescription = value;
                        }
                    })
                })
    
            }
        }

        // lookup warehouse
        function SelectedLookupDataWarCode(item) {
            CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Warehouse = item.WarehouseCode + ' - ' + item.WarehouseName;
            OnChangeValues(CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Warehouse,'E13001');
        }

        // lookup client
        function SelectedLookupDataClient(item) {
            CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Client = item.Code+' - '+item.FullName;
            CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ORG_FK = item.PK;

            CycleCountGeneralCtrl.ePage.Masters.DefaultFilter = {
                "ORG_FK" : CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ORG_FK,
                "ClientCode" : CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode,
            }

            AllocateUDF();
        }

          // lookup Location
        function SelectedLookupDataLocation(item, index) {
            CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WLO_FK = item.PK;
            CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Location = item.Location;
        }
        
        function OnChangeValues(fieldvalue, code) {
            angular.forEach(CycleCountGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value) {
            if (!fieldvalue) {
                CycleCountGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, CycleCountGeneralCtrl.currentCycleCount.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
            } else {
                CycleCountGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, CycleCountGeneralCtrl.currentCycleCount.label);
            }
        }

        function AllocateUDF() {
            if(CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ORG_FK){
                var _filter = {
                    "ORG_FK": CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ORG_FK
                };
    
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.OrgMiscServ.API.FindAll.FilterID
                };
    
                apiService.post("eAxisAPI", appConfig.Entities.OrgMiscServ.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.IMPartAttrib1Name = response.data.Response[0].IMPartAttrib1Name;
                        CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.IMPartAttrib2Name = response.data.Response[0].IMPartAttrib2Name;
                        CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.IMPartAttrib3Name = response.data.Response[0].IMPartAttrib3Name;
                        CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.IMPartAttrib1Type = response.data.Response[0].IMPartAttrib1Type;
                        CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.IMPartAttrib2Type = response.data.Response[0].IMPartAttrib2Type;
                        CycleCountGeneralCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.IMPartAttrib3Type = response.data.Response[0].IMPartAttrib3Type;
                    }
                });
            }
        }
        
        Init();
    }

})();