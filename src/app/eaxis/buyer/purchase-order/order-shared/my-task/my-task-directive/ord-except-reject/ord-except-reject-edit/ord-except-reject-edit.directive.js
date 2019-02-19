(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordexceptrejectedit", OrdExceptRejectEditDirective);

    OrdExceptRejectEditDirective.$inject = [];

    function OrdExceptRejectEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/order-shared/my-task/my-task-directive/ord-except-reject/ord-except-reject-edit/ord-except-reject-edit.html",
            controller: "OrdExceptRejectEditDirectiveController",
            controllerAs: "OrdExceptRejectEditDirectiveCtrl",
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

        function Link(scope, ele, attr) { }
    }
})();
