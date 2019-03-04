(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneOneBatchCustomToolBar", OneOneBatchCustomToolBar);

    OneOneBatchCustomToolBar.$inject = [];

    function OneOneBatchCustomToolBar() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order_batch/1_1_batch-tool-bar/1_1_batch-tool-bar.html",
            link: Link,
            controller: "one_one_BatchCustomToolBarController",
            controllerAs: "one_one_BatchCustomToolBarCtrl",
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