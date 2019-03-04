(function () {
    "use strict";

    angular
        .module("Application")
        .controller("RolesController", RolesController);

    RolesController.$inject = ["$scope", "$location", "$timeout", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "trustCenterConfig"]

    function RolesController($scope, $location, $timeout, $uibModal, authService, apiService, helperService, toastr, confirmation, trustCenterConfig) {
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
                    // InitParties();
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
                Code: "parties",
                Description: "Parties",
                Link: "TC/parties",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": RolesCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": RolesCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": RolesCtrl.ePage.Masters.QueryString.AppName
                },
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

            RolesCtrl.ePage.Masters.Role.AddNew = AddNew;
            RolesCtrl.ePage.Masters.Role.Edit = Edit;
            RolesCtrl.ePage.Masters.Role.Cancel = Cancel;
            RolesCtrl.ePage.Masters.Role.Save = Save;
            RolesCtrl.ePage.Masters.Role.Delete = DeleteConfirmation;
            RolesCtrl.ePage.Masters.Role.OnRoleClick = OnRoleClick;
            RolesCtrl.ePage.Masters.Role.OnRedirectLinkClick = OnRedirectLinkClick;

            RolesCtrl.ePage.Masters.Role.OnAppTenantPublishClick = OnAppTenantPublishClick;
            RolesCtrl.ePage.Masters.Role.AppTenantCancel = AppTenantCancel;

            RolesCtrl.ePage.Masters.Role.SaveBtnText = "OK";
            RolesCtrl.ePage.Masters.Role.IsDisableSaveBtn = false;

            RolesCtrl.ePage.Masters.Role.DeleteBtnText = "Delete";
            RolesCtrl.ePage.Masters.Role.IsDisableDeleteBtn = false;

            GetRoleList();
            GetRedirectLinkList();
        }

        function GetRoleList() {
            RolesCtrl.ePage.Masters.Role.ListSource = undefined;
            var _filter = {
                "SAP_FK": RolesCtrl.ePage.Masters.QueryString.AppPk,
                "Party_FK": RolesCtrl.ePage.Masters.QueryString.Party.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecRole.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecRole.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    RolesCtrl.ePage.Masters.Role.ListSource = response.data.Response;

                    if (RolesCtrl.ePage.Masters.Role.ListSource.length > 0) {
                        OnRoleClick(RolesCtrl.ePage.Masters.Role.ListSource[0]);
                    } else {
                        OnRoleClick();
                    }
                } else {
                    RolesCtrl.ePage.Masters.Role.ListSource = [];
                }
            });
        }

        function OnRoleClick($item) {
            RolesCtrl.ePage.Masters.Menu.DefaultMenu = undefined;
            RolesCtrl.ePage.Masters.Role.ActiveRole = angular.copy($item);
            RolesCtrl.ePage.Masters.Role.ActiveRoleCopy = angular.copy($item);

            if (RolesCtrl.ePage.Masters.Role.ActiveRole) {
                RolesCtrl.ePage.Masters.GenerateScriptInput = {
                    ObjectName: "SecRole",
                    ObjectId: RolesCtrl.ePage.Masters.Role.ActiveRole.PK
                };
                RolesCtrl.ePage.Masters.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            }
        }

        function AddNew() {
            RolesCtrl.ePage.Masters.Role.ActiveRole = {};
            Edit();
        }

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
            if (RolesCtrl.ePage.Masters.Role.ActiveRole.PK) {
                GetMenuList();
            }

            RolesCtrl.ePage.Masters.Role.SaveBtnText = "OK";
            RolesCtrl.ePage.Masters.Role.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function Save() {
            if (RolesCtrl.ePage.Masters.Role.ActiveRole.PK) {
                UpdateRole();
            } else {
                InsertRole();
            }
        }

        function InsertRole() {
            RolesCtrl.ePage.Masters.Role.SaveBtnText = "Please Wait...";
            RolesCtrl.ePage.Masters.Role.IsDisableSaveBtn = true;

            var _input = RolesCtrl.ePage.Masters.Role.ActiveRole;
            _input.SAP_FK = RolesCtrl.ePage.Masters.QueryString.AppPk;
            _input.IsModified = true;

            _input.Party_Code = RolesCtrl.ePage.Masters.QueryString.Party.Code;
            _input.Party_FK = RolesCtrl.ePage.Masters.QueryString.Party.PK;

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecRole.API.Insert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    RolesCtrl.ePage.Masters.Role.ActiveRole = angular.copy(_response);
                    var _index = RolesCtrl.ePage.Masters.Role.ListSource.map(function (e) {
                        return e.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        RolesCtrl.ePage.Masters.Role.ListSource.push(_response);
                    } else {
                        RolesCtrl.ePage.Masters.Role.ListSource[_index] = _response;
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

        function UpdateRole() {
            RolesCtrl.ePage.Masters.Role.SaveBtnText = "Please Wait...";
            RolesCtrl.ePage.Masters.Role.IsDisableSaveBtn = true;

            var _input = RolesCtrl.ePage.Masters.Role.ActiveRole;
            _input.SAP_FK = RolesCtrl.ePage.Masters.QueryString.AppPk;
            _input.IsModified = true;

            _input.Party_Code = RolesCtrl.ePage.Masters.QueryString.Party.Code;
            _input.Party_FK = RolesCtrl.ePage.Masters.QueryString.Party.PK;

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecRole.API.Update.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;
                    RolesCtrl.ePage.Masters.Role.ActiveRole = angular.copy(_response);
                    var _index = RolesCtrl.ePage.Masters.Role.ListSource.map(function (e) {
                        return e.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        RolesCtrl.ePage.Masters.Role.ListSource.push(_response);
                    } else {
                        RolesCtrl.ePage.Masters.Role.ListSource[_index] = _response;
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
                if (RolesCtrl.ePage.Masters.Role.ListSource.length > 0) {
                    RolesCtrl.ePage.Masters.Role.ActiveRole = angular.copy(RolesCtrl.ePage.Masters.Role.ListSource[0]);
                } else {
                    RolesCtrl.ePage.Masters.Role.ActiveRole = undefined;
                }
            } else if (RolesCtrl.ePage.Masters.Role.ActiveRoleCopy) {
                var _index = RolesCtrl.ePage.Masters.Role.ListSource.map(function (value, key) {
                    return value.PK;
                }).indexOf(RolesCtrl.ePage.Masters.Role.ActiveRoleCopy.PK);

                if (_index !== -1) {
                    RolesCtrl.ePage.Masters.Role.ActiveRole = angular.copy(RolesCtrl.ePage.Masters.Role.ListSource[_index]);
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

            apiService.get("authAPI", trustCenterConfig.Entities.API.SecRole.API.Delete.Url + RolesCtrl.ePage.Masters.Role.ActiveRole.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = RolesCtrl.ePage.Masters.Role.ListSource.map(function (value, key) {
                        return value.PK;
                    }).indexOf(RolesCtrl.ePage.Masters.Role.ActiveRole.PK);

                    if (_index !== -1) {
                        RolesCtrl.ePage.Masters.Role.ListSource.splice(_index, 1);
                        if (RolesCtrl.ePage.Masters.Role.ListSource.length > 0) {
                            RolesCtrl.ePage.Masters.Role.ActiveRole = angular.copy(RolesCtrl.ePage.Masters.Role.ListSource[0]);
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

        function OnRedirectLinkClick($item) {
            var _queryString = {
                USR_ROLES: RolesCtrl.ePage.Masters.Role.ActiveRole.RoleName
            };
            _queryString = helperService.encryptData(_queryString);
            window.open($item.Link + "/" + helperService.encryptData(RolesCtrl.ePage.Masters.QueryString) + '?item=' + _queryString, "_blank");
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
                "FilterID": trustCenterConfig.Entities.API.SecMappings.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecMappings.API.FindAll.Url, _input).then(function SuccessCallback(response) {
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
                "FilterID": trustCenterConfig.Entities.API.SecMappings.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecMappings.API.FindAll.Url, _input).then(function SuccessCallback(response) {
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
            _input.Access_FK = RolesCtrl.ePage.Masters.Menu.ActiveMenu.Item_FK;
            _input.Item_FK = RolesCtrl.ePage.Masters.Role.ActiveRole.PK;
            _input.ItemName = "ROLE";
            _input.ItemCode = RolesCtrl.ePage.Masters.Role.ActiveRole.RoleName;
            _input.IsModified = true;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.TNT_FK = authService.getUserInfo().TenantPK;
            _input.SAP_Code = RolesCtrl.ePage.Masters.QueryString.AppCode;
            _input.SAP_FK = RolesCtrl.ePage.Masters.QueryString.AppPk;

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecMappings.API.Upsert.Url, [_input]).then(function (response) {
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

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecMappings.API.Upsert.Url, [_input]).then(function (response) {
                RolesCtrl.ePage.Masters.Menu.DefaultMenu = undefined;
                SaveMenuRole();
            });
        }

        // ------------------------------------
        function GetAppTenantPublishList() {
            RolesCtrl.ePage.Masters.Role.RePublishAccess = undefined;
            var _input = {
                "AppCode": RolesCtrl.ePage.Masters.QueryString.AppCode,
                "TNTCode": authService.getUserInfo().TenantCode,
                "RoleCode": RolesCtrl.ePage.Masters.Role.ActiveRole.RoleName,
            };
            apiService.post("authAPI", trustCenterConfig.Entities.API.UserPrivileges.API.AppTenantRolePublish.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;
                    if (_response.length > 0) {
                        _response.map(function (value, key) {
                            if (value) {
                                if (value.Images) {
                                    value.Images = JSON.parse(value.Images);
                                }
                                if (value.Value1) {
                                    value.Value1 = JSON.parse(value.Value1);
                                }
                                if (value.Value2) {
                                    value.Value2 = JSON.parse(value.Value2);
                                }
                                if (value.Value3) {
                                    value.Value3 = JSON.parse(value.Value3);
                                }
                            }
                        });
                    }
                    _response = JSON.stringify(_response, undefined, 2);

                    RolesCtrl.ePage.Masters.Role.RePublishAccess = _response;
                } else {
                    RolesCtrl.ePage.Masters.Role.RePublishAccess = "Error...!";
                }
            });
        }

        function EditAppTenantModalInstance() {
            $timeout(function () {
                GetAppTenantPublishList();
            });

            return RolesCtrl.ePage.Masters.Role.EditAppTenantModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'appTenantEdit'"></div>`
            });
        }

        function AppTenantCancel() {
            RolesCtrl.ePage.Masters.Role.EditAppTenantModal.dismiss('cancel');
        }

        function OnAppTenantPublishClick() {
            EditAppTenantModalInstance().result.then(function (response) {}, function () {
                AppTenantCancel();
            });
        }

        Init();
    }
})();