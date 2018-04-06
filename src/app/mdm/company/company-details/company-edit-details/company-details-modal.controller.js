(function() {
    "use strict";
    angular
        .module("Application")
        .controller("CompanyEditModalController", CompanyEditModalController);

    CompanyEditModalController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModalInstance", "APP_CONSTANT", "authService", "apiService", "companyConfig", "helperService", "param", "toastr"];

    function CompanyEditModalController($rootScope, $scope, $state, $q, $location, $timeout, $uibModalInstance, APP_CONSTANT, authService, apiService, companyConfig, helperService, param, toastr) {
        var CompEditModalCtrl = this;

        function Init() {
            CompEditModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Department_Basics",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.CurrentDepartment
            };
            CompEditModalCtrl.ePage.Masters.FormView = {};
            CompEditModalCtrl.ePage.Masters.param = param;
            CompEditModalCtrl.ePage.Masters.FormView = param.CurrentCompany;
            CompEditModalCtrl.ePage.Masters.FormViewTemp = angular.copy(param.CurrentCompany); 
            CompEditModalCtrl.ePage.Masters.Save = Save;
            CompEditModalCtrl.ePage.Masters.Cancel = Cancel;
        }

        function Save() {
            var _exports = {
                Data: CompEditModalCtrl.ePage.Masters.FormView
            };
            $uibModalInstance.close(_exports);
        };

        function Cancel() {
            $uibModalInstance.close(CompEditModalCtrl.ePage.Masters.FormViewTemp);
        };
        Init();
    }
})();
