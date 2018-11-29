(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeThreePreAdviceInline", ThreeThreePreAdviceInline);

    ThreeThreePreAdviceInline.$inject = [];

    function ThreeThreePreAdviceInline() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_pre-advice-inline/3_3_pre-advice-inline.html",
            link: Link,
            controller: "three_three_PreAdviceInlineController",
            controllerAs: "three_three_PreAdviceInlineCtrl",
            scope: {
                currentObject: "=",
                btnVisible: "=",
                readOnly: "=",
                gridChange: "&",
                tableProperties: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();