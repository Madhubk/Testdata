(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneOnePreAdviceInline", oneOnePreAdviceInline);

    oneOnePreAdviceInline.$inject = [];

    function oneOnePreAdviceInline() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_pre-advice-inline/1_1_pre-advice-inline.html",
            link: Link,
            controller: "one_one_PreAdviceInlineController",
            controllerAs: "one_one_PreAdviceInlineCtrl",
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