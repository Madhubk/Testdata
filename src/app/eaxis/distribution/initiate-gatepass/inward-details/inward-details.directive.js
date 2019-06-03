(function () {
    "use strict";

    angular
        .module("Application")
        .directive("inwardDetails", InwardDetails);

    InwardDetails.$inject = [];

    function InwardDetails() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/initiate-gatepass/inward-details/inward-details.html",
            link: Link,
            controller: "InwardDetailsController",
            controllerAs: "InwardDetailsCtrl",
            scope: {
                currentGatepass: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();