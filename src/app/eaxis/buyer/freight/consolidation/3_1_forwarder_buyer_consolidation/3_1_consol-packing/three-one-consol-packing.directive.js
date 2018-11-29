(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeOneConsolPacking", ThreeOneConsolPacking);

        ThreeOneConsolPacking.$inject = [];

    function ThreeOneConsolPacking() {
        var exports = {
            restrict: "EA",            
            templateUrl: "app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_consol-packing/three-one-consol-packing.html",
            link: Link,
            controller: "ThreeOneConsolPackingController",
            controllerAs: "ThreeOneConsolPackingCtrl",
            scope: {
                currentConsol: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
