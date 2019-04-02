(function () {
    "use strict";
    angular
        .module("Application")
        .controller("CurrencyMenuController", CurrencyMenuController);

    CurrencyMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "currencyConfig", "helperService"];

    function CurrencyMenuController($scope, $timeout, APP_CONSTANT, apiService, currencyConfig, helperService) {
        var CurrencyMenuCtrl = this;
        function Init() {
            debugger;
            var currentCurrency = CurrencyMenuCtrl.currentCurrency[CurrencyMenuCtrl.currentCurrency.code].ePage.Entities;
            CurrencyMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Currency_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentCurrency
            };
            
            CurrencyMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            CurrencyMenuCtrl.ePage.Masters.PostCostButtonText = "Post Cost";
            CurrencyMenuCtrl.ePage.Masters.PostRevenueButtonText = "Post Revenue";
            CurrencyMenuCtrl.ePage.Masters.PostButtonText = "Post";
            CurrencyMenuCtrl.ePage.Masters.DisableSave = false;
            CurrencyMenuCtrl.ePage.Masters.Config = currencyConfig;

            /* Function */
            

            // Menu list from configuration
        }
    
        Init();
    }
})();