(function () {
    "use strict";

    angular
        .module("Application")
        .directive("preAdviceGridDirective", PreAdviceGridDirective);

    PreAdviceGridDirective.$inject = [];

    function PreAdviceGridDirective() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/purchase-order/pre-advice-directive/pre-advice-grid/pre-advice-grid.html",
            link: Link,
            controller: "preAdviceGridDirectiveController",
            controllerAs: "PreAdviceGridDirectiveCtrl",
            scope: {
                input: "=",
                gridChange: "&",
                selectedlist: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
