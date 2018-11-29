(function () {
    "use strict";

    angular
        .module("Application")
        .directive("approveManifest", ApproveManifest);

    ApproveManifest.$inject = [];

    function ApproveManifest() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/manifest-list/approve-manifest/approve-manifest.html",
            link: Link,
            controller: "ApproveManifestController",
            controllerAs: "ApproveManifestCtrl",
            scope: {
                currentManifest: "=",
                dataentryObject: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();