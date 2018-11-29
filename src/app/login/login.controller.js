(function () {
    "use strict";

    angular
        .module("Application")
        .controller("LoginController", LoginController);

    LoginController.$inject = ["$location", "authService", "apiService", "helperService", "appConfig", "toastr", "APP_CONSTANT"];

    function LoginController($location, authService, apiService, helperService, appConfig, toastr, APP_CONSTANT) {
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
            LoginCtrl.ePage.Masters.ProductLogo = "assets/img/logo/product-logo.png";
            LoginCtrl.ePage.Masters.Version = "v" + APP_CONSTANT.Version;

            LoginCtrl.ePage.Masters.Login = ValidateLogin;

            LoginCtrl.ePage.Masters.loginBtnText = "Login";
            LoginCtrl.ePage.Masters.isDisabledLoginBtn = false;
        }

        function ValidateLogin() {
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
                            LoginCtrl.ePage.Masters.UserInfo = _response;
                            LoginCtrl.ePage.Masters.UserInfo.AuthToken = _hardLoginToken;

                            PrepareLocalStroageInfo();
                        }
                    } else {
                        toastr.error("Login Failed...!");
                        LoginCtrl.ePage.Masters.loginBtnText = "Login";
                        LoginCtrl.ePage.Masters.isDisabledLoginBtn = false;
                    }
                }
            }, function ErrorCallback(response) {
                toastr.error("Please Check Username and Password", "Invalid Credentials");

                LoginCtrl.ePage.Masters.loginBtnText = "Login";
                LoginCtrl.ePage.Masters.isDisabledLoginBtn = false;
            });
        }

        function PrepareLocalStroageInfo() {
            var _userInfo = angular.copy(LoginCtrl.ePage.Masters.UserInfo),
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

        Init();
    }
})();
