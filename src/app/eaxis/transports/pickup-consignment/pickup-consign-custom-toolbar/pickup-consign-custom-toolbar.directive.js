(function () {
    "use strict";

    angular
        .module("Application")
        .directive("pickupConsignmentCustomToolbar", PickupConsignmentCustomToolbar);

    PickupConsignmentCustomToolbar.$inject = [];

    function PickupConsignmentCustomToolbar() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/pickup-consignment/pickup-consign-custom-toolbar/pickup-consign-custom-toolbar.html",
            link: Link,
            controller: "PickupConsignmentToolBarController",
            controllerAs: "PickupConsignToolBarCtrl",
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