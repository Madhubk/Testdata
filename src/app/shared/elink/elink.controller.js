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

                ELinkCtrl.ePage.Masters.QueryString.Id ? AuthorizeUser() : ELinkCtrl.ePage.Masters.IsLoading = false;
            } catch (error) {
                console.log(error);
            }
        }

        function AuthorizeUser() {            
            ELinkCtrl.ePage.Masters.ErrorMessage = undefined;
            let _input = {
                AuthTokenLink_PK: ELinkCtrl.ePage.Masters.QueryString.Id
            };
            apiService.post("authAPI", appConfig.Entities.Token.API.EmailLinkToken.Url, _input).then(response => {
                if (response.data.Status == "Success" && response.data.Response) {
                    PrepareLocalStroageInfo(response.data.Response);
                } else {
                    ELinkCtrl.ePage.Masters.ErrorMessage = response.data.Response;
                    ELinkCtrl.ePage.Masters.IsLoading = false;

                    authService.setUserInfo();
                    $timeout(() => $location.path("/login").search({}), 2000);
                }
            });
        }

        function PrepareLocalStroageInfo($item) {
            let _userInfo = angular.copy($item),
                _keys = ["Menus", "AccessMenus", "Logo", "Parties"];

            _keys.map(value => _userInfo[value] = (_userInfo[value]) ? JSON.parse(_userInfo[value]) : (_userInfo[value]));

            if (!_userInfo.MenuType) {
                _userInfo.MenuType = "List";
            }

            if (_userInfo.AppCode == "TC") {
                _userInfo.MenuType = "Grid";
            }

            if ((_userInfo.HomeMenu && _userInfo.HomeMenu.PK) && (_userInfo.AccessMenus && _userInfo.AccessMenus.length > 0)) {
                let _index = _userInfo.AccessMenus.findIndex(value => value.Id === _userInfo.HomeMenu.PK);

                if (_index != -1) {
                    _userInfo.InternalUrl = _userInfo.AccessMenus[_index].Link;
                }
            }

            if (_userInfo.RolePK && _userInfo.PartyPK && _userInfo.Parties && _userInfo.Parties.length > 0) {
                _userInfo.Parties.map(value => {
                    if (value.PK === _userInfo.PartyPK) {
                        _userInfo.Roles = value.Roles;
                    }
                });
            }

            authService.setUserInfo(helperService.encryptData(_userInfo));

            $timeout(() => GetPageVariables(_userInfo));
        }

        function GetPageVariables(_userInfo) {
            apiService.get("authAPI", appConfig.Entities.AuthTokenLink.API.GetById.Url + ELinkCtrl.ePage.Masters.QueryString.Id).then(response => {
                if (response.data.Status == "Success" && response.data.Response) {
                    let _pageValiables = response.data.Response.PageVariables;
                    let _queryString = {
                        lpk: _userInfo.LoginPK,
                        tkn: _userInfo.AuthToken
                    };

                    if (_pageValiables) {
                        _queryString.q = helperService.encryptData(_pageValiables);
                    }

                    $location.path(_userInfo.InternalUrl).search(_queryString);
                } else {
                    ELinkCtrl.ePage.Masters.ErrorMessage = response.data.Response;

                    authService.setUserInfo();
                    $timeout(() => $location.path("/login").search({}), 2000);
                }

                ELinkCtrl.ePage.Masters.IsLoading = false;
            });
        }

        Init();
    }

})();
