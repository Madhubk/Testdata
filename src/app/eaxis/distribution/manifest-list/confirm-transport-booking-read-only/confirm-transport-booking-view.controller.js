(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConfirmBookingViewController", ConfirmBookingViewController);

    ConfirmBookingViewController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "dmsManifestConfig", "helperService", "$window", "$uibModal", "$filter", "toastr"];

    function ConfirmBookingViewController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, dmsManifestConfig, helperService, $window, $uibModal, $filter, toastr) {

        var ConfirmBookingViewCtrl = this;

        function Init() {

            var currentManifest = ConfirmBookingViewCtrl.currentManifest[ConfirmBookingViewCtrl.currentManifest.label].ePage.Entities;

            ConfirmBookingViewCtrl.ePage = {
                "Title": "",
                "Prefix": "confirm_booking",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };
            ConfirmBookingViewCtrl.ePage.Masters.Config = dmsManifestConfig;
            
        }

        Init();
    }
})();