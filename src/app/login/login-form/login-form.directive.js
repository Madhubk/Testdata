(function () {
    "use strict";

    angular
        .module("Application")
        .directive("loginForm", LoginForm);

    function LoginForm() {
        let exports = {
            restrict: "E",
            templateUrl: 'app/login/login-form/login-form.html',
            controller: "LoginFormController",
            controllerAs: "LoginFormCtrl",
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("LoginFormController", LoginFormController);

    LoginFormController.$inject = ["$location", "authService", "apiService", "helperService", "appConfig", "toastr", "APP_CONSTANT"];

    function LoginFormController($location, authService, apiService, helperService, appConfig, toastr, APP_CONSTANT) {
        /* jshint validthis: true */
        let LoginFormCtrl = this;

        function Init() {
            LoginFormCtrl.ePage = {
                "Title": "",
                "Prefix": "Login_Form",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            LoginFormCtrl.ePage.Masters.Version = "v" + APP_CONSTANT.Version;
            LoginFormCtrl.ePage.Masters.IsShowForgotPasswordForm = false;

            // Login
            LoginFormCtrl.ePage.Masters.Login = {};
            LoginFormCtrl.ePage.Masters.Login.UserCredentials = {};
            LoginFormCtrl.ePage.Masters.Login.LoginBtnText = "Login";
            LoginFormCtrl.ePage.Masters.Login.IsDisabledLoginBtn = false;

            LoginFormCtrl.ePage.Masters.Login.OnLoginClick = OnLoginClick;
            LoginFormCtrl.ePage.Masters.Login.OnForgotPasswordClick = OnForgotPasswordClick;

            // Forgot Password
            LoginFormCtrl.ePage.Masters.ForgotPassword = {};
            LoginFormCtrl.ePage.Masters.ForgotPassword.UserCredentials = {};
            LoginFormCtrl.ePage.Masters.ForgotPassword.SendBtnText = "Send";
            LoginFormCtrl.ePage.Masters.ForgotPassword.IsDisabledSendBtn = false;

            LoginFormCtrl.ePage.Masters.ForgotPassword.OnSendBtnClick = OnSendBtnClick;
            LoginFormCtrl.ePage.Masters.ForgotPassword.OnCancelBtnClick = OnCancelBtnClick;
        }

        function OnLoginClick() {
            if (LoginFormCtrl.ePage.Masters.Login.LoginForm.$valid) {
                LoginFormCtrl.ePage.Masters.Login.LoginBtnText = "Please Wait...";
                LoginFormCtrl.ePage.Masters.Login.IsDisabledLoginBtn = true;

                HardLogin();
            } else {
                LoginFormCtrl.ePage.Masters.Login.LoginForm.submitted = true;
            }
        }

        function HardLogin() {
            let _hostFullName = $location.host(),
                _splitHost = _hostFullName.split("."),
                _removeFirst = _splitHost.splice(0, 1),
                _host = (_removeFirst[0] === "www") ? _splitHost.join(".") : _hostFullName;

            let _input = "grant_type=password&username=" + LoginFormCtrl.ePage.Masters.Login.UserCredentials.username + "&password=" + LoginFormCtrl.ePage.Masters.Login.UserCredentials.password + "&ExternalURL=" + _host;

            apiService.post("authAPI", appConfig.Entities.Token.API.token.Url, _input).then(response => {
                let _response = response.data;
                if (_response && _response.access_token) {
                    let _hardLoginToken = _response.token_type + ' ' + _response.access_token;

                    if (_response.tenantinfo) {
                        let _tenantinfo = (typeof _response.tenantinfo == "string") ? JSON.parse(_response.tenantinfo) : _response.tenantinfo;
                        if (_tenantinfo.TenantDetails && _tenantinfo.TenantDetails.length > 0) {
                            let _tenantList = (typeof _response.recentTenant == "string") ? JSON.parse(_response.recentTenant) : _response.recentTenant;
                            let _queryString = {
                                Username: _response.username,
                                Token: _hardLoginToken,
                                TenantList: _tenantList,
                                IsLogin: true,
                                Continue: $location.path()
                            };
                            // redirect tenant list page
                            $location.path("/tenant-list").search("q", helperService.encryptData(_queryString));
                        } else {
                            toastr.error("You donot have access to this application...!");
                        }
                    } else {
                        LoginFormCtrl.ePage.Masters.UserInfo = _response;
                        LoginFormCtrl.ePage.Masters.UserInfo.AuthToken = _hardLoginToken;

                        GetUIControlList();
                    }
                } else {
                    toastr.error("Login Failed...!");
                    LoginFormCtrl.ePage.Masters.Login.LoginBtnText = "Login";
                    LoginFormCtrl.ePage.Masters.Login.IsDisabledLoginBtn = false;
                }
            }, response => {
                toastr.error("Please Check Username and Password", "Invalid Credentials");

                LoginFormCtrl.ePage.Masters.Login.LoginBtnText = "Login";
                LoginFormCtrl.ePage.Masters.Login.IsDisabledLoginBtn = false;
            });
        }

        function GetUIControlList() {
            let _filter = {
                "SAP_FK": LoginFormCtrl.ePage.Masters.UserInfo.AppPK,
                "TenantCode": LoginFormCtrl.ePage.Masters.UserInfo.TenantCode,
                "USR_FK": LoginFormCtrl.ePage.Masters.UserInfo.UserPK
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CompUserRoleAccess.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.CompUserRoleAccess.API.FindAll.Url, _input, LoginFormCtrl.ePage.Masters.UserInfo.AuthToken).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    let _response = response.data.Response;
                    let _controlList = [];
                    _response.map(value => {
                        if (value.SOP_Code) {
                            _controlList.push(value.SOP_Code);
                        }
                    });
                    LoginFormCtrl.ePage.Masters.UserInfo.UIControlList = _controlList;
                } else {
                    LoginFormCtrl.ePage.Masters.UserInfo.UIControlList = [];
                }

                GetSideBarMenuCompact();
            });
        }

        function GetSideBarMenuCompact() {
            let _filter = {
                "SourceEntityRefKey": LoginFormCtrl.ePage.Masters.UserInfo.UserId,
                "AppCode": LoginFormCtrl.ePage.Masters.UserInfo.AppCode,
                "EntitySource": "APP_DEFAULT"
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + LoginFormCtrl.ePage.Masters.UserInfo.AppPK, _input, LoginFormCtrl.ePage.Masters.UserInfo.AuthToken).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    let _response = response.data.Response[0];
                    _response.Value = JSON.parse(_response.Value);
                    LoginFormCtrl.ePage.Masters.UserInfo.MenuCompact = _response;
                    LoginFormCtrl.ePage.Masters.UserInfo.IsMenuCompact = _response.Value.IsMenuCompact;
                }
                PrepareLocalStroageInfo();
            });
        }

        function PrepareLocalStroageInfo() {
            let _userInfo = angular.copy(LoginFormCtrl.ePage.Masters.UserInfo),
                _keys = ["Menus", "AccessMenus", "HomeMenu", "Logo", "Parties"];

            _keys.map(value => {
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

            if (_userInfo.HomeMenu && (_userInfo.AccessMenus && _userInfo.AccessMenus.length > 0)) {
                if (_userInfo.HomeMenu.PK) {
                    let _index = _userInfo.AccessMenus.findIndex(value => value.Id === _userInfo.HomeMenu.PK);

                    if (_index != -1) {
                        _userInfo.InternalUrl = _userInfo.AccessMenus[_index].Link;
                    }
                }
            }

            if (_userInfo.RolePK && _userInfo.PartyPK) {
                if (_userInfo.Parties && _userInfo.Parties.length > 0) {
                    _userInfo.Parties.map(value => {
                        if (value.PK === _userInfo.PartyPK) {
                            _userInfo.Roles = value.Roles;
                        }
                    });
                }
            }

            _userInfo.Expires = _userInfo[".expires"];
            _userInfo.Issued = _userInfo[".issued"];

            authService.setUserInfo(helperService.encryptData(_userInfo));
            $location.path(_userInfo.InternalUrl).search({});
        }

        function OnForgotPasswordClick() {
            LoginFormCtrl.ePage.Masters.IsShowForgotPasswordForm = true;

            LoginFormCtrl.ePage.Masters.Login.UserCredentials = {};
            LoginFormCtrl.ePage.Masters.ForgotPassword.UserCredentials = {};
        }

        // ===========================
        function OnSendBtnClick() {
            if (LoginFormCtrl.ePage.Masters.ForgotPassword.ForgotPasswordForm.$valid) {
                LoginFormCtrl.ePage.Masters.ForgotPassword.SendBtnText = "Please Wait...";
                LoginFormCtrl.ePage.Masters.ForgotPassword.IsDisabledSendBtn = true;

                SendMailForgotPassword();
            } else {
                LoginFormCtrl.ePage.Masters.ForgotPassword.ForgotPasswordForm.submitted = true;
            }
        }

        function SendMailForgotPassword() {
            let _input = {
                UserName: LoginFormCtrl.ePage.Masters.ForgotPassword.UserCredentials.username
            };

            apiService.post("authAPI", appConfig.Entities.User.API.ResetPassword.Url, _input).then(response => {
                (response.data.Status == "success") ? toastr.info(response.data.Response) : toastr.error(response.data.Response);

                LoginFormCtrl.ePage.Masters.ForgotPassword.SendBtnText = "Send";
                LoginFormCtrl.ePage.Masters.ForgotPassword.IsDisabledSendBtn = false;
            }, response => {
                LoginFormCtrl.ePage.Masters.ForgotPassword.SendBtnText = "Send";
                LoginFormCtrl.ePage.Masters.ForgotPassword.IsDisabledSendBtn = false;
            });
        }

        function OnCancelBtnClick() {
            LoginFormCtrl.ePage.Masters.IsShowForgotPasswordForm = false;

            LoginFormCtrl.ePage.Masters.Login.UserCredentials = {};
            LoginFormCtrl.ePage.Masters.ForgotPassword.UserCredentials = {};
        }

        Init();
    }
})();
