(function () {
    "use strict";

    angular
        .module("Application")
        .directive("preAdviceCustomToolBar", PreAdviceCustomToolBar);

    PreAdviceCustomToolBar.$inject = [];

    function PreAdviceCustomToolBar() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/order-tool-bar/pre-advice-custom-toolbar-directive/pre-advice-custom-toolbar.html",
            link: Link,
            controller: "PreAdviceCustomToolBarController",
            controllerAs: "PreAdviceCustomToolBarCtrl",
            scope: {
                input: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
    }

})();