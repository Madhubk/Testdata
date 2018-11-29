(function () {
    "use strict";

    angular
        .module("Application")
        .directive("completeManifest", CompleteManifest);

    CompleteManifest.$inject = [];

    function CompleteManifest() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/manifest-list/complete-manifest/complete-manifest.html",
            link: Link,
            controller: "CompleteManifestController",
            controllerAs: "CompleteManifestCtrl",
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