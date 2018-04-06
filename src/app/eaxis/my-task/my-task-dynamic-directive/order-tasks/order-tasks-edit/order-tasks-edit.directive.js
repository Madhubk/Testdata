(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordertasksedit", OrderTasksEditDirective);

    OrderTasksEditDirective.$inject = [];

    function OrderTasksEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/order-task/order-task-edit/order-task-edit.html",
            controller: "OrderTasksEditDirectiveController",
            controllerAs: "OrderTasksEditDirectiveCtrl",
            bindToController: true,
            link: Link,
            scope: {
                taskObj: "=",
                entityObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) {}
    }
})();
