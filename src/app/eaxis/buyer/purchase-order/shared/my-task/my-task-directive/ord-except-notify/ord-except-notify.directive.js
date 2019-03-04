(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordexceptnotify", OrdExceptNotifyDirective);

    function OrdExceptNotifyDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-except-notify/ord-except-notify.html",
            link: Link,
            controller: "OrdExceptNotifyDirectiveController",
            controllerAs: "OrdExceptNotifyDirectiveCtrl",
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
