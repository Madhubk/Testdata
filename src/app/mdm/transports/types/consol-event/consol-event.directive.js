(function () {
    "use strict";

    angular
        .module("Application")
        .directive("consolEvent", ConsolEvent);

    ConsolEvent.$inject = [];

    function ConsolEvent() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/transports/types/consol-event/consol-event.html",
            link: Link,
            controller: "ConsolEventController",
            controllerAs: "ConsolEventCtrl",
            scope: {
                currentType: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();