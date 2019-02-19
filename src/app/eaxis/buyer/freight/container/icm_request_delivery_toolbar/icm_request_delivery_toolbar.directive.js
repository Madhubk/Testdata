(function () {
    "use strict";

    angular
        .module("Application")
        .directive("icmRequestDeliveryToolbar", icmRequestDeliveryToolbar);

    icmRequestDeliveryToolbar.$inject = [];

    function icmRequestDeliveryToolbar() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/container/icm_request_delivery_toolbar/icm_request_delivery_toolbar.html",
            link: Link,
            controller: "icmRequestDeliveryToolbarController",
            controllerAs: "icmRequestDeliveryToolbarCtrl",
            scope: {
                input: "=",
                dataentryObject: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();