(function () {
    "use strict";

    angular
        .module("Application")
        .directive("consolOrganizationDetails", ConsolOrganizationDetails);

        ConsolOrganizationDetails.$inject = [];

    function ConsolOrganizationDetails() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/consol-organization-details/consol-organization-details.html",
            link: Link,
            controller: "ConsolOrganizationDetailsController",
            controllerAs: "ConsolOrganizationDetailsCtrl",
            scope: {
                currentObj: "=",
                readOnly: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();
