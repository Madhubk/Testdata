(function () {
    "use strict";
    angular
        .module("Application")
        .directive("manifestConsignment", ManifestConsignment);

    ManifestConsignment.$inject = [];

    function ManifestConsignment() {
        
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/track-manifest/manifest-consignment/manifest-consignment.html",
            link: Link,
            controller: "ManifestConsignmentController",
            controllerAs: "ManifestConsignCtrl",
            scope: {
                currentManifest: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();