(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeThreeOrderCustomToolBar", ThreeThreeOrderCustomToolBar);

    ThreeThreeOrderCustomToolBar.$inject = [];

    function ThreeThreeOrderCustomToolBar() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-tool-bar/3_3_order-tool-bar.html",
            link: Link,
            controller: "three_three_OrderCustomToolBarController",
            controllerAs: "three_three_OrderCustomToolBarCtrl",
            scope: {
                input: "=",
                dataentryObject: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
    }

})();