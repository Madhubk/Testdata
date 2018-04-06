(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationConsignee", OrganizationConsignee);

    OrganizationConsignee.$inject = [];

    function OrganizationConsignee() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/consignee/organization-consignee.html",
            link: Link,
            controller: "OrganizationConsigneeController",
            controllerAs: "OrganizationConsigneeCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
