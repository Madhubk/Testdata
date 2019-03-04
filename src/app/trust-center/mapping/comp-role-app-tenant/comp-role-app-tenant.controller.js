(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCCompRoleAppTenantController", TCCompRoleAppTenantController);

    TCCompRoleAppTenantController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "trustCenterConfig"];

    function TCCompRoleAppTenantController($scope, $location, $uibModal, authService, apiService, helperService, toastr, confirmation, trustCenterConfig) {
        var TCCompRoleAppTenantCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCCompRoleAppTenantCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_CompRoleAppTenant",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TCCompRoleAppTenantCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            TCCompRoleAppTenantCtrl.ePage.Masters.emptyText = "-";

            try {
                TCCompRoleAppTenantCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (TCCompRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitApplication();
                    InitCompRoleAppTenant();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================


        function InitBreadcrumb() {
            TCCompRoleAppTenantCtrl.ePage.Masters.Breadcrumb = {};
            TCCompRoleAppTenantCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = "";
            if (TCCompRoleAppTenantCtrl.ePage.Masters.QueryString.BreadcrumbTitle) {
                _breadcrumbTitle = " (" + TCCompRoleAppTenantCtrl.ePage.Masters.QueryString.BreadcrumbTitle + ")";
            }
            TCCompRoleAppTenantCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": TCCompRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCCompRoleAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCCompRoleAppTenantCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "Component",
                Description: "Component",
                Link: "TC/component",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": TCCompRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCCompRoleAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCCompRoleAppTenantCtrl.ePage.Masters.QueryString.AppName,
                    "AdditionalData": TCCompRoleAppTenantCtrl.ePage.Masters.QueryString.AdditionalData
                },
                IsActive: false
            }, {
                Code: "compRoleAppTenant",
                Description: "Component Role App Tenant" + _breadcrumbTitle + " - " + TCCompRoleAppTenantCtrl.ePage.Masters.QueryString.DisplayName,
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
            TCCompRoleAppTenantCtrl.ePage.Masters.Application = {};
            TCCompRoleAppTenantCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            TCCompRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);
            if (!TCCompRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication) {
                TCCompRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": TCCompRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCCompRoleAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCCompRoleAppTenantCtrl.ePage.Masters.QueryString.AppName
                };
            }
            GetCompRoleAppTenant();
        }
        // ========================Application End========================

        function InitCompRoleAppTenant() {
            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant = {};
            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.OnCompRoleAppTenantClick = OnCompRoleAppTenantClick;
            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.GetRolesList = GetRolesList;
            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.OnAutocompleteListSelect = OnAutocompleteListSelect;
            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.OnBlurAutoCompleteList = OnBlurAutoCompleteList;
            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.OnSelectAutoCompleteList = OnSelectAutoCompleteList;
            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.Edit = Edit;
            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.Cancel = Cancel;
            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.AddNew = AddNew;
            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.CheckUIControl = CheckUIControl;
            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.Save = Save;
            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.DeleteConfirmation = DeleteConfirmation;

            TCCompRoleAppTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
            TCCompRoleAppTenantCtrl.ePage.Masters.IsDisableDeleteBtn = false;

            GetUIControlList();
        }

        function GetUIControlList() {
            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.UIControlList = undefined;
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
                    TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.UIControlList = _controlList;
                } else {
                    TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.UIControlList = [];
                }
            });
        }

        function CheckUIControl(controlId) {
            return helperService.checkUIControl(TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.UIControlList, controlId);
        }

        function GetCompRoleAppTenant() {
            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.CompRoleAppTenantList = undefined;
            var _filter = {
                "SAP_FK": TCCompRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "Item_FK": TCCompRoleAppTenantCtrl.ePage.Masters.QueryString.ItemPk,
                "ItemCode": TCCompRoleAppTenantCtrl.ePage.Masters.QueryString.ItemCode,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.ComponentRole.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.ComponentRole.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.CompRoleAppTenantList = angular.copy(response.data.Response);
                    if (TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.CompRoleAppTenantList.length > 0) {
                        OnCompRoleAppTenantClick(TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.CompRoleAppTenantList[0]);
                    } else {
                        OnCompRoleAppTenantClick();
                    }
                } else {
                    TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.CompRoleAppTenantList = [];
                }
            });
        }

        function OnCompRoleAppTenantClick($item) {
            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.ActiveCompRoleAppTenant = angular.copy($item);
            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.ActiveCompRoleAppTenantCopy = angular.copy($item);

            if (!$item) {
                if (TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.CompRoleAppTenantList.length > 0) {
                    OnCompRoleAppTenantClick(TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.CompRoleAppTenantList[0]);
                }
            }

            if (TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.ActiveCompRoleAppTenant) {
                TCCompRoleAppTenantCtrl.ePage.Masters.GenerateScriptInput = {
                    ObjectName: "SECMAPPINGS",
                    ObjectId: TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.ActiveCompRoleAppTenant.PK
                };
                TCCompRoleAppTenantCtrl.ePage.Masters.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            }
        }

        function GetRolesList($viewValue) {
            var _filter = {
                "SAP_FK": TCCompRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication.PK,
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
            TCCompRoleAppTenantCtrl.ePage.Masters.SelectedAutocompleteTenant = $item;
        }

        function OnBlurAutoCompleteList($event) {
            TCCompRoleAppTenantCtrl.ePage.Masters.IsSecRoleNoResults = false;
            TCCompRoleAppTenantCtrl.ePage.Masters.IsSecRoleLoading = false;
        }

        function OnSelectAutoCompleteList($item, $model, $label, $event) {
            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.ActiveCompRoleAppTenant.Access_FK = $item.PK;
            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.ActiveCompRoleAppTenant.AccessCode = $item.RoleName;
        }

        function EditModalInstance() {
            return TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'compRoleAppTenantEdit'"></div>`
            });
        }

        function AddNew() {
            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.ActiveCompRoleAppTenant = {};
            Edit();
        }

        function Edit() {
            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.SaveBtnText = "OK";
            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function Save() {
            if (TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.ActiveCompRoleAppTenant.PK) {
                UpdateCompRoleAppTenant();
            } else {
                InsertCompRoleAppTenant();
            }
        }

        function InsertCompRoleAppTenant() {
            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.SaveBtnText = "Please Wait...";
            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.IsDisableSaveBtn = true;

            var _input = TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.ActiveCompRoleAppTenant;
            _input.Item_FK = TCCompRoleAppTenantCtrl.ePage.Masters.QueryString.ItemPk;
            _input.ItemCode = TCCompRoleAppTenantCtrl.ePage.Masters.QueryString.ItemCode;
            _input.ItemName = TCCompRoleAppTenantCtrl.ePage.Masters.QueryString.ItemName;
            _input.Access_FK = TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.ActiveCompRoleAppTenant.Access_FK;
            _input.AccessCode = TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.ActiveCompRoleAppTenant.AccessCode;
            _input.AccessTo = "ROLE";
            _input.IsModified = true;
            _input.SAP_FK = TCCompRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication.PK;
            _input.SAP_Code = TCCompRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication.AppCode;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.TNT_FK = authService.getUserInfo().TenantPK;

            apiService.post("authAPI", trustCenterConfig.Entities.API.ComponentRole.API.Insert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];

                        var _index = TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.CompRoleAppTenantList.map(function (value, key) {
                            return value.PK;
                        }).indexOf(_response.PK);

                        if (_index === -1) {
                            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.CompRoleAppTenantList.push(_response);
                        } else {
                            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.CompRoleAppTenantList[_index] = _response;
                        }

                        OnCompRoleAppTenantClick(_response);
                    }
                } else {
                    toastr.error("Could not Save...!");
                }

                TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.SaveBtnText = "OK";
                TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.IsDisableSaveBtn = false;
                TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.EditModal.dismiss('cancel');
            });
        }

        function UpdateCompRoleAppTenant() {
            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.SaveBtnText = "Please Wait...";
            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.IsDisableSaveBtn = true;

            var _input = TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.ActiveCompRoleAppTenant;
            _input.IsModified = true;

            apiService.post("authAPI", trustCenterConfig.Entities.API.ComponentRole.API.Update.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;

                    var _index = TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.CompRoleAppTenantList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.CompRoleAppTenantList.push(_response);
                    } else {
                        TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.CompRoleAppTenantList[_index] = _response;
                    }

                    OnCompRoleAppTenantClick(_response);
                } else {
                    toastr.error("Could not Save...!");
                }

                TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.SaveBtnText = "OK";
                TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.IsDisableSaveBtn = false;
                TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.EditModal.dismiss('cancel');
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
            TCCompRoleAppTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
            TCCompRoleAppTenantCtrl.ePage.Masters.IsDisableDeleteBtn = true;

            apiService.get("authAPI", trustCenterConfig.Entities.API.ComponentRole.API.Delete.Url + TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.ActiveCompRoleAppTenant.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.CompRoleAppTenantList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.ActiveCompRoleAppTenant.PK);

                    if (_index != -1) {
                        TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.CompRoleAppTenantList.splice(_index, 1);
                    }
                    TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.ActiveCompRoleAppTenant = undefined;
                    OnCompRoleAppTenantClick();
                } else {
                    toastr.error("Could not Delete")
                }

                TCCompRoleAppTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
                TCCompRoleAppTenantCtrl.ePage.Masters.IsDisableDeleteBtn = false;
            });
        }

        function Cancel() {
            if (!TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.ActiveCompRoleAppTenant) {
                if (TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.CompRoleAppTenantList.length > 0) {
                    TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.ActiveCompRoleAppTenant = angular.copy(TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.CompRoleAppTenantList[0]);
                } else {
                    TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.ActiveCompRoleAppTenant = undefined;
                }
            } else if (TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.ActiveCompRoleAppTenantCopy) {
                var _index = TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.CompRoleAppTenantList.map(function (value, key) {
                    return value.PK;
                }).indexOf(TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.ActiveCompRoleAppTenantCopy.PK);

                if (_index !== -1) {
                    TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.ActiveCompRoleAppTenant = angular.copy(TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.CompRoleAppTenantList[_index]);
                }
            }

            TCCompRoleAppTenantCtrl.ePage.Masters.CompRoleAppTenant.EditModal.dismiss('cancel');
        }

        Init();
    }
})();