(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ServiceController", ServiceController);

    ServiceController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "helperService", "$document", "appConfig", "authService", "$location", "toastr", "confirmation", "inwardConfig", "outwardConfig", "$state" ,"$filter"];

    function ServiceController($scope, $timeout, APP_CONSTANT, apiService, helperService, $document, appConfig, authService, $location, toastr, confirmation, inwardConfig, outwardConfig, $state ,$filter) {

        var ServiceCtrl = this;
        function Init() {
            if (ServiceCtrl.currentInward != undefined) {
                var configuration = "inward";
                var currentServices = ServiceCtrl.currentInward[ServiceCtrl.currentInward.label].ePage.Entities;
            }
            else {
                var configuration = "outward";
                var currentServices = ServiceCtrl.currentOutward[ServiceCtrl.currentOutward.label].ePage.Entities;
            }
            ServiceCtrl.ePage = {
                "Title": "",
                "Prefix": "Service",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentServices,
                "config": configuration,
            };

            //For table
            ServiceCtrl.ePage.Masters.SelectAll = false;
            ServiceCtrl.ePage.Masters.EnableDeleteButton = false;
            ServiceCtrl.ePage.Masters.EnableCopyButton = false;
            ServiceCtrl.ePage.Masters.Enable = true;
            ServiceCtrl.ePage.Masters.selectedRow = -1;
            ServiceCtrl.ePage.Masters.emptyText = '-';
            ServiceCtrl.ePage.Masters.SearchTable = '';

            ServiceCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            ServiceCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            ServiceCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ServiceCtrl.ePage.Masters.AddNewRow = AddNewRow;
            ServiceCtrl.ePage.Masters.CopyRow = CopyRow;
            ServiceCtrl.ePage.Masters.RemoveRow = RemoveRow;

            ServiceCtrl.ePage.Masters.DropDownMasterList = {};
            // Date Picker
            ServiceCtrl.ePage.Masters.DatePicker = {};
            ServiceCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ServiceCtrl.ePage.Masters.DatePicker.isOpen = [];
            ServiceCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ServiceCtrl.ePage.Masters.IsDisableEnter = false;

            ServiceCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            GetUserBasedGridColumList();
            GetServiceList();
            GetDropdownList();
            NonEditable();
        }

         //#region User Based Table Column
         function GetUserBasedGridColumList(){
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_SERVICES",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };
    
            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function(response){
                if(response.data.Response[0]){
                    ServiceCtrl.ePage.Masters.UserValue= response.data.Response[0];
                    if(response.data.Response[0].Value!=''){
                        var obj = JSON.parse(response.data.Response[0].Value)
                        ServiceCtrl.ePage.Entities.Header.TableProperties.UIJobServices = obj;
                        ServiceCtrl.ePage.Masters.UserHasValue =true;
                    }
                }else{
                    ServiceCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }
        //#endregion
        
        
        //#region General
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            ServiceCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function NonEditable() {
            if (ServiceCtrl.ePage.config == 'inward') {
                ServiceCtrl.ePage.Masters.WorkOrderStatus = ServiceCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderStatusDesc;
                ServiceCtrl.ePage.Masters.Config = inwardConfig;
            }
            if (ServiceCtrl.ePage.config == 'outward') {
                ServiceCtrl.ePage.Masters.WorkOrderStatus = ServiceCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderStatusDesc;
                ServiceCtrl.ePage.Masters.Config = outwardConfig;
            }
        }

        function GetDropdownList() {
            // Get CFXType Dropdown list

            var typeCodeList = ["WOR_SERVICECODE"];
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

                        ServiceCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ServiceCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });;
                }
            });
        }

        function GetServiceList() {

            var _filter = {
                "ParentID": ServiceCtrl.ePage.Entities.Header.Data.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobService.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobService.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ServiceCtrl.ePage.Entities.Header.Data.UIJobServices = response.data.Response;
                    //Order By
                    ServiceCtrl.ePage.Entities.Header.Data.UIJobServices = $filter('orderBy')(ServiceCtrl.ePage.Entities.Header.Data.UIJobServices, 'CreatedDateTime');

                }
            });
        }
        //#endregion
        
        //#region checkbox selection
        function SelectAllCheckBox(){
            angular.forEach(ServiceCtrl.ePage.Entities.Header.Data.UIJobServices, function (value, key) {
            if (ServiceCtrl.ePage.Masters.SelectAll){
                value.SingleSelect = true;
                ServiceCtrl.ePage.Masters.EnableDeleteButton = true;
                ServiceCtrl.ePage.Masters.EnableCopyButton = true;
            }
            else{
                value.SingleSelect = false;
                ServiceCtrl.ePage.Masters.EnableDeleteButton = false;
                ServiceCtrl.ePage.Masters.EnableCopyButton = false;
            }
            });
        }

        function SingleSelectCheckBox() {
            var Checked = ServiceCtrl.ePage.Entities.Header.Data.UIJobServices.some(function (value, key) {
                if(!value.SingleSelect)
                return true;
            });
            if (Checked) {
                ServiceCtrl.ePage.Masters.SelectAll = false;
            } else {
                ServiceCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = ServiceCtrl.ePage.Entities.Header.Data.UIJobServices.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                ServiceCtrl.ePage.Masters.EnableDeleteButton = true;
                ServiceCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                ServiceCtrl.ePage.Masters.EnableDeleteButton = false;
                ServiceCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }
        //#endregion checkbox selection

        //#region Add,copy,delete row

        function setSelectedRow(index){
            ServiceCtrl.ePage.Masters.selectedRow = index;
        }

        function AddNewRow() {
            ServiceCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            var obj = {
                "PK": "",
                "ServiceCode": "",
                "Booked": "",
                "Completed": "",
                "ORG_Contractor_FK": "",
                "ORG_Location_Code":"",
                "ServiceCount": "",
                "ORG_Location_FK": "",
                "IsDeleted": false,
            };
            ServiceCtrl.ePage.Entities.Header.Data.UIJobServices.push(obj);
            ServiceCtrl.ePage.Masters.selectedRow = ServiceCtrl.ePage.Entities.Header.Data.UIJobServices.length-1;
        
            $timeout(function () {
                var objDiv = document.getElementById("ServiceCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            ServiceCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
        };

        function CopyRow() {
            ServiceCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            for(var i = ServiceCtrl.ePage.Entities.Header.Data.UIJobServices.length -1; i >= 0; i--){
                if(ServiceCtrl.ePage.Entities.Header.Data.UIJobServices[i].SingleSelect){
                    var obj = angular.copy(ServiceCtrl.ePage.Entities.Header.Data.UIJobServices[i]);
                    obj.PK = '';
                    obj.CreatedDateTime = '';
                    obj.ModifiedDateTime = '';
                    obj.SingleSelect=false;
                    obj.IsCopied = true;
                    ServiceCtrl.ePage.Entities.Header.Data.UIJobServices.splice(i + 1, 0, obj);
                }
            }
            ServiceCtrl.ePage.Masters.selectedRow = -1;
            ServiceCtrl.ePage.Masters.SelectAll = false;
            ServiceCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
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
                    ServiceCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

                    angular.forEach(ServiceCtrl.ePage.Entities.Header.Data.UIJobServices,function(value,key){
                        if(value.SingleSelect==true && value.PK){
                            apiService.get("eAxisAPI", ServiceCtrl.ePage.Entities.Header.API.ServiceDelete.Url + value.PK).then(function (response) {
                            });
                        }
                    });
            
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        for (var i = ServiceCtrl.ePage.Entities.Header.Data.UIJobServices.length -1; i >= 0; i--){
                            if(ServiceCtrl.ePage.Entities.Header.Data.UIJobServices[i].SingleSelect==true)
                            ServiceCtrl.ePage.Entities.Header.Data.UIJobServices.splice(i,1);
                        }
                        if(ServiceCtrl.ePage.config == 'inward'){
                            ServiceCtrl.ePage.Masters.Config.GeneralValidation(ServiceCtrl.currentInward);
                        }
                        else{
                            ServiceCtrl.ePage.Masters.Config.GeneralValidation(ServiceCtrl.currentOutward);
                        }
                    }
                    toastr.success('Record Removed Successfully');
                    ServiceCtrl.ePage.Masters.selectedRow = -1;
                    ServiceCtrl.ePage.Masters.SelectAll = false;
                    ServiceCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    ServiceCtrl.ePage.Masters.EnableDeleteButton = false;
                }, function () {
                    console.log("Cancelled");
            });
        }
        //#endregion Add,copy,delete row

        //#region  Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ServiceCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (ServiceCtrl.ePage.config == 'inward') {
                if (!fieldvalue) {
                    ServiceCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ServiceCtrl.currentInward.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
                } else {
                    ServiceCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ServiceCtrl.currentInward.label, IsArray, RowIndex, value.ColIndex);
                }
            } else {
                if (!fieldvalue) {
                    ServiceCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ServiceCtrl.currentOutward.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
                } else {
                    ServiceCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ServiceCtrl.currentOutward.label, IsArray, RowIndex, value.ColIndex);
                }
            }
        }

        function RemoveAllLineErrors(){
            for(var i=0;i<ServiceCtrl.ePage.Entities.Header.Data.UIJobServices.length;i++){
                OnChangeValues('value', "E3017", true, i);
            }
            return true;
        }
        //#endregion

        Init();
    }

})();