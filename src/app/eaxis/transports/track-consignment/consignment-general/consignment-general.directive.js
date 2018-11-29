(function () {
    "use strict";

    angular
        .module("Application")
        .directive("consignmentGeneral", ConsignmentGeneral);

    ConsignmentGeneral.$inject = [];

    function ConsignmentGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/track-consignment/consignment-general/consignment-general.html",
            link: Link,
            controller: "ConsignmentGeneralController",
            controllerAs: "ConsignmentGeneralCtrl",
            scope: {
                currentConsignment: "=",
                isActive: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();