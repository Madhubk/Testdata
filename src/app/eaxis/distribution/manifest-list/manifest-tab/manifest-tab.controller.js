(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ManifestTabController", ManifestTabController);

    ManifestTabController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "$window", "$uibModal", "$filter", "toastr", "$http", "$timeout"];

    function ManifestTabController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, helperService, $window, $uibModal, $filter, toastr, $http, $timeout) {

        var ManifestTabCtrl = this;

        function Init() {
            var currentManifest = ManifestTabCtrl.currentManifest[ManifestTabCtrl.currentManifest.label].ePage.Entities;
            ManifestTabCtrl.ePage = {
                "Title": "",
                "Prefix": "GatePass_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest
            };

        }

        Init();
    }

})();