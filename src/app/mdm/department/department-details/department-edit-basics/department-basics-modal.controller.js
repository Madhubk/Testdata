(function () {
    "use strict";
    angular
        .module("Application")
        .controller("DeptEditModalController", DeptEditModalController);

    DeptEditModalController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModalInstance", "APP_CONSTANT", "authService", "apiService", "departmentConfig", "helperService", "param", "toastr"];

    function DeptEditModalController($rootScope, $scope, $state, $q, $location, $timeout, $uibModalInstance, APP_CONSTANT, authService, apiService, departmentConfig, helperService, param, toastr) {
        var DeptEditModalCtrl = this;

        function Init() {
            DeptEditModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Department_Basics",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.CurrentDepartment
            };
            DeptEditModalCtrl.ePage.Masters.FormView = {};
            DeptEditModalCtrl.ePage.Masters.param = param;
            DeptEditModalCtrl.ePage.Masters.FormView = param.CurrentDepartment.DepartmentHeader.Data;
            DeptEditModalCtrl.ePage.Masters.FormViewTemp= angular.copy(param.CurrentDepartment.DepartmentHeader.Data); 
            DeptEditModalCtrl.ePage.Masters.Save = Save;
            DeptEditModalCtrl.ePage.Masters.Cancel = Cancel;
        }

        function Save() {
            var _exports = {
                Data: DeptEditModalCtrl.ePage.Masters.FormView
            };
            $uibModalInstance.close(_exports);
        };

        function Cancel() {
            
            $uibModalInstance.close(DeptEditModalCtrl.ePage.Masters.FormViewTemp);
        };
        
        Init();
    }
})();
