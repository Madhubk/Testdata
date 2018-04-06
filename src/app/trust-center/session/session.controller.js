(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SessionController", SessionController);

    SessionController.$inject = ["$location", "authService", "apiService", "helperService", "appConfig", "trustCenterConfig"];

    function SessionController($location, authService, apiService, helperService, appConfig, trustCenterConfig) {
        var SessionCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            SessionCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Session",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            SessionCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            SessionCtrl.ePage.Masters.emptyText = "-";

            try {
                SessionCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (SessionCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitSession();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            SessionCtrl.ePage.Masters.Breadcrumb = {};
            SessionCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            SessionCtrl.ePage.Masters.Breadcrumb.ListSource = [{
                Code: "home",
                Description: "Home",
                Link: "TC/home",
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "system",
                Description: "System",
                Link: "TC/dashboard/" + helperService.encryptData('{"Type":"System", "BreadcrumbTitle": "System"}'),
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "session",
                Description: "Session",
                Link: "#",
                IsRequireQueryString: false,
                IsActive: true
            }];
        }

        function OnBreadcrumbClick($item) {
            if (!$item.IsRequireQueryString && !$item.IsActive) {
                $location.path($item.Link);
            } else if ($item.IsRequireQueryString && !$item.IsActive) {
                $location.path($item.Link + "/" + helperService.encryptData($item.QueryStringObj));
            }
        }

        // ========================Breadcrumb End========================

        function InitSession() {
            SessionCtrl.ePage.Masters.Session = {};

            GetSessionList();
        }

        function GetSessionList() {
            SessionCtrl.ePage.Masters.Session.SessionList = undefined;

            var _filter = {
                "SAP_FK": SessionCtrl.ePage.Masters.QueryString.AppPk,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecUserSession.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.SecUserSession.API.FindAll.Url, _input).then(function ApiCallback(response) {
                if (response.data.Response) {
                    SessionCtrl.ePage.Masters.Session.SessionList = response.data.Response;
                } else {
                    SessionCtrl.ePage.Masters.Session.SessionList = [];
                }
            });
        }

        Init();
    }
})();
