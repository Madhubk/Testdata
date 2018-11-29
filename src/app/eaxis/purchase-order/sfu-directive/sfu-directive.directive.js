(function () {
    "use strict";

    angular
        .module("Application")
        .directive("supplierFollowUpDirective", SupplierFollowUpDirective);

    SupplierFollowUpDirective.$inject = [];

    function SupplierFollowUpDirective() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/purchase-order/sfu-directive/sfu-directive.html",
            link: Link,
            controller: "supplierFollowUpDirectiveController",
            controllerAs: "SupplierFollowUpDirectiveCtrl",
            scope: {
                entity: "=",
                filter: "=",
                reload: "&"
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();