(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TenantListController", TenantListController);

    TenantListController.$inject = ["$location", "$timeout", "helperService", "apiService", "authService", "appConfig", "toastr"];

    function TenantListController($location, $timeout, helperService, apiService, authService, appConfig, toastr) {
        /* jshint validthis: true */
        var TenantListCtrl = this;
        var _queryString = $location.search();

        function Init() {
            TenantListCtrl.ePage = {
                "Title": "",
                "Prefix": "TenantList",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TenantListCtrl.ePage.Masters.IsShowAnotherTenant = false;
            TenantListCtrl.ePage.Masters.IsShowTenantListOverlay = false;
            TenantListCtrl.ePage.Masters.NextBtnText = "NEXT";
            TenantListCtrl.ePage.Masters.IsDisabledNextBtn = false;
            TenantListCtrl.ePage.Masters.ProductLogo = "assets/img/logo/product-logo.png";

            TenantListCtrl.ePage.Masters.OnRecentTenantClick = OnRecentTenantClick;
            TenantListCtrl.ePage.Masters.GetTenantList = GetTenantList;
            TenantListCtrl.ePage.Masters.OnAutocompleteListSelect = OnAutocompleteListSelect;
            TenantListCtrl.ePage.Masters.OnBlurAutoCompleteList = OnBlurAutoCompleteList;
            TenantListCtrl.ePage.Masters.OnNextClick = OnNextClick;
            TenantListCtrl.ePage.Masters.SetAsDefaultTenant = SetAsDefaultTenant;
            TenantListCtrl.ePage.Masters.GoBack = GoBack;

            if (_queryString.q) {
                TenantListCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString.q));

                if (TenantListCtrl.ePage.Masters.QueryString.IsLogin == true && TenantListCtrl.ePage.Masters.QueryString.TenantList) {
                    TenantListCtrl.ePage.Masters.RecentTenantList = TenantListCtrl.ePage.Masters.QueryString.TenantList;

                    if (TenantListCtrl.ePage.Masters.RecentTenantList && TenantListCtrl.ePage.Masters.RecentTenantList.length > 0 && !TenantListCtrl.ePage.Masters.QueryString.IsLogin) {
                        GetTenantUserSetting();
                    }
                } else {
                    GetRecentTenantList();
                }
            } else {
                TenantListCtrl.ePage.Masters.RecentTenantList = [];
            }
        }

        function GetRecentTenantList() {
            TenantListCtrl.ePage.Masters.RecentTenantList = undefined;
            var _filter = {
                EntitySource: "TNT",
                // BasedOn_FK: TenantListCtrl.ePage.Masters.QueryString.UserPK,
                BasedOnCode: TenantListCtrl.ePage.Masters.QueryString.Username
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecRecentItems.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.SecRecentItems.API.FindAll.Url, _input, TenantListCtrl.ePage.Masters.QueryString.Token).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TenantListCtrl.ePage.Masters.RecentTenantList = response.data.Response;

                    if (TenantListCtrl.ePage.Masters.RecentTenantList && TenantListCtrl.ePage.Masters.RecentTenantList.length > 0 && !TenantListCtrl.ePage.Masters.QueryString.IsLogin) {
                        GetTenantUserSetting();
                    }
                } else {
                    TenantListCtrl.ePage.Masters.RecentTenantList = [];
                }
            });
        }

        function GetTenantList($viewValue) {
            var _filter = {
                Autocompletefield: ($viewValue == "#") ? undefined : $viewValue
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecMappings.API.FindAllTenantByUser.FilterID
            };

            return apiService.post("authAPI", appConfig.Entities.SecMappings.API.FindAllTenantByUser.Url, _input, TenantListCtrl.ePage.Masters.QueryString.Token).then(function SuccessCallback(response) {
                return response.data.Response;
            });
        }

        function OnAutocompleteListSelect($item, $model, $label, $event) {
            TenantListCtrl.ePage.Masters.SelectedAutocompleteTenant = $item;
        }

        function OnBlurAutoCompleteList($event) {
            TenantListCtrl.ePage.Masters.IsTenantNoResults = false;
            TenantListCtrl.ePage.Masters.IsTenantLoading = false;
        }

        function GetTenantUserSetting() {
            var _filter = {
                "User_FK": authService.getUserInfo().UserPK,
                "SAP_FK": authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.TenantUserSettings.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.TenantUserSettings.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response && response.data.Response.length > 0) {
                    response.data.Response.map(function (value, key) {
                        if (value.IsDefault == true) {
                            TenantListCtrl.ePage.Masters.TenantUserSetting = value;
                        }
                    });

                    if (TenantListCtrl.ePage.Masters.RecentTenantList && TenantListCtrl.ePage.Masters.RecentTenantList.length > 0 && TenantListCtrl.ePage.Masters.TenantUserSetting) {
                        var _index = TenantListCtrl.ePage.Masters.RecentTenantList.map(function (value, key) {
                            return value.EntityRefKey;
                        }).indexOf(TenantListCtrl.ePage.Masters.TenantUserSetting.Tenant_FK);

                        if (_index != -1) {
                            SetAsDefaultTenant(TenantListCtrl.ePage.Masters.RecentTenantList[_index]);
                        }
                    }
                }
            });
        }

        function SetAsDefaultTenant($item, $event) {
            var _index = -1;
            TenantListCtrl.ePage.Masters.RecentTenantList.map(function (value, key) {
                value.IsShowDefault = false;
                if (value.EntityRefKey == $item.EntityRefKey) {
                    _index = key;
                }
            });

            if (_index != -1) {
                TenantListCtrl.ePage.Masters.DefaultTenant = TenantListCtrl.ePage.Masters.RecentTenantList[_index];
                TenantListCtrl.ePage.Masters.DefaultTenant.IsShowDefault = true;
            }

            if ($event) {
                $timeout(function () {
                    UpdateDefault($item);
                });
            }
        }

        function UpdateDefault($item) {
            var _input = {
                SAP_FK: authService.getUserInfo().AppPK,
                User_FK: authService.getUserInfo().UserPK,
                Tenant_FK: $item.EntityRefKey
            };

            apiService.post("authAPI", appConfig.Entities.TenantUserSettings.API.UpdateDefault.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TenantListCtrl.ePage.Masters.TenantUserSetting = response.data.Response;
                } else {
                    toastr.error("Could not Update...!");

                    var _index = TenantListCtrl.ePage.Masters.RecentTenantList.map(function (value, key) {
                        return value.EntityRefKey;
                    }).indexOf(authService.getUserInfo().TenantPK);

                    if (_index != -1) {
                        SetAsDefaultTenant(TenantListCtrl.ePage.Masters.RecentTenantList[_index]);
                    }
                }
            });
        }

        function OnRecentTenantClick($item) {
            if ($item) {
                TenantListCtrl.ePage.Masters.IsShowTenantListOverlay = true;
                TenantListCtrl.ePage.Masters.SelectedTenant = $item;

                SoftLogin($item);
            }
        }

        function OnNextClick() {
            if (TenantListCtrl.ePage.Masters.SelectedAutocompleteTenant) {
                TenantListCtrl.ePage.Masters.IsDisabledNextBtn = true;

                OnRecentTenantClick(TenantListCtrl.ePage.Masters.SelectedAutocompleteTenant);
            } else {
                toastr.warning("Select any Tenant...!");
            }
        }

        function SoftLogin($item) {
            var _input = {
                "grant_type": "password",
                "username": TenantListCtrl.ePage.Masters.QueryString.Username,
                "AppCode": $item.SAP_Code,
                "TenantCode": $item.TNT_TenantCode ? $item.TNT_TenantCode : $item.EntityRefCode
            };

            apiService.post("authAPI", appConfig.Entities.Token.API.SoftLoginToken.Url, _input, TenantListCtrl.ePage.Masters.QueryString.Token).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Status == "Failed") {
                        toastr.error("You don't have an access to this Tenant..!");
                        TenantListCtrl.ePage.Masters.IsShowTenantListOverlay = false;
                    } else {
                        TenantListCtrl.ePage.Masters.UserInfo = response.data.Response;

                        PrepareLocalStroageInfo();
                    }
                } else {
                    toastr.error("You don't have an access to this Tenant..!");
                    TenantListCtrl.ePage.Masters.IsShowTenantListOverlay = false;
                }

                TenantListCtrl.ePage.Masters.IsDisabledNextBtn = false;
            }, function ErrorCallback(response) {
                toastr.error("You don't have an access to this Tenant..");;
                TenantListCtrl.ePage.Masters.IsShowTenantListOverlay = false;
                TenantListCtrl.ePage.Masters.IsDisabledNextBtn = false;
            });
        }

        function PrepareLocalStroageInfo() {
            var _userInfo = angular.copy(TenantListCtrl.ePage.Masters.UserInfo),
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
            $location.path(_userInfo.InternalUrl).search({});
        }

        function GoBack() {
            if (TenantListCtrl.ePage.Masters.QueryString.Continue) {
                $location.path(TenantListCtrl.ePage.Masters.QueryString.Continue).search({});
            } else {
                $location.path(authService.getUserInfo().InternalUrl).search({});
            }
        }

        Init();
    }
})();
