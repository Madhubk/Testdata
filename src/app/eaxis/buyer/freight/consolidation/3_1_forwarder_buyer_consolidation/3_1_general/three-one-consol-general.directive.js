(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeOneConsolGeneral", ThreeOneConsolGeneral);

    ThreeOneConsolGeneral.$inject = [];

    function ThreeOneConsolGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_general/three-one-consol-general.html",
            link: Link,
            controller: "ThreeOneGeneralConController",
            controllerAs: "ThreeOneGeneralConCtrl",
            scope: {
                currentConsol: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();