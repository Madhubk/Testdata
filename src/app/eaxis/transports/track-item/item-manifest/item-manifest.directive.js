(function(){
    "use strict";

    angular
         .module("Application")
         .directive("itemManifest",itemManifest);

    itemManifest.$inject = [];

    function itemManifest(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/track-item/item-manifest/item-manifest.html",
            link: Link,
            controller: "ItemManifestController",
            controllerAs: "ItemManifestCtrl",
            scope: {
                currentItem: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();