(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConfirmManifestDirectiveController", ConfirmManifestDirectiveController);

    ConfirmManifestDirectiveController.$inject = ["$scope", "$timeout", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "$window", "$location", "appConfig"];

    function ConfirmManifestDirectiveController($scope, $timeout, $uibModal, APP_CONSTANT, apiService, helperService, $window, $location, appConfig) {
        var ConfirmManifestCtrl = this;

        function Init() {
            ConfirmManifestCtrl.ePage = {
                "Title": "",
                "Prefix": "Confirm_Manifest",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            ConfirmManifestCtrl.ePage.Masters.MyTask = ConfirmManifestCtrl.taskObj;
            getManifestDetails();
        }

        function getManifestDetails() {
            var _filter = {
                "PK": ConfirmManifestCtrl.ePage.Masters.MyTask.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.TmsManifestList.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.TmsManifestList.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConfirmManifestCtrl.ePage.Masters.ManifestDetails = response.data.Response[0];
                }
            });
        }

        Init();
    }
})();
