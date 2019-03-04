(function () {
    "use strict";

    angular
        .module("Application")
        .directive("navBar", NavBar);

    function NavBar() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/nav-bar/nav-bar.html",
            controller: "NavBarController",
            controllerAs: "NavBarCtrl",
            bindToController: true,
            scope: {}
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("NavBarController", NavBarController);

    NavBarController.$inject = ["$scope", "$location", "$timeout", "authService", "apiService", "helperService", "appConfig", "LocaleService", "toastr"];

    function NavBarController($scope, $location, $timeout, authService, apiService, helperService, appConfig, LocaleService, toastr) {
        /* jshint validthis: true */
        var NavBarCtrl = this;

        function Init() {
            NavBarCtrl.ePage = {
                "Title": "",
                "Prefix": "NavBar",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            NavBarCtrl.ePage.Masters.UserName = authService.getUserInfo().DisplayName;

            NavBarCtrl.ePage.Masters.Logout = Logout;
            NavBarCtrl.ePage.Masters.RedirectToHomeLogo = RedirectToHomeLogo;
            NavBarCtrl.ePage.Masters.GoToHelp = GoToHelp;

            InitMenu();
            InitSwitchTRP();
            InitLogo();

            if (authService.getUserInfo().AppCode == "EA") {
                var _index = authService.getUserInfo().Menus.map(function (value, key) {
                    return value.Code;
                }).indexOf("EA_MAIN_MY_TASKS");

                if (_index != -1) {
                    InitNotification();
                }
                // InitLanguage();
            }
        }

        function Logout() {
            apiService.logout();
        }

        function RedirectToHomeLogo() {
            if (authService.getUserInfo().InternalUrl) {
                $location.path(authService.getUserInfo().InternalUrl);
            }
        }

        function GoToHelp() {
            window.open("#/help/topic", "_blank");
        }

        // #region Language
        function InitLanguage() {
            NavBarCtrl.ePage.Masters.Language = {};
            NavBarCtrl.ePage.Masters.Language.OnLanguageChange = OnLanguageChange;

            NavBarCtrl.ePage.Masters.Language.ListSource = authService.getUserInfo().LanguageList;

            if (NavBarCtrl.ePage.Masters.Language.ListSource) {
                if (NavBarCtrl.ePage.Masters.Language.ListSource.length > 0) {
                    SetLanguageList();
                } else {
                    GetLanguageList();
                }
            } else {
                GetLanguageList();
            }
        }

        function GetLanguageList() {
            var _filter = {
                "TenantCode": authService.getUserInfo().TenantCode,
                "SAP_FK": authService.getUserInfo().AppPK,
                "EntitySource": "LANGUAGE"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    NavBarCtrl.ePage.Masters.Language.ListSource = response.data.Response;

                    if (NavBarCtrl.ePage.Masters.Language.ListSource.length > 0) {
                        var _userInfo = authService.getUserInfo();
                        _userInfo.LanguageList = NavBarCtrl.ePage.Masters.Language.ListSource;

                        $timeout(function () {
                            authService.setUserInfo(helperService.encryptData(_userInfo));
                            SetLanguageList();
                        });
                    } else {
                        OnLanguageChange();
                    }
                } else {
                    NavBarCtrl.ePage.Masters.Language.ListSource = [];
                }
            });
        }

        function SetLanguageList() {
            var CurrentLang = NavBarCtrl.ePage.Masters.Language.ListSource.find(function (obj) {
                return obj.Key === localStorage.getItem('NG_TRANSLATE_LANG_KEY');
            });

            if (CurrentLang) {
                OnLanguageChange(CurrentLang);
            } else {
                OnLanguageChange(NavBarCtrl.ePage.Masters.Language.ListSource[0]);
            }
        }

        function OnLanguageChange($item) {
            if ($item) {
                NavBarCtrl.ePage.Masters.Language.ActiveLanguage = $item;
                LocaleService.setLocaleByDisplayName($item.Key);
            }
        }
        // #endregion

        // #region Notification
        function InitNotification() {
            NavBarCtrl.ePage.Masters.Notification = {};
            if (authService.getUserInfo().AppCode == "EA") {
                GetWorkItemCount();
            }
        }

        function GetWorkItemCount() {
            var _filter = {
                "Performer": authService.getUserInfo().UserId,
                "Status": "AVAILABLE,ASSIGNED"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllCount.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllCount.Url, _input).then(function (response) {
                if (response.data.Response != undefined) {
                    NavBarCtrl.ePage.Masters.Notification.WorkItemCount = response.data.Response;
                }
            });
        }
        // #endregion

        // #region Switch Tenant Party Role
        function InitSwitchTRP() {
            // TRP - Tenant,Role,Party
            NavBarCtrl.ePage.Masters.SwitchTRP = {};
            NavBarCtrl.ePage.Masters.SwitchTRP.SwitchTenant = SwitchTenant;
            NavBarCtrl.ePage.Masters.SwitchTRP.SwitchParty = SwitchParty;
            NavBarCtrl.ePage.Masters.SwitchTRP.SwitchRole = SwitchRole;

            NavBarCtrl.ePage.Masters.SwitchTRP.IsShowSwitchTenant = false;
            NavBarCtrl.ePage.Masters.SwitchTRP.IsShowSwitchParty = false;
            NavBarCtrl.ePage.Masters.SwitchTRP.IsShowSwitchRole = false;

            if (authService.getUserInfo().IssingleTenant == false) {
                NavBarCtrl.ePage.Masters.SwitchTRP.IsShowSwitchTenant = true;
            }
            if (authService.getUserInfo().Parties) {
                if (authService.getUserInfo().Parties.length > 1) {
                    NavBarCtrl.ePage.Masters.SwitchTRP.IsShowSwitchParty = true;
                }
            }
            if (authService.getUserInfo().Roles) {
                if (authService.getUserInfo().Roles.length > 1) {
                    NavBarCtrl.ePage.Masters.SwitchTRP.IsShowSwitchRole = true;
                }
            }

            NavBarCtrl.ePage.Masters.ActiveTenant = (authService.getUserInfo().TenantName) ? authService.getUserInfo().TenantName : authService.getUserInfo().TenantCode;
            NavBarCtrl.ePage.Masters.ActiveParty = (authService.getUserInfo().PartyName) ? authService.getUserInfo().PartyName : authService.getUserInfo().PartyCode;
            NavBarCtrl.ePage.Masters.ActiveRole = (authService.getUserInfo().RoleName) ? authService.getUserInfo().RoleName : authService.getUserInfo().RoleCode;
        }

        function SwitchTenant() {
            var _queryString = {
                Username: authService.getUserInfo().UserId,
                Token: authService.getUserInfo().AuthToken,
                Continue: $location.path(),
            };

            $location.path("/tenant-list").search("q", helperService.encryptData(_queryString));
        }

        function SwitchParty() {
            var _queryString = {
                Token: authService.getUserInfo().AuthToken,
                Continue: $location.path()
            };
            $location.path("/party-list").search("q", helperService.encryptData(_queryString));
        }

        function SwitchRole() {
            var _queryString = {
                Token: authService.getUserInfo().AuthToken,
                Continue: $location.path(),
            };
            $location.path("/role-list").search("q", helperService.encryptData(_queryString));
        }
        // #endregion

        // #region Logo
        function InitLogo() {
            NavBarCtrl.ePage.Masters.UserLogo = {};
            NavBarCtrl.ePage.Masters.AppLogo = {};
            NavBarCtrl.ePage.Masters.TenantLogo = {};

            NavBarCtrl.ePage.Masters.UserLogo.LogoStr = "assets/img/logo/user-logo-dummy.png";
            NavBarCtrl.ePage.Masters.AppLogo.LogoStr = "assets/img/logo/app-logo-dummy.png";
            NavBarCtrl.ePage.Masters.TenantLogo.LogoStr = "assets/img/logo/product-logo-dummy.png";

            $scope.OnLogoChange = OnLogoChange;
            GetLogos();
        }

        function OnLogoChange(event, input) {
            var maxSize = input.dataset.maxSize / 1024; // in bytes to KB
            NavBarCtrl.ePage.Masters.UserLogo.LogoStr = undefined;

            if (input.files.length > 0) {
                var fileSize = input.files[0].size / 1024;

                if (fileSize > maxSize) {
                    toastr.warning('File size should not be more then ' + maxSize + ' KB');
                    NavBarCtrl.ePage.Masters.UserLogo.LogoStr = NavBarCtrl.ePage.Masters.UserLogo.SecLogoRes.Logo;
                    return false;
                } else {
                    var ext = input.files[0]['name'].substring(input.files[0]['name'].lastIndexOf('.') + 1).toLowerCase();
                    if (input.files && input.files[0] && (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
                        helperService.getImageBase64Str(input.files[0]).then(function (response) {
                            NavBarCtrl.ePage.Masters.UserLogo.LogoStr = angular.copy(response);
                            SaveLogo();
                        }, function (error) {
                            console.log(error);
                        });
                    }
                }
            }
        }

        function GetLogos() {
            var _filter = {
                // "EntitySource": "USR_LOGO",
                // "EntityRefKey": authService.getUserInfo().UserPK,
                // "EntityRefCode": authService.getUserInfo().UserId,

                "USR_EntitySource": "USR_LOGO",
                "USR_EntityRefKey": authService.getUserInfo().UserPK,
                "USR_EntityRefCode": authService.getUserInfo().UserId,

                "TNT_EntitySource": "TNT_LOGO",
                "TNT_EntityRefKey": authService.getUserInfo().TenantPK,
                "TNT_EntityRefCode": authService.getUserInfo().TenantCode,

                "SAP_EntitySource": "SAP_LOGO",
                "SAP_EntityRefKey": authService.getUserInfo().AppPK,
                "SAP_EntityRefCode": authService.getUserInfo().AppCode
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecLogo.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.SecLogo.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        response.data.Response.map(function (value, key) {
                            if (value.EntitySource == "USR_LOGO") {
                                NavBarCtrl.ePage.Masters.UserLogo.LogoStr = value.Logo;
                                NavBarCtrl.ePage.Masters.UserLogo.SecLogoRes = value;
                            } else if (value.EntitySource == "TNT_LOGO") {
                                NavBarCtrl.ePage.Masters.TenantLogo.LogoStr = value.Logo;
                            } else if (value.EntitySource == "SAP_LOGO") {
                                NavBarCtrl.ePage.Masters.AppLogo.LogoStr = value.Logo;
                            }
                        });
                    }
                }
            });
        }

        function SaveLogo() {
            if (NavBarCtrl.ePage.Masters.UserLogo.SecLogoRes) {
                UpdateLogo();
            } else {
                InsertLogo();
            }
        }

        function InsertLogo() {
            var _input = {
                "EntitySource": "USR_LOGO",
                "EntityRefKey": authService.getUserInfo().UserPK,
                "EntityRefCode": authService.getUserInfo().UserId,
                "Logo": NavBarCtrl.ePage.Masters.UserLogo.LogoStr,
                "IsModified": true
            };

            apiService.post("eAxisAPI", appConfig.Entities.SecLogo.API.Insert.Url, [_input]).then(function (response) {
                NavBarCtrl.ePage.Masters.UserLogo.LogoStr = undefined;
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        NavBarCtrl.ePage.Masters.UserLogo.SecLogoRes = response.data.Response[0];
                        NavBarCtrl.ePage.Masters.UserLogo.LogoStr = response.data.Response[0].Logo;
                    }
                } else {
                    toastr.error("Couldn't Save Your Profile Photo...!");
                }
            });
        }

        function UpdateLogo() {
            var _input = NavBarCtrl.ePage.Masters.UserLogo.SecLogoRes;
            _input.Logo = NavBarCtrl.ePage.Masters.UserLogo.LogoStr;
            _input.IsModified = true;

            apiService.post("eAxisAPI", appConfig.Entities.SecLogo.API.Update.Url, _input).then(function (response) {
                NavBarCtrl.ePage.Masters.UserLogo.LogoStr = undefined;
                if (response.data.Response) {
                    NavBarCtrl.ePage.Masters.UserLogo.SecLogoRes = response.data.Response;
                    NavBarCtrl.ePage.Masters.UserLogo.LogoStr = response.data.Response.Logo;
                } else {
                    toastr.error("Couldn't Save Your Profile Photo...!");
                }
            });
        }
        // #endregion

        // #region Menu
        function InitMenu() {
            NavBarCtrl.ePage.Masters.Menu = {};
            NavBarCtrl.ePage.Masters.MenuType = authService.getUserInfo().MenuType;
            NavBarCtrl.ePage.Masters.Menu.ListSource = authService.getUserInfo().Menus;

            NavBarCtrl.ePage.Masters.Menu.OnRecentMenuClick = OnRecentMenuClick;
            NavBarCtrl.ePage.Masters.Menu.GetMenuLink = GetMenuLink;

            GetRecentMenus();
        }

        function GetRecentMenus() {
            NavBarCtrl.ePage.Masters.Menu.RecentMenus = undefined;
            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.FindRecentItems.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.CfxMenus.API.FindRecentItems.Url, _input).then(function (response) {
                if (response.data.Response && response.data.Response.length > 0) {
                    NavBarCtrl.ePage.Masters.Menu.RecentMenus = response.data.Response;

                    NavBarCtrl.ePage.Masters.Menu.RecentMenus.map(x => {
                        if (x.Icon) {
                            x.Icon = JSON.parse(x.Icon);
                        }
                    });
                } else {
                    NavBarCtrl.ePage.Masters.Menu.RecentMenus = [];
                }
            });
        }

        function GetMenuLink($item){
            return ($item.Link.split("/")[0] != "") ? ("#/" + $item.Link) : ("#" + $item.Link);
        }

        function OnRecentMenuClick($item){
            LogVisitedMenu($item);
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
        // #endregion

        Init();
    }
})();
