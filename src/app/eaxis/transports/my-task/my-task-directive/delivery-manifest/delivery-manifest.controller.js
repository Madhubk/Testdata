(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryManifestDirectiveController", DeliveryManifestDirectiveController);

    DeliveryManifestDirectiveController.$inject = ["$scope", "$timeout", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "$window", "$location"];

    function DeliveryManifestDirectiveController($scope, $timeout, $uibModal, APP_CONSTANT, apiService, helperService, $window, $location) {
        var DeliveryManifestDirectiveCtrl = this;

        function Init() {
            DeliveryManifestDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Delivery_Manifest",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DeliveryManifestDirectiveCtrl.ePage.Masters.MyTask = DeliveryManifestDirectiveCtrl.taskObj;

            getManifestDetails();
        }

        function getManifestDetails() {
            var _filter = {
                "PK": DeliveryManifestDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "TMSMAN"
            };

            apiService.post("eAxisAPI", "TmsManifest/FindAll", _input).then(function (response) {
                if (response.data.Response) {
                    DeliveryManifestDirectiveCtrl.ePage.Masters.ManifestDetails = response.data.Response[0];
                }
            });
        }


        Init();
    }
})();
