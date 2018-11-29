(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dispatchmanifest", DispatchManifestDirective);

    function DispatchManifestDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/my-task/my-task-directive/dispatch-manifest/dispatch-manifest.html",
            link: Link,
            controller: "DispatchManifestDirectiveController",
            controllerAs: "DispatchManifestDirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();
