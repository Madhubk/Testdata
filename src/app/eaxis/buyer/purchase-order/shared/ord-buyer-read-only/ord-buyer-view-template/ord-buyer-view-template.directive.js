(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordBuyerViewTemplate", OrdBuyerViewTemplate);

    OrdBuyerViewTemplate.$inject = [];

    function OrdBuyerViewTemplate() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/shared/ord-buyer-read-only/ord-buyer-view-template/ord-buyer-view-template.html",
            controller: "OrdBuyerViewTemplateController",
            controllerAs: "OrdBuyerViewTemplateCtrl",
            scope: {
                currentOrder: "=",
                dataentryObject: "="
            },
            link: Link,
            bindToController: true
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();