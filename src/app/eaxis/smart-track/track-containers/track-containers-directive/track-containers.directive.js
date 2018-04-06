(function () {
    "use strict";

    angular
        .module("Application")
        .directive("trackContainerDirective", TrackContainerDirective);

    TrackContainerDirective.$inject = [];

    function TrackContainerDirective() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/smart-track/track-containers/track-containers-directive/track-containers-directive.html",
            link: Link,
            controller: "trackContainerDirectiveController",
            controllerAs: "TrackContainerDirectiveCtrl",
            scope: {
                currentContainer: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
