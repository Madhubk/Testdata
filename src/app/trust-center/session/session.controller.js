(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SessionController", SessionController);

    SessionController.$inject = ["$location", "authService", "apiService", "helperService", "trustCenterConfig"];

    function SessionController($location, authService, apiService, helperService, trustCenterConfig) {
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
                    InitApplication();
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
                Code: "dashboard",
                Description: "Dashboard",
                Link: "TC/dashboard",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": SessionCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": SessionCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": SessionCtrl.ePage.Masters.QueryString.AppName
                },
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

        function InitApplication() {
            SessionCtrl.ePage.Masters.Application = {};
            SessionCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            SessionCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);

            if (!SessionCtrl.ePage.Masters.Application.ActiveApplication) {
                SessionCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": SessionCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": SessionCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": SessionCtrl.ePage.Masters.QueryString.AppName
                };
            }

            GetSessionList();
        }

        function InitSession() {
            SessionCtrl.ePage.Masters.Session = {};
            SessionCtrl.ePage.Masters.Session.Refresh = Refresh;
        }

        function Refresh(){
            GetSessionList();
        }

        function GetSessionList() {
            SessionCtrl.ePage.Masters.Session.SessionList = undefined;

            var _filter = {
                "SAP_FK": SessionCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecUserSession.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecUserSession.API.FindAll.Url, _input).then(function ApiCallback(response) {
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
