(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_one_OrdGeneralController", three_one_OrdGeneralController);

    three_one_OrdGeneralController.$inject = ["$rootScope", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "one_order_listConfig", "toastr", "errorWarningService"];

    function three_one_OrdGeneralController($rootScope, APP_CONSTANT, authService, apiService, appConfig, helperService, one_order_listConfig, toastr, errorWarningService) {

        var three_one_OrdGeneralCtrl = this;

        function Init() {
            var currentOrder = three_one_OrdGeneralCtrl.currentOrder[three_one_OrdGeneralCtrl.currentOrder.label].ePage.Entities;
            three_one_OrdGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_General",
                "Masters": {
                    "PorOrderLine": {}
                },
                "Meta": helperService.metaBase(),
                "Entities": currentOrder,
            };

            InitOrderGerenral();
        }

        function InitOrderGerenral() {

            // DatePicker
            three_one_OrdGeneralCtrl.ePage.Masters.DatePicker = {};
            three_one_OrdGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            three_one_OrdGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            three_one_OrdGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            InitOrderDetails();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            three_one_OrdGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        //  ------------------ Start Order Details  -----------------------------
        function InitOrderDetails() {
            GetCfxTypeList();
            GetCountryList();
            GetCurrencyList();
            GetServiceLevelList();
        }

        function GetCfxTypeList() {
            three_one_OrdGeneralCtrl.ePage.Masters.CfxTypesList = {}
            var typeCodeList = ["TRANSTYPE", "CNTTYPE", "INCOTERM", "WEIGHTUNIT", "VOLUMEUNIT", "ORDSTATUS", "JOBADDR"];
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
                typeCodeList.map(function (value, key) {
                    three_one_OrdGeneralCtrl.ePage.Masters.CfxTypesList[value] = response.data.Response[value];
                });
            });
        }

        function GetCountryList() {
            three_one_OrdGeneralCtrl.ePage.Masters.CountryList = {}
            var _input = {
                "searchInput": [],
                "FilterID": appConfig.Entities.Country.API.FindLookup.FilterID,
                "DBObjectName": appConfig.Entities.Country.API.FindLookup.DBObjectName
            };

            apiService.post("eAxisAPI", appConfig.Entities.Country.API.FindLookup.Url, _input).then(function (response) {
                three_one_OrdGeneralCtrl.ePage.Masters.CountryList.Country = response.data.Response;
            });
        }

        function GetCurrencyList() {
            three_one_OrdGeneralCtrl.ePage.Masters.CurrencyList = {}
            //Currency
            var _inputCurrency = {
                "searchInput": [],
                "FilterID": appConfig.Entities.Currency.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.Currency.API.FindAll.Url, _inputCurrency).then(function (response) {
                three_one_OrdGeneralCtrl.ePage.Masters.CurrencyList.Currency = response.data.Response;
            });
        }

        function GetServiceLevelList() {
            three_one_OrdGeneralCtrl.ePage.Masters.ServiceLevelList = {}
            var _inputServiceLevel = {
                "searchInput": [],
                "FilterID": appConfig.Entities.ServiceLevel.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.ServiceLevel.API.FindAll.Url, _inputServiceLevel).then(function (response) {
                three_one_OrdGeneralCtrl.ePage.Masters.ServiceLevelList.ServiceLevel = response.data.Response;
            });
        }

        Init();

    }

})();