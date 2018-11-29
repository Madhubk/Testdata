(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationCommentGroup", OrganizationCommentGroup);

    OrganizationCommentGroup.$inject = [];

    function OrganizationCommentGroup() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/access-rights/comment-group/organization-comment-group.html",
            link: Link,
            controller: "OrganizationCommentGroupController",
            controllerAs: "OrganizationCommentGroupCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
