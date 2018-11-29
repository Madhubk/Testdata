(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCHomeController", TCHomeController);

    TCHomeController.$inject = ["$location", "authService", "apiService", "helperService", "trustCenterConfig"];

    function TCHomeController($location, authService, apiService, helperService, trustCenterConfig) {
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

        function InitHome() {
            TCHomeCtrl.ePage.Masters.Home = {};
            TCHomeCtrl.ePage.Masters.Home.OnMenuClick = OnMenuClick;

            GetCfxMenuList();
            InitTenant();
            InitApplication();
        }

        // region Menu
        function GetCfxMenuList() {
            TCHomeCtrl.ePage.Masters.Home.MenuList = authService.getUserInfo().Menus;
            if (TCHomeCtrl.ePage.Masters.Home.MenuList && TCHomeCtrl.ePage.Masters.Home.MenuList.length > 0) {
                TCHomeCtrl.ePage.Masters.Home.MenuList.map(function (value, key) {
                    if (value.OtherConfig && typeof value.OtherConfig == "string") {
                        value.OtherConfig = JSON.parse(value.OtherConfig);
                    }
                });
            }
        }

        function OnMenuClick($item) {
            $location.path($item.Link);
        }
        // endregion

        // region Tenant
        function InitTenant() {
            TCHomeCtrl.ePage.Masters.Tenant = {};

            TCHomeCtrl.ePage.Masters.Tenant.Logo = "assets/img/logo/product-logo-dummy.png";
            TCHomeCtrl.ePage.Masters.Tenant.TenantName = authService.getUserInfo().TenantName;
            TCHomeCtrl.ePage.Masters.Tenant.Description = authService.getUserInfo().TenantCode;

            GetTenantLogo();
        }

        function GetTenantLogo(){
            var _filter = {
                "EntitySource": "TNT_LOGO",
                "EntityRefKey": authService.getUserInfo().TenantPK,
                "EntityRefCode": authService.getUserInfo().TenantCode
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecLogo.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.SecLogo.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TCHomeCtrl.ePage.Masters.Tenant.Logo = response.data.Response[0].Logo;
                    }
                }
            });
        }
        // endregion

        // region Application
        function InitApplication() {
            TCHomeCtrl.ePage.Masters.Applications = {};
            TCHomeCtrl.ePage.Masters.Applications.OnApplicationClick = OnApplicationClick;
            GetApplicationList();
        }

        function GetApplicationList() {
            var _filter = {
                "USR_FK": authService.getUserInfo().UserPK,
                "PageSize": 100,
                "PageNumber": 1,
                "SortColumn": "SAP_AppCode",
                "SortType": "ASC"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecApp.API.FindAllAccess.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecApp.API.FindAllAccess.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCHomeCtrl.ePage.Masters.Applications.ApplicationList = response.data.Response;
                    trustCenterConfig.Entities.ApplicationList = angular.copy(response.data.Response);
                } else {
                    TCHomeCtrl.ePage.Masters.Applications.ApplicationList = [];
                }
            });
        }

        function OnApplicationClick($item) {
            TCHomeCtrl.ePage.Masters.Applications.ActiveApplication = $item;

            var _queryString = {
                "AppPk": TCHomeCtrl.ePage.Masters.Applications.ActiveApplication.PK,
                "AppCode": TCHomeCtrl.ePage.Masters.Applications.ActiveApplication.AppCode,
                "AppName": TCHomeCtrl.ePage.Masters.Applications.ActiveApplication.AppName,
            };

            $location.path("TC/dashboard/" + helperService.encryptData(_queryString));
        }
        // endregion

        Init();
    }
})();
