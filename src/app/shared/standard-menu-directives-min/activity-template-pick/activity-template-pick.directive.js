(function () {
    "use strict"
    angular
        .module("Application")
        .directive("activityTemplatePick", ActivityTemplatePickDirective);

    function ActivityTemplatePickDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives-min/activity-template-pick/activity-template-pick.html",
            link: Link,
            controller: "ActivityTemplatePickController",
            controllerAs: "ActivityTemplatePickCtrl",
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
