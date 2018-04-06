(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationReference", OrganizationReference);

    OrganizationReference.$inject = [];

    function OrganizationReference() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/reference/organization-reference.html",
            link: Link,
            controller: "OrganizationReferenceController",
            controllerAs: "OrganizationReferenceCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
