(function () {
    "use strict";
    angular
        .module("Application")
        .controller("DepartmentMenuController", DepartmentMenuController);

    DepartmentMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "departmentConfig", "helperService"];

    function DepartmentMenuController($scope, $timeout, APP_CONSTANT, apiService, departmentConfig, helperService) {
        var DepartmentMenuCtrl = this;

        function Init() {
            var currentDepartment = DepartmentMenuCtrl.currentDepartment[DepartmentMenuCtrl.currentDepartment.label].ePage.Entities;

            DepartmentMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "DepartmentMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentDepartment
            };
            DepartmentMenuCtrl.ePage.Masters.DepartmentMenu = {};
        }

        Init();
    }
})();
