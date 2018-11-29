(function () {
    "use strict";

    angular
        .module("Application")
        .directive("createManifestView", createManifestView);

    createManifestView.$inject = [];

    function createManifestView() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/manifest-list/create-manifest-read-only/create-manifest-view.html",
            link: Link,
            controller: "CreateManifestViewController",
            controllerAs: "CreateManifestViewCtrl",
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


