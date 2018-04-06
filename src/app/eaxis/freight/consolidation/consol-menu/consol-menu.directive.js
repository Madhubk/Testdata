(function () {
    "use strict";

    angular
        .module("Application")
        .directive("consolMenu", ConsolMenu);

    ConsolMenu.$inject = [];

    function ConsolMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/freight/consolidation/consol-menu/consol-menu.html",
            link: Link,
            controller: "ConsolMenuController",
            controllerAs: "ConsolMenuCtrl",
            scope: {
                currentConsol: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
