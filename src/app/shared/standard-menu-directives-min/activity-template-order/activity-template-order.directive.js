(function () {
    "use strict"
    angular
        .module("Application")
        .directive("activityTemplateOrder", ActivityTemplateOrderDirective);

    function ActivityTemplateOrderDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives-min/activity-template-order/activity-template-order.html",
            link: Link,
            controller: "ActivityTemplateOrderController",
            controllerAs: "ActivityTemplateOrderCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();