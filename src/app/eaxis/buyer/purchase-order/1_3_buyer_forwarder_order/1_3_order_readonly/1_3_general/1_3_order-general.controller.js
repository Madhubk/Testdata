(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_three_OrdGeneralController", one_three_OrdGeneralController);

    one_three_OrdGeneralController.$inject = ["APP_CONSTANT", "authService", "apiService", "appConfig", "helperService"];

    function one_three_OrdGeneralController(APP_CONSTANT, authService, apiService, appConfig, helperService) {
        var one_three_OrdGeneralCtrl = this;

        function Init() {
            var currentOrder = one_three_OrdGeneralCtrl.currentOrder[one_three_OrdGeneralCtrl.currentOrder.label].ePage.Entities;
            one_three_OrdGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "one_three_Order_General",
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
            one_three_OrdGeneralCtrl.ePage.Masters.DatePicker = {};
            one_three_OrdGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            one_three_OrdGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            one_three_OrdGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            InitOrderDetails();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            one_three_OrdGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        //  ------------------ Start Order Details  -----------------------------
        function InitOrderDetails() {
            GetCfxTypeList();
            GetCountryList();
            GetCurrencyList();
            GetServiceLevelList();
        }

        function GetCfxTypeList() {
            one_three_OrdGeneralCtrl.ePage.Masters.CfxTypesList = {}
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
                    one_three_OrdGeneralCtrl.ePage.Masters.CfxTypesList[value] = response.data.Response[value];
                });
            });
        }

        function GetCountryList() {
            one_three_OrdGeneralCtrl.ePage.Masters.CountryList = {}
            var _input = {
                "searchInput": [],
                "FilterID": appConfig.Entities.Country.API.FindLookup.FilterID,
                "DBObjectName": appConfig.Entities.Country.API.FindLookup.DBObjectName
            };

            apiService.post("eAxisAPI", appConfig.Entities.Country.API.FindLookup.Url, _input).then(function (response) {
                one_three_OrdGeneralCtrl.ePage.Masters.CountryList.Country = response.data.Response;
            });
        }

        function GetCurrencyList() {
            one_three_OrdGeneralCtrl.ePage.Masters.CurrencyList = {}
            //Currency
            var _inputCurrency = {
                "searchInput": [],
                "FilterID": appConfig.Entities.Currency.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.Currency.API.FindAll.Url, _inputCurrency).then(function (response) {
                one_three_OrdGeneralCtrl.ePage.Masters.CurrencyList.Currency = response.data.Response;
            });
        }

        function GetServiceLevelList() {
            one_three_OrdGeneralCtrl.ePage.Masters.ServiceLevelList = {}
            var _inputServiceLevel = {
                "searchInput": [],
                "FilterID": appConfig.Entities.ServiceLevel.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.ServiceLevel.API.FindAll.Url, _inputServiceLevel).then(function (response) {
                one_three_OrdGeneralCtrl.ePage.Masters.ServiceLevelList.ServiceLevel = response.data.Response;
            });
        }

        Init();
    }

})();