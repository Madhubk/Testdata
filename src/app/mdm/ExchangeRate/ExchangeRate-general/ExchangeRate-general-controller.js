(function () {
    "use strict";

    angular.module("Application")
        .controller("ExchangeRateGeneralController", ExchangeRateGeneralController);

        ExchangeRateGeneralController.$inject = ["helperService", "exchangerateConfig"];

    function ExchangeRateGeneralController(helperService, exchangerateConfig) {

        var ExchangeRateGeneralCtrl = this;

        function Init() {

            var currentExchangeRate = ExchangeRateGeneralCtrl.currentExchangeRate[ExchangeRateGeneralCtrl.currentExchangeRate.code].ePage.Entities;

            ExchangeRateGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_ExchangeRate",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentExchangeRate
            };

            ExchangeRateGeneralCtrl.ePage.Masters.Config = exchangerateConfig;
            ExchangeRateGeneralCtrl.ePage.Masters.UIExchangerateList = ExchangeRateGeneralCtrl.ePage.Entities.Header.Data;
            ExchangeRateGeneralCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            

            /* Function  */
            ExchangeRateGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

        }

        //#region ErrorWarning Alert Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ExchangeRateGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function SelectedLookupData($item) {

        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                ExchangeRateGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ExchangeRateGeneralCtrl.currentExchangeRate.code, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
            } else {
                ExchangeRateGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ExchangeRateGeneralCtrl.currentExchangeRate.code, IsArray, RowIndex, value.ColIndex);
            }
        }
        //#endregion 

        Init()
    }
})();