(function () {
    "use strict";

    angular.module("Application")
        .controller("CurrencyGeneralController", CurrencyGeneralController);

    CurrencyGeneralController.$inject = ["helperService", "currencyConfig"];

    function CurrencyGeneralController(helperService, currencyConfig) {
    
        var CurrencyGeneralCtrl = this;

        function Init() {

            var currentCurrency = CurrencyGeneralCtrl.currentCurrency[CurrencyGeneralCtrl.currentCurrency.code].ePage.Entities;

            CurrencyGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Currency",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentCurrency
            };

            CurrencyGeneralCtrl.ePage.Masters.Config = currencyConfig;
            CurrencyGeneralCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            

            /* Function  */
            CurrencyGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            
            InitCurrency();
        }

         function InitCurrency(){
            if(CurrencyGeneralCtrl.currentCurrency.isNew){
                debugger;
                CurrencyGeneralCtrl.ePage.Entities.Header.Data.IsActive = true;
            }
        }

        //#region ErrorWarning Alert Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(CurrencyGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function SelectedLookupData($item) {

        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                CurrencyGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, CurrencyGeneralCtrl.currentCurrency.code, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
            } else {
                CurrencyGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, CurrencyGeneralCtrl.currentCurrency.code, IsArray, RowIndex, value.ColIndex);
            }
        }
        //#endregion 

        Init()
    }
})();