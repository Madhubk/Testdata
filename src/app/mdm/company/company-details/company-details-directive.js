(function() {
    "use strict";

    angular
        .module("Application")
        .directive("companyDetails", CompanyDetails);
    CompanyDetails.$inject = [];

    function CompanyDetails() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/company/company-details/company-details.html",
            link: Link,
            controller: "CompanyDetailsController",
            controllerAs: "CompanyDetailsCtrl",
            scope: {
                currentCompany: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();