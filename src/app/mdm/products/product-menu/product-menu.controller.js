(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ProductMenuController", ProductMenuController);

    ProductMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "productConfig", "helperService", "appConfig", "authService", "$state","toastr"];

    function ProductMenuController($scope, $timeout, APP_CONSTANT, apiService, productConfig, helperService, appConfig, authService, $state,toastr) {

        var ProductMenuCtrl = this;

        function Init() {

            var currentProduct = ProductMenuCtrl.currentProduct[ProductMenuCtrl.currentProduct.label].ePage.Entities;

            ProductMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Product_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentProduct

            };

            // function
            ProductMenuCtrl.ePage.Masters.Save = Save;
            ProductMenuCtrl.ePage.Masters.SaveButtonText = "Save";

            ProductMenuCtrl.ePage.Masters.ProductMenu = {};

            // Menu list from configuration
            ProductMenuCtrl.ePage.Masters.ProductMenu.ListSource = ProductMenuCtrl.ePage.Entities.Header.Meta.MenuList;

            ProductMenuCtrl.ePage.Masters.Validation = Validation;
            ProductMenuCtrl.ePage.Masters.Config = productConfig;

            GetInventoryDetails();
        }

        function GetInventoryDetails(){
            if(!ProductMenuCtrl.currentProduct.isNew){
                ProductMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                var _filter = {
                    "PRO_FK": ProductMenuCtrl.ePage.Entities.Header.Data.PK,
                    "PageNumber":"1",
                    "PageSize": "10",
                    "SortType": "ASC",
                    "SortColumn":"WOL_CreatedDateTime",
                };
                
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": ProductMenuCtrl.ePage.Entities.Header.API.Inventory.FilterID
                };
                apiService.post("eAxisAPI", ProductMenuCtrl.ePage.Entities.Header.API.Inventory.Url, _input).then(function SuccessCallback(response) {
                    ProductMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    if(response.data.Response.length>0){
                        ProductMenuCtrl.ePage.Entities.Header.GlobalVariables.CanEditProduct = false;
                        toastr.warning('Product available in inventory. So you can not edit some fields.', {
                            tapToDismiss: false,
                            closeButton: true,
                            timeOut: 20000
                        });
                    }
                });
            }
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            ProductMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (ProductMenuCtrl.ePage.Entities.Header.Validations) {
                ProductMenuCtrl.ePage.Masters.Config.RemoveApiErrors(ProductMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }


            if (_errorcount.length == 0) {
                Save($item);
            } else {
                ProductMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ProductMenuCtrl.currentProduct);
            }
        }

        function Save($item) {
            ProductMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            ProductMenuCtrl.ePage.Masters.DisableSave = true;
            ProductMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIProductGeneral.PK = _input.PK;
                _input.UIProductGeneral.CreatedDateTime = new Date();

                //Converting into Upper Case
                _input.UIProductGeneral.PartNum = _input.UIProductGeneral.PartNum.toUpperCase();
                _input.UIProductGeneral.Desc = _input.UIProductGeneral.Desc.toUpperCase();
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Product').then(function (response) {
                ProductMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                ProductMenuCtrl.ePage.Masters.DisableSave = false;
                ProductMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                if (response.Status === "success") {
                    productConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == '') {
                                value.label = ProductMenuCtrl.ePage.Entities.Header.Data.UIProductGeneral.PartNum;
                                value[ProductMenuCtrl.ePage.Entities.Header.Data.UIProductGeneral.PartNum] = value.New;
                                delete value.New;
                                value.code = ProductMenuCtrl.ePage.Entities.Header.Data.UIProductGeneral.PartNum;
                            }
                        }
                    });
                    
                    var _index = productConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(ProductMenuCtrl.currentProduct[ProductMenuCtrl.currentProduct.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        productConfig.TabList[_index][productConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;

                        //Changing Label name when product code changes
                        if(ProductMenuCtrl.ePage.Entities.Header.Data.UIProductGeneral.PartNum != productConfig.TabList[_index].label){
                            productConfig.TabList[_index].label = ProductMenuCtrl.ePage.Entities.Header.Data.UIProductGeneral.PartNum;
                            productConfig.TabList[_index][productConfig.TabList[_index].label] = productConfig.TabList[_index][productConfig.TabList[_index].code];
                            delete productConfig.TabList[_index][productConfig.TabList[_index].code];
                            productConfig.TabList[_index].code = ProductMenuCtrl.ePage.Entities.Header.Data.UIProductGeneral.PartNum
                        }

                        productConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/products") {
                            helperService.refreshGrid();
                        }
                    }
                    console.log("Success");
                    toastr.success("Saved Successfully...!");
                    if(ProductMenuCtrl.ePage.Masters.SaveAndClose){
                        ProductMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        ProductMenuCtrl.ePage.Masters.SaveAndClose = false;
                    }
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    toastr.error("Could not Save...!");
                    ProductMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        ProductMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ProductMenuCtrl.currentProduct.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                    });
                    if (ProductMenuCtrl.ePage.Entities.Header.Validations != null) {
                        ProductMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ProductMenuCtrl.currentProduct);
                    }
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


        Init();

    }

})();