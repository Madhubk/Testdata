(function() {
    "use strict";
    angular
        .module("Application")
        .controller("BranchModalController", BranchModalController);

    BranchModalController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModalInstance", "APP_CONSTANT", "authService", "apiService", "helperService", "param", "branchConfig"];

    function BranchModalController($rootScope, $scope, $state, $q, $location, $timeout, $uibModalInstance, APP_CONSTANT, authService, apiService,
        helperService, param, branchConfig) {
        var BranchModalCtrl = this;
        
        function Init() {
            BranchModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Branch_Address",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.currentBranch
            };
            BranchModalCtrl.ePage.Masters.FormView = {};
            BranchModalCtrl.ePage.Masters.param = param;
            BranchModalCtrl.ePage.Masters.FormView = param.currentBranch.BranchHeader.Data;
            BranchModalCtrl.ePage.Masters.FormViewTemp = angular.copy(param.currentBranch.BranchHeader.Data);
            BranchModalCtrl.ePage.Masters.Save = Save;
            BranchModalCtrl.ePage.Masters.Cancel = Cancel;

        }
        function Save() {
            var _exports = {
                Data: BranchModalCtrl.ePage.Masters.FormView,
            };
            $uibModalInstance.close(_exports);
        };

        function Cancel() {
            $uibModalInstance.close(BranchModalCtrl.ePage.Masters.FormViewTemp);
        };

        Init();
    }
})();
