(function () {
    "use strict";

    angular
        .module("Application")
        .directive("manifestDetails", ManifestDetails);

    ManifestDetails.$inject = [];

    function ManifestDetails() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/initiate-gatepass/manifest-details/manifest-details.html",
            link: Link,
            controller: "ManifestDetailsController",
            controllerAs: "ManifestDetailsCtrl",
            scope: {
                currentGatepass: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();