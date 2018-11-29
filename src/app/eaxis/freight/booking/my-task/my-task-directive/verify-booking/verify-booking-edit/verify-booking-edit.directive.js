(function () {
    "use strict";

    angular
        .module("Application")
        .directive("verifybookingedit", VerifyBookingEditDirective);

    VerifyBookingEditDirective.$inject = [];

    function VerifyBookingEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/booking/my-task/my-task-directive/verify-booking/verify-booking-edit/verify-booking-edit.html",
            controller: "VerifyBookingEditDirectiveController",
            controllerAs: "VerifyBookingEditDirectiveCtrl",
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