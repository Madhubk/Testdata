(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationRelatedParties", OrganizationRelatedParties);

    OrganizationRelatedParties.$inject = [];

    function OrganizationRelatedParties() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/relatedparties/organization-relatedparties.html",
            link: Link,
            controller: "OrgRelatedPartiesController",
            controllerAs: "OrgRelatedPartiesCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
