(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickupManifestDirectiveController", PickupManifestDirectiveController);

    PickupManifestDirectiveController.$inject = ["$scope", "$timeout", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "$window", "$location"];

    function PickupManifestDirectiveController($scope, $timeout, $uibModal, APP_CONSTANT, apiService, helperService, $window, $location) {
        var PickupManifestDirectiveCtrl = this;

        function Init() {
            PickupManifestDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Pickup_Manifest",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            PickupManifestDirectiveCtrl.ePage.Masters.MyTask = PickupManifestDirectiveCtrl.taskObj;

            getManifestDetails();
        }

        function getManifestDetails() {
            var _filter = {
                "PK": PickupManifestDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "TMSMAN"
            };

            apiService.post("eAxisAPI", "TmsManifest/FindAll", _input).then(function (response) {
                if (response.data.Response) {
                    PickupManifestDirectiveCtrl.ePage.Masters.ManifestDetails = response.data.Response[0];
                }
            });
        }

        Init();
    }
})();
