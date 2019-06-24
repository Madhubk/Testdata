(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ProductMenuController", ProductMenuController);

    ProductMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "productConfig", "helperService", "appConfig", "authService", "$state","toastr","$q"];

    function ProductMenuController($scope, $timeout, APP_CONSTANT, apiService, productConfig, helperService, appConfig, authService, $state,toastr,$q) {

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

            ProductMenuCtrl.ePage.Entities.Header.GlobalVariables.CopyofCurrentObject = angular.copy(ProductMenuCtrl.ePage.Entities.Header.Data);

            GetInventoryDetails();
        }


        function GetInventoryDetails(){
            if(!ProductMenuCtrl.currentProduct.isNew){
                var LoopPromises = [];
                angular.forEach(ProductMenuCtrl.ePage.Entities.Header.Data.UIOrgPartRelation,function(value,key){
                    ProductMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true
                    var def = $q.defer();
                    LoopPromises.push(def.promise);

                    var _filter = {
                        "PRO_FK": ProductMenuCtrl.ePage.Entities.Header.Data.PK,
                        "ORG_FK":value.ORG_FK,
                        "PageNumber":"1",
                        "PageSize": "1",
                        "SortType": "ASC",
                        "SortColumn":"WOL_CreatedDateTime",
                    };
                    
                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": ProductMenuCtrl.ePage.Entities.Header.API.Inventory.FilterID
                    };
                    apiService.post("eAxisAPI", ProductMenuCtrl.ePage.Entities.Header.API.Inventory.Url, _input).then(function SuccessCallback(response) {
                        if(response.data.Response.length>0){
                            ProductMenuCtrl.ePage.Entities.Header.GlobalVariables.CannotEditProduct = true;
                            def.resolve(response.data.Response[0].ORG_FK);
                        }else{
                            def.resolve("Failed");
                        }
                    });
                });

                $q.all(LoopPromises).then(function(response){
                    if(response.length>0){
                        var mydata = false;
                        response.map(function(val){
                            if(val!="Failed"){
                                mydata = true;
                                ProductMenuCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.some(function(v){
                                    if(v.ORG_FK==val){
                                        v.isDisabled = true;
                                    }
                                })
                            }
                        });
                    }
                    if(mydata){
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
                ProductMenuCtrl.ePage.Entities.Header.Data = PostSaveObjectUpdate(ProductMenuCtrl.ePage.Entities.Header.Data, ProductMenuCtrl.ePage.Entities.Header.GlobalVariables.CopyofCurrentObject, ["Client","Warehouse","Component","Commodity"]);
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

                     //Taking Copy of Current Object
                     ProductMenuCtrl.ePage.Entities.Header.Data = AfterSaveObjectUpdate(ProductMenuCtrl.ePage.Entities.Header.Data,"IsModified");
                     ProductMenuCtrl.ePage.Entities.Header.GlobalVariables.CopyofCurrentObject = angular.copy(ProductMenuCtrl.ePage.Entities.Header.Data);

                     
                } else if (response.Status === "failed") {
                    
                    ProductMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        ProductMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ProductMenuCtrl.currentProduct.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                    });
                    if (ProductMenuCtrl.ePage.Entities.Header.Validations != null) {
                        toastr.error("Validation Failed...!");
                        ProductMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ProductMenuCtrl.currentProduct);
                    }else{
                        toastr.error("Could not Save...!");
                    }
                }
            });
        }

        function PostSaveObjectUpdate(newValue,oldValue, exceptObjects) {
            for (var i in newValue) {
                if(typeof newValue[i] == 'object'&& newValue[i]!=null){
                    PostSaveObjectUpdate(newValue[i],oldValue[i],exceptObjects);
                }else{
                    var Satisfied = exceptObjects.some(function(v){return v===i});
                    if(!Satisfied && i!= "$$hashKey"){
                        if(!oldValue){
                            newValue["IsModified"] = true;
                            break;
                        }else{
                            if(newValue[i]!=oldValue[i]){
                                newValue["IsModified"] = true;
                                break;
                            }
                        }
                    }
                }
            }
            return newValue;
        }

        function AfterSaveObjectUpdate(obj,key){
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    AfterSaveObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = false;
                }
            }
            return obj;
        }


        Init();

    }

})();