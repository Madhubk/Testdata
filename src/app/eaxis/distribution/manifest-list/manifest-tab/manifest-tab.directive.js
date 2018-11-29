(function () {
    "use strict";

    angular
        .module("Application")
        .directive("manifestTab", ManifestTab);

    ManifestTab.$inject = [];

    function ManifestTab() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/manifest-list/manifest-tab/manifest-tab.html",
            link: Link,
            controller: "ManifestTabController",
            controllerAs: "ManifestTabCtrl",
            scope: {
                currentManifest: "=",
                dataentryObject: "=",
                isShowFooter: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

})();