(function () {
    "use strict";

    angular
        .module("Application")
        .directive("consolPacking", ConsolPacking);

        ConsolPacking.$inject = [];

    function ConsolPacking() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/consol-packing/consol-packing.html",
            link: Link,
            controller: "ConsolPackingController",
            controllerAs: "ConsolPackingCtrl",
            scope: {
                currentConsol: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
