(function () {
    "use strict";

    angular.module("Application")
        .directive("taxMenu", TaxMenu);

    TaxMenu.$inject = [];

    function TaxMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/mdm/tax/tax-menu/tax-menu.html",
            link: Link,
            controller: "TaxMenuController",
            controllerAs: "TaxMenuCtrl",
            scope: {
                currentTax: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();