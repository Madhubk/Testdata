(function () {
    "use strict"
    angular
        .module("Application")
        .directive("ccd", ConsolCreationEvent);

    function ConsolCreationEvent() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/consol-event/consol-creation-event/consol-event.html",
            link: Link,
            controller: "ConsolCreationDirController",
            controllerAs: "ConsolCreationDirCtrl",
            bindToController: true,
            scope: {
                eventObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();