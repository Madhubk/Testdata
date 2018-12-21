(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationAccessRights", OrganizationAccessRights);

    OrganizationAccessRights.$inject = [];

    function OrganizationAccessRights() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/access-rights/organization-access-rights.html",
            controller: "OrganizationAccessRightsController",
            controllerAs: "OrganizationAccessRightsCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("OrganizationAccessRightsController", OrganizationAccessRightsController);

    OrganizationAccessRightsController.$inject = ["helperService"];

    function OrganizationAccessRightsController(helperService) {
        var OrganizationAccessRightsCtrl = this;

        function Init() {
            var currentOrganization = OrganizationAccessRightsCtrl.currentOrganization[OrganizationAccessRightsCtrl.currentOrganization.label].ePage.Entities;

            OrganizationAccessRightsCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Access_Rights",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization,
            };
        }

        Init();
    }
})();
