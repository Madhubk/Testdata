(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ProductMenuController", ProductMenuController);

    ProductMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "productConfig", "helperService", "appConfig", "authService", "$state"];

    function ProductMenuController($scope, $timeout, APP_CONSTANT, apiService, productConfig, helperService, appConfig, authService, $state) {

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

            // Standard Menu Configuration and Data
            ProductMenuCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.OrgSupplierPart;
            ProductMenuCtrl.ePage.Masters.StandardMenuInput.obj = ProductMenuCtrl.currentProduct;
            // function
            ProductMenuCtrl.ePage.Masters.Save = Save;
            ProductMenuCtrl.ePage.Masters.SaveButtonText = "Save";

            ProductMenuCtrl.ePage.Masters.ProductMenu = {};

            // Menu list from configuration
            ProductMenuCtrl.ePage.Masters.ProductMenu.ListSource = ProductMenuCtrl.ePage.Entities.Header.Meta.MenuList;

            ProductMenuCtrl.ePage.Masters.Validation = Validation;
            ProductMenuCtrl.ePage.Masters.Config = productConfig;

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
            ProductMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIProductGeneral.PK = _input.PK;
                _input.UIProductGeneral.CreatedDateTime = new Date();
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Product').then(function (response) {
                ProductMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                ProductMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                if (response.Status === "success") {
                    productConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == '') {
                                value.label = ProductMenuCtrl.ePage.Entities.Header.Data.UIProductGeneral.PartNum;
                                value[ProductMenuCtrl.ePage.Entities.Header.Data.UIProductGeneral.PartNum] = value.New;
                                delete value.New;
                            }
                        }
                    });
                    
                    var _index = productConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(ProductMenuCtrl.currentProduct[ProductMenuCtrl.currentProduct.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        productConfig.TabList[_index][productConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        productConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/products") {
                            helperService.refreshGrid();
                        }
                    }
                    console.log("Success");
                    if(ProductMenuCtrl.ePage.Masters.SaveAndClose){
                        ProductMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        ProductMenuCtrl.ePage.Masters.SaveAndClose = false;
                    }
                } else if (response.Status === "failed") {
                    console.log("Failed");
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