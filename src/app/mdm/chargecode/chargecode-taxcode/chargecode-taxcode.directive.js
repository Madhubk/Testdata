(function () {
    "use strict";

    angular.module("Application")
        .directive("chargecodeTaxcode", chargecodeTaxcode);

    chargecodeTaxcode.$inject = [];

    function chargecodeTaxcode() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/chargecode/chargecode-taxcode/chargecode-taxcode.html",
            link: Link,
            controller: "ChargecodeTaxcodeController",
            controllerAs: "ChargecodeTaxcodeCtrl",
            scope: {
                currentChargecode: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();