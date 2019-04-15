(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationVisibility", OrganizationVisibility);

    function OrganizationVisibility() {
        let exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/visibility/organization-visibility.html",
            controller: "OrganizationVisibilityController",
            controllerAs: "OrganizationVisibilityCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("OrganizationVisibilityController", OrganizationVisibilityController);

    OrganizationVisibilityController.$inject = ["$rootScope", "authService", "apiService", "helperService", "organizationConfig", "toastr"];

    function OrganizationVisibilityController($rootScope, authService, apiService, helperService, organizationConfig, toastr) {
        let OrganizationVisibilityCtrl = this;

        $rootScope.UpdateVisibilityPage = PrepareTenantDetails;

        function Init() {
            let currentOrganization = OrganizationVisibilityCtrl.currentOrganization[OrganizationVisibilityCtrl.currentOrganization.code].ePage.Entities;

            OrganizationVisibilityCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Visibility",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization,
            };

            try {
                InitUser();
                InitTenant();
            } catch (ex) {
                console.log(ex);
            }
        }

        // =============== Tenant ==================
        function InitTenant() {
            OrganizationVisibilityCtrl.ePage.Masters.Tenant = {
                ActiveTenant: {},
                Modal: {}
            };

            OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = false;
            OrganizationVisibilityCtrl.ePage.Masters.Tenant.SaveBtnText = "Create";

            OrganizationVisibilityCtrl.ePage.Masters.Tenant.Save = Validate;

            PrepareTenantDetails();
        }

        function PrepareTenantDetails() {
            if (OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgHeader.ProxyTenant_FK) {
                OrganizationVisibilityCtrl.ePage.Masters.Tenant.Modal.TenantCode = OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgHeader.ProxyTenant_Code.substring(0, 5);
                OrganizationVisibilityCtrl.ePage.Masters.Tenant.Modal.TenantName = OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgHeader.FullName;

                OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.PK = OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgHeader.ProxyTenant_FK;
                OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.TenantCode = OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgHeader.ProxyTenant_Code;

                OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsTenantViewMode = true;
            } else {
                OrganizationVisibilityCtrl.ePage.Masters.Tenant.Modal.TenantCode = OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgHeader.Code.substring(0, 5);
                OrganizationVisibilityCtrl.ePage.Masters.Tenant.Modal.TenantName = OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgHeader.FullName;

                OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsTenantViewMode = false;
            }

            PrepareUserList();
        }

        function Validate() {
            OrganizationVisibilityCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            OrganizationVisibilityCtrl.ePage.Masters.IsDisableSave = true;

            let _validationObj = {
                Code: OrganizationVisibilityCtrl.currentOrganization.code,
                GetListAPI: "Validation",
                FilterInput: {
                    ModuleCode: "ORG"
                },
                GroupCode: "ORG_VISIBILITY",
                Entity: OrganizationVisibilityCtrl.ePage.Masters.Tenant.Modal,
                ValidateAPI: "Group",
                ErrorCode: []
            };

            OrganizationVisibilityCtrl.ePage.Entities.GetValidationList(_validationObj).then(response => {
                let _errorCount = response;

                if (_errorCount > 0) {
                    OrganizationVisibilityCtrl.ePage.Masters.SaveButtonText = "Save";
                    OrganizationVisibilityCtrl.ePage.Masters.IsDisableSave = false;

                    toastr.warning("Fill all mandatory fields...!");
                } else {
                    SaveTenant();
                }
            });
        }

        function SaveTenant() {
            OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = true;
            OrganizationVisibilityCtrl.ePage.Masters.Tenant.SaveBtnText = "Please Wait...";

            let _input = OrganizationVisibilityCtrl.ePage.Masters.Tenant.Modal;
            _input.TenantCode = _input.TenantCode.replace(/\s/g, '').substring(0, 5);
            _input.BaseTenantCode = "TBASE";
            _input.IsModified = true;

            apiService.post("authAPI", organizationConfig.Entities.API.SecTenant.API.Insert.Url, [_input]).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant = response.data.Response[0];

                    UpdateOrgHeader();
                    AppTenantMapping();
                } else {
                    toastr.error("Could not create...!");
                    OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = false;
                    OrganizationVisibilityCtrl.ePage.Masters.Tenant.SaveBtnText = "Create";
                }
            });
        }

        function AppTenantMapping() {
            let _input = {
                ItemCode: authService.getUserInfo().AppCode,
                Item_FK: authService.getUserInfo().AppPK,
                ItemName: "APP",
                SAP_Code: authService.getUserInfo().AppCode,
                SAP_FK: authService.getUserInfo().AppPK,
                TenantCode: OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.TenantCode,
                TNT_FK: OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.PK,
                IsModified: true
            };

            apiService.post("authAPI", organizationConfig.Entities.API.SecAppSecTenant.API.Insert.Url, [_input]).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    CopyBaseTenantAccessToTenant();
                } else {
                    toastr.error("Could not Create...!");
                    OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = false;
                    OrganizationVisibilityCtrl.ePage.Masters.Tenant.SaveBtnText = "Create";
                }
            });
        }

        function CopyBaseTenantAccessToTenant() {
            let _input = {
                AppCode: authService.getUserInfo().AppCode,
                FromTenant: "TBASE",
                ToTenant: OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.TenantCode
            };

            apiService.post("authAPI", organizationConfig.Entities.API.SecTenant.API.CopyBaseTenantBehavior.Url, _input).then(response => {
                if (!response.data.Response) {
                    console.log("Could not Copy Base Tenant Behaviour...!")
                }

                OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = false;
                OrganizationVisibilityCtrl.ePage.Masters.Tenant.SaveBtnText = "Create";
            });
        }

        function UpdateOrgHeader() {
            let _input = OrganizationVisibilityCtrl.ePage.Entities.Header.Data;
            _input.OrgHeader.ProxyTenant_FK = OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.PK;
            _input.OrgHeader.ProxyTenant_Code = OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.TenantCode;
            _input.OrgHeader.IsModified = true;

            apiService.post("eAxisAPI", OrganizationVisibilityCtrl.ePage.Entities.Header.API.UpdateOrganization.Url, _input).then(response => {
                if (response.data.Response) {
                    OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgHeader = response.data.Response.OrgHeader;

                    OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsTenantViewMode = true;
                }

                OrganizationVisibilityCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = false;
                OrganizationVisibilityCtrl.ePage.Masters.Tenant.SaveBtnText = "Create";
            });
        }

        // =============== User ==================
        function InitUser() {
            OrganizationVisibilityCtrl.ePage.Masters.User = {};
            OrganizationVisibilityCtrl.ePage.Masters.User.UserList = [];

            OrganizationVisibilityCtrl.ePage.Masters.User.Save = SaveUser;

            GetRoleList();
        }

        function PrepareUserList() {
            OrganizationVisibilityCtrl.ePage.Masters.User.UserList = angular.copy(OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgContact);

            OrganizationVisibilityCtrl.ePage.Masters.User.UserList.map(value => {
                if (value.USER_FK) {
                    value.IsUserViewMode = true;
                } else {
                    value.IsUserViewMode = false;
                    value.UserName = value.Email;
                }

                value.IsSaveBtnClick = false;
            });
        }

        function GetRoleList() {
            OrganizationVisibilityCtrl.ePage.Masters.User.RoleList = undefined;
            let _filter = {
                "SAP_FK": authService.getUserInfo().AppPK
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.SecRole.API.FindAll.FilterID
            };

            apiService.post("authAPI", organizationConfig.Entities.API.SecRole.API.FindAll.Url, _input).then(response => {
                if (response.data.Response) {
                    OrganizationVisibilityCtrl.ePage.Masters.User.RoleList = response.data.Response;
                } else {
                    OrganizationVisibilityCtrl.ePage.Masters.User.RoleList = [];
                }
            });
        }

        function SaveUser($item) {
            if ($item.UserName) {
                $item.IsSaveBtnClick = true;
                let _input = {
                    "FirstName": $item.ContactName,
                    "DisplayName": $item.ContactName,
                    "UserName": $item.UserName,
                    "Password": "Cube@123",
                    "Email": $item.Email,
                    "UserType": "Regular",
                    "TenantCode": OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.TenantCode,
                    "IsModified": true
                };

                apiService.post("authAPI", organizationConfig.Entities.API.UserExtended.API.Insert.Url, _input).then(response => {
                    if (response.data.Response) {
                        $item.USER_FK = response.data.Response.Id;
                        UserRoleMapping($item);
                    } else {
                        $item.IsSaveBtnClick = false;
                    }
                });
            }
        }

        function UserRoleMapping(user) {
            let _input = {
                "AccessCode": user.AccessCode,
                "AccessTo": "ROLE",
                "Access_FK": user.Access_FK,
                "ItemCode": user.UserName,
                "ItemName": "USER",
                "Item_FK": user.USER_FK,
                "SAP_FK": authService.getUserInfo().AppPK,
                "SAP_Code": authService.getUserInfo().AppCode,
                "TNT_FK": OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.PK,
                "TenantCode": OrganizationVisibilityCtrl.ePage.Masters.Tenant.ActiveTenant.TenantCode,
                "IsModified": true
            };

            apiService.post("authAPI", organizationConfig.Entities.API.UserRole.API.Insert.Url, [_input]).then(response => {
                if (response.data.Response) {
                    UpdateOrgContact(user);
                } else {
                    user.IsSaveBtnClick = false;
                    toastr.error("Could not Insert...!");
                }
            });
        }

        function UpdateOrgContact(user) {
            user.IsModified = true;
            if (user.PK) {
                let _index = OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgContact.findIndex(value => value.PK === user.PK);

                if (_index !== -1) {
                    OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgContact[_index] = user;
                }
            } else {
                OrganizationVisibilityCtrl.ePage.Entities.Header.Data.OrgContact.push(user);
            }

            let _input = OrganizationVisibilityCtrl.ePage.Entities.Header.Data;

            apiService.post("eAxisAPI", OrganizationVisibilityCtrl.ePage.Entities.Header.API.UpdateOrganization.Url, _input).then(response => {
                if (response.data.Response) {
                    PrepareUserList();
                }
                user.IsSaveBtnClick = false;
            });
        }

        Init();
    }
})();
