(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationDocumentGroup", OrganizationDocumentGroup);

    OrganizationDocumentGroup.$inject = [];

    function OrganizationDocumentGroup() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/access-rights/document-group/organization-document-group.html",
            link: Link,
            controller: "OrganizationDocumentGroupController",
            controllerAs: "OrganizationDocumentGroupCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
