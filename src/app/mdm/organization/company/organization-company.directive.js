(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationCompany", OrganizationCompany);

    OrganizationCompany.$inject = [];

    function OrganizationCompany() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/company/organization-company.html",
            link: Link,
            controller: "OrganizationCompanyController",
            controllerAs: "OrganizationCompanyCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
