(function () {
    "use strict";

    angular
        .module("Application")
        .controller("MappingMenuController", MappingMenuController);

    MappingMenuController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "mappingConfig", "helperService", "appConfig", "authService", "$state", "confirmation", "$uibModal", "$window", "$http"];

    function MappingMenuController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, mappingConfig, helperService, appConfig, authService, $state, confirmation, $uibModal, $window, $http) {

        var MappingMenuCtrl = this;

        function Init() {

            MappingMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Mapping_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": mappingConfig.Entities
            };
            
            MappingMenuCtrl.ePage.Masters.IsActiveMenu = MappingMenuCtrl.activeMenu;
            MappingMenuCtrl.ePage.Masters.Config = mappingConfig;

            // function
            MappingMenuCtrl.ePage.Masters.MappingMenu = {};
            MappingMenuCtrl.ePage.Masters.DropDownMasterList = {};

            // Menu list from configuration
            MappingMenuCtrl.ePage.Masters.MappingMenu.ListSource = MappingMenuCtrl.ePage.Entities.Header.Meta.MenuList;
        }
        Init();
    }
})();