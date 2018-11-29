(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationTaskGroup", OrganizationTaskGroup);

        OrganizationTaskGroup.$inject = [];

    function OrganizationTaskGroup() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/access-rights/task-group/organization-task-group.html",
            link: Link,
            controller: "OrganizationTaskGroupController",
            controllerAs: "OrganizationTaskGroupCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
