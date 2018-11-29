(function () {
    "use strict";

    angular
        .module("Application")
        .directive("orderCustomToolBar", OrderCustomToolBar);

    OrderCustomToolBar.$inject = [];

    function OrderCustomToolBar() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/order-tool-bar/order-tool-bar.html",
            link: Link,
            controller: "OrderCustomToolBarController",
            controllerAs: "OrderCustomToolBarCtrl",
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