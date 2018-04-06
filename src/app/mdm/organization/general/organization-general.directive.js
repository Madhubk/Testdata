(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationGeneral", OrganizationGeneral);

    OrganizationGeneral.$inject = [];

    function OrganizationGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/general/organization-general.html",
            link: Link,
            controller: "OrganizationGeneralController",
            controllerAs: "OrganizationGeneralCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
