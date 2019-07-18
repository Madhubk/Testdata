(function () {
    "use strict";

    angular.module("Application")
        .directive("exchangeRateGeneral", exchangeRateGeneral);

    exchangeRateGeneral.$inject = [];

    function exchangeRateGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/ExchangeRate/ExchangeRate-general/ExchangeRate-general.html",
            link: Link,
            controller: "ExchangeRateGeneralController",
            controllerAs: "ExchangeRateGeneralCtrl",
            scope: {
                currentExchangeRate: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();