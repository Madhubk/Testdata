(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dmsManifestItem", ManifestItem);

    ManifestItem.$inject = [];

    function ManifestItem() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/manifest-list/manifest-item/manifest-item.html",
            link: Link,
            controller: "ManifestItemController",
            controllerAs: "ManifestItemCtrl",
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