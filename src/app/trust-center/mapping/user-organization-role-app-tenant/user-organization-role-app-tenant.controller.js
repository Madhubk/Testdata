(function () {
    "use strict";


    angular
        .module("Application")
        .controller("TCUserOrganizationRoleAppTenantController", TCUserOrganizationRoleAppTenantController);

        TCUserOrganizationRoleAppTenantController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "trustCenterConfig"];

    function TCUserOrganizationRoleAppTenantController($scope, $location, $uibModal, authService, apiService, helperService, toastr, confirmation, trustCenterConfig) {
        var TCUserOrganizationRoleAppTenantCtrl = this;

        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCUserOrganizationRoleAppTenantCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_User_Organization_Role_App_Tenant",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.emptyText = "-";


            try {
                TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitApplication();
                    InitUserOrganizationRoleAppTenant();

                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.Breadcrumb = {};
            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "userList",
                Description: "User",
                Link: "TC/user-list",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "userOrganizationAppTenant",
                Description: "User Organization App Tenant (" + "USER_ORG_ROLE_APP_TNT" + ")" + " - " + TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.QueryString.DisplayName,
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
            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.Application = {};
            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);

            if (!TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication) {
                TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.QueryString.AppName
                };
            }

            GetUserOrganizationRoleAppTenantList();
        }

        // ========================Application End======================== 

        function InitUserOrganizationRoleAppTenant() {
            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant = {};
            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.AddNewRow = AddNewRow;
            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.Save = Save;
            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.Delete = DeleteConfirmation;
            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.GetOrganizationList = GetOrganizationList;
            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.OnBlurAutoCompleteOrganizationList = OnBlurAutoCompleteOrganizationList;
            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.OnSelectAutoCompleteOrganizationList = OnSelectAutoCompleteOrganizationList;
            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.GetSecRoleList = GetSecRoleList;
            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.OnBlurAutoCompleteRoleList = OnBlurAutoCompleteRoleList;
            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.OnSelectAutoCompleteRoleList = OnSelectAutoCompleteRoleList;
            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.CheckUIControl = CheckUIControl;

            if (TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.ActiveApplication == "EA") {
                OnApplicationChange();
            }

            GetUIControlList();
        }

        function GetUIControlList() {
            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.UIControlList = undefined;
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
                    TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.UIControlList = _controlList;
                } else {
                    TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.UIControlList = [];
                }
            });
        }

        function CheckUIControl(controlId) {
            return helperService.checkUIControl(TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.UIControlList, controlId);
        }

        function GetUserOrganizationRoleAppTenantList() {
            var _filter = {
                "SAP_FK": TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "Item_FK": TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.QueryString.ItemPk,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.UserOrganisationRole.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.UserOrganisationRole.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.UserOrganizationRoleAppTenantList = response.data.Response;
                    TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.UserOrganizationRoleAppTenantListCopy = angular.copy(response.data.Response);

                    TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.UserOrganizationRoleAppTenantList.map(function(value,key){
                        SetGenerateScriptInput(value)
                    })

                } else {
                    TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.UserOrganizationRoleAppTenantList = [];
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
            row.AccessTo = "ORG"
        }

        function GetSecRoleList($viewValue) {
            var _filter = {
                "UserName": TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.QueryString.ItemCode,
                "SAP_Code": TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            if ($viewValue !== "#") {
                _filter.Autocompletefield = $viewValue;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecMappings.API.GetRoleByUserApp.FilterID
            };

            return apiService.post("authAPI", trustCenterConfig.Entities.API.SecMappings.API.GetRoleByUserApp.Url, _input).then(function (response) {
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
            row.BasedOn_FK = $item.PK;
            row.BasedOnCode = $item.Code;
            row.BasedOn = "ROLE";
        }

        function AddNewRow() {
            var _obj = {};
            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.UserOrganizationRoleAppTenantList.push(_obj);
        }

        function SetGenerateScriptInput(row) {
            if (row) {
                row.GenerateScriptInput = {
                    ObjectName: "SECMAPPINGS",
                    ObjectId: row.PK
                };
                row.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            }
        }

        function Save(row) {
            if (row.PK) {
                UpdateUserOrganizationRoleAppTenant(row);
            } else {
                InsertUserOrganizationRoleAppTenant(row);
            }
        }

        function InsertUserOrganizationRoleAppTenant(row) {
            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.SaveBtnText = "Please Wait...";
            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.IsDisableSaveBtn = true;

            var _input = angular.copy(row);
            _input.Item_FK = TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.QueryString.ItemPk;
            _input.ItemCode = TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.QueryString.ItemCode;
            _input.ItemName = "USER";
            _input.AccessCode = row.AccessCode;
            _input.AccessTo = "ORG";
            _input.Access_FK = row.Access_FK;
            _input.BasedOnCode = row.BasedOnCode;
            _input.BasedOn = "ROLE";
            _input.BasedOn_FK = row.BasedOn_FK;
            _input.IsModified = true;
            _input.SAP_FK = TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication.PK;
            _input.SAP_Code = TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.Application.ActiveApplication.AppCode;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.TNT_FK = authService.getUserInfo().TenantPK;

            apiService.post("authAPI", trustCenterConfig.Entities.API.UserOrganisationRole.API.Insert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];

                        if(!TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.UserOrganizationAppTenantList){
                            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.UserOrganizationRoleAppTenantList = [];
                        }
                        var _index = TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.UserOrganizationRoleAppTenantList.map(function (value, key) {
                            return value.PK;
                        }).indexOf(_response.PK);

                        TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.UserOrganizationRoleAppTenantList.push(_response);

                        if (_index === -1) {
                            SetGenerateScriptInput(TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.UserOrganizationRoleAppTenantList[0]);
                        } else {
                            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.UserOrganizationRoleAppTenantList[_index] = _response;
                        }

                        GetUserOrganizationRoleAppTenantList(_response);
                    }
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Could not Save...!");
                }
            });
        }

        function UpdateUserOrganizationRoleAppTenant(row) {
            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.SaveBtnText = "Please Wait...";
            TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.IsDisableSaveBtn = true;

            var _input = angular.copy(row);
            _input.IsModified = true;

            apiService.post("authAPI", trustCenterConfig.Entities.API.UserOrganisationRole.API.Update.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;

                    var _index = TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.UserOrganizationRoleAppTenantList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.UserOrganizationRoleAppTenantList.push(_response);
                    } else {
                        TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.UserOrganizationRoleAppTenantList[_index] = _response;
                    }

                    GetUserOrganizationRoleAppTenantList(_response);
                    toastr.success("Updated Successfully...!");
                } else {
                    toastr.error("Could not Update...!");
                }
            });
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
            apiService.get("authAPI", trustCenterConfig.Entities.API.UserOrganisationRole.API.Delete.Url + row.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.UserOrganizationRoleAppTenantList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(row.PK);

                    if (_index !== -1) {
                        TCUserOrganizationRoleAppTenantCtrl.ePage.Masters.UserOrganizationRoleAppTenant.UserOrganizationRoleAppTenantList.splice(_index, 1);

                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                GetUserOrganizationRoleAppTenantList();
            });
        }

        Init();
    }
})();