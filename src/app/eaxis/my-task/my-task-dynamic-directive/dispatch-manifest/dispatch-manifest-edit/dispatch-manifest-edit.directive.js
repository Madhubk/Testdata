(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dispatchmanifestedit", DispatchManifestEditDirective);

    DispatchManifestEditDirective.$inject = [];

    function DispatchManifestEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/dispatch-manifest/dispatch-manifest-edit/dispatch-manifest-edit.html",
            controller: "DispatchManifestEditDirectiveController",
            controllerAs: "DispatchEditDirectiveCtrl",
            bindToController: true,
            link: Link,
            scope: {
                taskObj: "=",
                entityObj: "=",
                tabObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) { }
    }
})();
