(function () {
    "use strict";

    angular
        .module("Application")
        .directive("deliveryConsignmentCustomToolbar", DeliveryConsignmentCustomToolbar);

    DeliveryConsignmentCustomToolbar.$inject = [];

    function DeliveryConsignmentCustomToolbar() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/delivery-consignment/delivery-consign-custom-toolbar/delivery-consign-custom-toolbar.html",
            link: Link,
            controller: "DeliveryConsignmentToolBarController",
            controllerAs: "DeliveryConsignToolBarCtrl",
            scope: {
                input: "=",
                dataentryObject: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

})();