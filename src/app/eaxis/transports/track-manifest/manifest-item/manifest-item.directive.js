(function(){
    "use strict";

    angular
         .module("Application")
         .directive("manifestItem",ManifestItem);

    ManifestItem.$inject = [];

    function ManifestItem(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/track-manifest/manifest-item/manifest-item.html",
            link: Link,
            controller: "ManifestItemController",
            controllerAs: "ManifestItemCtrl",
            scope: {
                currentManifest: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();