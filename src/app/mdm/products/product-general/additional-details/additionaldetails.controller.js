(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AdditionalDetailsController", AdditionalDetailsController);

    AdditionalDetailsController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "productConfig", "helperService", "toastr", "$document"];

    function AdditionalDetailsController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, productConfig, helperService, toastr, $document) {

        var AdditionalDetailsCtrl = this;

        function Init() {

            var currentProduct = AdditionalDetailsCtrl.currentProduct[AdditionalDetailsCtrl.currentProduct.label].ePage.Entities;

            AdditionalDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Product_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentProduct,
            };
            GetDropDownList();
            AdditionalDetailsCtrl.ePage.Masters.DropDownMasterList = {};
        }
        
        function GetDropDownList() {
            
            // Get CFXType Dropdown list
            var typeCodeList = ["TRADEZONE"];
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
                        AdditionalDetailsCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        AdditionalDetailsCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        Init();
    }

})();