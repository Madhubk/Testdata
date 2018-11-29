(function () {
    "use strict"
    angular
        .module("Application")
        .directive("startputaway", StartPutawayDirective)
        .directive("startPutawayEdit", StartPutawayEditDirective);

    function StartPutawayDirective() {
        var exports = {
            restrict: "EA",
            templateUrl:
                "app/eaxis/warehouse/my-task/my-task-directive/start-putaway/start-putaway-task-list.html",
            link: Link,
            controller: "StartPutawayController",
            controllerAs: "StartPutawayCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function StartPutawayEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/my-task/my-task-directive/start-putaway/start-putaway-activity.html",
            link: Link,
            controller: "StartPutawayController",
            controllerAs: "StartPutawayCtrl",
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
