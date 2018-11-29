(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCAppTrustAppTenantController", TCAppTrustAppTenantController);

    TCAppTrustAppTenantController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "trustCenterConfig"];

    function TCAppTrustAppTenantController($scope, $location, $uibModal, authService, apiService, helperService, toastr, confirmation, trustCenterConfig) {
        var TCAppTrustAppTenantCtrl = this;

        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCAppTrustAppTenantCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_AppTrustAppTenant",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TCAppTrustAppTenantCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            TCAppTrustAppTenantCtrl.ePage.Masters.emptyText = "-";

            try {
                TCAppTrustAppTenantCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (TCAppTrustAppTenantCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitAppTrustAppTenant();
                }
            } catch (error) {
                console.log(error);
            }
        }

        function InitBreadcrumb() {
            TCAppTrustAppTenantCtrl.ePage.Masters.Breadcrumb = {};
            TCAppTrustAppTenantCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCAppTrustAppTenantCtrl.ePage.Masters.Breadcrumb.ListSource = [{
                Code: "home",
                Description: "Home",
                Link: "TC/home",
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "application",
                Description: "Application",
                Link: "TC/application",
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "appTrustAppTenant",
                Description: "App Trust App Tenant (" + TCAppTrustAppTenantCtrl.ePage.Masters.QueryString.MappingCode + ")" + " - " +  TCAppTrustAppTenantCtrl.ePage.Masters.QueryString.DisplayName,
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

        function InitAppTrustAppTenant() {
            TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant = {};
            TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.OnAppTrustAppTenantClick = OnAppTrustAppTenantClick;
            TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.GetRolesList = GetRolesList;
            TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.OnAutocompleteListSelect = OnAutocompleteListSelect;
            TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.OnBlurAutoCompleteList = OnBlurAutoCompleteList;
            TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.OnSelectAutoCompleteList = OnSelectAutoCompleteList;
            TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.Edit = Edit;
            TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.Cancel = Cancel;
            TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.AddNew = AddNew;
            TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.Save = SaveAppTrustAppTenant;
            TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.DeleteConfirmation = DeleteConfirmation;

            TCAppTrustAppTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
            TCAppTrustAppTenantCtrl.ePage.Masters.IsDisableDeleteBtn = false;

            GetAppTrustAppTenant();
        }

        function GetAppTrustAppTenant() {
            TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.AppTrustAppTenantList = undefined;
            var _filter = {
                "SAP_FK": TCAppTrustAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                "Item_FK": TCAppTrustAppTenantCtrl.ePage.Masters.QueryString.ItemPk,
                "ItemCode": TCAppTrustAppTenantCtrl.ePage.Masters.QueryString.ItemCode,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.ApplicationTrust.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.ApplicationTrust.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.AppTrustAppTenantList = angular.copy(response.data.Response);
                    if (TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.AppTrustAppTenantList.length > 0) {
                        OnAppTrustAppTenantClick(TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.AppTrustAppTenantList[0]);
                    } else {
                        OnAppTrustAppTenantClick();
                    }
                } else {
                    TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.AppTrustAppTenantList = [];
                }
            });
        }

        function OnAppTrustAppTenantClick($item) {
            TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.ActiveAppTrustAppTenant = angular.copy($item);
            TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.ActiveAppTrustAppTenantCopy = angular.copy($item);

            if (!$item) {
                if (TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.AppTrustAppTenantList.length > 0) {
                    OnAppTrustAppTenantClick(TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.AppTrustAppTenantList[0]);
                }
            }
        }

        function GetRolesList($viewValue) {
            var _filter = {
                "SAP_FK": TCAppTrustAppTenantCtrl.ePage.Masters.QueryString.AppPk
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
            TCAppTrustAppTenantCtrl.ePage.Masters.SelectedAutocompleteTenant = $item;
        }

        function OnBlurAutoCompleteList($event) {
            TCAppTrustAppTenantCtrl.ePage.Masters.IsSecRoleNoResults = false;
            TCAppTrustAppTenantCtrl.ePage.Masters.IsSecRoleLoading = false;
        }

        function OnSelectAutoCompleteList($item, $model, $label, $event) {
            TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.ActiveAppTrustAppTenant.Access_FK = $item.PK;
            TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.ActiveAppTrustAppTenant.AccessCode = $item.RoleName;
        }

        function EditModalInstance() {
            return TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'appTrustAppTenantEdit'"></div>`
            });
        }

        function AddNew() {
            TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.ActiveAppTrustAppTenant = {};
            Edit();
        }

        function Edit() {
            TCAppTrustAppTenantCtrl.ePage.Masters.SaveBtnText = "OK";
            TCAppTrustAppTenantCtrl.ePage.Masters.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function SaveAppTrustAppTenant() {
            TCAppTrustAppTenantCtrl.ePage.Masters.SaveBtnTxt = "Please Wait...";
            TCAppTrustAppTenantCtrl.ePage.Masters.IsDisabledSaveBtn = true;

            var _input = angular.copy(TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.ActiveAppTrustAppTenant);
            _input.IsModified = true;

            _input.SAP_Code = TCAppTrustAppTenantCtrl.ePage.Masters.QueryString.AppCode;
            _input.SAP_FK = TCAppTrustAppTenantCtrl.ePage.Masters.QueryString.AppPk;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.TNT_FK = authService.getUserInfo().TenantPK;
            _input.Item_FK = TCAppTrustAppTenantCtrl.ePage.Masters.QueryString.ItemPk;
            _input.ItemCode = TCAppTrustAppTenantCtrl.ePage.Masters.QueryString.ItemCode;
            _input.ItemName = TCAppTrustAppTenantCtrl.ePage.Masters.QueryString.ItemName;
            _input.AccessCode = TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.ActiveAppTrustAppTenant.AccessCode;
            _input.AccessTo = "TRUST";
            _input.IsModified = true;

            if (_input.PK) {
                apiService.post("authAPI", trustCenterConfig.Entities.API.ApplicationTrust.API.Update.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.ActiveAppTrustAppTenant = response.data.Response;
                    } else {
                        toastr.error("Could not Update...!");
                    }

                    TCAppTrustAppTenantCtrl.ePage.Masters.SaveBtnText = "OK";
                    TCAppTrustAppTenantCtrl.ePage.Masters.IsDisableSaveBtn = false;
                });
            } else {
                apiService.post("authAPI", trustCenterConfig.Entities.API.ApplicationTrust.API.Insert.Url, [_input]).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.length > 0) {
                            if (!TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.AppTrustAppTenantList) {
                                TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.AppTrustAppTenantList = [];
                            }

                            TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.AppTrustAppTenantList.push(response.data.Response[0]);
                            TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.ActiveAppTrustAppTenant = response.data.Response[0];
                        }
                    } else {
                        toastr.error("Could not Insert...!");
                    }

                    TCAppTrustAppTenantCtrl.ePage.Masters.SaveBtnTxt = "Save";
                    TCAppTrustAppTenantCtrl.ePage.Masters.IsDisabledSaveBtn = false;

                    OnAppTrustAppTenantClick(TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.ActiveAppTrustAppTenant);
                });
            }

            TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.EditModal.dismiss('cancel');
        }

        function DeleteConfirmation() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions).then(function (result) {
                Delete();
            }, function () {
                console.log("Cancelled");
            });
        }

        function Delete() {
            TCAppTrustAppTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
            TCAppTrustAppTenantCtrl.ePage.Masters.IsDisableDeleteBtn = true;

            apiService.get("authAPI", trustCenterConfig.Entities.API.ApplicationTrust.API.Delete.Url + TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.ActiveAppTrustAppTenant.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.AppTrustAppTenantList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.ActiveAppTrustAppTenant.PK);

                    if (_index != -1) {
                        TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.AppTrustAppTenantList.splice(_index, 1);
                    }
                    TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.ActiveAppTrustAppTenant = undefined;
                    OnAppTrustAppTenantClick();
                } else {
                    toastr.error("Could not Delete")
                }

                TCAppTrustAppTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
                TCAppTrustAppTenantCtrl.ePage.Masters.IsDisableDeleteBtn = false;
            });
        }

        function Cancel() {
            if (!TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.ActiveAppTrustAppTenant) {
                if (TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.AppTrustAppTenantList.length > 0) {
                    TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.ActiveAppTrustAppTenant = angular.copy(TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.AppTrustAppTenantList[0]);
                } else {
                    TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.ActiveAppTrustAppTenant = undefined;
                }
            } else if (TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.ActiveAppTrustAppTenantCopy) {
                var _index = TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.AppTrustAppTenantList.map(function (value, key) {
                    return value.PK;
                }).indexOf(TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.ActiveAppTrustAppTenantCopy.PK);

                if (_index !== -1) {
                    TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.ActiveAppTrustAppTenant = angular.copy(TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.AppTrustAppTenantList[_index]);
                }
            }

            TCAppTrustAppTenantCtrl.ePage.Masters.AppTrustAppTenant.EditModal.dismiss('cancel');
        }

        Init();
    }
})();
