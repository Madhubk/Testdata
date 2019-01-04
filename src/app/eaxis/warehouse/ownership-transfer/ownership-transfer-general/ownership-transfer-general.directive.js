(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ownershipTransferGeneral", OwnershipTransferGeneral);

        OwnershipTransferGeneral.$inject = [];

    function OwnershipTransferGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/ownership-transfer/ownership-transfer-general/ownership-transfer-general.html",
            link: Link,
            controller: "OwnershipTransferGeneralController",
            controllerAs: "OwnershipTransferGeneralCtrl",
            scope: {
                currentOwnerTransfer: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();