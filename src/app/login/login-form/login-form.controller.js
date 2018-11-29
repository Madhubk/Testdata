(function () {
    "use strict";

    angular
        .module("Application")
        .directive("loginForm", LoginForm);

    LoginForm.$inject = [];

    function LoginForm() {
        var exports = {
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
        var LoginFormCtrl = this;

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
            var _hostFullName = $location.host(),
                _splitHost = _hostFullName.split("."),
                _removeFirst = _splitHost.splice(0, 1),
                _host;
            if (_removeFirst[0] === "www") {
                _host = _splitHost.join(".");
            } else {
                _host = _hostFullName
            }

            var _input = "grant_type=password&username=" + LoginFormCtrl.ePage.Masters.Login.UserCredentials.username + "&password=" + LoginFormCtrl.ePage.Masters.Login.UserCredentials.password + "&ExternalURL=" + _host;

            apiService.post("authAPI", appConfig.Entities.Token.API.token.Url, _input).then(function SuccessCallback(response) {
                var _response = response.data;
                if (_response) {
                    if (_response.access_token) {
                        var _hardLoginToken = _response.token_type + ' ' + _response.access_token;

                        if (_response.tenantinfo) {
                            var _queryString = {
                                Username: _response.username,
                                Token: _hardLoginToken,
                                TenantList: JSON.parse(_response.tenantinfo),
                                IsLogin: true,
                                Continue: $location.path(),
                            };
                            $location.path("/tenant-list").search("q", helperService.encryptData(_queryString));
                        } else {
                            LoginFormCtrl.ePage.Masters.UserInfo = _response;
                            LoginFormCtrl.ePage.Masters.UserInfo.AuthToken = _hardLoginToken;

                            PrepareLocalStroageInfo();
                        }
                    } else {
                        toastr.error("Login Failed...!");
                        LoginFormCtrl.ePage.Masters.Login.LoginBtnText = "Login";
                        LoginFormCtrl.ePage.Masters.Login.IsDisabledLoginBtn = false;
                    }
                }
            }, function ErrorCallback(response) {
                toastr.error("Please Check Username and Password", "Invalid Credentials");

                LoginFormCtrl.ePage.Masters.Login.LoginBtnText = "Login";
                LoginFormCtrl.ePage.Masters.Login.IsDisabledLoginBtn = false;
            });
        }

        function PrepareLocalStroageInfo() {
            var _userInfo = angular.copy(LoginFormCtrl.ePage.Masters.UserInfo),
                _keys = ["Menus", "AccessMenus", "HomeMenu", "Logo", "Parties"];

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

            if (_userInfo.HomeMenu && (_userInfo.AccessMenus && _userInfo.AccessMenus.length > 0)) {
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
            var _input = {
                UserName: LoginFormCtrl.ePage.Masters.ForgotPassword.UserCredentials.username
            };

            apiService.post("authAPI", appConfig.Entities.User.API.ResetPassword.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Status == "success") {
                    toastr.info(response.data.Response);
                } else {
                    toastr.error(response.data.Response);
                }
                LoginFormCtrl.ePage.Masters.ForgotPassword.SendBtnText = "Send";
                LoginFormCtrl.ePage.Masters.ForgotPassword.IsDisabledSendBtn = false;
            }, function ErrorCallback(response) {
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
