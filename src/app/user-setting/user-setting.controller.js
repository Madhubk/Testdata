(function () {
    "use strict";

    angular
        .module("Application")
        .controller("UserSettingController", UserSettingController);

    UserSettingController.$inject = ["$timeout", "$location", "authService", "apiService", "helperService", "appConfig"];

    function UserSettingController($timeout, $location, authService, apiService, helperService, appConfig) {
        /* jshint validthis: true */
        var UserSettingCtrl = this;
        var _queryString = $location.search();

        function Init() {
            UserSettingCtrl.ePage = {
                "Title": "",
                "Prefix": "UserSetting",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            UserSettingCtrl.ePage.Masters.UserId = authService.getUserInfo().UserId;
            UserSettingCtrl.ePage.Masters.AppCode = authService.getUserInfo().AppCode;
            UserSettingCtrl.ePage.Masters.AppPk = authService.getUserInfo().AppPK;

            if (_queryString.q) {
                UserSettingCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString.q));

                UserSettingCtrl.ePage.Masters.UserId = UserSettingCtrl.ePage.Masters.QueryString.UserId;
                UserSettingCtrl.ePage.Masters.AppCode = UserSettingCtrl.ePage.Masters.QueryString.AppCode;
                UserSettingCtrl.ePage.Masters.AppPk = UserSettingCtrl.ePage.Masters.QueryString.AppPk;
            }

            UserSettingCtrl.ePage.Masters.MenuType = authService.getUserInfo().MenuType;

            // InitParty();
            // InitUserMenu();
            // InitUserSetting();
        }

        function InitUserSetting() {
            UserSettingCtrl.ePage.Masters.UserSetting = {};

            GetUserSetting();
        }

        function GetUserSetting() {
            UserSettingCtrl.ePage.Masters.UserSetting.DefaultUserSetting = {};
            var _filter = {
                "SourceEntityRefKey": UserSettingCtrl.ePage.Masters.UserId,
                "AppCode": UserSettingCtrl.ePage.Masters.AppCode,
                "EntitySource": "APP_DEFAULT"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + UserSettingCtrl.ePage.Masters.AppPk, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];

                        _response.Value = JSON.parse(_response.Value);
                        UserSettingCtrl.ePage.Masters.UserSetting.DefaultUserSetting = _response;

                        if (UserSettingCtrl.ePage.Masters.UserSetting.DefaultUserSetting.Value) {
                            if (UserSettingCtrl.ePage.Masters.UserSetting.DefaultUserSetting.Value.Dashboard) {
                                UserSettingCtrl.ePage.Masters.UserMenu.MenuType = UserSettingCtrl.ePage.Masters.UserSetting.DefaultUserSetting.Value.Dashboard.MenuType;
                            }

                            if (UserSettingCtrl.ePage.Masters.UserSetting.DefaultUserSetting.Value.Party) {
                                UserSettingCtrl.ePage.Masters.Party.ActiveParty = UserSettingCtrl.ePage.Masters.UserSetting.DefaultUserSetting.Value.Party;
                            }
                        }
                    }
                }
            });
        }

        function SaveUserSetting() {
            var _input = UserSettingCtrl.ePage.Masters.UserSetting.DefaultUserSetting;

            if (_input.PK) {
                _input.IsModified = true;
            } else {
                _input = {
                    "SourceEntityRefKey": UserSettingCtrl.ePage.Masters.UserId,
                    "AppCode": UserSettingCtrl.ePage.Masters.AppCode,
                    "SAP_FK": UserSettingCtrl.ePage.Masters.AppPk,
                    "TenantCode": authService.getUserInfo().TenantCode,
                    "EntitySource": "APP_DEFAULT",
                    "Key": authService.getUserInfo().TenantCode,
                    "IsJSON": true,
                    "IsModified": true
                };
            }

            _input.Value = {
                Dashboard: {
                    MenuType: UserSettingCtrl.ePage.Masters.UserMenu.MenuType
                }
            }
            _input.Value = {};

            if (UserSettingCtrl.ePage.Masters.UserMenu.MenuType) {
                _input.Value.Dashboard = {
                    MenuType: UserSettingCtrl.ePage.Masters.UserMenu.MenuType
                };
            }

            if (UserSettingCtrl.ePage.Masters.Party.ActiveParty) {
                _input.Value.Party = UserSettingCtrl.ePage.Masters.Party.ActiveParty;
            }

            _input.Value = JSON.stringify(_input.Value);

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Upsert.Url + UserSettingCtrl.ePage.Masters.AppPk, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];
                        var _userInfo = angular.copy(authService.getUserInfo());

                        if (_userInfo.AppCode !== "TC") {
                            _userInfo.MenuType = JSON.parse(_response.Value).Dashboard.MenuType;
                        }

                        authService.setUserInfo();

                        $timeout(function () {
                            authService.setUserInfo(helperService.encryptData(_userInfo));
                        });
                    }
                }
            });
        }

        // ======================= User Menu Type ====================
        function InitUserMenu() {
            UserSettingCtrl.ePage.Masters.UserMenu = {};
            UserSettingCtrl.ePage.Masters.UserMenu.MenuTypeList = ["List", "Grid"];

            UserSettingCtrl.ePage.Masters.UserMenu.OnUserMenuChange = OnUserMenuChange;
        }

        function OnUserMenuChange($item) {
            SaveUserSetting();
        }

        // ======================= User Filters ====================
        function InitParty() {
            UserSettingCtrl.ePage.Masters.Party = {};
            UserSettingCtrl.ePage.Masters.Party.SetAsDefault = SetAsDefault;
            UserSettingCtrl.ePage.Masters.Party.SoftLoginWithParty = SoftLoginWithParty;
            UserSettingCtrl.ePage.Masters.Party.OnPartyChange = OnPartyChange;

            GetPartyList();
        }

        function GetPartyList() {
            UserSettingCtrl.ePage.Masters.Party.ListSource = undefined;

            var _filter = {
                "UserName": UserSettingCtrl.ePage.Masters.UserId,
                "SAP_Code": UserSettingCtrl.ePage.Masters.AppCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecMappings.API.GetPartiesByUserApp.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.SecMappings.API.GetPartiesByUserApp.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    UserSettingCtrl.ePage.Masters.Party.ListSource = response.data.Response;
                } else {
                    UserSettingCtrl.ePage.Masters.Party.ListSource = [];
                }
            });
        }

        function OnPartyChange($item) {
            var _item = {};

            if ($item) {
                _item.PK = $item.PK;
                _item.Code = $item.Code;
            }

            UserSettingCtrl.ePage.Masters.Party.ActiveParty = _item;
        }

        function SoftLoginWithParty() {
            if (UserSettingCtrl.ePage.Masters.Party.ActiveParty.PK) {
                var _input = {
                    "grant_type": "password",
                    "username": UserSettingCtrl.ePage.Masters.UserId,
                    "AppCode": UserSettingCtrl.ePage.Masters.AppCode,
                    "TNTCode": authService.getUserInfo().TenantCode,
                    "Party_Pk": UserSettingCtrl.ePage.Masters.Party.ActiveParty.PK,
                    "Party_Code": UserSettingCtrl.ePage.Masters.Party.ActiveParty.Code
                };

                apiService.post("authAPI", appConfig.Entities.Token.API.SoftLoginToken.Url, _input).then(function SuccessCallback(response) {
                    if (response.data.Response) {
                        var _userInfo = angular.copy(authService.getUserInfo());
                        var _isEmpty = angular.equals({}, response.data.Response);
                        if (!_isEmpty) {
                            for (var x in response.data.Response) {
                                _userInfo[x] = response.data.Response[x];
                            }
                        }
                        authService.setUserInfo(helperService.encryptData(_userInfo));
                    }
                });
            }
        }

        function SetAsDefault() {
            SaveUserSetting();
        }

        Init();
    }
})();
