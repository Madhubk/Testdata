(function () {
    "use strict";

    angular
        .module("Application")
        .directive("receiverCarrier", ReceiverCarrier);

    ReceiverCarrier.$inject = [];

    function ReceiverCarrier() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/transports/mapping/receiver-carrier/receiver-carrier.html",
            link: Link,
            controller: "ReceiverCarrierController",
            controllerAs: "ReceiverCarrierCtrl",
            scope: {
                currentMapping: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();