(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ProductsController", ProductsController);

    ProductsController.$inject = ["$scope","$location", "APP_CONSTANT", "authService", "apiService", "helperService", "productConfig", "$timeout", "toastr", "appConfig","confirmation","$uibModal","$injector"];

    function ProductsController($scope,$location, APP_CONSTANT, authService, apiService, helperService, productConfig, $timeout, toastr, appConfig,confirmation,$uibModal,$injector) {

        var ProductsCtrl = this;

        function Init() {

            ProductsCtrl.ePage = {
                "Title": "",
                "Prefix": "Product",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": productConfig.Entities
            };

            ProductsCtrl.ePage.Masters.taskName = "products";
            ProductsCtrl.ePage.Masters.dataentryName = "OrgSupplierPart";
            ProductsCtrl.ePage.Masters.TabList = [];
            productConfig.TabList = [];
            ProductsCtrl.ePage.Masters.activeTabIndex = 0;
            ProductsCtrl.ePage.Masters.isNewProductClicked = false;
            ProductsCtrl.ePage.Masters.IsTabClick = false;

            //functions
            ProductsCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            ProductsCtrl.ePage.Masters.AddTab = AddTab;
            ProductsCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            ProductsCtrl.ePage.Masters.RemoveTab = RemoveTab;
            ProductsCtrl.ePage.Masters.CreateNewProduct = CreateNewProduct;
            ProductsCtrl.ePage.Masters.Config = productConfig;
            ProductsCtrl.ePage.Masters.SaveandClose = SaveandClose;
            ProductsCtrl.ePage.Masters.BulkUploadOption = BulkUploadOption;

            ProductsCtrl.ePage.Masters.MenuVisibleType = authService.getUserInfo().MenuType;
            productConfig.ValidationFindall();

        }

        function SelectedGridRow($item) {

            if ($item.action === "link" || $item.action === "dblClick") {
                ProductsCtrl.ePage.Masters.AddTab($item.data, false);
            }else if ($item.action === "new") {
                CreateNewProduct();
            }
        }

        function AddTab(currentProduct, isNew) {
            ProductsCtrl.ePage.Masters.currentProduct = undefined
            
            var _isExist = ProductsCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentProduct.entity.PartNum)
                        return true;
                    else
                        return false;
                } else {
                    if (value.label === "New")
                        return true;
                    else
                        return false;
                }
            });

            if (!_isExist) {
                ProductsCtrl.ePage.Masters.IsTabClick = true;
                var _currentProduct = undefined;
                if (!isNew) {
                    _currentProduct = currentProduct.entity;
                } else {
                    _currentProduct = currentProduct;
                }

                productConfig.GetTabDetails(_currentProduct, isNew).then(function (response) {
                    ProductsCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        ProductsCtrl.ePage.Masters.activeTabIndex = ProductsCtrl.ePage.Masters.TabList.length;
                        ProductsCtrl.ePage.Masters.CurrentActiveTab(currentProduct.entity.PartNum);
                        ProductsCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Product already opened ');
            }
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            ProductsCtrl.ePage.Masters.currentProduct = currentTab;
        }

        function RemoveTab(event, index, currentProduct) {
            event.preventDefault();
            event.stopPropagation();
            var currentProduct = currentProduct[currentProduct.label].ePage.Entities;
            ProductsCtrl.ePage.Masters.TabList.splice(index, 1);

            apiService.get("eAxisAPI", ProductsCtrl.ePage.Entities.Header.API.SessionClose.Url + currentProduct.Header.Data.PK).then(function(response){
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }

        function CreateNewProduct() {
            var _isExist = ProductsCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if(!_isExist){
                ProductsCtrl.ePage.Masters.isNewProductClicked = true;

                helperService.getFullObjectUsingGetById(ProductsCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.Response.UIProductGeneral,
                            data: response.data.Response.Response,
                            Validations:response.data.Response.Validations
                        };
                        ProductsCtrl.ePage.Masters.AddTab(_obj, true);
                        ProductsCtrl.ePage.Masters.isNewProductClicked = false;
                    } else {
                        console.log("Empty New Product response");
                    }
                });
            }else {
                toastr.info("New Record Already Opened...!");
            }
            
        }

        function SaveandClose( index, currentProduct){

            var currentProduct = currentProduct[currentProduct.label].ePage.Entities;
            ProductsCtrl.ePage.Masters.TabList.splice(index-1, 1);
            ProductsCtrl.ePage.Masters.Config.SaveAndClose = false;
            
            apiService.get("eAxisAPI", ProductsCtrl.ePage.Entities.Header.API.SessionClose.Url + currentProduct.Header.Data.PK).then(function(response){
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
            ProductsCtrl.ePage.Masters.activeTabIndex = 0;
        }

         
        function BulkUploadOption(){
            $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "general-edit right bulkuploadproduct",
                scope: $scope,

                templateUrl: 'app/mdm/products/product-bulk-upload/product-bulk-upload.html',
                controller: 'ProductBulkUploadController as ProductBulkUploadCtrl',
                bindToController: true,
            });
        }

      

        Init();

    }

})();

