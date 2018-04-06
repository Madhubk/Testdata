(function () {
    "use strict";
    angular
        .module("Application")
        .controller("EmployeeMenuController", EmployeeMenuController);

    EmployeeMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "employeeConfig", "helperService"];

    function EmployeeMenuController($scope, $timeout, APP_CONSTANT, apiService, employeeConfig, helperService) {
        var EmployeeMenuCtrl = this;

        function Init() {
            
            var currentEmployee = EmployeeMenuCtrl.currentEmployee[EmployeeMenuCtrl.currentEmployee.label].ePage.Entities;

            EmployeeMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "OrganizationMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentEmployee
            };
            EmployeeMenuCtrl.ePage.Masters.OrganizationMenu = {};
            // Menu list from configuration
            // OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource = OrganizationMenuCtrl.ePage.Entities.Header.Meta.MenuList;
        }

        Init();
    }
})();
