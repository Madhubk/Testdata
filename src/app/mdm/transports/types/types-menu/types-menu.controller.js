(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TypeMenuController", TypeMenuController);

    TypeMenuController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "typeConfig", "helperService", "appConfig", "authService", "$state", "confirmation", "$uibModal", "$window", "$http"];

    function TypeMenuController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, typeConfig, helperService, appConfig, authService, $state, confirmation, $uibModal, $window, $http) {

        var TypeMenuCtrl = this;

        function Init() {

            TypeMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "type_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": typeConfig.Entities
            };
            
            TypeMenuCtrl.ePage.Masters.IsActiveMenu = TypeMenuCtrl.activeMenu;
            TypeMenuCtrl.ePage.Masters.Config = typeConfig;

            // function
            TypeMenuCtrl.ePage.Masters.MappingMenu = {};
            TypeMenuCtrl.ePage.Masters.DropDownMasterList = {};

            // Menu list from configuration
                var obj = [{
                        "DisplayName":"ServiceType",
                        "GParentRef":"ServiceType",
                        "Icon":"icomoon icon-outward",
                        "Value":"ServiceType",
                    },{
                        "DisplayName":"Consol & Event",
                        "GParentRef":"Consol&Event",
                        "Icon":"icomoon icon-outward",
                        "Value":"Consol&Event",
                    },{
                        "DisplayName":"VehicleTypes",
                        "GParentRef":"VehicleTypes",
                        "Icon":"icomoon icon-outward",
                        "Value":"VehicleTypes",
                    },{
                        "DisplayName":"ManifestTypes",
                        "GParentRef":"ManifestTypes",
                        "Icon":"icomoon icon-outward",
                        "Value":"ManifestTypes",
                    },{
                        "DisplayName":"Tags",
                        "GParentRef":"Tags",
                        "Icon":"icomoon icon-outward",
                        "Value":"Tags",
                    },{
                        "DisplayName":"LevelLoadType",
                        "GParentRef":"LevelLoadType",
                        "Icon":"icomoon icon-outward",
                        "Value":"LevelLoadType",
                    }]

            TypeMenuCtrl.ePage.Masters.MappingMenu.ListSource = obj;
        }
        Init();
    }
})();