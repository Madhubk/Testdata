(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickupConsignmentDirectiveController", PickupConsignmentDirectiveController);

    PickupConsignmentDirectiveController.$inject = ["$scope", "$timeout", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "$window", "$location"];

    function PickupConsignmentDirectiveController($scope, $timeout, $uibModal, APP_CONSTANT, apiService, helperService, $window, $location) {
        var PickupConsignmentDirectiveCtrl = this;

        function Init() {
            PickupConsignmentDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Pickup_Consignment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            PickupConsignmentDirectiveCtrl.ePage.Masters.MyTask = PickupConsignmentDirectiveCtrl.taskObj;
        }

        Init();
    }
})();
