(function () {
    "use strict";

    angular
        .module("Application")
        .directive("relatedShipment", RelatedShipment);

    RelatedShipment.$inject = [];

    function RelatedShipment() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/related-shipment/related-shipment.html",
            link: Link,
            controller: "RelatedShipmentController",
            controllerAs: "RelatedShipmentCtrl",
            scope: {
                currentShipment: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
