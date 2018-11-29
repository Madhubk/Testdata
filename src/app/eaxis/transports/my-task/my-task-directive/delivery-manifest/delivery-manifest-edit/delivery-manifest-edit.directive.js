(function () {
    "use strict";

    angular
        .module("Application")
        .directive("deliverymanifestedit", DeliveryManifestEditDirective);

    DeliveryManifestEditDirective.$inject = [];

    function DeliveryManifestEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/my-task/my-task-directive/delivery-manifest/delivery-manifest-edit/delivery-manifest-edit.html",
            controller: "DeliveryManifestEditDirectiveController",
            controllerAs: "DeliveryManifestEditDirectiveCtrl",
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
