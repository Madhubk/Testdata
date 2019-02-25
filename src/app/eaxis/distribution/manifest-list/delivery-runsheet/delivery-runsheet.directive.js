(function () {
    "use strict";

    angular
        .module("Application")
        .directive("deliveryRunsheet", DeliveryRunsheet);

    DeliveryRunsheet.$inject = [];

    function DeliveryRunsheet() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/manifest-list/delivery-runsheet/delivery-runsheet.html",
            link: Link,
            controller: "DeliveryRunsheetController",
            controllerAs: "DeliveryRunsheetCtrl",
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