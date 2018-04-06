(function () {
    "use strict";

    angular
        .module("Application")
        .directive("event", Event);

    Event.$inject = [];

    function Event() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives/event/event/event.html",
            controller: 'EventController',
            controllerAs: 'EventCtrl',
            bindToController: true,
            scope: {
                input: "=",
                mode: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();
