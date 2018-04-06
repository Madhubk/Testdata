(function(){
    "use strict";

    angular
         .module("Application")
         .directive("manifestGeneral",ManifestGeneral);

    ManifestGeneral.$inject = [];

    function ManifestGeneral(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/track-manifest/manifest-general/manifest-general.html",
            link: Link,
            controller: "ManifestGeneralController",
            controllerAs: "ManifestGeneralCtrl",
            scope: {
                currentManifest: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();