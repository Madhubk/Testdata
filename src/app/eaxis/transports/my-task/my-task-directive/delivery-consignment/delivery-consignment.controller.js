(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryConsignmentDirectiveController", DeliveryConsignmentDirectiveController);

    DeliveryConsignmentDirectiveController.$inject = ["$scope", "$timeout", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "$window", "$location"];

    function DeliveryConsignmentDirectiveController($scope, $timeout, $uibModal, APP_CONSTANT, apiService, helperService, $window, $location) {
        var DeliveryConsignmentDirectiveCtrl = this;

        function Init() {
            DeliveryConsignmentDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Delivery_Consignment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DeliveryConsignmentDirectiveCtrl.ePage.Masters.MyTask = DeliveryConsignmentDirectiveCtrl.taskObj;
        }

        Init();
    }
})();
