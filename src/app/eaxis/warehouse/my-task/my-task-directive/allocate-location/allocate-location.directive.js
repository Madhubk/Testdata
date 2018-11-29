(function () {
    "use strict"
    angular
        .module("Application")
        .directive("allocatelocation", AllocateLocationDirective)
        .directive("allocateLocationEdit", AllocateLocationEditDirective);

    function AllocateLocationDirective() {
        var exports = {
            restrict: "EA",
            templateUrl:
                "app/eaxis/warehouse/my-task/my-task-directive/allocate-location/allocate-location-task-list.html",
            link: Link,
            controller: "AllocateLocationController",
            controllerAs: "AllocateLocationCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function AllocateLocationEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/my-task/my-task-directive/allocate-location/allocate-location-activity.html",
            link: Link,
            controller: "AllocateLocationController",
            controllerAs: "AllocateLocationCtrl",
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
