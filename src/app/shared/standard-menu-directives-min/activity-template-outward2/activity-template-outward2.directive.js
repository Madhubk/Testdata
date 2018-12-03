(function () {
    "use strict"
    angular
        .module("Application")
        .directive("activityTemplateOutward2", ActivityTemplateOutward2Directive);

    function ActivityTemplateOutward2Directive() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives-min/activity-template-outward2/activity-template-outward2.html",
            link: Link,
            controller: "ActivityTemplateOutward2Controller",
            controllerAs: "ActivityTemplateOutward2Ctrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&",
                tabObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
