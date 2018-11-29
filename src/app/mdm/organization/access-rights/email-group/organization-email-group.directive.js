(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationEmailGroup", OrganizationEmailGroup);

    OrganizationEmailGroup.$inject = [];

    function OrganizationEmailGroup() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/access-rights/email-group/organization-email-group.html",
            link: Link,
            controller: "OrganizationEmailGroupController",
            controllerAs: "OrganizationEmailGroupCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
