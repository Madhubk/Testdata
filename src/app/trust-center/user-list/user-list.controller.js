(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCUserListController", TCUserListController);

    TCUserListController.$inject = ["$scope", "$location", "$timeout", "authService", "apiService", "helperService", "trustCenterConfig", "$uibModal"];

    function TCUserListController($scope, $location, $timeout, authService, apiService, helperService, trustCenterConfig, $uibModal) {
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
                    InitApplication();
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
                Code: "dashboard",
                Description: "Dashboard",
                Link: "TC/dashboard",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": TCUserListCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCUserListCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCUserListCtrl.ePage.Masters.QueryString.AppName
                },
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

        // ========================Alphabetic End========================

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

        // ========================Application Start========================

        function InitApplication() {
            TCUserListCtrl.ePage.Masters.Application = {};
            TCUserListCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            TCUserListCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);
            if (!TCUserListCtrl.ePage.Masters.Application.ActiveApplication) {
                TCUserListCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": TCUserListCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCUserListCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCUserListCtrl.ePage.Masters.QueryString.AppName
                };
            }
        }

        // ========================UserList Start========================

        function InitUserList() {
            TCUserListCtrl.ePage.Masters.UserList = {};
            TCUserListCtrl.ePage.Masters.UserList.ActiveUserList = {};
            TCUserListCtrl.ePage.Masters.UserList.Search = SearchUser;

            TCUserListCtrl.ePage.Masters.UserList.OnUserListClick = OnUserListClick;
            TCUserListCtrl.ePage.Masters.UserList.OnRedirectListClick = OnRedirectListClick;

            TCUserListCtrl.ePage.Masters.UserList.RePublishUser = RePublishUser;
            TCUserListCtrl.ePage.Masters.UserList.RepublishUserModalCancel = RepublishUserModalCancel;
            TCUserListCtrl.ePage.Masters.UserList.CheckUIControl = CheckUIControl;

            if (TCUserListCtrl.ePage.Masters.ActiveApplication == "EA") {
                OnApplicationChange();
            }

            GetRedirectPageList();
            GetUIControlList();
            GetUserList();
        }

        function GetUIControlList() {
            TCUserListCtrl.ePage.Masters.UserList.UIControlList = undefined;
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "USR_FK": authService.getUserInfo().UserPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CompUserRoleAccess.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.CompUserRoleAccess.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;
                    var _controlList = [];
                    if (_response.length > 0) {
                        _response.map(function (value, key) {
                            if (value.SOP_Code) {
                                _controlList.push(value.SOP_Code);
                            }
                        });
                    }
                    TCUserListCtrl.ePage.Masters.UserList.UIControlList = _controlList;
                } else {
                    TCUserListCtrl.ePage.Masters.UserList.UIControlList = [];
                }
            });
        }

        function CheckUIControl(controlId) {
            return helperService.checkUIControl(TCUserListCtrl.ePage.Masters.UserList.UIControlList, controlId);
        }

        function GetUserList() {
            var _filter = {
                "TenantCode": authService.getUserInfo().TenantCode,
                "DisplayName": TCUserListCtrl.ePage.Masters.Sort.ActiveAlphabet
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.UserExtended.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.UserExtended.API.FindAll.Url, _input).then(function SuccessCallback(response) {
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
        }

        function GetRedirectPageList() {
            if (TCUserListCtrl.ePage.Masters.ActiveApplication == "EA") {
                TCUserListCtrl.ePage.Masters.UserList.RedirecPagetList = [{
                    Code: "AssignRoles",
                    Description: "Assign Roles",
                    Icon: "glyphicons glyphicons-user-structure",
                    Link: "EA/admin/user-role-app-tenant",
                    Color: "#36ad97",
                    AdditionalData: "USER_ROLE_APP_TNT",
                    BreadcrumbTitle: "User Role - USER_ROLE_APP_TNT",
                    Type: 1
                }, {
                    Code: "Warehouse",
                    Description: "Warehouse",
                    Icon: "glyphicons glyphicons-home",
                    Link: "EA/admin/user-warehouse-app-tenant",
                    Color: "#01532f",
                    AdditionalData: "USER_CMP_BRAN_WH_APP_TNT",
                    BreadcrumbTitle: "User Company Branch Warehouse - USER_CMP_BRAN_WH_APP_TNT",
                    Type: 1
                }, {
                    Code: "Organization",
                    Description: "Organization",
                    Icon: "fa fa-building-o",
                    Link: "EA/admin/user-organization-app-tenant",
                    Color: "#eba4a6",
                    AdditionalData: "USER_ORG_ROLE_APP_TNT",
                    BreadcrumbTitle: "User Organization - USER_ORG_ROLE_APP_TNT",
                    Type: 1
                }];
            } else {
                TCUserListCtrl.ePage.Masters.UserList.RedirecPagetList = [{
                    Code: "AssignRoles",
                    Description: "Assign Roles",
                    Icon: "glyphicons glyphicons-user-structure",
                    Link: "TC/user-role-app-tenant",
                    Color: "#36ad97",
                    Type: 1
                }, {
                    Code: "Company",
                    Description: "Company",
                    Icon: "fa fa-building-o",
                    Link: "TC/user-cmp-app-tenant",
                    Color: "#eba4a6",
                    Type: 1
                }, {
                    Code: "Warehouse",
                    Description: "Warehouse",
                    Icon: "glyphicons glyphicons-home",
                    Link: "TC/user-warehouse-app-tenant",
                    Color: "#01532f",
                    Type: 1
                }, {
                    Code: "Organization",
                    Description: "Organization",
                    Icon: "fa fa-building-o",
                    Link: "TC/user-organization-app-tenant",
                    Color: "#eba4a6",
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
                }, {
                    Code: "TenantUserSettings",
                    Description: "Tenant User Settings",
                    Icon: "glyphicon glyphicon-cog",
                    Link: "TC/tenant-user-settings",
                    Color: "#36ad97",
                    Type: 3
                }];
            }
        }

        function OnRedirectListClick($item) {
            var _queryString = {
                "AppPk": TCUserListCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "AppCode": TCUserListCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                "AppName": TCUserListCtrl.ePage.Masters.Application.ActiveApplication.AppName
            };

            if ($item.Type == 1) {
                _queryString.DisplayName = TCUserListCtrl.ePage.Masters.UserList.ActiveUserList.DisplayName;
                _queryString.ItemPk = TCUserListCtrl.ePage.Masters.UserList.ActiveUserList.Id;
                _queryString.ItemCode = TCUserListCtrl.ePage.Masters.UserList.ActiveUserList.UserName;

            } else if ($item.Type == 2) {
                _queryString.ItemName = $item.AdditionalData;
                _queryString.UserName = TCUserListCtrl.ePage.Masters.UserList.ActiveUserList.UserName;
                _queryString.BreadcrumbTitle = $item.BreadcrumbTitle + " - " + TCUserListCtrl.ePage.Masters.UserList.ActiveUserList.DisplayName;
            } else if ($item.Type == 3) {
                _queryString.UserPK = TCUserListCtrl.ePage.Masters.UserList.ActiveUserList.Id;
                _queryString.BreadcrumbTitle = TCUserListCtrl.ePage.Masters.UserList.ActiveUserList.DisplayName;
                _queryString.UserId = TCUserListCtrl.ePage.Masters.UserList.ActiveUserList.UserName;
            } else if ($item.Type == 4) {
                _queryString.UserId = TCUserListCtrl.ePage.Masters.UserList.ActiveUserList.UserName;
            }

            if ($item.Link !== "#") {
                if ($item.Type == 4) {
                    $location.path($item.Link).search("q", helperService.encryptData(_queryString));
                } else {
                    $location.path($item.Link + "/" + helperService.encryptData(_queryString));
                }
            }
        }

        function SearchUser() {
            TCUserListCtrl.ePage.Masters.Sort.ActiveAlphabet = TCUserListCtrl.ePage.Masters.Search;
            GetUserList();
        }

        function RePublishUser($item) {
            EditRepublishUserModalInstance($item).result.then(function (response) {}, function () {
                RepublishUserModalCancel();
            });
        }

        function GetRepublishAccessList($item) {
            TCUserListCtrl.ePage.Masters.UserList.RePublishAccess = undefined;
            var _input = {
                "AppCode": TCUserListCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                "TNTCode": authService.getUserInfo().TenantCode,
                "userName": $item.UserName
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.UserPrivileges.API.PublishPrivilegesByUser.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;

                    if (_response.Images) {
                        _response.Images = JSON.parse(_response.Images);
                    }
                    if (_response.Value1) {
                        _response.Value1 = JSON.parse(_response.Value1);
                    }
                    if (_response.Value2) {
                        _response.Value2 = JSON.parse(_response.Value2);
                    }
                    if (_response.Value3) {
                        _response.Value3 = JSON.parse(_response.Value3);
                    }

                    _response = JSON.stringify(_response, undefined, 2);

                    TCUserListCtrl.ePage.Masters.UserList.RePublishAccess = _response;
                } else {
                    TCUserListCtrl.ePage.Masters.UserList.RePublishAccess = "Error...!";
                }
            });
        }

        function EditRepublishUserModalInstance($item) {
            $timeout(function () {
                GetRepublishAccessList($item);
            });

            return TCUserListCtrl.ePage.Masters.UserList.EditRepublishUserModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'RepublishUserEdit'"></div>`
            });
        }

        function RepublishUserModalCancel() {
            TCUserListCtrl.ePage.Masters.UserList.EditRepublishUserModal.dismiss('cancel');
        }

        // ========================UserList End========================

        Init();
    }
})();
