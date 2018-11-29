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
            getManifestDetails();
        }

        function getManifestDetails() {
            var _filter = {
                "PK": ReceiveItemDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "TMSMAN"
            };

            apiService.post("eAxisAPI", "TmsManifest/FindAll", _input).then(function (response) {
                if (response.data.Response) {
                    ReceiveItemDirectiveCtrl.ePage.Masters.ManifestDetails = response.data.Response[0];
                }
            });
        }
        Init();
    }
})();
