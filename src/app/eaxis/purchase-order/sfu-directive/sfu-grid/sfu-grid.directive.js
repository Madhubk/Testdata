(function () {
    "use strict";

    angular
        .module("Application")
        .directive("supplierFollowUpGridDirective", SupplierFollowUpGridDirective);

    SupplierFollowUpGridDirective.$inject = [];

    function SupplierFollowUpGridDirective() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/purchase-order/sfu-directive/sfu-grid/sfu-grid-directive.html",
            link: Link,
            controller: "supplierFollowUpGridDirectiveController",
            controllerAs: "SupplierFollowUpGridDirectiveCtrl",
            scope: {
                input: "=",
                gridChange: "&",
                selectedlist: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
