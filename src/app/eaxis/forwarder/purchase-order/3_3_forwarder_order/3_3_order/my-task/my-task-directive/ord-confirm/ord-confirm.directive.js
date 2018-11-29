(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordconfirm", OrdConfirmDirective);

    function OrdConfirmDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/my-task/my-task-directive/ord-confirm/ord-confirm.html",
            link: Link,
            controller: "OrdConfirmDirectiveController",
            controllerAs: "OrdConfirmDirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();