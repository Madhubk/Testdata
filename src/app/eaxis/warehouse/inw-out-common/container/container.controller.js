(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ContainerController", ContainerController);

    ContainerController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "$uibModal", "$document", "confirmation", "inwardConfig", "outwardConfig","$filter"];

    function ContainerController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, $uibModal, $document, confirmation, inwardConfig, outwardConfig ,$filter) {

        var ContainerCtrl = this;
        //To find whether the response for inward or outward
        if (ContainerCtrl.currentInward != undefined) {
            var configuration = "inward";
            var currentContainer = ContainerCtrl.currentInward[ContainerCtrl.currentInward.label].ePage.Entities;
        }
        else {
            var configuration = "outward";
            var currentContainer = ContainerCtrl.currentOutward[ContainerCtrl.currentOutward.label].ePage.Entities;
        }

        function Init() {

            ContainerCtrl.ePage = {
                "Title": "",
                "Prefix": "Container",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentContainer,
                "config": configuration,
            };

            //For table
            ContainerCtrl.ePage.Masters.SelectAll = false;
            ContainerCtrl.ePage.Masters.EnableDeleteButton = false;
            ContainerCtrl.ePage.Masters.EnableCopyButton = false;
            ContainerCtrl.ePage.Masters.Enable = true;
            ContainerCtrl.ePage.Masters.selectedRow = -1;
            ContainerCtrl.ePage.Masters.emptyText = '-';
            ContainerCtrl.ePage.Masters.SearchTable = '';

            ContainerCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            ContainerCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            ContainerCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ContainerCtrl.ePage.Masters.AddNewRow = AddNewRow;
            ContainerCtrl.ePage.Masters.CopyRow = CopyRow;
            ContainerCtrl.ePage.Masters.RemoveRow = RemoveRow;

            ContainerCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            ContainerCtrl.ePage.Masters.SelectedLookupType = SelectedLookupType;

            GetUserBasedGridColumList();
            GetContainerlist();
            NonEditable();
        }

         //#region User Based Table Column
         function GetUserBasedGridColumList(){
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_CONTAINER",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };
    
            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function(response){
                if(response.data.Response[0]){
                    ContainerCtrl.ePage.Masters.UserValue= response.data.Response[0];
                    if(response.data.Response[0].Value!=''){
                        var obj = JSON.parse(response.data.Response[0].Value)
                        ContainerCtrl.ePage.Entities.Header.TableProperties.UIWmsWorkOrderContainer = obj;
                        ContainerCtrl.ePage.Masters.UserHasValue =true;
                    }
                }else{
                    ContainerCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }
        //#endregion
            
        //#region General
        function NonEditable() {
            if (ContainerCtrl.ePage.config == 'inward') {
                ContainerCtrl.ePage.Masters.WorkOrderStatus = ContainerCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderStatusDesc;
                ContainerCtrl.ePage.Masters.Config = inwardConfig;

            }
            if (ContainerCtrl.ePage.config == 'outward') {
                ContainerCtrl.ePage.Masters.WorkOrderStatus = ContainerCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderStatusDesc;
                ContainerCtrl.ePage.Masters.Config = outwardConfig;

            }
        }

        function GetContainerlist() {
            ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer = $filter('orderBy')(ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer, 'CreatedDateTime');

            ContainerCtrl.ePage.Entities.Header.GlobalVariables.CopyofCurrentObject.UIWmsWorkOrderContainer = angular.copy(ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer)
        }

        function SelectedLookupType(item, index) {
            OnChangeValues(ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer[index].Type, 'E3014', true, index);
        }

        //#endregion

        //#region checkbox selection
        function SelectAllCheckBox(){
            angular.forEach(ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer, function (value, key) {
            if (ContainerCtrl.ePage.Masters.SelectAll){
                value.SingleSelect = true;
                ContainerCtrl.ePage.Masters.EnableDeleteButton = true;
                ContainerCtrl.ePage.Masters.EnableCopyButton = true;
            }
            else{
                value.SingleSelect = false;
                ContainerCtrl.ePage.Masters.EnableDeleteButton = false;
                ContainerCtrl.ePage.Masters.EnableCopyButton = false;
            }
            });
        }

        function SingleSelectCheckBox() {
            var Checked = ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer.some(function (value, key) {
                if(!value.SingleSelect)
                return true;
            });
            if (Checked) {
                ContainerCtrl.ePage.Masters.SelectAll = false;
            } else {
                ContainerCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                ContainerCtrl.ePage.Masters.EnableDeleteButton = true;
                ContainerCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                ContainerCtrl.ePage.Masters.EnableDeleteButton = false;
                ContainerCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }
        //#endregion checkbox selection

        //#region Add,copy,delete row

        function setSelectedRow(index){
            ContainerCtrl.ePage.Masters.selectedRow = index;
        }

        function AddNewRow() {
            ContainerCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            var obj = {
                "PK": "",
                "ContainerNumber": "",
                "SealNumber": "",
                "Type": "",
                "IsPalletised": "",
                "IsChargeable": "",
                "ItemCount": "",
                "PalletCount": "",
                "IsDeleted": false,
            };
            ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer.push(obj);
            ContainerCtrl.ePage.Masters.selectedRow = ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer.length-1;
        
            $timeout(function () {
                var objDiv = document.getElementById("ContainerCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            ContainerCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
        };

        function CopyRow() {
            ContainerCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            for(var i = ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer.length -1; i >= 0; i--){
                if(ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer[i].SingleSelect){
                    var obj = angular.copy(ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer[i]);
                    obj.PK = '';
                    obj.CreatedDateTime = '';
                    obj.ModifiedDateTime = '';
                    obj.SingleSelect=false;
                    obj.IsCopied = true;
                    ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer.splice(i + 1, 0, obj);
                }
            }
            ContainerCtrl.ePage.Masters.selectedRow = -1;
            ContainerCtrl.ePage.Masters.SelectAll = false;
            ContainerCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
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
                    ContainerCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

                    angular.forEach(ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer,function(value,key){
                        if(value.SingleSelect==true && value.PK){
                            apiService.get("eAxisAPI", ContainerCtrl.ePage.Entities.Header.API.ContainerDelete.Url + value.PK).then(function (response) {
                            });
                        }
                    });
            
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        for (var i = ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer.length -1; i >= 0; i--){
                            if(ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer[i].SingleSelect==true)
                            ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer.splice(i,1);
                        }
                        if(ContainerCtrl.ePage.config == 'inward'){
                            ContainerCtrl.ePage.Masters.Config.GeneralValidation(ContainerCtrl.currentInward);
                        }
                        else{
                            ContainerCtrl.ePage.Masters.Config.GeneralValidation(ContainerCtrl.currentOutward);
                        }
                    }
                    toastr.success('Record Removed Successfully');
                    ContainerCtrl.ePage.Masters.selectedRow = -1;
                    ContainerCtrl.ePage.Masters.SelectAll = false;
                    ContainerCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    ContainerCtrl.ePage.Masters.EnableDeleteButton = false;
                }, function () {
                    console.log("Cancelled");
            });
        }
        //#endregion Add,copy,delete row

        //#region Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ContainerCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (ContainerCtrl.ePage.config == 'inward') {
                if (!fieldvalue) {
                    ContainerCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ContainerCtrl.currentInward.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
                } else {
                    ContainerCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ContainerCtrl.currentInward.label, IsArray, RowIndex, value.ColIndex);
                }
            } else {
                if (!fieldvalue) {
                    ContainerCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ContainerCtrl.currentOutward.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
                } else {
                    ContainerCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ContainerCtrl.currentOutward.label, IsArray, RowIndex, value.ColIndex);
                }
            }
        }

        function RemoveAllLineErrors(){
            for(var i=0;i<ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer.length;i++){
                OnChangeValues('value', "E3013", true, i);
                OnChangeValues('value', "E3014", true, i);
            }
            return true;
        }
        //#endregion

        Init();
    }

})();
