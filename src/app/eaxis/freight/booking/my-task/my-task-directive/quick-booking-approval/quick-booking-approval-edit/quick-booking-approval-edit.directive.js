(function () {
    "use strict";

    angular
        .module("Application")
        .directive("quickbookingapprovaledit", QuickBookingApprovalEditDirective);

    QuickBookingApprovalEditDirective.$inject = [];

    function QuickBookingApprovalEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/booking/my-task/my-task-directive/quick-booking-approval/quick-booking-approval-edit/quick-booking-approval-edit.html",
            controller: "QuickBookingApprovalEditDirectiveController",
            controllerAs: "QuickBookingApprovalEditDirectiveCtrl",
            bindToController: true,
            link: Link,
            scope: {
                taskObj: "=",
                entityObj: "=",
                tabObj: "=",
                onComplete: "&",
                onRefreshStatusCount: "&",
                onRefreshTask: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) {}
    }
})();