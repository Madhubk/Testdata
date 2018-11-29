(function () {
    "use strict";

    angular
        .module("Application")
        .directive("depotContact", DepotContact);

    DepotContact.$inject = [];

    function DepotContact() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/depot-contact/depot-contact.html",
            link: Link,
            controller: "DepotContactController",
            controllerAs: "DepotContactCtrl",
            scope: {
                dataentryObject: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

})();