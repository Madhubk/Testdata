(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCUserListController", TCUserListController);

    TCUserListController.$inject = ["$location", "$timeout", "authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "toastr", "confirmation"];

    function TCUserListController($location, $timeout, authService, apiService, helperService, appConfig, APP_CONSTANT, toastr, confirmation) {
        /* jshint validthis: true */
        var TCUserListCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCUserListCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_UserList",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TCUserListCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            TCUserListCtrl.ePage.Masters.emptyText = "-";

            try {
                TCUserListCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (TCUserListCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitSortAlphabets();
                }
            } catch (error) {
                console.log(error)
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            TCUserListCtrl.ePage.Masters.Breadcrumb = {};
            TCUserListCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCUserListCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                Code: "user",
                Description: "User",
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

        function InitSortAlphabets() {
            TCUserListCtrl.ePage.Masters.Sort = {};
            TCUserListCtrl.ePage.Masters.Sort.OnAlphabetClick = OnAlphabetClick;
            TCUserListCtrl.ePage.Masters.Sort.Alphabets = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

            OnAlphabetClick(TCUserListCtrl.ePage.Masters.Sort.Alphabets[0]);
        }

        function OnAlphabetClick($item) {
            TCUserListCtrl.ePage.Masters.Sort.ActiveAlphabet = $item;
            TCUserListCtrl.ePage.Masters.Search = "";
            InitUserList();
        }

        // ========================UserList Start========================

        function InitUserList() {
            TCUserListCtrl.ePage.Masters.UserList = {};
            TCUserListCtrl.ePage.Masters.UserList.ActiveUserList = {};
            TCUserListCtrl.ePage.Masters.UserList.Search = SearchUser;

            TCUserListCtrl.ePage.Masters.UserList.OnUserListClick = OnUserListClick;
            TCUserListCtrl.ePage.Masters.UserList.OnRedirectListClick = OnRedirectListClick;

            GetRedirectPageList();
            GetUserList();
        }

        function GetUserList() {
            var _filter = {
                "TenantCode": authService.getUserInfo().TenantCode,
                "DisplayName": TCUserListCtrl.ePage.Masters.Sort.ActiveAlphabet
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserExtended.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.UserExtended.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCUserListCtrl.ePage.Masters.UserList.ListSource = response.data.Response;

                    if (TCUserListCtrl.ePage.Masters.UserList.ListSource.length > 0) {
                        OnUserListClick(TCUserListCtrl.ePage.Masters.UserList.ListSource[0]);
                    } else {
                        OnUserListClick();
                    }
                } else {
                    TCUserListCtrl.ePage.Masters.UserList.ListSource = [];
                }
            });
        }

        function OnUserListClick($item) {
            TCUserListCtrl.ePage.Masters.UserList.ActiveUserList = angular.copy($item);

            if ($item) {
                if (!TCUserListCtrl.ePage.Masters.UserList.ActiveUserList.LogoStr) {
                    GetLogo();
                }
            }
        }

        function GetLogo() {
            var _filter = {
                "EntityRefKey": TCUserListCtrl.ePage.Masters.UserList.ActiveUserList.Id,
                "EntitySource": "USR"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        if (TCUserListCtrl.ePage.Masters.UserList.ActiveUserList) {
                            TCUserListCtrl.ePage.Masters.UserList.ActiveUserList.JobDocument = response.data.Response;
                            DownloadDocument(response.data.Response[0]);
                        }
                    }
                } else {
                    console.log("Empty response");
                }
            });
        }

        function DownloadDocument(curDoc) {
            apiService.get("eAxisAPI", appConfig.Entities.JobDocument.API.JobDocumentDownload.Url + curDoc.PK + "/" + authService.getUserInfo().AppPK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        if (TCUserListCtrl.ePage.Masters.UserList.ActiveUserList) {
                            TCUserListCtrl.ePage.Masters.UserList.ActiveUserList.LogoStr = "data:image/jpeg;base64," + response.data.Response.Base64str;
                        }
                    }
                } else {
                    console.log("Invalid response");
                }
            });
        }

        function GetRedirectPageList() {
            TCUserListCtrl.ePage.Masters.UserList.RedirecPagetList = [{
                Code: "AssignRoles",
                Description: "Assign Roles",
                Icon: "glyphicons glyphicons-user-structure",
                Link: "TC/mapping-vertical",
                Color: "#36ad97",
                AdditionalData: "USER_ROLE_APP_TNT",
                BreadcrumbTitle: "User Role - USER_ROLE_APP_TNT",
                Type: 1
            }, {
                Code: "Company",
                Description: "Company",
                Icon: "fa fa-building-o",
                Link: "TC/mapping-horizontal",
                Color: "#eba4a6",
                AdditionalData: "USER_CMP_BRAN_ORG_WH_DEPT_APP_TNT",
                BreadcrumbTitle: "User Company Branch Organization Warehouse Deparmant - USER_CMP_BRAN_ORG_WH_DEPT_APP_TNT",
                Type: 1
            }, {
                Code: "Warehouse",
                Description: "Warehouse",
                Icon: "glyphicons glyphicons-home",
                Link: "TC/mapping-horizontal",
                Color: "#01532f",
                AdditionalData: "USER_CMP_BRAN_WH",
                BreadcrumbTitle: "User Company Branch Warehouse - USER_CMP_BRAN_WH",
                Type: 1
            }, {
                Code: "Organization",
                Description: "Organization",
                Icon: "glyphicons glyphicons-home",
                Link: "TC/mapping-horizontal",
                Color: "#01532f",
                AdditionalData: "USER_ORG_APP_TNT",
                BreadcrumbTitle: "User Organization - USER_ORG_APP_TNT",
                Type: 1
            }, {
                Code: "Starred",
                Description: "My Items",
                Icon: "glyphicons glyphicons-more-items",
                Link: "TC/user-settings",
                Color: "#33a0d3",
                AdditionalData: "STARRED",
                BreadcrumbTitle: "My Items",
                Type: 2
            }, {
                Code: "Favorites",
                Description: "Favorites Filters",
                Icon: "glyphicons glyphicons-star",
                Link: "TC/user-settings",
                Color: "#f3a175",
                AdditionalData: "FAVORITES",
                BreadcrumbTitle: "Favorites Filters",
                Type: 2
            }, {
                Code: "FilterDislike",
                Description: "Customise the Filter By Columns",
                Icon: "glyphicons glyphicons-filter",
                Link: "TC/user-settings",
                Color: "#e54901",
                AdditionalData: "FILTERDISLIKE",
                BreadcrumbTitle: "Customise the Filter By Columns",
                Type: 2
            }, {
                Code: "Shortcut",
                Description: "Show Filter in Filter bar",
                Icon: "glyphicons glyphicons-eye-open",
                Link: "TC/user-settings",
                Color: "#fbad19",
                AdditionalData: "SHORTCUT",
                BreadcrumbTitle: "Show Filter in Filter bar",
                Type: 2
            }, {
                Code: "LoginHistory",
                Description: "Login History",
                Icon: "glyphicons glyphicons-microphone",
                Link: "TC/login-history",
                Color: "#3b210e",
                Type: 3
            }];
        }

        function OnRedirectListClick($item) {
            var _queryString = {
                "AppPk": TCUserListCtrl.ePage.Masters.QueryString.AppPk,
                "AppCode": TCUserListCtrl.ePage.Masters.QueryString.AppCode,
                "AppName": TCUserListCtrl.ePage.Masters.QueryString.AppName
            };

            if ($item.Type == 1) {
                _queryString.ItemName = "USER";
                _queryString.MappingCode = $item.AdditionalData;
                _queryString.DisplayName = TCUserListCtrl.ePage.Masters.UserList.ActiveUserList.DisplayName;
                _queryString.ItemPk = TCUserListCtrl.ePage.Masters.UserList.ActiveUserList.Id;
                _queryString.ItemCode = TCUserListCtrl.ePage.Masters.UserList.ActiveUserList.UserName;
                _queryString.BreadcrumbTitle = $item.BreadcrumbTitle;
            } else if ($item.Type == 2) {
                _queryString.ItemName = $item.AdditionalData;
                _queryString.UserName = TCUserListCtrl.ePage.Masters.UserList.ActiveUserList.UserName;
                _queryString.BreadcrumbTitle = $item.BreadcrumbTitle;
            } else if ($item.Type == 3) {
                _queryString.UserPK = TCUserListCtrl.ePage.Masters.UserList.ActiveUserList.Id;
                _queryString.BreadcrumbTitle = TCUserListCtrl.ePage.Masters.UserList.ActiveUserList.DisplayName;
            }

            if ($item.Link !== "#") {
                $location.path($item.Link + "/" + helperService.encryptData(_queryString));
            }
        }

        function SearchUser() {
            TCUserListCtrl.ePage.Masters.Sort.ActiveAlphabet = TCUserListCtrl.ePage.Masters.Search;
            GetUserList();
        }

        // ========================UserList End========================

        Init();
    }
})();
