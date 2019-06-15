(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConversionsController", ConversionsController);

    ConversionsController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "productConfig", "helperService", "toastr", "$document", "confirmation","$filter"];

    function ConversionsController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, productConfig, helperService, toastr, $document, confirmation,$filter) {

        var ConversionsCtrl = this;

        function Init() {

            var currentProduct = ConversionsCtrl.currentProduct[ConversionsCtrl.currentProduct.label].ePage.Entities;

            ConversionsCtrl.ePage = {
                "Title": "",
                "Prefix": "Product_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentProduct,
            };

            ConversionsCtrl.ePage.Masters.Config = productConfig;

            ConversionsCtrl.ePage.Masters.SelectAll = false;
            ConversionsCtrl.ePage.Masters.EnableDeleteButton = false;
            ConversionsCtrl.ePage.Masters.EnableCopyButton = false;
            ConversionsCtrl.ePage.Masters.Enable = true;
            ConversionsCtrl.ePage.Masters.selectedRow = -1;
            ConversionsCtrl.ePage.Masters.emptyText = '-';
            ConversionsCtrl.ePage.Masters.SearchTable = '';

            ConversionsCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            ConversionsCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            ConversionsCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ConversionsCtrl.ePage.Masters.AddNewRow = AddNewRow;
            ConversionsCtrl.ePage.Masters.CopyRow = CopyRow;
            ConversionsCtrl.ePage.Masters.RemoveRow = RemoveRow;

            ConversionsCtrl.ePage.Masters.DropDownMasterList = {};

            ConversionsCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            ConversionsCtrl.ePage.Masters.CheckSimilarType = CheckSimilarType;

            GetUserBasedGridColumList();
            GetConversionsList();
            GetDropDownList();

        }

         //#region User Based Table Column
         function GetUserBasedGridColumList(){
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_PRODUCTCONVERSION",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };
    
            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function(response){
                if(response.data.Response[0]){
                    ConversionsCtrl.ePage.Masters.UserValue= response.data.Response[0];
                    if(response.data.Response[0].Value!=''){
                        var obj = JSON.parse(response.data.Response[0].Value)
                        ConversionsCtrl.ePage.Entities.Header.TableProperties.UIOrgPartUnit = obj;
                        ConversionsCtrl.ePage.Masters.UserHasValue =true;
                    }
                }else{
                    ConversionsCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }
        //#endregion
            
        //#region General
        function GetConversionsList() {
            var _filter = {
                "OSP_FK": ConversionsCtrl.ePage.Entities.Header.Data.PK,
                "SortColumn": "OPU_PackType",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PrdProductUnit.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.PrdProductUnit.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit = response.data.Response;
                    //Order By
                    ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit = $filter('orderBy')(ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit, 'CreatedDateTime');

                    ConversionsCtrl.ePage.Entities.Header.GlobalVariables.CopyofCurrentObject.UIOrgPartUnit = angular.copy(ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit);
                }
            });
        }

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
                        ConversionsCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ConversionsCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        //#endregion

        //#region checkbox selection
        function SelectAllCheckBox(){
            angular.forEach(ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit, function (value, key) {
            if (ConversionsCtrl.ePage.Masters.SelectAll){
                value.SingleSelect = true;
                ConversionsCtrl.ePage.Masters.EnableDeleteButton = true;
                ConversionsCtrl.ePage.Masters.EnableCopyButton = true;
            }
            else{
                value.SingleSelect = false;
                ConversionsCtrl.ePage.Masters.EnableDeleteButton = false;
                ConversionsCtrl.ePage.Masters.EnableCopyButton = false;
            }
            });
        }

        function SingleSelectCheckBox() {
            var Checked = ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit.some(function (value, key) {
                if(!value.SingleSelect)
                return true;
            });
            if (Checked) {
                ConversionsCtrl.ePage.Masters.SelectAll = false;
            } else {
                ConversionsCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                ConversionsCtrl.ePage.Masters.EnableDeleteButton = true;
                ConversionsCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                ConversionsCtrl.ePage.Masters.EnableDeleteButton = false;
                ConversionsCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }
        //#endregion checkbox selection

        //#region Add,copy,delete row

        function setSelectedRow(index){
            ConversionsCtrl.ePage.Masters.selectedRow = index;
        }

        function AddNewRow() {
            ConversionsCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            var obj = {
                "PK": "",
                "QuantityInParent": 0,
                "PackType": "",
                "ParentPackType": "",
                "IsDeleted": false
            };
            ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit.push(obj);
            ConversionsCtrl.ePage.Masters.selectedRow = ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit.length-1;
        
            $timeout(function () {
                var objDiv = document.getElementById("ConversionsCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            ConversionsCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
        };

        function CopyRow() {
            ConversionsCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            for(var i = ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit.length -1; i >= 0; i--){
                if(ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit[i].SingleSelect){
                    var obj = angular.copy(ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit[i]);
                    obj.PK = '';
                    obj.CreatedDateTime = '';
                    obj.ModifiedDateTime = '';
                    obj.SingleSelect=false;
                    obj.IsCopied = true;
                    ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit.splice(i + 1, 0, obj);
                }
            }
            ConversionsCtrl.ePage.Masters.selectedRow = -1;
            ConversionsCtrl.ePage.Masters.SelectAll = false;
            ConversionsCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
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
                    ConversionsCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

                    angular.forEach(ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit,function(value,key){
                        if(value.SingleSelect==true && value.PK){
                            apiService.get("eAxisAPI", appConfig.Entities.PrdProductUnit.API.Delete.Url + value.PK).then(function (response) {
                            });
                        }
                    });
            
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        for (var i = ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit.length -1; i >= 0; i--){
                            if(ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit[i].SingleSelect==true)
                            ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit.splice(i,1);
                        }
                        ConversionsCtrl.ePage.Masters.Config.GeneralValidation(ConversionsCtrl.currentProduct);
                    }
                    toastr.success('Record Removed Successfully');
                    ConversionsCtrl.ePage.Masters.selectedRow = -1;
                    ConversionsCtrl.ePage.Masters.SelectAll = false;
                    ConversionsCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    ConversionsCtrl.ePage.Masters.EnableDeleteButton = false;
                }, function () {
                    console.log("Cancelled");
            });
        }
        //#endregion Add,copy,delete row

        //#region Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ConversionsCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                ConversionsCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ConversionsCtrl.currentProduct.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                ConversionsCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ConversionsCtrl.currentProduct.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function CheckSimilarType(index){
            if(ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit[index].ParentPackType == ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit[index].PackType && ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit[index].ParentPackType && ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit[index].PackType){
                OnChangeValues(null,'E7021',true,index);
                OnChangeValues(null,'E7022',true,index);
            }else{
                OnChangeValues('value','E7021',true,index);
                OnChangeValues('value','E7022',true,index);
            }
        }

        function RemoveAllLineErrors(){
            for(var i=0;i<ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit.length;i++){
                OnChangeValues('value', "E7004", true, i);
                OnChangeValues('value', "E7017", true, i);
                OnChangeValues('value', "E7018", true, i);
                OnChangeValues('value', "E7019", true, i);
                OnChangeValues('value', "E7020", true, i);
                OnChangeValues('value', "E7021", true, i);
                OnChangeValues('value', "E7022", true, i);
            }
            return true;
        }
        //#endregion
        
        Init();
    }

})();