(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ReferenceController", ReferenceController);

    ReferenceController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "helperService", "$document", "appConfig", "authService", "$location", "toastr", "confirmation", "inwardConfig", "outwardConfig", "$state" ,"$filter"];

    function ReferenceController($scope, $timeout, APP_CONSTANT, apiService, helperService, $document, appConfig, authService, $location, toastr, confirmation, inwardConfig, outwardConfig, $state,$filter) {

        var ReferenceCtrl = this;
        function Init() {

            if (ReferenceCtrl.currentInward != undefined) {
                var configuration = "inward";
                var currentReference = ReferenceCtrl.currentInward[ReferenceCtrl.currentInward.label].ePage.Entities;
            }
            else {
                var configuration = "outward";
                var currentReference = ReferenceCtrl.currentOutward[ReferenceCtrl.currentOutward.label].ePage.Entities;
            }

            ReferenceCtrl.ePage = {
                "Title": "",
                "Prefix": "Reference",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentReference,
                "config": configuration,
            };

            //For table
            ReferenceCtrl.ePage.Masters.SelectAll = false;
            ReferenceCtrl.ePage.Masters.EnableDeleteButton = false;
            ReferenceCtrl.ePage.Masters.EnableCopyButton = false;
            ReferenceCtrl.ePage.Masters.Enable = true;
            ReferenceCtrl.ePage.Masters.selectedRow = -1;
            ReferenceCtrl.ePage.Masters.emptyText = '-';
            ReferenceCtrl.ePage.Masters.SearchTable = '';

            ReferenceCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            ReferenceCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            ReferenceCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ReferenceCtrl.ePage.Masters.AddNewRow = AddNewRow;
            ReferenceCtrl.ePage.Masters.CopyRow = CopyRow;
            ReferenceCtrl.ePage.Masters.RemoveRow = RemoveRow;

            ReferenceCtrl.ePage.Masters.DropDownMasterList = {};

            ReferenceCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            GetUserBasedGridColumList();
            GetReferencelist();
            GetDropdownList();
            NonEditable();
        }
       
         //#region User Based Table Column
         function GetUserBasedGridColumList(){
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_REFERENCE",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };
    
            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function(response){
                if(response.data.Response[0]){
                    ReferenceCtrl.ePage.Masters.UserValue= response.data.Response[0];
                    if(response.data.Response[0].Value!=''){
                        var obj = JSON.parse(response.data.Response[0].Value)
                        ReferenceCtrl.ePage.Entities.Header.TableProperties.UIWmsWorkOrderReference = obj;
                        ReferenceCtrl.ePage.Masters.UserHasValue =true;
                    }
                }else{
                    ReferenceCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }
        //#endregion
        
        
        //#region General
        function NonEditable() {
            if (ReferenceCtrl.ePage.config == 'inward') {
                ReferenceCtrl.ePage.Masters.WorkOrderStatus = ReferenceCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderStatusDesc;
                ReferenceCtrl.ePage.Masters.Config = inwardConfig;
            }
            if (ReferenceCtrl.ePage.config == 'outward') {
                ReferenceCtrl.ePage.Masters.WorkOrderStatus = ReferenceCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderStatusDesc;
                ReferenceCtrl.ePage.Masters.Config = outwardConfig;
            }
        }

        function GetDropdownList() {
            // Get CFXType Dropdown list

            var typeCodeList = ["WOR_REFERENCETYPE"];
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

                        ReferenceCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ReferenceCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });;
                }
            });
        }

        function GetReferencelist() {
            var _filter = {
                "WOD_FK": ReferenceCtrl.ePage.Entities.Header.Data.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ReferenceCtrl.ePage.Entities.Header.API.References.FilterID
            };

            apiService.post("eAxisAPI", ReferenceCtrl.ePage.Entities.Header.API.References.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference = response.data.Response;
                    ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference = $filter('orderBy')(ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference, 'CreatedDateTime');
                }
            });
        }

        //#endregion

        //#region checkbox selection
        function SelectAllCheckBox(){
            angular.forEach(ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference, function (value, key) {
            if (ReferenceCtrl.ePage.Masters.SelectAll){
                value.SingleSelect = true;
                ReferenceCtrl.ePage.Masters.EnableDeleteButton = true;
                ReferenceCtrl.ePage.Masters.EnableCopyButton = true;
            }
            else{
                value.SingleSelect = false;
                ReferenceCtrl.ePage.Masters.EnableDeleteButton = false;
                ReferenceCtrl.ePage.Masters.EnableCopyButton = false;
            }
            });
        }

        function SingleSelectCheckBox() {
            var Checked = ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference.some(function (value, key) {
                if(!value.SingleSelect)
                return true;
            });
            if (Checked) {
                ReferenceCtrl.ePage.Masters.SelectAll = false;
            } else {
                ReferenceCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                ReferenceCtrl.ePage.Masters.EnableDeleteButton = true;
                ReferenceCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                ReferenceCtrl.ePage.Masters.EnableDeleteButton = false;
                ReferenceCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }
        //#endregion checkbox selection

        //#region Add,copy,delete row

        function setSelectedRow(index){
            ReferenceCtrl.ePage.Masters.selectedRow = index;
        }

        function AddNewRow() {
            ReferenceCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            var obj = {
                "PK": "",
                "RefType": "",
                "Reference": "",
                "IsDeleted": false,
            };
            ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference.push(obj);
            ReferenceCtrl.ePage.Masters.selectedRow = ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference.length-1;
        
            $timeout(function () {
                var objDiv = document.getElementById("ReferenceCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            ReferenceCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
        };

        function CopyRow() {
            ReferenceCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            for(var i = ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference.length -1; i >= 0; i--){
                if(ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference[i].SingleSelect){
                    var obj = angular.copy(ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference[i]);
                    obj.PK = '';
                    obj.CreatedDateTime = '';
                    obj.ModifiedDateTime = '';
                    obj.SingleSelect=false;
                    obj.IsCopied = true;
                    ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference.splice(i + 1, 0, obj);
                }
            }
            ReferenceCtrl.ePage.Masters.selectedRow = -1;
            ReferenceCtrl.ePage.Masters.SelectAll = false;
            ReferenceCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
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
                    ReferenceCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

                    angular.forEach(ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference,function(value,key){
                        if(value.SingleSelect==true && value.PK){
                            apiService.get("eAxisAPI", ReferenceCtrl.ePage.Entities.Header.API.ReferenceDelete.Url + value.PK).then(function (response) {
                            });
                        }
                    });
            
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        for (var i = ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference.length -1; i >= 0; i--){
                            if(ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference[i].SingleSelect==true)
                            ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference.splice(i,1);
                        }
                        if(ReferenceCtrl.ePage.config == 'inward'){
                            ReferenceCtrl.ePage.Masters.Config.GeneralValidation(ReferenceCtrl.currentInward);
                        }
                        else{
                            ReferenceCtrl.ePage.Masters.Config.GeneralValidation(ReferenceCtrl.currentOutward);
                        }
                    }
                    toastr.success('Record Removed Successfully');
                    ReferenceCtrl.ePage.Masters.selectedRow = -1;
                    ReferenceCtrl.ePage.Masters.SelectAll = false;
                    ReferenceCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    ReferenceCtrl.ePage.Masters.EnableDeleteButton = false;
                }, function () {
                    console.log("Cancelled");
            });
        }
        //#endregion Add,copy,delete row

        //#region Validation
        function RemoveAllLineErrors(){
            for(var i=0;i<ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference.length;i++){
                OnChangeValues('value', "E3015", true, i);
                OnChangeValues('value', "E3016", true, i);
            }
            return true;
        }

        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ReferenceCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (ReferenceCtrl.ePage.config == 'inward') {
                if (!fieldvalue) {
                    ReferenceCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ReferenceCtrl.currentInward.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
                } else {
                    ReferenceCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ReferenceCtrl.currentInward.label, IsArray, RowIndex, value.ColIndex);
                }
            } else {
                if (!fieldvalue) {
                    ReferenceCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ReferenceCtrl.currentOutward.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
                } else {
                    ReferenceCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ReferenceCtrl.currentOutward.label, IsArray, RowIndex, value.ColIndex);
                }
            }
        }
        //#endregion

        Init();
    }


})();



