(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AttachManifestDirectiveController", AttachManifestDirectiveController);

    AttachManifestDirectiveController.$inject = ["$scope", "$timeout", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "$window", "$location", "appConfig"];

    function AttachManifestDirectiveController($scope, $timeout, $uibModal, APP_CONSTANT, apiService, helperService, $window, $location, appConfig) {
        var AttachManifestDirectiveCtrl = this;

        function Init() {
            AttachManifestDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Attach_Manifest",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            AttachManifestDirectiveCtrl.ePage.Masters.MyTask = AttachManifestDirectiveCtrl.taskObj;
            getGatepassDetails();
        }

        function getGatepassDetails() {
            apiService.get("eAxisAPI", appConfig.Entities.TMSGatepassList.API.GetById.Url + AttachManifestDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    AttachManifestDirectiveCtrl.ePage.Masters.GatepassDetails = response.data.Response;
                }
            });
        }

        Init();
    }
})();
