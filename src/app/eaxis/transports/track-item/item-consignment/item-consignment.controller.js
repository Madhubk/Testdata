(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ItemConsignmentController", ItemConsignmentController);

    ItemConsignmentController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "$injector", "$window", "confirmation", "itemConfig"];

    function ItemConsignmentController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, $injector, $window, confirmation, itemConfig) {

        var ItemConsignCtrl = this;

        function Init() {

            var currentItem = ItemConsignCtrl.currentItem[ItemConsignCtrl.currentItem.label].ePage.Entities;

            ItemConsignCtrl.ePage = {
                "Title": "",
                "Prefix": "Consignment-Item",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentItem,
            };

            ItemConsignCtrl.ePage.Masters.Config = itemConfig;
           
        }

        Init();
    }

})();