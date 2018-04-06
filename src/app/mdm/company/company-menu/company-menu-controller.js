(function() {
    "use strict";
    angular
        .module("Application")
        .controller("CompanyMenuController", CompanyMenuController);

    CompanyMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "companyConfig", "helperService"];

    function CompanyMenuController($scope, $timeout, APP_CONSTANT, apiService, companyConfig, helperService) {
        var CompanyMenuCtrl = this;

        function Init() {
            var currentCompany = CompanyMenuCtrl.currentCompany[CompanyMenuCtrl.currentCompany.label].ePage.Entities;
            CompanyMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "DepartmentMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentCompany
            };
            CompanyMenuCtrl.ePage.Masters.CompanyMenu = {};
            // Menu list from configuration
            // OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource = OrganizationMenuCtrl.ePage.Entities.Header.Meta.MenuList;
        }

        Init();
    }
})();
