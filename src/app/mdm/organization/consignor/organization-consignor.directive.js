(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationConsignor", OrganizationConsignor);

    OrganizationConsignor.$inject = [];

    function OrganizationConsignor() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/consignor/organization-consignor.html",
            link: Link,
            controller: "organizationConsignorController",
            controllerAs: "OrganizationConsignorCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
