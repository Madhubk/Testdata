(function () {
    "use strict"
    angular
        .module("Application")
        .directive("completeputaway", CompletePutawayDirective)
        .directive("completePutawayEdit", CompletePutawayEditDirective);

    function CompletePutawayDirective() {
        var exports = {
            restrict: "EA",
            templateUrl:
                "app/eaxis/warehouse/my-task/my-task-directive/complete-putaway/complete-putaway-task-list.html",
            link: Link,
            controller: "CompletePutawayController",
            controllerAs: "CompletePutawayCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function CompletePutawayEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/my-task/my-task-directive/complete-putaway/complete-putaway-activity.html",
            link: Link,
            controller: "CompletePutawayController",
            controllerAs: "CompletePutawayCtrl",
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
