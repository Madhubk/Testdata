(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeOneQuickView", ThreeOneConsolQuickView);

    ThreeOneConsolQuickView.$inject = [];

    function ThreeOneConsolQuickView() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_quickview/three-one-quickview.html",
            link: Link,
            controller: "ThreeOneQuickViewController",
            controllerAs: "ThreeOneQuickViewCtrl",
            scope: {
                obj: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();