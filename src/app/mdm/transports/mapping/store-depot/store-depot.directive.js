(function () {
    "use strict";

    angular
        .module("Application")
        .directive("storeDepot", StoreDepot);

    StoreDepot.$inject = [];

    function StoreDepot() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/transports/mapping/store-depot/store-depot.html",
            link: Link,
            controller: "StoreDepotController",
            controllerAs: "StoreDepotCtrl",
            scope: {
                currentMapping: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();