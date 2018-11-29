(function () {
    "use strict"
    angular
        .module("Application")
        .directive("activityTemplateDelivery2", ActivityTemplateDelivery2Directive);

    function ActivityTemplateDelivery2Directive() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives-min/activity-template-delivery2/activity-template-delivery2.html",
            link: Link,
            controller: "ActivityTemplateDelivery2Controller",
            controllerAs: "ActivityTemplateDelivery2Ctrl",
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
