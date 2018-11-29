(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BarcodesController", BarcodesController);

    BarcodesController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "productConfig", "helperService", "toastr", "$document", "confirmation","$filter"];

    function BarcodesController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, productConfig, helperService, toastr, $document, confirmation,$filter) {

        var BarcodesCtrl = this;

        function Init() {

            var currentProduct = BarcodesCtrl.currentProduct[BarcodesCtrl.currentProduct.label].ePage.Entities;

            BarcodesCtrl.ePage = {
                "Title": "",
                "Prefix": "Product_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentProduct,
            };

            BarcodesCtrl.ePage.Masters.Config = productConfig;
             //For table
            BarcodesCtrl.ePage.Masters.SelectAll = false;
            BarcodesCtrl.ePage.Masters.EnableDeleteButton = false;
            BarcodesCtrl.ePage.Masters.EnableCopyButton = false;
            BarcodesCtrl.ePage.Masters.Enable = true;
            BarcodesCtrl.ePage.Masters.selectedRow = -1;
            BarcodesCtrl.ePage.Masters.emptyText = '-';
            BarcodesCtrl.ePage.Masters.SearchTable = '';

            BarcodesCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            BarcodesCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            BarcodesCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            BarcodesCtrl.ePage.Masters.AddNewRow = AddNewRow;
            BarcodesCtrl.ePage.Masters.CopyRow = CopyRow;
            BarcodesCtrl.ePage.Masters.RemoveRow = RemoveRow;

            BarcodesCtrl.ePage.Masters.DropDownMasterList = {};

            BarcodesCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            BarcodesCtrl.ePage.Masters.CheckWarning = CheckWarning;

            GetUserBasedGridColumList();
            GetBarcodesList();
            GetDropDownList();
        }
        
        //#region User Based Table Column
        function GetUserBasedGridColumList(){
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_PRODUCTBARCODE",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function(response){
                if(response.data.Response[0]){
                    BarcodesCtrl.ePage.Masters.UserValue= response.data.Response[0];
                    if(response.data.Response[0].Value!=''){
                        var obj = JSON.parse(response.data.Response[0].Value)
                        BarcodesCtrl.ePage.Entities.Header.TableProperties.UIOrgSupplierPartBarcode = obj;
                        BarcodesCtrl.ePage.Masters.UserHasValue =true;
                    }
                }else{
                    BarcodesCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }
        //#endregion
    
        //#region General
        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["INW_LINE_UQ"];
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
                        BarcodesCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        BarcodesCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function GetBarcodesList() {
            BarcodesCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            var _filter = {
                "OSP_FK": BarcodesCtrl.ePage.Entities.Header.Data.PK,
                "SortColumn": "OSB_Barcode",
                "BarCodes":"NOTNULL",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PrdPrductBarcode.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.PrdPrductBarcode.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    BarcodesCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode = response.data.Response;
                    //Order By
                    BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode = $filter('orderBy')(BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode, 'CreatedDateTime');
                }
            });
        }
        //#endregion
        
        //#region checkbox selection
        function SelectAllCheckBox(){
            angular.forEach(BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode, function (value, key) {
            if (BarcodesCtrl.ePage.Masters.SelectAll){
                value.SingleSelect = true;
                BarcodesCtrl.ePage.Masters.EnableDeleteButton = true;
                BarcodesCtrl.ePage.Masters.EnableCopyButton = true;
            }
            else{
                value.SingleSelect = false;
                BarcodesCtrl.ePage.Masters.EnableDeleteButton = false;
                BarcodesCtrl.ePage.Masters.EnableCopyButton = false;
            }
            });
        }

        function SingleSelectCheckBox() {
            var Checked = BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode.some(function (value, key) {
                if(!value.SingleSelect)
                return true;
            });
            if (Checked) {
                BarcodesCtrl.ePage.Masters.SelectAll = false;
            } else {
                BarcodesCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                BarcodesCtrl.ePage.Masters.EnableDeleteButton = true;
                BarcodesCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                BarcodesCtrl.ePage.Masters.EnableDeleteButton = false;
                BarcodesCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }
        //#endregion checkbox selection

        //#region Add,copy,delete row

        function setSelectedRow(index){
            BarcodesCtrl.ePage.Masters.selectedRow = index;
        }

        function AddNewRow() {
            BarcodesCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            var obj = {
                "PK": "",
                "PAC_NKPackType": "",
                "Barcode": "",
                "IsDeleted": false
            };
            BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode.push(obj);
            BarcodesCtrl.ePage.Masters.selectedRow = BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode.length-1;
        
            $timeout(function () {
                var objDiv = document.getElementById("BarcodesCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            BarcodesCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
        };

        function CopyRow() {
            BarcodesCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            for(var i = BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode.length -1; i >= 0; i--){
                if(BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode[i].SingleSelect){
                    var obj = angular.copy(BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode[i]);
                    obj.PK = '';
                    obj.CreatedDateTime = '';
                    obj.ModifiedDateTime = '';
                    obj.SingleSelect=false;
                    obj.IsCopied = true;
                    BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode.splice(i + 1, 0, obj);
                }
            }
            BarcodesCtrl.ePage.Masters.selectedRow = -1;
            BarcodesCtrl.ePage.Masters.SelectAll = false;
            BarcodesCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
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
                    BarcodesCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

                    angular.forEach(BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode,function(value,key){
                        if(value.SingleSelect==true && value.PK){
                            apiService.get("eAxisAPI", appConfig.Entities.PrdPrductBarcode.API.Delete.Url + value.PK).then(function (response) {
                            });
                        }
                    });
            
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        for (var i = BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode.length -1; i >= 0; i--){
                            if(BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode[i].SingleSelect==true)
                            BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode.splice(i,1);
                        }
                        BarcodesCtrl.ePage.Masters.Config.GeneralValidation(BarcodesCtrl.currentProduct);
                    }
                    toastr.success('Record Removed Successfully');
                    BarcodesCtrl.ePage.Masters.selectedRow = -1;
                    BarcodesCtrl.ePage.Masters.SelectAll = false;
                    BarcodesCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    BarcodesCtrl.ePage.Masters.EnableDeleteButton = false;
                }, function () {
                    console.log("Cancelled");
            });
        }
        //#endregion Add,copy,delete row

        //#region Validation
        function CheckWarning(item, RowIndex) {
            if(item){
                if((BarcodesCtrl.ePage.Entities.Header.Data.UIOrgPartUnit.length == 0) && (BarcodesCtrl.ePage.Entities.Header.Data.UIProductGeneral.StockKeepingUnit!=item) ){
                    OnChangeValues(null, "E7032", true, RowIndex);
                }else if(BarcodesCtrl.ePage.Entities.Header.Data.UIProductGeneral.StockKeepingUnit==item){
                    OnChangeValues('value', "E7032", true, RowIndex);
                }else if((BarcodesCtrl.ePage.Entities.Header.Data.UIOrgPartUnit.length >0 ) && (BarcodesCtrl.ePage.Entities.Header.Data.UIProductGeneral.StockKeepingUnit!=item)){
                    var myvalue = BarcodesCtrl.ePage.Entities.Header.Data.UIOrgPartUnit.some(function (value, key) {
                        return value.ParentPackType == item;
                    });

                    if(!myvalue){
                        OnChangeValues(null, "E7032", true, RowIndex); 
                    }else{
                        OnChangeValues('value', "E7032", true, RowIndex);
                    }
                }
            }
        }

        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(BarcodesCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                BarcodesCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, BarcodesCtrl.currentProduct.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                BarcodesCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, BarcodesCtrl.currentProduct.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function RemoveAllLineErrors(){
            for(var i=0;i<BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode.length;i++){
            OnChangeValues('value', "E7009", true, i);
            OnChangeValues('value', "E7023", true, i);
            OnChangeValues('value', "E7024", true, i);
            OnChangeValues('value', "E7032", true, i);
            }
            return true;
        }
        //#endregion Validation

        Init();
    }

})();