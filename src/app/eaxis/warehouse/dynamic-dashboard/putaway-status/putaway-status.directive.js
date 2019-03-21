(function () {
    "use strict";

    angular
        .module("Application")
        .directive("putawayStatus", PutawayStatus);

    function PutawayStatus() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/dynamic-dashboard/putaway-status/putaway-status.html",
            link: Link,
            controller: "PutawayStatusController",
            controllerAs: "PutawayStatusCtrl",
            scope: {
                currentObj: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();