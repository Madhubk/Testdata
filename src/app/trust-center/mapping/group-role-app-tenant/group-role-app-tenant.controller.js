(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCGroupRoleAppTenantController", TCGroupRoleAppTenantController);

    TCGroupRoleAppTenantController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "trustCenterConfig"];

    function TCGroupRoleAppTenantController($scope, $location, $uibModal, authService, apiService, helperService, toastr, confirmation, trustCenterConfig) {
        var TCGroupRoleAppTenantCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCGroupRoleAppTenantCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_GroupRoleAppTenant",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TCGroupRoleAppTenantCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            TCGroupRoleAppTenantCtrl.ePage.Masters.emptyText = "-";

            try {
                TCGroupRoleAppTenantCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (TCGroupRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitApplication();
                    InitGroupRoleAppTenant();
                }
            } catch (error) {
                console.log(error);
            }
        }

        //======================= BreadCrumb Start ==========================//

        function InitBreadcrumb() {
            TCGroupRoleAppTenantCtrl.ePage.Masters.Breadcrumb = {};
            TCGroupRoleAppTenantCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = "";
            if (TCGroupRoleAppTenantCtrl.ePage.Masters.QueryString.BreadcrumbTitle) {
                _breadcrumbTitle = " (" + TCGroupRoleAppTenantCtrl.ePage.Masters.QueryString.BreadcrumbTitle + ")";
            }
            TCGroupRoleAppTenantCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": TCGroupRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCGroupRoleAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCGroupRoleAppTenantCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "menuGroup",
                Description: "MenuGroup",
                Link: "TC/menu-group",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": TCGroupRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCGroupRoleAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCGroupRoleAppTenantCtrl.ePage.Masters.QueryString.AppName,
                    "AdditionalData": TCGroupRoleAppTenantCtrl.ePage.Masters.QueryString.AdditionalData

                },
                IsActive: false
            }, {
                Code: "groupRoleAppTenant",
                Description: "Group Role App Tenant" + _breadcrumbTitle + " - " + TCGroupRoleAppTenantCtrl.ePage.Masters.QueryString.DisplayName,
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

        // ========================Application Start========================
        function InitApplication() {
            TCGroupRoleAppTenantCtrl.ePage.Masters.Application = {};
            TCGroupRoleAppTenantCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            TCGroupRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);
            if (!TCGroupRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication) {
                TCGroupRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": TCGroupRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCGroupRoleAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCGroupRoleAppTenantCtrl.ePage.Masters.QueryString.AppName
                };
            }
            GetGroupRoleAppTenant();
            GetRedirectLinkList();
        }

        function InitGroupRoleAppTenant() {
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant = {};
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.OnGroupRoleAppTenantClick = OnGroupRoleAppTenantClick;
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.GetRolesList = GetRolesList;

            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.OnAutocompleteListSelect = OnAutocompleteListSelect;
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.OnBlurAutoCompleteList = OnBlurAutoCompleteList;
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.OnSelectAutoCompleteList = OnSelectAutoCompleteList;
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.Edit = Edit;
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.Cancel = Cancel;
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.OnUserListClick = OnUserListClick;
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.AddNew = AddNew;
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.CheckUIControl = CheckUIControl;
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.Save = Save;
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.DeleteConfirmation = DeleteConfirmation;

            TCGroupRoleAppTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
            TCGroupRoleAppTenantCtrl.ePage.Masters.IsDisableDeleteBtn = false;

            GetUIControlList();

        }

        function GetUIControlList() {
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.UIControlList = undefined;
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
                    TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.UIControlList = _controlList;
                } else {
                    TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.UIControlList = [];
                }
            });
        }

        function CheckUIControl(controlId) {
            return helperService.checkUIControl(TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.UIControlList, controlId);
        }

        function GetGroupRoleAppTenant() {
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.GroupRoleAppTenantList = undefined;
            var _filter = {
                "SAP_FK": TCGroupRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "Item_FK": TCGroupRoleAppTenantCtrl.ePage.Masters.QueryString.ItemPk,
                "ItemCode": TCGroupRoleAppTenantCtrl.ePage.Masters.QueryString.ItemCode,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.GroupRole.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.GroupRole.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.GroupRoleAppTenantList = angular.copy(response.data.Response);
                    if (TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.GroupRoleAppTenantList.length > 0) {
                        OnGroupRoleAppTenantClick(TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.GroupRoleAppTenantList[0]);
                    } else {
                        OnGroupRoleAppTenantClick();
                    }
                } else {
                    TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.GroupRoleAppTenantList = [];
                }
            });
        }

        function OnGroupRoleAppTenantClick($item) {
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.ActiveGroupRoleAppTenant = angular.copy($item);
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.ActiveGroupRoleAppTenantCopy = angular.copy($item);

            if (!$item) {
                if (TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.GroupRoleAppTenantList.length > 0) {
                    OnGroupRoleAppTenantClick(TCCompRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.GroupRoleAppTenantList[0]);
                }
            }
            
            if (TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.ActiveGroupRoleAppTenant) {
                TCGroupRoleAppTenantCtrl.ePage.Masters.GenerateScriptInput = {
                    ObjectName: "SECMAPPINGS",
                    ObjectId: TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.ActiveGroupRoleAppTenant.PK
                };
                TCGroupRoleAppTenantCtrl.ePage.Masters.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            }
        }

        function GetRolesList($viewValue) {
            var _filter = {
                "SAP_FK": TCGroupRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "TenantCode": authService.getUserInfo().TenantCode
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
            TCGroupRoleAppTenantCtrl.ePage.Masters.SelectedAutocompleteTenant = $item;
        }

        function OnBlurAutoCompleteList($event) {
            TCGroupRoleAppTenantCtrl.ePage.Masters.IsSecRoleNoResults = false;
            TCGroupRoleAppTenantCtrl.ePage.Masters.IsSecRoleLoading = false;
        }

        function OnSelectAutoCompleteList($item, $model, $label, $event) {
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.ActiveGroupRoleAppTenant.Access_FK = $item.PK;
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.ActiveGroupRoleAppTenant.AccessCode = $item.RoleName;
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.ActiveGroupRoleAppTenant.AccessTo = "ROLE";

        }

        function EditModalInstance() {
            return TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'groupRoleAppTenantEdit'"></div>`
            });
        }

        function AddNew() {
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.ActiveGroupRoleAppTenant = {};
            Edit();
        }

        function Edit() {
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.SaveBtnText = "OK";
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function Save() {
            if (TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.ActiveGroupRoleAppTenant.PK) {
                UpdateGroupRoleAppTenant();
            } else {
                InsertGroupRoleAppTenant();
            }
        }

        function InsertGroupRoleAppTenant() {
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.SaveBtnText = "Please Wait...";
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.IsDisableSaveBtn = true;

            var _input = TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.ActiveGroupRoleAppTenant;
            _input.Item_FK = TCGroupRoleAppTenantCtrl.ePage.Masters.QueryString.ItemPk;
            _input.ItemCode = TCGroupRoleAppTenantCtrl.ePage.Masters.QueryString.ItemCode;
            _input.ItemName = TCGroupRoleAppTenantCtrl.ePage.Masters.QueryString.ItemName;
            _input.Access_FK = TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.ActiveGroupRoleAppTenant.Access_FK;
            _input.AccessCode = TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.ActiveGroupRoleAppTenant.AccessCode;
            _input.AccessTo = "ROLE";
            _input.IsModified = true;
            _input.SAP_FK = TCGroupRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication.PK;
            _input.SAP_Code = TCGroupRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication.AppCode;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.TNT_FK = authService.getUserInfo().TenantPK;

            apiService.post("authAPI", trustCenterConfig.Entities.API.GroupRole.API.Insert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];

                        var _index = TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.GroupRoleAppTenantList.map(function (value, key) {
                            return value.PK;
                        }).indexOf(_response.PK);

                        if (_index === -1) {
                            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.GroupRoleAppTenantList.push(_response);
                        } else {
                            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.GroupRoleAppTenantList[_index] = _response;
                        }

                        OnGroupRoleAppTenantClick(_response);
                    }
                } else {
                    toastr.error("Could not Save...!");
                }

                TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.SaveBtnText = "OK";
                TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.IsDisableSaveBtn = false;
                TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.EditModal.dismiss('cancel');
            });
        }

        function UpdateGroupRoleAppTenant() {
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.SaveBtnText = "Please Wait...";
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.IsDisableSaveBtn = true;

            var _input = TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.ActiveGroupRoleAppTenant;
            _input.IsModified = true;

            apiService.post("authAPI", trustCenterConfig.Entities.API.GroupRole.API.Update.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;

                    var _index = TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.GroupRoleAppTenantList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.GroupRoleAppTenantList.push(_response);
                    } else {
                        TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.GroupRoleAppTenantList[_index] = _response;
                    }

                    OnGroupRoleAppTenantClick(_response);
                } else {
                    toastr.error("Could not Save...!");
                }

                TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.SaveBtnText = "OK";
                TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.IsDisableSaveBtn = false;
                TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.EditModal.dismiss('cancel');
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
            TCGroupRoleAppTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
            TCGroupRoleAppTenantCtrl.ePage.Masters.IsDisableDeleteBtn = true;

            apiService.get("authAPI", trustCenterConfig.Entities.API.GroupRole.API.Delete.Url + TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.ActiveGroupRoleAppTenant.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.GroupRoleAppTenantList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.ActiveGroupRoleAppTenant.PK);

                    if (_index != -1) {
                        TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.GroupRoleAppTenantList.splice(_index, 1);
                    }
                    TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.ActiveGroupRoleAppTenant = undefined;
                    OnGroupRoleAppTenantClick();
                } else {
                    toastr.error("Could not Delete")
                }

                TCGroupRoleAppTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
                TCGroupRoleAppTenantCtrl.ePage.Masters.IsDisableDeleteBtn = false;
            });
        }

        function Cancel() {
            if (!TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.ActiveGroupRoleAppTenant) {
                if (TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.GroupRoleAppTenantList.length > 0) {
                    TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.ActiveGroupRoleAppTenant = angular.copy(TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.GroupRoleAppTenantList[0]);
                } else {
                    TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.ActiveGroupRoleAppTenant = undefined;
                }
            } else if (TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.ActiveGroupRoleAppTenantCopy) {
                var _index = TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.GroupRoleAppTenantList.map(function (value, key) {
                    return value.PK;
                }).indexOf(TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.ActiveGroupRoleAppTenantCopy.PK);

                if (_index !== -1) {
                    TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.ActiveGroupRoleAppTenant = angular.copy(TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.GroupRoleAppTenantList[_index]);
                }
            }

            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.EditModal.dismiss('cancel');
        }

        function GetRedirectLinkList() {
            TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.RedirectPagetList = [{
                Code: "UserList",
                Description: "User List",
                Icon: "fa fa-user",
                Link: "#/TC/dynamic-list-view/UserProfile",
                Color: "#333333"
            }];
        }

        function OnUserListClick($item) {
            var _queryString = {
                USR_ROLES: TCGroupRoleAppTenantCtrl.ePage.Masters.GroupRoleAppTenant.ActiveGroupRoleAppTenant.AccessCode
            };
            var _queryString2 = angular.copy(TCGroupRoleAppTenantCtrl.ePage.Masters.QueryString);
            _queryString2.BreadcrumbTitle = undefined;

            if ($item.Link != "#") {
                window.open($item.Link + "/" + helperService.encryptData(_queryString2) + '?item=' + helperService.encryptData(_queryString), "_blank");
            }
        }

        Init();
    }

})();