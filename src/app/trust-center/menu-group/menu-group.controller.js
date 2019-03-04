(function () {
    "use strict";
    angular
        .module("Application")
        .controller("MenuGroupsController", MenuGroupsController);

    MenuGroupsController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "trustCenterConfig"]

    function MenuGroupsController($scope, $location, $uibModal, authService, apiService, helperService, toastr, confirmation, trustCenterConfig) {
        var MenuGroupsCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            MenuGroupsCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_MenuGroups",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            MenuGroupsCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            MenuGroupsCtrl.ePage.Masters.emptyText = "-";

            try {
                MenuGroupsCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (MenuGroupsCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitApplication();
                    InitMenuGroupsConfig();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            MenuGroupsCtrl.ePage.Masters.Breadcrumb = {};
            MenuGroupsCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = "";
            if (MenuGroupsCtrl.ePage.Masters.QueryString.AdditionalData.BreadcrumbTitle) {
                _breadcrumbTitle = " (" + MenuGroupsCtrl.ePage.Masters.QueryString.AdditionalData.BreadcrumbTitle + ")";
            }

            MenuGroupsCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": MenuGroupsCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": MenuGroupsCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": MenuGroupsCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "menugroup",
                Description: "Menu Group " + _breadcrumbTitle,
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

        //========================Application=================
        function InitApplication() {
            MenuGroupsCtrl.ePage.Masters.Application = {};
            MenuGroupsCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            MenuGroupsCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);

            if (!MenuGroupsCtrl.ePage.Masters.Application.ActiveApplication) {
                MenuGroupsCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": MenuGroupsCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": MenuGroupsCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": MenuGroupsCtrl.ePage.Masters.QueryString.AppName
                };
            }

            GetRedirectLinkList();
            GetMenuGroupsList();
        }

        function InitMenuGroupsConfig() {
            MenuGroupsCtrl.ePage.Masters.MenuGroups = {};
            MenuGroupsCtrl.ePage.Masters.MenuGroups.Cancel = Cancel;
            MenuGroupsCtrl.ePage.Masters.MenuGroups.Save = Save;
            MenuGroupsCtrl.ePage.Masters.MenuGroups.Edit = Edit;
            MenuGroupsCtrl.ePage.Masters.MenuGroups.DeleteConfirmation = DeleteConfirmation;
            MenuGroupsCtrl.ePage.Masters.MenuGroups.Delete = Delete;
            MenuGroupsCtrl.ePage.Masters.MenuGroups.OnMenuGroupsClick = OnMenuGroupsClick;
            MenuGroupsCtrl.ePage.Masters.MenuGroups.OnRedirectListClick = OnRedirectListClick;
            MenuGroupsCtrl.ePage.Masters.MenuGroups.AddNew = AddNew;

            MenuGroupsCtrl.ePage.Masters.MenuGroups.SaveBtnText = "OK";
            MenuGroupsCtrl.ePage.Masters.MenuGroups.IsDisableSaveBtn = false;

            MenuGroupsCtrl.ePage.Masters.MenuGroups.DeleteBtnText = "Delete";
            MenuGroupsCtrl.ePage.Masters.MenuGroups.IsDisableDeleteBtn = false;
        }

        function GetMenuGroupsList() {
            MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList = undefined;
            var _filter = {
                "GroupType": MenuGroupsCtrl.ePage.Masters.QueryString.AdditionalData.Input.Code
            };

            _filter.ModuleCode = MenuGroupsCtrl.ePage.Masters.Application.ActiveApplication.AppCode;

            if (MenuGroupsCtrl.ePage.Masters.QueryString.AdditionalData.Input.Code == "BPMGroups") {
                _filter.TenantCode = authService.getUserInfo().TenantCode;
            } else {
                _filter.TenantCode = "TBASE";
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.MenuGroups.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.MenuGroups.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList = response.data.Response;
                    if (MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList.length > 0) {
                        OnMenuGroupsClick(MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList[0]);
                    } else {
                        OnMenuGroupsClick();
                    }
                } else {
                    MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList = [];
                }
            });
        }

        function AddNew() {
            MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups = {
                GroupType: MenuGroupsCtrl.ePage.Masters.QueryString.AdditionalData.Input.Code
            };
            Edit();
        }

        function OnMenuGroupsClick($item) {
            MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups = angular.copy($item);
            MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroupsCopy = angular.copy($item);
            if (MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups) {
                MenuGroupsCtrl.ePage.Masters.GenerateScriptInput = {
                    ObjectName: "MenuGroups",
                    ObjectId: MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups.PK
                };
                MenuGroupsCtrl.ePage.Masters.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            }
        }

        function EditModalInstance() {
            return MenuGroupsCtrl.ePage.Masters.MenuGroups.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'menuGroupEdit'"></div>`
            });
        }

        function Edit() {
            MenuGroupsCtrl.ePage.Masters.MenuGroups.SaveBtnText = "OK";
            MenuGroupsCtrl.ePage.Masters.MenuGroups.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function Save() {
            if (MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups.PK) {
                UpdateMenuGroups();
            } else {
                InsertMenuGroups();
            }
        }

        function InsertMenuGroups() {
            MenuGroupsCtrl.ePage.Masters.MenuGroups.SaveBtnText = "Please Wait...";
            MenuGroupsCtrl.ePage.Masters.MenuGroups.IsDisableSaveBtn = true;

            var _input = MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups;
            _input.IsModified = true;
            _input.IsActive = true;
            _input.ModuleCode = MenuGroupsCtrl.ePage.Masters.Application.ActiveApplication.AppCode;
            _input.TenantCode = authService.getUserInfo().TenantCode;

            if (MenuGroupsCtrl.ePage.Masters.QueryString.AdditionalData.Input.Code == "BPMGroups") {
                _input.TenantCode = authService.getUserInfo().TenantCode;
            } else {
                _input.TenantCode = "TBASE";
            }



            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.MenuGroups.API.Insert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];

                        var _index = MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList.map(function (value, key) {
                            return value.PK;
                        }).indexOf(_response.PK);

                        if (_index === -1) {
                            MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList.push(_response);
                        } else {
                            MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList[_index] = _response;
                        }

                        OnMenuGroupsClick(_response);
                    }
                } else {
                    toastr.error("Could not Save...!");
                }

                MenuGroupsCtrl.ePage.Masters.MenuGroups.SaveBtnText = "OK";
                MenuGroupsCtrl.ePage.Masters.MenuGroups.IsDisableSaveBtn = false;
                MenuGroupsCtrl.ePage.Masters.MenuGroups.EditModal.dismiss('cancel');
            });
        }

        function UpdateMenuGroups() {
            MenuGroupsCtrl.ePage.Masters.MenuGroups.SaveBtnText = "Please Wait...";
            MenuGroupsCtrl.ePage.Masters.MenuGroups.IsDisableSaveBtn = true;

            var _input = MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups;
            _input.IsModified = true;
            _input.IsActive = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.MenuGroups.API.Update.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;

                    var _index = MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList.push(_response);
                    } else {
                        MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList[_index] = _response;
                    }

                    OnMenuGroupsClick(_response);
                } else {
                    toastr.error("Could not Save...!");
                }

                MenuGroupsCtrl.ePage.Masters.MenuGroups.SaveBtnText = "OK";
                MenuGroupsCtrl.ePage.Masters.MenuGroups.IsDisableSaveBtn = false;
                MenuGroupsCtrl.ePage.Masters.MenuGroups.EditModal.dismiss('cancel');
            });
        }

        function Cancel() {
            if (!MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups) {
                if (MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList.length > 0) {
                    MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups = angular.copy(MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList[0]);
                } else {
                    MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups = undefined;
                }
            } else if (MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroupsCopy) {
                var _index = MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList.map(function (value, key) {
                    return value.PK;
                }).indexOf(MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroupsCopy.PK);

                if (_index !== -1) {
                    MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups = angular.copy(MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList[_index]);
                }
            }

            MenuGroupsCtrl.ePage.Masters.MenuGroups.EditModal.dismiss('cancel');
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
            MenuGroupsCtrl.ePage.Masters.DeleteBtnText = "Delete";
            MenuGroupsCtrl.ePage.Masters.IsDisableDeleteBtn = true;

            apiService.get("eAxisAPI", trustCenterConfig.Entities.API.MenuGroups.API.Delete.Url + MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups.PK);

                    if (_index != -1) {
                        MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList.splice(_index, 1);
                    }
                    MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups = undefined;
                    OnMenuGroupsClick();
                } else {
                    toastr.error("Could not Delete")
                }
                GetMenuGroupsList();

                MenuGroupsCtrl.ePage.Masters.DeleteBtnText = "Delete";
                MenuGroupsCtrl.ePage.Masters.IsDisableDeleteBtn = false;
            });
        }

        function GetRedirectLinkList() {
            MenuGroupsCtrl.ePage.Masters.MenuGroups.RedirectPagetList = [{
                Code: "RoleMapping",
                Description: "Role Mapping",
                Icon: "fa fa-sign-in",
                Link: "TC/group-role-app-tenant",
                Color: "#bd081c",
                AdditionalData: MenuGroupsCtrl.ePage.Masters.QueryString.AdditionalData,
                ItemName: "MENUGROUP",
                BreadcrumbTitle: "Menu Group Role - GRUP_ROLE_APP_TNT",
            }];
        }

        function OnRedirectListClick($item) {
            if (MenuGroupsCtrl.ePage.Masters.Application.ActiveApplication) {
                var _queryString = {
                    "AppPk": MenuGroupsCtrl.ePage.Masters.Application.ActiveApplication.PK,
                    "AppCode": MenuGroupsCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                    "AppName": MenuGroupsCtrl.ePage.Masters.Application.ActiveApplication.AppName
                };
            } else {
                var _queryString = MenuGroupsCtrl.ePage.Masters.QueryString;
            }

            _queryString.DisplayName = MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups.Description;
            _queryString.ItemPk = MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups.PK;
            _queryString.ItemCode = MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups.Description;
            _queryString.ItemName = MenuGroupsCtrl.ePage.Masters.QueryString.AdditionalData.Input.Code;
            _queryString.AdditionalData = $item.AdditionalData;
            _queryString.BreadcrumbTitle = $item.BreadcrumbTitle;

            if ($item.Link !== "#") {
                $location.path($item.Link + "/" + helperService.encryptData(_queryString));
            }
        }

        Init();
    }
})();