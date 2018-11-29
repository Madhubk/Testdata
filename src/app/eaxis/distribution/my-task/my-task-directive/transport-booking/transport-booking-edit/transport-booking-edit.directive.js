(function () {
    "use strict";

    angular
        .module("Application")
        .directive("transportbookingedit", TransportBookingEditDirective);

    TransportBookingEditDirective.$inject = [];

    function TransportBookingEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/transport-booking/transport-booking-edit/transport-booking-edit.html",
            controller: "TransportBookingEditDirectiveController",
            controllerAs: "TransportBookingEditCtrl",
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
