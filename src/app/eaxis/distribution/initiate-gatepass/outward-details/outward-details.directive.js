(function () {
    "use strict";

    angular
        .module("Application")
        .directive("outwardDetails", OutwardDetails);

    OutwardDetails.$inject = [];

    function OutwardDetails() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/initiate-gatepass/outward-details/outward-details.html",
            link: Link,
            controller: "OutwardDetailsController",
            controllerAs: "OutwardDetailsCtrl",
            scope: {
                currentGatepass: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();