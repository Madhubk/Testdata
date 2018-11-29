(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationExceptionGroup", OrganizationExceptionGroup);

    OrganizationExceptionGroup.$inject = [];

    function OrganizationExceptionGroup() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/access-rights/exception-group/organization-exception-group.html",
            link: Link,
            controller: "OrganizationExceptionGroupController",
            controllerAs: "OrganizationExceptionGroupCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
