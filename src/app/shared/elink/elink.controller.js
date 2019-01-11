(function () {
    "use strict";

    angular
        .module('Application')
        .controller('ELinkController', ELinkController);

    ELinkController.$inject = ["$location", "$timeout", "helperService", "appConfig", "apiService", "authService"];

    function ELinkController($location, $timeout, helperService, appConfig, apiService, authService) {
        var ELinkCtrl = this;
        var _queryString = $location.search();

        function Init() {
            ELinkCtrl.ePage = {
                "Title": "",
                "Prefix": "ELink",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            try {
                ELinkCtrl.ePage.Masters.IsLoading = true;
                ELinkCtrl.ePage.Masters.QueryString = _queryString;

                if (ELinkCtrl.ePage.Masters.QueryString.Id) {
                    AuthorizeUser();
                } else {
                    ELinkCtrl.ePage.Masters.IsLoading = false;
                }
            } catch (error) {
                console.log(error);
            }
        }

        function AuthorizeUser() {
            ELinkCtrl.ePage.Masters.ErrorMessage = undefined;
            var _input = {
                AuthTokenLink_PK: ELinkCtrl.ePage.Masters.QueryString.Id
            };
            apiService.post("authAPI", appConfig.Entities.Token.API.EmailLinkToken.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    if (response.data.Response) {
                        PrepareLocalStroageInfo(response.data.Response);
                    }
                } else {
                    ELinkCtrl.ePage.Masters.ErrorMessage = response.data.Response;
                    ELinkCtrl.ePage.Masters.IsLoading = false;

                    authService.setUserInfo();
                    $timeout(function () {
                        $location.path("/login").search({});
                    }, 2000);
                }
            });
        }

        function PrepareLocalStroageInfo($item) {
            var _userInfo = angular.copy($item),
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

            authService.setUserInfo(helperService.encryptData(_userInfo));

            $timeout(function(){
                GetPageVariables(_userInfo);
            });
        }

        function GetPageVariables(_userInfo) {
            apiService.get("authAPI", appConfig.Entities.AuthTokenLink.API.GetById.Url + ELinkCtrl.ePage.Masters.QueryString.Id).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    if (response.data.Response) {
                        var _pageValiables = response.data.Response.PageVariables;
                        var _filter = {};

                        if (_pageValiables) {
                            _pageValiables = JSON.parse(_pageValiables);
                            if (_pageValiables.length > 0) {
                                _pageValiables.map(function (value, key) {
                                    _filter[value.UIField] = value.Value;
                                });
                            }
                        }

                        var _isEmpty = angular.equals({}, _filter);
                        var _queryString = {
                            lpk: _userInfo.LoginPK,
                            tkn: _userInfo.AuthToken
                        };

                        if (!_isEmpty) {
                            _queryString.q = helperService.encryptData(_filter);
                        }

                        $location.path(_userInfo.InternalUrl).search(_queryString);
                    }
                } else {
                    ELinkCtrl.ePage.Masters.ErrorMessage = response.data.Response;

                    authService.setUserInfo();
                    $timeout(function () {
                        $location.path("/login").search({});
                    }, 2000);
                }

                ELinkCtrl.ePage.Masters.IsLoading = false;
            });
        }

        Init();
    }

})();
