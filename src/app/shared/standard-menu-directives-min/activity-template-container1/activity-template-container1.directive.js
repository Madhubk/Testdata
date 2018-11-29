(function () {
    "use strict"
    angular
        .module("Application")
        .directive("activityTemplateContainer1", ActivityTemplateContainer1Directive);

    function ActivityTemplateContainer1Directive() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives-min/activity-template1/activity-template1.html",
            link: Link,
            controller: "ActivityTemplateContainer1Controller",
            controllerAs: "ActivityTemplateContainer1Ctrl",
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
