(function(){
    "use strict";

    angular
         .module("Application")
         .directive("manifestReadOnly",ManifestReadOnly);

    ManifestReadOnly.$inject = [];

    function ManifestReadOnly(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/track-manifest/manifest-read-only/manifest-read-only.html",
            link: Link,
            controller: "ManifestReadOnlyController",
            controllerAs: "ManifestReadOnlyCtrl",
            scope: {
                currentManifest: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();