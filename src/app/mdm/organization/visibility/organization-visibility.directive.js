(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationVisibility", OrganizationVisibility);

    OrganizationVisibility.$inject = [];

    function OrganizationVisibility() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/visibility/organization-visibility.html",
            link: Link,
            controller: "OrganizationVisibilityController",
            controllerAs: "OrganizationVisibilityCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
