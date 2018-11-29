(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordconfirmedit", OrdConfirmEditDirective);

    OrdConfirmEditDirective.$inject = [];

    function OrdConfirmEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/my-task/my-task-directive/ord-confirm/ord-confirm-edit/ord-confirm-edit.html",
            controller: "OrdConfirmEditDirectiveController",
            controllerAs: "OrdConfirmEditDirectiveCtrl",
            bindToController: true,
            link: Link,
            scope: {
                taskObj: "=",
                entityObj: "=",
                tabObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) {}
    }
})();