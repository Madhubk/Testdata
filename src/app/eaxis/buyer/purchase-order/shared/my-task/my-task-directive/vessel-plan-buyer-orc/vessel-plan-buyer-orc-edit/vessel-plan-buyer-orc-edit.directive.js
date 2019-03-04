(function () {
    "use strict";

    angular
        .module("Application")
        .directive("vesselPlanBuyerOrcEdit", VesselPlanBuyerOrcEditDirective);

    VesselPlanBuyerOrcEditDirective.$inject = [];

    function VesselPlanBuyerOrcEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/vessel-plan-buyer-orc/vessel-plan-buyer-orc-edit/vessel-plan-buyer-orc-edit.html",
            controller: "VesselPlanBuyerOrcEditDirectiveController",
            controllerAs: "VesselPlanBuyerOrcEditDirectiveCtrl",
            bindToController: true,
            link: Link,
            scope: {
                taskObj: "=",
                entityObj: "=",
                tabObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) {}
    }
})();