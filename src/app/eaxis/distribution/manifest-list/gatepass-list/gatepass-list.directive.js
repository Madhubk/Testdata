(function () {
    "use strict";

    angular
        .module("Application")
        .directive("gatepassList", GatepassList);

    GatepassList.$inject = [];

    function GatepassList() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/manifest-list/gatepass-list/gatepass-list.html",
            link: Link,
            controller: "GatepassListController",
            controllerAs: "GatepassListCtrl",
            scope: {
                currentManifest: "=",
                orgfk: "=",
                jobfk:"=",
                dataentryObject: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();