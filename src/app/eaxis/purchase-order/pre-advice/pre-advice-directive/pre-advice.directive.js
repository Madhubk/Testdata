(function () {
    "use strict";

    angular
        .module("Application")
        .directive("preAdviceDirective", preAdviceDirective);

    preAdviceDirective.$inject = [];

    function preAdviceDirective() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/purchase-order/pre-advice/pre-advice-directive/pre-advice.directive.html",
            link: Link,
            controller: "preAdviceDirectiveController",
            controllerAs: "PreAdviceDirectiveCtrl",
            scope: {
                currentPreAdvice: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
