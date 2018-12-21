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
                Description: "Sec App Sec Tenant (" + "SECAPP_SECTENANT" + ")" + " - " + TCSecAppSecTenantCtrl.ePage.Masters.QueryString.DisplayName,
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
            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.Save = Save;
            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.DeleteConfirmation = DeleteConfirmation;
            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.CheckUIControl = CheckUIControl;

            TCSecAppSecTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
            TCSecAppSecTenantCtrl.ePage.Masters.IsDisableDeleteBtn = false;

            GetUIControlList();
            GetSecAppSecTenant();
        }

        function GetUIControlList() {
            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.UIControlList = undefined;
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
                    TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.UIControlList = _controlList;
                } else {
                    TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.UIControlList = [];
                }
            });
        }

        function CheckUIControl(controlId) {
            return helperService.checkUIControl(TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.UIControlList, controlId);
        }

        function GetSecAppSecTenant() {
            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SecAppSecTenantList = undefined;
            var _filter = {
                "SAP_FK": TCSecAppSecTenantCtrl.ePage.Masters.QueryString.AppPk,
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

        function Save() {
            if (TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.ActiveSecAppSecTenant.PK) {
                UpdateSecAppSecTenant();
            } else {
                InsertSecAppSecTenant();
            }
        }

        function InsertSecAppSecTenant() {
           
            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SaveBtnText = "Please Wait...";
            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.IsDisableSaveBtn = true;

            var _input = angular.copy(TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.ActiveSecAppSecTenant);
            _input.IsModified = true;
            _input.SAP_FK = TCSecAppSecTenantCtrl.ePage.Masters.QueryString.AppPk;
            _input.SAP_Code = TCSecAppSecTenantCtrl.ePage.Masters.QueryString.AppCode;
            _input.TenantCode = TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.ActiveSecAppSecTenant.TenantCode;
            _input.TNT_FK = TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.ActiveSecAppSecTenant.TNT_FK;

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecAppSecTenant.API.Insert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];

                        var _index = TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SecAppSecTenantList.map(function (value, key) {
                            return value.PK;
                        }).indexOf(_response.PK);

                        if (_index === -1) {
                            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SecAppSecTenantList.push(_response);
                        } else {
                            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SecAppSecTenantList[_index] = _response;
                        }

                        OnSecAppSecTenantClick(_response);
                    }
                } else {
                    toastr.error("Could not Save...!");
                }

                TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SaveBtnText = "OK";
                TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.IsDisableSaveBtn = false;
                TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.EditModal.dismiss('cancel');
            });
        }

        function UpdateSecAppSecTenant() {
             TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SaveBtnText = "Please Wait...";
            TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.IsDisableSaveBtn = true;

            var _input = angular.copy(TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.ActiveSecAppSecTenant);
            _input.IsModified = true;

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecAppSecTenant.API.Update.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;

                    var _index = TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SecAppSecTenantList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_response.PK);
                    
                    if (_index === -1) {
                        TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SecAppSecTenantList.push(_response);
                    } else {
                        TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SecAppSecTenantList[_index] = _response;
                    }
                    OnSecAppSecTenantClick(_response);
                } else {
                    toastr.error("Could not Save...!");
                }

                TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.SaveBtnText = "OK";
                TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.IsDisableSaveBtn = false;
                TCSecAppSecTenantCtrl.ePage.Masters.SecAppSecTenant.EditModal.dismiss('cancel');
            });
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
