(function () {
    "use strict";

    angular
        .module("Application")
        .directive("trackOrderLineDirective", TrackOrderLineDirective);

    TrackOrderLineDirective.$inject = [];

    function TrackOrderLineDirective() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/smart-track/track-order-lines/track-order-lines-directive/track-order-line-directive.html",
            link: Link,
            controller: "trackOrderLineDirectiveController",
            controllerAs: "TrackOrderLineDirectiveCtrl",
            scope: {
                currentTrackOrderLines: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
