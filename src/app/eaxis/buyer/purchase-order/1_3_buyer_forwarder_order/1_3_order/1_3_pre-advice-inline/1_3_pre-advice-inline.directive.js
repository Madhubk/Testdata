(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneThreePreAdviceInline", oneThreePreAdviceInline);

    oneThreePreAdviceInline.$inject = [];

    function oneThreePreAdviceInline() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_pre-advice-inline/1_3_pre-advice-inline.html",
            link: Link,
            controller: "one_three_PreAdviceInlineController",
            controllerAs: "one_three_PreAdviceInlineCtrl",
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