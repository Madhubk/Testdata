(function () {
    "use strict";

    angular
        .module("Application")
        .controller("GeneralController", GeneralController);

    GeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "productConfig", "helperService", "toastr", "$document", "$injector"];

    function GeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, productConfig, helperService, toastr, $document, $injector) {

        var GeneralCtrl = this;

        function Init() {

            var currentProduct = GeneralCtrl.currentProduct[GeneralCtrl.currentProduct.label].ePage.Entities;

            GeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Product_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentProduct,
            };

            GeneralCtrl.ePage.Masters.Config = $injector.get("productConfig");

            GeneralCtrl.ePage.Masters.DropDownMasterList = {};

            GeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            GeneralCtrl.ePage.Masters.SelectedLookupCommodity = SelectedLookupCommodity;


            GetDropDownList();
            GetBindedValues();
        }

        function GetBindedValues() {
            if (GeneralCtrl.ePage.Entities.Header.Data.UIProductGeneral.MCC_NKCommodityCode == null)
                GeneralCtrl.ePage.Entities.Header.Data.UIProductGeneral.MCC_NKCommodityCode = '';

            if (GeneralCtrl.ePage.Entities.Header.Data.UIProductGeneral.MCC_NKCommodityDesc == null)
                GeneralCtrl.ePage.Entities.Header.Data.UIProductGeneral.MCC_NKCommodityDesc = '';

            GeneralCtrl.ePage.Entities.Header.Data.UIProductGeneral.Commodity = GeneralCtrl.ePage.Entities.Header.Data.UIProductGeneral.MCC_NKCommodityCode + ' - ' + GeneralCtrl.ePage.Entities.Header.Data.UIProductGeneral.MCC_NKCommodityDesc;

            if (GeneralCtrl.ePage.Entities.Header.Data.UIProductGeneral.Commodity == ' - ')
                GeneralCtrl.ePage.Entities.Header.Data.UIProductGeneral.Commodity = '';
        }

        function SelectedLookupCommodity(item) {
            GeneralCtrl.ePage.Entities.Header.Data.UIProductGeneral.Commodity = item.CMD_Code + ' - ' + item.CMD_Description; 
        }

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["INW_LINE_UQ", "DimentionsUnit", "GrossWeightUnit", "CubicUnit", "WMSYESNO", "WMSRelationShip"];
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
                        GeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        GeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function OnChangeValues(fieldvalue, code) {
            angular.forEach(GeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code === code) {
                    GetErrorMessage(fieldvalue, value)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value) {
            if (!fieldvalue) {
                GeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, GeneralCtrl.currentProduct.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
            } else {
                GeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, GeneralCtrl.currentProduct.label);
            }
        }


        Init();
    }

})();