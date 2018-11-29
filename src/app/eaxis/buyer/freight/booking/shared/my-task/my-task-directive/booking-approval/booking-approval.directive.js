(function () {
    "use strict";

    angular
        .module("Application")
        .directive("bookingapproval", bookingApproval)
        .directive("bookingApprovalEdit", bookingApprovalEdit);

    function bookingApproval() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/booking-approval/booking-approval-task-list.html",
            link: Link,
            controller: "bookingApprovalController",
            controllerAs: "bookingApprovalCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }

    function bookingApprovalEdit() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/booking-approval/booking-approval-activity.html",
            link: Link,
            controller: "bookingApprovalController",
            controllerAs: "bookingApprovalCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();