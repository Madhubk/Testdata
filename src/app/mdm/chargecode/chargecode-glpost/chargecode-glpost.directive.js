(function () {
    "use strict";

    angular.module("Application")
        .directive("chargecodeGlpost", chargecodeGlpost);

    chargecodeGlpost.$inject = [];

    function chargecodeGlpost() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/chargecode/chargecode-Glpost/chargecode-Glpost.html",
            link: Link,
            controller: "ChargecodeGlpostController",
            controllerAs: "ChargecodeGlpostCtrl",
            scope: {
                currentChargecode: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();