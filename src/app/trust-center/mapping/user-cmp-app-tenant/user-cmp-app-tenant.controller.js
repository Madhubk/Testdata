(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCUserCmpAppTenantController", TCUserCmpAppTenantController);

    TCUserCmpAppTenantController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "trustCenterConfig"];

    function TCUserCmpAppTenantController($scope, $location, $uibModal, authService, apiService, helperService, toastr, confirmation, trustCenterConfig) {
        var TCUserCmpAppTenantCtrl = this;

        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCUserCmpAppTenantCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_User_Cmp_App_Tenant",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TCUserCmpAppTenantCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            TCUserCmpAppTenantCtrl.ePage.Masters.emptyText = "-";

            try {
                TCUserCmpAppTenantCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (TCUserCmpAppTenantCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitApplication();
                    InitUserCmpAppTenant();

                }
            } catch (error) {
                console.log(error);
            }

        }

        // ========================Breadcrumb Start========================


        function InitBreadcrumb() {
            TCUserCmpAppTenantCtrl.ePage.Masters.Breadcrumb = {};
            TCUserCmpAppTenantCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCUserCmpAppTenantCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": TCUserCmpAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCUserCmpAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCUserCmpAppTenantCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "userList",
                Description: "User",
                Link: "TC/user-list",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": TCUserCmpAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCUserCmpAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCUserCmpAppTenantCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "userCmpAppTenant",
                Description: "User Cmp App Tenant (" + TCUserCmpAppTenantCtrl.ePage.Masters.QueryString.DisplayName + ")" + " - " + TCUserCmpAppTenantCtrl.ePage.Masters.QueryString.MappingCode,
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

        // ========================Application Start========================
        function InitApplication() {
            TCUserCmpAppTenantCtrl.ePage.Masters.Application = {};
            TCUserCmpAppTenantCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            TCUserCmpAppTenantCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);
            if (!TCUserCmpAppTenantCtrl.ePage.Masters.Application.ActiveApplication) {
                TCUserCmpAppTenantCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": TCUserCmpAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCUserCmpAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCUserCmpAppTenantCtrl.ePage.Masters.QueryString.AppName
                };
            }
            GetUserCmpAppTenantList();
        }

        // ========================Breadcrumb End========================

        function InitUserCmpAppTenant() {
            TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant = {};
            TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant.GetCompanyList = GetCompanyList;
            TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant.GetCmpBranchList = GetCmpBranchList;
            TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant.GetCmpDepartmentList = GetCmpDepartmentList;
            TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant.GetOrganizationList = GetOrganizationList;
            TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant.OnBlurAutoCompleteList = OnBlurAutoCompleteList;
            TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant.OnSelectAutoCompleteList = OnSelectAutoCompleteList;
            TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant.OnBlurAutoCompleteListBranch = OnBlurAutoCompleteListBranch;
            TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant.OnSelectAutoCompleteListBranch =
                OnSelectAutoCompleteListBranch;
            TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant.OnBlurAutoCompleteListDepartment =
                OnBlurAutoCompleteListDepartment;
            TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant.OnSelectAutoCompleteListDepartment = OnSelectAutoCompleteListDepartment;
            TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant.OnSelectAutoCompleteListOrganization = OnSelectAutoCompleteListOrganization;
            TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant.OnBlurAutoCompleteListOrganization =
                OnBlurAutoCompleteListOrganization;

            TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant.AddNewRow = AddNewRow;
            TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant.Save = SaveUserCmpAppTenant;
            TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant.Delete = DeleteConfirmation;

            OnApplicationChange();
        }


        function GetUserCmpAppTenantList() {
            var _filter = {
                "SAP_FK": TCUserCmpAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                "Item_FK": TCUserCmpAppTenantCtrl.ePage.Masters.QueryString.ItemPk,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.UserCompanyBranchOrganisationWarehouseDepartment.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.UserCompanyBranchOrganisationWarehouseDepartment.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant.UserCmpAppTenantList = response.data.Response;
                    TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant.UserCmpAppTenantListCopy = angular.copy(response.data.Response);

                } else {
                    TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant.UserCmpAppTenantList = [];
                    console.log("Empty Response");
                }
            });
        }

        function GetCompanyList($viewValue) {
            if ($viewValue !== "#") {
                var _filter = {
                    "Autocompletefield": $viewValue
                };
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CmpCompany.API.FindAll.FilterID,
            };

            return apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CmpCompany.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    return response.data.Response;
                }
            });
        }

        function OnBlurAutoCompleteList($event, row) {
            row.AccessCodeNoResults = false;
            row.AccessCodeLoading = false;
        }

        function OnSelectAutoCompleteList($item, $model, $label, $event, row) {
            row.Access_FK = $item.PK;
            row.AccessCode = $item.Code;
        }

        function GetCmpBranchList($viewValue, item) {
            if ($viewValue !== "#") {
                var _filter = {
                    "Autocompletefield": $viewValue,
                    "CMP_FK": item.Access_FK
                };
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CmpBranch.API.FindAll.FilterID,
            };

            return apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CmpBranch.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    return response.data.Response;
                }
            });
        }

        function OnBlurAutoCompleteListBranch($event, row) {
            row.IsCmpBranchNoResults = false;
            row.IsCmpBranchLoading = false;
        }

        function OnSelectAutoCompleteListBranch($item, $model, $label, $event, row) {
            row.BasedOn_FK = $item.PK;
            row.BasedOnCode = $item.Code;
        }

        function GetCmpDepartmentList($viewValue) {
            if ($viewValue !== "#") {
                var _filter = {
                    "Autocompletefield": $viewValue
                };
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CmpDepartment.API.FindAll.FilterID,
            };

            return apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CmpDepartment.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    return response.data.Response;
                }
            });
        }

        function OnBlurAutoCompleteListDepartment($event, row) {
            row.IsCmpDepartmentNoResults = false;
            row.IsCmpDepartmentLoading = false;
        }

        function OnSelectAutoCompleteListDepartment($item, $model, $label, $event, row) {
            row.OtherEntity_FK_3 = $item.PK;
            row.OtherEntityCode_3 = $item.Code;
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

        function OnBlurAutoCompleteListOrganization($event, row) {
            row.IsOrganizationNoResults = false;
            row.IsOrganizationLoading = false;
        }

        function OnSelectAutoCompleteListOrganization($item, $model, $label, $event, row) {
            row.OtherEntity_FK = $item.PK;
            row.OtherEntityCode = $item.Code;
        }

        function AddNewRow() {
            var _obj = {};
            TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant.UserCmpAppTenantList.push(_obj);
        }

        function SaveUserCmpAppTenant(row) {
            TCUserCmpAppTenantCtrl.ePage.Masters.SaveBtnTxt = "Please Wait...";
            TCUserCmpAppTenantCtrl.ePage.Masters.IsDisabledSaveBtn = true;

            var _input = angular.copy(row);
            _input.IsModified = true;

            _input.SAP_Code = TCUserCmpAppTenantCtrl.ePage.Masters.Application.ActiveApplication.AppCode;
            _input.SAP_FK = TCUserCmpAppTenantCtrl.ePage.Masters.Application.ActiveApplication.PK;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.TNT_FK = authService.getUserInfo().TenantPK;
            _input.Item_FK = TCUserCmpAppTenantCtrl.ePage.Masters.QueryString.ItemPk;
            _input.ItemCode = TCUserCmpAppTenantCtrl.ePage.Masters.QueryString.ItemCode;
            _input.ItemName = TCUserCmpAppTenantCtrl.ePage.Masters.QueryString.ItemName;
            _input.AccessCode = row.AccessCode;
            _input.AccessTo = "CMP";
            _input.Access_FK = row.Access_FK;
            _input.BasedOnCode = row.BasedOnCode;
            _input.BasedOn = "BRN";
            _input.BasedOn_FK = row.BasedOn_FK;
            _input.OtherEntity_FK = row.OtherEntity_FK;
            _input.OtherEntitySource = "ORG";
            _input.OtherEntityCode = row.OtherEntityCode;
            _input.OtherEntity_FK_2 = row.OtherEntity_FK_2;
            _input.OtherEntityCode_2 = row.OtherEntityCode_2;
            _input.OtherEntitySource_2 = "DEPT";
            _input.IsModified = true;

            if (_input.PK) {
                apiService.post("authAPI", trustCenterConfig.Entities.API.UserCompanyBranchOrganisationWarehouseDepartment.API.Update.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        var _response = response.data.Response[0];
                        var _index = TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant.UserCmpAppTenantList.map(function (e) {
                            return e.PK;
                        }).indexOf(_response.PK);

                        if (_index !== -1) {
                            TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant.UserCmpAppTenantList[_index] = _response;
                        }
                        toastr.success("Saved Successfully...!");
                    } else {
                        toastr.error("Could not Save...!");
                    }
                });
            } else {
                apiService.post("authAPI", trustCenterConfig.Entities.API.UserCompanyBranchOrganisationWarehouseDepartment.API.Insert.Url, [_input]).then(function (response) {
                    if (response.data.Response) {
                        var _response = response.data.Response[0];
                        var _index = TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant.UserCmpAppTenantList.map(function (e) {
                            return e.PK;
                        }).indexOf(_response.PK);

                        if (_index !== -1) {
                            TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant.UserCmpAppTenantList[_index] = _response;
                        }
                        toastr.success("Saved Successfully...!");
                    } else {
                        toastr.error("Could not Save...!");
                    }


                });
            }

        }

        function DeleteConfirmation(row) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    Delete(row);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function Delete(row) {
            apiService.get("authAPI", trustCenterConfig.Entities.API.UserCompanyBranchOrganisationWarehouseDepartment.API.Delete.Url + row.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant.UserCmpAppTenantList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(row.PK);

                    if (_index !== -1) {
                        TCUserCmpAppTenantCtrl.ePage.Masters.UserCmpAppTenant.UserCmpAppTenantList.splice(_index, 1);
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }
            });
        }

        Init();
    }

})();