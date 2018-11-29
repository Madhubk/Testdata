(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CompleteManifestController", CompleteManifestController);

    CompleteManifestController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "dmsManifestConfig", "helperService", "$window", "$uibModal", "toastr", "$http"];

    function CompleteManifestController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, dmsManifestConfig, helperService, $window, $uibModal, toastr, $http) {

        var CompleteManifestCtrl = this;

        function Init() {

            var currentManifest = CompleteManifestCtrl.currentManifest[CompleteManifestCtrl.currentManifest.label].ePage.Entities;

            CompleteManifestCtrl.ePage = {
                "Title": "",
                "Prefix": "Dockin_Vehicle",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };

            if (CompleteManifestCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                CompleteManifestCtrl.ePage.Masters.MenuList = CompleteManifestCtrl.ePage.Entities.Header.Meta.MenuList.UnloadMenu;
            } else {
                CompleteManifestCtrl.ePage.Masters.MenuList = CompleteManifestCtrl.ePage.Entities.Header.Meta.MenuList.LoadMenu;
            }

            CompleteManifestCtrl.ePage.Masters.Empty = "-";
            CompleteManifestCtrl.ePage.Masters.Config = dmsManifestConfig;
        
        }

        Init();
    }

})();