(function () {
    "use strict";

    angular
        .module("Application")
        .directive("consignmentGeneral", ConsignmentGeneral);

    ConsignmentGeneral.$inject = [];

    function ConsignmentGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/consignment/consignment-general/consignment-general.html",
            link: Link,
            controller: "DMSConsignmentGeneralController",
            controllerAs: "DMSConsignmentGeneralCtrl",
            scope: {
                currentConsignment: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();