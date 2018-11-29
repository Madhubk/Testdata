(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeOneConsolMenu", ThreeOneConsolMenu);

    ThreeOneConsolMenu.$inject = [];

    function ThreeOneConsolMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_consol-menu/three-one-consol-menu.html",
            link: Link,
            controller: "ThreeOneConsolMenuController",
            controllerAs: "ThreeOneConsolMenuCtrl",
            scope: {
                currentConsol: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();