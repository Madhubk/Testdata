(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ItemManifestController", ItemManifestController);

    ItemManifestController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "$injector", "$window", "confirmation", "itemConfig"];

    function ItemManifestController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, $injector, $window, confirmation, itemConfig) {

        var ItemManifestCtrl = this;

        function Init() {

            var currentItem = ItemManifestCtrl.currentItem[ItemManifestCtrl.currentItem.label].ePage.Entities;

            ItemManifestCtrl.ePage = {
                "Title": "",
                "Prefix": "Manifest-Item",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentItem,
            };

            ItemManifestCtrl.ePage.Masters.Config = itemConfig;
           
        }

        Init();
    }

})();