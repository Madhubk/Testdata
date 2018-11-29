(function () {
    "use strict";

    angular
        .module("Application")
        .directive("consolDetails", ConsolDetails);

    ConsolDetails.$inject = [];

    function ConsolDetails() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/consol-details/consol-details.html",
            link: Link,
            controller: "ConsolDetailsController",
            controllerAs: "ConsolDetailsCtrl",
            scope: {
                currentObj: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
