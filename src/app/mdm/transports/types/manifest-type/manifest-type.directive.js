(function () {
    "use strict";

    angular
        .module("Application")
        .directive("manifestType", ManifestType);

    ManifestType.$inject = [];

    function ManifestType() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/transports/types/manifest-type/manifest-type.html",
            link: Link,
            controller: "ManifestTypeController",
            controllerAs: "ManifestTypeCtrl",
            scope: {
                currentType: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();