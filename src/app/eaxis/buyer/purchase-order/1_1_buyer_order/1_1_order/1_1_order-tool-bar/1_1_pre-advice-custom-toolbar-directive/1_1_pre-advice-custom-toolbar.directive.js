(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneOnePreAdviceCustomToolBar", oneOnePreAdviceCustomToolBar);

    oneOnePreAdviceCustomToolBar.$inject = [];

    function oneOnePreAdviceCustomToolBar() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-tool-bar/1_1_pre-advice-custom-toolbar-directive/1_1_pre-advice-custom-toolbar.html",
            link: Link,
            controller: "one_one_PreAdviceCustomToolBarController",
            controllerAs: "one_one_PreAdviceCustomToolBarCtrl",
            scope: {
                input: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
    }

})();