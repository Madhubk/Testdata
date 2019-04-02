(function () {
    "use strict";

    angular.module("Application")
        .directive("currencyGeneral", currencyGeneral);

    currencyGeneral.$inject = [];

    function currencyGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/currency/currency-general/currency-general.html",
            link: Link,
            controller: "CurrencyGeneralController",
            controllerAs: "CurrencyGeneralCtrl",
            scope: {
                currentCurrency: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();