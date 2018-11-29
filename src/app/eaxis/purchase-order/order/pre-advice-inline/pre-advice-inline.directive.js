(function () {
    "use strict";

    angular
        .module("Application")
        .directive("preAdviceInline", PreAdviceInline);

    PreAdviceInline.$inject = [];

    function PreAdviceInline() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/pre-advice-inline/pre-advice-inline.html",
            link: Link,
            controller: "PreAdviceInlineController",
            controllerAs: "PreAdviceInlineCtrl",
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