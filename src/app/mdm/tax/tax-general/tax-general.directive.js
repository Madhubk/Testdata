(function () {
    "use strict";

    angular.module("Application")
        .directive("taxGeneral", TaxGeneral);

    TaxGeneral.$inject = [];

    function TaxGeneral() {
        var exports = {
            restrict: "E",
            templateUrl: "app/mdm/tax/tax-general/tax-general.html",
            link: Link,
            controller: "TaxGeneralController",
            controllerAs: "TaxGeneralCtrl",
            scope: {
                currentTax: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();