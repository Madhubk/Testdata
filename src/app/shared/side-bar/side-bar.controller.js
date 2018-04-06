(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SideBarController", SideBarController);

    SideBarController.$inject = ["$rootScope", "$scope", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig"];

    function SideBarController($rootScope, $scope, $location, $timeout, APP_CONSTANT, authService, apiService, helperService, appConfig) {
        /* jshint validthis: true */
        var SideBarCtrl = this;

        function Init() {
            SideBarCtrl.ePage = {
                "Title": "",
                "Prefix": "SideBarBar",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            SideBarCtrl.ePage.Masters.CurrentActiveMenu = CurrentActiveMenu;
            SideBarCtrl.ePage.Masters.MenuList = authService.getUserInfo().Menu.ListSource;

            SetDefaultActiveMenu();
        }

        function SetDefaultActiveMenu() {
            var _defaultActiveMenu = {
                Link: $location.path(),
                MenuName: $location.path().split("/").pop()
            };
            CurrentActiveMenu(_defaultActiveMenu);
        }

        function CurrentActiveMenu(currentMenu) {
            if (currentMenu.Link.split("/").length > 0) {
                SideBarCtrl.ePage.Masters.currentMenuItem = currentMenu.MenuName;
            }
        }

        Init();
    }
})();
