(function () {
    "use strict";

    angular
        .module("Application")
        .directive("partiesDetails", PartiesDetails);

    PartiesDetails.$inject = [];

    function PartiesDetails() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/parties-details/parties-details.html",
            link: Link,
            controller: "PartiesDetailsController",
            controllerAs: "PartiesDetailsCtrl",
            scope: {
                currentObj: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
