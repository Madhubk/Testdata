(function () {
    "use strict";

    angular
        .module("Application")
        .directive("vesselplanbuyerorc", VesselPlanBuyerOrcDirective);

    function VesselPlanBuyerOrcDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/vessel-plan-buyer-orc/vessel-plan-buyer-orc.html",
            link: Link,
            controller: "VesselPlanBuyerOrcDirectiveController",
            controllerAs: "VesselPlanBuyerOrcDirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();