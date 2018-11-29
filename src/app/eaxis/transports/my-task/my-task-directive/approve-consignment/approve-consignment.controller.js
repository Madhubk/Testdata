(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ApproveConsignmentController", ApproveConsignmentController);

    ApproveConsignmentController.$inject = ["$scope", "$timeout", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "$window", "$location"];

    function ApproveConsignmentController($scope, $timeout, $uibModal, APP_CONSTANT, apiService, helperService, $window, $location) {
        var ApproveConsignmentEditDirectiveCtrl = this;

        function Init() {
            ApproveConsignmentEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Dispatch_Port",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            ApproveConsignmentEditDirectiveCtrl.ePage.Masters.MyTask = ApproveConsignmentEditDirectiveCtrl.taskObj;
        }

        Init();
    }
})();
