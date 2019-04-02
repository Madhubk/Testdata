(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickSlipController", PickSlipController);

    PickSlipController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "pickConfig", "helperService", "appConfig", "authService", "$state","confirmation","toastr","$window"];

    function PickSlipController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, pickConfig, helperService, appConfig, authService, $state,confirmation,toastr,$window) {

        var PickSlipCtrl = this;

        function Init() {

            var currentPick = PickSlipCtrl.currentPick[PickSlipCtrl.currentPick.label].ePage.Entities;

            PickSlipCtrl.ePage = {
                "Title": "",
                "Prefix": "Pick_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentPick

            };

            PickSlipCtrl.ePage.Masters.emptyText = '-';
            PickSlipCtrl.ePage.Masters.EnableForPickLineSummary = true;
            PickSlipCtrl.ePage.Masters.selectedRowForPickLineSummary = -1;
            PickSlipCtrl.ePage.Masters.SearchTableForPickLineSummary = '';
            PickSlipCtrl.ePage.Masters.setSelectedRowForPickLineSummary = setSelectedRowForPickLineSummary;

            PickSlipCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            PickSlipCtrl.ePage.Masters.CheckFutureDate = CheckFutureDate;
            PickSlipCtrl.ePage.Masters.UpdatePickedDate = UpdatePickedDate;
            PickSlipCtrl.ePage.Masters.UpdatePickedQty = UpdatePickedQty;
            PickSlipCtrl.ePage.Masters.Config = pickConfig;

            // DatePicker
            PickSlipCtrl.ePage.Masters.DatePicker = {};
            PickSlipCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            PickSlipCtrl.ePage.Masters.DatePicker.isOpen = [];
            PickSlipCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            GetUserBasedGridColumListForPickLineSummary();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            PickSlipCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetUserBasedGridColumListForPickLineSummary(){
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_PICKLINESUMMARY",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };
    
            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function(response){
                if(response.data.Response[0]){
                    PickSlipCtrl.ePage.Masters.UserValue= response.data.Response[0];
                    if(response.data.Response[0].Value!=''){
                        var obj = JSON.parse(response.data.Response[0].Value)
                        PickSlipCtrl.ePage.Entities.Header.TableProperties.UIWmsPickLineSummary = obj;
                        PickSlipCtrl.ePage.Masters.UserHasValueForPickLineSummary =true;
                    }
                }else{
                    PickSlipCtrl.ePage.Masters.UserValueForPickLineSummary = undefined;
                }
            })
        }

        function setSelectedRowForPickLineSummary(index){
            PickSlipCtrl.ePage.Masters.selectedRowForPickLineSummary = index;
        }

        
        function UpdatePickedDate(item){
            PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine.map(function(va){
                if(va.PK == item.PK)
                va.IsTouched = true;
            });
            item.IsTouched = true;
            var ReleaseLine = PickSlipCtrl.ePage.Entities.Header.Data.UIWmsReleaseLine.some(function(value,key){
                return value.WPL_FK == item.PK;
            });

            if(!ReleaseLine){
                if(parseFloat(item.PickedQty) > parseFloat(item.Units)){
                    item.PickedQty = '';
                    toastr.warning("Picked Qty should not greater than Allocated Qty");
                }else{
                    if(item.PickedQty && !item.PickedDateTime){
                        item.PickedDateTime = new Date();
                    }
                    if(!item.PickedQty && item.PickedDateTime){
                        item.PickedDateTime = '';
                    }
                }
            }else{
                item.PickedDateTime = null;
                item.PickedQty = '';
                toastr.warning("Release Line Already Added for this line, so PickedQty cannot be updated");
            }
            
        }

        function UpdatePickedQty(item){
            PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine.map(function(va){
                if(va.PK == item.PK)
                va.IsTouched = true;
            });
            item.IsTouched = true;
            var ReleaseLine = PickSlipCtrl.ePage.Entities.Header.Data.UIWmsReleaseLine.some(function(value,key){
                return value.WPL_FK == item.PK;
            });

            if(!ReleaseLine){
                if(item.PickedDateTime && !item.PickedQty){

                    //We have restricted Picked Qty field while UDF is serialized in UI. Adding unit as 1 in controller
                    if(item.IMPartAttrib1Type=="SER" || item.IMPartAttrib2Type=="SER" || item.IMPartAttrib3Type=="SER"){
                        if(item.PartAttrib1 || item.PartAttrib2 || item.PartAttrib3 || item.IsPartAttrib1ReleaseCaptured || 
                            item.IsPartAttrib2ReleaseCaptured || item.IsPartAttrib3ReleaseCaptured){
                                item.PickedQty = 1;
                            }
                    }else{
                        item.PickedQty = item.Units;
                    }
                }
                if(item.PickedQty && !item.PickedDateTime){
                    item.PickedQty = '';
                }
            }else{
                item.PickedDateTime = null;
                item.PickedQty = '';
                toastr.warning("Release Line Already Added for this line, so PickedQty cannot be updated");
            }
            
        }

        function CheckFutureDate(fieldvalue,index) {
            var selectedDate = new Date(fieldvalue);    
            var now = new Date();
            selectedDate.setHours(0,0,0,0);
            now.setHours(0,0,0,0);
            if (selectedDate > now) {
                OnChangeValues(null, 'E8012',true,index)
            } else {
                OnChangeValues('value','E8012',true,index)
            }
        }

        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(PickSlipCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                PickSlipCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), PickSlipCtrl.currentPick.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                PickSlipCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), PickSlipCtrl.currentPick.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        Init();
    }
})();