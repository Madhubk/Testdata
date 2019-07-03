(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BomController", BomController);

    BomController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "productConfig", "helperService", "toastr", "$document","confirmation","$filter"];

    function BomController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, productConfig, helperService, toastr, $document,confirmation,$filter) {

        var BomCtrl = this;

        function Init() {

            var currentProduct = BomCtrl.currentProduct[BomCtrl.currentProduct.label].ePage.Entities;
            BomCtrl.ePage = {
                "Title": "",
                "Prefix": "Product_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentProduct,
            };
             //For table
            BomCtrl.ePage.Masters.Config = productConfig;

            BomCtrl.ePage.Masters.SelectAll = false;
            BomCtrl.ePage.Masters.EnableDeleteButton = false;
            BomCtrl.ePage.Masters.EnableCopyButton = false;
            BomCtrl.ePage.Masters.Enable = true;
            BomCtrl.ePage.Masters.selectedRow = -1;
            BomCtrl.ePage.Masters.emptyText = '-';
            BomCtrl.ePage.Masters.SearchTable = '';

            BomCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            BomCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            BomCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            BomCtrl.ePage.Masters.AddNewRow = AddNewRow;
            BomCtrl.ePage.Masters.CopyRow = CopyRow;
            BomCtrl.ePage.Masters.RemoveRow = RemoveRow;

            BomCtrl.ePage.Masters.DropDownMasterList = {};

            BomCtrl.ePage.Masters.SelectedLookupComponent = SelectedLookupComponent;

            GetUserBasedGridColumList();
            GetDropdownList();
            GetBOMDetails();
        }

         //#region User Based Table Column
         function GetUserBasedGridColumList(){
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_PRODUCTBOM",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };
    
            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function(response){
                if(response.data.Response[0]){
                    BomCtrl.ePage.Masters.UserValue= response.data.Response[0];
                    if(response.data.Response[0].Value!=''){
                        var obj = JSON.parse(response.data.Response[0].Value)
                        BomCtrl.ePage.Entities.Header.TableProperties.UIOrgPartBOM = obj;
                        BomCtrl.ePage.Masters.UserHasValue =true;
                    }
                }else{
                    BomCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }
        //#endregion
            
        //#region  General
        function GetBOMDetails() {
            BomCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            var _filter = {
                "OSP_MainProduct_FK": BomCtrl.ePage.Entities.Header.Data.PK,
                "SortColumn": "OPB_PAC_NKPackType",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PrdProductBOM.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.PrdProductBOM.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM = response.data.Response;
                    
                    BomCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    //Order By
                    BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM = $filter('orderBy')(BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM, 'CreatedDateTime');

                    angular.forEach(BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM, function (value, key) {
                        // Component
                        if (value.ComponentPart == null) {
                            value.ComponentPart = "";
                        }
                        if (value.ComponentDescription == null) {
                            value.ComponentDescription = "";
                        }
                        BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM[key].Component = value.ComponentPart + " - " + value.ComponentDescription;
                        if (BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM[key].Component == ' - ') {
                            BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM[key].Component = "";
                        }
                    });
                }
            });
            
            BomCtrl.ePage.Entities.Header.GlobalVariables.CopyofCurrentObject.UIOrgPartBOM = angular.copy(BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM);
        }

        function GetDropdownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["INW_LINE_UQ", "WMSYESNO","WMSTRUEFALSE"];
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
                        BomCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        BomCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
                angular.forEach(BomCtrl.ePage.Masters.DropDownMasterList.WMSTRUEFALSE.ListSource,function(value,key){
                    if(value.Key=='true'){
                        value.Key=true;
                    }
                    if(value.Key=='false'){
                        value.Key=false;
                    }
                });
            });

        }

        function SelectedLookupComponent(item, index) {
            BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM[index].Component = item.PartNum+' - '+item.Desc;
        }
        //#endregion

        //#region checkbox selection
        function SelectAllCheckBox(){
            angular.forEach(BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM, function (value, key) {
            if (BomCtrl.ePage.Masters.SelectAll){
                value.SingleSelect = true;
                BomCtrl.ePage.Masters.EnableDeleteButton = true;
                BomCtrl.ePage.Masters.EnableCopyButton = true;
            }
            else{
                value.SingleSelect = false;
                BomCtrl.ePage.Masters.EnableDeleteButton = false;
                BomCtrl.ePage.Masters.EnableCopyButton = false;
            }
            });
        }

        function SingleSelectCheckBox() {
            var Checked = BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM.some(function (value, key) {
                if(!value.SingleSelect)
                return true;
            });
            if (Checked) {
                BomCtrl.ePage.Masters.SelectAll = false;
            } else {
                BomCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                BomCtrl.ePage.Masters.EnableDeleteButton = true;
                BomCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                BomCtrl.ePage.Masters.EnableDeleteButton = false;
                BomCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }
        //#endregion checkbox selection

        //#region Add,copy,delete row

        function setSelectedRow(index){
            BomCtrl.ePage.Masters.selectedRow = index;
        }

        function AddNewRow() {
            BomCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            var obj = {
                "PK":null,
                "HasChildren": null,
                "ComponentPart": null,
                "ComponentDescription": null,
                "OSP_Component_FK":null,
                "Component":null,
                "PAC_NKPackType": null,
                "ComponentQty": null,
                "CanReuse": null,
                "IsDeleted": "false"
            };
            BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM.push(obj);
            BomCtrl.ePage.Masters.selectedRow = BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM.length-1;
        
            $timeout(function () {
                var objDiv = document.getElementById("BomCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            BomCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
        };

        function CopyRow() {
            BomCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            for(var i = BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM.length -1; i >= 0; i--){
                if(BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM[i].SingleSelect){
                    var obj = angular.copy(BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM[i]);
                    obj.PK = null;
                    obj.CreatedDateTime = null;
                    obj.ModifiedDateTime = null;
                    obj.SingleSelect=false;
                    obj.IsCopied = true;
                    BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM.splice(i + 1, 0, obj);
                }
            }
            BomCtrl.ePage.Masters.selectedRow = -1;
            BomCtrl.ePage.Masters.SelectAll = false;
            BomCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
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
                    BomCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

                    angular.forEach(BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM,function(value,key){
                        if(value.SingleSelect==true && value.PK){
                            apiService.get("eAxisAPI", appConfig.Entities.PrdProductBOM.API.Delete.Url + value.PK).then(function (response) {
                            });
                        }
                    });
            
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        for (var i = BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM.length -1; i >= 0; i--){
                            if(BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM[i].SingleSelect==true)
                            BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM.splice(i,1);
                        }
                        BomCtrl.ePage.Masters.Config.GeneralValidation(BomCtrl.currentProduct);
                    }
                    toastr.success('Record Removed Successfully');
                    BomCtrl.ePage.Masters.selectedRow = -1;
                    BomCtrl.ePage.Masters.SelectAll = false;
                    BomCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    BomCtrl.ePage.Masters.EnableDeleteButton = false;
                }, function () {
                    console.log("Cancelled");
            });
        }
        //#endregion Add,copy,delete row

        //#region  validation
        function RemoveAllLineErrors(){
            return true;
        }
        //#endregion

    Init();
    }

})();