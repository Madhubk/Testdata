(function () {
    "use strict"
    angular
        .module("Application")
        .directive("allocatestock", AllocateStockDirective)
        .directive("allocateStockEdit", AllocateStockEditDirective);

    function AllocateStockDirective() {
        var exports = {
            restrict: "EA",
            templateUrl:
                "app/eaxis/warehouse/my-task/my-task-directive/allocate-stock/allocate-stock-task-list.html",
            link: Link,
            controller: "AllocateStockController",
            controllerAs: "AllocateStockCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function AllocateStockEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/my-task/my-task-directive/allocate-stock/allocate-stock-activity.html",
            link: Link,
            controller: "AllocateStockController",
            controllerAs: "AllocateStockCtrl",
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
