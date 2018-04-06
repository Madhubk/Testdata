(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationGenRelatedParties", OrganizationGenRelatedParties);

    OrganizationGenRelatedParties.$inject = [];

    function OrganizationGenRelatedParties() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/generalrelatedparties/organization-generalrelatedparties.html",
            link: Link,
            controller: "OrgGenRelatedPartiesController",
            controllerAs: "OrgGenRelatedPartiesCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
