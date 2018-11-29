(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dmsManifestMenu", ManifestMenu);

    ManifestMenu.$inject = [];

    function ManifestMenu() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/manifest-list/manifest-menu/manifest-menu.html",
            link: Link,
            controller: "DMSManifestMenuController",
            controllerAs: "DMSManifestMenuCtrl",
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