(function () {
    "use strict";

    angular
        .module("Application")
        .directive("receiveitemconfirmedit", ReceiveItemEditDirective);

    ReceiveItemEditDirective.$inject = [];

    function ReceiveItemEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/receive-item-confirm/receive-item-confirm-edit/receive-item-confirm-edit.html",
            controller: "ReceiveItemEditDirectiveController",
            controllerAs: "ReceiveItemEditDirectiveCtrl",
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
