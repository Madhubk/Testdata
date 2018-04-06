(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationEmployee", OrganizationEmployee);

    OrganizationEmployee.$inject = [];

    function OrganizationEmployee() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/employee/organization-employee.html",
            link: Link,
            controller: "OrganizationEmployeeController",
            controllerAs: "OrganizationEmployeeCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
