(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCDashboardController", TCDashboardController);

    TCDashboardController.$inject = ["$location", "authService", "apiService", "helperService", "appConfig", "trustCenterConfig"];

    function TCDashboardController($location, authService, apiService, helperService, appConfig, trustCenterConfig) {
        /* jshint validthis: true */
        var TCDashboardCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TCDashboardCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            TCDashboardCtrl.ePage.Masters.ProductLogo = authService.getUserInfo().ProductLogo;
            TCDashboardCtrl.ePage.Masters.DummyLogo = "assets/img/logo/product-logo-dummy.png";

            try {
                TCDashboardCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (TCDashboardCtrl.ePage.Masters.QueryString.Type) {
                    InitBreadcrumb();
                    InitTenant();
                    InitApplications();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            TCDashboardCtrl.ePage.Masters.Breadcrumb = {};
            TCDashboardCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCDashboardCtrl.ePage.Masters.Breadcrumb.ListSource = [{
                Code: "home",
                Description: "Home",
                Link: "TC/home",
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "dashboard",
                Description: TCDashboardCtrl.ePage.Masters.QueryString.BreadcrumbTitle,
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

        // ========================Tenant Start========================

        function InitTenant() {
            TCDashboardCtrl.ePage.Masters.Tenant = {};
            TCDashboardCtrl.ePage.Masters.Tenant.ActiveTenant = {};
            TCDashboardCtrl.ePage.Masters.Tenant.ActiveTenant.TenantName = authService.getUserInfo().TenantName;

            GetTenantDetails();
        }

        function GetTenantDetails() {
            var _filter = {
                "pageSize": 100,
                "currentPage": 1,
                "SortColumn": "TenantCode",
                "SortType": "desc",
                "PK": authService.getUserInfo().TenantPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecTenant.API.MasterFindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.SecTenant.API.MasterFindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TCDashboardCtrl.ePage.Masters.Tenant.ActiveTenant = response.data.Response[0];
                    }
                }
            });
        }

        // ========================Tenant End========================

        // ========================Application Start========================

        function InitApplications() {
            TCDashboardCtrl.ePage.Masters.Applications = {};

            TCDashboardCtrl.ePage.Masters.Applications.OnApplicationClick = OnApplicationClick;
            TCDashboardCtrl.ePage.Masters.Applications.OnConfigurationAndDynamicPageClick = OnConfigurationAndDynamicPageClick;

            GetApplicationList();
            ConfigurationPageList();
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
                "FilterID": appConfig.Entities.SecApp.API.FindAllAccess.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.SecApp.API.FindAllAccess.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCDashboardCtrl.ePage.Masters.Applications.ApplicationList = response.data.Response;

                    if (TCDashboardCtrl.ePage.Masters.Applications.ApplicationList.length > 0) {
                        OnApplicationClick(TCDashboardCtrl.ePage.Masters.Applications.ApplicationList[0]);
                    }
                } else {
                    TCDashboardCtrl.ePage.Masters.Applications.ApplicationList = [];
                }
            });
        }

        function OnApplicationClick($item) {
            TCDashboardCtrl.ePage.Masters.Applications.ActiveApplication = $item;

            if (!TCDashboardCtrl.ePage.Masters.Applications.ActiveApplication.LogoStr) {
                GetLogo();
            }
        }

        function ConfigurationPageList() {
            TCDashboardCtrl.ePage.Masters.Applications.RedirectPageList = trustCenterConfig.Entities.DashboardPageLink[TCDashboardCtrl.ePage.Masters.QueryString.Type];
        }

        function OnConfigurationAndDynamicPageClick($item) {
            var _queryString = {
                "AppPk": TCDashboardCtrl.ePage.Masters.Applications.ActiveApplication.PK,
                "AppCode": TCDashboardCtrl.ePage.Masters.Applications.ActiveApplication.AppCode,
                "AppName": TCDashboardCtrl.ePage.Masters.Applications.ActiveApplication.AppName
            };

            if ($item.Type == "ConfigType") {
                _queryString.ConfigType = $item.AdditionalData;
                _queryString.BreadcrumbTitle = $item.Description;
            } else if ($item.Type == "EntitySource") {
                _queryString.EntitySource = $item.AdditionalData;
                _queryString.BreadcrumbTitle = $item.Description;
                _queryString.Type = "Type1";
            }

            if ($item.Link !== "#") {
                $location.path($item.Link + "/" + helperService.encryptData(_queryString));
            }
        }

        // ========================Appliation End========================

        function GetLogo() {
            var _filter = {
                EntityRefKey: TCDashboardCtrl.ePage.Masters.Applications.ActiveApplication.PK,
                EntitySource: "SAP"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + TCDashboardCtrl.ePage.Masters.Applications.ActiveApplication.PK, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        DownloadDocument(response.data.Response[0]);
                    }
                }
            });
        }

        function DownloadDocument(curDoc) {
            apiService.get("eAxisAPI", appConfig.Entities.JobDocument.API.JobDocumentDownload.Url + curDoc.PK + "/" + TCDashboardCtrl.ePage.Masters.Applications.ActiveApplication.PK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        TCDashboardCtrl.ePage.Masters.Applications.ActiveApplication.LogoStr = "data:image/jpeg;base64," + response.data.Response.Base64str;
                    }
                }
            });
        }

        Init();
    }
})();