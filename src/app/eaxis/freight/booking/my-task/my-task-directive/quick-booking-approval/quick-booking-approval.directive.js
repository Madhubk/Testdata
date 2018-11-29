(function () {
    "use strict";

    angular
        .module("Application")
        .directive("quickbookingapproval", QuickBookingApprovalDirective);

    function QuickBookingApprovalDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/booking/my-task/my-task-directive/quick-booking-approval/quick-booking-approval.html",
            link: Link,
            controller: "QuickBookingApprovalDirectiveController",
            controllerAs: "QuickBookingApprovalDirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&",
                onRefreshStatusCount: "&",
                onRefreshTask: "&"

            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();