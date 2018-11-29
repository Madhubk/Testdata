(function () {
    "use strict";

    angular
        .module("Application")
        .directive("nationalDepot", NationalDepot);

    NationalDepot.$inject = [];

    function NationalDepot() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/national-depot/national-depot.html",
            link: Link,
            controller: "NationalDepotController",
            controllerAs: "NationalDepotCtrl",
            scope: {
                dataentryObject: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

})();