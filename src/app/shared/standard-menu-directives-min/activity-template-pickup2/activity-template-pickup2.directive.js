(function () {
    "use strict"
    angular
        .module("Application")
        .directive("activityTemplatePickup2", ActivityTemplatePickup2Directive);

    function ActivityTemplatePickup2Directive() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives-min/activity-template-pickup2/activity-template-pickup2.html",
            link: Link,
            controller: "ActivityTemplatePickup2Controller",
            controllerAs: "ActivityTemplatePickup2Ctrl",
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
