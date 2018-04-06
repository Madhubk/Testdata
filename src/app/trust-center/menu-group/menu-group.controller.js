(function () {
    "use strict";
    angular
        .module("Application")
        .controller("MenuGroupsController", MenuGroupsController);

    MenuGroupsController.$inject = ["$scope", "$location", "$timeout", "$uibModal", "$http", "authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "toastr", "confirmation"]

    function MenuGroupsController($scope, $location, $timeout, $uibModal, $http, authService, apiService, helperService, appConfig, APP_CONSTANT, toastr, confirmation) {
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
                    InitMenuTypeList();
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
            MenuGroupsCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                Description: "Menu Group",
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

        function InitMenuTypeList() {
            MenuGroupsCtrl.ePage.Masters.MenuGroupType = {};
            MenuGroupsCtrl.ePage.Masters.MenuGroupType.OnMenuGroupTypeChange = OnMenuGroupTypeChange;
            GetMenuGroupTypeList();
        }

        function GetMenuGroupTypeList() {
            MenuGroupsCtrl.ePage.Masters.MenuGroupType.Listsource = undefined;
            var _filter = {
                TypeCode: "GROUPTYPE_MASTER"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    MenuGroupsCtrl.ePage.Masters.MenuGroupType.Listsource = response.data.Response;
                    if (MenuGroupsCtrl.ePage.Masters.MenuGroupType.Listsource.length > 0) {
                        OnMenuGroupTypeChange(MenuGroupsCtrl.ePage.Masters.MenuGroupType.Listsource[0]);
                    } else {
                        OnMenuGroupTypeChange();
                    }
                } else {
                    MenuGroupsCtrl.ePage.Masters.MenuGroupType.Listsource = [];
                }
            });
        }

        function OnMenuGroupTypeChange($item) {
            OnMenuGroupsClick();
            MenuGroupsCtrl.ePage.Masters.MenuGroupType.ActiveMenuGroupType = $item;
            MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList = [];
            if ($item) {
                GetMenuGroupsList();
            }
        }

        function InitMenuGroupsConfig() {
            MenuGroupsCtrl.ePage.Masters.MenuGroups = {};
            MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups = {};

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

            // GetMenuGroupsList();
            GetRedirectLinkList();
        }

        function GetMenuGroupsList() {

            var _filter = {

                "SAP_FK": MenuGroupsCtrl.ePage.Masters.QueryString.AppPk,
                "GroupType": MenuGroupsCtrl.ePage.Masters.MenuGroupType.ActiveMenuGroupType.Key
                // "SAP_FK": MenuCtrl.ePage.Masters.QueryString.AppPk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.MenuGroups.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MenuGroups.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList = response.data.Response;
                    if (MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList.length > 0) {
                        OnMenuGroupsClick(MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList[0]);
                    } else {
                        OnMenuGroupsClick();
                    }
                } else {
                    MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsListt = [];
                }
            });
        }

        function AddNew() {
            MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups = {};
            Edit();
        }

        function OnMenuGroupsClick($item) {
            MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups = angular.copy($item);
            MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroupsCopy = angular.copy($item);

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
            MenuGroupsCtrl.ePage.Masters.MenuGroups.SaveBtnText = "Please Wait...";
            MenuGroupsCtrl.ePage.Masters.MenuGroups.IsDisableSaveBtn = true;

            var _input = angular.copy(MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups);
            _input.IsModified = true;
            _input.IsDeleted = false;

            apiService.post("eAxisAPI", appConfig.Entities.MenuGroups.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups = angular.copy(_response);
                    var _index = MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList.map(function (e) {
                        return e.PK;
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
            MenuGroupsCtrl.ePage.Masters.MenuGroups.DeleteBtnText = "Please Wait...";
            MenuGroupsCtrl.ePage.Masters.MenuGroups.IsDisableDeleteBtn = true;

            MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups.IsModified = true;
            MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups.IsDeleted = true;

            var _input = [MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups];

            apiService.post("eAxisAPI", appConfig.Entities.MenuGroups.API.Upsert.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups.PK);

                    if (_index !== -1) {
                        MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList.splice(_index, 1);
                        if (MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList.length > 0) {
                            MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups = angular.copy(MenuGroupsCtrl.ePage.Masters.MenuGroups.MenuGroupsList[0]);
                        } else {
                            OnMenuGroupsClick();
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                MenuGroupsCtrl.ePage.Masters.MenuGroups.DeleteBtnText = "Delete";
                MenuGroupsCtrl.ePage.Masters.MenuGroups.IsDisableDeleteBtn = false;
            });
        }

        function GetRedirectLinkList() {
            MenuGroupsCtrl.ePage.Masters.MenuGroups.RedirectPagetList = [{
                Code: "RoleMapping",
                Description: "Role Mapping",
                Icon: "fa fa-sign-in",
                Link: "TC/mapping-vertical",
                Color: "#bd081c",
                AdditionalData: "GRUP_ROLE_APP_TNT",
                ItemName: "MENUGROUP",
                BreadcrumbTitle: "Menu Group Role - GRUP_ROLE_APP_TNT",
                Type: 1,
                GroupType: "Parties"
            }, {
                Code: "DocTypeVisibility",
                Description: "Document Type Visibility",
                Icon: "fa fa-sign-in",
                Link: "TC/mapping-vertical",
                Color: "#bd081c",
                AdditionalData: "GRUP_DTYP_APP_TNT",
                ItemName: "GRUP",
                BreadcrumbTitle: "Group Document Type Visibility - GRUP_DTYP_APP_TNT",
                Type: 2,
                GroupType: "Parties"
            }, {
                Code: "DocTypeOrgVisibility",
                Description: "Document Type Visibility Override by Organization",
                Icon: "fa fa-sign-in",
                Link: "TC/mapping-vertical",
                Color: "#bd081c",
                AdditionalData: "GRUP_DTYP_ORG_APP_TNT",
                ItemName: "GRUP",
                BreadcrumbTitle: "Group Docuent Type Organization Visibility - GRUP_DTYP_ORG_APP_TNT",
                Type: 2,
                GroupType: "Parties"
            }, {
                Code: "CommentTypeVisibility",
                Description: "Comment Type Visibility",
                Icon: "fa fa-sign-in",
                Link: "TC/mapping-vertical",
                Color: "#bd081c",
                AdditionalData: "GRUP_CTYP_APP_TNT",
                ItemName: "GRUP",
                BreadcrumbTitle: "Group Comment Type Visibility - GRUP_CTYP_APP_TNT",
                Type: 2,
                GroupType: "Parties"
            }, {
                Code: "CommentTypeOrgVisibility",
                Description: "Comment Type Visibility Override by Organization",
                Icon: "fa fa-sign-in",
                Link: "TC/mapping-vertical",
                Color: "#bd081c",
                AdditionalData: "GRUP_CTYP_ORG_APP_TNT",
                ItemName: "GRUP",
                BreadcrumbTitle: "Group Comment Type Organization Visibility - GRUP_CTYP_ORG_APP_TNT",
                Type: 2,
                GroupType: "Parties"
            }, {
                Code: "ExceptionTypeMasterOrg",
                Description: "Exception Type Master Override by Organization",
                Icon: "fa fa-sign-in",
                Link: "TC/mapping-vertical",
                Color: "#bd081c",
                AdditionalData: "GRUP_ETYP_MAST_ORG_APP_TNT",
                ItemName: "GRUP",
                BreadcrumbTitle: "Group Exception Type Master Organization - GRUP_ETYP_MAST_ORG_APP_TNT",
                Type: 2,
                GroupType: "Parties"
            }, {
                Code: "ExceptionTypeVisibility",
                Description: "Exception Type Visibility",
                Icon: "fa fa-sign-in",
                Link: "TC/mapping-vertical",
                Color: "#bd081c",
                AdditionalData: "GRUP_ETYP_APP_TNT",
                ItemName: "GRUP",
                BreadcrumbTitle: "Group Exception Type Visibility - GRUP_ETYP_APP_TNT",
                Type: 2,
                GroupType: "Parties"
            }, {
                Code: "ExceptionTypeOrgVisibility",
                Description: "Exception Type Visibility Override by Organization",
                Icon: "fa fa-sign-in",
                Link: "TC/mapping-vertical",
                Color: "#bd081c",
                AdditionalData: "GRUP_ETYP_ORG_APP_TNT",
                ItemName: "GRUP",
                BreadcrumbTitle: "Group Exception Type Organization Visibility - GRUP_ETYP_ORG_APP_TNT",
                Type: 2,
                GroupType: "Parties"
            }, {
                Code: "EventTypeVisibility",
                Description: "Event Type Visibility",
                Icon: "fa fa-sign-in",
                Link: "TC/mapping-vertical",
                Color: "#bd081c",
                AdditionalData: "GRUP_EVTYP_APP_TNT",
                ItemName: "GRUP",
                BreadcrumbTitle: "Group Event Type Visibility - GRUP_EVTYP_APP_TNT",
                Type: 2,
                GroupType: "Parties"
            }, {
                Code: "EventTypeOrgVisibility",
                Description: "Event Type Visibility Override by Organization",
                Icon: "fa fa-sign-in",
                Link: "TC/mapping-vertical",
                Color: "#bd081c",
                AdditionalData: "GRUP_EVTYP_ORG_APP_TNT",
                ItemName: "GRUP",
                BreadcrumbTitle: "Group Event Type Organization Visibility - GRUP_EVTYP_ORG_APP_TNT",
                Type: 2,
                GroupType: "Parties"
            }, {
                Code: "EmailTypeVisibility",
                Description: "Email Type Visibility",
                Icon: "fa fa-sign-in",
                Link: "TC/mapping-vertical",
                Color: "#bd081c",
                AdditionalData: "GRUP_ELTYP_APP_TNT",
                ItemName: "GRUP",
                BreadcrumbTitle: "Group Email Type Visibility - GRUP_ELTYP_APP_TNT",
                Type: 2,
                GroupType: "Parties"
            }, {
                Code: "EmailTypeOrgVisibility",
                Description: "Email Type Visibility Override by Organization",
                Icon: "fa fa-sign-in",
                Link: "TC/mapping-vertical",
                Color: "#bd081c",
                AdditionalData: "GRUP_ELTYP_ORG_APP_TNT",
                ItemName: "GRUP",
                BreadcrumbTitle: "Group Email Type Organization Visibility - GRUP_ELTYP_ORG_APP_TNT",
                Type: 2,
                GroupType: "Parties"
            }, {
                Code: "RoleMapping",
                Description: "Role Mapping",
                Icon: "fa fa-sign-in",
                Link: "TC/mapping-vertical",
                Color: "#bd081c",
                AdditionalData: "GRUP_ROLE_APP_TNT",
                ItemName: "MENUGROUP",
                BreadcrumbTitle: "Menu Group Role - GRUP_ROLE_APP_TNT",
                Type: 1,
                GroupType: "Task"
            }];
        }

        function OnRedirectListClick($item) {
            var _queryString = {
                "AppPk": MenuGroupsCtrl.ePage.Masters.QueryString.AppPk,
                "AppCode": MenuGroupsCtrl.ePage.Masters.QueryString.AppCode,
                "AppName": MenuGroupsCtrl.ePage.Masters.QueryString.AppName
            };
            _queryString.DisplayName = MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups.Description;
            _queryString.ItemPk = MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups.PK;
            _queryString.ItemCode = MenuGroupsCtrl.ePage.Masters.MenuGroups.ActiveMenuGroups.Description;
            _queryString.ItemName = $item.ItemName;
            _queryString.MappingCode = $item.AdditionalData;
            _queryString.BreadcrumbTitle = $item.BreadcrumbTitle;

            if ($item.Link !== "#") {
                $location.path($item.Link + "/" + helperService.encryptData(_queryString));
            }
        }

        Init();
    }
})();
