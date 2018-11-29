(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DispatchManifestDirectiveController", DispatchManifestDirectiveController);

    DispatchManifestDirectiveController.$inject = ["$scope", "$timeout", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "$window", "$location"];

    function DispatchManifestDirectiveController($scope, $timeout, $uibModal, APP_CONSTANT, apiService, helperService, $window, $location) {
        var DispatchManifestDirectiveCtrl = this;

        function Init() {
            DispatchManifestDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Dispatch_Manifest",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DispatchManifestDirectiveCtrl.ePage.Masters.MyTask = DispatchManifestDirectiveCtrl.taskObj;
            getManifestDetails();
        }

        function getManifestDetails() {
            var _filter = {
                "PK": DispatchManifestDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "TMSMAN"
            };

            apiService.post("eAxisAPI", "TmsManifest/FindAll", _input).then(function (response) {
                if (response.data.Response) {
                    DispatchManifestDirectiveCtrl.ePage.Masters.ManifestDetails = response.data.Response[0];
                }
            });
        }

        Init();
    }
})();
