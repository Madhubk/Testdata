(function () {
    "use strict";

    angular.module("Application")
        .directive("organizationAccountpayable", organizationAccountpayable);

    organizationAccountpayable.$inject = [];

    function organizationAccountpayable() {
        let exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/accountpayable/organization-accountpayable.html",
            controller: "AccountPayableController",
            controllerAs: "AccountPayableCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;
    }

})();