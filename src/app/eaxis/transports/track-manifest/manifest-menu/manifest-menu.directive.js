(function () {
    "use strict";

    angular
        .module("Application")
        .directive("manifestMenu", ManifestMenu);

    ManifestMenu.$inject = [];

    function ManifestMenu() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/track-manifest/manifest-menu/manifest-menu.html",
            link: Link,
            controller: "ManifestMenuController",
            controllerAs: "ManifestMenuCtrl",
            scope: {
                currentManifest: "=",
                activeMenu: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

})();