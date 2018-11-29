(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ProductGeneralController", ProductGeneralController);

    ProductGeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "productConfig", "helperService", "toastr", "$document", "confirmation"];

    function ProductGeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, productConfig, helperService, toastr, $document, confirmation) {

        var ProductGeneralCtrl = this;

        function Init() {

            var currentProduct = ProductGeneralCtrl.currentProduct[ProductGeneralCtrl.currentProduct.label].ePage.Entities;

            ProductGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Product_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentProduct,
            };
            ProductGeneralCtrl.ePage.Masters.Config = productConfig;
            ProductGeneralCtrl.ePage.Masters.ProductMenu = {};
            ProductGeneralCtrl.ePage.Masters.tabSelected = tabSelected;
            ProductGeneralCtrl.ePage.Masters.ProductMenu.ListSource = ProductGeneralCtrl.ePage.Entities.Header.Meta.MenuList;
        }

        function tabSelected(tab, $index, $event) {

            var _index = productConfig.TabList.map(function (value, key) {
                return value[value.label].ePage.Entities.Header.Data.PK
            }).indexOf(ProductGeneralCtrl.currentProduct[ProductGeneralCtrl.currentProduct.label].ePage.Entities.Header.Data.PK);

            if (_index !== -1) {
                if (productConfig.TabList[_index].isNew) {
                    if ($index > 0) {
                        $event.preventDefault();
                        var modalOptions = {
                            closeButtonText: 'No',
                            actionButtonText: 'YES',
                            headerText: 'Save Before Tab Change..',
                            bodyText: 'Do You Want To Save?'
                        };
                        confirmation.showModal({}, modalOptions)
                            .then(function (result) {
                                Validation(ProductGeneralCtrl.currentProduct);
                            }, function () {
                                console.log("Cancelled");
                            });
                    }
                }
            }
        };

        function Validation($item) {
            var _index = productConfig.TabList.map(function (value, key) {
                return value[value.label].ePage.Entities.Header.Data.PK
            }).indexOf(ProductGeneralCtrl.currentProduct[ProductGeneralCtrl.currentProduct.label].ePage.Entities.Header.Data.PK);

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            ProductGeneralCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (ProductGeneralCtrl.ePage.Entities.Header.Validations) {
                ProductGeneralCtrl.ePage.Masters.Config.RemoveApiErrors(ProductGeneralCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                ProductGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(ProductGeneralCtrl.currentProduct);
            }
        }

        function Save($item) {
            ProductGeneralCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            ProductGeneralCtrl.ePage.Masters.IsDisableSave = true;
            ProductGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIProductGeneral.PK = _input.PK;
                _input.UIProductGeneral.CreatedDateTime = new Date();
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Product').then(function (response) {
                ProductGeneralCtrl.ePage.Masters.SaveButtonText = "Save";
                ProductGeneralCtrl.ePage.Masters.IsDisableSave = false;
                ProductGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;

                if (response.Status === "success") {

                    productConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == '') {
                                value.label = ProductGeneralCtrl.ePage.Entities.Header.Data.UIProductGeneral.PartNum;
                                value[ProductGeneralCtrl.ePage.Entities.Header.Data.UIProductGeneral.PartNum] = value.New;
                                delete value.New;
                            }
                        }
                    });
                    
                    var _index = productConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(ProductGeneralCtrl.currentProduct[ProductGeneralCtrl.currentProduct.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        productConfig.TabList[_index][productConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        productConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/products") {
                            helperService.refreshGrid();
                        }
                    }
                    console.log("Success");
                    toastr.success("Saved Successfully...!");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    toastr.error("Could not Save...!");
                    ProductGeneralCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        ProductGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ProductGeneralCtrl.currentProduct.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                    });
                    if (ProductGeneralCtrl.ePage.Entities.Header.Validations != null) {
                        ProductGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(ProductGeneralCtrl.currentProduct);
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