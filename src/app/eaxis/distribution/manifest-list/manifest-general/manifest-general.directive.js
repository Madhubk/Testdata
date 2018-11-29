(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dmsManifestGeneral", ManifestGeneral);

    ManifestGeneral.$inject = [];

    function ManifestGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/manifest-list/manifest-general/manifest-general.html",
            link: Link,
            controller: "ManifestGeneralController",
            controllerAs: "ManifestGeneralCtrl",
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