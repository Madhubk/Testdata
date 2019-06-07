(function () {
    "use strict";

    angular.module("Application")
        .directive("glaccountMenu", GLaccountMenu);

        GLaccountMenu.$inject = [];

    function GLaccountMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/mdm/glaccount/glaccount-menu/glaccount-menu.html",
            link: Link,
            controller: "GLaccountMenuController",
            controllerAs: "GLaccountMenuCtrl",
            scope: {
                currentGlaccount: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();