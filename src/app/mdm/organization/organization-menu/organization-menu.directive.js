(function () {
    "use strict";
    angular
        .module("Application")
        .directive("organizationMenu", OrganizationMenu);

    OrganizationMenu.$inject = [];

    function OrganizationMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/mdm/organization/organization-menu/organization-menu.html",
            link: Link,
            controller: "OrganizationMenuController",
            controllerAs: "OrganizationMenuCtrl",
            scope: {
                currentTab: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
