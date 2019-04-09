(function () {
    "use strict";
    angular
        .module("Application")
        .directive("exchangeRateMenu", exchangeRateMenu);

        exchangeRateMenu.$inject = [];

    function exchangeRateMenu() {  
        debugger;      
        var exports = {
            restrict: "EA",            
            templateUrl: "app/mdm/exchangeRate/exchangeRate-menu/exchangeRate-menu.html",
            link: Link,
            controller: "ExchangeRateMenuController",
            controllerAs: "ExchangeRateMenuCtrl",
            scope: {
                currentExchangeRate: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();