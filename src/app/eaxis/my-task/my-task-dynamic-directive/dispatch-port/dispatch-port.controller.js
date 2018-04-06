(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DispatchPortDirectiveController", DispatchPortDirectiveController);

    DispatchPortDirectiveController.$inject = ["$scope", "$timeout", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "$window", "$location"];

    function DispatchPortDirectiveController($scope, $timeout, $uibModal, APP_CONSTANT, apiService, helperService, $window, $location) {
        var DispatchPortDirectiveCtrl = this;

        function Init() {
            DispatchPortDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Dispatch_Port",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DispatchPortDirectiveCtrl.ePage.Masters.MyTask = DispatchPortDirectiveCtrl.taskObj;
        }

        Init();
    }
})();
