(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EAAdminHomeController", EAAdminHomeController);

    EAAdminHomeController.$inject = ["$location", "authService", "apiService", "helperService", "appConfig"];

    function EAAdminHomeController($location, authService, apiService, helperService, appConfig) {
        /* jshint validthis: true */
        var EAAdminHomeCtrl = this;

        function Init() {
            EAAdminHomeCtrl.ePage = {
                "Title": "",
                "Prefix": "EA Admin Home",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            EAAdminHomeCtrl.ePage.Masters.OnMenuClick = OnMenuClick;

            GetCfxMenusList();
        }

        function GetCfxMenusList() {
            EAAdminHomeCtrl.ePage.Masters.MenuList = undefined;
            var _filter = {
                "USR_UserName": authService.getUserInfo().UserId,
                "USR_SAP_FK": authService.getUserInfo().AppPK,
                "USR_TenantCode": authService.getUserInfo().TenantCode,
                "PageType": "Admin"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.MasterCascadeFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.MasterCascadeFindAll.Url, _input).then(function ApiCallback(response) {
                if (response.data.Response) {
                    EAAdminHomeCtrl.ePage.Masters.MenuList = response.data.Response;

                } else {
                    EAAdminHomeCtrl.ePage.Masters.MenuList = [];
                }
            });
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

                    if ($item.Code == "EA_ADMN_LOGIN_USERS" || $item.Code == "EA_ADMIN_USER_CREATION") {
                        $location.path(_link);
                    } else {
                        if ($item.OtherConfig) {
                            var _input = JSON.parse($item.OtherConfig).QueryString;

                            if (_input) {
                                for (var x in _input) {
                                    _input[x] = GetUserData(_input[x]);
                                }

                                $location.path(_link + "/" + helperService.encryptData(_input));
                            }
                        }
                    }
                }
            }
        }

        Init();
    }
})();
