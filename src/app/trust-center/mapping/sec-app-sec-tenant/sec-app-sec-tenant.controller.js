(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCSecAppSecTenantController", TCSecAppSecTenantController);

    TCSecAppSecTenantController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "trustCenterConfig"];

    function TCSecAppSecTenantController($scope, $location, $uibModal, authService, apiService, helperService, toastr, confirmation, trustCenterConfig) {
        var TCSecAppSecTenantCtrl = this;

        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCSecAppSecTenantCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_SecAppSecTenant",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TCSecAppSecTenantCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            TCSecAppSecTenantCtrl.ePage.Masters.emptyText = "-";

            try {
                TCSecAppSecTenantCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (TCSecAppSecTenantCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitSecAppSecTenant();
                }
            } catch (error) {
                console.log(error);
            }
        }

        function InitBreadcrumb() {
            TCSecAppSecTenantCtrl.ePage.Masters.Breadcrumb = {};
            TCSecAppSecTenantCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCSecAppSecTenantCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                Description: "Sec App Sec Tenant (" + TCSecAppSecTenantCtrl.ePage.Masters.QueryString.MappingCode + ")" + " - " + TCSecAppSecTenantCtrl.ePage.Masters.QueryString.DisplayName,
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

        function InitSecAppSecTenant() {
            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant = {};
            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.OnSecAppSecTenantClick = OnSecAppSecTenantClick;
            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.GetTenantList = GetTenantList;
            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.OnAutocompleteListSelect = OnAutocompleteListSelect;
            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.OnBlurAutoCompleteList = OnBlurAutoCompleteList;
            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.OnSelectAutoCompleteList = OnSelectAutoCompleteList;
            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.Edit = Edit;
            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.Cancel = Cancel;
            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.AddNew = AddNew;
            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.Save = SaveSecAppSecTenant;
            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.DeleteConfirmation = DeleteConfirmation;

            TCSecAppSecTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
            TCSecAppSecTenantCtrl.ePage.Masters.IsDisableDeleteBtn = false;

            GetSecAppSecTenant();
        }

        function GetSecAppSecTenant() {
            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SecAppSecTenantList = undefined;
            var _filter = {
                "SAP_FK": TCSecAppSecTenantCtrl.ePage.Masters.QueryString.AppPk,
                "PropertyName": "false"

            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecAppSecTenant.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecAppSecTenant.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SecAppSecTenantList = angular.copy(response.data.Response);
                    if (TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SecAppSecTenantList.length > 0) {
                        OnSecAppSecTenantClick(TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SecAppSecTenantList[0]);
                    } else {
                        OnSecAppSecTenantClick();
                    }
                } else {
                    TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SecAppSecTenantList = [];
                }
            });
        }

        function OnSecAppSecTenantClick($item) {
            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.ActiveSecAppSecTenant = angular.copy($item);
            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.ActiveSecAppSecTenantCopy = angular.copy($item);

            if (!$item) {
                if (TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SecAppSecTenantList.length > 0) {
                    OnSecAppSecTenantClick(TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SecAppSecTenantList[0]);
                }
            }
        }

        function GetTenantList($viewValue) {
            var _filter = {
                "SAP_FK": TCSecAppSecTenantCtrl.ePage.Masters.QueryString.AppPk
            };
            if ($viewValue != "#") {
                _filter.Autocompletefield = $viewValue;
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecTenant.API.FindAll.FilterID,
            };

            return apiService.post("authAPI", trustCenterConfig.Entities.API.SecTenant.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    return response.data.Response;
                }
            });
        }

        function OnAutocompleteListSelect($item, $model, $label, $event) {
            TCSecAppSecTenantCtrl.ePage.Masters.SelectedAutocompleteTenant = $item;
        }

        function OnBlurAutoCompleteList($event) {
            TCSecAppSecTenantCtrl.ePage.Masters.IsSecTenantNoResults = false;
            TCSecAppSecTenantCtrl.ePage.Masters.IsSecTenantLoading = false;
        }

        function OnSelectAutoCompleteList($item, $model, $label, $event) {
            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.ActiveSecAppSecTenant.TNT_FK = $item.PK;
            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.ActiveSecAppSecTenant.TenantCode = $item.TenantCode;
        }


        function EditModalInstance() {
            return TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'secAppSecTenantEdit'"></div>`
            });
        }

        function AddNew() {
            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.ActiveSecAppSecTenant = {};
            Edit();
        }


        function Edit() {
            TCSecAppSecTenantCtrl.ePage.Masters.SaveBtnText = "OK";
            TCSecAppSecTenantCtrl.ePage.Masters.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }


        function SaveSecAppSecTenant() {
            TCSecAppSecTenantCtrl.ePage.Masters.SaveBtnTxt = "Please Wait...";
            TCSecAppSecTenantCtrl.ePage.Masters.IsDisabledSaveBtn = true;

            var _input = angular.copy(TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.ActiveSecAppSecTenant);
            _input.SAP_Code = TCSecAppSecTenantCtrl.ePage.Masters.QueryString.AppCode;
            _input.SAP_FK = TCSecAppSecTenantCtrl.ePage.Masters.QueryString.AppPk;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.TNT_FK = authService.getUserInfo().TenantPK;
            _input.Item_FK = TCSecAppSecTenantCtrl.ePage.Masters.QueryString.ItemPk;
            _input.ItemName = TCSecAppSecTenantCtrl.ePage.Masters.QueryString.ItemName;
            _input.ItemCode = TCSecAppSecTenantCtrl.ePage.Masters.QueryString.ItemCode;
            _input.IsModified = true;

            if (_input.PK) {
                apiService.post("authAPI", trustCenterConfig.Entities.API.SecAppSecTenant.API.Update.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.ActiveSecAppSecTenant = response.data.Response;
                    } else {
                        toastr.error("Could not Update...!");
                    }

                    TCSecAppSecTenantCtrl.ePage.Masters.SaveBtnText = "OK";
                    TCSecAppSecTenantCtrl.ePage.Masters.IsDisableSaveBtn = false;
                });
            } else {
                apiService.post("authAPI", trustCenterConfig.Entities.API.SecAppSecTenant.API.Insert.Url, [_input]).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.length > 0) {
                            if (!TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SecAppSecTenantList) {
                                TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SecAppSecTenantList = [];
                            }

                            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SecAppSecTenantList.push(response.data.Response[0]);
                            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.ActiveSecAppSecTenant = response.data.Response[0];
                        }
                    } else {
                        toastr.error("Could not Insert...!");
                    }

                    TCSecAppSecTenantCtrl.ePage.Masters.SaveBtnTxt = "Save";
                    TCSecAppSecTenantCtrl.ePage.Masters.IsDisabledSaveBtn = false;

                    OnSecAppSecTenantClick(TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.ActiveSecAppSecTenant);
                });
            }

            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.EditModal.dismiss('cancel');
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
            TCSecAppSecTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
            TCSecAppSecTenantCtrl.ePage.Masters.IsDisableDeleteBtn = true;

            apiService.get("authAPI", trustCenterConfig.Entities.API.SecAppSecTenant.API.Delete.Url + TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.ActiveSecAppSecTenant.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SecAppSecTenantList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.ActiveSecAppSecTenant.PK);

                    if (_index != -1) {
                        TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SecAppSecTenantList.splice(_index, 1);
                    }
                    TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.ActiveSecAppSecTenant = undefined;
                    OnSecAppSecTenantClick();
                } else {
                    toastr.error("Could not Delete")
                }

                TCSecAppSecTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
                TCSecAppSecTenantCtrl.ePage.Masters.IsDisableDeleteBtn = false;
            });
        }

        function Cancel() {
            if (!TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.ActiveSecAppSecTenant) {
                if (TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SecAppSecTenantList.length > 0) {
                    TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.ActiveSecAppSecTenant = angular.copy(TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SecAppSecTenantList[0]);
                } else {
                    TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.ActiveSecAppSecTenant = undefined;
                }
            } else if (TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.ActiveSecAppSecTenantCopy) {
                var _index = TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SecAppSecTenantList.map(function (value, key) {
                    return value.PK;
                }).indexOf(TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.ActiveSecAppSecTenantCopy.PK);

                if (_index !== -1) {
                    TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.ActiveSecAppSecTenant = angular.copy(TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SecAppSecTenantList[_index]);
                }
            }

            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.EditModal.dismiss('cancel');
        }


        Init();
    }
})();