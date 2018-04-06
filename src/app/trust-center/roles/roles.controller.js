(function () {
    "use strict";

    angular
        .module("Application")
        .controller("RolesController", RolesController);

    RolesController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "toastr", "confirmation", "$timeout"]

    function RolesController($scope, $location, $uibModal, authService, apiService, helperService, appConfig, APP_CONSTANT, toastr, confirmation, $timeout) {
        var RolesCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            RolesCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Roles",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            RolesCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            RolesCtrl.ePage.Masters.emptyText = "-";

            try {
                RolesCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (RolesCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitRole();
                    InitMenu();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            RolesCtrl.ePage.Masters.Breadcrumb = {};
            RolesCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = "";
            if (RolesCtrl.ePage.Masters.QueryString.BreadcrumbTitle) {
                _breadcrumbTitle = " (" + RolesCtrl.ePage.Masters.QueryString.BreadcrumbTitle + ")";
            }

            RolesCtrl.ePage.Masters.Breadcrumb.ListSource = [{
                Code: "home",
                Description: "Home",
                Link: "TC/home",
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "application",
                Description: "Application",
                Link: "TC/application",
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "roles",
                Description: "Roles " + _breadcrumbTitle,
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

        function InitRole() {
            RolesCtrl.ePage.Masters.Role = {};
            RolesCtrl.ePage.Masters.Role.ActiveRole = {};

            RolesCtrl.ePage.Masters.Role.Cancel = Cancel;
            RolesCtrl.ePage.Masters.Role.Save = Save;
            RolesCtrl.ePage.Masters.Role.Edit = Edit;
            RolesCtrl.ePage.Masters.Role.DeleteConfirmation = DeleteConfirmation;
            RolesCtrl.ePage.Masters.Role.Delete = Delete;
            RolesCtrl.ePage.Masters.Role.OnRoleClick = OnRoleClick;
            RolesCtrl.ePage.Masters.Role.AddNew = AddNew;
            RolesCtrl.ePage.Masters.Role.OnUserListClick = OnUserListClick;

            RolesCtrl.ePage.Masters.Role.SaveBtnText = "OK";
            RolesCtrl.ePage.Masters.Role.IsDisableSaveBtn = false;

            RolesCtrl.ePage.Masters.Role.DeleteBtnText = "Delete";
            RolesCtrl.ePage.Masters.Role.IsDisableDeleteBtn = false;

            GetRoleList();
            GetRedirectLinkList();
        }

        function GetRoleList() {
            var _filter = {
                "SAP_FK": RolesCtrl.ePage.Masters.QueryString.AppPk,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecRole.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.SecRole.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    RolesCtrl.ePage.Masters.Role.RoleList = response.data.Response;

                    if (RolesCtrl.ePage.Masters.Role.RoleList.length > 0) {
                        OnRoleClick(RolesCtrl.ePage.Masters.Role.RoleList[0]);
                    } else {
                        OnRoleClick();
                    }
                } else {
                    RolesCtrl.ePage.Masters.Role.RoleList = [];
                }
            });
        }

        function AddNew() {
            RolesCtrl.ePage.Masters.Role.ActiveRole = {};
            Edit();
        }

        function OnRoleClick($item) {
            RolesCtrl.ePage.Masters.Menu.DefaultMenu = undefined;
            RolesCtrl.ePage.Masters.Role.ActiveRole = angular.copy($item);
            RolesCtrl.ePage.Masters.Role.ActiveRoleCopy = angular.copy($item);

            GetMenuList();
        }

        // ---------------------------------------------
        function InitMenu() {
            RolesCtrl.ePage.Masters.Menu = {};
            RolesCtrl.ePage.Masters.Menu.ActiveMenu = {};

            RolesCtrl.ePage.Masters.Menu.OnMenuChange = OnMenuChange;
        }

        function GetMenuList() {
            RolesCtrl.ePage.Masters.Menu.ListSource = undefined;
            var _filter = {
                MappingCode: 'MENU_ROLE_APP_TNT',
                Access_FK: RolesCtrl.ePage.Masters.Role.ActiveRole.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecMappings.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.SecMappings.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    RolesCtrl.ePage.Masters.Menu.ListSource = response.data.Response;

                    if (RolesCtrl.ePage.Masters.Menu.ListSource.length > 0) {
                        GetMappedMenu();
                    }
                } else {
                    RolesCtrl.ePage.Masters.Menu.ListSource = [];
                }
            });
        }

        function GetMappedMenu() {
            var _filter = {
                MappingCode: 'HOME_MENU_ROLE_APP_TNT',
                Item_FK: RolesCtrl.ePage.Masters.Role.ActiveRole.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecMappings.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.SecMappings.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        RolesCtrl.ePage.Masters.Menu.DefaultMenu = response.data.Response[0];

                        var _index = RolesCtrl.ePage.Masters.Menu.ListSource.map(function (value, key) {
                            return value.ItemCode;
                        }).indexOf(RolesCtrl.ePage.Masters.Menu.DefaultMenu.AccessCode);

                        if (_index != -1) {
                            var _list = angular.copy(RolesCtrl.ePage.Masters.Menu.ListSource);
                            _list.splice(0, 0, _list.splice(_index, 1)[0]);

                            RolesCtrl.ePage.Masters.Menu.ListSource = _list;
                        }
                        
                        OnMenuChange(undefined, RolesCtrl.ePage.Masters.Menu.DefaultMenu);
                    }
                }
            });
        }

        function OnMenuChange($event, $item) {
            RolesCtrl.ePage.Masters.Menu.ActiveMenu = angular.copy($item);

            RolesCtrl.ePage.Masters.Menu.ListSource.map(function (value, key) {
                if (value.ItemCode == RolesCtrl.ePage.Masters.Menu.ActiveMenu.AccessCode) {
                    value.IsChecked = true;
                }
            });

            if ($event && RolesCtrl.ePage.Masters.Menu.ActiveMenu && !RolesCtrl.ePage.Masters.Menu.DefaultMenu) {
                SaveMenuRole();
            } else if ($event && RolesCtrl.ePage.Masters.Menu.ActiveMenu && RolesCtrl.ePage.Masters.Menu.DefaultMenu) {
                DeleteMenuRole();
            }
        }

        function SaveMenuRole() {
            var _input = {};
            _input.MappingCode = 'HOME_MENU_ROLE_APP_TNT';
            _input.AccessCode = RolesCtrl.ePage.Masters.Menu.ActiveMenu.ItemCode;
            _input.AccessTo = RolesCtrl.ePage.Masters.Menu.ActiveMenu.ItemName;
            _input.Access_FK = RolesCtrl.ePage.Masters.Menu.ActiveMenu.PK;
            _input.Item_FK = RolesCtrl.ePage.Masters.Role.ActiveRole.PK;
            _input.ItemName = "ROLE";
            _input.ItemCode = RolesCtrl.ePage.Masters.Role.ActiveRole.RoleName;
            _input.IsModified = true;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.TNT_FK = authService.getUserInfo().TenantPK;
            _input.SAP_Code = RolesCtrl.ePage.Masters.QueryString.AppCode;
            _input.SAP_FK = RolesCtrl.ePage.Masters.QueryString.AppPk;

            apiService.post("authAPI", appConfig.Entities.SecMappings.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        RolesCtrl.ePage.Masters.Menu.DefaultMenu = response.data.Response[0];

                        OnMenuChange(undefined, RolesCtrl.ePage.Masters.Menu.DefaultMenu);
                    }
                }
            });
        }

        function DeleteMenuRole() {
            var _input = angular.copy(RolesCtrl.ePage.Masters.Menu.DefaultMenu);
            _input.IsModified = true;
            _input.IsDeleted = true;

            apiService.post("authAPI", appConfig.Entities.SecMappings.API.Upsert.Url, [_input]).then(function (response) {
                RolesCtrl.ePage.Masters.Menu.DefaultMenu = undefined;
                SaveMenuRole();
            });
        }

        // ---------------------------------------------

        function EditModalInstance() {
            return RolesCtrl.ePage.Masters.Role.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'roleEdit'"></div>`
            });
        }

        function Edit() {
            RolesCtrl.ePage.Masters.Role.SaveBtnText = "OK";
            RolesCtrl.ePage.Masters.Role.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function Save() {
            RolesCtrl.ePage.Masters.Role.SaveBtnText = "Please Wait...";
            RolesCtrl.ePage.Masters.Role.IsDisableSaveBtn = true;

            RolesCtrl.ePage.Masters.Role.ActiveRole.SAP_FK = RolesCtrl.ePage.Masters.QueryString.AppPk;
            RolesCtrl.ePage.Masters.Role.ActiveRole.TenantCode = authService.getUserInfo().TenantCode;
            RolesCtrl.ePage.Masters.Role.ActiveRole.IsModified = true;
            RolesCtrl.ePage.Masters.Role.ActiveRole.IsDeleted = false;

            var _input = [RolesCtrl.ePage.Masters.Role.ActiveRole];

            apiService.post("authAPI", appConfig.Entities.SecRole.API.Upsert.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    RolesCtrl.ePage.Masters.Role.ActiveRole = angular.copy(_response);
                    var _index = RolesCtrl.ePage.Masters.Role.RoleList.map(function (e) {
                        return e.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        RolesCtrl.ePage.Masters.Role.RoleList.push(_response);
                    } else {
                        RolesCtrl.ePage.Masters.Role.RoleList[_index] = _response;
                    }

                    OnRoleClick(RolesCtrl.ePage.Masters.Role.ActiveRole);
                } else {
                    toastr.error("Could not Save...!");
                }

                RolesCtrl.ePage.Masters.Role.SaveBtnText = "OK";
                RolesCtrl.ePage.Masters.Role.IsDisableSaveBtn = false;
                RolesCtrl.ePage.Masters.Role.EditModal.dismiss('cancel');
            });
        }

        function Cancel() {
            if (!RolesCtrl.ePage.Masters.Role.ActiveRole) {
                if (RolesCtrl.ePage.Masters.Role.RoleList.length > 0) {
                    RolesCtrl.ePage.Masters.Role.ActiveRole = angular.copy(RolesCtrl.ePage.Masters.Role.RoleList[0]);
                } else {
                    RolesCtrl.ePage.Masters.Role.ActiveRole = undefined;
                }
            } else if (RolesCtrl.ePage.Masters.Role.ActiveRoleCopy) {
                var _index = RolesCtrl.ePage.Masters.Role.RoleList.map(function (value, key) {
                    return value.PK;
                }).indexOf(RolesCtrl.ePage.Masters.Role.ActiveRoleCopy.PK);

                if (_index !== -1) {
                    RolesCtrl.ePage.Masters.Role.ActiveRole = angular.copy(RolesCtrl.ePage.Masters.Role.RoleList[_index]);
                }
            }

            RolesCtrl.ePage.Masters.Role.EditModal.dismiss('cancel');
        }

        function DeleteConfirmation() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    Delete();
                }, function () {
                    console.log("Cancelled");
                });
        }

        function Delete() {
            RolesCtrl.ePage.Masters.Role.DeleteBtnText = "Please Wait...";
            RolesCtrl.ePage.Masters.Role.IsDisableDeleteBtn = true;

            RolesCtrl.ePage.Masters.Role.ActiveRole.IsModified = true;
            RolesCtrl.ePage.Masters.Role.ActiveRole.IsDeleted = true;

            var _input = [RolesCtrl.ePage.Masters.Role.ActiveRole];

            apiService.post("authAPI", appConfig.Entities.SecRole.API.Upsert.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = RolesCtrl.ePage.Masters.Role.RoleList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(RolesCtrl.ePage.Masters.Role.ActiveRole.PK);

                    if (_index !== -1) {
                        RolesCtrl.ePage.Masters.Role.RoleList.splice(_index, 1);
                        if (RolesCtrl.ePage.Masters.Role.RoleList.length > 0) {
                            RolesCtrl.ePage.Masters.Role.ActiveRole = angular.copy(RolesCtrl.ePage.Masters.Role.RoleList[0]);
                        } else {
                            OnRoleClick();
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                RolesCtrl.ePage.Masters.Role.DeleteBtnText = "Delete";
                RolesCtrl.ePage.Masters.Role.IsDisableDeleteBtn = false;
            });
        }

        function GetRedirectLinkList() {
            RolesCtrl.ePage.Masters.Role.RedirectPagetList = [{
                Code: "UserList",
                Description: "User List",
                Icon: "fa fa-user",
                Link: "#/TC/dynamic-list-view/UserProfile",
                Color: "#333333"
            }];
        }

        function OnUserListClick($item) {
            var _queryString = {
                USR_ROLES: RolesCtrl.ePage.Masters.Role.ActiveRole.RoleName
            };
            _queryString = helperService.encryptData(_queryString);
            window.open($item.Link + '?item=' + _queryString, "_blank");
        }

        Init();
    }
})();
