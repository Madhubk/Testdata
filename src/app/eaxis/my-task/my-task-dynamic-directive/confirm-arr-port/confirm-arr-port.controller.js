(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConfirmArrivalAtPortDirectiveController", ConfirmArrivalAtPortDirectiveController);

    ConfirmArrivalAtPortDirectiveController.$inject = ["$scope", "$timeout", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "$window", "$location"];

    function ConfirmArrivalAtPortDirectiveController($scope, $timeout, $uibModal, APP_CONSTANT, apiService, helperService, $window, $location) {
        var ArrivalPortDirectiveCtrl = this;

        function Init() {
            ArrivalPortDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Confirm_Arrival_at_Port",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            ArrivalPortDirectiveCtrl.ePage.Masters.MyTask = ArrivalPortDirectiveCtrl.taskObj;
        }

        Init();
    }
})();
