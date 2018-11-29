(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneOneOrderCustomToolBar", oneOneOrderCustomToolBar);

    oneOneOrderCustomToolBar.$inject = [];

    function oneOneOrderCustomToolBar() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-tool-bar/1_1_order-tool-bar.html",
            link: Link,
            controller: "one_one_OrderCustomToolBarController",
            controllerAs: "one_one_OrderCustomToolBarCtrl",
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