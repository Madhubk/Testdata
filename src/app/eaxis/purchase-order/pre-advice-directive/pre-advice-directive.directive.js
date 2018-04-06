(function () {
    "use strict";

    angular
        .module("Application")
        .directive("preAdviceBookingDirective", PreAdviceBookingDirective);

    PreAdviceBookingDirective.$inject = [];

    function PreAdviceBookingDirective() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/purchase-order/pre-advice-directive/pre-advice-directive.html",
            link: Link,
            controller: "preAdviceBookingDirectiveController",
            controllerAs: "PreAdviceBookingDirectiveCtrl",
            scope: {
                entity: "=",
                filter: "=",
                reload: "&"
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
