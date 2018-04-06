(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationContact", OrganizationContact);

    OrganizationContact.$inject = [];

    function OrganizationContact() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/contact/organization-contact.html",
            link: Link,
            controller: "OrganizationContactController",
            controllerAs: "OrganizationContactCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
