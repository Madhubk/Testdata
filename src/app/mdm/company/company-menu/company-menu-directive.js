(function () {
    "use strict";
    angular
        .module("Application")
        .directive("companyMenu", CompanyMenu);
        
    CompanyMenu.$inject = [];

    function CompanyMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/mdm/company/company-menu/company-menu.html",
            link: Link,
            controller: "CompanyMenuController",
            controllerAs: "CompanyMenuCtrl",
            scope: {
                currentCompany: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();