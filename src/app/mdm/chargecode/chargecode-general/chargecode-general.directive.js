(function () {
    "use strict";

    angular.module("Application")
        .directive("chargecodeGeneral", chargecodeGeneral);

    chargecodeGeneral.$inject = [];

    function chargecodeGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/chargecode/chargecode-general/chargecode-general.html",
            link: Link,
            controller: "ChargecodeGeneralController",
            controllerAs: "ChargecodeGeneralCtrl",
            scope: {
                currentChargecode: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();