(function () {
    "use strict";

    angular
        .module("Application")
        .controller("RoleListController", RoleListController);

    RoleListController.$inject = ["$location", "$timeout", "helperService", "apiService", "authService", "appConfig",];

    function RoleListController($location, $timeout, helperService, apiService, authService, appConfig) {
        /* jshint validthis: true */
        var RoleListCtrl = this;
        var _queryString = $location.search();

        function Init() {
            RoleListCtrl.ePage = {
                "Title": "",
                "Prefix": "RoleList",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            RoleListCtrl.ePage.Masters.IsShowRoleListOverlay = false;
            RoleListCtrl.ePage.Masters.ProductLogo = "assets/img/logo/product-logo.png";

            RoleListCtrl.ePage.Masters.OnRoleClick = OnRoleClick;
            RoleListCtrl.ePage.Masters.SetAsDefaultRole = SetAsDefaultRole;
            RoleListCtrl.ePage.Masters.GoBack = GoBack;

            if (_queryString.q) {
                RoleListCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString.q));

                RoleListCtrl.ePage.Masters.RoleList = authService.getUserInfo().Roles;

                // var _index = RoleListCtrl.ePage.Masters.RoleList.map(function (value, key) {
                //     return value.PK;
                // }).indexOf(authService.getUserInfo().RolePK);

                // if (_index != -1) {
                //     SetAsDefaultRole(RoleListCtrl.ePage.Masters.RoleList[_index]);
                // }
                GetTenantUserSetting();
            } else {
                RoleListCtrl.ePage.Masters.RoleList = [];
            }
        }

        function GetTenantUserSetting() {
            var _filter = {
                "User_FK": authService.getUserInfo().UserPK,
                "SAP_FK": authService.getUserInfo().AppPK,
                "Tenant_FK": authService.getUserInfo().TenantPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.TenantUserSettings.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.TenantUserSettings.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        RoleListCtrl.ePage.Masters.TenantUserSetting = response.data.Response[0];

                        if (RoleListCtrl.ePage.Masters.RoleList && RoleListCtrl.ePage.Masters.RoleList.length > 0 && RoleListCtrl.ePage.Masters.TenantUserSetting) {
                            var _index = RoleListCtrl.ePage.Masters.RoleList.map(function (value, key) {
                                return value.PK;
                            }).indexOf(RoleListCtrl.ePage.Masters.TenantUserSetting.Role_Fk);

                            if (_index != -1) {
                                SetAsDefaultRole(RoleListCtrl.ePage.Masters.RoleList[_index]);
                            }
                        }
                    }
                }
            });
        }

        function SetAsDefaultRole($item, $event) {
            var _index = -1;
            RoleListCtrl.ePage.Masters.RoleList.map(function (value, key) {
                value.IsShowDefault = false;
                if (value.PK == $item.PK) {
                    _index = key;
                }
            });

            if (_index != -1) {
                RoleListCtrl.ePage.Masters.DefaultRole = RoleListCtrl.ePage.Masters.RoleList[_index];
                RoleListCtrl.ePage.Masters.DefaultRole.IsShowDefault = true;
            }

            if ($event) {
                $timeout(function () {
                    UpdateDefault($item);
                });
            }
        }

        function UpdateDefault($item) {
            var _input = RoleListCtrl.ePage.Masters.TenantUserSetting;
            var _apiMethod = "Update";
            if (!_input) {
                _input = {
                    TenantCode: authService.getUserInfo().TenantCode,
                    Tenant_FK: authService.getUserInfo().TenantPK,
                    DefaultMenu: "List",
                    User_FK: authService.getUserInfo().UserPK,
                    SAP_FK: authService.getUserInfo().AppPK
                };
                _apiMethod = "Insert";
            }

            _input.Role_FK = $item.PK;
            _input.Role_Code = $item.Code;
            _input.IsModified = true;

            if (_apiMethod == "Insert") {
                _input = [_input];
            }

            apiService.post("authAPI", appConfig.Entities.TenantUserSettings.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    RoleListCtrl.ePage.Masters.TenantUserSetting = response.data.Response;
                } else {
                    toastr.error("Could not Update...!");

                    var _index = RoleListCtrl.ePage.Masters.RoleList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(authService.getUserInfo().RolePK);

                    if (_index != -1) {
                        SetAsDefaultRole(RoleListCtrl.ePage.Masters.RoleList[_index]);
                    }
                }
            });
        }

        function OnRoleClick($item) {
            if ($item) {
                RoleListCtrl.ePage.Masters.IsShowRoleListOverlay = true;
                RoleListCtrl.ePage.Masters.SelectedRole = $item;

                SoftLogin();
            }
        }

        function SoftLogin() {
            var _input = {
                "grant_type": "password",
                "Username": authService.getUserInfo().UserId,
                "User_FK": authService.getUserInfo().UserPK,
                "AppCode": authService.getUserInfo().AppCode,
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "Tenant_FK": authService.getUserInfo().TenantPK,
                "Party_FK": authService.getUserInfo().PartyPK,
                "Party_Code": authService.getUserInfo().PartyCode,
                "Role_FK": RoleListCtrl.ePage.Masters.SelectedRole.PK,
                "Role_Code": RoleListCtrl.ePage.Masters.SelectedRole.Code
            };

            apiService.post("authAPI", appConfig.Entities.Token.API.SoftLoginToken.Url, _input, RoleListCtrl.ePage.Masters.QueryString.Token).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    RoleListCtrl.ePage.Masters.UserInfo = response.data.Response;

                    PrepareLocalStroageInfo();
                } else {
                    RoleListCtrl.ePage.Masters.IsShowRoleListOverlay = false;
                }
            }, function ErrorCallback(response) {
                RoleListCtrl.ePage.Masters.IsShowRoleListOverlay = false;
            });
        }

        function PrepareLocalStroageInfo() {
            var _userInfo = angular.copy(RoleListCtrl.ePage.Masters.UserInfo),
                _keys = ["Menus", "AccessMenus", "Logo", "Parties"];

            _keys.map(function (value, key) {
                if (_userInfo[value]) {
                    _userInfo[value] = JSON.parse(_userInfo[value]);
                }
            });

            if (!_userInfo.MenuType) {
                _userInfo.MenuType = "List";
            }

            if (_userInfo.AppCode == "TC") {
                _userInfo.MenuType = "Grid";
            }

            if (_userInfo.HomeMenu) {
                if (_userInfo.HomeMenu.PK) {
                    var _index = _userInfo.AccessMenus.map(function (value, key) {
                        return value.Id;
                    }).indexOf(_userInfo.HomeMenu.PK);

                    if (_index != -1) {
                        _userInfo.InternalUrl = _userInfo.AccessMenus[_index].Link;
                    }
                }
            }

            if (_userInfo.RolePK && _userInfo.PartyPK) {
                if (_userInfo.Parties && _userInfo.Parties.length > 0) {
                    _userInfo.Parties.map(function (value, key) {
                        if (value.PK === _userInfo.PartyPK) {
                            _userInfo.Roles = value.Roles;
                        }
                    });
                }
            }

            authService.setUserInfo(helperService.encryptData(_userInfo));

            if (RoleListCtrl.ePage.Masters.QueryString.Continue) {
                $location.path(RoleListCtrl.ePage.Masters.QueryString.Continue).search({});
            } else {
                $location.path(_userInfo.InternalUrl).search({});
            }
        }

        function GoBack() {
            if (RoleListCtrl.ePage.Masters.QueryString.Continue) {
                $location.path(RoleListCtrl.ePage.Masters.QueryString.Continue).search({});
            } else {
                $location.path(authService.getUserInfo().InternalUrl).search({});
            }
        }

        Init();
    }
})();
