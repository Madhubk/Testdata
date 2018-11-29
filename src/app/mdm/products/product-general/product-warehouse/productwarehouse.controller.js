(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ProductWarehouseController", ProductWarehouseController);

    ProductWarehouseController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "productConfig", "helperService", "toastr", "$document", "$window", "confirmation","$filter"];

    function ProductWarehouseController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, productConfig, helperService, toastr, $document, $window, confirmation,$filter) {

        var ProductWarehouseCtrl = this;

        function Init() {

            var currentProduct = ProductWarehouseCtrl.currentProduct[ProductWarehouseCtrl.currentProduct.label].ePage.Entities;

            ProductWarehouseCtrl.ePage = {
                "Title": "",
                "Prefix": "Product_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentProduct,
            };

            ProductWarehouseCtrl.ePage.Masters.Config = productConfig;

            //For table
            ProductWarehouseCtrl.ePage.Masters.SelectAll = false;
            ProductWarehouseCtrl.ePage.Masters.EnableDeleteButton = false;
            ProductWarehouseCtrl.ePage.Masters.EnableCopyButton = false;
            ProductWarehouseCtrl.ePage.Masters.Enable = true;
            ProductWarehouseCtrl.ePage.Masters.selectedRow = -1;
            ProductWarehouseCtrl.ePage.Masters.emptyText = '-';
            ProductWarehouseCtrl.ePage.Masters.SearchTable = '';

            ProductWarehouseCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            ProductWarehouseCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            ProductWarehouseCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ProductWarehouseCtrl.ePage.Masters.AddNewRow = AddNewRow;
            ProductWarehouseCtrl.ePage.Masters.CopyRow = CopyRow;
            ProductWarehouseCtrl.ePage.Masters.RemoveRow = RemoveRow;

            ProductWarehouseCtrl.ePage.Masters.DropDownMasterList = {};

            ProductWarehouseCtrl.ePage.Masters.SelectedLookupDataClient = SelectedLookupDataClient;
            ProductWarehouseCtrl.ePage.Masters.SelectedLookupDataWarehouse = SelectedLookupDataWarehouse;
            ProductWarehouseCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            GetUserBasedGridColumList();
            GetProductWarehouseDetails();
            GetDropDownList();
        }

         //#region User Based Table Column
         function GetUserBasedGridColumList(){
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_PRODUCTWAREHOUSE",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };
    
            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function(response){
                if(response.data.Response[0]){
                    ProductWarehouseCtrl.ePage.Masters.UserValue= response.data.Response[0];
                    if(response.data.Response[0].Value!=''){
                        var obj = JSON.parse(response.data.Response[0].Value)
                        ProductWarehouseCtrl.ePage.Entities.Header.TableProperties.UIWarehouse = obj;
                        ProductWarehouseCtrl.ePage.Masters.UserHasValue =true;
                    }
                }else{
                    ProductWarehouseCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }
        //#endregion
            
        //#region General
        function GetProductWarehouseDetails() {
            ProductWarehouseCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            var _filter = {
                "OSP_FK": ProductWarehouseCtrl.ePage.Entities.Header.Data.PK,
                "SortColumn": "PWC_StockTakeCycle",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ProductWarehouseCtrl.ePage.Entities.Header.API.WMSProductParamsByWmsAndClient.FindAll.FilterID
            };
            apiService.post("eAxisAPI", ProductWarehouseCtrl.ePage.Entities.Header.API.WMSProductParamsByWmsAndClient.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProductWarehouseCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    
                    ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse = response.data.Response;
                    //Order By
                    ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse = $filter('orderBy')(ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse, 'CreatedDateTime');

                    angular.forEach(ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse, function (value, key) {
                        // client 
                        if (value.ORG_Code == null) {
                            value.ORG_Code = "";
                        }
                        if (value.ORG_FullName == null) {
                            value.ORG_FullName = "";
                        }
                        ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse[key].Client = value.ORG_Code + " - " + value.ORG_FullName;
                        // warehouse
                        if (value.WAR_WarehouseCode == null) {
                            value.WAR_WarehouseCode = "";
                        }
                        if (value.WAR_WarehouseName == null) {
                            value.WAR_WarehouseName = "";
                        }
                        ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse[key].Warehouse = value.WAR_WarehouseCode + " - " + value.WAR_WarehouseName;
                    });
                }
            });
        }

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["INW_LINE_UQ", "StockTakeCycle"];
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
                        ProductWarehouseCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ProductWarehouseCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        //#endregion

        //#region  SelectedLookup
        function SelectedLookupDataClient(item, index) {
            ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse[index].Client = item.Code + ' - ' + item.FullName;
            OnChangeValues(ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse[index].Client, 'E7025', true, index);
        }

        function SelectedLookupDataWarehouse(item, index) {
            ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse[index].Warehouse = item.WarehouseCode + ' - ' + item.WarehouseName;
            OnChangeValues(ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse[index].Warehouse, 'E7026', true, index);
        }
        //#endregion
        
        //#region checkbox selection
        function SelectAllCheckBox(){
            angular.forEach(ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse, function (value, key) {
            if (ProductWarehouseCtrl.ePage.Masters.SelectAll){
                value.SingleSelect = true;
                ProductWarehouseCtrl.ePage.Masters.EnableDeleteButton = true;
                ProductWarehouseCtrl.ePage.Masters.EnableCopyButton = true;
            }
            else{
                value.SingleSelect = false;
                ProductWarehouseCtrl.ePage.Masters.EnableDeleteButton = false;
                ProductWarehouseCtrl.ePage.Masters.EnableCopyButton = false;
            }
            });
        }

        function SingleSelectCheckBox() {
            var Checked = ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse.some(function (value, key) {
                if(!value.SingleSelect)
                return true;
            });
            if (Checked) {
                ProductWarehouseCtrl.ePage.Masters.SelectAll = false;
            } else {
                ProductWarehouseCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                ProductWarehouseCtrl.ePage.Masters.EnableDeleteButton = true;
                ProductWarehouseCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                ProductWarehouseCtrl.ePage.Masters.EnableDeleteButton = false;
                ProductWarehouseCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }
    //#endregion checkbox selection

        //#region Add,copy,delete row

        function setSelectedRow(index){
            ProductWarehouseCtrl.ePage.Masters.selectedRow = index;
        }

        function AddNewRow() {
            ProductWarehouseCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            var obj = {
                "PK": "",
                "ORG_Code": "",
                "ORG_FullName": "",
                "Client": "",
                "ORG_FK": "",
                "WAR_WarehouseCode": "",
                "WAR_WarehouseName": "",
                "Warehouse": "",
                "WAR_FK": "",
                "WAA_PutAwayAreaName": "",
                "WAA_PutawayArea_FK": "",
                "WAA_StagingAreaBOMName": "",
                "PAC_NKReceivedPackType": "",
                "PAC_NKReleasedPackType": "",
                "StockTakeCycle": "",
                "ExpiryNotificationPeriod": "",
                "MaximumShelfLife": "",
                "ReplenishmentMinimum": "",
                "EconomicQuantity": "",
                "ReplenishmentMultiple": "",
                "UQ": "",
                "ABCCategory": "",
                "ABCPeriod": "",
                "PickGroup": "",
                "IsDeleted": false
            };
            ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse.push(obj);
            ProductWarehouseCtrl.ePage.Masters.selectedRow = ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse.length-1;
        
            $timeout(function () {
                var objDiv = document.getElementById("ProductWarehouseCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            ProductWarehouseCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
        };

        function CopyRow() {
            ProductWarehouseCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            for(var i = ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse.length -1; i >= 0; i--){
                if(ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse[i].SingleSelect){
                    var obj = angular.copy(ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse[i]);
                    obj.PK = '';
                    obj.CreatedDateTime = '';
                    obj.ModifiedDateTime = '';
                    obj.SingleSelect=false;
                    obj.IsCopied = true;
                    ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse.splice(i + 1, 0, obj);
                }
            }
            ProductWarehouseCtrl.ePage.Masters.selectedRow = -1;
            ProductWarehouseCtrl.ePage.Masters.SelectAll = false;
            ProductWarehouseCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
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
                    ProductWarehouseCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

                    angular.forEach(ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse,function(value,key){
                        if(value.SingleSelect==true && value.PK){
                            apiService.get("eAxisAPI", ProductWarehouseCtrl.ePage.Entities.Header.API.WMSProductParamsByWmsAndClient.Delete.Url + value.PK).then(function (response) {
                            });
                        }
                    });
            
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        for (var i = ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse.length -1; i >= 0; i--){
                            if(ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse[i].SingleSelect==true)
                            ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse.splice(i,1);
                        }
                        ProductWarehouseCtrl.ePage.Masters.Config.GeneralValidation(ProductWarehouseCtrl.currentProduct);
                    }
                    toastr.success('Record Removed Successfully');
                    ProductWarehouseCtrl.ePage.Masters.selectedRow = -1;
                    ProductWarehouseCtrl.ePage.Masters.SelectAll = false;
                    ProductWarehouseCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    ProductWarehouseCtrl.ePage.Masters.EnableDeleteButton = false;
                }, function () {
                    console.log("Cancelled");
            });
        }
    //#endregion Add,copy,delete row

        //#region Validation
        function RemoveAllLineErrors() {
            for (var i = 0; i < ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse.length; i++) {
                OnChangeValues('value', "E7030", true, i);
                OnChangeValues('value', "E7025", true, i);
                OnChangeValues('value', "E7026", true, i);
            }
            return true;
        }

        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ProductWarehouseCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                ProductWarehouseCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ProductWarehouseCtrl.currentProduct.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                ProductWarehouseCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ProductWarehouseCtrl.currentProduct.label, IsArray, RowIndex, value.ColIndex);
            }
        }
        //#endregion
        
        Init();
    }

})();