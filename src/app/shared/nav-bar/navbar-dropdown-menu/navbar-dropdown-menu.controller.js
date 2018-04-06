(function () {
    "use strict";

    angular
        .module("Application")
        .controller("NavBarDropDownMenuController", NavBarDropDownMenuController);
    NavBarDropDownMenuController.$inject = ["$rootScope", "$scope", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig"];

    function NavBarDropDownMenuController($rootScope, $scope, $location, $timeout, APP_CONSTANT, authService, apiService, helperService, appConfig) {
        var NavBarDropDownMenuCtrl = this;

        function Init() {
            NavBarDropDownMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "NavBarDropDownMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            NavBarDropDownMenuCtrl.ePage.Masters.CurrentPath = $location.path();
            NavBarDropDownMenuCtrl.ePage.Masters.OnMenuClick = OnMenuClick;
            NavBarDropDownMenuCtrl.ePage.Masters.MenuList = NavBarDropDownMenuCtrl.menuList;
        }

        function GetUserData($item) {
            var _index = $item.indexOf("@");
            if (_index != -1) {
                var _item = $item.substring(3, $item.length);
                return authService.getUserInfo()[_item];
            } else {
                return $item;
            }
        }

        function OnMenuClick($item) {
            if ($item) {
                var _link = $item.Link;

                if ($item.PageType == "Admin") {
                    var _index = $item.Link.indexOf("#");

                    if (_index != -1) {
                        _link = $item.Link.substring(2, $item.Link.length);
                    }

                    if ($item.OtherConfig) {
                        var _input = JSON.parse($item.OtherConfig).QueryString;

                        if (_input) {
                            for (var x in _input) {
                                _input[x] = GetUserData(_input[x]);
                            }

                            $location.path(_link + "/" + helperService.encryptData(_input));
                        }
                    } else {
                        if ($item.Code == "EA_ADMN_LOGIN_USERS")
                            $location.path(_link)
                    }
                } else if ($item.PageType == "Menu") {
                    if (authService.getUserInfo().AppCode == 'TC') {
                        var _queryString = {};
                        if ($item.Code === "System") {
                            _queryString.Type = "System";
                            $location.path(_link + "/" + helperService.encryptData(_queryString));
                        } else if ($item.Code === "Configuration") {
                            _queryString.Type = "Configuration";
                            $location.path(_link + "/" + helperService.encryptData(_queryString));
                        } else {
                            $location.path(_link);
                        }
                    } else {
                        $location.path(_link);
                    }
                }
            }
        }

        Init();
    }

})();
