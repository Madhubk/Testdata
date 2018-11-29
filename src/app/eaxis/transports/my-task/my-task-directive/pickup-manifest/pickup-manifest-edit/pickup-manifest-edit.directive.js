(function () {
    "use strict";

    angular
        .module("Application")
        .directive("pickupmanifestedit", PickupManifestEditDirective);

    PickupManifestEditDirective.$inject = [];

    function PickupManifestEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/my-task/my-task-directive/pickup-manifest/pickup-manifest-edit/pickup-manifest-edit.html",
            controller: "PickupManifestEditDirectiveController",
            controllerAs: "PickupManifestEditDirectiveCtrl",
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
