(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeOneConsolContainer", ThreeOneConsolContainer);

    ThreeOneConsolContainer.$inject = [];

    function ThreeOneConsolContainer() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_container/three-one-consol-container.html",
            link: Link,
            controller: "ThreeOneContainerConController",
            controllerAs: "ThreeOneContainerConCtrl",
            scope: {
                currentConsol: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();