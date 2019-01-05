(function () {
    "use strict";

        angular
        .module("Application")
        .controller("TCFilterRoleAppTenantController", TCFilterRoleAppTenantController);

    TCFilterRoleAppTenantController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "trustCenterConfig"];

    function TCFilterRoleAppTenantController($scope, $location, $uibModal, authService, apiService, helperService, toastr, confirmation, trustCenterConfig) {
        var TCFilterRoleAppTenantCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCFilterRoleAppTenantCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_FilterRoleAppTenant",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TCFilterRoleAppTenantCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            TCFilterRoleAppTenantCtrl.ePage.Masters.emptyText = "-";

            try {
                TCFilterRoleAppTenantCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (TCFilterRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitApplication();
                    InitFilterRoleAppTenant();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            TCFilterRoleAppTenantCtrl.ePage.Masters.Breadcrumb = {};
            TCFilterRoleAppTenantCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }


        function GetBreadcrumbList() {
            var _breadcrumbTitle = "";
            if (TCFilterRoleAppTenantCtrl.ePage.Masters.QueryString.BreadcrumbTitle) {
                _breadcrumbTitle = " (" + TCFilterRoleAppTenantCtrl.ePage.Masters.QueryString.BreadcrumbTitle + ")";
            }
            TCFilterRoleAppTenantCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": TCFilterRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCFilterRoleAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCFilterRoleAppTenantCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "applicationSettings",
                Description: "Application Settings",
                Link: "TC/application-settings",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": TCFilterRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCFilterRoleAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCFilterRoleAppTenantCtrl.ePage.Masters.QueryString.AppName,
                    "AdditionalData": TCFilterRoleAppTenantCtrl.ePage.Masters.QueryString.AdditionalData,
                    "Type":TCFilterRoleAppTenantCtrl.ePage.Masters.QueryString.Type
                 },
                IsActive: false
            }, {
                Code: "filterRoleAppTenant",
                Description: "Filter Role App Tenant" + _breadcrumbTitle + " - " + TCFilterRoleAppTenantCtrl.ePage.Masters.QueryString.DisplayName,
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

        // =================== Breadcrumb End ===================== //

         // ========================Application Start========================
         function InitApplication() {
            TCFilterRoleAppTenantCtrl.ePage.Masters.Application = {};
            TCFilterRoleAppTenantCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            TCFilterRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);
            if (!TCFilterRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication) {
                TCFilterRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": TCFilterRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCFilterRoleAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCFilterRoleAppTenantCtrl.ePage.Masters.QueryString.AppName
                };
            }
            GetFilterRoleAppTenant();
        }
        // ========================Application End========================

        
        function InitFilterRoleAppTenant() {
            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant = {};
            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.OnFilterRoleAppTenantClick = OnFilterRoleAppTenantClick;
            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.GetRolesList = GetRolesList;
            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.OnAutocompleteListSelect = OnAutocompleteListSelect;
            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.OnBlurAutoCompleteList = OnBlurAutoCompleteList;
            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.OnSelectAutoCompleteList = OnSelectAutoCompleteList;
            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.Edit = Edit;
            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.Cancel = Cancel;
            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.AddNew = AddNew;
            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.CheckUIControl = CheckUIControl;
            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.Save = Save;
            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.DeleteConfirmation = DeleteConfirmation;

            TCFilterRoleAppTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
            TCFilterRoleAppTenantCtrl.ePage.Masters.IsDisableDeleteBtn = false;

            GetUIControlList();
        }

        function GetUIControlList() {
            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.UIControlList = undefined;
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
                    TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.UIControlList = _controlList;
                } else {
                    TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.UIControlList = [];
                }
            });
        }

        function CheckUIControl(controlId) {
            return helperService.checkUIControl(TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.UIControlList, controlId);
        }

        function GetFilterRoleAppTenant() {
            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.FilterRoleAppTenantList = undefined;
            var _filter = {
                "SAP_FK": TCFilterRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "Item_FK": TCFilterRoleAppTenantCtrl.ePage.Masters.QueryString.ItemPk,
                "ItemCode": TCFilterRoleAppTenantCtrl.ePage.Masters.QueryString.ItemCode,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.FilterRoleApplicationTenant.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.FilterRoleApplicationTenant.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.FilterRoleAppTenantList = angular.copy(response.data.Response);
                    if (TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.FilterRoleAppTenantList.length > 0) {
                        OnFilterRoleAppTenantClick(TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.FilterRoleAppTenantList[0]);
                    } else {
                        OnFilterRoleAppTenantClick();
                    }
                } else {
                    TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.FilterRoleAppTenantList = [];
                }
            });
        }

        function OnFilterRoleAppTenantClick($item) {
            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.ActiveFilterRoleAppTenant = angular.copy($item);
            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.ActiveFilterRoleAppTenantCopy = angular.copy($item);

            if (!$item) {
                if (TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.FilterRoleAppTenantList.length > 0) {
                    OnFilterRoleAppTenantClick(TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.FilterRoleAppTenantList[0]);
                }
            }
        }

        function GetRolesList($viewValue) {
            var _filter = {
                "SAP_FK": TCFilterRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication.PK,
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
            TCFilterRoleAppTenantCtrl.ePage.Masters.SelectedAutocompleteTenant = $item;
        }

        
        function OnBlurAutoCompleteList($event) {
            TCFilterRoleAppTenantCtrl.ePage.Masters.IsSecRoleNoResults = false;
            TCFilterRoleAppTenantCtrl.ePage.Masters.IsSecRoleLoading = false;
        }

        function OnSelectAutoCompleteList($item, $model, $label, $event) {
            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.ActiveFilterRoleAppTenant.Access_FK = $item.PK;
            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.ActiveFilterRoleAppTenant.AccessCode = $item.RoleName;
        }

        function EditModalInstance() {
            return TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'filterRoleAppTenantEdit'"></div>`
            });
        }

        function AddNew() {
            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.ActiveFilterRoleAppTenant = {};
            Edit();
        }

        function Edit() {
            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.SaveBtnText = "OK";
            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        
        function Save() {
            if (TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.ActiveFilterRoleAppTenant.PK) {
                UpdateFilterRoleAppTenant();
            } else {
                InsertFilterRoleAppTenant();
            }
        }
       
        function InsertFilterRoleAppTenant() {
            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.SaveBtnText = "Please Wait...";
            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.IsDisableSaveBtn = true;

            var _input = TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.ActiveFilterRoleAppTenant;
            _input.Item_FK = TCFilterRoleAppTenantCtrl.ePage.Masters.QueryString.ItemPk;
            _input.ItemCode = TCFilterRoleAppTenantCtrl.ePage.Masters.QueryString.ItemCode;
            _input.ItemName = TCFilterRoleAppTenantCtrl.ePage.Masters.QueryString.ItemName;
             _input.Access_FK = TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.ActiveFilterRoleAppTenant.Access_FK;
            _input.AccessCode = TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.ActiveFilterRoleAppTenant.AccessCode;
            _input.AccessTo = "ROLE";
            _input.IsModified = true;
            _input.SAP_FK = TCFilterRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication.PK;
            _input.SAP_Code = TCFilterRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication.AppCode;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.TNT_FK = authService.getUserInfo().TenantPK;

            apiService.post("authAPI", trustCenterConfig.Entities.API.FilterRoleApplicationTenant.API.Insert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];

                        var _index = TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.FilterRoleAppTenantList.map(function (value, key) {
                            return value.PK;
                        }).indexOf(_response.PK);

                        if (_index === -1) {
                            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.FilterRoleAppTenantList.push(_response);
                        } else {
                            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.FilterRoleAppTenantList[_index] = _response;
                        }

                        OnFilterRoleAppTenantClick(_response);
                    }
                } else {
                    toastr.error("Could not Save...!");
                }

                TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.SaveBtnText = "OK";
                TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.IsDisableSaveBtn = false;
                TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.EditModal.dismiss('cancel');
            });
        }

        function UpdateFilterRoleAppTenant() {
            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.SaveBtnText = "Please Wait...";
            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.IsDisableSaveBtn = true;

            var _input = TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.ActiveFilterRoleAppTenant;
            _input.IsModified = true;

            apiService.post("authAPI", trustCenterConfig.Entities.API.FilterRoleApplicationTenant.API.Update.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;

                    var _index = TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.FilterRoleAppTenantList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.FilterRoleAppTenantList.push(_response);
                    } else {
                        TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.FilterRoleAppTenantList[_index] = _response;
                    }

                    OnFilterRoleAppTenantClick(_response);
                } else {
                    toastr.error("Could not Save...!");
                }

                TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.SaveBtnText = "OK";
                TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.IsDisableSaveBtn = false;
                TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.EditModal.dismiss('cancel');
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
            TCFilterRoleAppTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
            TCFilterRoleAppTenantCtrl.ePage.Masters.IsDisableDeleteBtn = true;

            apiService.get("authAPI", trustCenterConfig.Entities.API.FilterRoleApplicationTenant.API.Delete.Url + TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.ActiveFilterRoleAppTenant.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.FilterRoleAppTenantList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.ActiveFilterRoleAppTenant.PK);

                    if (_index != -1) {
                        TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.FilterRoleAppTenantList.splice(_index, 1);
                    }
                    TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.ActiveFilterRoleAppTenant = undefined;
                    OnFilterRoleAppTenantClick();
                } else {
                    toastr.error("Could not Delete")
                }

                TCFilterRoleAppTenantCtrl.ePage.Masters.DeleteBtnText = "Delete";
                TCFilterRoleAppTenantCtrl.ePage.Masters.IsDisableDeleteBtn = false;
            });
        }

        function Cancel() {
            if (!TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.ActiveFilterRoleAppTenant) {
                if (TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.FilterRoleAppTenantList.length > 0) {
                    TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.ActiveFilterRoleAppTenant = angular.copy(TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.FilterRoleAppTenantList[0]);
                } else {
                    TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.ActiveFilterRoleAppTenant = undefined;
                }
            } else if (TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.ActiveFilterRoleAppTenantCopy) {
                var _index = TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.FilterRoleAppTenantList.map(function (value, key) {
                    return value.PK;
                }).indexOf(TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.ActiveFilterRoleAppTenantCopy.PK);

                if (_index !== -1) {
                    TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.ActiveFilterRoleAppTenant = angular.copy(TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.FilterRoleAppTenantList[_index]);
                }
            }

            TCFilterRoleAppTenantCtrl.ePage.Masters.FilterRoleAppTenant.EditModal.dismiss('cancel');
        }


    Init();     
    }
})();