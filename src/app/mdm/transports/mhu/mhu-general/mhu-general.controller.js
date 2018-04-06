(function () {
    "use strict";

    angular
        .module("Application")
        .controller("MhuGeneralController", MhuGeneralController);

    MhuGeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "mhuConfig", "helperService", "toastr", "$document", "confirmation"];

    function MhuGeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, mhuConfig, helperService, toastr, $document, confirmation) {

        var MhuGeneralCtrl = this;

        function Init() {

            var currentMhu = MhuGeneralCtrl.currentMhu[MhuGeneralCtrl.currentMhu.label].ePage.Entities;

            MhuGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "MHU_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentMhu,
            };
            MhuGeneralCtrl.ePage.Masters.Config = mhuConfig;
            MhuGeneralCtrl.ePage.Masters.MhuMenu = {};
            MhuGeneralCtrl.ePage.Masters.MhuMenu.ListSource = MhuGeneralCtrl.ePage.Entities.Header.Meta.MenuList;
        }

        Init();
    }

})();