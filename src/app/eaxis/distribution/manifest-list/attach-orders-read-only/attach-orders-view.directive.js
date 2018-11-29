(function () {
    "use strict";

    angular
        .module("Application")
        .directive("attachOrdersView", attachOrdersView);

    attachOrdersView.$inject = [];

    function attachOrdersView() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/manifest-list/attach-orders-read-only/attach-orders-view.html",
            link: Link,
            controller: "AttachOrdersViewController",
            controllerAs: "AttachOrdersViewCtrl",
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


