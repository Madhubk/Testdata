(function () {
    "use strict";

    angular
        .module("Application")
        .directive("sideBar", SideBar);

    function SideBar() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/side-bar/side-bar.html",
            controller: "SideBarController",
            controllerAs: "SideBarCtrl",
            bindToController: true,
            scope: {}
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("SideBarController", SideBarController);

    SideBarController.$inject = ["$location", "authService", "apiService", "helperService", "appConfig"];

    function SideBarController($location, authService, apiService, helperService, appConfig) {
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
            SideBarCtrl.ePage.Masters.GetMenuLink = GetMenuLink;
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

        function GetMenuLink($item) {
            return ($item.Link.split("/")[0] != "") ? ("/" + $item.Link) : ("" + $item.Link);
        }

        function OnMenuClick($item, $event) {
            if ($item.Link && $item.Link != "#") {
                if ($item.Link.indexOf("$") != -1) {
                    window.open($item.Link.substring(1, $item.Link.length), "_blank");
                } else {
                    LogVisitedMenu($item);
                    if ($item.Link.split("/").length > 0) {
                        SideBarCtrl.ePage.Masters.ActiveMenu = $item;
                        $location.path(GetMenuLink($item));
                    }
                }
            }
        }

        function LogVisitedMenu($item) {
            let _input = {
                USN_FK: authService.getUserInfo().LoginPK,
                ActionType: 'Visit',
                ActInfo: 'Menu',
                EntityRefKey: $item.Id,
                EntitySource: 'MENU',
                EntityDescription: $item.Code,
                IsActive: 0,
                TenantCode: authService.getUserInfo().TenantCode,
                SAP_FK: authService.getUserInfo().AppPK
            };

            apiService.post("authAPI", appConfig.Entities.SecSessionActivity.API.Insert.Url, [_input]).then(function (response) {});
        }

        Init();
    }
})();
