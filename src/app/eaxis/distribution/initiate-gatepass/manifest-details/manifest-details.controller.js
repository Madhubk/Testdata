(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ManifestDetailsController", ManifestDetailsController);

    ManifestDetailsController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "$window", "$uibModal", "$filter", "toastr", "$http", "gatepassConfig"];

    function ManifestDetailsController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, helperService, $window, $uibModal, $filter, toastr, $http, gatepassConfig) {

        var ManifestDetailsCtrl = this;

        function Init() {
            var currentGatepass = ManifestDetailsCtrl.currentGatepass[ManifestDetailsCtrl.currentGatepass.label].ePage.Entities;
            ManifestDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Manifest Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentGatepass
            };

            ManifestDetailsCtrl.ePage.Masters.Config = gatepassConfig;

            getManifestDetails();
        }

        function getManifestDetails() {
            if (ManifestDetailsCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ManifestFK) {
                apiService.get("eAxisAPI", gatepassConfig.Entities.Header.API.TmsManifestList.Url + ManifestDetailsCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ManifestFK).then(function (response) {
                    ManifestDetailsCtrl.ePage.Masters.ManifestDetails = response.data.Response;
                    ManifestDetailsCtrl.ePage.Masters.IsShowManifest = true;

                });
            } else {
                ManifestDetailsCtrl.ePage.Masters.IsShowManifest = false;
            }
        }

        Init();
    }

})();