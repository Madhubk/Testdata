(function () {
    "use strict";

    angular
        .module("Application")
        .directive("exceptionComments", ExceptionCommentsDirective);

    function ExceptionCommentsDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/order-shared/my-task/my-task-directive/exception-comments/exception-comments.html",
            link: Link,
            controller: "ExceptionCommentsDirectiveController",
            controllerAs: "ExceptionCommentsDirectiveCtrl",
            bindToController: true,
            scope: {
                commentsList: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();