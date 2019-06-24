(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrganizationController", OrganizationController);

    OrganizationController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "productConfig", "helperService", "toastr", "$document", "confirmation" ,"$filter"];

    function OrganizationController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, productConfig, helperService, toastr, $document, confirmation,$filter) {

        var OrganizationCtrl = this;

        function Init() {

            var currentProduct = OrganizationCtrl.currentProduct[OrganizationCtrl.currentProduct.label].ePage.Entities;
            OrganizationCtrl.ePage = {
                "Title": "",
                "Prefix": "Product_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentProduct,
            };

            OrganizationCtrl.ePage.Masters.Config = productConfig;

                //For table
            OrganizationCtrl.ePage.Masters.SelectAll = false;
            OrganizationCtrl.ePage.Masters.EnableDeleteButton = false;
            OrganizationCtrl.ePage.Masters.EnableCopyButton = false;
            OrganizationCtrl.ePage.Masters.Enable = true;
            OrganizationCtrl.ePage.Masters.selectedRow = -1;
            OrganizationCtrl.ePage.Masters.emptyText = '-';
            OrganizationCtrl.ePage.Masters.SearchTable = '';

            OrganizationCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            OrganizationCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            OrganizationCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            OrganizationCtrl.ePage.Masters.AddNewRow = AddNewRow;
            OrganizationCtrl.ePage.Masters.CopyRow = CopyRow;
            OrganizationCtrl.ePage.Masters.RemoveRow = RemoveRow;

            OrganizationCtrl.ePage.Masters.DropDownMasterList = {};

            OrganizationCtrl.ePage.Masters.SelectedLookupDataClient = SelectedLookupDataClient;
            OrganizationCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
           
            GetUserBasedGridColumList();
            GetGeneralOperations();
            GetDropDownList();
        }

        //#region User Based Table Column
        function GetUserBasedGridColumList(){
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_PRODUCTORGANIZATION",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function(response){
                if(response.data.Response[0]){
                    OrganizationCtrl.ePage.Masters.UserValue= response.data.Response[0];
                    if(response.data.Response[0].Value!=''){
                        var obj = JSON.parse(response.data.Response[0].Value)
                        OrganizationCtrl.ePage.Entities.Header.TableProperties.UIOrgPartRelation = obj;
                        OrganizationCtrl.ePage.Masters.UserHasValue =true;
                    }
                }else{
                    OrganizationCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }
        //#endregion
            
        //#region General
        function GetGeneralOperations(){
            angular.forEach(OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation, function (value, key) {
                if (value.ClientCode == null)
                    value.ClientCode = '';

                if (value.ClientName == null)
                    value.ClientName = '';

                OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[key].Client = value.ClientCode + ' - ' + value.ClientName;
                AllocatePartAttribute(key);
            });
            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation = $filter('orderBy')(OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation, 'CreatedDateTime');

            OrganizationCtrl.ePage.Entities.Header.GlobalVariables.CopyofCurrentObject.UIOrgPartRelation = angular.copy(OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation);
        }

        function GetDropDownList() {
            var typeCodeList = ["WMSYESNO", "WMSRelationShip", "INW_LINE_UQ", "PickMode"];
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
                        OrganizationCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        OrganizationCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function SelectedLookupDataClient(item, index) {
            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].Client = item.Code + ' - ' + item.FullName;
            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].ORG_FK = item.PK;
            AllocatePartAttribute(index);
            OnChangeValues(OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].Client, 'E7014', true, index)
           
            //To Remove if it is copy row
            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].UsePartAttrib1=false;
            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].UsePartAttrib2=false;
            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].UsePartAttrib3=false;
            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].UsePackingDate = false;
            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].UseExpiryDate = false;
            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].IsPartAttrib1ReleaseCaptured = false;
            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].IsPartAttrib2ReleaseCaptured = false;
            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].IsPartAttrib3ReleaseCaptured = false;
        }

        function AllocatePartAttribute(index) {
            if (OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].ORG_FK) {
                OrganizationCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                
                var _filter = {
                    "ORG_FK": OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].ORG_FK
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.OrgMiscServ.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", appConfig.Entities.OrgMiscServ.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        angular.forEach(OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation,function(value,key){
                            if(value.ORG_FK == response.data.Response[0].ORG_FK){
                                OrganizationCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                                value.IMPartAttrib1Name = response.data.Response[0].IMPartAttrib1Name;
                                value.IMPartAttrib2Name = response.data.Response[0].IMPartAttrib2Name;
                                value.IMPartAttrib3Name = response.data.Response[0].IMPartAttrib3Name;
                                value.IMUseExpiryDate = response.data.Response[0].IMUseExpiryDate;
                                value.IMUsePackingDate = response.data.Response[0].IMUsePackingDate;
                            }
                        });
                    }
                });
            }
        }
        //#endregion
        
        //#region Checkbox Selection
        function SelectAllCheckBox(){
            angular.forEach(OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation, function (value, key) {
            if (OrganizationCtrl.ePage.Masters.SelectAll){
                value.SingleSelect = true;
                OrganizationCtrl.ePage.Masters.EnableDeleteButton = true;
                OrganizationCtrl.ePage.Masters.EnableCopyButton = true;
            }
            else{
                value.SingleSelect = false;
                OrganizationCtrl.ePage.Masters.EnableDeleteButton = false;
                OrganizationCtrl.ePage.Masters.EnableCopyButton = false;
            }
            });
        }

        function SingleSelectCheckBox() {
            var Checked = OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.some(function (value, key) {
                if(!value.SingleSelect)
                return true;
            });
            if (Checked) {
                OrganizationCtrl.ePage.Masters.SelectAll = false;
            } else {
                OrganizationCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                OrganizationCtrl.ePage.Masters.EnableDeleteButton = true;
                OrganizationCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                OrganizationCtrl.ePage.Masters.EnableDeleteButton = false;
                OrganizationCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }
        //#endregion checkbox selection

        //#region Add, Copy, Delete Row

        function setSelectedRow(index){
            OrganizationCtrl.ePage.Masters.selectedRow = index;
        }

        function AddNewRow() {
            OrganizationCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            var obj = {
                "PK": null,
                "ORG_FK": null,
                "Client": null,
                "ClientCode": null,
                "ClientName": null,
                "Relationship": null,
                "ClientUQ": OrganizationCtrl.ePage.Entities.Header.Data.UIProductGeneral.StockKeepingUnit,
                "LocalPartNumber": null,
                "LocalPartDescription": null,
                "UsePartAttrib1": null,
                "UsePartAttrib2": null,
                "UsePartAttrib3": null,
                "UseExpiryDate": null,
                "UsePackingDate": null,
                "IsPartAttrib1ReleaseCaptured":null,
                "IsPartAttrib2ReleaseCaptured":null,
                "IsPartAttrib3ReleaseCaptured":null,
                "PickMode": null,
                "IsDeleted": false
            };
            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.push(obj);
            OrganizationCtrl.ePage.Masters.selectedRow = OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.length-1;
        
            $timeout(function () {
                var objDiv = document.getElementById("OrganizationCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            OrganizationCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
        }

        function CopyRow() {
            OrganizationCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            for(var i = OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.length -1; i >= 0; i--){
                if(OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[i].SingleSelect){
                    var obj = angular.copy(OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[i]);
                    obj.PK = null;
                    obj.CreatedDateTime = null;
                    obj.ModifiedDateTime = null;
                    obj.SingleSelect=false;
                    obj.IsCopied = true;
                    OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.splice(i + 1, 0, obj);
                }
            }
            OrganizationCtrl.ePage.Masters.selectedRow = -1;
            OrganizationCtrl.ePage.Masters.SelectAll = false;
            OrganizationCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
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
                    OrganizationCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

                    angular.forEach(OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation,function(value,key){
                        if(value.SingleSelect==true && value.PK){
                            apiService.get("eAxisAPI", appConfig.Entities.PrdProductRelatedParty.API.Delete.Url + value.PK).then(function (response) {
                            });
                        }
                    });
            
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        for (var i = OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.length -1; i >= 0; i--){
                            if(OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[i].SingleSelect==true)
                            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.splice(i,1);
                        }
                        OrganizationCtrl.ePage.Masters.Config.GeneralValidation(OrganizationCtrl.currentProduct);
                    }
                    toastr.success('Record Removed Successfully');
                    OrganizationCtrl.ePage.Masters.selectedRow = -1;
                    OrganizationCtrl.ePage.Masters.SelectAll = false;
                    OrganizationCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    OrganizationCtrl.ePage.Masters.EnableDeleteButton = false;
                }, function () {
                    console.log("Cancelled");
            });
        }
        //#endregion Add,copy,delete row

        //#region Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(OrganizationCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                OrganizationCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, OrganizationCtrl.currentProduct.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                OrganizationCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, OrganizationCtrl.currentProduct.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function RemoveAllLineErrors(){
            for(var i=0;i<OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.length;i++){
                OnChangeValues('value', "E7002", true, i);
                OnChangeValues('value', "E7014", true, i);
                OnChangeValues('value', "E7015", true, i);
            }
            return true;
        }
        //#endregion

        Init();
    }

})();