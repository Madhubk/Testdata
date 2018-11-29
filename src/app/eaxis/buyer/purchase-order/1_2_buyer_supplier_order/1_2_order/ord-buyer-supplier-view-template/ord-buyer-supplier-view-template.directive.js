(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordBuyerSupplierViewTemplate", OrdBuyerSupplierViewTemplate);

    OrdBuyerSupplierViewTemplate.$inject = [];

    function OrdBuyerSupplierViewTemplate() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_2_buyer_supplier_order/1_2_order/ord-buyer-supplier-view-template/ord-buyer-supplier-view-template.html",
            controller: "OrdBuyerSupplierViewTemplateController",
            controllerAs: "OrdBuyerSupplierViewTemplateCtrl",
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