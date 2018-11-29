(function () {
    "use strict";

    angular
        .module("Application")
        .directive("tcEventConfigure", TCEventConfigure);

    TCEventConfigure.$inject = [];

    function TCEventConfigure() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/trust-center/event/tc-event-configure/tc-event-configure.html",
            link: Link,
            controller: "TCEventConfigureController",
            controllerAs: "TCEventConfigureCtrl",
            scope: {
                currentEvent: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
