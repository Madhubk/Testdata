(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordexceptnotifyedit", OrdExceptNotifyEditDirective);

    OrdExceptNotifyEditDirective.$inject = [];

    function OrdExceptNotifyEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/order-shared/my-task/my-task-directive/ord-except-notify/ord-except-notify-edit/ord-except-notify-edit.html",
            controller: "OrdExceptNotifyEditDirectiveController",
            controllerAs: "OrdExceptNotifyEditDirectiveCtrl",
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
