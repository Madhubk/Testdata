(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCUserRoleAppTenantController", TCUserRoleAppTenantController);

    TCUserRoleAppTenantController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "trustCenterConfig"];

    function TCUserRoleAppTenantController($scope, $location, $uibModal, authService, apiService, helperService, toastr, confirmation, trustCenterConfig) {
        var TCUserRoleAppTenantCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCUserRoleAppTenantCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_UserRoleAppTenant",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TCUserRoleAppTenantCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            TCUserRoleAppTenantCtrl.ePage.Masters.emptyText = "-";

            try {
                TCUserRoleAppTenantCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitApplication();
                    InitUserRoleAppTenant();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            TCUserRoleAppTenantCtrl.ePage.Masters.Breadcrumb = {};
            TCUserRoleAppTenantCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCUserRoleAppTenantCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "userList",
                Description: "User",
                Link: "TC/user-list",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "uesrRoleAppTenant",
                Description: "User Role App Tenant (" + "USER_ROLE_APP_TNT" + ")" + " - " + TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.DisplayName,
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

        // ========================Application Start========================
        function InitApplication() {
            TCUserRoleAppTenantCtrl.ePage.Masters.Application = {};
            TCUserRoleAppTenantCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            TCUserRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);
            if (!TCUserRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication) {
                TCUserRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.AppName
                };
            }
            GetUserRoleAppTenant();
            // GetSentEmailList();
        }
        // ========================Application End========================

        function InitUserRoleAppTenant() {
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant = {};
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.OnUserRoleAppTenantClick = OnUserRoleAppTenantClick;
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.GetRolesList = GetRolesList;
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.OnAutocompleteListSelect = OnAutocompleteListSelect;
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.OnBlurAutoCompleteList = OnBlurAutoCompleteList;
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.OnSelectAutoCompleteList = OnSelectAutoCompleteList;
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.Edit = Edit;
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.Cancel = Cancel;
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.AddNew = AddNew;
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.Save = Save;
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.DeleteConfirmation = DeleteConfirmation;
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.OnSentEmailClick = GetSentEmailList;
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.CheckUIControl = CheckUIControl;

            TCUserRoleAppTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
            TCUserRoleAppTenantCtrl.ePage.Masters.IsDisableDeleteBtn = false;

            if (TCUserRoleAppTenantCtrl.ePage.Masters.ActiveApplication == "EA") {
                OnApplicationChange();
            }

            GetUIControlList();

        }

        function GetUIControlList() {
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UIControlList = undefined;
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
                    TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UIControlList = _controlList;
                } else {
                    TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UIControlList = [];
                }
            });
        }

        function CheckUIControl(controlId) {
            return helperService.checkUIControl(TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UIControlList, controlId);
        }

        function GetUserRoleAppTenant() {
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UserRoleAppTenantList = undefined;
            var _filter = {
                "SAP_FK": TCUserRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "Item_FK": TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.ItemPk,
                "ItemCode": TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.ItemCode,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.UserRole.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.UserRole.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UserRoleAppTenantList = angular.copy(response.data.Response);
                    if (TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UserRoleAppTenantList.length > 0) {
                        OnUserRoleAppTenantClick(TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UserRoleAppTenantList[0]);
                    } else {
                        OnUserRoleAppTenantClick();
                    }
                } else {
                    TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UserRoleAppTenantList = [];
                }
            });
        }

        function OnUserRoleAppTenantClick($item) {
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenant = angular.copy($item);
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenantCopy = angular.copy($item);
            if (!$item) {
                if (TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UserRoleAppTenantList.length > 0) {
                    OnUserRoleAppTenantClick(TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UserRoleAppTenantList[0]);
                }

            }

            if (TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenant) {
                TCUserRoleAppTenantCtrl.ePage.Masters.GenerateScriptInput = {
                    ObjectName: "SECMAPPINGS",
                    ObjectId: TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenant.PK
                };
                TCUserRoleAppTenantCtrl.ePage.Masters.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            }
        }

        function GetRolesList($viewValue) {
            var _filter = {
                "SAP_FK": TCUserRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication.PK,
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
            TCUserRoleAppTenantCtrl.ePage.Masters.SelectedAutocompleteTenant = $item;
        }

        function OnBlurAutoCompleteList($event) {
            TCUserRoleAppTenantCtrl.ePage.Masters.IsSecRoleNoResults = false;
            TCUserRoleAppTenantCtrl.ePage.Masters.IsSecRoleLoading = false;
        }

        function OnSelectAutoCompleteList($item, $model, $label, $event) {
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenant.Access_FK = $item.PK;
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenant.AccessCode = $item.RoleName;
        }

        function EditModalInstance() {
            return TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'userRoleAppTenantEdit'"></div>`
            });
        }

        function AddNew() {
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenant = {};
            Edit();
        }

        function Edit() {
            TCUserRoleAppTenantCtrl.ePage.Masters.SaveBtnText = "OK";
            TCUserRoleAppTenantCtrl.ePage.Masters.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function Save() {
            if (TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenant.PK) {
                UpdateUserRoleAppTenant();
            } else {
                InsertUserRoleAppTenant();
            }
        }

        function InsertUserRoleAppTenant() {
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.SaveBtnText = "Please Wait...";
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.IsDisableSaveBtn = true;

            var _input = angular.copy(TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenant);
            _input.Item_FK = TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.ItemPk;
            _input.ItemCode = TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.ItemCode;
            _input.ItemName = "USER";
            _input.Access_FK = TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenant.Access_FK;
            _input.AccessCode = TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenant.AccessCode;
            _input.AccessTo = "ROLE";
            _input.IsModified = true;
            _input.SAP_FK = TCUserRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication.PK;
            _input.SAP_Code = TCUserRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication.AppCode;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.TNT_FK = authService.getUserInfo().TenantPK;

            apiService.post("authAPI", trustCenterConfig.Entities.API.UserRole.API.Insert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];

                        var _index = TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UserRoleAppTenantList.map(function (value, key) {
                            return value.PK;
                        }).indexOf(_response.PK);

                        if (_index === -1) {
                            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UserRoleAppTenantList.push(_response);
                        } else {
                            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UserRoleAppTenantList[_index] = _response;
                        }

                        OnUserRoleAppTenantClick(_response);
                    }
                } else {
                    toastr.error("Could not Save...!");
                }

                TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.SaveBtnText = "OK";
                TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.IsDisableSaveBtn = false;
                TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.EditModal.dismiss('cancel');
            });
        }

        function UpdateUserRoleAppTenant() {
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.SaveBtnText = "Please Wait...";
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.IsDisableSaveBtn = true;

            var _input = angular.copy(TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenant);
            _input.IsModified = true;

            apiService.post("authAPI", trustCenterConfig.Entities.API.UserRole.API.Update.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;

                    var _index = TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UserRoleAppTenantList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UserRoleAppTenantList.push(_response);
                    } else {
                        TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UserRoleAppTenantList[_index] = _response;
                    }

                    OnUserRoleAppTenantClick(_response);
                } else {
                    toastr.error("Could not Save...!");
                }

                TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.SaveBtnText = "OK";
                TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.IsDisableSaveBtn = false;
                TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.EditModal.dismiss('cancel');
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
            TCUserRoleAppTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
            TCUserRoleAppTenantCtrl.ePage.Masters.IsDisableDeleteBtn = true;

            apiService.get("authAPI", trustCenterConfig.Entities.API.UserRole.API.Delete.Url + TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenant.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UserRoleAppTenantList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenant.PK);

                    if (_index != -1) {
                        TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UserRoleAppTenantList.splice(_index, 1);
                    }
                    TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenant = undefined;
                    OnUserRoleAppTenantClick();
                } else {
                    toastr.error("Could not Delete")
                }

                TCUserRoleAppTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
                TCUserRoleAppTenantCtrl.ePage.Masters.IsDisableDeleteBtn = false;
            });
        }

        function Cancel() {
            if (!TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenant) {
                if (TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UserRoleAppTenantList.length > 0) {
                    TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenant = angular.copy(TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UserRoleAppTenantList[0]);
                } else {
                    TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenant = undefined;
                }
            } else if (TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenantCopy) {
                var _index = TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UserRoleAppTenantList.map(function (value, key) {
                    return value.PK;
                }).indexOf(TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenantCopy.PK);

                if (_index !== -1) {
                    TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenant = angular.copy(TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UserRoleAppTenantList[_index]);
                }
            }

            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.EditModal.dismiss('cancel');
        }

        // --------------- Send Email ------------------------

        function GetSentEmailList() {
            var _filter = {
                "TenantCode": authService.getUserInfo().TenantCode,
                "SAP_FK": TCUserRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "SourceEntityRefKey": "Email Templates",
                "EntitySource": "EXCELCONFIG",
                "ModuleCode": "GEN",
                "Key": "NEW_USER_REGISTRATION"
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.AppSettings.API.FindAll.Url + TCUserRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication.PK, _input).then(function (response) {
                response.data.Response.map(function (value, key) {
                    var value = JSON.parse(value.Value);
                    if (value.DataObjs && value.DataObjs.length > 0) {
                        if (value.DataObjs[0].DataObject) {
                            value.DataObjs[0].DataObject.UserName = TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.ItemCode;
                            OnSentEmailClick(value);
                        }
                    }
                });
            });
        }

        function OnSentEmailClick(value) {
            var _input = value;
            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.Export.API.AsHtml.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _exportAsHtml = response.data.Response;
                    helperService.generateNewPk().then(function (response) {
                        var _emailPk = response;
                        InsertToJobEmail(_exportAsHtml, _emailPk)
                    });
                }
            });

        }

        function InsertToJobEmail(body, emailPk) {
            var _input = {
                "EntityRefKey": TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.ItemPk,
                "EntitySource": "USR",
                "EntityRefCode": TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.ItemCode,
                "PK": emailPk,
                "TenantCode": authService.getUserInfo().TenantCode,
                "TO": TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.ItemCode,
                "FROM": authService.getUserInfo().UserId,
                "Body": body,
                "Subject": "User Creation",
                "Status": "Sent"
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.JobEmail.API.Insert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        toastr.success("Mail Sent Successfully for User Creation...!");
                    }
                }
            });
        }

        Init();
    }
})();