(function () {
    "use strict";

    angular
        .module("Application")
        .controller("LoginController", LoginController);

    LoginController.$inject = ["$location", "$timeout", "authService", "apiService", "helperService", "appConfig", "toastr"];

    function LoginController($location, $timeout, authService, apiService, helperService, appConfig, toastr) {
        /* jshint validthis: true */
        var LoginCtrl = this;

        function Init() {
            LoginCtrl.ePage = {
                "Title": "",
                "Prefix": "Login",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            LoginCtrl.ePage.Masters.UserCredentials = {};
            LoginCtrl.ePage.Masters.Menu = {};

            LoginCtrl.ePage.Masters.UserInfo = {
                ProfilePhoto: "assets/img/avatars/profile-photo-dummy.png",
                ProductLogo: "assets/img/logo/product-logo-dummy.png",
                Menu: {
                    VisibleType: "List",
                    ListSource: []
                },
                AccessMenuList: []
            };

            LoginCtrl.ePage.Masters.Login = Login;
            LoginCtrl.ePage.Masters.OnTenantClick = OnTenantClick;

            LoginCtrl.ePage.Masters.IsShowTenantList = false;
            LoginCtrl.ePage.Masters.IsShowTenantListOverlay = false;

            LoginCtrl.ePage.Masters.loginBtnText = "Login";
            LoginCtrl.ePage.Masters.isDisabledLoginBtn = false;

            GetUserTypeList();
        }

        function GetUserTypeList() {
            LoginCtrl.ePage.Masters.UserTypeList = [{
                "FieldName": "Admin",
                "Displayname": "Admin"
            }, {
                "FieldName": "RegularUser",
                "Displayname": "Regular User"
            }, {
                "FieldName": "Customer",
                "Displayname": "Customer",
            }];

            // Set Default UserType
            LoginCtrl.ePage.Masters.UserType = LoginCtrl.ePage.Masters.UserTypeList[1].FieldName;
        }

        function Login() {
            if (LoginCtrl.ePage.Masters.loginForm.$valid) {
                LoginCtrl.ePage.Masters.loginBtnText = "Please Wait...";
                LoginCtrl.ePage.Masters.isDisabledLoginBtn = true;
                HardLogin();
            } else {
                LoginCtrl.ePage.Masters.loginForm.submitted = true;
            }
        }

        function HardLogin() {
            var _hostFullName = $location.host(),
                _splitHost = _hostFullName.split("."),
                _removeFirst = _splitHost.splice(0, 1),
                _host;
            if (_removeFirst[0] === "www") {
                _host = _splitHost.join(".");
            } else {
                _host = _hostFullName
            }

            var _input = "grant_type=password&username=" + LoginCtrl.ePage.Masters.UserCredentials.username + "&password=" + LoginCtrl.ePage.Masters.UserCredentials.password + "&ExternalURL=" + _host;

            apiService.post("authAPI", appConfig.Entities.Token.API.token.Url, _input).then(function SuccessCallback(response) {
                if (!angular.isUndefined(response.data.access_token)) {
                    LoginCtrl.ePage.Masters.HardLoginToken = response.data.token_type + ' ' + response.data.access_token;
                    LoginCtrl.ePage.Masters.TenantList = JSON.parse(response.data.tenantinfo);

                    if (LoginCtrl.ePage.Masters.TenantList.length > 0) {
                        if (LoginCtrl.ePage.Masters.TenantList.length > 1) {
                            LoginCtrl.ePage.Masters.IsShowTenantList = true;
                        } else {
                            OnTenantClick(LoginCtrl.ePage.Masters.TenantList[0]);
                        }
                    } else {
                        toastr.error("You dont have access to this Application...!");
                        LoginCtrl.ePage.Masters.loginBtnText = "Login";
                        LoginCtrl.ePage.Masters.isDisabledLoginBtn = false;
                    }
                }
            }, function ErrorCallback(response) {
                // Invalid Login                    
                if (response.data == null) {
                    LoginCtrl.ePage.Masters.loginBtnText = "Login";
                    LoginCtrl.ePage.Masters.isDisabledLoginBtn = false;
                    toastr.error("Please Check Username and Password", "Invalid Credentials");
                }
            });
        }

        function OnTenantClick($item) {
            LoginCtrl.ePage.Masters.IsShowTenantListOverlay = true;
            LoginCtrl.ePage.Masters.SelectedTenant = $item;

            SoftLogin();
        }

        function SoftLogin() {
            var _appCode = LoginCtrl.ePage.Masters.SelectedTenant.SAP_Code;
            var _input = {
                "grant_type": "password",
                "username": LoginCtrl.ePage.Masters.UserCredentials.username,
                "AppCode": LoginCtrl.ePage.Masters.SelectedTenant.SAP_Code,
                "TNTCode": LoginCtrl.ePage.Masters.SelectedTenant.TNT_TenantCode
            };

            apiService.post("authAPI", appConfig.Entities.Token.API.SoftLoginToken.Url, _input, LoginCtrl.ePage.Masters.HardLoginToken).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);
                    if (!_isEmpty) {
                        for (var x in response.data.Response) {
                            LoginCtrl.ePage.Masters.UserInfo[x] = response.data.Response[x];
                        }
                    }

                    CheckUserBasedMenuVisibleType();
                } else {
                    LoginCtrl.ePage.Masters.IsShowTenantListOverlay = false;
                }
            }, function ErrorCallback(response) {
                LoginCtrl.ePage.Masters.IsShowTenantListOverlay = false;
            });
        }

        function CheckUserBasedMenuVisibleType() {
            var _filter = {
                "SourceEntityRefKey": LoginCtrl.ePage.Masters.UserInfo.UserId,
                "AppCode": LoginCtrl.ePage.Masters.UserInfo.AppCode,
                "EntitySource": "APP_DEFAULT"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + LoginCtrl.ePage.Masters.UserInfo.AppPK, _input, LoginCtrl.ePage.Masters.UserInfo.AuthToken).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;
                    if (_response.length > 0) {
                        var _value = JSON.parse(_response[0].Value);
                        LoginCtrl.ePage.Masters.UserInfo.Menu.VisibleType = _value.Dashboard.MenuType;
                    }
                }
                GetCfxMenusList();
            });
        }

        function GetCfxMenusList() {
            var _filter = {
                "USR_TenantCode": LoginCtrl.ePage.Masters.UserInfo.TenantCode,
                "USR_UserName": LoginCtrl.ePage.Masters.UserInfo.UserId,
                "USR_SAP_FK": LoginCtrl.ePage.Masters.UserInfo.AppPK,
                "PageType": "Menu"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.MasterCascadeFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.MasterCascadeFindAll.Url, _input, LoginCtrl.ePage.Masters.UserInfo.AuthToken).then(function (response) {
                if (response.data.Response) {
                    LoginCtrl.ePage.Masters.UserInfo.Menu.ListSource = response.data.Response;
                }
                GetUserAccessMenuList();
            });
        }

        function GetUserAccessMenuList() {
            var _filter = {
                "USR_TenantCode": LoginCtrl.ePage.Masters.UserInfo.TenantCode,
                "USR_UserName": LoginCtrl.ePage.Masters.UserInfo.UserId,
                "USR_SAP_FK": LoginCtrl.ePage.Masters.UserInfo.AppPK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.MasterCascadeFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.MasterCascadeFindAll.Url, _input, LoginCtrl.ePage.Masters.UserInfo.AuthToken).then(function (response) {
                if (response.data.Response) {
                    LoginCtrl.ePage.Masters.UserInfo.AccessMenuList = response.data.Response;
                }
                GetDefaultPage();
            });
        }

        function GetDefaultPage() {
            var _filter = {
                USR_Code: LoginCtrl.ePage.Masters.UserInfo.UserId,
                USR_SAP_FK: LoginCtrl.ePage.Masters.UserInfo.AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.HomeMenuUserRoleAccess.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.HomeMenuUserRoleAccess.API.FindAll.Url, _input, LoginCtrl.ePage.Masters.UserInfo.AuthToken).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        LoginCtrl.ePage.Masters.DefaultMenu = response.data.Response[0];

                        if (LoginCtrl.ePage.Masters.UserInfo.Menu.ListSource.length > 0) {
                            LoginCtrl.ePage.Masters.UserInfo.Menu.ListSource.map(function (value, key) {
                                if (value.Code == LoginCtrl.ePage.Masters.DefaultMenu.HOM_Code) {
                                    var _link = angular.copy(value.Link);
                                    var _index = _link.indexOf("#");
                                    if (_index != -1) {
                                        _link = value.Link.substring(2, value.Link.length);
                                    }

                                    LoginCtrl.ePage.Masters.UserInfo.InternalUrl = _link;
                                }
                            });
                        }
                    }
                }

                GetUserProfilePicture();
            });
        }

        function GetUserProfilePicture() {
            var _filter = {
                "EntityRefKey": LoginCtrl.ePage.Masters.UserInfo.UserPK,
                "EntitySource": "USR"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + LoginCtrl.ePage.Masters.UserInfo.AppPK, _input, LoginCtrl.ePage.Masters.UserInfo.AuthToken).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        DownloadImage(response.data.Response[0], 'ProfilePhoto');
                    } else {
                        GetProductLogo();
                    }
                } else {
                    GetProductLogo();
                }
            });
        }

        function GetProductLogo_Old() {
            var _filter = {
                // "EntityRefKey": LoginCtrl.ePage.Masters.UserInfo.TenantPK,
                // "EntitySource": "TNT"
                "EntityRefKey": LoginCtrl.ePage.Masters.UserInfo.AppPK,
                "EntitySource": "SAP"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + LoginCtrl.ePage.Masters.UserInfo.AppPK, _input, LoginCtrl.ePage.Masters.UserInfo.AuthToken).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        DownloadImage(response.data.Response[0], 'ProductLogo');
                    } else {
                        RedirectPage();
                    }
                } else {
                    RedirectPage();
                }
            });
        }
        // Test
        function GetProductLogo() {
           apiService.get("eAxisAPI", appConfig.Entities.JobDocument.API.GetLogoFile.Url + LoginCtrl.ePage.Masters.UserInfo.AppPK, LoginCtrl.ePage.Masters.UserInfo.AuthToken).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DownloadImage(response.data.Response, 'ProductLogo');
                } else {
                    RedirectPage();
                }
            });
        }

        function DownloadImage(curDoc, objName) {
            apiService.get("eAxisAPI", appConfig.Entities.JobDocument.API.JobDocumentDownload.Url + curDoc.PK + "/" + LoginCtrl.ePage.Masters.UserInfo.AppPK, LoginCtrl.ePage.Masters.UserInfo.AuthToken).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        LoginCtrl.ePage.Masters.UserInfo[objName] = "data:image/jpeg;base64," + response.data.Response.Base64str;

                        if (objName == "ProfilePhoto") {
                            GetProductLogo();
                        } else {
                            RedirectPage();
                        }
                    } else {
                        if (objName == "ProfilePhoto") {
                            GetProductLogo();
                        } else {
                            RedirectPage();
                        }
                    }
                } else {
                    if (objName == "ProfilePhoto") {
                        GetProductLogo();
                    } else {
                        RedirectPage();
                    }
                }
            });
        }

        function RedirectPage() {
            if (LoginCtrl.ePage.Masters.UserInfo.AppCode == "TC") {
                LoginCtrl.ePage.Masters.UserInfo.Menu.VisibleType = "Grid";
            }

            var _userInfo = angular.copy(LoginCtrl.ePage.Masters.UserInfo),
                queryString = $location.search(),
                _redirectionPath = LoginCtrl.ePage.Masters.UserInfo.InternalUrl;

            authService.setUserInfo(helperService.encryptData(_userInfo));

            if (queryString.continue != undefined) {
                if (queryString.continue.length > 0) {
                    if (queryString.continue != "/home") {
                        var menuList = JSON.stringify(_userInfo.Menu.ListSource).toLowerCase();
                        var _index = menuList.indexOf(queryString.continue.toLowerCase());

                        if (_index != -1) {
                            _redirectionPath = queryString.continue;
                        }
                    }
                }
            }

            $location.path(_redirectionPath).search({});
        }

        Init();
    }
})();
