(function () {
    "use strict";

    angular
        .module("Application")
        .directive("relatedOrganization", RelatedOrganization);

    RelatedOrganization.$inject = [];

    function RelatedOrganization() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/transports/mhu/mhu-general/related-organization/related-organization.html",
            link: Link,
            controller: "RelatedOrganizationController",
            controllerAs: "RelatedOrgCtrl",
            scope: {
                currentMhu: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();