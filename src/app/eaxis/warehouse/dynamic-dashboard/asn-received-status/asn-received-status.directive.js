(function () {
    "use strict";

    angular
        .module("Application")
        .directive("asnReceivedStatus", AsnReceivedStatus);

    function AsnReceivedStatus() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/dynamic-dashboard/asn-received-status/asn-received-status.html",
            link: Link,
            controller: "AsnReceivedController",
            controllerAs: "AsnReceivedCtrl",
            scope: {
                currentObj: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();