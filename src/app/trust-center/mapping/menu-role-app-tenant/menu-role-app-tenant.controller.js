(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCMenuRoleAppTenantController", TCMenuRoleAppTenantController);

    TCMenuRoleAppTenantController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "trustCenterConfig"];

    function TCMenuRoleAppTenantController($scope, $location, $uibModal, authService, apiService, helperService, toastr, confirmation, trustCenterConfig) {
        var TCMenuRoleAppTenantCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCMenuRoleAppTenantCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_MenuRoleAppTenant",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TCMenuRoleAppTenantCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            TCMenuRoleAppTenantCtrl.ePage.Masters.emptyText = "-";

            try {
                TCMenuRoleAppTenantCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (TCMenuRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitMenuRoleAppTenant();
                }
            } catch (error) {
                console.log(error);
            }
        }

        //======================= BreadCrumb Start ==========================//

        function InitBreadcrumb() {
            TCMenuRoleAppTenantCtrl.ePage.Masters.Breadcrumb = {};
            TCMenuRoleAppTenantCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = "";
            if (TCMenuRoleAppTenantCtrl.ePage.Masters.QueryString.BreadcrumbTitle) {
                _breadcrumbTitle = " (" + TCMenuRoleAppTenantCtrl.ePage.Masters.QueryString.BreadcrumbTitle + ")";
            }
            TCMenuRoleAppTenantCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": TCMenuRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCMenuRoleAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCMenuRoleAppTenantCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "menu",
                Description: "Menu",
                Link: "TC/menu",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": TCMenuRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCMenuRoleAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCMenuRoleAppTenantCtrl.ePage.Masters.QueryString.AppName,
                    "AdditionalData": TCMenuRoleAppTenantCtrl.ePage.Masters.QueryString.AdditionalData

                },
                IsActive: false
            }, {
                Code: "menuRoleAppTenant",
                Description: "Menu Role App Tenant (" + "MENU_ROLE_APP_TNT" + ")" + " - " + TCMenuRoleAppTenantCtrl.ePage.Masters.QueryString.DisplayName,
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

        //======================== BreadCrumb End =============================//

        function InitMenuRoleAppTenant() {
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant = {};
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.OnMenuRoleAppTenantClick = OnMenuRoleAppTenantClick;
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.GetRolesList = GetRolesList;

            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.OnAutocompleteListSelect = OnAutocompleteListSelect;
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.OnBlurAutoCompleteList = OnBlurAutoCompleteList;
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.OnSelectAutoCompleteList = OnSelectAutoCompleteList;
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.Edit = Edit;
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.Cancel = Cancel;
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.OnUserListClick = OnUserListClick;
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.AddNew = AddNew;
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.CheckUIControl = CheckUIControl;
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.Save = Save;
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.DeleteConfirmation = DeleteConfirmation;

            TCMenuRoleAppTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
            TCMenuRoleAppTenantCtrl.ePage.Masters.IsDisableDeleteBtn = false;

            GetMenuRoleAppTenant();
            GetRedirectLinkList();
        }

        function CheckUIControl(controlId) {
            return helperService.checkUIControl(controlId);
        }

        function GetMenuRoleAppTenant() {
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.MenuRoleAppTenantList = undefined;
            var _filter = {
                "SAP_FK": TCMenuRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                "Item_FK": TCMenuRoleAppTenantCtrl.ePage.Masters.QueryString.ItemPk,
                "ItemCode": TCMenuRoleAppTenantCtrl.ePage.Masters.QueryString.ItemCode,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.MenuRole.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.MenuRole.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.MenuRoleAppTenantList = angular.copy(response.data.Response);
                    if (TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.MenuRoleAppTenantList.length > 0) {
                        OnMenuRoleAppTenantClick(TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.MenuRoleAppTenantList[0]);
                    } else {
                        OnMenuRoleAppTenantClick();
                    }
                } else {
                    TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.MenuRoleAppTenantList = [];
                }
            });
        }

        function OnMenuRoleAppTenantClick($item) {
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.ActiveMenuRoleAppTenant = angular.copy($item);
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.ActiveMenuRoleAppTenantCopy = angular.copy($item);

            if (!$item) {
                if (TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.MenuRoleAppTenantList.length > 0) {
                    OnMenuRoleAppTenantClick(TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.MenuRoleAppTenantList[0]);
                }
            }


            if (TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.ActiveMenuRoleAppTenant) {
                TCMenuRoleAppTenantCtrl.ePage.Masters.GenerateScriptInput = {
                    ObjectName: "SECMAPPINGS",
                    ObjectId: TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.ActiveMenuRoleAppTenant.PK
                };
                TCMenuRoleAppTenantCtrl.ePage.Masters.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            }
        }

        function GetRolesList($viewValue) {
            var _filter = {
                "SAP_FK": TCMenuRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk
            };
            if ($viewValue != "#") {
                _filter.Autocompletefield = $viewValue;
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecRole.API.FindAll.FilterID,
            };

            return apiService.post("authAPI", trustCenterConfig.Entities.API.SecRole.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    return response.data.Response;
                }
            });
        }

        function OnAutocompleteListSelect($item, $model, $label, $event) {
            TCMenuRoleAppTenantCtrl.ePage.Masters.SelectedAutocompleteTenant = $item;
        }

        function OnBlurAutoCompleteList($event) {
            TCMenuRoleAppTenantCtrl.ePage.Masters.IsSecRoleNoResults = false;
            TCMenuRoleAppTenantCtrl.ePage.Masters.IsSecRoleLoading = false;
        }

        function OnSelectAutoCompleteList($item, $model, $label, $event) {
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.ActiveMenuRoleAppTenant.Access_FK = $item.PK;
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.ActiveMenuRoleAppTenant.AccessCode = $item.RoleName;
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.ActiveMenuRoleAppTenant.AccessTo = "ROLE";
        }

        function EditModalInstance() {
            return TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'menuRoleAppTenantEdit'"></div>`
            });
        }

        function AddNew() {
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.ActiveMenuRoleAppTenant = {};
            Edit();
        }

        function Edit() {
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.SaveBtnText = "OK";
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function Save() {
            if (TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.ActiveMenuRoleAppTenant.PK) {
                UpdateMenuRoleAppTenant();
            } else {
                InsertMenuRoleAppTenant();
            }
        }

        function InsertMenuRoleAppTenant() {
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.SaveBtnText = "Please Wait...";
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.IsDisableSaveBtn = true;

            var _input = TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.ActiveMenuRoleAppTenant;
            _input.Item_FK = TCMenuRoleAppTenantCtrl.ePage.Masters.QueryString.ItemPk;
            _input.ItemCode = TCMenuRoleAppTenantCtrl.ePage.Masters.QueryString.ItemCode;
            _input.ItemName = "MENU";
            _input.Access_FK = TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.ActiveMenuRoleAppTenant.Access_FK;
            _input.AccessCode = TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.ActiveMenuRoleAppTenant.AccessCode;
            _input.AccessTo = "ROLE";
            _input.IsModified = true;
            _input.SAP_FK = TCMenuRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk;
            _input.SAP_Code = TCMenuRoleAppTenantCtrl.ePage.Masters.QueryString.AppCode;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.TNT_FK = authService.getUserInfo().TenantPK;

            apiService.post("authAPI", trustCenterConfig.Entities.API.MenuRole.API.Insert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];

                        var _index = TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.MenuRoleAppTenantList.map(function (value, key) {
                            return value.PK;
                        }).indexOf(_response.PK);

                        if (_index === -1) {
                            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.MenuRoleAppTenantList.push(_response);
                        } else {
                            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.MenuRoleAppTenantList[_index] = _response;
                        }

                        OnMenuRoleAppTenantClick(_response);
                    }
                } else {
                    toastr.error("Could not Save...!");
                }

                TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.SaveBtnText = "OK";
                TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.IsDisableSaveBtn = false;
                TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.EditModal.dismiss('cancel');
            });
        }

        function UpdateMenuRoleAppTenant() {
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.SaveBtnText = "Please Wait...";
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.IsDisableSaveBtn = true;

            var _input = TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.ActiveMenuRoleAppTenant;
            _input.IsModified = true;

            apiService.post("authAPI", trustCenterConfig.Entities.API.MenuRole.API.Update.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;

                    var _index = TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.MenuRoleAppTenantList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.MenuRoleAppTenantList.push(_response);
                    } else {
                        TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.MenuRoleAppTenantList[_index] = _response;
                    }

                    OnMenuRoleAppTenantClick(_response);
                } else {
                    toastr.error("Could not Save...!");
                }

                TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.SaveBtnText = "OK";
                TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.IsDisableSaveBtn = false;
                TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.EditModal.dismiss('cancel');
            });
        }

        function DeleteConfirmation() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
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
            TCMenuRoleAppTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
            TCMenuRoleAppTenantCtrl.ePage.Masters.IsDisableDeleteBtn = true;

            apiService.get("authAPI", trustCenterConfig.Entities.API.MenuRole.API.Delete.Url + TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.ActiveMenuRoleAppTenant.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.MenuRoleAppTenantList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.ActiveMenuRoleAppTenant.PK);

                    if (_index != -1) {
                        TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.MenuRoleAppTenantList.splice(_index, 1);
                    }
                    TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.ActiveMenuRoleAppTenant = undefined;
                    OnMenuRoleAppTenantClick();
                } else {
                    toastr.error("Could not Delete")
                }

                TCMenuRoleAppTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
                TCMenuRoleAppTenantCtrl.ePage.Masters.IsDisableDeleteBtn = false;
            });
        }

        function Cancel() {
            if (!TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.ActiveMenuRoleAppTenant) {
                if (TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.MenuRoleAppTenantList.length > 0) {
                    TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.ActiveMenuRoleAppTenant = angular.copy(TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.MenuRoleAppTenantList[0]);
                } else {
                    TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.ActiveMenuRoleAppTenant = undefined;
                }
            } else if (TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.ActiveMenuRoleAppTenantCopy) {
                var _index = TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.MenuRoleAppTenantList.map(function (value, key) {
                    return value.PK;
                }).indexOf(TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.ActiveMenuRoleAppTenantCopy.PK);

                if (_index !== -1) {
                    TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.ActiveMenuRoleAppTenant = angular.copy(TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.MenuRoleAppTenantList[_index]);
                }
            }

            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.EditModal.dismiss('cancel');
        }

        function GetRedirectLinkList() {
            TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.RedirectPagetList = [{
                Code: "UserList",
                Description: "User List",
                Icon: "fa fa-user",
                Link: "#/TC/dynamic-list-view/UserProfile",
                Color: "#333333"
            }];
        }

        function OnUserListClick($item) {
            var _queryString = {
                USR_ROLES: TCMenuRoleAppTenantCtrl.ePage.Masters.MenuRoleAppTenant.ActiveMenuRoleAppTenant.AccessCode
            };
            var _queryString2 = angular.copy(TCMenuRoleAppTenantCtrl.ePage.Masters.QueryString);
            _queryString2.BreadcrumbTitle = undefined;

            if ($item.Link != "#") {
                window.open($item.Link + "/" + helperService.encryptData(_queryString2) + '?item=' + helperService.encryptData(_queryString), "_blank");
            }
        }
        Init();
    }
})();
