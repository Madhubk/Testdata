(function () {
    "use strict";

    angular
        .module("Application")
        .directive("consolEntityDetails", ConsolEntityDetails);

    ConsolEntityDetails.$inject = [];

    function ConsolEntityDetails() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/consol-entity-details/consol-entity-details.html",
            link: Link,
            controller: "ConsolEntityDetailsController",
            controllerAs: "ConsolEntityDetailsCtrl",
            scope: {
                currentObj: "=",
                mode : "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
