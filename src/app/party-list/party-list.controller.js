(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PartyListController", PartyListController);

    PartyListController.$inject = ["$location", "$timeout", "helperService", "apiService", "authService", "appConfig", "toastr"];

    function PartyListController($location, $timeout, helperService, apiService, authService, appConfig, toastr) {
        /* jshint validthis: true */
        var PartyListCtrl = this;
        var _queryString = $location.search();

        function Init() {
            PartyListCtrl.ePage = {
                "Title": "",
                "Prefix": "PartyList",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            PartyListCtrl.ePage.Masters.IsShowPartyListOverlay = false;
            PartyListCtrl.ePage.Masters.ProductLogo = "assets/img/logo/product-logo.png";

            PartyListCtrl.ePage.Masters.OnPartyClick = OnPartyClick;
            PartyListCtrl.ePage.Masters.SetAsDefaultParty = SetAsDefaultParty;
            PartyListCtrl.ePage.Masters.GoBack = GoBack;

            if (_queryString.q) {
                PartyListCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString.q));

                PartyListCtrl.ePage.Masters.PartyList = authService.getUserInfo().Parties;

                GetTenantUserSetting();
            } else {
                PartyListCtrl.ePage.Masters.PartyList = [];
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
                        PartyListCtrl.ePage.Masters.TenantUserSetting = response.data.Response[0];

                        if (PartyListCtrl.ePage.Masters.PartyList && PartyListCtrl.ePage.Masters.PartyList.length > 0 && PartyListCtrl.ePage.Masters.TenantUserSetting) {
                            var _index = PartyListCtrl.ePage.Masters.PartyList.map(function (value, key) {
                                return value.PK;
                            }).indexOf(PartyListCtrl.ePage.Masters.TenantUserSetting.Party_FK);

                            if (_index != -1) {
                                SetAsDefaultParty(PartyListCtrl.ePage.Masters.PartyList[_index]);
                            }
                        }
                    }
                }
            });
        }

        function SetAsDefaultParty($item, $event) {
            var _index = -1;
            PartyListCtrl.ePage.Masters.PartyList.map(function (value, key) {
                value.IsShowDefault = false;
                if (value.PK == $item.PK) {
                    _index = key;
                }
            });

            if (_index != -1) {
                PartyListCtrl.ePage.Masters.DefaultParty = PartyListCtrl.ePage.Masters.PartyList[_index];
                PartyListCtrl.ePage.Masters.DefaultParty.IsShowDefault = true;
            }

            if ($event) {
                $timeout(function () {
                    UpdateDefault($item);
                });
            }
        }

        function UpdateDefault($item) {
            var _input = PartyListCtrl.ePage.Masters.TenantUserSetting;
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
            _input.Party_FK = $item.PK;
            _input.PartyCode = $item.Code;
            _input.IsModified = true;

            if (_apiMethod == "Insert") {
                _input = [_input];
            }

            apiService.post("authAPI", appConfig.Entities.TenantUserSettings.API[_apiMethod].Url, _input).then(function (response) {
                if (response.data.Response) {
                    PartyListCtrl.ePage.Masters.TenantUserSetting = response.data.Response;
                } else {
                    toastr.error("Could not Update...!");

                    var _index = PartyListCtrl.ePage.Masters.PartyList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(authService.getUserInfo().PartyPK);

                    if (_index != -1) {
                        SetAsDefaultParty(PartyListCtrl.ePage.Masters.PartyList[_index]);
                    }
                }
            });
        }

        function OnPartyClick($item) {
            if ($item) {
                PartyListCtrl.ePage.Masters.IsShowPartyListOverlay = true;
                PartyListCtrl.ePage.Masters.SelectedParty = $item;

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
                "Party_FK": PartyListCtrl.ePage.Masters.SelectedParty.PK,
                "Party_Code": PartyListCtrl.ePage.Masters.SelectedParty.Code
            };

            apiService.post("authAPI", appConfig.Entities.Token.API.SoftLoginToken.Url, _input, PartyListCtrl.ePage.Masters.QueryString.Token).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    PartyListCtrl.ePage.Masters.UserInfo = response.data.Response;

                    GetUIControlList();
                } else {
                    PartyListCtrl.ePage.Masters.IsShowPartyListOverlay = false;
                }
            }, function ErrorCallback(response) {
                PartyListCtrl.ePage.Masters.IsShowPartyListOverlay = false;
            });
        }

        function GetUIControlList() {
            let _filter = {
                "SAP_FK": PartyListCtrl.ePage.Masters.UserInfo.AppPK,
                "TenantCode": PartyListCtrl.ePage.Masters.UserInfo.TenantCode,
                "USR_FK": PartyListCtrl.ePage.Masters.UserInfo.UserPK
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CompUserRoleAccess.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.CompUserRoleAccess.API.FindAll.Url, _input, PartyListCtrl.ePage.Masters.UserInfo.AuthToken).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    let _response = response.data.Response;
                    let _controlList = [];
                    _response.map(value => {
                        if (value.SOP_Code) {
                            _controlList.push(value.SOP_Code);
                        }
                    });
                    PartyListCtrl.ePage.Masters.UserInfo.UIControlList = _controlList;
                } else {
                    PartyListCtrl.ePage.Masters.UserInfo.UIControlList = [];
                }

                GetSideBarMenuCompact();
            });
        }

        function GetSideBarMenuCompact() {
            let _filter = {
                "SourceEntityRefKey": PartyListCtrl.ePage.Masters.UserInfo.UserId,
                "AppCode": PartyListCtrl.ePage.Masters.UserInfo.AppCode,
                "EntitySource": "APP_DEFAULT"
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + PartyListCtrl.ePage.Masters.UserInfo.AppPK, _input, PartyListCtrl.ePage.Masters.UserInfo.AuthToken).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    let _response = response.data.Response[0];
                    _response.Value = JSON.parse(_response.Value);
                    PartyListCtrl.ePage.Masters.UserInfo.MenuCompact = _response;
                    PartyListCtrl.ePage.Masters.UserInfo.IsMenuCompact = _response.Value.IsMenuCompact;
                }
                PrepareLocalStroageInfo();
            });
        }

        function PrepareLocalStroageInfo() {
            var _userInfo = angular.copy(PartyListCtrl.ePage.Masters.UserInfo),
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

            if (PartyListCtrl.ePage.Masters.QueryString.Continue) {
                $location.path(PartyListCtrl.ePage.Masters.QueryString.Continue).search({});
            } else {
                $location.path(_userInfo.InternalUrl).search({});
            }
        }

        function GoBack() {
            if (PartyListCtrl.ePage.Masters.QueryString && PartyListCtrl.ePage.Masters.QueryString.Continue) {
                $location.path(PartyListCtrl.ePage.Masters.QueryString.Continue).search({});
            } else {
                $location.path(authService.getUserInfo().InternalUrl).search({});
            }
        }

        Init();
    }
})();
