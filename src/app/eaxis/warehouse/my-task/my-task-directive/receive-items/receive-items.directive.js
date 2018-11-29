(function () {
    "use strict"
    angular
        .module("Application")
        .directive("receiveitems", ReceiveItemsDirective)
        .directive("receiveItemEdit", ReceiveItemEditDirective);

    function ReceiveItemsDirective() {
        var exports = {
            restrict: "EA",
            templateUrl:
                "app/eaxis/warehouse/my-task/my-task-directive/receive-items/receive-items-task-list.html",
            link: Link,
            controller: "ReceiveItemController",
            controllerAs: "ReceiveItemCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ReceiveItemEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/my-task/my-task-directive/receive-items/receive-items-activity.html",
            link: Link,
            controller: "ReceiveItemController",
            controllerAs: "ReceiveItemCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
