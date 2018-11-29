(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCUserRoleAppTenantController", TCUserRoleAppTenantController);

    TCUserRoleAppTenantController.$inject = ["$scope", "$location", "$timeout", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "trustCenterConfig"];

    function TCUserRoleAppTenantController($scope, $location, $timeout, $uibModal, authService, apiService, helperService, toastr, confirmation, trustCenterConfig) {
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
                Description: "User Role App Tenant (" + TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.MappingCode + ")" + " - " + TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.DisplayName,
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
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.Save = SaveUserRoleAppTenant;
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.DeleteConfirmation = DeleteConfirmation;
            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.OnSentEmailClick = OnSentEmailClick;

            TCUserRoleAppTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
            TCUserRoleAppTenantCtrl.ePage.Masters.IsDisableDeleteBtn = false;

            if (TCUserRoleAppTenantCtrl.ePage.Masters.ActiveApplication == "EA") {
                OnApplicationChange();
            }
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

        function SaveUserRoleAppTenant() {
            TCUserRoleAppTenantCtrl.ePage.Masters.SaveBtnTxt = "Please Wait...";
            TCUserRoleAppTenantCtrl.ePage.Masters.IsDisabledSaveBtn = true;

            var _input = angular.copy(TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenant);
            _input.IsModified = true;

            _input.SAP_Code = TCUserRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication.AppCode;
            _input.SAP_FK = TCUserRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication.PK;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.TNT_FK = authService.getUserInfo().TenantPK;
            _input.Item_FK = TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.ItemPk;
            _input.ItemCode = TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.ItemCode;
            _input.ItemName = TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.ItemName;
            _input.AccessCode = TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenant.AccessCode;
            _input.AccessTo = "ROLE";
            _input.IsModified = true;

            if (_input.PK) {
                apiService.post("authAPI", trustCenterConfig.Entities.API.UserRole.API.Update.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenant = response.data.Response;
                    } else {
                        toastr.error("Could not Update...!");
                    }

                    TCUserRoleAppTenantCtrl.ePage.Masters.SaveBtnText = "OK";
                    TCUserRoleAppTenantCtrl.ePage.Masters.IsDisableSaveBtn = false;
                });
            } else {
                apiService.post("authAPI", trustCenterConfig.Entities.API.UserRole.API.Insert.Url, [_input]).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.length > 0) {
                            if (!TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UserRoleAppTenantList) {
                                TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UserRoleAppTenantList = [];
                            }

                            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.UserRoleAppTenantList.push(response.data.Response[0]);
                            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenant = response.data.Response[0];
                        }
                    } else {
                        toastr.error("Could not Insert...!");
                    }

                    TCUserRoleAppTenantCtrl.ePage.Masters.SaveBtnTxt = "Save";
                    TCUserRoleAppTenantCtrl.ePage.Masters.IsDisabledSaveBtn = false;

                    OnUserRoleAppTenantClick(TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.ActiveUserRoleAppTenant);
                });
            }

            TCUserRoleAppTenantCtrl.ePage.Masters.UserRoleAppTenant.EditModal.dismiss('cancel');
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
        function OnSentEmailClick() {
            var _filter = {
                SourceEntityRefKey: "Email Templates",
                EntitySource: "EXCELCONFIG",
                ModuleCode: "GEN",
                Key: "NEW_USER_REGISTRATION",
                SAP_FK: TCUserRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication.PK,
                TenantCode: authService.getUserInfo().TenantCode,
            };

            var obj = {
                UserId: TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.ItemCode
            };

            helperService.excelDocObjPreparation(_filter, obj).then(function (response) {
                if (response) {
                    helperService.generateNewPk().then(function (response) {
                        TCUserRoleAppTenantCtrl.ePage.Masters.NewGUID = response;
                        InsertToJobEmail();
                    });
                }
            });
        }

        function InsertToJobEmail() {
            var _input = {
                "PK": TCUserRoleAppTenantCtrl.ePage.Masters.NewGUID,
                "TenantCode": authService.getUserInfo().TenantCode,
                "TO": TCUserRoleAppTenantCtrl.ePage.Masters.QueryString.ItemCode,
                "TypeCode": "NEW_USER_REGISTRATION",
                "Template": "NEW_USER_REGISTRATION",
                "FROM": "dneeraja@20cube.com",
                "Body": "User has Created",
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
