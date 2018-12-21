(function () {
    "use strict";

    angular
        .module("Application")
        .controller("MenuController", MenuController);

    MenuController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "jsonEditModal", "trustCenterConfig"]

    function MenuController($scope, $location, $uibModal, authService, apiService, helperService, toastr, confirmation, jsonEditModal, trustCenterConfig) {
        var MenuCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            MenuCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            MenuCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            MenuCtrl.ePage.Masters.emptyText = "-";

            try {
                MenuCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (MenuCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitApplication();
                    InitModule();
                    InitMenu();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            MenuCtrl.ePage.Masters.Breadcrumb = {};
            MenuCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = "";
            if (MenuCtrl.ePage.Masters.QueryString.AdditionalData.BreadcrumbTitle) {
                _breadcrumbTitle = " (" + MenuCtrl.ePage.Masters.QueryString.AdditionalData.BreadcrumbTitle + ")";
            }

            MenuCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": MenuCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": MenuCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": MenuCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "menugroup",
                Description: "Menu" + _breadcrumbTitle,
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
            MenuCtrl.ePage.Masters.Application = {};
            MenuCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            MenuCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);

            if (!MenuCtrl.ePage.Masters.Application.ActiveApplication) {
                MenuCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": MenuCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": MenuCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": MenuCtrl.ePage.Masters.QueryString.AppName
                };
            }

            if (MenuCtrl.ePage.Masters.ActiveModule || MenuCtrl.ePage.Masters.ActiveSubModule) {
                GetMenuList();
            } else {
                MenuCtrl.ePage.Masters.Menu.MenuList = [];
            }
        }

        // ========== Module List ==========================================

        // ========================Module Start========================

        function InitModule() {
            MenuCtrl.ePage.Masters.OnModuleChange = OnModuleChange;
            MenuCtrl.ePage.Masters.OnSubModuleChange = OnSubModuleChange;

            GetModuleList();
        }

        function GetModuleList() {
            MenuCtrl.ePage.Masters.ModuleList = undefined;
            var _filter = {
                TypeCode: "MODULE_MASTER"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CfxTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    MenuCtrl.ePage.Masters.ModuleList = response.data.Response;
                }
            });
        }

        function OnModuleChange($item) {
            MenuCtrl.ePage.Masters.ActiveModule = angular.copy($item);

            if (MenuCtrl.ePage.Masters.ActiveModule) {
                // GetSubModuleList();
            } else {
                MenuCtrl.ePage.Masters.SubModuleList = [];
            }
            GetMenuList();
        }

        function GetSubModuleList() {
            MenuCtrl.ePage.Masters.SubModuleList = undefined;

            var _filter = {
                "PropertyName": "SubModuleCode",
                "ModuleCode": MenuCtrl.ePage.Masters.ActiveModule.Key,
                "SAP_FK": MenuCtrl.ePage.Masters.Application.ActiveApplication.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CfxTypes.API.GetColumnValuesWithFilters.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.GetColumnValuesWithFilters.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    MenuCtrl.ePage.Masters.SubModuleList = response.data.Response;
                }
            });
        }

        function OnSubModuleChange($item) {
            MenuCtrl.ePage.Masters.ActiveSubModule = angular.copy($item);

            GetMenuList();
        }

        // ========================Module End========================

        function InitMenu() {
            MenuCtrl.ePage.Masters.Menu = {};
            MenuCtrl.ePage.Masters.Menu.ActiveMenu = {};
            MenuCtrl.ePage.Masters.Menu.MenuList = [];

            MenuCtrl.ePage.Masters.Menu.Cancel = Cancel;
            MenuCtrl.ePage.Masters.Menu.Save = Save;
            MenuCtrl.ePage.Masters.Menu.Edit = Edit;
            MenuCtrl.ePage.Masters.Menu.DeleteConfirmation = DeleteConfirmation;
            MenuCtrl.ePage.Masters.Menu.Delete = Delete;
            MenuCtrl.ePage.Masters.Menu.OnMenuClick = OnMenuClick;
            MenuCtrl.ePage.Masters.Menu.OnParentChange = OnParentChange;
            MenuCtrl.ePage.Masters.Menu.OpenJsonModal = OpenJsonModal;
            MenuCtrl.ePage.Masters.Menu.OnRedirectListClick = OnRedirectListClick;
            MenuCtrl.ePage.Masters.Menu.SelectedIconColor = SelectedIconColor;
            MenuCtrl.ePage.Masters.Menu.AddNew = AddNew;

            MenuCtrl.ePage.Masters.Menu.SaveBtnText = "OK";
            MenuCtrl.ePage.Masters.Menu.IsDisableSaveBtn = false;

            MenuCtrl.ePage.Masters.Menu.DeleteBtnText = "Delete";
            MenuCtrl.ePage.Masters.Menu.IsDisableDeleteBtn = false;

            GetRedirectLinkList();
        }

        function GetMenuList() {
            MenuCtrl.ePage.Masters.Menu.MenuList = undefined;
            var _filter = {
                "SAP_FK": MenuCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "PageType": MenuCtrl.ePage.Masters.QueryString.AdditionalData.Input.Code
            };

            if (MenuCtrl.ePage.Masters.ActiveModule) {
                _filter.Module = MenuCtrl.ePage.Masters.ActiveModule.Key;
            }
            if (MenuCtrl.ePage.Masters.ActiveSubModule) {
                _filter.SubModule = MenuCtrl.ePage.Masters.ActiveSubModule;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CfxMenus.API.MasterFindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxMenus.API.MasterFindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    MenuCtrl.ePage.Masters.Menu.MenuList = response.data.Response;

                    if (MenuCtrl.ePage.Masters.Menu.MenuList.length > 0) {
                        OnMenuClick(MenuCtrl.ePage.Masters.Menu.MenuList[0]);
                    } else {
                        OnMenuClick();
                    }
                } else {
                    MenuCtrl.ePage.Masters.Menu.MenuList = [];
                }
            });
        }

        function AddNew() {
            if (MenuCtrl.ePage.Masters.QueryString.AdditionalData.Input.Code) {
                MenuCtrl.ePage.Masters.Menu.ActiveMenu = {
                    PageType: MenuCtrl.ePage.Masters.QueryString.AdditionalData.Input.Code,
                    ModuleCode: MenuCtrl.ePage.Masters.ActiveModule.Key
                };

                Edit();
            }
        }

        function OnMenuClick($item) {
            MenuCtrl.ePage.Masters.Menu.ActiveMenu = angular.copy($item);
            MenuCtrl.ePage.Masters.Menu.ActiveMenuCopy = angular.copy($item);
            if ($item) {
                MenuCtrl.ePage.Masters.Menu.ActiveMenu.Icon = JSON.parse(MenuCtrl.ePage.Masters.Menu.ActiveMenu.Icon);
                MenuCtrl.ePage.Masters.Menu.ActiveMenu.PageType = MenuCtrl.ePage.Masters.QueryString.AdditionalData.Input.Code;
            }
        }

        function OnParentChange($item) {
            if ($item) {
                MenuCtrl.ePage.Masters.Menu.ActiveMenu.ParentMenu = $item.MenuName;
            } else {
                MenuCtrl.ePage.Masters.Menu.ActiveMenu.ParentMenu = undefined;
            }
        }

        function EditModalInstance() {
            return MenuCtrl.ePage.Masters.Menu.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="MenuCtrl.ePage.Masters.QueryString.AdditionalData.Input.Code + 'Edit'"></div>`
            });

        }

        function Edit() {
            MenuCtrl.ePage.Masters.Menu.SaveBtnText = "OK";
            MenuCtrl.ePage.Masters.Menu.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function Save() {
            MenuCtrl.ePage.Masters.Menu.SaveBtnText = "Please Wait...";
            MenuCtrl.ePage.Masters.Menu.IsDisableSaveBtn = true;

            var _input = angular.copy(MenuCtrl.ePage.Masters.Menu.ActiveMenu);

            _input.LoginUserID = authService.getUserInfo().UserId;
            _input.SAP_FK = MenuCtrl.ePage.Masters.Application.ActiveApplication.PK;
            _input.IsModified = true;
            _input.IsDeleted = false;

            if (_input.Icon && typeof _input.Icon == "object") {
                _input.Icon = JSON.stringify(_input.Icon);
            }
            if (_input.OtherConfig && typeof _input.OtherConfig == "object") {
                _input.OtherConfig = JSON.stringify(_input.OtherConfig);
            }

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxMenus.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    MenuCtrl.ePage.Masters.Menu.ActiveMenu = angular.copy(_response);
                    var _index = MenuCtrl.ePage.Masters.Menu.MenuList.map(function (e) {
                        return e.Id;
                    }).indexOf(_response.Id);

                    if (_index === -1) {
                        MenuCtrl.ePage.Masters.Menu.MenuList.push(_response);
                    } else {
                        MenuCtrl.ePage.Masters.Menu.MenuList[_index] = _response;
                    }

                    MenuCtrl.ePage.Masters.Menu.ActiveMenu.Icon = JSON.parse(MenuCtrl.ePage.Masters.Menu.ActiveMenu.Icon);
                    OnMenuClick(_response);
                } else {
                    toastr.error("Could not Save...!");
                }

                MenuCtrl.ePage.Masters.Menu.SaveBtnText = "OK";
                MenuCtrl.ePage.Masters.Menu.IsDisableSaveBtn = false;
                MenuCtrl.ePage.Masters.Menu.EditModal.dismiss('cancel');
            });
        }

        function Cancel() {
            if (!MenuCtrl.ePage.Masters.Menu.ActiveMenu) {
                if (MenuCtrl.ePage.Masters.Menu.MenuList.length > 0) {
                    MenuCtrl.ePage.Masters.Menu.ActiveMenu = angular.copy(MenuCtrl.ePage.Masters.Menu.MenuList[0]);
                } else {
                    MenuCtrl.ePage.Masters.Menu.ActiveMenu = undefined;
                }
            } else if (MenuCtrl.ePage.Masters.Menu.ActiveMenuCopy) {
                var _index = MenuCtrl.ePage.Masters.Menu.MenuList.map(function (value, key) {
                    return value.Id;
                }).indexOf(MenuCtrl.ePage.Masters.Menu.ActiveMenuCopy.Id);

                if (_index !== -1) {
                    MenuCtrl.ePage.Masters.Menu.ActiveMenu = angular.copy(MenuCtrl.ePage.Masters.Menu.MenuList[_index]);
                }
            } else if (!MenuCtrl.ePage.Masters.Menu.ActiveMenuCopy) {
                MenuCtrl.ePage.Masters.Menu.ActiveMenu = undefined;
            }

            MenuCtrl.ePage.Masters.Menu.EditModal.dismiss('cancel');
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
            MenuCtrl.ePage.Masters.Menu.DeleteBtnText = "Please Wait...";
            MenuCtrl.ePage.Masters.Menu.IsDisableDeleteBtn = true;

            var _input = angular.copy(MenuCtrl.ePage.Masters.Menu.ActiveMenu);
            _input.IsModified = true;
            _input.IsDeleted = true;
            if (typeof _input.Icon == "object") {
                _input.Icon = JSON.stringify(_input.Icon);
            }

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxMenus.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = MenuCtrl.ePage.Masters.Menu.MenuList.map(function (value, key) {
                        return value.Id;
                    }).indexOf(MenuCtrl.ePage.Masters.Menu.ActiveMenu.Id);

                    if (_index !== -1) {
                        MenuCtrl.ePage.Masters.Menu.MenuList.splice(_index, 1);
                        if (MenuCtrl.ePage.Masters.Menu.MenuList.length > 0) {
                            MenuCtrl.ePage.Masters.Menu.ActiveMenu = angular.copy(MenuCtrl.ePage.Masters.Menu.MenuList[0]);
                        } else {
                            OnMenuClick();
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                MenuCtrl.ePage.Masters.Menu.DeleteBtnText = "Delete";
                MenuCtrl.ePage.Masters.Menu.IsDisableDeleteBtn = false;
            });
        }

        function OpenJsonModal(type) {
            var _attributeJson = '';
            if (type == 'OtherConfig') {
                var _attributeJson = MenuCtrl.ePage.Masters.Menu.ActiveMenu.OtherConfig;
            } else if (type == 'icon') {
                var _attributeJson = MenuCtrl.ePage.Masters.Menu.ActiveMenu.Icon;
            }

            if (_attributeJson !== undefined && _attributeJson !== null && _attributeJson !== '' && _attributeJson !== ' ') {
                try {
                    var modalDefaults = {
                        resolve: {
                            param: function () {
                                var exports = {
                                    "Data": _attributeJson
                                };
                                return exports;
                            }
                        }
                    };

                    jsonEditModal.showModal(modalDefaults, {})
                        .then(function (result) {
                            if (type == 'OtherConfig') {
                                var _attributeJson = result;
                                MenuCtrl.ePage.Masters.Menu.ActiveMenu.OtherConfig = _attributeJson;
                            } else if (type == 'icon') {
                                var _attributeJson = result;
                                _attributeJson = JSON.parse(_attributeJson);
                                MenuCtrl.ePage.Masters.Menu.ActiveMenu.Icon = _attributeJson;
                            }

                        }, function () {
                            console.log("Cancelled");
                        });
                } catch (error) {
                    toastr.warning("Value Should be JSON format...!");
                }
            } else {
                toastr.warning("Value Should not be Empty...!");
            }
        }

        function SelectedIconColor($item, type) {
            if ($item) {
                if (!MenuCtrl.ePage.Masters.Menu.ActiveMenu.Icon && MenuCtrl.ePage.Masters.Menu.ActiveMenu.Icon != 'null') {
                    MenuCtrl.ePage.Masters.Menu.ActiveMenu.Icon = {};
                }

                MenuCtrl.ePage.Masters.Menu.ActiveMenu.Icon[type] = $item;
            }
        }

        function GetRedirectLinkList() {
            MenuCtrl.ePage.Masters.Menu.RedirectPageList = [{
                Code: "RoleAccess",
                Description: "Role Access",
                Icon: "fa fa-sign-in",
                Link: "TC/menu-role-app-tenant",
                Color: "#bd081c",
                AdditionalData: MenuCtrl.ePage.Masters.QueryString.AdditionalData,
                Type: 1,
                IsEnable: (authService.getUserInfo().TenantCode == "TBASE") ? true : false
            }];
        }

        function OnRedirectListClick($item) {
            if (MenuCtrl.ePage.Masters.Application.ActiveApplication) {
                var _queryString = {
                    "AppPk": MenuCtrl.ePage.Masters.Application.ActiveApplication.PK,
                    "AppCode": MenuCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                    "AppName": MenuCtrl.ePage.Masters.Application.ActiveApplication.AppName
                };
            } else {
                var _queryString = MenuCtrl.ePage.Masters.QueryString;
            }

            if ($item.Type === 1) {
                _queryString.DisplayName = MenuCtrl.ePage.Masters.Menu.ActiveMenu.Description;
                _queryString.ItemPk = MenuCtrl.ePage.Masters.Menu.ActiveMenu.Id;
                _queryString.ItemCode = MenuCtrl.ePage.Masters.Menu.ActiveMenu.Code;
                _queryString.AdditionalData = $item.AdditionalData;
            }

            if ($item.Link !== "#") {
                $location.path($item.Link + "/" + helperService.encryptData(_queryString));
            }
        }

        Init();
    }
})();