(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ApproveManifestController", ApproveManifestController);

    ApproveManifestController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "dmsManifestConfig", "helperService", "$window", "$uibModal", "toastr", "$http"];

    function ApproveManifestController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, dmsManifestConfig, helperService, $window, $uibModal, toastr, $http) {

        var ApproveManifestCtrl = this;

        function Init() {

            var currentManifest = ApproveManifestCtrl.currentManifest[ApproveManifestCtrl.currentManifest.label].ePage.Entities;

            ApproveManifestCtrl.ePage = {
                "Title": "",
                "Prefix": "Approve Manifest",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };

            if (ApproveManifestCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                ApproveManifestCtrl.ePage.Masters.MenuList = ApproveManifestCtrl.ePage.Entities.Header.Meta.MenuList.UnloadMenu;
            } else {
                ApproveManifestCtrl.ePage.Masters.MenuList = ApproveManifestCtrl.ePage.Entities.Header.Meta.MenuList.LoadMenu;
            }

            ApproveManifestCtrl.ePage.Masters.Empty = "-";
            ApproveManifestCtrl.ePage.Masters.Config = dmsManifestConfig;
        }

        Init();
    }

})();