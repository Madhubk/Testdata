(function () {
    "use strict";

    angular
        .module("Application")
        .directive("navbarDropdownMenu", NavbarDropdownMenu);

    NavbarDropdownMenu.$inject = ["$rootScope"];

    function NavbarDropdownMenu($rootScope) {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/nav-bar/navbar-dropdown-menu/navbar-dropdown-menu.html",
            controller: "NavBarDropDownMenuController",
            controllerAs: "NavBarDropDownMenuCtrl",
            bindToController: true,
            scope: {
                menuList: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) { }
    }
})();