(function () {
    "use strict"
    angular
        .module("Application")
        .directive("activityTemplate1", ActivityTemplate1Directive);

    function ActivityTemplate1Directive() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives-min/activity-template1/activity-template1.html",
            link: Link,
            controller: "ActivityTemplate1Controller",
            controllerAs: "ActivityTemplate1Ctrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
