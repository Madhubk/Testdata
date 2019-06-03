(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickfaceController", PickfaceController);

    PickfaceController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "productConfig", "helperService", "toastr", "$document", "confirmation","$filter"];

    function PickfaceController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, productConfig, helperService, toastr, $document, confirmation,$filter) {

        var PickfaceCtrl = this;

        function Init() {

            var currentProduct = PickfaceCtrl.currentProduct[PickfaceCtrl.currentProduct.label].ePage.Entities;

            PickfaceCtrl.ePage = {
                "Title": "",
                "Prefix": "Product_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentProduct,
            };

            PickfaceCtrl.ePage.Masters.Config = productConfig;
            //For table
            PickfaceCtrl.ePage.Masters.SelectAll = false;
            PickfaceCtrl.ePage.Masters.EnableDeleteButton = false;
            PickfaceCtrl.ePage.Masters.EnableCopyButton = false;
            PickfaceCtrl.ePage.Masters.Enable = true;
            PickfaceCtrl.ePage.Masters.selectedRow = -1;
            PickfaceCtrl.ePage.Masters.emptyText = '-';
            PickfaceCtrl.ePage.Masters.SearchTable = '';

            PickfaceCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            PickfaceCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            PickfaceCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            PickfaceCtrl.ePage.Masters.AddNewRow = AddNewRow;
            PickfaceCtrl.ePage.Masters.CopyRow = CopyRow;
            PickfaceCtrl.ePage.Masters.RemoveRow = RemoveRow;

            PickfaceCtrl.ePage.Masters.SelectedLookupDataClient = SelectedLookupDataClient;
            PickfaceCtrl.ePage.Masters.SelectedLookupDataWarehouse = SelectedLookupDataWarehouse;
            PickfaceCtrl.ePage.Masters.SelectedLookupLocation = SelectedLookupLocation;
            PickfaceCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            PickfaceCtrl.ePage.Masters.Replenish = Replenish;
            GetUserBasedGridColumList();
            GetPickFaceDetails();
        }

         //#region User Based Table Column
         function GetUserBasedGridColumList(){
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_PRODUCTPICKFACE",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };
    
            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function(response){
                if(response.data.Response[0]){
                    PickfaceCtrl.ePage.Masters.UserValue= response.data.Response[0];
                    if(response.data.Response[0].Value!=''){
                        var obj = JSON.parse(response.data.Response[0].Value)
                        PickfaceCtrl.ePage.Entities.Header.TableProperties.UIWMSPickFace = obj;
                        PickfaceCtrl.ePage.Masters.UserHasValue =true;
                    }
                }else{
                    PickfaceCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }
        //#endregion
            
        //#region General
        function GetPickFaceDetails() {
            PickfaceCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            var _filter = {
                "OSP_FK": PickfaceCtrl.ePage.Entities.Header.Data.PK,
                "SortColumn": "WPF_ReplenishMinimum",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": PickfaceCtrl.ePage.Entities.Header.API.WMSPickFace.FindAll.FilterID
            };
            apiService.post("eAxisAPI", PickfaceCtrl.ePage.Entities.Header.API.WMSPickFace.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PickfaceCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace = response.data.Response;
                    //Order By
                    PickfaceCtrl.ePage.Entities.Header.Data.PickFace = $filter('orderBy')(PickfaceCtrl.ePage.Entities.Header.Data.PickFace, 'CreatedDateTime');

                    angular.forEach(PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace, function (value, key) {
                        // client
                        if (value.ClientCode == null) {
                            value.ClientCode = "";
                        }
                        if (value.ClientName == null) {
                            value.ClientName = "";
                        }
                        PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace[key].Client = value.ClientCode + " - " + value.ClientName;
                        if(PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace[key].Client==' - '){
                            PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace[key].Client = '';
                        }
                        // warehouse
                        if (value.WarehouseCode == null) {
                            value.WarehouseCode = "";
                        }
                        if (value.WarehouseName == null) {
                            value.WarehouseName = "";
                        }
                        PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace[key].Warehouse = value.WarehouseCode + " - " + value.WarehouseName;
                        if(PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace[key].Warehouse==' - '){
                            PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace[key].Warehouse ='';
                        }
                    });

                    PickfaceCtrl.ePage.Entities.Header.GlobalVariables.CopyofCurrentObject.UIWMSPickFace = angular.copy(PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace);
                }
            });
        }
        //#endregion
        
        //#region checkbox selection
        function SelectAllCheckBox(){
            angular.forEach(PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace, function (value, key) {
            if (PickfaceCtrl.ePage.Masters.SelectAll){
                value.SingleSelect = true;
                PickfaceCtrl.ePage.Masters.EnableDeleteButton = true;
                PickfaceCtrl.ePage.Masters.EnableCopyButton = true;
            }
            else{
                value.SingleSelect = false;
                PickfaceCtrl.ePage.Masters.EnableDeleteButton = false;
                PickfaceCtrl.ePage.Masters.EnableCopyButton = false;
            }
            });
        }

        function SingleSelectCheckBox() {
            var Checked = PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace.some(function (value, key) {
                if(!value.SingleSelect)
                return true;
            });
            if (Checked) {
                PickfaceCtrl.ePage.Masters.SelectAll = false;
            } else {
                PickfaceCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                PickfaceCtrl.ePage.Masters.EnableDeleteButton = true;
                PickfaceCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                PickfaceCtrl.ePage.Masters.EnableDeleteButton = false;
                PickfaceCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }
        //#endregion checkbox selection

        //#region Add,copy,delete row

        function setSelectedRow(index){
            PickfaceCtrl.ePage.Masters.selectedRow = index;
        }

        function AddNewRow() {
            PickfaceCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            var obj = {
                "PK": "",
                "ClientCode": "",
                "ClientName": "",
                "Client": "",
                "ORG_Client_FK":"",
                "WarehouseCode": "",
                "WarehouseName": "",
                "WAR_FK":"",
                "Warehouse": "",
                "Location": "",
                "WLO_FK":"",
                "ReplenishMinimum": "",
                "ReplenishMaximum": "",
                "ReplenishmentMultiple": "",
                "IsDeleted": false,
            };
            PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace.push(obj);
            PickfaceCtrl.ePage.Masters.selectedRow = PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace.length-1;
        
            $timeout(function () {
                var objDiv = document.getElementById("PickfaceCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            PickfaceCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
        };

        function CopyRow() {
            PickfaceCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            for(var i = PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace.length -1; i >= 0; i--){
                if(PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace[i].SingleSelect){
                    var obj = angular.copy(PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace[i]);
                    obj.PK = '';
                    obj.CreatedDateTime = '';
                    obj.ModifiedDateTime = '';
                    obj.SingleSelect=false;
                    obj.IsCopied = true;
                    PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace.splice(i + 1, 0, obj);
                }
            }
            PickfaceCtrl.ePage.Masters.selectedRow = -1;
            PickfaceCtrl.ePage.Masters.SelectAll = false;
            PickfaceCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
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
                    PickfaceCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

                    angular.forEach(PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace,function(value,key){
                        if(value.SingleSelect==true && value.PK){
                            apiService.get("eAxisAPI", PickfaceCtrl.ePage.Entities.Header.API.WMSPickFace.Delete.Url + value.PK).then(function (response) {
                            });
                        }
                    });
            
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        for (var i = PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace.length -1; i >= 0; i--){
                            if(PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace[i].SingleSelect==true)
                            PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace.splice(i,1);
                        }
                        PickfaceCtrl.ePage.Masters.Config.GeneralValidation(PickfaceCtrl.currentProduct);
                    }
                    toastr.success('Record Removed Successfully');
                    PickfaceCtrl.ePage.Masters.selectedRow = -1;
                    PickfaceCtrl.ePage.Masters.SelectAll = false;
                    PickfaceCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    PickfaceCtrl.ePage.Masters.EnableDeleteButton = false;
                }, function () {
                    console.log("Cancelled");
            });
        }
        //#endregion Add,copy,delete row

        //#region SelectedLookup
        function SelectedLookupDataClient(item, index) {
            PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace[index].Client = item.Code + ' - ' + item.FullName;
            OnChangeValues(PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace[index].Client, 'E7027', true, index);
        }

        function SelectedLookupDataWarehouse(item, index) {
            PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace[index].Warehouse = item.WarehouseCode + ' - ' + item.WarehouseName;
            OnChangeValues(PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace[index].Warehouse, 'E7028', true, index);
        }

        function SelectedLookupLocation(item, index) {
            OnChangeValues(item.Location, 'E7029', true, index);
        }
        //#endregion
        
        //#region Validation
        function RemoveAllLineErrors(){
            for(var i=0;i<PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace.length;i++){
                OnChangeValues('value', "E7031", true, i);
                OnChangeValues('value', "E7027", true, i);
                OnChangeValues('value', "E7028", true, i);
                OnChangeValues('value', "E7029", true, i);
                OnChangeValues('value', "E7033", true, i);
                OnChangeValues('value', "E7034", true, i);
                OnChangeValues('value', "E7035", true, i);
                OnChangeValues('value', "E7036", true, i);
            }
            return true;
        }
        function Replenish(item, index) {
            if (item.ReplenishMinimum == '0')
                OnChangeValues(null, 'E7035', true, index);
            else
                OnChangeValues('value', 'E7035', true, index);

            if (parseInt(item.ReplenishMinimum, 10) > parseInt(item.ReplenishMaximum, 10))
                OnChangeValues(null, 'E7036', true, index);
            else
                OnChangeValues('value', 'E7036', true, index);
        }

        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(PickfaceCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                PickfaceCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, PickfaceCtrl.currentProduct.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                PickfaceCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, PickfaceCtrl.currentProduct.label, IsArray, RowIndex, value.ColIndex);
            }
        }
        //#endregion
        Init();
    }

})();