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
        }

        Init();
    }
})();
