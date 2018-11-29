(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SideBarController", SideBarController);

    SideBarController.$inject = ["$location", "authService", "helperService"];

    function SideBarController($location, authService, helperService) {
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

            SideBarCtrl.ePage.Masters.OnMenuClick = OnMenuClick;
            SideBarCtrl.ePage.Masters.MenuList = authService.getUserInfo().Menus;

            SetDefaultActiveMenu();
        }

        function SetDefaultActiveMenu() {
            var _isExist = false;
            var _defaultActiveMenu = {
                Link: $location.path().substring(1, $location.path().length),
                MenuName: $location.path().split("/").pop()
            };

            SideBarCtrl.ePage.Masters.MenuList.map(function (value, key) {
                if (value.Link && value.Link != "#" && !_isExist) {
                    if (value.Link.indexOf(_defaultActiveMenu.Link) != -1) {
                        _isExist = true;
                        OnMenuClick(value);
                    }
                } else if (value.Link && value.Link == "#" && value.MenuList && value.MenuList.length > 0 && !_isExist) {
                    value.MenuList.map(function (value2, key2) {
                        if (value2.Link) {
                            if (value2.Link.indexOf(_defaultActiveMenu.Link) != -1) {
                                _isExist = true;
                                OnMenuClick(value2);
                            }
                        }
                    });
                }
            });
        }

        function OnMenuClick($item, $event) {
            if ($item.Link && $item.Link != "#") {
                if ($item.Link.split("/").length > 0) {
                    SideBarCtrl.ePage.Masters.ActiveMenu = $item;
                }
            }
        }

        Init();
    }
})();
