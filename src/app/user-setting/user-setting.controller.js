(function () {
    "use strict";

    angular
        .module("Application")
        .controller("UserSettingController", UserSettingController);

    UserSettingController.$inject = ["$rootScope", "$scope", "$location", "$window", "$timeout", "APP_CONSTANT", "authService", "apiService", "helperService", "toastr", "appConfig"];

    function UserSettingController($rootScope, $scope, $location, $window, $timeout, APP_CONSTANT, authService, apiService, helperService, toastr, appConfig) {
        /* jshint validthis: true */
        var UserSettingCtrl = this;

        function Init() {
            UserSettingCtrl.ePage = {
                "Title": "",
                "Prefix": "UserSetting",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            UserSettingCtrl.ePage.Masters.AppCode = authService.getUserInfo().AppCode;
            UserSettingCtrl.ePage.Masters.MenuVisibleType = authService.getUserInfo().Menu.VisibleType;

            if (UserSettingCtrl.ePage.Masters.AppCode != "TC") {
                InitUserMenu();
                InitFilter();
            }
        }

        // ======================= User Menu Type ====================
        function InitUserMenu() {
            UserSettingCtrl.ePage.Masters.UserMenu = {};
            UserSettingCtrl.ePage.Masters.UserMenu.MenuTypeList = ["List", "Grid"];

            UserSettingCtrl.ePage.Masters.UserMenu.OnUserMenuChange = OnUserMenuChange;
            CheckUserBasedMenuVisibleType();
        }

        function CheckUserBasedMenuVisibleType() {
            var _filter = {
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "AppCode": authService.getUserInfo().AppCode,
                "EntitySource": "APP_DEFAULT"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;
                    if (_response.length > 0) {
                        UserSettingCtrl.ePage.Masters.UserMenu.DefaultMenuType = _response[0];
                        var _curMenuType = JSON.parse(_response[0].Value).Dashboard.MenuType;
                        UserSettingCtrl.ePage.Masters.UserMenu.MenuType = _curMenuType;
                    }
                }
            });
        }

        function OnUserMenuChange($item) {
            if ($item) {
                UserSettingCtrl.ePage.Masters.UserMenu.MenuType = $item;
                SaveUserMenuType();
            }
        }

        function SaveUserMenuType() {
            var _input = UserSettingCtrl.ePage.Masters.UserMenu.DefaultMenuType;

            if (_input) {
                _input.IsModified = true;
                _input.SAP_FK = authService.getUserInfo().AppPK;
                _input.Value = JSON.parse(_input.Value);
                _input.Value.Dashboard.MenuType = UserSettingCtrl.ePage.Masters.UserMenu.MenuType;
                _input.Value = JSON.stringify(_input.Value);
            } else {
                _input = {
                    "SourceEntityRefKey": authService.getUserInfo().UserId,
                    "AppCode": authService.getUserInfo().AppCode,
                    "SAP_FK": authService.getUserInfo().AppPK,
                    "TenantCode": authService.getUserInfo().TenantCode,
                    "EntitySource": "APP_DEFAULT",
                    "Key": authService.getUserInfo().TenantCode,
                    "IsJSON": true,
                    "IsModified": true,
                    "Value": {
                        "Dashboard": {
                            "MenuType": UserSettingCtrl.ePage.Masters.UserMenu.MenuType
                        }
                    }
                };
                _input.Value = JSON.stringify(_input.Value);
            }

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;
                    if (_response.length > 0) {
                        var _userInfo = authService.getUserInfo();
                        if (_userInfo.AppCode !== "TC") {
                            _userInfo.Menu.VisibleType = JSON.parse(_response[0].Value).Dashboard.MenuType;
                        }

                        authService.setUserInfo();

                        $timeout(function () {
                            authService.setUserInfo(helperService.encryptData(_userInfo));
                        });
                    }
                }
            });
        }

        // ======================= User Filters ====================
        function InitFilter() {
            UserSettingCtrl.ePage.Masters.SystemFilter = {};
            UserSettingCtrl.ePage.Masters.FavoriteFilter = {};

            UserSettingCtrl.ePage.Masters.SystemFilter.SaveSystemFilter = SaveSystemFilter;
            UserSettingCtrl.ePage.Masters.FavoriteFilter.SaveFavoriteFilter = SaveFavoriteFilter;

            GetSystemFilterList();
            GetFavoriteFilterList();
        }

        function GetSystemFilterList() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "FilterType": "DASHBOARD"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    UserSettingCtrl.ePage.Masters.SystemFilter.ListSource = response.data.Response;
                } else {
                    UserSettingCtrl.ePage.Masters.SystemFilter.ListSource = [];
                }
            });
        }

        function SaveSystemFilter($item) {
            if ($item.IsStarred) {
                _input = {
                    "SourceEntityRefKey": authService.getUserInfo().UserId,
                    "Key": $item.Key,
                    "Value": $item.PK,
                    "IsJSON": false,
                    "SAP_FK": authService.getUserInfo().AppPK,
                    "AppCode": authService.getUserInfo().AppCode,
                    "TenantCode": authService.getUserInfo().TenantCode,
                    "EntitySource": "DASHBOARD_STARRED",
                    "IsModified": true,
                    "IsDeleted": false
                };
            } else {
                var _input = {
                    "PK": $item.Starred_FK,
                    "IsModified": true,
                    "IsDeleted": true
                };
            }

            if ($item.IsStarred && $item.Starred_FK == null) {
                apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                    if (response.data.Response) {
                        $item.IsStarred = true;
                        $item.Starred_FK = response.data.Response[0].PK;
                    }
                });
            } else if (!$item.IsStarred && $item.Starred_FK != null) {
                apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                    if (response.data.Response) {
                        $item.IsStarred = false;
                        $item.Starred_FK = null;
                    }
                });
            }
        }

        function GetFavoriteFilterList() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                UserSettingCtrl.ePage.Masters.FavoriteFilter.ListSource = [];
                if (response.data.Response) {
                    var _response = response.data.Response;

                    if (_response.length > 0) {
                        _response.map(function (value, key) {
                            if (value.EntitySource.indexOf("FAVORITES") !== -1) {
                                value.Value = JSON.parse(value.Value);
                                UserSettingCtrl.ePage.Masters.FavoriteFilter.ListSource.push(value);
                            }
                        });
                    }
                }
            });
        }

        function SaveFavoriteFilter($item, $index) {
            $item.IsDisableBtn = true;
            var _input = angular.copy($item);
            _input.Value = JSON.stringify(_input.Value);
            _input.IsModified = true;

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Failed to Save...!");
                }
                $item.IsDisableBtn = false;
            });
        }

        Init();
    }
})();
