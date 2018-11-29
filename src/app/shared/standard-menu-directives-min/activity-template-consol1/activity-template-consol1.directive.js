(function () {
    "use strict"
    angular
        .module("Application")
        .directive("activityTemplateConsol1", ActivityTemplateConsol1Directive);

    function ActivityTemplateConsol1Directive() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives-min/activity-template-consol1/activity-template-consol1.html",
            link: Link,
            controller: "ActivityTemplateConsol1Controller",
            controllerAs: "ActivityTemplateConsol1Ctrl",
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
