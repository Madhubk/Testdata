(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AttachOrdersViewController", AttachOrdersViewController);

    AttachOrdersViewController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "dmsManifestConfig", "helperService", "$window", "$uibModal", "$filter", "toastr"];

    function AttachOrdersViewController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, dmsManifestConfig, helperService, $window, $uibModal, $filter, toastr) {

        var AttachOrdersViewCtrl = this;

        function Init() {

            var currentManifest = AttachOrdersViewCtrl.currentManifest[AttachOrdersViewCtrl.currentManifest.label].ePage.Entities;

            AttachOrdersViewCtrl.ePage = {
                "Title": "",
                "Prefix": "Attach_orders",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };
            AttachOrdersViewCtrl.ePage.Masters.SaveButtonText = "Save";

        }

        Init();
    }
})();