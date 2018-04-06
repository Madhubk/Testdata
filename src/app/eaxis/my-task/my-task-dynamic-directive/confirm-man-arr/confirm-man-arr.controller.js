(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConfirmArrivalAtDepotDirectiveController", ConfirmArrivalAtDepotDirectiveController);

    ConfirmArrivalAtDepotDirectiveController.$inject = ["$scope", "$timeout", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "$window", "$location"];

    function ConfirmArrivalAtDepotDirectiveController($scope, $timeout, $uibModal, APP_CONSTANT, apiService, helperService, $window, $location) {
        var ArrivalDepotDirectiveCtrl = this;

        function Init() {
            ArrivalDepotDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Confirm_Arrival_at_Depot",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            ArrivalDepotDirectiveCtrl.ePage.Masters.MyTask = ArrivalDepotDirectiveCtrl.taskObj;
        }

        Init();
    }
})();
