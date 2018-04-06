(function () {
    "use strict";

    angular
        .module("Application")
        .directive("senderCarrier", SenderCarrier);

    SenderCarrier.$inject = [];

    function SenderCarrier() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/transports/mapping/sender-carrier/sender-carrier.html",
            link: Link,
            controller: "SenderCarrierController",
            controllerAs: "SenderCarrierCtrl",
            scope: {
                currentMapping: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();