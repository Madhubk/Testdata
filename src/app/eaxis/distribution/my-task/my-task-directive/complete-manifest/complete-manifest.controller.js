(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CompleteManifestDirectiveController", CompleteManifestDirectiveController);

    CompleteManifestDirectiveController.$inject = ["$scope", "$timeout", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "$window", "$location", "appConfig"];

    function CompleteManifestDirectiveController($scope, $timeout, $uibModal, APP_CONSTANT, apiService, helperService, $window, $location, appConfig) {
        var CompleteManifestCtrl = this;

        function Init() {
            CompleteManifestCtrl.ePage = {
                "Title": "",
                "Prefix": "Complete_Manifest",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            CompleteManifestCtrl.ePage.Masters.MyTask = CompleteManifestCtrl.taskObj;
            getManifestDetails();
        }

        function getManifestDetails() {
            var _filter = {
                "PK": CompleteManifestCtrl.ePage.Masters.MyTask.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.TmsManifestList.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.TmsManifestList.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    CompleteManifestCtrl.ePage.Masters.ManifestDetails = response.data.Response[0];
                }
            });
        }

        Init();
    }
})();
