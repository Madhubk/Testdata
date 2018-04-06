(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationAddress", OrganizationAddress);

    OrganizationAddress.$inject = [];

    function OrganizationAddress() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/address/organization-address.html",
            link: Link,
            controller: "OrganizationAddressController",
            controllerAs: "OrganizationAddressCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
