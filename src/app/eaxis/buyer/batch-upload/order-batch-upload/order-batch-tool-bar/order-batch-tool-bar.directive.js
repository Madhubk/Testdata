(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneOneBatchCustomToolBar", OneOneBatchCustomToolBar);

    OneOneBatchCustomToolBar.$inject = [];

    function OneOneBatchCustomToolBar() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/batch-upload/order-batch-upload/order-batch-tool-bar/order-batch-tool-bar.html",
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