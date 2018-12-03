(function () {
    "use strict"
    angular
        .module("Application")
        .directive("activityTemplateInward", ActivityTemplateInwardDirective);

    function ActivityTemplateInwardDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives-min/activity-template-inward/activity-template-inward.html",
            link: Link,
            controller: "ActivityTemplateInwardController",
            controllerAs: "ActivityTemplateInwardCtrl",
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
