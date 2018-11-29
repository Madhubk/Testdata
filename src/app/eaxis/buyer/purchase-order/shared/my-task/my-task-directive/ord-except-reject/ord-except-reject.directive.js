(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordexceptreject", OrdExceptRejectDirective);

    function OrdExceptRejectDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-except-reject/ord-except-reject.html",
            link: Link,
            controller: "OrdExceptRejectDirectiveController",
            controllerAs: "OrdExceptRejectDirectiveCtrl",
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