(function () {
    "use strict";

    angular
        .module("Application")
        .directive("manifestCustomToolBar", ManifestCustomToolBar);

    ManifestCustomToolBar.$inject = [];
    
    function ManifestCustomToolBar() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/track-manifest/manifest-tool-bar/manifest-tool-bar.html",
            link: Link,
            controller: "ManifestCustomToolBarController",
            controllerAs: "ManifestToolBarCtrl",
            scope: {
                input: "=",
                dataentryObject: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

})();