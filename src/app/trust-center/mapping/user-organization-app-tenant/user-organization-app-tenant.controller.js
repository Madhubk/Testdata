(function () {
    "use strict";

    
    angular
        .module("Application")
        .controller("TCUserOrganizationAppTenantController", TCUserOrganizationAppTenantController);

        TCUserOrganizationAppTenantController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "trustCenterConfig"];

        function TCUserOrganizationAppTenantController($scope, $location, $uibModal, authService, apiService, helperService, toastr, confirmation, trustCenterConfig) {
            var TCUserOrganizationAppTenantCtrl = this;

            var _queryString = $location.path().split("/").pop();

            function Init() {
                TCUserOrganizationAppTenantCtrl.ePage = {
                    "Title": "",
                    "Prefix": "TC_User_Organization_App_Tenant",
                    "Masters": {},
                    "Meta": helperService.metaBase(),
                    "Entities": {}
                };
    
                TCUserOrganizationAppTenantCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
                TCUserOrganizationAppTenantCtrl.ePage.Masters.emptyText = "-";
    
    
                try {
                    TCUserOrganizationAppTenantCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
    
                    if (TCUserOrganizationAppTenantCtrl.ePage.Masters.QueryString.AppPk) {
                        InitBreadcrumb();
                        InitApplication();
                        InitUserOrganizationAppTenant();
    
                    }
                } catch (error) {
                    console.log(error);
                }
            }

            // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            TCUserOrganizationAppTenantCtrl.ePage.Masters.Breadcrumb = {};
            TCUserOrganizationAppTenantCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCUserOrganizationAppTenantCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": TCUserOrganizationAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCUserOrganizationAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCUserOrganizationAppTenantCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "userList",
                Description: "User",
                Link: "TC/user-list",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": TCUserOrganizationAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCUserOrganizationAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCUserOrganizationAppTenantCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "userOrganizationAppTenant",
                Description: "User Organization App Tenant (" + TCUserOrganizationAppTenantCtrl.ePage.Masters.QueryString.DisplayName + ")" + " - " + TCUserOrganizationAppTenantCtrl.ePage.Masters.QueryString.MappingCode,
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
            TCUserOrganizationAppTenantCtrl.ePage.Masters.Application = {};
            TCUserOrganizationAppTenantCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            TCUserOrganizationAppTenantCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);

         if (!TCUserOrganizationAppTenantCtrl.ePage.Masters.Application.ActiveApplication) {
            TCUserOrganizationAppTenantCtrl.ePage.Masters.Application.ActiveApplication = {
                 "PK": TCUserOrganizationAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                 "AppCode": TCUserOrganizationAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                 "AppName": TCUserOrganizationAppTenantCtrl.ePage.Masters.QueryString.AppName
             };
         }

         GetUserOrganizationAppTenantList();
         }

        // ========================Application End======================== 

        
        function InitUserOrganizationAppTenant() {
            TCUserOrganizationAppTenantCtrl.ePage.Masters.UserOrganizationAppTenant = {};
            TCUserOrganizationAppTenantCtrl.ePage.Masters.UserOrganizationAppTenant.AddNewRow = AddNewRow;
            TCUserOrganizationAppTenantCtrl.ePage.Masters.UserOrganizationAppTenant.Save = SaveUserOrganizationAppTenant;
            TCUserOrganizationAppTenantCtrl.ePage.Masters.UserOrganizationAppTenant.Delete = DeleteConfirmation;
            TCUserOrganizationAppTenantCtrl.ePage.Masters.UserOrganizationAppTenant.GetOrganizationList = GetOrganizationList;
            TCUserOrganizationAppTenantCtrl.ePage.Masters.UserOrganizationAppTenant.OnBlurAutoCompleteOrganizationList = OnBlurAutoCompleteOrganizationList;
            TCUserOrganizationAppTenantCtrl.ePage.Masters.UserOrganizationAppTenant.OnSelectAutoCompleteOrganizationList = OnSelectAutoCompleteOrganizationList;
            TCUserOrganizationAppTenantCtrl.ePage.Masters.UserOrganizationAppTenant.GetSecRoleList = GetSecRoleList;
            TCUserOrganizationAppTenantCtrl.ePage.Masters.UserOrganizationAppTenant.OnBlurAutoCompleteRoleList = OnBlurAutoCompleteRoleList;
            TCUserOrganizationAppTenantCtrl.ePage.Masters.UserOrganizationAppTenant.OnSelectAutoCompleteRoleList = OnSelectAutoCompleteRoleList;





        }

        function GetUserOrganizationAppTenantList() {
            var _filter = {
                "SAP_FK": TCUserOrganizationAppTenantCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "Item_FK": TCUserOrganizationAppTenantCtrl.ePage.Masters.QueryString.ItemPk,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.UserOrganisation.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.UserOrganisation.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TCUserOrganizationAppTenantCtrl.ePage.Masters.UserOrganizationAppTenant.UserOrganizationAppTenantList = response.data.Response;
                    TCUserOrganizationAppTenantCtrl.ePage.Masters.UserOrganizationAppTenant.UserOrganizationAppTenantListCopy = angular.copy(response.data.Response);

                } else {
                    TCUserOrganizationAppTenantCtrl.ePage.Masters.UserOrganizationAppTenant.UserOrganizationAppTenantList = [];
                    console.log("Empty Response");
                }
            });
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

        
        function OnBlurAutoCompleteOrganizationList($event, row) {
            row.IsAccessCodeNoResults = false;
            row.IsAccessCodeLoading = false;
        }

        function OnSelectAutoCompleteOrganizationList($item, $model, $label, $event, row) {
            row.Access_FK = $item.PK;
            row.AccessCode = $item.Code;
        }

        function GetSecRoleList($viewValue) {
            if ($viewValue !== "#") {
                var _filter = {
                    "Autocompletefield": $viewValue
                };
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

        function OnBlurAutoCompleteRoleList($event, row) {
            row.IsSecRoleNoResults = false;
            row.IsSecRoleLoading = false;
        }

        function OnSelectAutoCompleteRoleList($item, $model, $label, $event, row) {
            row.Access_FK = $item.PK;
            row.AccessCode = $item.RoleName;
        }

        function AddNewRow() {
            var _obj = {};
            TCUserOrganizationAppTenantCtrl.ePage.Masters.UserOrganizationAppTenant.UserOrganizationAppTenantList.push(_obj);
        }

        function SaveUserOrganizationAppTenant(row) {
            var _input = angular.copy(row);
            _input.IsModified = true;
            _input.SAP_Code = TCUserOrganizationAppTenantCtrl.ePage.Masters.Application.ActiveApplication.AppCode;
            _input.SAP_FK = TCUserOrganizationAppTenantCtrl.ePage.Masters.Application.ActiveApplication.PK;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.TNT_FK = authService.getUserInfo().TenantPK;
            _input.Item_FK = TCUserOrganizationAppTenantCtrl.ePage.Masters.QueryString.ItemPk;
            _input.ItemCode = TCUserOrganizationAppTenantCtrl.ePage.Masters.QueryString.ItemCode;
            _input.ItemName = TCUserOrganizationAppTenantCtrl.ePage.Masters.QueryString.ItemName;
            _input.AccessCode = row.AccessCode;
            _input.AccessTo = "ORG";
            _input.Access_FK = row.Access_FK;
            _input.BasedOnCode = row.BasedOnCode;
            _input.BasedOn = "ROLE";
            _input.BasedOn_FK = row.BasedOn_FK;
            if (_input.PK) {
                apiService.post("authAPI", trustCenterConfig.Entities.API.UserOrganisation.API.Update.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        var _response = response.data.Response[0];
                        var _index = TCUserOrganizationAppTenantCtrl.ePage.Masters.UserOrganizationAppTenant.UserOrganizationAppTenantList.map(function (e) {
                            return e.PK;
                        }).indexOf(_response.PK);

                        if (_index !== -1) {
                            TCUserOrganizationAppTenantCtrl.ePage.Masters.UserOrganizationAppTenant.UserOrganizationAppTenantList[_index] = _response;
                        }
                        toastr.success("Saved Successfully...!");
                    } else {
                        toastr.error("Could not Save...!");
                    }
                });
            } else {
                apiService.post("authAPI", trustCenterConfig.Entities.API.UserOrganisation.API.Insert.Url, [_input]).then(function (response) {
                    if (response.data.Response) {
                        var _response = response.data.Response[0];
                        var _index = TCUserOrganizationAppTenantCtrl.ePage.Masters.UserOrganizationAppTenant.UserOrganizationAppTenantList.map(function (e) {
                            return e.PK;
                        }).indexOf(_response.PK);

                        if (_index !== -1) {
                            TCUserOrganizationAppTenantCtrl.ePage.Masters.UserOrganizationAppTenant.UserOrganizationAppTenantList[_index] = _response;
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
            apiService.get("authAPI", trustCenterConfig.Entities.API.UserOrganisation.API.Delete.Url + row.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = TCUserOrganizationAppTenantCtrl.ePage.Masters.UserOrganisation.UserOrganizationAppTenant.UserOrganizationAppTenantList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(row.PK);

                    if (_index !== -1) {
                        TCUserOrganizationAppTenantCtrl.ePage.Masters.UserOrganizationAppTenant.UserOrganizationAppTenantList.splice(_index, 1);
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }
            });
        }

        




    
        Init();
        }


})();