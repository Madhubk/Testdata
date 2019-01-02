(function () {
    "use strict";

    angular
        .module("Application")
        .directive("deliveryRequestToolbar", DeliveryRequestToolbar);

    DeliveryRequestToolbar.$inject = [];

    function DeliveryRequestToolbar() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/delivery-request-toolbar/delivery-request-toolbar.html",
            link: Link,
            controller: "DeliveryRequestToolbarController",
            controllerAs: "DeliveryRequestToolbarCtrl",
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