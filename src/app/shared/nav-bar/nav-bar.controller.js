(function () {
    "use strict";

    angular
        .module("Application")
        .controller("NavBarController", NavBarController);

    NavBarController.$inject = ["$rootScope", "$scope", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "LocaleService", "$translate"];

    function NavBarController($rootScope, $scope, $location, $timeout, APP_CONSTANT, authService, apiService, helperService, appConfig, LocaleService, $translate) {
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

            NavBarCtrl.ePage.Masters.userProfile = {
                "DisplayName": authService.getUserInfo().DisplayName,
                "UserId": authService.getUserInfo().UserId,
                "UserEmail": authService.getUserInfo().UserEmail,
                "Photo": authService.getUserInfo().ProfilePhoto
            };

            NavBarCtrl.ePage.Masters.ProductLogo = authService.getUserInfo().ProductLogo;

            NavBarCtrl.ePage.Masters.Logout = Logout;
            NavBarCtrl.ePage.Masters.RedirectToHomeLogo = RedirectToHomeLogo;

            InitMenu();
        }

        // ==========================Menu Start==========================

        function InitMenu() {
            NavBarCtrl.ePage.Masters.Menu = {};

            (authService.getUserInfo().AppCode == "EA") ? (NavBarCtrl.ePage.Masters.Menu.VisibleType = authService.getUserInfo().Menu.VisibleType) : (NavBarCtrl.ePage.Masters.Menu.VisibleType = "Grid");

            NavBarCtrl.ePage.Masters.Menu.ListSource = authService.getUserInfo().Menu.ListSource;

            if (authService.getUserInfo().AppCode == "EA") {
                InitLanguage();
                InitNotification();
            }
        }

        // ==========================Menu End==========================

        function Logout() {
            apiService.logout();
        }

        function RedirectToHomeLogo() {
            if (authService.getUserInfo().InternalUrl) {
                $location.path(authService.getUserInfo().InternalUrl);
            }
        }

        // ==========================Language Start==========================

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

        // ==========================Language End==========================

        // ==========================Notification Start==========================

        function InitNotification() {
            NavBarCtrl.ePage.Masters.Notification = {};
            if (authService.getUserInfo().AppCode == "EA") {
                GetWorkItemCount();
            }
        }

        function GetWorkItemCount() {
            var _filter = {
                "UserName": authService.getUserInfo().UserId,
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

        // ==========================Notification End==========================

        Init();
    }
})();
