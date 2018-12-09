(function () {
    "use strict";

    angular
        .module("Application")
        .directive("pendingPickupToolbar", PendingPickupToolbar);

    PendingPickupToolbar.$inject = [];

    function PendingPickupToolbar() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/pending-pickup-toolbar/pending-pickup-toolbar.html",
            link: Link,
            controller: "PendingPickupToolbarController",
            controllerAs: "PendingPickupToolbarCtrl",
            scope: {
                input: "=",
                dataentryObject: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

})();