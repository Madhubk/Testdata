(function () {
    "use strict";

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
                "Prefix": "Organization_Event_Group",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization,
            };
        }

        Init();
    }
})();
