(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeThreePreAdviceCustomToolBar", ThreeThreePreAdviceCustomToolBar);

    ThreeThreePreAdviceCustomToolBar.$inject = [];

    function ThreeThreePreAdviceCustomToolBar() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-tool-bar/3_3_pre-advice-custom-toolbar-directive/3_3_pre-advice-custom-toolbar.html",
            link: Link,
            controller: "three_three_PreAdviceCustomToolBarController",
            controllerAs: "three_three_PreAdviceCustomToolBarCtrl",
            scope: {
                input: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
    }

})();