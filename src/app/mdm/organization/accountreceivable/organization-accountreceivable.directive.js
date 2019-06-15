(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationAccountreceivable", OrganizationAccountreceivable);

    function OrganizationAccountreceivable() {
        let exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/accountreceivable/organization-accountreceivable.html",
            controller: "AccountReceivableController",
            controllerAs: "AccountReceivableCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;
    }

})()