(function () {
    "use strict";
    angular
        .module("Application")
        .controller("BranchMenuController", BranchMenuController);

    BranchMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "branchConfig", "helperService"];

    function BranchMenuController($scope, $timeout, APP_CONSTANT, apiService, branchConfig, helperService) {
        var BranchMenuCtrl = this;
        function Init() {
            var currentBranch = BranchMenuCtrl.currentBranch[BranchMenuCtrl.currentBranch.label].ePage.Entities;
            BranchMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Branch_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBranch
            };
            BranchMenuCtrl.ePage.Masters.DepartmentMenu = {};
            BranchMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            BranchMenuCtrl.ePage.Masters.Config = branchConfig;
            // Menu list from configuration
        }
        Init();
    }
})();