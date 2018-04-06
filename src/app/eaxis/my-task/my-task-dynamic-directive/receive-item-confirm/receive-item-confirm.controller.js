(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ReceiveItemConfirmDirectiveController", ReceiveItemConfirmDirectiveController);

    ReceiveItemConfirmDirectiveController.$inject = ["$scope", "$timeout", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "$window", "$location"];

    function ReceiveItemConfirmDirectiveController($scope, $timeout, $uibModal, APP_CONSTANT, apiService, helperService, $window, $location) {
        var ReceiveItemDirectiveCtrl = this;

        function Init() {
            ReceiveItemDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Receive_Items",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            ReceiveItemDirectiveCtrl.ePage.Masters.MyTask = ReceiveItemDirectiveCtrl.taskObj;
        }

        Init();
    }
})();
