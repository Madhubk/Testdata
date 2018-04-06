(function () {
    "use strict";

    angular
        .module("Application")
        .directive("eventData", DataEvent);

    DataEvent.$inject = [];

    function DataEvent() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives/data-event/data-event/data-event.html",
            controller: 'DataEventController',
            controllerAs: 'DataEventCtrl',
            bindToController: true,
            scope: {
                input: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) { }
    }
})();
