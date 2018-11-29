(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationAccessRights", OrganizationAccessRights);

    OrganizationAccessRights.$inject = [];

    function OrganizationAccessRights() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/access-rights/organization-access-rights.html",
            link: Link,
            controller: "OrganizationAccessRightsController",
            controllerAs: "OrganizationAccessRightsCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
