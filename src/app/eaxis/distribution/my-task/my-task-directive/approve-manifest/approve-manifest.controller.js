(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ApproveManifestDirectiveController", ApproveManifestDirectiveController);

    ApproveManifestDirectiveController.$inject = ["$scope", "$timeout", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "$window", "$location", "appConfig"];

    function ApproveManifestDirectiveController($scope, $timeout, $uibModal, APP_CONSTANT, apiService, helperService, $window, $location, appConfig) {
        var ApproveManifestCtrl = this;

        function Init() {
            ApproveManifestCtrl.ePage = {
                "Title": "",
                "Prefix": "Approve_Manifest",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            ApproveManifestCtrl.ePage.Masters.MyTask = ApproveManifestCtrl.taskObj;
            getManifestDetails();
        }

        function getManifestDetails() {
            var _filter = {
                "PK": ApproveManifestCtrl.ePage.Masters.MyTask.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.TmsManifestList.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.TmsManifestList.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ApproveManifestCtrl.ePage.Masters.ManifestDetails = response.data.Response[0];
                }
            });
        }

        Init();
    }
})();
