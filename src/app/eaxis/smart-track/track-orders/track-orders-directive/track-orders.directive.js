(function () {
    "use strict";

    angular
        .module("Application")
        .directive("trackOrderDirective", TrackOrderDirective);

    TrackOrderDirective.$inject = [];

    function TrackOrderDirective() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/smart-track/track-orders/track-orders-directive/track-orders-directive.html",
            link: Link,
            controller: "trackOrderDirectiveController",
            controllerAs: "TrackOrderDirectiveCtrl",
            scope: {
                currentOrder: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
