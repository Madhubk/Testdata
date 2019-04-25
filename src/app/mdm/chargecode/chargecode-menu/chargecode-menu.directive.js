(function () {
    "use strict";

    angular.module("Application")
        .directive("chargecodeMenu", ChargecodeMenu);

    ChargecodeMenu.$inject = [];

    function ChargecodeMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/mdm/chargecode/chargecode-menu/chargecode-menu.html",
            link: Link,
            controller: "ChargecodeMenuController",
            controllerAs: "ChargecodeMenuCtrl",
            scope: {
                currentChargecode: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();