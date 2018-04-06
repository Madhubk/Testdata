(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCHomeController", TCHomeController);

    TCHomeController.$inject = ["$location", "authService", "apiService", "helperService", "appConfig", "trustCenterConfig"];

    function TCHomeController($location, authService, apiService, helperService, appConfig, trustCenterConfig) {
        /* jshint validthis: true */
        var TCHomeCtrl = this;

        function Init() {
            TCHomeCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Home",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitHome();
        }

        // ========================Tenant Start========================

        function InitHome() {
            TCHomeCtrl.ePage.Masters.Home = {};
            TCHomeCtrl.ePage.Masters.Home.OnMenuClick = OnMenuClick;

            GetCfxMenuList();
        }

        function GetCfxMenuList() {
            TCHomeCtrl.ePage.Masters.Home.MenuList = undefined;
            var _filter = {
                "USR_UserName": authService.getUserInfo().UserId,
                "USR_SAP_FK": authService.getUserInfo().AppPK,
                "USR_TenantCode": authService.getUserInfo().TenantCode,
                "PageType": "Menu"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.FindAllMenuWise.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.FindAllMenuWise.Url, _input).then(function ApiCallback(response) {
                if (response.data.Response) {
                    TCHomeCtrl.ePage.Masters.Home.MenuList = response.data.Response;
                    TCHomeCtrl.ePage.Masters.Home.MenuList.map(function (value, key) {
                        value.OtherConfig = JSON.parse(value.OtherConfig);
                    });
                } else {
                    TCHomeCtrl.ePage.Masters.Home.MenuList = [];
                }
            });
        }

        function OnMenuClick($item) {
            var _queryString = {};
            if ($item.Code === "TC_MAIN_SYSTEM") {
                _queryString.Type = "System";
                _queryString.BreadcrumbTitle = "System";
                $location.path($item.Link + "/" + helperService.encryptData(_queryString));
            } else if ($item.Code === "TC_MAIN_CONFIGURATION") {
                _queryString.Type = "Configuration";
                _queryString.BreadcrumbTitle = "Configuration";
                $location.path($item.Link + "/" + helperService.encryptData(_queryString));
            } else {
                $location.path($item.Link);
            }
        }

        Init();
    }
})();
