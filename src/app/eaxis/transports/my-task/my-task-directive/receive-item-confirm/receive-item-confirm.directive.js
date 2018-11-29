(function () {
    "use strict";

    angular
        .module("Application")
        .directive("receiveitemconfirm", ReceiveItemConfirmDirective);

    function ReceiveItemConfirmDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/my-task/my-task-directive/receive-item-confirm/receive-item-confirm.html",
            link: Link,
            controller: "ReceiveItemConfirmDirectiveController",
            controllerAs: "ReceiveItemDirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
