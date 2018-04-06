(function () {
    "use strict";

    angular
        .module("Application")
        .controller("MenuController", MenuController);

    MenuController.$inject = ["$scope", "$location", "$timeout", "$http", "$uibModal", "authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "toastr", "confirmation", "jsonEditModal"]

    function MenuController($scope, $location, $timeout, $http, $uibModal, authService, apiService, helperService, appConfig, APP_CONSTANT, toastr, confirmation, jsonEditModal) {
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
                    InitMenuType();
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
            if (MenuCtrl.ePage.Masters.QueryString.BreadcrumbTitle) {
                _breadcrumbTitle = " (" + MenuCtrl.ePage.Masters.QueryString.BreadcrumbTitle + ")";
            }

            MenuCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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

        function InitMenuType() {
            MenuCtrl.ePage.Masters.MenuType = {};
            MenuCtrl.ePage.Masters.MenuType.ActiveMenuType = {};
            MenuCtrl.ePage.Masters.MenuType.OnMenuTypeChange = OnMenuTypeChange;

            GetMenuTypeList();
        }

        function GetMenuTypeList() {
            MenuCtrl.ePage.Masters.MenuType.Listsource = undefined;
            var _filter = {
                TypeCode: "TRUSTCENTER_MENU"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    MenuCtrl.ePage.Masters.MenuType.Listsource = response.data.Response;

                    if (MenuCtrl.ePage.Masters.MenuType.Listsource.length > 0) {
                        OnMenuTypeChange(MenuCtrl.ePage.Masters.MenuType.Listsource[0]);
                    } else {
                        OnMenuTypeChange();
                    }
                } else {
                    MenuCtrl.ePage.Masters.MenuType.Listsource = [];
                }
            });
        }

        function OnMenuTypeChange($item) {
            OnMenuClick();
            MenuCtrl.ePage.Masters.MenuType.ActiveMenuType = $item;
            MenuCtrl.ePage.Masters.Menu.MenuList = [];
            if ($item) {
                GetMenuList();
            }
        }

        // ========================

        function InitMenu() {
            MenuCtrl.ePage.Masters.Menu = {};
            MenuCtrl.ePage.Masters.Menu.ActiveMenu = {};

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
            // GetMenuList();
        }

        function GetMenuList() {
            MenuCtrl.ePage.Masters.Menu.MenuList = undefined;
            var _filter = {
                "SAP_FK": MenuCtrl.ePage.Masters.QueryString.AppPk,
                "PageType": MenuCtrl.ePage.Masters.MenuType.ActiveMenuType.Key
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.MasterFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.MasterFindAll.Url, _input).then(function SuccessCallback(response) {
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
            if (MenuCtrl.ePage.Masters.MenuType.ActiveMenuType.Key) {
                MenuCtrl.ePage.Masters.Menu.ActiveMenu = {
                    PageType: MenuCtrl.ePage.Masters.MenuType.ActiveMenuType.Key
                };

                Edit();
            }
        }

        function OnMenuClick($item) {
            MenuCtrl.ePage.Masters.Menu.ActiveMenu = angular.copy($item);
            MenuCtrl.ePage.Masters.Menu.ActiveMenuCopy = angular.copy($item);
            if ($item) {
                MenuCtrl.ePage.Masters.Menu.ActiveMenu.Icon = JSON.parse(MenuCtrl.ePage.Masters.Menu.ActiveMenu.Icon);
                MenuCtrl.ePage.Masters.Menu.ActiveMenu.PageType = MenuCtrl.ePage.Masters.MenuType.ActiveMenuType.Key;
            }
        }

        function OnParentChange($item) {
            if ($item) {
                MenuCtrl.ePage.Masters.Menu.ActiveMenu.ParentMenu = $item.MenuName;
            }
        }

        function EditModalInstance() {
            return MenuCtrl.ePage.Masters.Menu.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'menuEdit'"></div>`
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
            _input.SAP_FK = MenuCtrl.ePage.Masters.QueryString.AppPk;
            _input.IsModified = true;
            _input.IsDeleted = false;

            if (_input.Icon && typeof _input.Icon == "object") {
                _input.Icon = JSON.stringify(_input.Icon);
            }
            if (_input.OtherConfig && typeof _input.OtherConfig == "object") {
                _input.OtherConfig = JSON.stringify(_input.OtherConfig);
            }

            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
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

            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
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
            MenuCtrl.ePage.Masters.Menu.RedirectPagetList = [{
                    Code: "RoleAccess",
                    Description: "Role Access",
                    Icon: "fa fa-sign-in",
                    Link: "TC/mapping-vertical",
                    Color: "#bd081c",
                    AdditionalData: "MENU_ROLE_APP_TNT",
                    BreadcrumbTitle: "Menu Role - MENU_ROLE_APP_TNT",
                    Type: 1
                }
            ];
        }

        function OnRedirectListClick($item) {
            var _queryString = {
                "AppPk": MenuCtrl.ePage.Masters.QueryString.AppPk,
                "AppCode": MenuCtrl.ePage.Masters.QueryString.AppCode,
                "AppName": MenuCtrl.ePage.Masters.QueryString.AppName
            };

            if ($item.Type === 1) {
                _queryString.DisplayName = MenuCtrl.ePage.Masters.Menu.ActiveMenu.Description;
                _queryString.ItemPk = MenuCtrl.ePage.Masters.Menu.ActiveMenu.Id;
                _queryString.ItemCode = MenuCtrl.ePage.Masters.Menu.ActiveMenu.Code;
                _queryString.ItemName = "MENU";
                _queryString.MappingCode = $item.AdditionalData;
                _queryString.BreadcrumbTitle = $item.BreadcrumbTitle;
            }

            if ($item.Link !== "#") {
                $location.path($item.Link + "/" + helperService.encryptData(_queryString));
            }
        }

        Init();
    }
})();
