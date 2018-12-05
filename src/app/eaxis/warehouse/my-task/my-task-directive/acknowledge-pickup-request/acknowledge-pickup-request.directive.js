(function () {
    "use strict"
    angular
        .module("Application")
        .directive("acknowledgepickuprequest", AcknowledgePickupReqDirective)
        .directive("acknowledgePickupRequestEdit", AcknowledgePickupReqEditDirective);

    function AcknowledgePickupReqDirective() {
        var exports = {
            restrict: "EA",
            templateUrl:
                "app/eaxis/warehouse/my-task/my-task-directive/acknowledge-pickup-request/acknowledge-pickup-request-task-list.html",
            link: Link,
            controller: "AcknowledgePickupReqController",
            controllerAs: "AckPickupReqCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function AcknowledgePickupReqEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/my-task/my-task-directive/acknowledge-pickup-request/acknowledge-pickup-request-activity.html",
            link: Link,
            controller: "AcknowledgePickupReqController",
            controllerAs: "AckPickupReqCtrl",
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
