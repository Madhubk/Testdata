(function () {
    "use strict";

    angular
        .module("Application")
        .directive("typeMenu", TypeMenu);

    TypeMenu.$inject = [];

    function TypeMenu() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/transports/types/types-menu/types-menu.html",
            link: Link,
            controller: "TypeMenuController",
            controllerAs: "TypeMenuCtrl",
            scope: {
                activeMenu: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

})();