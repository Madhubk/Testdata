(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickGeneralController", PickGeneralController);

    PickGeneralController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "pickConfig", "helperService", "appConfig", "authService", "$state","confirmation","toastr","$window"];

    function PickGeneralController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, pickConfig, helperService, appConfig, authService, $state,confirmation,toastr,$window) {

        var PickGeneralCtrl = this;

        function Init() {

            var currentPick = PickGeneralCtrl.currentPick[PickGeneralCtrl.currentPick.label].ePage.Entities;

            PickGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Pick_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentPick

            };

            PickGeneralCtrl.ePage.Masters.Config = pickConfig;  
            // For Table
            PickGeneralCtrl.ePage.Masters.EnableForOutward = true;
            PickGeneralCtrl.ePage.Masters.selectedRowForOutward = -1;
            PickGeneralCtrl.ePage.Masters.SearchTableForOutward = '';
            PickGeneralCtrl.ePage.Masters.setSelectedRowForOutward = setSelectedRowForOutward;

            PickGeneralCtrl.ePage.Masters.emptyText = '-';
            PickGeneralCtrl.ePage.Masters.DocumentText = [];
            PickGeneralCtrl.ePage.Masters.DropDownMasterList = {};


            PickGeneralCtrl.ePage.Masters.AddNewOutward = AddNewOutward;
            PickGeneralCtrl.ePage.Masters.AttachOrders = AttachOrders;
            PickGeneralCtrl.ePage.Masters.DeleteOrder = DeleteOrder;
            PickGeneralCtrl.ePage.Masters.EditOrderDetails = EditOrderDetails;
            PickGeneralCtrl.ePage.Masters.SelectedLookupDataWarCode = SelectedLookupDataWarCode;
            PickGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            PickGeneralCtrl.ePage.Masters.DefaultFilter = {
                "WarehouseCode": PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode,
                "WorkOrderStatus":"ENT"
            }

            GetUserBasedGridColumListForOutward();
            GetDropDownList();
            GeneralOperations();
            GetMiscServDetails();
        }

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["PickOption"];
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
                        PickGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        PickGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function GetUserBasedGridColumListForOutward(){
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_PICKOUTWARD",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };
    
            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function(response){
                if(response.data.Response[0]){
                    PickGeneralCtrl.ePage.Masters.UserValue= response.data.Response[0];
                    if(response.data.Response[0].Value!=''){
                        var obj = JSON.parse(response.data.Response[0].Value)
                        PickGeneralCtrl.ePage.Entities.Header.TableProperties.UIWmsOutward = obj;
                        PickGeneralCtrl.ePage.Masters.UserHasValueForOutward =true;
                    }
                }else{
                    PickGeneralCtrl.ePage.Masters.UserValueForOutward = undefined;
                }
            })
        }

        function setSelectedRowForOutward(index){
            PickGeneralCtrl.ePage.Masters.selectedRowForOutward = index;
        }

        function AddNewOutward() {
            var _queryString = {
                PK: null,
                WorkOrderID: null
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/pickorder/" + _queryString, "_blank");
        }

        function EditOrderDetails(obj) {
            if (obj != undefined) {
                var _queryString = {
                    PK: obj.PK,
                    WorkOrderID: obj.WorkOrderID
                };
                _queryString = helperService.encryptData(_queryString);
                $window.open("#/EA/single-record-view/pickorder/" + _queryString, "_blank");
            } else {
                toastr.warning("Select the order for Edit");
            }
        }

        function AttachOrders($item) {
            PickGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            angular.forEach($item,function(value,key){
                apiService.get("eAxisAPI",pickConfig.Entities.Header.API.OutwardGetByID.Url + value.PK).then(function(response){
                    PickGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    if(response.data.Response.UIWmsWorkOrderLine.length > 0){
                        var _isExist = PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutward.some(function (value1, index1) {
                            return value1.PK === response.data.Response.PK;
                        });
                        if (!_isExist) {
                            PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutward.push(response.data.Response.UIWmsOutwardHeader);
                            AddMultipleOrders();
                        } else {
                            toastr.error("Record Already Available...!");
                        }
                    }else{
                        toastr.warning("Order No:" + response.data.Response.UIWmsOutwardHeader.WorkOrderID + " having No Lines...!");
                    }
                })
            })
        }

        function AddMultipleOrders() {
            PickGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            var item = filterObjectUpdate(PickGeneralCtrl.ePage.Entities.Header.Data, "IsModified");
            apiService.post("eAxisAPI", PickGeneralCtrl.ePage.Entities.Header.API.UpdatePick.Url, PickGeneralCtrl.ePage.Entities.Header.Data).then(function (response) {
                if (response.data.Response) {
                    apiService.get("eAxisAPI",pickConfig.Entities.Header.API.GetByID.Url + response.data.Response.PK).then(function (response) {
                        PickGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                        toastr.success("Order Attached Succesfully");
                        PickGeneralCtrl.ePage.Entities.Header.Data = response.data.Response;
                        GetMiscServDetails();
                    });
                }
            });
        }

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }

        function DeleteOrder($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeletePickOrder($item);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeletePickOrder($item) {
            PickGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            angular.forEach(PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickLine,function(value,key){
                if(value.WOD_FK == $item.PK){
                    value.Units=0;
                    value.IsDeleted = true;
                    value.IsModified = true;
                }
            });
            $item.PickNo = ''
            $item.WPK_FK = null;
            $item.PutOrPickStartDateTime = null;
            $item.PutOrPickSlipDateTime  = null;
            $item.PutOrPickCompDateTime  = null;
            $item.WorkOrderStatus = "ENT";
            $item.WorkOrderStatusDesc = "Entered";
            $item.PickOption = "";
            $item.IsDeleted = true;
            apiService.post("eAxisAPI",PickGeneralCtrl.ePage.Entities.Header.API.UpdatePick.Url, PickGeneralCtrl.ePage.Entities.Header.Data).then(function (response) {
                if (response.data.Response) {
                    apiService.get("eAxisAPI", pickConfig.Entities.Header.API.GetByID.Url + response.data.Response.PK).then(function (response) {
                        toastr.success("Record Deleted Successfully");
                        PickGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                        PickGeneralCtrl.ePage.Entities.Header.Data = response.data.Response;
                    });
                }
            });
        }

        function GetMiscServDetails(){
            PickGeneralCtrl.ePage.Entities.Header.GlobalVariables.MiscServDetails = [];
            if(PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutward.length>0){
                PickGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutward.map(function(value,key){
                    var _filter = {
                        "ORG_FK": value.ORG_Client_FK
                    };
        
                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": appConfig.Entities.OrgMiscServ.API.FindAll.FilterID
                    };
        
                    apiService.post("eAxisAPI", appConfig.Entities.OrgMiscServ.API.FindAll.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            var obj={
                                "ORG_FK": response.data.Response[0].ORG_FK,
                                "IMPartAttrib1Name": response.data.Response[0].IMPartAttrib1Name,
                                "IMPartAttrib2Name": response.data.Response[0].IMPartAttrib2Name,
                                "IMPartAttrib3Name": response.data.Response[0].IMPartAttrib3Name,
                                "IMPartAttrib1Type": response.data.Response[0].IMPartAttrib1Type,
                                "IMPartAttrib2Type": response.data.Response[0].IMPartAttrib2Type,
                                "IMPartAttrib3Type": response.data.Response[0].IMPartAttrib3Type,
                            }
                            PickGeneralCtrl.ePage.Entities.Header.GlobalVariables.MiscServDetails.push(obj);
                        }
                        if(PickGeneralCtrl.ePage.Entities.Header.GlobalVariables.MiscServDetails.length == PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutward.length){
                            PickGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                        }
                    });
                })
            }
        }

        function GeneralOperations() {
            if (PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode == null) {
                PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode = "";
            }
            if (PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseName == null) {
                PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseName = "";
            }

            PickGeneralCtrl.ePage.Masters.Warehouse = PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode + ' - ' + PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseName;
            if (PickGeneralCtrl.ePage.Masters.Warehouse == ' - ')
                PickGeneralCtrl.ePage.Masters.Warehouse = "";
        }

        function SelectedLookupDataWarCode(item) {
            PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseName = item.WarehouseName;
            PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode = item.WarehouseCode;
            PickGeneralCtrl.ePage.Masters.Warehouse = PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode + ' - ' + PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseName;

            OnChangeValues(PickGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.WarehouseCode, 'E8003');
        }

        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(PickGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                PickGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), PickGeneralCtrl.currentPick.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                PickGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), PickGeneralCtrl.currentPick.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        Init();
    }
})();