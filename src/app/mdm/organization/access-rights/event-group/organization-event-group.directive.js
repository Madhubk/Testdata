(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationEventGroup", OrganizationEventGroup);

    OrganizationEventGroup.$inject = [];

    function OrganizationEventGroup() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/access-rights/event-group/organization-event-group.html",
            link: Link,
            controller: "OrganizationEventGroupController",
            controllerAs: "OrganizationEventGroupCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
