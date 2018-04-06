(function () {
    "use strict";

    angular
        .module("Application")
        .directive("sufDirective", SufDirective);

    SufDirective.$inject = [];

    function SufDirective() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/purchase-order/supplier-followup/supplier-followup-directive/supplier-followup.directive.html",
            link: Link,
            controller: "sufDirectiveController",
            controllerAs: "SufDirectiveCtrl",
            scope: {
                currentFollowUp: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
