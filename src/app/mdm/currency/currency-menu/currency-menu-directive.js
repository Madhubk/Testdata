(function () {
    "use strict";
    angular
        .module("Application")
        .directive("currencyMenu", currencyMenu);

        currencyMenu.$inject = [];

    function currencyMenu() {        
        var exports = {
            restrict: "EA",            
            templateUrl: "app/mdm/currency/currency-menu/currency-menu.html",
            link: Link,
            controller: "CurrencyMenuController",
            controllerAs: "CurrencyMenuCtrl",
            scope: {
                currentCurrency: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();