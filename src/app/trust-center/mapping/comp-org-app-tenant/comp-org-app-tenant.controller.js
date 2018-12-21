(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCCompOrgAppTenantController", TCCompOrgAppTenantController);

    TCCompOrgAppTenantController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "trustCenterConfig"];

    function TCCompOrgAppTenantController($scope, $location, $uibModal, authService, apiService, helperService, toastr, confirmation, trustCenterConfig) {
        var TCCompOrgAppTenantCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCCompOrgAppTenantCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_CompOrgAppTenant",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TCCompOrgAppTenantCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            TCCompOrgAppTenantCtrl.ePage.Masters.emptyText = "-";

            try {
                TCCompOrgAppTenantCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (TCCompOrgAppTenantCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitApplication();
                    InitCompOrgAppTenant();
                }
            } catch (error) {
                console.log(error);
            }
        }
        // ========================Breadcrumb Start========================


        function InitBreadcrumb() {
            TCCompOrgAppTenantCtrl.ePage.Masters.Breadcrumb = {};
            TCCompOrgAppTenantCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = "";
            if (TCCompOrgAppTenantCtrl.ePage.Masters.QueryString.BreadcrumbTitle) {
                _breadcrumbTitle = " (" + TCCompOrgAppTenantCtrl.ePage.Masters.QueryString.BreadcrumbTitle + ")";
            }
            TCCompOrgAppTenantCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": TCCompOrgAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCCompOrgAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCCompOrgAppTenantCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "Component",
                Description: "Component",
                Link: "TC/component",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": TCCompOrgAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCCompOrgAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCCompOrgAppTenantCtrl.ePage.Masters.QueryString.AppName,
                    "AdditionalData": TCCompOrgAppTenantCtrl.ePage.Masters.QueryString.AdditionalData
                },
                IsActive: false
            }, {
                Code: "compOrgAppTenant",
                Description: "Component Org App Tenant" + _breadcrumbTitle + " - "+TCCompOrgAppTenantCtrl.ePage.Masters.QueryString.DisplayName,
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

        // ===================== BreadCrumb End =========================================


        // ========================Application Start========================
        function InitApplication() {
            TCCompOrgAppTenantCtrl.ePage.Masters.Application = {};
            TCCompOrgAppTenantCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            TCCompOrgAppTenantCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);
            if (!TCCompOrgAppTenantCtrl.ePage.Masters.Application.ActiveApplication) {
                TCCompOrgAppTenantCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": TCCompOrgAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCCompOrgAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCCompOrgAppTenantCtrl.ePage.Masters.QueryString.AppName
                };
            }
            GetCompOrgAppTenant();
        }
        // ========================Application End========================

        function InitCompOrgAppTenant() {
            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant = {};
            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.OnCompOrgAppTenantClick = OnCompOrgAppTenantClick;
            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.GetOrganizationList = GetOrganizationList;
            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.OnAutocompleteListSelect = OnAutocompleteListSelect;
            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.OnBlurAutoCompleteList = OnBlurAutoCompleteList;
            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.OnSelectAutoCompleteList = OnSelectAutoCompleteList;
            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.Edit = Edit;
            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.Cancel = Cancel;
            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.AddNew = AddNew;
            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.CheckUIControl = CheckUIControl;
            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.Save = Save;
            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.DeleteConfirmation = DeleteConfirmation;

            TCCompOrgAppTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
            TCCompOrgAppTenantCtrl.ePage.Masters.IsDisableDeleteBtn = false;

            GetUIControlList();
        }

        function GetUIControlList() {
            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.UIControlList = undefined;
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
                    TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.UIControlList = _controlList;
                } else {
                    TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.UIControlList = [];
                }
            });
        }

        function CheckUIControl(controlId) {
            return helperService.checkUIControl(TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.UIControlList, controlId);
        }

        function GetCompOrgAppTenant() {
            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.CompOrgAppTenantList = undefined;
            var _filter = {
                "Item_FK": TCCompOrgAppTenantCtrl.ePage.Masters.QueryString.ItemPk,
                "ItemCode": TCCompOrgAppTenantCtrl.ePage.Masters.QueryString.ItemCode,
                "SAP_FK": TCCompOrgAppTenantCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.ComponentOrganisation.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.ComponentOrganisation.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.CompOrgAppTenantList = angular.copy(response.data.Response);
                    if (TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.CompOrgAppTenantList.length > 0) {
                        OnCompOrgAppTenantClick(TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.CompOrgAppTenantList[0]);
                    } else {
                        OnCompOrgAppTenantClick();
                    }
                } else {
                    TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.CompOrgAppTenantList = [];
                }
            });
        }

        function OnCompOrgAppTenantClick($item) {
            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.ActiveCompOrgAppTenant = angular.copy($item);
            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.ActiveCompOrgAppTenantCopy = angular.copy($item);

            if (!$item) {
                if (TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.CompOrgAppTenantList.length > 0) {
                    OnCompOrgAppTenantClick(TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.CompOrgAppTenantList[0]);
                }
            }
        }

        function GetOrganizationList($viewValue) {
            if ($viewValue !== "#") {
                var _filter = {
                    "Autocompletefield": $viewValue
                };
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.OrgHeader.API.MasterFindAll.FilterID,
            };

            return apiService.post("eAxisAPI", trustCenterConfig.Entities.API.OrgHeader.API.MasterFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    return response.data.Response;
                }
            });
        }

        function OnAutocompleteListSelect($item, $model, $label, $event) {
            TCCompOrgAppTenantCtrl.ePage.Masters.SelectedAutocompleteTenant = $item;
        }

        function OnBlurAutoCompleteList($event) {
            TCCompOrgAppTenantCtrl.ePage.Masters.IsOrganizationNoResults = false;
            TCCompOrgAppTenantCtrl.ePage.Masters.IsOrganizationLoading = false;
        }

        function OnSelectAutoCompleteList($item, $model, $label, $event) {
            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.ActiveCompOrgAppTenant.Access_FK = $item.PK;
            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.ActiveCompOrgAppTenant.AccessCode = $item.Code;
        }

        function EditModalInstance() {
            return TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'compOrgAppTenantEdit'"></div>`
            });
        }

        function AddNew() {
            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.ActiveCompOrgAppTenant = {};
            Edit();
        }

        function Edit() {
            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.SaveBtnText = "OK";
            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function Save() {
            if (TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.ActiveCompOrgAppTenant.PK) {
                UpdateCompOrgAppTenant();
            } else {
                InsertCompOrgAppTenant();
            }
        }

        function InsertCompOrgAppTenant() {
            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.SaveBtnText = "Please Wait...";
            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.IsDisableSaveBtn = true;

            var _input = TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.ActiveCompOrgAppTenant;

            _input.Item_FK = TCCompOrgAppTenantCtrl.ePage.Masters.QueryString.ItemPk;
            _input.ItemCode = TCCompOrgAppTenantCtrl.ePage.Masters.QueryString.ItemCode;
            _input.ItemName = TCCompOrgAppTenantCtrl.ePage.Masters.QueryString.ItemName;
            _input.Access_FK = TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.ActiveCompOrgAppTenant.Access_FK;
            _input.AccessCode = TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.ActiveCompOrgAppTenant.AccessCode;
            _input.AccessTo = "ORG";
            _input.IsModified = true;
            _input.SAP_FK = TCCompOrgAppTenantCtrl.ePage.Masters.Application.ActiveApplication.PK;
            _input.SAP_Code = TCCompOrgAppTenantCtrl.ePage.Masters.Application.ActiveApplication.AppCode;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.TNT_FK = authService.getUserInfo().TenantPK;

            apiService.post("authAPI", trustCenterConfig.Entities.API.ComponentOrganisation.API.Insert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];

                        var _index = TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.CompOrgAppTenantList.map(function (value, key) {
                            return value.PK;
                        }).indexOf(_response.PK);

                        if (_index === -1) {
                            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.CompOrgAppTenantList.push(_response);
                        } else {
                            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.CompOrgAppTenantList[_index] = _response;
                        }

                        OnCompOrgAppTenantClick(_response);
                    }
                } else {
                    toastr.error("Could not Save...!");
                }

                TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.SaveBtnText = "OK";
                TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.IsDisableSaveBtn = false;
                TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.EditModal.dismiss('cancel');
            });
        }

        function UpdateCompOrgAppTenant() {
            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.SaveBtnText = "Please Wait...";
            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.IsDisableSaveBtn = true;

            var _input = TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.ActiveCompOrgAppTenant;
            _input.IsModified = true;

            apiService.post("authAPI", trustCenterConfig.Entities.API.ComponentOrganisation.API.Update.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;

                    var _index = TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.CompOrgAppTenantList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.CompOrgAppTenantList.push(_response);
                    } else {
                        TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.CompOrgAppTenantList[_index] = _response;
                    }

                    OnCompOrgAppTenantClick(_response);
                } else {
                    toastr.error("Could not Save...!");
                }

                TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.SaveBtnText = "OK";
                TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.IsDisableSaveBtn = false;
                TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.EditModal.dismiss('cancel');
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
            TCCompOrgAppTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
            TCCompOrgAppTenantCtrl.ePage.Masters.IsDisableDeleteBtn = true;

            apiService.get("authAPI", trustCenterConfig.Entities.API.ComponentOrganisation.API.Delete.Url + TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.ActiveCompOrgAppTenant.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.CompOrgAppTenantList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.ActiveCompOrgAppTenant.PK);

                    if (_index != -1) {
                        TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.CompOrgAppTenantList.splice(_index, 1);
                    }
                    TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.ActiveCompOrgAppTenant = undefined;
                    OnCompOrgAppTenantClick();
                } else {
                    toastr.error("Could not Delete")
                }

                TCCompOrgAppTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
                TCCompOrgAppTenantCtrl.ePage.Masters.IsDisableDeleteBtn = false;
            });
        }

        function Cancel() {
            if (!TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.ActiveCompOrgAppTenant) {
                if (TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.CompOrgAppTenantList.length > 0) {
                    TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.ActiveCompOrgAppTenant = angular.copy(TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.CompOrgAppTenantList[0]);
                } else {
                    TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.ActiveCompOrgAppTenant = undefined;
                }
            } else if (TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.ActiveCompOrgAppTenantCopy) {
                var _index = TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.CompOrgAppTenantList.map(function (value, key) {
                    return value.PK;
                }).indexOf(TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.ActiveCompOrgAppTenantCopy.PK);

                if (_index !== -1) {
                    TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.ActiveCompOrgAppTenant = angular.copy(TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.CompOrgAppTenantList[_index]);
                }
            }

            TCCompOrgAppTenantCtrl.ePage.Masters.CompOrgAppTenant.EditModal.dismiss('cancel');
        }

        Init();
    }

})();