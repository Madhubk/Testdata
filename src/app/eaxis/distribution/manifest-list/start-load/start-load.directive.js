(function () {
    "use strict";

    angular
        .module("Application")
        .directive("startLoad", StartLoad);

    StartLoad.$inject = [];

    function StartLoad() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/manifest-list/start-load/start-load.html",
            link: Link,
            controller: "StartLoadController",
            controllerAs: "StartLoadCtrl",
            scope: {
                currentManifest: "=",
                orgfk: "=",
                jobfk: "=",
                isShowFooter: "=",
                dataentryObject: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();