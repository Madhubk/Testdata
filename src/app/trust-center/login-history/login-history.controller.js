(function () {
    "use strict";

    angular
        .module("Application")
        .controller("LoginHistoryController", LoginHistoryController);

    LoginHistoryController.$inject = ["$location", "$timeout", "authService", "apiService", "helperService", "APP_CONSTANT", "trustCenterConfig"];

    function LoginHistoryController($location, $timeout, authService, apiService, helperService, APP_CONSTANT, trustCenterConfig) {
        /* jshint validthis: true */
        var LoginHistoryCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            LoginHistoryCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_LoginHistory",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            LoginHistoryCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            LoginHistoryCtrl.ePage.Masters.emptyText = "-";

            try {
                LoginHistoryCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (LoginHistoryCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitSessionActivity();
                    InitNLog();
                    InitElmaError();
                    InitLoginHistory();
                }
            } catch (error) {
                console.log(error)
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            LoginHistoryCtrl.ePage.Masters.Breadcrumb = {};
            LoginHistoryCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = "";
            if (LoginHistoryCtrl.ePage.Masters.QueryString.BreadcrumbTitle) {
                _breadcrumbTitle = " (" + LoginHistoryCtrl.ePage.Masters.QueryString.BreadcrumbTitle + ")";
            }

            LoginHistoryCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": LoginHistoryCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": LoginHistoryCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": LoginHistoryCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "user",
                Description: "User",
                Link: "TC/user-list",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": LoginHistoryCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": LoginHistoryCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": LoginHistoryCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "loginhistory",
                Description: "Login History" + _breadcrumbTitle,
                Link: "#",
                IsRequireQueryString: false,
                IsActive: true
            }];
        }

        function OnBreadcrumbClick($item) {
            if (!$item.IsRequireQueryString && !$item.IsActive) {
                $location.path($item.Link);
            } else if ($item.IsRequireQueryString && !$item.IsActive) {
                $location.path($item.Link + '/' + helperService.encryptData($item.QueryStringObj));
            }
        }

        // ========================Breadcrumb End========================

        // =========================================================================

        function InitLoginHistory() {
            LoginHistoryCtrl.ePage.Masters.LoginHistory = {};

            LoginHistoryCtrl.ePage.Masters.LoginHistory.DatePicker = {};
            LoginHistoryCtrl.ePage.Masters.LoginHistory.DatePicker.Options = APP_CONSTANT.DatePicker;
            LoginHistoryCtrl.ePage.Masters.LoginHistory.DatePicker.isOpen = [];
            LoginHistoryCtrl.ePage.Masters.LoginHistory.DatePicker.OpenDatePicker = OpenDatePicker;
            LoginHistoryCtrl.ePage.Masters.LoginHistory.DatePicker.OnDateChange = OnDateChange;

            LoginHistoryCtrl.ePage.Masters.LoginHistory.OnLoginHistoryClick = OnLoginHistoryClick;

            OnDateChange();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            LoginHistoryCtrl.ePage.Masters.LoginHistory.DatePicker.isOpen[opened] = true;
        }

        function OnDateChange($item) {
            if ($item) {
                LoginHistoryCtrl.ePage.Masters.ActiveDate = angular.copy($item);
            } else {
                LoginHistoryCtrl.ePage.Masters.ActiveDate = new Date().toISOString();
            }

            GetLoginHistoryList();
        }

        // =========================================================================

        function GetLoginHistoryList() {
            LoginHistoryCtrl.ePage.Masters.LoginHistory.ListSource = undefined;

            var _filter = {
                "PropertyName": "SLH_LastLoginDateTime",
                // "UserId": "A411AF8E-6E86-43EE-B739-B9CC36E654E2",
                // "DateTime": '2018-01-22 07:47:27.523',
                "UserId": LoginHistoryCtrl.ePage.Masters.QueryString.UserPK,
                "DateTime": LoginHistoryCtrl.ePage.Masters.ActiveDate,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecLoginHistory.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecLoginHistory.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    LoginHistoryCtrl.ePage.Masters.LoginHistory.ListSource = response.data.Response;

                    if (LoginHistoryCtrl.ePage.Masters.LoginHistory.ListSource.length > 0) {
                        OnLoginHistoryClick(LoginHistoryCtrl.ePage.Masters.LoginHistory.ListSource[0]);
                    } else {
                        OnLoginHistoryClick();
                        LoginHistoryCtrl.ePage.Masters.SessionActivity.GridData = [];
                        LoginHistoryCtrl.ePage.Masters.NLog.GridData = [];
                    }
                } else {
                    LoginHistoryCtrl.ePage.Masters.LoginHistory.ListSource = [];
                    LoginHistoryCtrl.ePage.Masters.SessionActivity.ListSource = [];
                    LoginHistoryCtrl.ePage.Masters.NLog.ListSource = [];
                    LoginHistoryCtrl.ePage.Masters.ElmahError.ListSource = [];
                    LoginHistoryCtrl.ePage.Masters.ActiveNLog = undefined;
                    LoginHistoryCtrl.ePage.Masters.IsElmaError = false;

                    GetSessionActivityDetails();
                    GetNLogDetails();
                }
            });
        }

        function OnLoginHistoryClick($item) {
            LoginHistoryCtrl.ePage.Masters.LoginHistory.ActiveLoginHistory = $item;

            if ($item) {
                LoginHistoryCtrl.ePage.Masters.ElmahError.ListSource = [];
                LoginHistoryCtrl.ePage.Masters.ActiveNLog = undefined;
                LoginHistoryCtrl.ePage.Masters.IsElmaError = false;

                GetSessionActivityList();
                GetNLogList();
            } else {
                LoginHistoryCtrl.ePage.Masters.SessionActivity.ListSource = [];
                LoginHistoryCtrl.ePage.Masters.NLog.ListSource = [];
                LoginHistoryCtrl.ePage.Masters.ElmahError.ListSource = [];
                LoginHistoryCtrl.ePage.Masters.ActiveNLog = undefined;
                LoginHistoryCtrl.ePage.Masters.IsElmaError = false;
                GetSessionActivityDetails();
                GetNLogDetails();
            }
        }

        // =========================================================================

        // =========================================================================

        function InitSessionActivity() {
            LoginHistoryCtrl.ePage.Masters.SessionActivity = {};

            // Grid for Session Activity
            LoginHistoryCtrl.ePage.Masters.SessionActivity.gridConfig = trustCenterConfig.Entities.SecSessionActivity.Grid.GridConfig;
            LoginHistoryCtrl.ePage.Masters.SessionActivity.gridConfig.columnDef = trustCenterConfig.Entities.SecSessionActivity.Grid.ColumnDef;
        }

        function GetSessionActivityList() {
            LoginHistoryCtrl.ePage.Masters.SessionActivity.GridData = undefined;
            var _filter = {
                "USN_FK": LoginHistoryCtrl.ePage.Masters.LoginHistory.ActiveLoginHistory.PK
                // "USN_FK": '6125C072-5977-4325-A67B-55C2685DBF2E'
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecSessionActivity.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecSessionActivity.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    LoginHistoryCtrl.ePage.Masters.SessionActivity.ListSource = response.data.Response;
                } else {
                    LoginHistoryCtrl.ePage.Masters.SessionActivity.ListSource = [];
                }

                GetSessionActivityDetails();
            });
        }

        function GetSessionActivityDetails() {
            LoginHistoryCtrl.ePage.Masters.SessionActivity.GridData = undefined;

            $timeout(function () {
                LoginHistoryCtrl.ePage.Masters.SessionActivity.GridData = LoginHistoryCtrl.ePage.Masters.SessionActivity.ListSource;
            });
        }

        // =========================================================================

        // =========================================================================

        function InitNLog() {
            LoginHistoryCtrl.ePage.Masters.NLog = {};
            LoginHistoryCtrl.ePage.Masters.NLog.SelectedNLog = SelectedNLog;

            //Grid for NLog
            LoginHistoryCtrl.ePage.Masters.NLog.gridConfig = trustCenterConfig.Entities.NLog.Grid.GridConfig;
            LoginHistoryCtrl.ePage.Masters.NLog.gridConfig.columnDef = trustCenterConfig.Entities.NLog.Grid.ColumnDef;
        }

        function GetNLogList() {
            LoginHistoryCtrl.ePage.Masters.NLog.GridData = undefined;
            var _filter = {
                "N_PK": LoginHistoryCtrl.ePage.Masters.LoginHistory.ActiveLoginHistory.PK
                // "N_PK": 'DBBA8C0D-A90A-4E58-9E2D-8A355F75B880'
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.NLog.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.NLog.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    LoginHistoryCtrl.ePage.Masters.NLog.ListSource = response.data.Response;
                } else {
                    LoginHistoryCtrl.ePage.Masters.NLog.ListSource = [];
                }

                GetNLogDetails();
            });
        }

        function GetNLogDetails() {
            LoginHistoryCtrl.ePage.Masters.NLog.GridData = undefined;

            $timeout(function () {
                LoginHistoryCtrl.ePage.Masters.NLog.GridData = LoginHistoryCtrl.ePage.Masters.NLog.ListSource;
            });
        }

        function SelectedNLog($item) {
            LoginHistoryCtrl.ePage.Masters.ActiveNLog = $item.data;
            if (LoginHistoryCtrl.ePage.Masters.ActiveNLog) {
                LoginHistoryCtrl.ePage.Masters.IsElmaError = true;
                GetElmahErrorList();
            }
        }

        // =========================================================================

        // =========================================================================

        function InitElmaError() {
            LoginHistoryCtrl.ePage.Masters.ElmahError = {};
            LoginHistoryCtrl.ePage.Masters.IsElmaError = false;

            //Grid for Elmah Error
            LoginHistoryCtrl.ePage.Masters.ElmahError.gridConfig = trustCenterConfig.Entities.ElmahError.Grid.GridConfig;
            LoginHistoryCtrl.ePage.Masters.ElmahError.gridConfig.columnDef = trustCenterConfig.Entities.ElmahError.Grid.ColumnDef;
        }

        function GetElmahErrorList() {
            LoginHistoryCtrl.ePage.Masters.ElmahError.GridData = undefined;
            var _filter = {
                "ErrorId": LoginHistoryCtrl.ePage.Masters.ActiveNLog.ErrorId
                // "ErrorId": "6229AF59-0558-465A-A9ED-6C7A42795048"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.ElmahError.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.ElmahError.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    LoginHistoryCtrl.ePage.Masters.ElmahError.ListSource = response.data.Response;
                } else {
                    LoginHistoryCtrl.ePage.Masters.ElmahError.ListSource = [];
                }
                GetElmahErrorDetails();
            });
        }

        function GetElmahErrorDetails() {
            LoginHistoryCtrl.ePage.Masters.ElmahError.GridData = undefined;

            $timeout(function () {
                LoginHistoryCtrl.ePage.Masters.ElmahError.GridData = LoginHistoryCtrl.ePage.Masters.ElmahError.ListSource;
            });
        }

        // =========================================================================

        Init();
    }
})();
