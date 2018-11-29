(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AddItemsViewController", AddItemsViewController);

    AddItemsViewController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "dmsManifestConfig", "helperService", "$window", "$uibModal", "$filter", "toastr"];

    function AddItemsViewController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, dmsManifestConfig, helperService, $window, $uibModal, $filter, toastr) {

        var AddItemsViewCtrl = this;

        function Init() {

            var currentManifest = AddItemsViewCtrl.currentManifest[AddItemsViewCtrl.currentManifest.label].ePage.Entities;

            AddItemsViewCtrl.ePage = {
                "Title": "",
                "Prefix": "Add_items",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };
            AddItemsViewCtrl.ePage.Masters.SaveButtonText = "Save";
        }

        Init();
    }
})();