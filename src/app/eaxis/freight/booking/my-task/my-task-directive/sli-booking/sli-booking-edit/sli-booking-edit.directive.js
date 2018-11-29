(function () {
    "use strict";

    angular
        .module("Application")
        .directive("slibookingedit", SLIBookingEditDirective);

        SLIBookingEditDirective.$inject = [];

    function SLIBookingEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/booking/my-task/my-task-directive/sli-booking/sli-booking-edit/sli-booking-edit.html",
            controller: "SLIBookingEditDirectiveController",
            controllerAs: "SLIBookingEditDirectiveCtrl",
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

        function Link(scope, ele, attr) { }
    }
})();
